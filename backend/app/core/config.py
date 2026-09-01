import os
from typing import List
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "SACHAI.AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Environment & Host
    ENV: str = "development"
    DEBUG: bool = True
    
    # Secrets & Authentication
    AUTH_SECRET: str = "sachai-super-secret-key-change-in-production-min-32-chars-long"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database (Postgres / Supabase with SQLite automatic fallback)
    DATABASE_URL: str = "sqlite+aiosqlite:///./sachai.db"
    
    # Redis (with in-memory async fallback)
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # External AI & API Keys
    GEMINI_API_KEY: str = ""
    GOOGLE_FACT_CHECK_API_KEY: str = ""
    SEARCH_API_KEY: str = ""
    SEARCH_PROVIDER: str = "duckduckgo"  # duckduckgo, tavily, serper
    
    # CORS
    CORS_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    
    # Uploads & Storage
    UPLOAD_DIR: str = "./uploads"
    MAX_UPLOAD_SIZE_MB: int = 10
    ALLOWED_IMAGE_TYPES: List[str] = ["image/jpeg", "image/png", "image/webp"]
    
    # Source Reliability Weights (Configurable)
    WEIGHT_OFFICIAL_PRIMARY: float = 1.00
    WEIGHT_SCIENTIFIC_PRIMARY: float = 0.95
    WEIGHT_ESTABLISHED_NEWS: float = 0.85
    WEIGHT_FACT_CHECKER: float = 0.85
    WEIGHT_KNOWN_SECONDARY: float = 0.70
    WEIGHT_GENERAL_WEBSITE: float = 0.40
    WEIGHT_SOCIAL_MEDIA: float = 0.20
    WEIGHT_UNKNOWN: float = 0.10

    class Config:
        env_file = ".env"
        extra = "ignore"

settings = Settings()
