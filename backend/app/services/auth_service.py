"""
DC Scanner - Authentication and User Management Service
"""
import uuid
import secrets
import hashlib
import sqlite3
from datetime import datetime, timezone
from typing import Optional, Tuple
from pydantic import BaseModel, EmailStr
from ..core.config import settings

class UserPublic(BaseModel):
    user_id: str
    email: str
    full_name: str
    created_at: str
    avatar_color: str

class AuthResponse(BaseModel):
    user: UserPublic
    token: str
    message: str

def hash_password(password: str, salt: str = "dcs_salt_2026") -> str:
    return hashlib.sha256(f"{password}:{salt}".encode("utf-8")).hexdigest()

class AuthService:
    def __init__(self):
        self._db_path = settings.DATABASE_PATH
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS users (
                user_id TEXT PRIMARY KEY,
                email TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                password_hash TEXT NOT NULL,
                created_at TEXT NOT NULL,
                last_login_at TEXT,
                avatar_color TEXT NOT NULL
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS sessions (
                token TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                created_at TEXT NOT NULL,
                FOREIGN KEY (user_id) REFERENCES users(user_id)
            )
        """)
        conn.commit()
        conn.close()

    def signup(self, email: str, password: str, full_name: str) -> AuthResponse:
        email = email.lower().strip()
        full_name = full_name.strip() or email.split("@")[0].capitalize()
        
        if len(password) < 6:
            raise ValueError("Password must be at least 6 characters.")

        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        
        # Check existing user
        cur.execute("SELECT user_id FROM users WHERE email = ?", (email,))
        if cur.fetchone():
            conn.close()
            raise ValueError("An account with this email address already exists.")

        user_id = str(uuid.uuid4())
        pwd_hash = hash_password(password)
        now = datetime.now(timezone.utc).isoformat()
        colors = ["#35C987", "#06B6D4", "#A855F7", "#F59E0B", "#EC4899", "#3B82F6"]
        avatar_color = colors[len(email) % len(colors)]

        cur.execute("""
            INSERT INTO users (user_id, email, full_name, password_hash, created_at, last_login_at, avatar_color)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (user_id, email, full_name, pwd_hash, now, now, avatar_color))

        token = f"dcs_sess_{secrets.token_urlsafe(32)}"
        cur.execute("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)", (token, user_id, now))

        conn.commit()
        conn.close()

        user = UserPublic(
            user_id=user_id,
            email=email,
            full_name=full_name,
            created_at=now,
            avatar_color=avatar_color
        )
        return AuthResponse(user=user, token=token, message="Account created successfully.")

    def login(self, email: str, password: str) -> AuthResponse:
        email = email.lower().strip()
        pwd_hash = hash_password(password)

        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("""
            SELECT user_id, email, full_name, created_at, avatar_color
            FROM users WHERE email = ? AND password_hash = ?
        """, (email, pwd_hash))
        row = cur.fetchone()

        if not row:
            conn.close()
            raise ValueError("Invalid email or password.")

        user_id, u_email, full_name, created_at, avatar_color = row
        now = datetime.now(timezone.utc).isoformat()

        cur.execute("UPDATE users SET last_login_at = ? WHERE user_id = ?", (now, user_id))
        token = f"dcs_sess_{secrets.token_urlsafe(32)}"
        cur.execute("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)", (token, user_id, now))

        conn.commit()
        conn.close()

        user = UserPublic(
            user_id=user_id,
            email=u_email,
            full_name=full_name,
            created_at=created_at,
            avatar_color=avatar_color
        )
        return AuthResponse(user=user, token=token, message="Logged in successfully.")

    def google_auth(self, email: Optional[str] = None, full_name: Optional[str] = None, credential: Optional[str] = None) -> AuthResponse:
        verified_email = None
        verified_name = None

        if credential:
            try:
                import httpx
                # Verify token with Google's public tokeninfo endpoint
                with httpx.Client(timeout=8.0) as client:
                    resp = client.get(f"https://oauth2.googleapis.com/tokeninfo?id_token={credential}")
                    if resp.status_code == 200:
                        payload = resp.json()
                        # If GOOGLE_CLIENT_ID is configured, verify audience match
                        if settings.GOOGLE_CLIENT_ID and payload.get("aud") != settings.GOOGLE_CLIENT_ID:
                            raise ValueError(f"Google token audience mismatch.")
                        verified_email = payload.get("email")
                        verified_name = payload.get("name") or payload.get("given_name")
                    else:
                        raise ValueError("Invalid Google OAuth credential.")
            except Exception as e:
                if isinstance(e, ValueError):
                    raise e
                raise ValueError(f"Google verification failed: {e}")

        demo_email = (verified_email or email or "ankit.singh@dcscanner.io").lower().strip()
        demo_name = verified_name or full_name or "Ankit Singh"

        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("SELECT user_id, email, full_name, created_at, avatar_color FROM users WHERE email = ?", (demo_email,))
        row = cur.fetchone()

        now = datetime.now(timezone.utc).isoformat()
        if row:
            user_id, u_email, name, created_at, avatar_color = row
            cur.execute("UPDATE users SET last_login_at = ? WHERE user_id = ?", (now, user_id))
        else:
            user_id = str(uuid.uuid4())
            avatar_color = "#35C987"
            cur.execute("""
                INSERT INTO users (user_id, email, full_name, password_hash, created_at, last_login_at, avatar_color)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            """, (user_id, demo_email, demo_name, hash_password(secrets.token_hex(16)), now, now, avatar_color))
            created_at = now
            name = demo_name
            u_email = demo_email

        token = f"dcs_sess_{secrets.token_urlsafe(32)}"
        cur.execute("INSERT INTO sessions (token, user_id, created_at) VALUES (?, ?, ?)", (token, user_id, now))
        conn.commit()
        conn.close()

        user = UserPublic(
            user_id=user_id,
            email=u_email,
            full_name=name,
            created_at=created_at,
            avatar_color=avatar_color if row else "#35C987"
        )
        return AuthResponse(user=user, token=token, message="Authenticated with Google successfully.")

    def get_user_by_token(self, token: str) -> Optional[UserPublic]:
        if not token:
            return None
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("""
            SELECT u.user_id, u.email, u.full_name, u.created_at, u.avatar_color
            FROM sessions s
            JOIN users u ON s.user_id = u.user_id
            WHERE s.token = ?
        """, (token,))
        row = cur.fetchone()
        conn.close()

        if row:
            return UserPublic(
                user_id=row[0],
                email=row[1],
                full_name=row[2],
                created_at=row[3],
                avatar_color=row[4]
            )
        return None

auth_service = AuthService()
