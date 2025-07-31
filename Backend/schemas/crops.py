from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field
from datetime import datetime, date
from bson import ObjectId
from .harvest import CropType, District
from .tasks import TaskMilestone
from enum import Enum

def validate_object_id(v):
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, str):
        if ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId string")
    raise ValueError("ObjectId must be a valid ObjectId or string")

class CropCategory(str, Enum):
    # Fruit Crops
    VANILLA = "VANILLA"
    SAFFRON = "SAFFRON"
    BLACK_PEPPER = "BLACK_PEPPER"
    CARDAMOM = "CARDAMOM"
    DRAGON_FRUIT = "DRAGON_FRUIT"
    AVOCADO = "AVOCADO"
    PASSION_FRUIT = "PASSION_FRUIT"
    WOOD_APPLE = "WOOD_APPLE"
    STRAWBERRY = "STRAWBERRY"
    PAPAYA = "PAPAYA"
    BANANA = "BANANA"
    LIME = "LIME"
    LEMON = "LEMON"
    POMEGRANATE = "POMEGRANATE"
    MANGOSTEEN = "MANGOSTEEN"
    GUAVA = "GUAVA"
    MANGO = "MANGO"
    BREADFRUIT = "BREADFRUIT"
    JACKFRUIT = "JACKFRUIT"

    # Vegetable Crops
    TOMATO = "TOMATO"
    CHERRY_TOMATO = "CHERRY_TOMATO"
    CAPSICUM = "CAPSICUM"
    BELL_PEPPER = "BELL_PEPPER"
    EGGPLANT = "EGGPLANT"
    CUCUMBER = "CUCUMBER"
    GREEN_BEANS = "GREEN_BEANS"
    OKRA = "OKRA"
    CHILI = "CHILI"
    CABBAGE = "CABBAGE"
    CAULIFLOWER = "CAULIFLOWER"
    CARROT = "CARROT"
    ONION = "ONION"
    BEETS = "BEETS"
    RADISH = "RADISH"
    BABY_CORN = "BABY_CORN"
    BROCCOLI = "BROCCOLI"
    ZUCCHINI = "ZUCCHINI"
    BITTER_GOURD = "BITTER_GOURD"
    BOTTLE_GOURD = "BOTTLE_GOURD"

    # Root/Herb Crops
    TURMERIC = "TURMERIC"
    GINGER = "GINGER"
    BASIL = "BASIL"
    MINT = "MINT"
    CORIANDER = "CORIANDER"
    PARSLEY = "PARSLEY"
    LEMONGRASS = "LEMONGRASS"
    FENNEL = "FENNEL"
    FENUGREEK = "FENUGREEK"
    DILL = "DILL"

    # Leafy Greens
    SPINACH = "SPINACH"
    LETTUCE = "LETTUCE"
    KALE = "KALE"
    GOTUKOLA = "GOTUKOLA"
    MUKUNUWENNA = "MUKUNUWENNA"
    KANKUN = "KANKUN"

    # Medicinal/Herbal Plants
    ALOE_VERA = "ALOE_VERA"
    CURLY_LEAVES = "CURLY_LEAVES"  # Curry Leaves
    MORINGA = "MORINGA"
    NEEM = "NEEM"
    BRAHMI = "BRAHMI"
    ASHWAGANDHA = "ASHWAGANDHA"
    SARANA = "SARANA"

    # Mushrooms
    OYSTER_MUSHROOM = "OYSTER_MUSHROOM"
    SHIITAKE = "SHIITAKE"

    # Spices
    CINNAMON = "CINNAMON"

class CreateCropRequest(BaseModel):
    name: str = Field(..., min_length=2, max_length=100, description="Name of the field/crop area")
    crop_category: CropCategory = Field(..., description="Type of crop to plant")
    planting_date: date = Field(..., description="Date when the crop was/will be planted")
    plant_count: int = Field(..., gt=0, description="Number of plants")
    size: float = Field(..., gt=0, description="Size of the field in acres/hectares")
    location: District = Field(..., description="District where crop is located")
    area_size: float = Field(..., gt=0, description="Area size in square meters")
    user_id: str = Field(..., description="ID of the user creating the crop")

class CropCreationResponse(BaseModel):
    success: bool
    message: str
    crop: Dict[str, Any]  # Changed from CreateCropRequest to Dict to match response format
    milestones_created: int
    initial_progress: float
    current_phase: str
    estimated_harvest_date: Optional[date]
    upcoming_tasks: List[Dict[str, Any]]
    summary: Dict[str, Any]

class CropTasksResponse(BaseModel):
    crop_id: str
    crop_name: str
    planting_date: date
    tasks: List[TaskMilestone]
    total_tasks: int
    completed_tasks: int
    pending_tasks: int
    overdue_tasks: int
