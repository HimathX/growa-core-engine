from datetime import datetime, date
from typing import List, Optional
import json
import os
from schemas import SeasonType, SoilType, District, YieldPredictionRequest, ExperienceLevel, WaterSource, InvestmentLevel

# Mock model for AI functionality - replace with actual implementation
class MockModel:
    def generate_content(self, prompt: str):
        class MockResponse:
            text = "LOAMY"
        return MockResponse()

model = MockModel()

# Load district climate zones mapping
def load_climate_zones():
    try:
        climate_zones_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "docs", "climate_zones")
        with open(climate_zones_path, 'r') as f:
            return json.load(f)
    except Exception as e:
        print(f"Error loading climate zones: {e}")
        return {}

DISTRICT_CLIMATE_ZONES = load_climate_zones()


def determine_season(planting_date: date) -> SeasonType:
    """Determine season based on planting date"""
    month = planting_date.month
    if 4 <= month <= 9:
        return SeasonType.YALA
    elif month in [10, 11, 12, 1, 2, 3]:
        return SeasonType.MAHA
    else:
        return SeasonType.YEAR_ROUND

async def get_soil_type_from_ai(location: District, crop_type: str) -> SoilType:
    """Get most suitable soil type for crop and location using AI"""
    prompt = f"""
    What is the most common and suitable soil type for growing {crop_type} in {location.value}, Sri Lanka?
    
    Choose from these soil types:
    - Red_Earth: Rich in iron, well-draining, common in hill country
    - Laterite: Hard, red soil with good drainage, found in wet zones
    - Clay: Heavy, water-retaining soil, good for water-loving crops
    - Sandy: Light, well-draining, suitable for drought-resistant crops
    - Alluvial: Rich, fertile soil from river deposits
    - Loamy: Balanced soil with good drainage and nutrients
    
    Respond with only the soil type name exactly as listed above.
    """
    
    try:
        response = model.generate_content(prompt)
        soil_name = response.text.strip().replace(" ", "_").upper()
        
        # Map response to enum
        soil_mapping = {
            "RED_EARTH": "Red_Earth",
            "LATERITE": "Laterite", 
            "CLAY": "Clay",
            "SANDY": "Sandy",
            "ALLUVIAL": "Alluvial",
            "LOAMY": "Loamy"
        }
        
        soil_value = soil_mapping.get(soil_name, "Loamy")
        return SoilType(soil_value)
    except:
        return SoilType("Loamy")  # Default fallback

def calculate_soil_compatibility(crop_data: dict, predicted_soil: SoilType) -> float:
    """Calculate soil compatibility score"""
    preferred_soils = crop_data.get("preferred_soils", ["LOAMY"])
    
    if predicted_soil.value in preferred_soils:
        return 1.0  # Perfect match
    else:
        # Partial compatibility based on soil characteristics
        compatibility_matrix = {
            ("LOAMY", "RED_EARTH"): 0.9,
            ("LOAMY", "ALLUVIAL"): 0.9,
            ("RED_EARTH", "LATERITE"): 0.8,
            ("SANDY", "LATERITE"): 0.8,
            ("CLAY", "ALLUVIAL"): 0.8,
        }
        
        for preferred in preferred_soils:
            score = compatibility_matrix.get((preferred, predicted_soil.value), 0.6)
            if score > 0.6:
                return score
            score = compatibility_matrix.get((preferred, predicted_soil.value), 0.6)
            if score > 0.6:
                return score
        
        return 0.6  # Minimum compatibility

def calculate_climate_compatibility(crop_data: dict, location: District) -> float:
    """Calculate climate zone compatibility"""
    crop_climate_zones = crop_data.get("climate_zones", ["coastal"])
    location_climate = DISTRICT_CLIMATE_ZONES.get(location.value, "coastal")
    
    if location_climate in crop_climate_zones:
        return 1.0
    else:
        # Partial compatibility for nearby zones
        climate_compatibility = {
            ("hill_country", "wet_zone"): 0.8,
            ("wet_zone", "coastal"): 0.8,
            ("coastal", "dry_zone"): 0.7,
            ("dry_zone", "coastal"): 0.7
        }
        
        for crop_zone in crop_climate_zones:
            score = climate_compatibility.get((crop_zone, location_climate), 0.5)
            if score > 0.5:
                return score
            score = climate_compatibility.get((crop_zone, location_climate), 0.5)
            if score > 0.5:
                return score
        
        return 0.5

