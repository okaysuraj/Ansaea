"""Support tickets and dispute resolution."""

from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import get_db
from app.models.db_models import SupportTicket, User

router = APIRouter(prefix="/api/support", tags=["Support"])


class TicketCreate(BaseModel):
    subject: str
    description: str
    category: str
    priority: str = "medium"


@router.post("/tickets")
async def create_ticket(
    ticket: TicketCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    new_ticket = SupportTicket(
        user_id=current_user.id,
        subject=ticket.subject,
        description=ticket.description,
        category=ticket.category,
        priority=ticket.priority,
    )
    db.add(new_ticket)
    await db.commit()
    await db.refresh(new_ticket)

    return {
        "status": "success",
        "message": "Ticket created successfully",
        "id": new_ticket.id.hex,
    }


@router.get("/tickets")
async def get_tickets(
    current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    stmt = (
        select(SupportTicket)
        .where(SupportTicket.user_id == current_user.id)
        .order_by(SupportTicket.created_at.desc())
    )
    result = await db.execute(stmt)
    tickets = result.scalars().all()

    return [
        {
            "id": t.id.hex,
            "subject": t.subject,
            "description": t.description,
            "category": t.category,
            "status": t.status,
            "priority": t.priority,
            "created_at": t.created_at.strftime("%Y-%m-%d %H:%M"),
        }
        for t in tickets
    ]
