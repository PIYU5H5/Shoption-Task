from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

class UserRegisterRequest(BaseModel):
    full_name: str = Field(..., min_length=2, max_length=100, example="Alex Mercer")
    username: str = Field(..., min_length=3, max_length=50, example="alexmercer")
    email: EmailStr = Field(..., example="alex@example.com")
    password: str = Field(..., min_length=6, max_length=100, example="secret123")
    role: str = Field(default="Full-Stack Engineer", example="Full-Stack Engineer")
    bio: Optional[str] = Field(default="", max_length=500, example="Passionate engineer building distributed systems.")
    location: Optional[str] = Field(default="San Francisco, CA", example="San Francisco, CA")
    phone: Optional[str] = Field(default="", example="+1 (555) 019-2834")
    skills: List[str] = Field(default_factory=lambda: ["Next.js", "FastAPI", "MongoDB"], example=["Next.js", "FastAPI", "Python"])
    company: Optional[str] = Field(default="Tech Innovations Inc.", example="Tech Innovations Inc.")

class UserLoginRequest(BaseModel):
    # Allow logging in with either username or email
    username_or_email: str = Field(..., example="alex@example.com")
    password: str = Field(..., example="secret123")

class UserProfile(BaseModel):
    id: str
    full_name: str
    username: str
    email: str
    role: str
    bio: Optional[str] = ""
    location: Optional[str] = ""
    phone: Optional[str] = ""
    skills: List[str] = []
    company: Optional[str] = ""
    created_at: datetime

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserProfile

class UserInDB(BaseModel):
    id: Optional[str] = None
    full_name: str
    username: str
    email: str
    hashed_password: str
    role: str
    bio: Optional[str] = ""
    location: Optional[str] = ""
    phone: Optional[str] = ""
    skills: List[str] = []
    company: Optional[str] = ""
    created_at: datetime
