"""
DC Scanner - Data Models and Schemas
"""
from enum import Enum
from typing import Optional, Any
from pydantic import BaseModel, Field
from datetime import datetime

class ScanProfile(str, Enum):
    STANDARD = "standard"
    DEEP = "deep"
    FAST = "fast"

class FindingSeverity(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    INFO = "INFO"

class RiskLevel(str, Enum):
    CLEAN = "CLEAN"
    LOW = "LOW"
    MEDIUM = "MEDIUM"
    HIGH = "HIGH"
    INCONCLUSIVE = "INCONCLUSIVE"

class CheckStatus(str, Enum):
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"
    SKIPPED = "SKIPPED"
    UNAVAILABLE = "UNAVAILABLE"

class ScanStatus(str, Enum):
    QUEUED = "QUEUED"
    PROCESSING = "PROCESSING"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"

class Finding(BaseModel):
    rule_id: str
    title: str
    severity: FindingSeverity
    confidence: str = "HIGH"  # HIGH, MEDIUM, LOW
    category: str  # Active Content, Links, Attachments, Structure, Metadata
    evidence: str
    explanation: str
    remediation: str
    location: Optional[str] = None
    object_id: Optional[str] = None

class ExtractedJavaScript(BaseModel):
    id: str
    source_object: str
    trigger_type: str
    code_preview: str
    full_length: int
    suspicious_patterns: list[str] = []
    is_obfuscated: bool = False

class ExtractedURI(BaseModel):
    url: str
    domain: str
    protocol: str
    page: Optional[int] = None
    is_ip_address: bool = False
    is_suspicious_tld: bool = False
    risk_flags: list[str] = []

class ExtractedAttachment(BaseModel):
    filename: str
    file_extension: str
    size_bytes: int
    mime_type: Optional[str] = None
    md5: str
    sha256: str
    is_executable: bool = False
    suspicious_reason: Optional[str] = None

class DocumentAction(BaseModel):
    action_type: str
    trigger: str
    target: str
    severity: FindingSeverity
    details: str

class StructuralAnomaly(BaseModel):
    code: str
    name: str
    severity: FindingSeverity
    description: str
    raw_evidence: Optional[str] = None

class CheckResult(BaseModel):
    check_id: str
    name: str
    category: str
    status: CheckStatus
    findings_count: int = 0
    duration_ms: float = 0.0
    details: Optional[str] = None

class PDFMetadata(BaseModel):
    pdf_version: str = "Unknown"
    page_count: int = 0
    file_size_bytes: int = 0
    title: Optional[str] = None
    author: Optional[str] = None
    subject: Optional[str] = None
    keywords: Optional[str] = None
    creator: Optional[str] = None
    producer: Optional[str] = None
    creation_date: Optional[str] = None
    modification_date: Optional[str] = None
    is_encrypted: bool = False
    is_linearized: bool = False
    permissions: dict[str, bool] = {}
    trailer_id: Optional[list[str]] = None
    stream_count: int = 0
    indirect_objects_count: int = 0

class RiskAssessment(BaseModel):
    risk_level: RiskLevel
    risk_score: int = Field(ge=0, le=100)  # 0 to 100, 0=clean, 100=extreme danger
    safety_score: int = Field(ge=0, le=100) # 100 - risk_score
    verdict_headline: str
    verdict_summary: str
    score_breakdown: dict[str, int] = {}
    confidence: str = "HIGH"

class ScanProgressStage(BaseModel):
    stage: str
    label: str
    percent: int
    completed: bool = False
    current: bool = False

class ScanRecord(BaseModel):
    scan_id: str
    filename: str
    file_size: int
    sha256: str
    md5: str
    sha1: str
    mime_type: str = "application/pdf"
    status: ScanStatus = ScanStatus.QUEUED
    profile: ScanProfile = ScanProfile.STANDARD
    progress_percent: int = 0
    current_stage: str = "Validation"
    created_at: datetime
    completed_at: Optional[datetime] = None
    duration_ms: Optional[float] = None
    error: Optional[str] = None
    
    # Analysis outputs
    metadata: Optional[PDFMetadata] = None
    risk: Optional[RiskAssessment] = None
    findings: list[Finding] = []
    javascript_items: list[ExtractedJavaScript] = []
    detected_uris: list[ExtractedURI] = []
    attachments: list[ExtractedAttachment] = []
    document_actions: list[DocumentAction] = []
    structural_anomalies: list[StructuralAnomaly] = []
    checks: list[CheckResult] = []

class ScanSummary(BaseModel):
    scan_id: str
    filename: str
    file_size: int
    sha256: str
    status: ScanStatus
    risk_level: Optional[RiskLevel] = None
    risk_score: Optional[int] = None
    findings_count: int = 0
    created_at: datetime
    completed_at: Optional[datetime] = None

class CreateScanResponse(BaseModel):
    scan_id: str
    status: ScanStatus
    filename: str
    file_size: int
    sha256: str
    message: str

class ApiKeyItem(BaseModel):
    key_id: str
    name: str
    prefix: str
    created_at: datetime
    last_used_at: Optional[datetime] = None
    is_active: bool = True

class CreateApiKeyRequest(BaseModel):
    name: str

class CreateApiKeyResponse(BaseModel):
    key_id: str
    name: str
    api_key: str  # Displayed only once!
    created_at: datetime

class PDFObjectItem(BaseModel):
    object_number: int
    generation: int
    object_type: str
    is_stream: bool = False
    stream_length: Optional[int] = None
    filter: Optional[str] = None
    content_preview: str

class PDFTreeCatalog(BaseModel):
    catalog_dict: dict[str, Any]
    pages_count: int
    pages_tree: list[dict[str, Any]]
    fonts: list[str]
    images_count: int
    has_acroform: bool
    has_outlines: bool
    has_threads: bool
    has_embedded_files: bool
