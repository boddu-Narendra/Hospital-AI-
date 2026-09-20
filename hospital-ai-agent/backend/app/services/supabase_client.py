"""
Compatibility layer redirecting legacy supabase_client calls to mongodb_client and auth.
"""
from app.services.auth import validate_access_token
from app.services.mongodb_client import (
    get_chat_history,
    get_patient_profile,
    save_chat_history,
)


def get_supabase_client():
    from app.services.mongodb_client import get_mongodb_client
    return get_mongodb_client()


__all__ = [
    "get_supabase_client",
    "validate_access_token",
    "save_chat_history",
    "get_chat_history",
    "get_patient_profile",
]
