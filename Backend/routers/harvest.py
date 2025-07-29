from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from datetime import date, timedelta
import json
import os
from typing import Dict, Any
from schemas import (
    CropType, SoilType, ExperienceLevel, BudgetLevel, WaterSource, AreaUnit,
    YieldPredictionRequest, YieldPredictionResponse, SeasonType, District, InvestmentLevel
)
from utils.harvest_utils import (
    determine_season, calculate_enhanced_multipliers, get_ai_enhanced_recommendations
)
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

router = APIRouter(tags=["Harvest Prediction"])

# Load crop database
def load_crop_database() -> Dict[str, Any]:
    try:
        crop_db_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs", "crop_database")
        with open(crop_db_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error loading crop database: {e}")
        return {}

CROP_DATABASE = load_crop_database()

def convert_area_to_m2(area: float, unit: AreaUnit) -> float:
    """Convert area to square meters"""
    if unit == AreaUnit.SQUARE_METERS:
        return area
    # Add other unit conversions if needed
    return area

def convert_m2_to_acres(area_m2: float) -> float:
    """Convert square meters to acres"""
    return area_m2 * 0.000247105  # 1 m² = 0.000247105 acres

@router.post("/predict-yield", response_model=YieldPredictionResponse)
async def predict_yield(request: YieldPredictionRequest):
    """
    Enhanced crop yield prediction with AI-powered soil analysis and recommendations
    """
    try:
        # Get crop data
        crop_key = request.crop_type.value.upper().replace(" ", "_")
        if crop_key not in CROP_DATABASE:
            raise HTTPException(status_code=400, detail=f"Crop type '{request.crop_type.value}' not supported")
        
        crop_data = CROP_DATABASE[crop_key]
        
        # Determine season
        season = determine_season(request.planting_date)
        
        # Convert area to square meters
        area_m2 = convert_area_to_m2(request.farm_area, request.area_unit)
        area_acres = convert_m2_to_acres(area_m2)
        
        # Calculate enhanced multipliers with AI soil prediction
        multipliers, predicted_soil = await calculate_enhanced_multipliers(request, season, crop_data)
        
        # Calculate base yield with enhanced logic
        base_yield_per_m2 = crop_data.get("base_yield_per_m2", 2.0)  # Default fallback
        
        # Apply all multipliers
        total_multiplier = 1.0
        for factor, value in multipliers.items():
            total_multiplier *= value
        
        # Calculate expected yields (single values)
        expected_yield_per_m2 = base_yield_per_m2 * total_multiplier
        expected_total_yield = expected_yield_per_m2 * area_m2
        
        # Calculate revenue
        price_per_kg = crop_data.get("price_per_kg", 200)  # Default fallback
        expected_revenue = expected_total_yield * price_per_kg
        
        # Calculate harvest date
        days_to_harvest = crop_data.get("days_to_harvest", 90)  # Default fallback
        harvest_start = request.planting_date + timedelta(days=days_to_harvest)
        harvest_end = harvest_start + timedelta(days=15)  # 15-day harvest window
        
        # Enhanced confidence calculation
        confidence = 70  # Base confidence
        if request.water_source:
            confidence += 10
        if request.investment_level:
            confidence += 8
        
        # Adjust confidence based on multipliers
        avg_multiplier = sum(multipliers.values()) / len(multipliers)
        if avg_multiplier > 0.9:
            confidence += 5
        if avg_multiplier > 1.0:
            confidence += 5
        
        confidence = min(confidence, 95)  # Cap at 95%
        
        # Generate AI-enhanced recommendations
        recommendations = await get_ai_enhanced_recommendations(
            crop_type=request.crop_type.value,
            season=season.value,
            location=request.location.value,
            multipliers=multipliers,
            predicted_soil=predicted_soil,
            experience_level=request.farming_experience.value,
            water_source=request.water_source.value if request.water_source else None,
            investment_level=request.investment_level.value if request.investment_level else None
        )
        
        # Calculate days until harvest
        today = date.today()
        days_until_harvest = (harvest_start - today).days
        
        return YieldPredictionResponse(
            expected_yield_kg=f"{expected_total_yield:.1f} kg",
            yield_per_m2=f"{expected_yield_per_m2:.2f} kg/m²",
            harvest_window=f"{harvest_start.strftime('%B %d')}-{harvest_end.strftime('%d, %Y')}",
            confidence_percentage=confidence,
            estimated_revenue_lkr=f"Rs. {expected_revenue:,.0f}",
            season_type=season,
            days_to_harvest=days_until_harvest,
            recommendations=recommendations
        )
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enhanced prediction error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Enhanced prediction error: {str(e)}")





