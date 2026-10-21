from fastapi import APIRouter, HTTPException, status, Depends
from datetime import datetime, timezone
from app.models.user import UserRegisterRequest, UserLoginRequest, TokenResponse, UserProfile
from app.auth.security import hash_password, verify_password, create_access_token, get_current_user
from app.database import get_database

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
async def register(payload: UserRegisterRequest):
    db = get_database()
    users_col = db["users"]
    
    # Check if email already registered
    existing_email = await users_col.find_one({"email": payload.email.lower()})
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists."
        )
        
    # Check if username already taken
    existing_username = await users_col.find_one({"username": payload.username.lower()})
    if existing_username:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This username is already taken. Please choose another."
        )

    # Hash the password
    hashed_pwd = hash_password(payload.password)
    
    now = datetime.now(timezone.utc)
    new_user_doc = {
        "full_name": payload.full_name.strip(),
        "username": payload.username.lower().strip(),
        "email": payload.email.lower().strip(),
        "hashed_password": hashed_pwd,
        "role": payload.role.strip() or "Full-Stack Engineer",
        "bio": payload.bio.strip() if payload.bio else "",
        "location": payload.location.strip() if payload.location else "",
        "phone": payload.phone.strip() if payload.phone else "",
        "skills": payload.skills if payload.skills else [],
        "company": payload.company.strip() if payload.company else "",
        "created_at": now
    }
    
    result = await users_col.insert_one(new_user_doc)
    user_id = str(result.inserted_id)
    
    # Create JWT access token
    access_token = create_access_token({"sub": user_id, "email": new_user_doc["email"]})
    
    profile = UserProfile(
        id=user_id,
        full_name=new_user_doc["full_name"],
        username=new_user_doc["username"],
        email=new_user_doc["email"],
        role=new_user_doc["role"],
        bio=new_user_doc["bio"],
        location=new_user_doc["location"],
        phone=new_user_doc["phone"],
        skills=new_user_doc["skills"],
        company=new_user_doc["company"],
        created_at=new_user_doc["created_at"]
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=profile
    )

@router.post("/login", response_model=TokenResponse)
async def login(payload: UserLoginRequest):
    db = get_database()
    users_col = db["users"]
    
    query_val = payload.username_or_email.lower().strip()
    user = await users_col.find_one({
        "$or": [
            {"email": query_val},
            {"username": query_val}
        ]
    })
    
    if not user or not verify_password(payload.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username/email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    user_id = str(user["_id"])
    access_token = create_access_token({"sub": user_id, "email": user["email"]})
    
    profile = UserProfile(
        id=user_id,
        full_name=user.get("full_name", ""),
        username=user.get("username", ""),
        email=user.get("email", ""),
        role=user.get("role", "Developer"),
        bio=user.get("bio", ""),
        location=user.get("location", ""),
        phone=user.get("phone", ""),
        skills=user.get("skills", []),
        company=user.get("company", ""),
        created_at=user.get("created_at", datetime.now(timezone.utc))
    )
    
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=profile
    )

@router.get("/me", response_model=UserProfile)
async def get_my_profile(current_user: dict = Depends(get_current_user)):
    return UserProfile(**current_user)
