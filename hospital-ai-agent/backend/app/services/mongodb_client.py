import logging
import os
from datetime import datetime
from typing import Any, Dict, List, Optional
from pymongo import MongoClient

logger = logging.getLogger(__name__)

# Fallback in-memory storage for offline / demo mode when MONGODB_URI is not provided
_in_memory_db: Dict[str, List[Dict[str, Any]]] = {
    "users": [],
    "chat_history": [],
    "profiles": [],
}

_mongo_client: Optional[MongoClient] = None


def get_mongodb_client() -> Optional[MongoClient]:
    global _mongo_client
    uri = os.getenv("MONGODB_URI")
    if not uri or uri.startswith("your_") or "example" in uri:
        return None

    if _mongo_client is None:
        try:
            _mongo_client = MongoClient(uri, serverSelectionTimeoutMS=4000)
            # Ping database to verify connection
            _mongo_client.admin.command("ping")
            logger.info("Connected to MongoDB Atlas successfully")
        except Exception as exc:
            logger.warning(f"Could not connect to MongoDB Atlas ({exc}). Using offline mode.")
            _mongo_client = None

    return _mongo_client


def get_database():
    client = get_mongodb_client()
    if client is not None:
        db_name = os.getenv("MONGODB_DB_NAME", "hospital_ai_db")
        return client.get_default_database(default=db_name)
    return None


# -----------------------------------------------------------------------------
# User Storage Operations
# -----------------------------------------------------------------------------
def find_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    normalized_email = (email or "").strip().lower()
    db = get_database()
    if db is not None:
        try:
            doc = db["users"].find_one({"email": normalized_email})
            if doc:
                doc["id"] = str(doc["_id"])
                return doc
        except Exception as exc:
            logger.error(f"Error querying user by email: {exc}")

    # Offline fallback
    for u in _in_memory_db["users"]:
        if u.get("email", "").lower() == normalized_email:
            return u
    return None


def find_user_by_identifier(identifier: str) -> Optional[Dict[str, Any]]:
    raw = (identifier or "").strip()
    db = get_database()
    if db is not None:
        try:
            doc = db["users"].find_one({
                "$or": [
                    {"email": raw.lower()},
                    {"appointment_id": raw.upper()},
                    {"phone": raw},
                    {"id": raw},
                ]
            })
            if doc:
                doc["id"] = str(doc["_id"])
                return doc
        except Exception as exc:
            logger.error(f"Error querying user by identifier: {exc}")

    # Offline fallback
    for u in _in_memory_db["users"]:
        if (
            u.get("email", "").lower() == raw.lower()
            or u.get("appointment_id", "").upper() == raw.upper()
            or u.get("phone") == raw
            or u.get("id") == raw
        ):
            return u
    return None


def find_user_by_id(user_id: str) -> Optional[Dict[str, Any]]:
    db = get_database()
    if db is not None:
        try:
            from bson import ObjectId
            query = {"id": user_id}
            if ObjectId.is_valid(user_id):
                query = {"$or": [{"_id": ObjectId(user_id)}, {"id": user_id}]}
            doc = db["users"].find_one(query)
            if doc:
                doc["id"] = str(doc.get("_id", user_id))
                return doc
        except Exception as exc:
            logger.error(f"Error querying user by ID: {exc}")

    for u in _in_memory_db["users"]:
        if u.get("id") == user_id:
            return u
    return None


def create_user(user_data: Dict[str, Any]) -> Dict[str, Any]:
    doc = dict(user_data)
    doc["created_at"] = doc.get("created_at") or datetime.utcnow().isoformat()
    db = get_database()
    if db is not None:
        try:
            res = db["users"].insert_one(doc)
            doc["id"] = str(res.inserted_id)
            return doc
        except Exception as exc:
            logger.error(f"Error creating user in MongoDB: {exc}")

    user_id = doc.get("id") or f"usr-{int(datetime.utcnow().timestamp())}"
    doc["id"] = user_id
    _in_memory_db["users"].append(doc)
    return doc


# -----------------------------------------------------------------------------
# Chat History Operations
# -----------------------------------------------------------------------------
def save_chat_history(
    user_id: str,
    user_message: str,
    ai_response: str,
    response_type: str,
    severity: str = "low",
    emergency: bool = False,
    current_symptom: Optional[str] = None,
) -> None:
    record = {
        "user_id": user_id,
        "user_message": user_message,
        "ai_response": ai_response,
        "response_type": response_type,
        "severity": severity,
        "emergency": emergency,
        "current_symptom": current_symptom,
        "created_at": datetime.utcnow().isoformat(),
    }

    db = get_database()
    if db is not None:
        try:
            db["chat_history"].insert_one(record)
            return
        except Exception as exc:
            logger.error(f"Error saving chat history to MongoDB: {exc}")

    _in_memory_db["chat_history"].append(record)


def get_chat_history(user_id: str) -> List[Dict[str, Any]]:
    db = get_database()
    if db is not None:
        try:
            cursor = (
                db["chat_history"]
                .find({"user_id": user_id}, {"_id": 0})
                .sort("created_at", 1)
            )
            return list(cursor)
        except Exception as exc:
            logger.error(f"Error getting chat history from MongoDB: {exc}")

    return [item for item in _in_memory_db["chat_history"] if item.get("user_id") == user_id]


# -----------------------------------------------------------------------------
# Patient Profile Operations
# -----------------------------------------------------------------------------
def get_patient_profile(user_id: str) -> Dict[str, Any]:
    db = get_database()
    if db is not None:
        try:
            from bson import ObjectId
            query = {"user_id": user_id}
            if ObjectId.is_valid(user_id):
                query = {"$or": [{"user_id": user_id}, {"_id": ObjectId(user_id)}]}
            doc = db["profiles"].find_one(query, {"_id": 0})
            if doc:
                return doc
        except Exception as exc:
            logger.error(f"Error getting profile from MongoDB: {exc}")

    for p in _in_memory_db["profiles"]:
        if p.get("user_id") == user_id:
            return p

    # Fallback to user account info if exists
    user = find_user_by_id(user_id)
    if user:
        return {
            "appointment_id": user.get("appointment_id", "APT-8821"),
            "full_name": user.get("full_name") or user.get("name", "Demo Patient"),
            "age": user.get("age", "30"),
            "gender": user.get("gender", "Female"),
            "phone": user.get("phone", "+1 (555) 019-2834"),
            "address": user.get("address", "104 Metro Medical Square, Suite 4B"),
            "created_at": user.get("created_at", datetime.utcnow().isoformat()),
        }
    return {}


def save_patient_profile(user_id: str, profile_data: Dict[str, Any]) -> Dict[str, Any]:
    doc = dict(profile_data)
    doc["user_id"] = user_id
    doc["updated_at"] = datetime.utcnow().isoformat()

    db = get_database()
    if db is not None:
        try:
            db["profiles"].update_one(
                {"user_id": user_id},
                {"$set": doc},
                upsert=True,
            )
            doc.pop("_id", None)
            return doc
        except Exception as exc:
            logger.error(f"Error saving profile in MongoDB: {exc}")

    for i, p in enumerate(_in_memory_db["profiles"]):
        if p.get("user_id") == user_id:
            _in_memory_db["profiles"][i] = {**p, **doc}
            return _in_memory_db["profiles"][i]

    _in_memory_db["profiles"].append(doc)
    return doc
