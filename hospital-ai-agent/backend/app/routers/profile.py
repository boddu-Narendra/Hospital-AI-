import logging
from typing import Any, Dict
from fastapi import APIRouter, Header, HTTPException

from app.services.auth import validate_access_token
from app.services.mongodb_client import get_patient_profile, save_patient_profile

logger = logging.getLogger(__name__)
router = APIRouter(tags=["profile"])


@router.get("/profile")
def get_profile(authorization: str | None = Header(default=None)) -> dict:
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        access_token = authorization.split(" ", 1)[1]
        user_id = validate_access_token(access_token)
        profile = get_patient_profile(user_id)
        return profile if profile else {}
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Profile error: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to get profile: {exc}") from exc


@router.post("/profile")
def update_profile(payload: Dict[str, Any], authorization: str | None = Header(default=None)) -> dict:
    try:
        if not authorization or not authorization.startswith("Bearer "):
            raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")
        access_token = authorization.split(" ", 1)[1]
        user_id = validate_access_token(access_token)
        saved = save_patient_profile(user_id, payload)
        return saved
    except HTTPException:
        raise
    except Exception as exc:
        logger.error(f"Update profile error: {exc}")
        raise HTTPException(status_code=500, detail=f"Failed to update profile: {exc}") from exc