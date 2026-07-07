from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.db_models import User, PharmacyOrder
from app.models import PharmacyOrderOut

router = APIRouter(prefix="/pharmacy", tags=["Pharmacy"])

@router.get("/orders", response_model=List[PharmacyOrderOut])
async def get_orders(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "pharmacy":
        raise HTTPException(status_code=403, detail="Access denied.")
    
    # In a real scenario, filter by current_user.organization_id
    stmt = select(PharmacyOrder).order_by(PharmacyOrder.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.patch("/orders/{order_id}/status", response_model=Dict[str, Any])
async def update_order_status(order_id: str, status: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "pharmacy":
        raise HTTPException(status_code=403, detail="Access denied.")

    stmt = select(PharmacyOrder).where(PharmacyOrder.id == order_id)
    order = (await db.execute(stmt)).scalar_one_or_none()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
        
    order.status = status
    await db.commit()
    return {"status": "success", "message": f"Order status updated to {status}"}
