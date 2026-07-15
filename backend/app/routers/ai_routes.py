from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
from app.auth import get_current_user
from app.db_models import User
from app.ai_service import ai_therapist

router = APIRouter(prefix="/api/ai", tags=["AI Intelligence"])

class TriageRequest(BaseModel):
    symptoms: str

class TriageResponse(BaseModel):
    triage_level: str
    recommendation: str
    possible_conditions: List[str]

class NoteRequest(BaseModel):
    transcript: str

class NoteResponse(BaseModel):
    subjective: str
    objective: str
    assessment: str
    plan: str
    icd10_codes: List[str]

@router.post("/triage", response_model=TriageResponse)
async def triage_symptoms(request: TriageRequest, current_user: User = Depends(get_current_user)):
    try:
        result = await ai_therapist.analyze_symptoms(request.symptoms)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-note", response_model=NoteResponse)
async def generate_note(request: NoteRequest, current_user: User = Depends(get_current_user)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can generate clinical notes.")
    try:
        result = await ai_therapist.generate_clinical_note(request.transcript)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
