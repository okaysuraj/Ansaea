from fastapi import APIRouter, Depends, HTTPException, status, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
from datetime import datetime
import asyncio
import json
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models import MessageCreate, MessageOut
from app.db_models import Message, Appointment
from app.auth import get_current_user
from app.database import get_db, AsyncSessionLocal
from app.ai_service import ai_therapist

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

@router.get("/{appointment_id}/messages", response_model=List[MessageOut])
async def get_messages(appointment_id: str, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Appointment ID")

    stmt_appt = select(Appointment).where(Appointment.id == appt_uuid, Appointment.user_id == current_user.id)
    appt = (await db.execute(stmt_appt)).scalar_one_or_none()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or unauthorized")
        
    stmt_msgs = select(Message).where(Message.appointment_id == appt_uuid).order_by(Message.timestamp.asc())
    result = await db.execute(stmt_msgs)
    messages = result.scalars().all()
    
    return messages

@router.post("/{appointment_id}/messages", response_model=MessageOut)
async def send_message(appointment_id: str, msg_in: MessageCreate, current_user = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid Appointment ID")

    stmt_appt = select(Appointment).where(Appointment.id == appt_uuid, Appointment.user_id == current_user.id)
    appt = (await db.execute(stmt_appt)).scalar_one_or_none()
    
    if not appt:
        raise HTTPException(status_code=404, detail="Appointment not found or unauthorized")
        
    user_msg = Message(
        appointment_id=appt_uuid,
        sender="user",
        text=msg_in.text
    )
    db.add(user_msg)
    await db.commit()
    await db.refresh(user_msg)
    
    doctor_name = appt.doctor_name or "Doctor"
    doctor_specialty = appt.doctor_specialty or "Psychiatrist"
    
    original_for_ai = msg_in.text
    if hasattr(msg_in, 'original_for_ai') and msg_in.original_for_ai:
        original_for_ai = msg_in.original_for_ai

    doctor_text = await ai_therapist.generate_response(original_for_ai, doctor_name, doctor_specialty)
        
    doctor_msg = Message(
        appointment_id=appt_uuid,
        sender="doctor",
        text=doctor_text
    )
    db.add(doctor_msg)
    await db.commit()
    await db.refresh(doctor_msg)
    
    return user_msg


@router.websocket("/ws/{appointment_id}")
async def websocket_endpoint(websocket: WebSocket, appointment_id: str):
    await manager.connect(websocket, appointment_id)
    try:
        appt_uuid = uuid.UUID(appointment_id)
    except ValueError:
        await websocket.close()
        return

    try:
        async with AsyncSessionLocal() as db:
            stmt_appt = select(Appointment).where(Appointment.id == appt_uuid)
            appt = (await db.execute(stmt_appt)).scalar_one_or_none()
            
        while True:
            data = await websocket.receive_text()
            msg_data = json.loads(data)
            text = msg_data.get("text", "")
            original_for_ai = msg_data.get("original_for_ai", text)
            
            async with AsyncSessionLocal() as db:
                user_msg = Message(
                    appointment_id=appt_uuid,
                    sender="user",
                    text=text,
                    timestamp=datetime.utcnow()
                )
                db.add(user_msg)
                await db.commit()
                await db.refresh(user_msg)
                
                user_msg_dict = {
                    "id": str(user_msg.id),
                    "appointment_id": str(user_msg.appointment_id),
                    "sender": "user",
                    "text": user_msg.text,
                    "timestamp": user_msg.timestamp.isoformat()
                }
                
                await manager.broadcast_to_room(user_msg_dict, appointment_id)
                
                if appt:
                    doctor_name = appt.doctor_name
                    doctor_specialty = appt.doctor_specialty
                else:
                    doctor_name = "AI Therapist"
                    doctor_specialty = "General"
                    
                # Signal frontend that AI is typing
                await manager.broadcast_to_room({"type": "typing", "sender": "doctor"}, appointment_id)
                    
                ai_text = await ai_therapist.generate_response(original_for_ai, doctor_name, doctor_specialty)
                
                ai_msg = Message(
                    appointment_id=appt_uuid,
                    sender="doctor",
                    text=ai_text,
                    timestamp=datetime.utcnow()
                )
                db.add(ai_msg)
                await db.commit()
                await db.refresh(ai_msg)
                
                ai_msg_dict = {
                    "id": str(ai_msg.id),
                    "appointment_id": str(ai_msg.appointment_id),
                    "sender": "doctor",
                    "text": ai_msg.text,
                    "timestamp": ai_msg.timestamp.isoformat()
                }
                
                await asyncio.sleep(1.5)
                await manager.broadcast_to_room(ai_msg_dict, appointment_id)
            
    except WebSocketDisconnect:
        manager.disconnect(websocket, appointment_id)

@router.websocket("/webrtc/{appointment_id}")
async def webrtc_signaling(websocket: WebSocket, appointment_id: str):
    await webrtc_manager.connect(websocket, appointment_id)
    try:
        while True:
            data = await websocket.receive_text()
            await webrtc_manager.broadcast(data, appointment_id, websocket)
    except WebSocketDisconnect:
        webrtc_manager.disconnect(websocket, appointment_id)
