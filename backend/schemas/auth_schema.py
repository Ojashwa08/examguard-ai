"""
Pydantic Schemas for Authentication & User Authorization.
Defines validation schemas for login, token payload exchange, registration, and user profiles.
"""

from typing import Optional
from pydantic import BaseModel, EmailStr, Field
from app.models.user import UserRole


class UserBase(BaseModel):
    username: str = Field(..., min_length=3, max_length=64, example="candidate1")
    email: EmailStr = Field(..., example="candidate1@testcenter.org")
    full_name: str = Field(..., min_length=2, max_length=255, example="Jane Doe")
    role: UserRole = Field(default=UserRole.CANDIDATE)
    center_id: Optional[str] = Field(default=None, example="CTR-NA-EAST-1")


class UserCreate(UserBase):
    password: str = Field(..., min_length=8, max_length=128)


class UserLogin(BaseModel):
    username: str = Field(..., example="admin")
    password: str = Field(..., example="adminpassword")


class UserResponse(UserBase):
    id: str = Field(..., example="usr_cand_9812")
    is_active: bool = True

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    role: str


class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None