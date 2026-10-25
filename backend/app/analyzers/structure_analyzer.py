"""
DC Scanner - Structure Analyzer
Inspects PDF catalog, page tree, cross-reference tables, object streams, AcroForms, and structural anomalies.
"""
import re
import math
import pikepdf
from typing import Tuple, Any
from ..models.schemas import StructuralAnomaly, CheckResult, CheckStatus, Finding, FindingSeverity, PDFTreeCatalog, PDFObjectItem

def calculate_entropy(data: bytes) -> float:
    """Calculate Shannon entropy of a byte stream (0 to 8)."""
    if not data:
        return 0.0
    entropy = 0.0
    length = len(data)
    counts = [0] * 256
    for b in data:
        counts[b] += 1
    for count in counts:
        if count > 0:
            p = count / length
            entropy -= p * math.log2(p)
    return entropy

class StructureAnalyzer:
    def __init__(self, file_path: str):
        self.file_path = file_path

    def analyze(self) -> Tuple[list[StructuralAnomaly], list[CheckResult], list[Finding], dict[str, Any]]:
        anomalies: list[StructuralAnomaly] = []
        checks: list[CheckResult] = []
        findings: list[Finding] = []
        structure_meta: dict[str, Any] = {}

        # 1. Inspect raw bytes for physical file structure anomalies
        with open(self.file_path, "rb") as f:
            raw_bytes = f.read()

        file_len = len(raw_bytes)
        
        # Check EOF markers
        eof_matches = list(re.finditer(rb"%%EOF", raw_bytes))
        eof_count = len(eof_matches)
        structure_meta["eof_count"] = eof_count

        if eof_count == 0:
            anomalies.append(StructuralAnomaly(
                code="ANOM-EOF-001",
                name="Missing %%EOF Marker",
                severity=FindingSeverity.HIGH,
                description="File terminates without standard PDF end-of-file (%%EOF) delimiter",
                raw_evidence="Zero %%EOF occurrences found in file"
            ))
            findings.append(Finding(
                rule_id="STRUCT-EOF-001",
                title="Missing End-of-File Marker (%%EOF)",
                severity=FindingSeverity.HIGH,
                confidence="HIGH",
                category="Structure",
                evidence="No %%EOF delimiter found in entire file stream",
                explanation="Non-standard PDF termination can trigger parser confusion and buffer parsing discrepancies across different viewers.",
                remediation="Validate document integrity with source author."
            ))
        elif eof_count > 1:
            anomalies.append(StructuralAnomaly(
                code="ANOM-EOF-002",
                name="Multiple %%EOF Markers Detected",
                severity=FindingSeverity.LOW,
                description=f"File contains {eof_count} %%EOF markers indicating incremental updates or modifications",
                raw_evidence=f"{eof_count} %%EOF instances"
            ))
            findings.append(Finding(
                rule_id="STRUCT-EOF-002",
                title="Incremental Updates Detected (Multiple %%EOF)",
                severity=FindingSeverity.LOW,
                confidence="HIGH",
                category="Structure",
                evidence=f"{eof_count} distinct %%EOF markers detected across file",
                explanation="Incremental updates are legitimate for signed documents but can be leveraged in Shadow Attack exploits to alter displayed content.",
                remediation="Verify digital signature validity if document was signed."
            ))

        # Check for trailing payload data past the last %%EOF
        if eof_matches:
            last_eof = eof_matches[-1]
            trailing_len = file_len - last_eof.end()
            structure_meta["trailing_bytes"] = trailing_len
            
            # If there's more than 64 bytes trailing past %%EOF (ignoring whitespace/newlines)
            trailing_data = raw_bytes[last_eof.end():]
            if len(trailing_data.strip()) > 64:
                anomalies.append(StructuralAnomaly(
                    code="ANOM-TRAIL-001",
                    name="Trailing Data Past EOF",
                    severity=FindingSeverity.MEDIUM,
                    description=f"{trailing_len} bytes of extraneous data detected after final %%EOF marker",
                    raw_evidence=f"Trailing sample: {trailing_data[:80]!r}"
                ))
                findings.append(Finding(
                    rule_id="STRUCT-TRAIL-001",
                    title="Suspicious Trailing Data Past End-of-File",
                    severity=FindingSeverity.MEDIUM,
                    confidence="HIGH",
                    category="Structure",
                    evidence=f"{trailing_len} bytes found appended after last %%EOF marker",
                    explanation="Payloads, malicious scripts, or polyglot files (e.g. PDF+ZIP or PDF+JAR) frequently store second-stage payloads after the PDF footer.",
                    remediation="Inspect trailing byte stream for hidden archive or executable headers."
                ))

        # 2. Inspect with pikepdf for object stream and catalog structure
        try:
            with pikepdf.open(self.file_path, allow_overwriting_input=False) as pdf:
                catalog = pdf.Root
                
                # Check for AcroForm
                has_acroform = "/AcroForm" in catalog
                structure_meta["has_acroform"] = has_acroform
                if has_acroform:
                    acro = catalog["/AcroForm"]
                    fields = acro.get("/Fields", [])
                    structure_meta["form_fields_count"] = len(fields)
                    if "/XFA" in acro:
                        structure_meta["has_xfa"] = True
                        findings.append(Finding(
                            rule_id="STRUCT-XFA-001",
                            title="XFA (XML Forms Architecture) Present",
                            severity=FindingSeverity.LOW,
                            confidence="HIGH",
                            category="Structure",
                            evidence="Catalog -> /AcroForm contains /XFA XML form definition",
                            explanation="XFA forms support extensive XML-based dynamic layouts and script execution, expanding the PDF attack surface.",
                            remediation="Review dynamic XML form bindings."
                        ))

                # Inspect streams and filter cascading
                stream_count = 0
                cascaded_filters = []
                high_entropy_streams = []

                for obj in pdf.objects:
                    if isinstance(obj, pikepdf.Stream):
                        stream_count += 1
                        try:
                            # Check filter
                            filters = obj.get("/Filter", None)
                            if isinstance(filters, pikepdf.Array):
                                filter_names = [str(f).lstrip("/") for f in filters]
                                cascaded_filters.append((obj.objgen, filter_names))
                            
                            # Check entropy of raw stream data
                            raw_stream = obj.read_raw_bytes()
                            if len(raw_stream) > 1024:
                                entropy = calculate_entropy(raw_stream)
                                if entropy > 7.92:  # Very high entropy close to 8.0
                                    high_entropy_streams.append((obj.objgen, entropy, len(raw_stream)))
                        except Exception:
                            continue

                structure_meta["stream_count"] = stream_count
                
                if cascaded_filters:
                    findings.append(Finding(
                        rule_id="STRUCT-STREAM-001",
                        title="Cascaded / Nested Stream Compression Filters",
                        severity=FindingSeverity.MEDIUM,
                        confidence="HIGH",
                        category="Structure",
                        evidence=f"Objects {cascaded_filters[0][0]} utilize multi-stage filter chain: {cascaded_filters[0][1]}",
                        explanation="Multi-layer encoding (e.g. ASCIIHex + FlateDecode) is occasionally used to obfuscate signatures and circumvent naive content inspection.",
                        remediation="Inspect decompressed stream payload contents."
                    ))

                if high_entropy_streams:
                    anomalies.append(StructuralAnomaly(
                        code="ANOM-ENTROPY-001",
                        name="High-Entropy Stream Detected",
                        severity=FindingSeverity.LOW,
                        description=f"Stream in object {high_entropy_streams[0][0]} has Shannon entropy of {high_entropy_streams[0][1]:.2f}",
                        raw_evidence=f"Stream size: {high_entropy_streams[0][2]} bytes, Entropy: {high_entropy_streams[0][1]:.2f}"
                    ))

                checks.append(CheckResult(
                    check_id="CHK-STRUCT-001",
                    name="PDF Object & Stream Structure Inspection",
                    category="Structure",
                    status=CheckStatus.COMPLETED,
                    findings_count=len(anomalies),
                    details=f"Analyzed catalog, {len(pdf.pages)} pages, {len(pdf.objects)} indirect objects, and {stream_count} streams."
                ))

        except Exception as e:
            checks.append(CheckResult(
                check_id="CHK-STRUCT-001",
                name="PDF Object & Stream Structure Inspection",
                category="Structure",
                status=CheckStatus.FAILED,
                findings_count=1,
                details=f"Structure inspection error: {str(e)}"
            ))

        return anomalies, checks, findings, structure_meta
