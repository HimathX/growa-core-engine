from datetime import datetime, timedelta
from typing import Optional
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
import os
from core import user_collection
from schemas import TokenData

# Security configurations
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")  # Secret key for JWT
ALGORITHM = os.getenv("ALGORITHM", "HS256")                  # JWT signing algorithm
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))  # Token expiry

# OAuth2 scheme for FastAPI dependency injection
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# Password hashing context using bcrypt
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Verify a plain password against its hashed version.
    Returns True if the password matches, False otherwise.
    """
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(password: str) -> str:
    """
    Hash a plain password for secure storage.
    Returns the hashed password string.
    """
    return pwd_context.hash(password)


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token with an expiration time.
    Returns the encoded JWT token string.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def authenticate_user(username: str, password: str):
    """
    Authenticate a user by username and password.
    Returns the user object if authentication succeeds, False otherwise.
    """
    user = user_collection.find_one({"username": username})
    if not user:
        return False
    if not verify_password(password, user["hashed_password"]):
        return False
    return user


async def get_current_user(token: str = Depends(oauth2_scheme)):
    """
    Retrieve the current user from the JWT token.
    Raises HTTP 401 if credentials are invalid.
    Returns the user object if valid.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=str(username))
    except JWTError:
        raise credentials_exception
    
    user = user_collection.find_one({"username": token_data.username})
    if user is None:
        raise credentials_exception
    return user


async def get_current_active_user(current_user: dict = Depends(get_current_user)):
    """
    Ensure the current user is active.
    Raises HTTP 400 if the user is inactive.
    Returns the user object if active.
    """
    if not current_user.get("is_active", True):
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user
