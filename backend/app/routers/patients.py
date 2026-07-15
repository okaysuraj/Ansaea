from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.db_models import User, VitalSign, MedicalRecord
from app.models import VitalSignCreate, VitalSignOut, MedicalRecordCreate, MedicalRecordOut
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
