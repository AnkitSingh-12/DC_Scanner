"""
DC Scanner - Metadata Analyzer
Extracts document metadata, versioning, encryption, linearization, and trailer information.
"""
import re
import os
import pypdf
import pikepdf
from datetime import datetime
from typing import Optional, Tuple
from ..models.schemas import PDFMetadata, CheckResult, CheckStatus, Finding, FindingSeverity

def parse_pdf_date(date_str: Optional[str]) -> Optional[str]:
    """Parse PDF date format D:YYYYMMDDHHmmSSOHH'mm' to readable ISO format."""
    if not date_str:
        return None
    try:
        clean = str(date_str).strip()
        if clean.startswith("D:"):
            clean = clean[2:]
        # Extract YYYYMMDD
        match = re.match(r"^(\d{4})(\d{2})?(\d{2})?(\d{2})?(\d{2})?(\d{2})?", clean)
        if match:
            parts = match.groups()
            year = parts[0]
            month = parts[1] or "01"
            day = parts[2] or "01"
            hour = parts[3] or "00"
            minute = parts[4] or "00"
            second = parts[5] or "00"
            return f"{year}-{month}-{day} {hour}:{minute}:{second} UTC"
    except Exception:
        pass
    return str(date_str)

class MetadataAnalyzer:
    def __init__(self, file_path: str):
        self.file_path = file_path
        self.file_size = os.path.getsize(file_path)

    def analyze(self) -> Tuple[PDFMetadata, list[CheckResult], list[Finding]]:
        checks: list[CheckResult] = []
        findings: list[Finding] = []
        
        pdf_version = "Unknown"
        page_count = 0
        title = None
        author = None
        subject = None
        keywords = None
        creator = None
        producer = None
        creation_date = None
        modification_date = None
        is_encrypted = False
        is_linearized = False
        permissions: dict[str, bool] = {}
        trailer_id = None
        stream_count = 0
        indirect_objects_count = 0

        # Step 1: Raw Header check for version
        try:
            with open(self.file_path, "rb") as f:
                header = f.read(1024)
                version_match = re.search(rb"%PDF-(\d+\.\d+)", header)
                if version_match:
                    pdf_version = version_match.group(1).decode("ascii", errors="ignore")
                
                # Check for Fast Web View (linearization) in first 1024 bytes
                if b"/Linearized" in header:
                    is_linearized = True
        except Exception:
            pass

        # Step 2: Inspection via pikepdf
        try:
            with pikepdf.open(self.file_path, allow_overwriting_input=False) as pdf:
                # Count indirect objects
                indirect_objects_count = len(pdf.objects)
                
                # Check if catalog specifies a newer version
                if "/Version" in pdf.Root:
                    pdf_version = str(pdf.Root["/Version"]).lstrip("/")

                page_count = len(pdf.pages)
                
                # Inspect Trailer ID
                if "/ID" in pdf.trailer:
                    try:
                        raw_ids = pdf.trailer["/ID"]
                        trailer_id = [bytes(id_elem).hex() for id_elem in raw_ids]
                    except Exception:
                        trailer_id = [str(pdf.trailer["/ID"])]

                # Check Encryption
                if "/Encrypt" in pdf.trailer:
                    is_encrypted = True

                # Count streams
                stream_count = sum(1 for obj in pdf.objects if isinstance(obj, pikepdf.Stream))

                # Check DocInfo
                if pdf.docinfo:
                    for key, val in pdf.docinfo.items():
                        k = str(key).lstrip("/")
                        v = str(val) if val is not None else None
                        if k == "Title":
                            title = v
                        elif k == "Author":
                            author = v
                        elif k == "Subject":
                            subject = v
                        elif k == "Keywords":
                            keywords = v
                        elif k == "Creator":
                            creator = v
                        elif k == "Producer":
                            producer = v
                        elif k == "CreationDate":
                            creation_date = parse_pdf_date(v)
                        elif k == "ModDate":
                            modification_date = parse_pdf_date(v)

            checks.append(CheckResult(
                check_id="CHK-META-001",
                name="PDF Metadata Extraction",
                category="Metadata",
                status=CheckStatus.COMPLETED,
                findings_count=0,
                details=f"Extracted document metadata for PDF v{pdf_version}, {page_count} pages."
            ))
        except pikepdf.PasswordError:
            is_encrypted = True
            checks.append(CheckResult(
                check_id="CHK-META-001",
                name="PDF Metadata Extraction",
                category="Metadata",
                status=CheckStatus.COMPLETED,
                findings_count=1,
                details="Document is password protected / encrypted."
            ))
            findings.append(Finding(
                rule_id="SEC-ENCRYPT-001",
                title="Encrypted / Password Protected Document",
                severity=FindingSeverity.MEDIUM,
                confidence="HIGH",
                category="Metadata",
                evidence="File requires password authorization or uses PDF standard encryption",
                explanation="Encrypted PDFs hinder full structural introspection and may bypass perimeter gateways.",
                remediation="Decrypt document before automated sandbox inspection if possible."
            ))
        except Exception as e:
            # Fallback to pypdf if pikepdf encountered syntax anomalies
            try:
                reader = pypdf.PdfReader(self.file_path, strict=False)
                page_count = len(reader.pages)
                is_encrypted = reader.is_encrypted
                if reader.metadata:
                    title = reader.metadata.title
                    author = reader.metadata.author
                    subject = reader.metadata.subject
                    creator = reader.metadata.creator
                    producer = reader.metadata.producer
                    creation_date = parse_pdf_date(str(reader.metadata.creation_date))
                    modification_date = parse_pdf_date(str(reader.metadata.modification_date))
                
                checks.append(CheckResult(
                    check_id="CHK-META-001",
                    name="PDF Metadata Extraction (Fallback Mode)",
                    category="Metadata",
                    status=CheckStatus.COMPLETED,
                    findings_count=0,
                    details=f"Extracted metadata using secondary parser. {str(e)[:100]}"
                ))
            except Exception as e2:
                checks.append(CheckResult(
                    check_id="CHK-META-001",
                    name="PDF Metadata Extraction",
                    category="Metadata",
                    status=CheckStatus.FAILED,
                    findings_count=1,
                    details=f"Metadata parsing failed: {str(e2)}"
                ))

        # Check for suspicious or anomalous metadata combinations
        if producer and any(kw in producer.lower() for kw in ["metasploit", "exploit", "cve-", "payload", "pdfstreamdumper", "origami"]):
            findings.append(Finding(
                rule_id="SEC-META-002",
                title=f"Suspicious Producer Signature ({producer})",
                severity=FindingSeverity.HIGH,
                confidence="HIGH",
                category="Metadata",
                evidence=f"Producer field matches known exploit or forensic framework: {producer}",
                explanation="Malicious PDF generation toolkits often leave distinct artifact signatures in producer tags.",
                remediation="Isolate document in a secured sandbox environment."
            ))

        if not producer and not creator:
            findings.append(Finding(
                rule_id="INFO-META-003",
                title="Missing Producer and Creator Metadata",
                severity=FindingSeverity.INFO,
                confidence="MEDIUM",
                category="Metadata",
                evidence="Both Producer and Creator metadata fields are absent or empty",
                explanation="Legitimate authoring suites (Acrobat, Word, InDesign) typically stamp producer metadata. Stripped metadata may indicate automated generator scripts.",
                remediation="Review document origin and transmission chain."
            ))

        metadata = PDFMetadata(
            pdf_version=pdf_version,
            page_count=page_count,
            file_size_bytes=self.file_size,
            title=title,
            author=author,
            subject=subject,
            keywords=keywords,
            creator=creator,
            producer=producer,
            creation_date=creation_date,
            modification_date=modification_date,
            is_encrypted=is_encrypted,
            is_linearized=is_linearized,
            permissions=permissions,
            trailer_id=trailer_id,
            stream_count=stream_count,
            indirect_objects_count=indirect_objects_count
        )

        return metadata, checks, findings
