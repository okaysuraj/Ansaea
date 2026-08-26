from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from pydantic import BaseModel
import uuid
from datetime import datetime

from app.database import get_db
from app.models.db_models import User, PaymentTransaction
from app.auth import get_current_user

router = APIRouter(prefix="/api/billing", tags=["Billing"])

class TopupRequest(BaseModel):
    amount: float
    payment_gateway: str = "stripe" # e.g. razorpay, stripe

@router.post("/wallet/topup")
async def topup_wallet(
    data: TopupRequest,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Process wallet top-up logic (simulated external gateway).
    """
    if data.amount <= 0:
        raise HTTPException(status_code=400, detail="Invalid amount")

    # Gateway processing logic (simulated)
    txn_ref = f"txn_{uuid.uuid4().hex[:10]}"
    
    current_user.wallet_balance += data.amount
    
    txn = PaymentTransaction(
        user_id=current_user.id,
        amount=data.amount,
        transaction_type="deposit",
        status="success",
        reference_id=txn_ref
    )
    
    db.add(txn)
    await db.commit()
    
    return {
        "message": "Top-up successful", 
        "new_balance": current_user.wallet_balance,
        "transaction_id": txn.id
    }

class InvoiceRequest(BaseModel):
    transaction_id: str

@router.get("/invoice/{transaction_id}")
async def generate_gst_invoice(
    transaction_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Generate GST invoice for completed transaction.
    """
    try:
        txn_uuid = uuid.UUID(transaction_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid transaction ID")

    stmt = select(PaymentTransaction).where(
        PaymentTransaction.id == txn_uuid, 
        PaymentTransaction.user_id == current_user.id
    )
    result = await db.execute(stmt)
    txn = result.scalars().first()
    
    if not txn:
        raise HTTPException(status_code=404, detail="Transaction not found")
        
    gst_rate = 0.18
    base_amount = txn.amount / (1 + gst_rate)
    gst_amount = txn.amount - base_amount
    
    return {
        "invoice_number": f"INV-{txn.id.hex[:8]}",
        "date": txn.created_at,
        "customer_name": current_user.username,
        "base_amount": round(base_amount, 2),
        "total_amount": round(txn.amount, 2),
        "gstin": "27ANSAEA1234X1ZX" # Platform GSTIN
    }

@router.get("/invoices")
async def get_invoices(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get all payment transactions for the user.
    """
    stmt = select(PaymentTransaction).where(PaymentTransaction.user_id == current_user.id).order_by(PaymentTransaction.created_at.desc())
    result = await db.execute(stmt)
    txns = result.scalars().all()
    
    return [
        {
            "id": txn.id.hex,
            "date": txn.created_at.strftime("%Y-%m-%d"),
            "amount": f"${txn.amount:.2f}",
            "status": txn.status.capitalize(),
            "type": txn.transaction_type
        }
        for txn in txns
    ]

@router.get("/earnings")
async def get_earnings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db)
):
    """
    Get earnings for doctors/partners.
    """
    if current_user.role not in ["doctor", "lab", "pharmacy"]:
        raise HTTPException(status_code=403, detail="Only providers can view earnings")
        
    stmt = select(PaymentTransaction).where(
        PaymentTransaction.user_id == current_user.id,
        PaymentTransaction.transaction_type == "deposit"
    ).order_by(PaymentTransaction.created_at.desc())
    
    result = await db.execute(stmt)
    txns = result.scalars().all()
    
    total = sum(txn.amount for txn in txns if txn.status == "success")
    
    return {
        "total_earnings": f"${total:.2f}",
        "recent_transactions": [
            {
                "id": txn.id.hex,
                "date": txn.created_at.strftime("%Y-%m-%d"),
                "amount": f"${txn.amount:.2f}",
                "status": txn.status.capitalize()
            }
            for txn in txns[:5]
        ]
    }
