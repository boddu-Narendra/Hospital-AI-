from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

from app.routers.auth import router as auth_router
from app.routers.chat import router as chat_router
from app.routers.profile import router as profile_router


import os

load_dotenv()

app = FastAPI(title="Health AI Agent API", version="1.0.0")

# Allow local frontend development and production Render deployments
default_origins = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
]

frontend_urls = os.getenv("FRONTEND_URL", "")
allowed_origins_env = os.getenv("ALLOWED_ORIGINS", "")

additional_origins = []
for source in [frontend_urls, allowed_origins_env]:
    if source:
        additional_origins.extend([o.strip() for o in source.split(",") if o.strip()])

allowed_origins = list(dict.fromkeys(default_origins + additional_origins))
allowed_origin_regex = os.getenv("ALLOWED_ORIGIN_REGEX", r"^https:\/\/.*(\.onrender\.com|\.vercel\.app)$")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=allowed_origin_regex,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router, prefix="/api")
app.include_router(chat_router, prefix="/api")
app.include_router(profile_router, prefix="/api")


@app.get("/")
def health_check() -> dict:
    return {"status": "ok", "message": "Health AI Agent backend is running"}
