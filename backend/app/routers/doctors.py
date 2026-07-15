from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
import uuid
from app.database import get_db
from app.auth import get_current_user
from app.db_models import User, Prescription, PharmacyOrder, Organization, PaymentTransaction, DoctorProfile
from app.models import PrescriptionCreate, PrescriptionOut, ClinicalNoteCreate, ClinicalNoteOut
from app.db_models import User, Prescription, PharmacyOrder, Organization, PaymentTransaction, DoctorProfile, ClinicalNote
from datetime import datetime

router = APIRouter(prefix="/api/doctors", tags=["Doctors"])

@router.post("/prescriptions/{appointment_id}", response_model=Dict[str, Any])
async def create_prescription(appointment_id: str, presc_in: PrescriptionCreate, patient_id: str, pharmacy_id: str = None, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can write prescriptions.")

    try:
        appt_uuid = uuid.UUID(appointment_id)
    except:
        appt_uuid = uuid.uuid4()
    
    new_presc = Prescription(
        appointment_id=appt_uuid,
        medications=[m.model_dump() for m in presc_in.medications],
        instructions=presc_in.instructions
    )
    db.add(new_presc)
    await db.commit()
    await db.refresh(new_presc)

    if pharmacy_id:
        items = [{"name": m.name, "quantity": 1, "price": 0.0} for m in presc_in.medications]
        new_order = PharmacyOrder(
            patient_id=uuid.UUID(patient_id),
            pharmacy_org_id=uuid.UUID(pharmacy_id),
            prescription_id=new_presc.id,
            items=items,
            status="pending",
            total_amount=0.0
        )
        db.add(new_order)
        await db.commit()

    return {"status": "success", "message": "Prescription sent successfully", "id": str(new_presc.id)}

@router.get("/prescriptions/{appointment_id}", response_model=Dict[str, Any])
async def get_prescription(appointment_id: str, db: AsyncSession = Depends(get_db)):
    try:
        appt_uuid = uuid.UUID(appointment_id)
        stmt = select(Prescription).where(Prescription.appointment_id == appt_uuid)
        presc = (await db.execute(stmt)).scalar_one_or_none()
        if presc:
            return {"status": "success", "data": {"medications": presc.medications, "instructions": presc.instructions}}
    except:
        pass
    return {"status": "error", "message": "Not found"}

@router.post("/notes/{appointment_id}", response_model=Dict[str, Any])
async def save_clinical_note(appointment_id: str, note_in: ClinicalNoteCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can save notes.")
        
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except:
        appt_uuid = uuid.uuid4()
        
    stmt = select(ClinicalNote).where(ClinicalNote.appointment_id == appt_uuid)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    
    if existing:
        existing.subjective = note_in.subjective
        existing.objective = note_in.objective
        existing.assessment = note_in.assessment
        existing.plan = note_in.plan
        await db.commit()
        return {"status": "success"}
    else:
        new_note = ClinicalNote(
            appointment_id=appt_uuid,
            subjective=note_in.subjective,
            objective=note_in.objective,
            assessment=note_in.assessment,
            plan=note_in.plan
        )
        db.add(new_note)
        await db.commit()
        return {"status": "success"}

@router.get("/notes/{appointment_id}", response_model=Dict[str, Any])
async def get_clinical_note(appointment_id: str, db: AsyncSession = Depends(get_db)):
    try:
        appt_uuid = uuid.UUID(appointment_id)
        stmt = select(ClinicalNote).where(ClinicalNote.appointment_id == appt_uuid)
        note = (await db.execute(stmt)).scalar_one_or_none()
        if note:
            return {"status": "success", "data": {"subjective": note.subjective, "objective": note.objective, "assessment": note.assessment, "plan": note.plan}}
    except:
        pass
    return {"status": "error", "message": "Not found"}


@router.get("/roster", response_model=List[Dict[str, Any]])
async def get_patient_roster(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can view roster.")
    
    # Mock roster for now
    return [
        {"id": "1", "name": "John Doe", "status": "Stable", "lastSeen": "Today, 9:00 AM"},
        {"id": "2", "name": "Jane Smith", "status": "Needs Review", "lastSeen": "Yesterday"}
    ]

@router.get("/earnings", response_model=Dict[str, Any])
async def get_earnings(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can view earnings.")
        
    stmt = select(PaymentTransaction).where(PaymentTransaction.user_id == current_user.id, PaymentTransaction.transaction_type == "payment")
    result = await db.execute(stmt)
    transactions = result.scalars().all()
    
    total_earnings = sum(t.amount for t in transactions)
    return {
        "total_earnings": total_earnings,
        "recent_transactions": [{"id": str(t.id), "amount": t.amount, "date": t.created_at} for t in transactions[-5:]]
    }

from pydantic import BaseModel
class SlotManagementRequest(BaseModel):
    date: str
    slots: List[str]
    auto_buffer_mins: int = 15

@router.post("/slots", response_model=Dict[str, Any])
async def update_slots(data: SlotManagementRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can manage slots.")
        
    # In a real app, calculate buffer times and store in DB for the specific date.
    # Here we'll just return a success message acknowledging the buffer.
    
    return {
        "status": "success", 
        "message": f"Slots updated for {data.date} with {data.auto_buffer_mins} mins auto-buffer between appointments."
    }
