from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Dict, Any
from app.database import get_db
from app.auth import get_current_user
from app.db_models import User, LabTestRequest
from app.models import LabTestRequestOut

router = APIRouter(prefix="/lab", tags=["Lab"])

@router.get("/requests", response_model=List[LabTestRequestOut])
async def get_test_requests(current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "lab":
        raise HTTPException(status_code=403, detail="Access denied.")
    
    # Filter by org_id in real app
    stmt = select(LabTestRequest).order_by(LabTestRequest.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()

@router.patch("/requests/{request_id}/status", response_model=Dict[str, Any])
async def update_request_status(request_id: str, status: str, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "lab":
        raise HTTPException(status_code=403, detail="Access denied.")

    stmt = select(LabTestRequest).where(LabTestRequest.id == request_id)
    test_req = (await db.execute(stmt)).scalar_one_or_none()
    
    if not test_req:
        raise HTTPException(status_code=404, detail="Test request not found")
        
    test_req.status = status
    await db.commit()
    return {"status": "success", "message": f"Test request status updated to {status}"}
