"""
DC Scanner - Health Check Endpoint
"""
import time
import pypdf
import pikepdf
import fitz  # pymupdf
from fastapi import APIRouter
from ...core.config import settings

START_TIME = time.time()
router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    """System health check and engine capability report."""
    uptime_seconds = round(time.time() - START_TIME, 2)
    return {
        "status": "HEALTHY",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "uptime_seconds": uptime_seconds,
        "engines": {
            "pypdf": pypdf.__version__,
            "pikepdf": pikepdf.__version__,
            "pymupdf": fitz.__version__
        },
        "limits": {
            "max_file_size_bytes": settings.MAX_UPLOAD_SIZE_BYTES,
            "max_file_size_mb": settings.MAX_UPLOAD_SIZE_BYTES / (1024 * 1024)
        }
    }
