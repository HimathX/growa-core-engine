from typing import List, Optional, Annotated
from pydantic import BeforeValidator, BaseModel, Field
from datetime import datetime
from bson import ObjectId

def validate_object_id(v):
    if isinstance(v, ObjectId):
        return str(v)
    if isinstance(v, str):
        if ObjectId.is_valid(v):
            return v
        raise ValueError("Invalid ObjectId string")
    raise ValueError("ObjectId must be a valid ObjectId or string")

PyObjectId = Annotated[str, BeforeValidator(validate_object_id)]

# Crop Area/Field Schema
class CropArea(BaseModel):
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    name: str = Field(..., min_length=2, max_length=100, description="Name of the field/crop area")
    size: float = Field(..., gt=0, description="Size of the field in acres/hectares")
    location: str = Field(..., description="Location/address of the field")
    crop_type: Optional[str] = Field(None, description="Type of crop currently planted")