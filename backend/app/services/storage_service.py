"""
DC Scanner - Storage and File Ingestion Service
Manages secure file uploads, cryptographic hash calculation, and retention.
"""
import os
import shutil
import hashlib
from pathlib import Path
from typing import Tuple, Optional
from fastapi import UploadFile, HTTPException
from ..core.config import settings

class StorageService:
    @staticmethod
    def validate_and_save(file: UploadFile, scan_id: str) -> Tuple[str, int, str, str, str]:
        """
        Validates PDF signature and size, computes hashes, and saves to private storage.
        Returns: (file_path, file_size, sha256, md5, sha1)
        """
        scan_dir = settings.UPLOAD_DIR / scan_id
        scan_dir.mkdir(parents=True, exist_ok=True)
        dest_path = scan_dir / "target.pdf"

        # Read initial chunk to verify magic bytes
        file.file.seek(0)
        header = file.file.read(1024)
        if not header.startswith(b"%PDF-"):
            # Clean up directory
            shutil.rmtree(scan_dir, ignore_errors=True)
            raise HTTPException(
                status_code=400,
                detail="Invalid file format: File header does not match PDF signature (%PDF-)"
            )

        file.file.seek(0)
        sha256_hash = hashlib.sha256()
        md5_hash = hashlib.md5()
        sha1_hash = hashlib.sha1()
        total_size = 0

        with open(dest_path, "wb") as buffer:
            while chunk := file.file.read(65536):
                total_size += len(chunk)
                if total_size > settings.MAX_UPLOAD_SIZE_BYTES:
                    buffer.close()
                    shutil.rmtree(scan_dir, ignore_errors=True)
                    raise HTTPException(
                        status_code=413,
                        detail=f"File exceeds maximum allowed upload size of {settings.MAX_UPLOAD_SIZE_BYTES / (1024*1024):.0f}MB"
                    )
                sha256_hash.update(chunk)
                md5_hash.update(chunk)
                sha1_hash.update(chunk)
                buffer.write(chunk)

        return (
            str(dest_path),
            total_size,
            sha256_hash.hexdigest(),
            md5_hash.hexdigest(),
            sha1_hash.hexdigest()
        )

    @staticmethod
    def get_file_path(scan_id: str) -> Optional[str]:
        """Retrieve filesystem path to uploaded target.pdf if exists."""
        dest_path = settings.UPLOAD_DIR / scan_id / "target.pdf"
        if dest_path.exists():
            return str(dest_path)
        return None

    @staticmethod
    def delete_scan_files(scan_id: str) -> bool:
        """Securely remove files associated with a scan."""
        scan_dir = settings.UPLOAD_DIR / scan_id
        if scan_dir.exists():
            shutil.rmtree(scan_dir, ignore_errors=True)
            return True
        return False
