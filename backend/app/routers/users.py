from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel

from app.database import get_db
from app.db_models import User, DoctorProfile
from app.auth import get_current_user

router = APIRouter(prefix="/api/users", tags=["Users"])

class RegisterRequest(BaseModel):
    username: str
    role: str

@router.post("/register")
async def register_user(
    data: RegisterRequest, 
    current_user: User = Depends(get_current_user), 
    db: AsyncSession = Depends(get_db)
):
    """
    Updates the implicitly created user with the correct role and username 
    chosen during the signup process.
    """
    current_user.username = data.username
    current_user.role = data.role
    
    if data.role == "doctor":
        # Create a default DoctorProfile
        profile = DoctorProfile(user_id=current_user.id)
        db.add(profile)
        
    await db.commit()
    await db.refresh(current_user)
    return {"message": "User registered successfully", "user": {"username": current_user.username, "role": current_user.role}}

@router.get("/me")
async def get_me(current_user: User = Depends(get_current_user)):
    """
    Returns the current logged-in user's profile information.
    """
    return {
        "id": current_user.id,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role
    }
