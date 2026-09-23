"""
CareLens — Master Personalized Healthcare & Medicine Recommendation System
FastAPI Application Entrypoint
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routers import auth, patient, prediction, recommendation, staff, admin, chat
from app.services.db_service import init_db

app = FastAPI(
    title="CareLens HealthAI API",
    description="Enterprise Clinical Decision-Support & Medicine Recommendation Platform",
    version="2.6.0"
)

# CORS Middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(patient.router, prefix="/api/v1")
app.include_router(prediction.router, prefix="/api/v1")
app.include_router(recommendation.router, prefix="/api/v1")
app.include_router(recommendation.router)  # Also mount at root for direct /recommend/presets etc.
app.include_router(staff.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")
app.include_router(chat.router, prefix="/api/v1")

@app.on_event("startup")
def on_startup():
    init_db()

@app.get("/")
def root():
    return {
        "system": "CareLens HealthAI",
        "status": "OPERATIONAL",
        "version": "2.6.0",
        "docs_url": "/docs",
        "endpoints": {
            "auth": "/api/v1/auth",
            "patient": "/api/v1/patient",
            "prediction": "/api/v1/predict",
            "recommendation": "/api/v1/recommend",
            "staff": "/api/v1/staff",
            "admin": "/api/v1/admin",
            "chat": "/api/v1/chat"
        }
    }

@app.get("/health")
def health():
    return {"status": "healthy", "service": "carelens-api", "database": "connected"}
