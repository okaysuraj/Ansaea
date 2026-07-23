from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.models.db_models import User, VitalSign, MedicalRecord, PatientProfileExt, MedicalHistory, NotificationPreferences
from app.models.models import (
    VitalSignCreate, VitalSignOut, MedicalRecordCreate, MedicalRecordOut,
    PatientProfileExtCreate, PatientProfileExtOut,
    MedicalHistoryCreate, MedicalHistoryOut,
    NotificationPreferencesCreate, NotificationPreferencesOut
)
from datetime import datetime

router = APIRouter(prefix="/api/patients", tags=["Patients"])

@router.post("/vitals", response_model=Dict[str, Any])
async def add_vital_sign(vitals_in: VitalSignCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_vital = VitalSign(
        user_id=current_user.id,
        blood_pressure=vitals_in.blood_pressure,
        heart_rate=vitals_in.heart_rate,
        spo2=vitals_in.spo2,
        temperature=vitals_in.temperature,
        bmi=vitals_in.bmi,
        blood_sugar=vitals_in.blood_sugar
    )
    db.add(new_vital)
    await db.commit()
    await db.refresh(new_vital)
    return {"status": "success", "message": "Vitals logged successfully", "id": str(new_vital.id)}

@router.get("/vitals", response_model=List[VitalSignOut])
async def get_vital_signs(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(VitalSign).where(VitalSign.user_id == current_user.id).order_by(VitalSign.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/records", response_model=Dict[str, Any])
async def add_medical_record(record_in: MedicalRecordCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    new_record = MedicalRecord(
        user_id=current_user.id,
        title=record_in.title,
        record_type=record_in.record_type,
        file_url=record_in.file_url
    )
    db.add(new_record)
    await db.commit()
    await db.refresh(new_record)
    return {"status": "success", "message": "Medical record added", "id": str(new_record.id)}

@router.get("/records", response_model=List[MedicalRecordOut])
async def get_medical_records(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MedicalRecord).where(MedicalRecord.user_id == current_user.id).order_by(MedicalRecord.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

# --- Phase 1: Patient Profile & Settings ---

@router.get("/profile", response_model=PatientProfileExtOut)
async def get_patient_profile(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(PatientProfileExt).where(PatientProfileExt.user_id == current_user.id)
    result = await db.execute(stmt)
    profile = result.scalars().first()
    if not profile:
        profile = PatientProfileExt(user_id=current_user.id)
        db.add(profile)
        await db.commit()
        await db.refresh(profile)
    return profile

@router.put("/profile", response_model=PatientProfileExtOut)
async def update_patient_profile(profile_in: PatientProfileExtCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(PatientProfileExt).where(PatientProfileExt.user_id == current_user.id)
    result = await db.execute(stmt)
    profile = result.scalars().first()
    
    if not profile:
        profile = PatientProfileExt(user_id=current_user.id, **profile_in.model_dump())
        db.add(profile)
    else:
        for key, value in profile_in.model_dump(exclude_unset=True).items():
            setattr(profile, key, value)
            
    await db.commit()
    await db.refresh(profile)
    return profile

@router.get("/medical-history", response_model=MedicalHistoryOut)
async def get_medical_history(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MedicalHistory).where(MedicalHistory.user_id == current_user.id)
    result = await db.execute(stmt)
    history = result.scalars().first()
    if not history:
        history = MedicalHistory(user_id=current_user.id)
        db.add(history)
        await db.commit()
        await db.refresh(history)
    return history

@router.put("/medical-history", response_model=MedicalHistoryOut)
async def update_medical_history(history_in: MedicalHistoryCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(MedicalHistory).where(MedicalHistory.user_id == current_user.id)
    result = await db.execute(stmt)
    history = result.scalars().first()
    
    dumped_data = history_in.model_dump(exclude_unset=True)
    if "past_surgeries" in dumped_data and dumped_data["past_surgeries"]:
        dumped_data["past_surgeries"] = [s if isinstance(s, dict) else s.model_dump() for s in dumped_data["past_surgeries"]]
    if "allergies" in dumped_data and dumped_data["allergies"]:
        dumped_data["allergies"] = [a if isinstance(a, dict) else a.model_dump() for a in dumped_data["allergies"]]

    if not history:
        history = MedicalHistory(user_id=current_user.id, **dumped_data)
        db.add(history)
    else:
        for key, value in dumped_data.items():
            setattr(history, key, value)
            
    await db.commit()
    await db.refresh(history)
    return history

@router.get("/notifications", response_model=NotificationPreferencesOut)
async def get_notification_prefs(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(NotificationPreferences).where(NotificationPreferences.user_id == current_user.id)
    result = await db.execute(stmt)
    prefs = result.scalars().first()
    if not prefs:
        prefs = NotificationPreferences(user_id=current_user.id)
        db.add(prefs)
        await db.commit()
        await db.refresh(prefs)
    return prefs

@router.put("/notifications", response_model=NotificationPreferencesOut)
async def update_notification_prefs(prefs_in: NotificationPreferencesCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(NotificationPreferences).where(NotificationPreferences.user_id == current_user.id)
    result = await db.execute(stmt)
    prefs = result.scalars().first()
    
    if not prefs:
        prefs = NotificationPreferences(user_id=current_user.id, **prefs_in.model_dump())
        db.add(prefs)
    else:
        for key, value in prefs_in.model_dump(exclude_unset=True).items():
            setattr(prefs, key, value)
            
    await db.commit()
    await db.refresh(prefs)
    return prefs
