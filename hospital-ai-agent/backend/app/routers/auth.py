import logging
from typing import Any, Dict, Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, Header, HTTPException

from app.services.auth import (
    create_access_token,
    hash_password,
    validate_access_token,
    verify_password,
)
from app.services.mongodb_client import (
    create_user,
    find_user_by_email,
    find_user_by_id,
    find_user_by_identifier,
    save_patient_profile,
)

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/auth", tags=["auth"])


class RegisterRequest(BaseModel):
    email: str
    password: str
    name: Optional[str] = None
    full_name: Optional[str] = None
    role: Optional[str] = "patient"
    phone: Optional[str] = None
    age: Optional[str] = "30"
    gender: Optional[str] = "Female"
    address: Optional[str] = ""
    appointment_id: Optional[str] = None
    department: Optional[str] = None


class LoginRequest(BaseModel):
    identifier: Optional[str] = None
    email: Optional[str] = None
    password: str
    role: Optional[str] = None


@router.post("/register")
def register(payload: RegisterRequest) -> Dict[str, Any]:
    raw_email = (payload.email or "").strip().lower()
    if not raw_email or "@" not in raw_email:
        raise HTTPException(status_code=400, detail="A valid email address is required")

    if not payload.password or len(payload.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")

    # Check if user already exists
    existing = find_user_by_email(raw_email)
    if existing:
        raise HTTPException(status_code=400, detail="An account with this email already exists")

    display_name = payload.name or payload.full_name or raw_email.split("@")[0].capitalize()
    role = (payload.role or "patient").lower()
    hashed_pw = hash_password(payload.password)

    appointment_id = payload.appointment_id
    if not appointment_id and role == "patient":
        import random
        appointment_id = f"APT-{random.randint(1000, 9999)}"

    user_data = {
        "email": raw_email,
        "password_hash": hashed_pw,
        "name": display_name,
        "full_name": display_name,
        "role": role,
        "phone": payload.phone or "",
        "age": payload.age or "30",
        "gender": payload.gender or "Female",
        "address": payload.address or "",
        "appointment_id": appointment_id,
        "department": payload.department or "",
    }

    created = create_user(user_data)
    user_id = str(created.get("id") or created.get("_id"))

    # If patient, initialize clinical profile in profiles collection
    if role == "patient":
        save_patient_profile(
            user_id=user_id,
            profile_data={
                "appointment_id": appointment_id,
                "full_name": display_name,
                "age": payload.age or "30",
                "gender": payload.gender or "Female",
                "phone": payload.phone or "",
                "address": payload.address or "",
            },
        )

    token = create_access_token({
        "sub": user_id,
        "email": raw_email,
        "role": role,
        "name": display_name,
        "appointment_id": appointment_id,
    })

    safe_user = {k: v for k, v in created.items() if k not in ("password_hash", "_id")}
    safe_user["id"] = user_id

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": safe_user,
    }


@router.post("/login")
def login(payload: LoginRequest) -> Dict[str, Any]:
    ident = (payload.identifier or payload.email or "").strip()
    if not ident:
        raise HTTPException(status_code=400, detail="Identifier or email is required")

    user = find_user_by_identifier(ident)
    if not user:
        user = find_user_by_email(ident)

    # Built-in demo fallback passwords for standard hospital personas
    demo_passwords = {
        "admin@hospital.com": "admin123",
        "s.jenkins@hospital.com": "doctor123",
        "e.rostova@hospital.com": "nurse123",
        "reception@hospital.com": "reception123",
    }

    if user:
        pw_hash = user.get("password_hash")
        valid = False
        if pw_hash and verify_password(payload.password, pw_hash):
            valid = True
        elif ident in demo_passwords and payload.password == demo_passwords[ident]:
            valid = True

        if not valid:
            raise HTTPException(status_code=401, detail="Invalid password")

        user_id = str(user.get("id") or user.get("_id"))
        token = create_access_token({
            "sub": user_id,
            "email": user.get("email"),
            "role": user.get("role"),
            "name": user.get("name"),
            "appointment_id": user.get("appointment_id"),
        })

        safe_user = {k: v for k, v in user.items() if k not in ("password_hash", "_id")}
        safe_user["id"] = user_id

        return {
            "access_token": token,
            "token_type": "bearer",
            "user": safe_user,
        }

    # If user not in MongoDB yet, check if it is a standard persona demo login
    if ident in demo_passwords and payload.password == demo_passwords[ident]:
        role = ident.split("@")[0]
        user_id = f"usr-{role}"
        token = create_access_token({
            "sub": user_id,
            "email": ident,
            "role": role,
            "name": f"{role.capitalize()} User",
        })
        return {
            "access_token": token,
            "token_type": "bearer",
            "user": {
                "id": user_id,
                "email": ident,
                "role": role,
                "name": f"{role.capitalize()} User",
            },
        }

    raise HTTPException(status_code=401, detail="Invalid credentials. User not found.")


@router.get("/me")
def get_current_user(authorization: str | None = Header(default=None)) -> Dict[str, Any]:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Missing or invalid Authorization header")

    access_token = authorization.split(" ", 1)[1]
    user_id = validate_access_token(access_token)
    user = find_user_by_id(user_id)
    if user:
        safe_user = {k: v for k, v in user.items() if k not in ("password_hash", "_id")}
        safe_user["id"] = user_id
        return safe_user

    return {"id": user_id, "role": "authenticated"}
