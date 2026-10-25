"""
DC Scanner - Backend Application Configuration
"""
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent.parent
STORAGE_DIR = BASE_DIR / "storage"
UPLOAD_DIR = STORAGE_DIR / "uploads"
DATABASE_PATH = STORAGE_DIR / "dc_scanner.db"

class Settings(BaseSettings):
    PROJECT_NAME: str = "DC Scanner"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Paths
    BASE_DIR: Path = BASE_DIR
    STORAGE_DIR: Path = STORAGE_DIR
    UPLOAD_DIR: Path = UPLOAD_DIR
    DATABASE_PATH: Path = DATABASE_PATH

    # Upload limits
    MAX_UPLOAD_SIZE_BYTES: int = 50 * 1024 * 1024  # 50 MB
    ALLOWED_EXTENSIONS: list[str] = [".pdf"]
    ALLOWED_MIME_TYPES: list[str] = ["application/pdf", "application/x-pdf"]
    
    # Retention
    DEFAULT_RETENTION_HOURS: int = 24
    
    # Worker concurrency and timeouts
    SCAN_TIMEOUT_SECONDS: int = 60
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "dc-scanner-secret-key-development-mode-2026")
    
    # Google OAuth 2.0 Credentials (Optional: enables live Google Identity verification)
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID", None)
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET", None)
    
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()

# Ensure directories exist
STORAGE_DIR.mkdir(parents=True, exist_ok=True)
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
