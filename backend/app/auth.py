from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import firebase_admin
from firebase_admin import credentials, auth
import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.db_models import User
import uuid

# Initialize Firebase Admin
# Expects GOOGLE_APPLICATION_CREDENTIALS environment variable to be set
# pointing to the service account key JSON file.
try:
    firebase_admin.get_app()
except ValueError:
    firebase_admin.initialize_app()

security = HTTPBearer()

async def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security), db: AsyncSession = Depends(get_db)) -> User:
    token = creds.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        if token.startswith("dev_"):
            # Local Dev Fallback Bypass
            email = token.replace("dev_", "")
            uid = f"mock_{email}"
        else:
            # Verify the Firebase ID token
            decoded_token = auth.verify_id_token(token)
            uid = decoded_token.get("uid")
            email = decoded_token.get("email")
        
        if not uid or not email:
            raise credentials_exception
            
    except Exception as e:
        print(f"Token verification failed: {e}")
        raise credentials_exception

    # Find the user by Firebase UID
    stmt = select(User).where(User.firebase_uid == uid)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()
    
    if user is None:
        # Handle first-time login: create or update user
        stmt_email = select(User).where(User.email == email)
        result_email = await db.execute(stmt_email)
        existing_user_by_email = result_email.scalar_one_or_none()
        
        if existing_user_by_email:
            # Update existing legacy user to use Firebase UID instead of password
            existing_user_by_email.firebase_uid = uid
            await db.commit()
            await db.refresh(existing_user_by_email)
            user = existing_user_by_email
        else:
            # Create a new user record
            username_base = email.split('@')[0]
            user = User(
                username=f"{username_base}_{str(uuid.uuid4())[:8]}",
                email=email,
                firebase_uid=uid,
                role="user"
            )
            db.add(user)
            await db.commit()
            await db.refresh(user)
    
    return user
