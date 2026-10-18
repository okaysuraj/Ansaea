"""Consultation messages and WebSocket room connections."""

import asyncio
import json
import logging
import uuid
from datetime import datetime
from typing import Any, Dict, List

from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    WebSocket,
    WebSocketDisconnect,
    status,
)
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.auth import get_current_user
from app.database import AsyncSessionLocal, get_db
from app.models.db_models import Appointment, Message, User
from app.models.schemas import MessageCreate, MessageOut
from app.services.ai_service import ai_therapist

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/chat", tags=["Chat & Call Simulator"])


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, appointment_id: str):
        await websocket.accept()
        if appointment_id not in self.active_connections:
            self.active_connections[appointment_id] = []
        self.active_connections[appointment_id].append(websocket)

    def disconnect(self, websocket: WebSocket, appointment_id: str):
        if appointment_id in self.active_connections:
            if websocket in self.active_connections[appointment_id]:
                self.active_connections[appointment_id].remove(websocket)
            if not self.active_connections[appointment_id]:
                del self.active_connections[appointment_id]

    async def broadcast_to_room(self, message: dict, appointment_id: str):
        if appointment_id in self.active_connections:
            for connection in self.active_connections[appointment_id]:
                await connection.send_json(message)


manager = ConnectionManager()


class WebRTCManager:
    def __init__(self):
        self.rooms: Dict[str, List[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, room_id: str):
        await websocket.accept()
        if room_id not in self.rooms:
            self.rooms[room_id] = []
        self.rooms[room_id].append(websocket)

    def disconnect(self, websocket: WebSocket, room_id: str):
        if room_id in self.rooms:
            if websocket in self.rooms[room_id]:
                self.rooms[room_id].remove(websocket)
            if not self.rooms[room_id]:
                del self.rooms[room_id]

    async def broadcast(self, message: str, room_id: str, sender: WebSocket):
        if room_id in self.rooms:
            for connection in self.rooms[room_id]:
                if connection != sender:
                    await connection.send_text(message)


webrtc_manager = WebRTCManager()


@router.get("/conversations", response_model=List[Dict[str, Any]])
async def get_conversations(
    current_user=Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    if current_user.role == "doctor":
        stmt = (
            select(Appointment, User)
            .join(User, Appointment.user_id == User.id)
            .where(Appointment.doctor_id == current_user.id)
            .order_by(Appointment.date.desc())
        )
    else:
        stmt = (
            select(Appointment, User)
            .join(User, Appointment.doctor_id == User.id)
            .where(Appointment.user_id == current_user.id)
            .order_by(Appointment.date.desc())
        )

    result = await db.execute(stmt)
    records = result.all()

    # Simple deduplication by patient/doctor name just for the inbox list
    seen = set()
    conversations = []

    for appt, user in records:
        key = user.id
        if key not in seen:
            seen.add(key)
            conversations.append(
                {
                    "appointment_id": str(appt.id),
                    "name": user.username
                    if current_user.role == "doctor"
                    else appt.doctor_name,
                    "role": "Patient"
                    if current_user.role == "doctor"
                    else appt.doctor_specialty,
                    "last_message": "Tap to view conversation",
                    "time": "Recent",
                    "unread": 0,
                }
            )

    return conversations


@router.get("/{appointment_id}/messages", response_model=List[MessageOut])
async def get_messages(
    appointment_id: str,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Appointment ID")

    stmt_appt = select(Appointment).where(
        Appointment.id == appt_uuid,
        or_(
            Appointment.user_id == current_user.id,
            Appointment.doctor_id == current_user.id,
            current_user.role == "admin",
        ),
    )
    appt = (await db.execute(stmt_appt)).scalar_one_or_none()

    if not appt:
        raise HTTPException(
            status_code=404, detail="Appointment not found or unauthorized"
        )

    stmt_msgs = (
        select(Message)
        .where(Message.appointment_id == appt_uuid)
        .order_by(Message.timestamp.asc())
    )
    result = await db.execute(stmt_msgs)
    messages = result.scalars().all()

    return messages


@router.post("/{appointment_id}/messages", response_model=MessageOut)
async def send_message(
    appointment_id: str,
    msg_in: MessageCreate,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Appointment ID")

    stmt_appt = select(Appointment).where(
        Appointment.id == appt_uuid,
        or_(
            Appointment.user_id == current_user.id,
            Appointment.doctor_id == current_user.id,
            current_user.role == "admin",
        ),
    )
    appt = (await db.execute(stmt_appt)).scalar_one_or_none()

    if not appt:
        raise HTTPException(
            status_code=404, detail="Appointment not found or unauthorized"
        )

    is_doctor = current_user.id == appt.doctor_id
    sender = "doctor" if is_doctor else "user"

    user_msg = Message(appointment_id=appt_uuid, sender=sender, text=msg_in.text)
    db.add(user_msg)
    await db.commit()
    await db.refresh(user_msg)

    # Only generate AI auto-response if sent by patient to an AI consultation session
    is_ai_consultation = (
        "ai" in (appt.session_type or "").lower()
        or "ai" in (appt.doctor_name or "").lower()
    )
    if not is_doctor and is_ai_consultation:
        doctor_name = appt.doctor_name or "AI Therapist"
        doctor_specialty = appt.doctor_specialty or "Psychiatrist"

        original_for_ai = msg_in.text
        if hasattr(msg_in, "original_for_ai") and msg_in.original_for_ai:
            original_for_ai = msg_in.original_for_ai

        doctor_text = await ai_therapist.generate_response(
            original_for_ai, doctor_name, doctor_specialty
        )

        doctor_msg = Message(
            appointment_id=appt_uuid, sender="doctor", text=doctor_text
        )
        db.add(doctor_msg)
        await db.commit()
        await db.refresh(doctor_msg)

    return user_msg


@router.websocket("/ws/{appointment_id}")
async def websocket_endpoint(websocket: WebSocket, appointment_id: str):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    # Verify authorization if token is provided
    token = websocket.query_params.get("token")
    if token:
        try:
            from firebase_admin import auth as fb_auth

            decoded = fb_auth.verify_id_token(token)
            uid = decoded.get("uid")
            async with AsyncSessionLocal() as db:
                user_stmt = select(User).where(User.firebase_uid == uid)
                user = (await db.execute(user_stmt)).scalar_one_or_none()
                if not user:
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return
                appt_stmt = select(Appointment).where(Appointment.id == appt_uuid)
                appt = (await db.execute(appt_stmt)).scalar_one_or_none()
                if appt and (
                    appt.user_id != user.id
                    and appt.doctor_id != user.id
                    and user.role not in ["admin", "super_admin"]
                ):
                    await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
                    return
        except Exception:
            logger.warning("WebSocket authentication failed")
            await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
            return

    await manager.connect(websocket, appointment_id)

    try:
        async with AsyncSessionLocal() as db:
            stmt_appt = select(Appointment).where(Appointment.id == appt_uuid)
            appt = (await db.execute(stmt_appt)).scalar_one_or_none()

        while True:
            data = await websocket.receive_text()
            try:
                msg_data = json.loads(data)
            except Exception:
                continue

            text = msg_data.get("text", "")
            original_for_ai = msg_data.get("original_for_ai", text)

            async with AsyncSessionLocal() as db:
                user_msg = Message(
                    appointment_id=appt_uuid,
                    sender="user",
                    text=text,
                    timestamp=datetime.utcnow(),
                )
                db.add(user_msg)
                await db.commit()
                await db.refresh(user_msg)

                user_msg_dict = {
                    "id": str(user_msg.id),
                    "appointment_id": str(user_msg.appointment_id),
                    "sender": "user",
                    "text": user_msg.text,
                    "timestamp": user_msg.timestamp.isoformat(),
                }

                await manager.broadcast_to_room(user_msg_dict, appointment_id)

                if appt:
                    doctor_name = appt.doctor_name
                    doctor_specialty = appt.doctor_specialty
                else:
                    doctor_name = "AI Therapist"
                    doctor_specialty = "General"

                # Signal frontend that AI is typing
                await manager.broadcast_to_room(
                    {"type": "typing", "sender": "doctor"}, appointment_id
                )

                ai_text = await ai_therapist.generate_response(
                    original_for_ai, doctor_name, doctor_specialty
                )

                ai_msg = Message(
                    appointment_id=appt_uuid,
                    sender="doctor",
                    text=ai_text,
                    timestamp=datetime.utcnow(),
                )
                db.add(ai_msg)
                await db.commit()
                await db.refresh(ai_msg)

                ai_msg_dict = {
                    "id": str(ai_msg.id),
                    "appointment_id": str(ai_msg.appointment_id),
                    "sender": "doctor",
                    "text": ai_msg.text,
                    "timestamp": ai_msg.timestamp.isoformat(),
                }

                await asyncio.sleep(1.5)
                await manager.broadcast_to_room(ai_msg_dict, appointment_id)

    except WebSocketDisconnect:
        manager.disconnect(websocket, appointment_id)
    except Exception:
        logger.exception("WebSocket session failed")
        manager.disconnect(websocket, appointment_id)


@router.websocket("/webrtc/{appointment_id}")
async def webrtc_signaling(websocket: WebSocket, appointment_id: str):
    try:
        uuid.UUID(appointment_id)
    except ValueError:
        await websocket.close(code=status.WS_1008_POLICY_VIOLATION)
        return

    await webrtc_manager.connect(websocket, appointment_id)
    try:
        while True:
            data = await websocket.receive_text()
            await webrtc_manager.broadcast(data, appointment_id, websocket)
    except WebSocketDisconnect:
        webrtc_manager.disconnect(websocket, appointment_id)
    except Exception:
        webrtc_manager.disconnect(websocket, appointment_id)
