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

# Initialize Firebase Admin using environment variables directly
try:
    firebase_admin.get_app()
except ValueError:
    firebase_cred_dict = {
        "type": os.environ.get("FIREBASE_TYPE", "service_account"),
        "project_id": os.environ.get("FIREBASE_PROJECT_ID"),
        "private_key_id": os.environ.get("FIREBASE_PRIVATE_KEY_ID"),
        "private_key": os.environ.get("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
        "client_email": os.environ.get("FIREBASE_CLIENT_EMAIL"),
        "client_id": os.environ.get("FIREBASE_CLIENT_ID"),
        "auth_uri": os.environ.get("FIREBASE_AUTH_URI", "https://accounts.google.com/o/oauth2/auth"),
        "token_uri": os.environ.get("FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"),
        "auth_provider_x509_cert_url": os.environ.get("FIREBASE_AUTH_PROVIDER_X509_CERT_URL", "https://www.googleapis.com/oauth2/v1/certs"),
        "client_x509_cert_url": os.environ.get("FIREBASE_CLIENT_X509_CERT_URL"),
        "universe_domain": os.environ.get("FIREBASE_UNIVERSE_DOMAIN", "googleapis.com")
    }
    
    if firebase_cred_dict.get("project_id") and firebase_cred_dict.get("private_key"):
        cred = credentials.Certificate(firebase_cred_dict)
        firebase_admin.initialize_app(cred)
    else:
        # Fallback to default
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
        # Verify the Firebase ID token
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token.get("uid")
        email = decoded_token.get("email")
        email_verified = decoded_token.get("email_verified", False)
        
        if not uid or not email:
            raise credentials_exception
            
        if not email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email address not verified."
            )
            
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
