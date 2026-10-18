"""Lab test requests and sample tracking."""

import uuid
from typing import Any, Dict, List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.db_models import LabTestRequest, User
from app.models.schemas import LabTestRequestOut

router = APIRouter(prefix="/api/lab", tags=["Lab"])


@router.get("/requests", response_model=List[LabTestRequestOut])
async def get_test_requests(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    if current_user.role != "lab":
        raise HTTPException(status_code=403, detail="Access denied.")

    # Filter by org_id in real app
    stmt = select(LabTestRequest).order_by(LabTestRequest.created_at.desc())
    result = await db.execute(stmt)
    return result.scalars().all()


@router.patch("/requests/{request_id}/status", response_model=Dict[str, Any])
async def update_request_status(
    request_id: str,
    status: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    if current_user.role != "lab":
        raise HTTPException(status_code=403, detail="Access denied.")

    try:
        req_uuid = uuid.UUID(request_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid request ID format")

    stmt = select(LabTestRequest).where(LabTestRequest.id == req_uuid)
    test_req = (await db.execute(stmt)).scalar_one_or_none()

    if not test_req:
        raise HTTPException(status_code=404, detail="Test request not found")

    test_req.status = status
    if status == "completed":
        import math
        from datetime import datetime

        # Calculate actual TAT in hours
        delta = datetime.utcnow() - test_req.created_at
        test_req.tat_hours_actual = math.ceil(delta.total_seconds() / 3600)

    await db.commit()
    return {"status": "success", "message": f"Test request status updated to {status}"}


@router.get("/sample-tracking")
async def track_samples(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    """
    Patient endpoint to track their lab sample collection.
    """
    from app.models.db_models import LabAgent, LabTestTracking

    stmt = (
        select(LabTestRequest)
        .where(LabTestRequest.patient_id == current_user.id)
        .order_by(LabTestRequest.created_at.desc())
    )
    result = await db.execute(stmt)
    requests = result.scalars().all()

    if not requests:
        return None

    latest = requests[0]

    # Query tracking and agent
    track_stmt = select(LabTestTracking).where(
        LabTestTracking.lab_test_request_id == latest.id
    )
    tracking = (await db.execute(track_stmt)).scalar_one_or_none()

    agent_info = "N/A"
    eta_info = "N/A"
    status_text = "Processing in Lab"

    if tracking:
        status_text = tracking.tracking_status.replace("_", " ").title()
        eta_info = tracking.eta or "N/A"
        if tracking.agent_id:
            agent_stmt = select(LabAgent).where(LabAgent.id == tracking.agent_id)
            agent = (await db.execute(agent_stmt)).scalar_one_or_none()
            if agent:
                agent_info = f"{agent.name} ({agent.phone})"

    return {
        "id": latest.id.hex,
        "test_names": latest.test_names,
        "status": status_text,
        "agent": agent_info,
        "eta": eta_info,
    }
