"""Verify Firebase identities and resolve their local database accounts."""

import os
import uuid

import firebase_admin
from fastapi import Depends, HTTPException, status
from fastapi.concurrency import run_in_threadpool
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import auth, credentials
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.db_models import User


def initialize_firebase():
    try:
        return firebase_admin.get_app()
    except ValueError:
        # Production can supply either these variables or application default credentials.
        private_key = os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n")
        project_id = os.getenv("FIREBASE_PROJECT_ID")
        if not (project_id and private_key):
            return firebase_admin.initialize_app()
        certificate = {
            "type": "service_account",
            "project_id": project_id,
            "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
            "private_key": private_key,
            "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
            "client_id": os.getenv("FIREBASE_CLIENT_ID"),
            "token_uri": os.getenv(
                "FIREBASE_TOKEN_URI", "https://oauth2.googleapis.com/token"
            ),
        }
        return firebase_admin.initialize_app(credentials.Certificate(certificate))


initialize_firebase()
security = HTTPBearer()


async def verify_identity(token: str, *, require_verified: bool = True) -> dict:
    try:
        identity = await run_in_threadpool(auth.verify_id_token, token)
    except Exception as error:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
            headers={"WWW-Authenticate": "Bearer"},
        ) from error

    if not identity.get("uid") or not identity.get("email"):
        raise HTTPException(status_code=401, detail="Token is missing user identity")
    if require_verified and not identity.get("email_verified"):
        raise HTTPException(status_code=403, detail="Email address not verified.")
    return identity


async def resolve_user(identity: dict, db: AsyncSession) -> User:
    user = await db.scalar(select(User).where(User.firebase_uid == identity["uid"]))
    if user:
        return user

    # Keep accounts created before Firebase migration linked to the same email.
    user = await db.scalar(select(User).where(User.email == identity["email"]))
    if user:
        user.firebase_uid = identity["uid"]
    else:
        username = identity["email"].split("@")[0]
        user = User(
            username=f"{username}_{uuid.uuid4().hex[:8]}",
            email=identity["email"],
            firebase_uid=identity["uid"],
            role="user",
        )
        db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def get_current_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    identity = await verify_identity(creds.credentials)
    return await resolve_user(identity, db)


async def get_registration_user(
    creds: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncSession = Depends(get_db),
) -> User:
    # Signup saves the selected role before sending the email verification link.
    # Every other protected endpoint still requires a verified email.
    identity = await verify_identity(creds.credentials, require_verified=False)
    return await resolve_user(identity, db)
