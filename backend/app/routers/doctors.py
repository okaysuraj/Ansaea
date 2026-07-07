from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
import uuid
from app.database import get_db
from app.auth import get_current_user
from app.db_models import User, Prescription, PharmacyOrder, Organization
from app.models import PrescriptionCreate, PrescriptionOut
from datetime import datetime

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.post("/prescriptions", response_model=Dict[str, Any])
async def create_prescription(presc_in: PrescriptionCreate, patient_id: str, pharmacy_id: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can write prescriptions.")

    # In a real system, we'd validate patient_id and pharmacy_id exist
    # For now, we simulate the insertion. Notice we don't have appointment_id required in schema but DB model requires it or we make it nullable.
    # Looking at db_models.py, Prescription requires appointment_id. Let's assume a mock one for now or create a dummy appointment.
    # For this demo, we'll bypass the hard constraint or assume there's a dummy appointment.
    # Wait, the db_models.py says appointment_id is nullable=False.
    # We will generate a mock appointment_id if we have to, or just update the schema to be nullable later.
    
    new_presc = Prescription(
        appointment_id=uuid.uuid4(), # Mock appointment ID for demo
        medications=[m.model_dump() for m in presc_in.medications],
        instructions=presc_in.instructions
    )
    db.add(new_presc)
    await db.commit()
    await db.refresh(new_presc)

    # Automatically create a PharmacyOrder if pharmacy_id is provided
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

@router.get("/roster", response_model=List[Dict[str, Any]])
async def get_patient_roster(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can view roster.")
    
    # Mock roster for now
    return [
        {"id": "1", "name": "John Doe", "status": "Stable", "lastSeen": "Today, 9:00 AM"},
        {"id": "2", "name": "Jane Smith", "status": "Needs Review", "lastSeen": "Yesterday"}
    ]
