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
        "role": current_user.role,
        "abha_number": current_user.abha_number,
        "wallet_balance": current_user.wallet_balance
    }

class LinkABHARequest(BaseModel):
    abha_number: str

@router.post("/link-abha")
async def link_abha(
    data: LinkABHARequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Mocks linking an ABHA ID (India's National Health ID)
    """
    current_user.abha_number = data.abha_number
    await db.commit()
    return {"message": "ABHA linked successfully", "abha_number": current_user.abha_number}

class WearableSyncRequest(BaseModel):
    device_type: str # AppleHealth, Fitbit
    data: dict # e.g. {"steps": 5000, "heart_rate": 72}

@router.post("/sync-wearable")
async def sync_wearable(
    data: WearableSyncRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    from app.db_models import WearableData
    from datetime import datetime
    
    # Store mocked wearable data
    for key, value in data.data.items():
        w_data = WearableData(
            user_id=current_user.id,
            device_type=data.device_type,
            data_type=key,
            value=str(value),
            recorded_at=datetime.utcnow()
        )
        db.add(w_data)
        
    await db.commit()
    return {"message": "Wearable data synced successfully"}
