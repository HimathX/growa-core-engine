from pydantic import BaseModel, Field
import re
from typing import List, Optional
from enum import Enum
from datetime import date, timedelta
from pydantic import validator

class ExperienceLevel(str, Enum):
    Beginner = "Beginner"
    Intermediate = "Intermediate"
    Advanced = "Advanced"

class CropType(str, Enum):
    VANILLA = "Vanilla"
    SAFFRON = "Saffron"
    BLACK_PEPPER = "Black Pepper"
    CARDAMOM = "Cardamom"
    DRAGON_FRUIT = "Dragon Fruit"
    AVOCADO = "Avocado"
    STRAWBERRY = "Strawberry"
    PASSION_FRUIT = "Passion Fruit"
    TURMERIC = "Turmeric"
    GINGER = "Ginger"
    CHILI = "Chili"
    ALOE_VERA = "Aloe Vera"
    POMEGRANATE = "Pomegranate"
    LIME = "Lime"
    LEMON = "Lemon"
    TOMATO = "Tomato"
    CAPSICUM = "Capsicum"
    EGGPLANT = "Eggplant"
    CUCUMBER = "Cucumber"
    GREEN_BEANS = "Green Beans"
    OKRA = "Okra"
    PAPAYA = "Papaya"
    BANANA = "Banana"
    CURRY_LEAVES = "Curry Leaves"
    BASIL = "Basil"
    MINT = "Mint"
    LEMONGRASS = "Lemongrass"
    CORIANDER = "Coriander"
    PARSLEY = "Parsley"
    GUAVA = "Guava"
    CABBAGE = "Cabbage"
    CAULIFLOWER = "Cauliflower"
    CARROT = "Carrot"
    ONION = "Onion"
    BEETS = "Beets"
    SPINACH = "Spinach"
    LETTUCE = "Lettuce"
    KALE = "Kale"
    GOTUKOLA = "Gotukola"
    MUKUNUWENNA = "Mukunuwenna"
    KANKUN = "Kankun"
    SARANA = "Sarana"
    RADISH = "Radish"
    MANGO = "Mango"
    JACKFRUIT = "Jackfruit"
    RAMBUTAN = "Rambutan"
    MANGOSTEEN = "Mangosteen"
    WOOD_APPLE = "Wood Apple"
    TAMARIND = "Tamarind"
    MORINGA = "Moringa"
    NEEM = "Neem"
    BRAHMI = "Brahmi"
    ASHWAGANDHA = "Ashwagandha"
    CHERRY_TOMATO = "Cherry Tomato"
    BABY_CORN = "Baby Corn"
    BROCCOLI = "Broccoli"
    ZUCCHINI = "Zucchini"
    BELL_PEPPER = "Bell Pepper"

class District(str, Enum):
    AMPARA = "Ampara"
    ANURADHAPURA = "Anuradhapura"
    BADULLA = "Badulla"
    BATTICALOA = "Batticaloa"
    COLOMBO = "Colombo"
    GALLE = "Galle"
    GAMPAHA = "Gampaha"
    HAMBANTOTA = "Hambantota"
    JAFFNA = "Jaffna"
    KALUTARA = "Kalutara"
    KANDY = "Kandy"
    KEGALLE = "Kegalle"
    KILINOCHCHI = "Kilinochchi"
    KURUNEGALA = "Kurunegala"
    MANNAR = "Mannar"
    MATALE = "Matale"
    MATARA = "Matara"
    MONARAGALA = "Monaragala"
    MULLAITIVU = "Mullaitivu"
    NUWARA_ELIYA = "Nuwara Eliya"
    POLONNARUWA = "Polonnaruwa"
    PUTTALAM = "Puttalam"
    RATNAPURA = "Ratnapura"
    TRINCOMALEE = "Trincomalee"
    VAVUNIYA = "Vavuniya"

class SoilType(str, Enum):
    RED_EARTH = "Red_Earth"
    LATERITE = "Laterite"
    CLAY = "Clay"
    SANDY = "Sandy"
    ALLUVIAL = "Alluvial"
    LOAMY = "Loamy"

class WaterSource(str, Enum):
    RAIN_FED = "Rain-fed"
    IRRIGATED = "Irrigated"
    DRIP_SYSTEM = "Drip system"

class SeasonType(str, Enum):
    YALA = "Yala"
    MAHA = "Maha"
    YEAR_ROUND = "Year-round"

class InvestmentLevel(str, Enum):
    LOW = "Low"
    MEDIUM = "Medium"
    HIGH = "High"

class AreaUnit(str, Enum):
    SQUARE_METERS = "square_meters"

# Request Model
class YieldPredictionRequest(BaseModel):
    # Essential Inputs
    crop_type: CropType = Field(..., description="Type of crop to predict yield for")
    farm_area: float = Field(..., gt=0, description="Farm area size")
    area_unit: AreaUnit = Field(default=AreaUnit.SQUARE_METERS, description="Unit for farm area")
    location: District = Field(..., description="District location in Sri Lanka")
    planting_date: date = Field(..., description="Date when crop was/will be planted")
    farming_experience: ExperienceLevel = Field(..., description="Farmer's experience level")
    
    # Nice-to-Have Inputs
    water_source: Optional[WaterSource] = Field(None, description="Water source type")
    investment_level: Optional[InvestmentLevel] = Field(None, description="Investment/budget level")
    
    @validator('planting_date')
    def validate_planting_date(cls, v):
        # Allow dates up to 1 year in the future and 2 years in the past
        today = date.today()
        min_date = today - timedelta(days=730)  # 2 years ago
        max_date = today + timedelta(days=365)  # 1 year ahead
        
        if v < min_date or v > max_date:
            raise ValueError('Planting date must be within 2 years past to 1 year future')
        return v

# Response Models
class YieldPredictionResponse(BaseModel):
    # Primary Results
    expected_yield_kg: str = Field(description="Expected total yield in kg")
    yield_per_m2: str = Field(description="Yield per square meter")
    harvest_window: str = Field(description="Expected harvest period")
    confidence_percentage: int = Field(description="Prediction confidence (0-100)")
    estimated_revenue_lkr: str = Field(description="Estimated revenue in Sri Lankan Rupees")
    
    # Additional Info
    season_type: SeasonType = Field(description="Determined season type")
    days_to_harvest: int = Field(description="Approximate days until harvest")
    recommendations: List[str] = Field(description="Farming recommendations")