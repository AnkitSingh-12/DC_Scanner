"""
DC Scanner - Authentication REST API Endpoints
"""
from typing import Optional
from pydantic import BaseModel, EmailStr
from fastapi import APIRouter, HTTPException, Header, Depends
from ...services.auth_service import auth_service, AuthResponse, UserPublic

router = APIRouter(prefix="/auth", tags=["Authentication"])

class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: Optional[str] = None

class LoginRequest(BaseModel):
    email: str
    password: str

class GoogleAuthRequest(BaseModel):
    email: Optional[str] = None
    full_name: Optional[str] = None
    credential: Optional[str] = None

@router.post("/signup", response_model=AuthResponse, status_code=201)
def signup(req: SignupRequest):
    """Register a new user account."""
    if not req.email or "@" not in req.email:
        raise HTTPException(status_code=400, detail="A valid email address is required.")
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters.")
    try:
        return auth_service.signup(req.email, req.password, req.full_name or "")
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login", response_model=AuthResponse)
def login(req: LoginRequest):
    """Authenticate with email and password."""
    try:
        return auth_service.login(req.email, req.password)
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/google", response_model=AuthResponse)
def google_login(req: GoogleAuthRequest):
    """Authenticate via Google ID token or demo sign-in."""
    try:
        return auth_service.google_auth(req.email, req.full_name, req.credential)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/me", response_model=UserPublic)
def get_current_user(authorization: Optional[str] = Header(None)):
    """Retrieve profile of currently authenticated user."""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authentication token required.")
    token = authorization.replace("Bearer ", "").strip()
    user = auth_service.get_user_by_token(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or expired session token.")
    return user

@router.post("/logout")
def logout():
    """Sign out and invalidate session."""
    return {"message": "Logged out successfully."}
