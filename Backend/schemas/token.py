from pydantic import BaseModel
from typing import Optional


class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    crop_id: Optional[str] = None  


class TokenData(BaseModel):
    username: Optional[str] = None
    user_id: Optional[str] = None
    crop_id: Optional[str] = None