async def calculate_enhanced_multipliers(request: YieldPredictionRequest, season: SeasonType, crop_data: dict) -> tuple[dict, SoilType]:
    """Calculate enhanced multipliers using multiple factors"""
    
    # Get AI-predicted soil type
    predicted_soil = await get_soil_type_from_ai(request.location, request.crop_type.value)
    
    multipliers = {
        "experience": 1.0,
        "water": 1.0,
        "season": 1.0,
        "investment": 1.0,
        "soil_compatibility": 1.0,
        "climate_compatibility": 1.0,
        "water_requirement_match": 1.0
    }
    
    # Experience multiplier (enhanced)
    experience_factors = {
        "Beginner": 0.65,
        "Intermediate": 0.85,
        "Advanced": 1.15
    }
    multipliers["experience"] = experience_factors[request.farming_experience.value]
    
    # Water source multiplier (enhanced based on crop water requirements)
    water_requirement = crop_data.get("water_requirement", "medium")
    if request.water_source:
        water_factors = {
            "Rain-fed": {"low": 0.9, "medium": 0.7, "high": 0.5},
            "Irrigated": {"low": 1.0, "medium": 1.0, "high": 0.9},
            "Drip system": {"low": 1.1, "medium": 1.2, "high": 1.3}
        }
        multipliers["water"] = water_factors[request.water_source.value][water_requirement]
        multipliers["water_requirement_match"] = water_factors[request.water_source.value][water_requirement]
    
    # Investment level multiplier (enhanced)
    if request.investment_level:
        investment_factors = {
            "Low": 0.75,
            "Medium": 1.0,
            "High": 1.25
        }
        multipliers["investment"] = investment_factors[request.investment_level.value]
    
    # Soil compatibility
    multipliers["soil_compatibility"] = calculate_soil_compatibility(crop_data, predicted_soil)
    
    # Climate compatibility
    multipliers["climate_compatibility"] = calculate_climate_compatibility(crop_data, request.location)
    
    # Season compatibility (enhanced)
    season_crop_compatibility = {
        "Yala": {
            "dry_tolerant": 1.1,
            "heat_loving": 1.2,
            "water_sensitive": 0.8
        },
        "Maha": {
            "water_loving": 1.2,
            "cool_weather": 1.1,
            "heat_sensitive": 1.1
        }
    }
    
    # Simplified season factor
    if season.value == "Yala" and water_requirement == "low":
        multipliers["season"] = 1.1
    elif season.value == "Maha" and water_requirement == "high":
        multipliers["season"] = 1.1
    else:
        multipliers["season"] = 0.95
    
    return multipliers, predicted_soil

async def get_ai_enhanced_recommendations(
    crop_type: str,
    season: str,
    location: str,
    multipliers: dict,
    predicted_soil: SoilType,
    experience_level: str,
    water_source: Optional[str] = None,
    investment_level: Optional[str] = None
) -> List[str]:
    """Get comprehensive AI-generated recommendations"""
    
    # Identify limiting factors
    limiting_factors = []
    for factor, value in multipliers.items():
        if value < 0.8:
            limiting_factors.append(f"{factor}: {value:.2f}")
    
    prompt = f"""
    Provide exactly 5 specific, actionable recommendations for growing {crop_type} in {location}, Sri Lanka.
    Consider these conditions:
    - Season: {season}
    - Soil Type: {predicted_soil.value}
    - Farmer Experience: {experience_level}
    - Water Source: {water_source if water_source else 'Not specified'}
    - Investment Level: {investment_level if investment_level else 'Not specified'}
    
    Limiting factors to address: {', '.join(limiting_factors) if limiting_factors else 'None'}
    
    Format: Provide exactly 5 short, specific recommendations.
    Each recommendation should be practical and under 100 characters.
    Do not include numbers or bullets in the response.
    """
    
    try:
        response = model.generate_content(prompt)
        recommendations = [
            rec.strip() for rec in response.text.split('\n') 
            if rec.strip() and len(rec.strip()) > 20 and not rec.strip().startswith(('•', '-', '>', '*', '1.', '2.', '3.', '4.', '5.'))
        ]
        
        # Ensure we have recommendations
        if not recommendations or len(recommendations) < 2:
            raise Exception("Failed to generate valid recommendations")
            
        # Add intro line and ensure we have 5 total recommendations
        final_recommendations = [
            f"Recommendations for growing {crop_type} in {location}:"
        ]
        final_recommendations.extend(recommendations[:4])  # Add up to 4 AI recommendations
        
        # Fill remaining slots with fallback recommendations if needed
        while len(final_recommendations) < 5:
            final_recommendations.append(
                f"Implement proper {predicted_soil.value.lower()} soil management practices"
            )
            
        return final_recommendations

    except Exception as e:
        print(f"AI recommendation error: {e}")
        # Enhanced fallback recommendations
        return [
            f"Recommendations for growing {crop_type} in {location}:",
            f"Monitor {predicted_soil.value.lower()} soil moisture levels regularly",
            f"Follow {season} season best practices",
            "Implement integrated pest management strategies",
            "Consider soil testing for precise nutrient management"
        ]
