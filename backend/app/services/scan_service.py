"""
DC Scanner - Scan Orchestration and Background Execution Service
"""
import uuid
import time
import sqlite3
import json
import asyncio
import shutil
from datetime import datetime, timezone
from typing import Optional, Tuple
from pathlib import Path

from ..models.schemas import (
    ScanRecord, ScanStatus, ScanProfile, ScanSummary, RiskLevel,
    RiskAssessment, PDFMetadata, Finding, CheckResult, CheckStatus
)
from ..analyzers.metadata_analyzer import MetadataAnalyzer
from ..analyzers.structure_analyzer import StructureAnalyzer
from ..analyzers.security_analyzer import SecurityAnalyzer
from ..analyzers.risk_engine import RiskEngine
from .storage_service import StorageService
from ..core.config import settings

class ScanService:
    def __init__(self):
        self._memory_scans: dict[str, ScanRecord] = {}
        self._db_path = settings.DATABASE_PATH
        self._init_db()
        self._load_from_db()

    def _init_db(self):
        conn = sqlite3.connect(self._db_path)
        cur = conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS scans (
                scan_id TEXT PRIMARY KEY,
                filename TEXT NOT NULL,
                file_size INTEGER NOT NULL,
                sha256 TEXT NOT NULL,
                md5 TEXT NOT NULL,
                sha1 TEXT NOT NULL,
                status TEXT NOT NULL,
                profile TEXT NOT NULL,
                progress_percent INTEGER NOT NULL,
                current_stage TEXT NOT NULL,
                created_at TEXT NOT NULL,
                completed_at TEXT,
                risk_level TEXT,
                risk_score INTEGER,
                findings_count INTEGER DEFAULT 0,
                full_json TEXT
            )
        """)
        conn.commit()
        conn.close()

    def _load_from_db(self):
        try:
            conn = sqlite3.connect(self._db_path)
            cur = conn.cursor()
            cur.execute("SELECT scan_id, full_json FROM scans ORDER BY created_at DESC LIMIT 100")
            rows = cur.fetchall()
            for scan_id, full_json in rows:
                if full_json:
                    try:
                        record_dict = json.loads(full_json)
                        self._memory_scans[scan_id] = ScanRecord(**record_dict)
                    except Exception:
                        pass
            conn.close()
        except Exception:
            pass

    def _save_to_db(self, record: ScanRecord):
        try:
            conn = sqlite3.connect(self._db_path)
            cur = conn.cursor()
            cur.execute("""
                INSERT OR REPLACE INTO scans (
                    scan_id, filename, file_size, sha256, md5, sha1,
                    status, profile, progress_percent, current_stage,
                    created_at, completed_at, risk_level, risk_score,
                    findings_count, full_json
                ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                record.scan_id,
                record.filename,
                record.file_size,
                record.sha256,
                record.md5,
                record.sha1,
                record.status.value,
                record.profile.value,
                record.progress_percent,
                record.current_stage,
                record.created_at.isoformat(),
                record.completed_at.isoformat() if record.completed_at else None,
                record.risk.risk_level.value if record.risk else None,
                record.risk.risk_score if record.risk else None,
                len(record.findings),
                record.model_dump_json()
            ))
            conn.commit()
            conn.close()
        except Exception:
            pass

    def create_scan(
        self,
        filename: str,
        file_size: int,
        sha256: str,
        md5: str,
        sha1: str,
        profile: ScanProfile = ScanProfile.STANDARD
    ) -> ScanRecord:
        scan_id = str(uuid.uuid4())
        now = datetime.now(timezone.utc)
        record = ScanRecord(
            scan_id=scan_id,
            filename=filename,
            file_size=file_size,
            sha256=sha256,
            md5=md5,
            sha1=sha1,
            status=ScanStatus.QUEUED,
            profile=profile,
            progress_percent=5,
            current_stage="File Received & Validated",
            created_at=now
        )
        self._memory_scans[scan_id] = record
        self._save_to_db(record)
        return record

    def get_scan(self, scan_id: str) -> Optional[ScanRecord]:
        return self._memory_scans.get(scan_id)

    def list_scans(
        self,
        search: Optional[str] = None,
        risk_level: Optional[RiskLevel] = None,
        limit: int = 50,
        offset: int = 0
    ) -> Tuple[list[ScanSummary], int]:
        all_scans = list(self._memory_scans.values())
        all_scans.sort(key=lambda s: s.created_at, reverse=True)

        filtered = []
        for s in all_scans:
            if search:
                term = search.lower()
                if term not in s.filename.lower() and term not in s.sha256.lower():
                    continue
            if risk_level and s.risk and s.risk.risk_level != risk_level:
                continue
            
            filtered.append(ScanSummary(
                scan_id=s.scan_id,
                filename=s.filename,
                file_size=s.file_size,
                sha256=s.sha256,
                status=s.status,
                risk_level=s.risk.risk_level if s.risk else None,
                risk_score=s.risk.risk_score if s.risk else None,
                findings_count=len(s.findings),
                created_at=s.created_at,
                completed_at=s.completed_at
            ))

        total = len(filtered)
        paginated = filtered[offset : offset + limit]
        return paginated, total

    def delete_scan(self, scan_id: str) -> bool:
        found = False
        if scan_id in self._memory_scans:
            del self._memory_scans[scan_id]
            found = True
        StorageService.delete_scan_files(scan_id)
        try:
            conn = sqlite3.connect(self._db_path)
            cur = conn.cursor()
            cur.execute("DELETE FROM scans WHERE scan_id = ?", (scan_id,))
            if cur.rowcount > 0:
                found = True
            conn.commit()
            conn.close()
        except Exception:
            pass
        return found

    def delete_all_scans(self) -> int:
        count = len(self._memory_scans)
        self._memory_scans.clear()
        try:
            conn = sqlite3.connect(self._db_path)
            cur = conn.cursor()
            cur.execute("SELECT COUNT(*) FROM scans")
            row = cur.fetchone()
            if row:
                count = max(count, row[0])
            cur.execute("DELETE FROM scans")
            conn.commit()
            conn.close()
        except Exception:
            pass

        if settings.UPLOAD_DIR.exists():
            for child in settings.UPLOAD_DIR.iterdir():
                if child.is_dir():
                    shutil.rmtree(child, ignore_errors=True)
        return count

    def execute_scan_sync(self, scan_id: str, file_path: str):
        """Synchronous analysis pipeline with progressive stage updates."""
        record = self._memory_scans.get(scan_id)
        if not record:
            return

        start_time = time.perf_counter()
        record.status = ScanStatus.PROCESSING
        record.findings = []
        record.checks = []
        record.javascript_items = []
        record.detected_uris = []
        record.attachments = []
        record.document_actions = []
        record.structural_anomalies = []

        try:
            # Stage 1: Validation
            record.current_stage = "Validating PDF Structure & Catalog"
            record.progress_percent = 15
            time.sleep(0.15)  # Smooth transition for progress UI

            # Stage 2: Metadata Extraction
            record.current_stage = "Extracting Metadata & Version Information"
            record.progress_percent = 35
            meta_analyzer = MetadataAnalyzer(file_path)
            metadata, meta_checks, meta_findings = meta_analyzer.analyze()
            record.metadata = metadata
            record.checks.extend(meta_checks)
            record.findings.extend(meta_findings)
            time.sleep(0.15)

            # Stage 3: Low-Level Structure & Streams
            record.current_stage = "Inspecting Object Streams & Anomaly Forensics"
            record.progress_percent = 60
            struct_analyzer = StructureAnalyzer(file_path)
            anomalies, struct_checks, struct_findings, struct_meta = struct_analyzer.analyze()
            record.structural_anomalies = anomalies
            record.checks.extend(struct_checks)
            record.findings.extend(struct_findings)
            time.sleep(0.15)

            # Stage 4: Active Content & Security Rules
            record.current_stage = "Auditing Active Content, JavaScript, Actions & Payloads"
            record.progress_percent = 85
            sec_analyzer = SecurityAnalyzer(file_path)
            sec_findings, js_items, uris, attachments, actions, sec_checks = sec_analyzer.analyze()
            record.findings.extend(sec_findings)
            record.javascript_items = js_items
            record.detected_uris = uris
            record.attachments = attachments
            record.document_actions = actions
            record.checks.extend(sec_checks)
            time.sleep(0.15)

            # Stage 5: Risk Engine & Synthesis
            record.current_stage = "Synthesizing Risk Score & Building Dossier"
            record.progress_percent = 95
            risk_assessment = RiskEngine.calculate(record.findings, record.checks)
            record.risk = risk_assessment

            # Complete
            record.progress_percent = 100
            record.current_stage = "Analysis Complete"
            record.status = ScanStatus.COMPLETED
            record.completed_at = datetime.now(timezone.utc)
            record.duration_ms = round((time.perf_counter() - start_time) * 1000, 2)

        except Exception as e:
            record.status = ScanStatus.FAILED
            record.error = str(e)
            record.current_stage = "Analysis Failed"
            record.progress_percent = 100
            record.completed_at = datetime.now(timezone.utc)
            record.checks.append(CheckResult(
                check_id="CHK-EXEC-ERR",
                name="Execution Pipeline",
                category="System",
                status=CheckStatus.FAILED,
                findings_count=1,
                details=f"Scan crashed during execution: {str(e)}"
            ))
            record.risk = RiskAssessment(
                risk_level=RiskLevel.INCONCLUSIVE,
                risk_score=50,
                safety_score=50,
                verdict_headline="Analysis Failed",
                verdict_summary=f"Internal processing failed: {str(e)}",
                confidence="LOW"
            )
        finally:
            self._save_to_db(record)

    async def execute_scan_background(self, scan_id: str, file_path: str):
        """Dispatches analysis to background thread so API doesn't block."""
        await asyncio.to_thread(self.execute_scan_sync, scan_id, file_path)

scan_service = ScanService()
