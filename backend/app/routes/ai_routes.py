from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from typing import List
import json
from sqlalchemy.ext.asyncio import AsyncSession
from app.database import get_db
from app.auth import get_current_user
from app.models.db_models import User, AIAnalysisResult
from app.services.ai_service import ai_therapist

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
async def triage_symptoms(request: TriageRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    try:
        result = await ai_therapist.analyze_symptoms(request.symptoms)
        
        # Log to DB
        analysis = AIAnalysisResult(
            user_id=current_user.id,
            analysis_type="triage",
            input_data=request.symptoms,
            output_data=json.dumps(result),
            confidence_score=0.9
        )
        db.add(analysis)
        await db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-note", response_model=NoteResponse)
async def generate_note(request: NoteRequest, current_user: User = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    if current_user.role != "doctor":
        raise HTTPException(status_code=403, detail="Only doctors can generate clinical notes.")
    try:
        result = await ai_therapist.generate_clinical_note(request.transcript)
        
        # Log to DB
        analysis = AIAnalysisResult(
            user_id=current_user.id,
            analysis_type="clinical_note",
            input_data=request.transcript,
            output_data=json.dumps(result),
            confidence_score=0.95
        )
        db.add(analysis)
        await db.commit()
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

