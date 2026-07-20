from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from app.auth import get_current_user
from app.cloudinary_service import upload_image
from typing import Dict, Any

router = APIRouter(prefix="/api/upload", tags=["Upload"])

@router.post("/", response_model=Dict[str, Any])
async def upload_file_endpoint(file: UploadFile = File(...), current_user = Depends(get_current_user)):
    url = upload_image(file.file, folder=f"ansaea/user_{current_user.id}")
    if not url:
        raise HTTPException(status_code=500, detail="Failed to upload file")
    
    return {"status": "success", "url": url}
