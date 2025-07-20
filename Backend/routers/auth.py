from fastapi import APIRouter, HTTPException,status, Depends
from fastapi.security import OAuth2PasswordRequestForm
from typing import Annotated
from datetime import datetime, timedelta
from core import (
    user_collection,
    crop_collection,
    get_password_hash,
    verify_password,
    create_access_token,
    ACCESS_TOKEN_EXPIRE_MINUTES,
)
from schemas import UserCreate, UserInDB, UserResponse ,Token, UserLogin

router = APIRouter(tags=["authentication"])

@router.post("/signup", response_model=UserResponse)
async def signup(user: UserCreate):
    # Check if user exists
    if user_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="Email already registered")
    if user_collection.find_one({"username": user.username}):
        raise HTTPException(status_code=400, detail="Username already taken")
    
    now = datetime.utcnow()
    # Prepare user data for DB
    user_in_db = UserInDB(
        **user.dict(exclude={"password"}),
        hashed_password=get_password_hash(user.password),
        crop_areas=[],
        is_active=True,
        created_at=now,
        updated_at=now,
    )

    # Insert into DB
    result = user_collection.insert_one(user_in_db.model_dump(by_alias=True))
    created_user = user_collection.find_one({"_id": result.inserted_id})

    if not created_user:
        raise HTTPException(status_code=500, detail="User creation failed")

    # Convert ObjectId to string for response
    created_user["_id"] = str(created_user["_id"])
    # Remove hashed_password before returning
    if "hashed_password" in created_user:
        del created_user["hashed_password"]

    return UserResponse(**created_user)


# Authenticate user and return access token
@router.post("/login", response_model=Token)
async def login(user_credentials: UserLogin):
    """
    Authenticate user and return access token with user and baby information
    """
    # Find user by username or email
    user = user_collection.find_one({
        "$or": [
            {"username": user_credentials.username_or_email},
            {"email": user_credentials.username_or_email}
        ]
    })
    
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    user_id = str(user["_id"])

    # Get first crop from user's crop list
    crop_id = None
    if user.get("crop_areas") and len(user["crop_areas"]) > 0:
        first_crop_id = user["crop_areas"][0]
        crop = crop_collection.find_one({"_id": first_crop_id})
        if crop:
            crop_id = str(crop["_id"])

    # Create access token
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["username"]},
        expires_delta=access_token_expires
    )
    
    # Return token response with user and baby info
    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user_id,
        crop_id=crop_id
    )