from typing import List, Optional, Annotated
from pydantic import BeforeValidator, BaseModel, Field, EmailStr, ConfigDict
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


# Base User Schema
class UserBase(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, description="User's full name (2-100 characters)")
    username: str = Field(..., min_length=3, max_length=30, description="Unique username")
    email: EmailStr = Field(..., description="Valid email address")
    phone_number: str = Field(..., pattern="^(07)[0-9]{8}$", description="Sri Lankan phone number format (07xxxxxxxx)")


# User Creation Schema 
class UserCreate(UserBase):
    password: str = Field(..., min_length=4, max_length=128, description="Password (minimum 4 characters)")


# User Update Schema (for profile updates)
class UserUpdate(BaseModel):
    full_name: Optional[str] = Field(None, min_length=2, max_length=100)
    email: Optional[EmailStr] = None
    phone_number: Optional[str] = Field(None, pattern="^(07)[0-9]{8}$")
    crop_areas: Optional[List[PyObjectId]] = Field(
        default_factory=list,
        description="List of crop area IDs owned by this user"
    )


# User Database Schema 
class UserInDB(UserBase):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "507f1f77bcf86cd799439011",
                "full_name": "John Doe",
                "username": "johndoe",
                "email": "john.doe@example.com",
                "phone_number": "0771234567",
                "crop_areas": ["507f1f77bcf86cd799439012"],
                "is_active": True,
                "created_at": "2025-07-11T10:30:00Z",
                "updated_at": "2025-07-11T10:30:00Z"
            }
        }
    )
    
    id: PyObjectId = Field(default_factory=lambda: str(ObjectId()), alias="_id")
    hashed_password: str = Field(..., description="Hashed password (never expose in responses)")
    crop_areas: List[PyObjectId] = Field(
        default_factory=list,
        description="List of crop area IDs owned by this user"
    )
    is_active: bool = Field(default=True, description="Whether the user account is active")
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)


# User Response Schema (for API responses)
class UserResponse(UserBase):
    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True
    )
    
    id: PyObjectId = Field(alias="_id")
    crop_areas: List[PyObjectId]
    is_active: bool
    created_at: datetime
    updated_at: datetime


# User Login Schema
class UserLogin(BaseModel):
    username_or_email: str = Field(..., description="Username or email address")
    password: str = Field(..., description="User password")

