from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
import uuid
from app.database import get_db
from app.auth import get_current_user
from app.db_models import User, Prescription, PharmacyOrder, Organization, PaymentTransaction, DoctorProfile
from app.models import PrescriptionCreate, PrescriptionOut, ClinicalNoteCreate, ClinicalNoteOut, DoctorScheduleCreate, DoctorScheduleOut
from app.db_models import User, Prescription, PharmacyOrder, Organization, PaymentTransaction, DoctorProfile, ClinicalNote, DoctorSchedule, Appointment, Message, PatientProfileExt, MedicalHistory
from datetime import datetime, timedelta

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


@router.get("/dashboard-stats", response_model=Dict[str, Any])
async def get_dashboard_stats(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can access this.")
        
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    
    # Consults today
    stmt_appts = select(func.count(Appointment.id)).where(
        Appointment.doctor_id == current_user.id, 
        Appointment.date == today_str
    )
    consults_count = (await db.execute(stmt_appts)).scalar() or 0
    
    # Mocking reports and messages for now since we don't have direct counters yet
    reports_count = 3 
    messages_count = 5
    
    return {
        "consults_today": consults_count,
        "reports_pending": reports_count,
        "unread_messages": messages_count
    }

@router.get("/appointments/today", response_model=List[Dict[str, Any]])
async def get_today_appointments(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can access this.")
        
    today_str = datetime.utcnow().strftime("%Y-%m-%d")
    stmt = select(Appointment, User).join(User, Appointment.user_id == User.id).where(
        Appointment.doctor_id == current_user.id,
        Appointment.date == today_str
    ).order_by(Appointment.time_slot)
    
    result = await db.execute(stmt)
    records = result.all()
    
    return [
        {
            "id": str(appt.id),
            "patient_id": str(user.id),
            "patient_name": user.username,
            "time_slot": appt.time_slot,
            "session_type": appt.session_type,
            "status": appt.status
        }
        for appt, user in records
    ]

@router.get("/patients", response_model=List[Dict[str, Any]])
async def get_doctor_patients(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can access patients.")
    
    # Get unique patients that have an appointment with this doctor
    stmt = select(User).join(Appointment, Appointment.user_id == User.id).where(
        Appointment.doctor_id == current_user.id
    ).distinct()
    
    result = await db.execute(stmt)
    patients = result.scalars().all()
    
    return [
        {
            "id": str(p.id),
            "name": p.username,
            "email": p.email,
            "status": "Active" # Mock status for now
        }
        for p in patients
    ]

@router.get("/patients/{patient_id}/history", response_model=Dict[str, Any])
async def get_patient_history(patient_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can access patient history.")
        
    p_uuid = uuid.UUID(patient_id)
    
    # Verify doctor has an appointment with this patient
    verify_stmt = select(Appointment).where(Appointment.doctor_id == current_user.id, Appointment.user_id == p_uuid)
    verify_result = (await db.execute(verify_stmt)).first()
    if not verify_result:
        raise HTTPException(status_code=403, detail="Not authorized to view this patient's history.")
        
    # Fetch history
    prof_stmt = select(PatientProfileExt).where(PatientProfileExt.user_id == p_uuid)
    profile = (await db.execute(prof_stmt)).scalar_one_or_none()
    
    hist_stmt = select(MedicalHistory).where(MedicalHistory.user_id == p_uuid)
    history = (await db.execute(hist_stmt)).scalar_one_or_none()
    
    return {
        "profile": {
            "blood_group": profile.blood_group if profile else None,
            "dob": profile.dob if profile else None
        },
        "history": {
            "chronic_conditions": history.chronic_conditions if history else [],
            "past_surgeries": history.past_surgeries if history else [],
            "allergies": history.allergies if history else []
        }
    }

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

@router.get("/slots", response_model=List[DoctorScheduleOut])
async def get_slots(date: str = None, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can manage slots.")
        
    stmt = select(DoctorSchedule).where(DoctorSchedule.doctor_id == current_user.id)
    if date:
        stmt = stmt.where(DoctorSchedule.date == date)
        
    result = await db.execute(stmt)
    return result.scalars().all()

@router.post("/slots", response_model=Dict[str, Any])
async def update_slots(data: DoctorScheduleCreate, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can manage slots.")
        
    stmt = select(DoctorSchedule).where(DoctorSchedule.doctor_id == current_user.id, DoctorSchedule.date == data.date)
    existing = (await db.execute(stmt)).scalar_one_or_none()
    
    if existing:
        existing.slots = data.slots
        existing.auto_buffer_mins = data.auto_buffer_mins
        await db.commit()
    else:
        new_schedule = DoctorSchedule(
            doctor_id=current_user.id,
            date=data.date,
            slots=data.slots,
            auto_buffer_mins=data.auto_buffer_mins
        )
        db.add(new_schedule)
        await db.commit()
    
    return {
        "status": "success", 
        "message": f"Slots updated for {data.date} with {data.auto_buffer_mins} mins auto-buffer."
    }
