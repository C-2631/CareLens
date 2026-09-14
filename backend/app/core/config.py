import os

class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "CareLens HealthAI")
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    DEBUG: bool = os.getenv("DEBUG", "True").lower() == "true"
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "8000"))
    SECRET_KEY: str = os.getenv("SECRET_KEY", "CARELENS_ENTERPRISE_SECRET_KEY_PROD_READY_2026_HEALTH_AI")
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "720"))
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./carelens.db")
    CORS_ORIGINS: list = [
        origin.strip() for origin in os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173").split(",")
    ]

settings = Settings()
