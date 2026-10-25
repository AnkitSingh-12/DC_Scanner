"""
DC Scanner - Main FastAPI Application
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .core.config import settings
from .api.v1.scans import router as scans_router
from .api.v1.explorer import router as explorer_router
from .api.v1.keys import router as keys_router
from .api.v1.health import router as health_router
from .api.v1.auth import router as auth_router
from .services.scan_service import scan_service

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup actions
    yield
    # Shutdown actions

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Automated PDF Intelligence, Active Content Detection, and Forensic Heuristics API",
    lifespan=lifespan
)

# Enable CORS for frontend and API consumers
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production domains
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers under /api/v1
api_v1_prefix = settings.API_V1_STR
app.include_router(health_router, prefix=api_v1_prefix)
app.include_router(auth_router, prefix=api_v1_prefix)
app.include_router(scans_router, prefix=api_v1_prefix)
app.include_router(explorer_router, prefix=api_v1_prefix)
app.include_router(keys_router, prefix=api_v1_prefix)

@app.get("/")
def root():
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs",
        "health_url": f"{api_v1_prefix}/health",
        "scans_url": f"{api_v1_prefix}/scans"
    }
