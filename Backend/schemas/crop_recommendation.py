from pydantic import BaseModel, Field
import re
from typing import List, Optional
from enum import Enum

class ClimateZone(str, Enum):
    hill_country = "hill_country"
    coastal = "coastal" 
    dry_zone = "dry_zone"
    wet_zone = "wet_zone"
    northern = "northern"

class ExperienceLevel(str, Enum):
    Beginner = "Beginner"
    Intermediate = "Intermediate"
    Advanced = "Advanced"

class BudgetLevel(str, Enum):
    Low = "Low"
    Medium = "Medium"
    High = "High"

class FarmingSetup(str, Enum):
    Backyard = "Backyard"
    Container = "Container"
    Rooftop = "Rooftop"
    Small_Plot = "Small_Plot"
    Greenhouse = "Greenhouse"

class SoilType(str, Enum):
    Red_Earth = "Red_Earth"
    Laterite = "Laterite"
    Clay = "Clay"
    Sandy = "Sandy"
    Alluvial = "Alluvial"
    Loamy = "Loamy"

class Season(str, Enum):
    Maha = "Maha"
    Yala = "Yala"

class CropTypePreference(str, Enum):
    Vegetables = "Vegetables"
    Fruits = "Fruits"
    Herbs = "Herbs"
    Cash_Crops = "Cash_Crops"
    Leafy_Greens = "Leafy_Greens"
    Ayurvedic_Plants = "Ayurvedic_Plants"

class WaterAccess(str, Enum):
    Yes = "Yes"
    No = "No"

class CropPredictionRequest(BaseModel):
    district: str = Field(..., description="District name in Sri Lanka")
    climate_zone: ClimateZone = Field(..., description="Climate zone of the area")
    experience_level: ExperienceLevel = Field(..., description="Farmer's experience level")
    budget_level: BudgetLevel = Field(..., description="Available budget level")
    farming_setup: FarmingSetup = Field(..., description="Type of farming setup")
    soil_type: SoilType = Field(..., description="Soil type available")
    season: Season = Field(..., description="Planting season")
    crop_type_preference: CropTypePreference = Field(..., description="Preferred crop type")
    water_access: WaterAccess = Field(..., description="Water access availability")

class CropRecommendation(BaseModel):
    crop_name: str
    predicted_score: float
    rank: int
    success_probability: float
    estimated_roi: float
    space_required_sqm: float
    growth_duration_days: int
    difficulty_level: int
    market_demand: int
    market_price_per_kg: float
    water_requirement: str
    market_conditions: float
    alternative_crops: List[str]

class PredictionResponse(BaseModel):
    success: bool
    message: str
    recommendations: List[CropRecommendation]
    total_recommendations: int
    request_details: CropPredictionRequest