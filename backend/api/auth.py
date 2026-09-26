"""
Authentication & Authorization API Routes.
Provides JWT token issue, verification, login, and user context endpoints.
"""

from datetime import datetime, timedelta
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel, EmailStr
import jwt

# Configuration Constants
SECRET_KEY = "SUPER_SECRET_EXAM_PLATFORM_KEY_CHANGE_IN_PRODUCTION"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8-hour exam session duration

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

# Pydantic Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    user_id: str
    role: str

class TokenData(BaseModel):
    user_id: Optional[str] = None
    role: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: str
    username: str
    email: str
    role: str
    full_name: str
    center_id: Optional[str] = None

# Mock Database Store
MOCK_USERS_DB = {
    "admin": {
        "id": "usr_admin_01",
        "username": "admin",
        "email": "admin@exam-platform.org",
        "full_name": "System Operations Lead",
        "hashed_password": "adminpassword",  # In production, use passlib/argon2
        "role": "admin",
        "center_id": "HQ-MAIN"
    },
    "candidate1": {
        "id": "usr_cand_9812",
        "username": "candidate1",
        "email": "candidate1@testcenter.org",
        "full_name": "Jane Doe",
        "hashed_password": "candidatepassword",
        "role": "candidate",
        "center_id": "CTR-NA-EAST-1"
    }
}

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Utility to encode JWT payload with expiration time."""
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

async def get_current_user(token: str = Depends(oauth2_scheme)) -> UserResponse:
    """Dependency to validate JWT tokens on protected routes."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate authentication credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(user_id=username, role=payload.get("role"))
    except jwt.PyJWTError:
        raise credentials_exception

    user = MOCK_USERS_DB.get(token_data.user_id)
    if user is None:
        raise credentials_exception

    return UserResponse(
        id=user["id"],
        username=user["username"],
        email=user["email"],
        role=user["role"],
        full_name=user["full_name"],
        center_id=user.get("center_id")
    )


@router.post("/login", response_model=Token)
async def login_for_access_token(credentials: UserLogin):
    """
    Authenticate user credentials and issue JWT bearer token.
    """
    user = MOCK_USERS_DB.get(credentials.username)
    if not user or user["hashed_password"] != credentials.password:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    access_token = create_access_token(
        data={"sub": user["username"], "role": user["role"], "id": user["id"]}
    )

    return Token(
        access_token=access_token,
        token_type="bearer",
        user_id=user["id"],
        role=user["role"]
    )


@router.get("/me", response_model=UserResponse)
async def read_users_me(current_user: UserResponse = Depends(get_current_user)):
    """
    Retrieve user metadata for the current authenticated session.
    """
    return current_user