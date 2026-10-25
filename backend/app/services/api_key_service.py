"""
DC Scanner - API Key Management Service
Generates, stores, validates, and revokes developer API keys.
"""
import secrets
import hashlib
import sqlite3
from datetime import datetime, timezone
from typing import Optional, Tuple
from ..models.schemas import ApiKeyItem, CreateApiKeyResponse
from ..core.config import settings

class ApiKeyService:
    def __init__(self):
        self._db_path = settings.DATABASE_PATH
        self._init_db()

    def _init_db(self):
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS api_keys (
                key_id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                prefix TEXT NOT NULL,
                hashed_key TEXT NOT NULL,
                created_at TEXT NOT NULL,
                last_used_at TEXT,
                is_active INTEGER NOT NULL DEFAULT 1
            )
        """)
        conn.commit()
        conn.close()

    def create_key(self, name: str) -> CreateApiKeyResponse:
        key_id = f"key_{secrets.token_hex(8)}"
        raw_token = f"dcs_live_{secrets.token_urlsafe(32)}"
        prefix = raw_token[:12] + "..."
        hashed = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        now = datetime.now(timezone.utc)

        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO api_keys (key_id, name, prefix, hashed_key, created_at, is_active)
            VALUES (?, ?, ?, ?, ?, 1)
        """, (key_id, name, prefix, hashed, now.isoformat()))
        conn.commit()
        conn.close()

        return CreateApiKeyResponse(
            key_id=key_id,
            name=name,
            api_key=raw_token,
            created_at=now
        )

    def list_keys(self) -> list[ApiKeyItem]:
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("SELECT key_id, name, prefix, created_at, last_used_at, is_active FROM api_keys WHERE is_active = 1 ORDER BY created_at DESC")
        rows = cur.fetchall()
        conn.close()

        keys = []
        for r in rows:
            keys.append(ApiKeyItem(
                key_id=r[0],
                name=r[1],
                prefix=r[2],
                created_at=datetime.fromisoformat(r[3]),
                last_used_at=datetime.fromisoformat(r[4]) if r[4] else None,
                is_active=bool(r[5])
            ))
        return keys

    def revoke_key(self, key_id: str) -> bool:
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("UPDATE api_keys SET is_active = 0 WHERE key_id = ?", (key_id,))
        changed = cur.rowcount > 0
        conn.commit()
        conn.close()
        return changed

    def validate_key(self, raw_key: str) -> bool:
        if not raw_key or not raw_key.startswith("dcs_live_"):
            return False
        hashed = hashlib.sha256(raw_key.encode("utf-8")).hexdigest()
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("SELECT key_id FROM api_keys WHERE hashed_key = ? AND is_active = 1", (hashed,))
        row = cur.fetchone()
        if row:
            now = datetime.now(timezone.utc).isoformat()
            cur.execute("UPDATE api_keys SET last_used_at = ? WHERE key_id = ?", (now, row[0]))
            conn.commit()
            conn.close()
            return True
        conn.close()
        return False

api_key_service = ApiKeyService()
