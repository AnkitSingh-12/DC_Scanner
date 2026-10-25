"""
DC Scanner - Report Generation Service
Generates structured JSON exports and printable standalone HTML security summaries.
"""
from typing import Any
from ..models.schemas import ScanRecord

class ReportService:
    @staticmethod
    def generate_json_report(record: ScanRecord) -> dict[str, Any]:
        """Produce standardized JSON export of full scan results."""
        return {
            "scanner": {
                "name": "DC Scanner",
                "version": "1.0.0",
                "engine": "Hybrid AST + Pikepdf + Heuristic Forensics",
                "ruleset_version": "2026.10"
            },
            "file": {
                "filename": record.filename,
                "size_bytes": record.file_size,
                "sha256": record.sha256,
                "md5": record.md5,
                "sha1": record.sha1,
                "mime_type": record.mime_type
            },
            "scan": {
                "scan_id": record.scan_id,
                "status": record.status.value,
                "profile": record.profile.value,
                "created_at": record.created_at.isoformat(),
                "completed_at": record.completed_at.isoformat() if record.completed_at else None,
                "duration_ms": record.duration_ms
            },
            "risk_assessment": record.risk.model_dump() if record.risk else None,
            "metadata": record.metadata.model_dump() if record.metadata else None,
            "security_findings": [f.model_dump() for f in record.findings],
            "active_content": {
                "javascript": [j.model_dump() for j in record.javascript_items],
                "uris": [u.model_dump() for u in record.detected_uris],
                "attachments": [a.model_dump() for a in record.attachments],
                "actions": [act.model_dump() for act in record.document_actions]
            },
            "structural_anomalies": [s.model_dump() for s in record.structural_anomalies],
            "audit_checks": [c.model_dump() for c in record.checks],
            "recommendations": [
                f.remediation for f in record.findings if f.remediation
            ] or ["No threat remediation actions required for this document."]
        }

    @staticmethod
    def generate_printable_html(record: ScanRecord) -> str:
        """Produce a clean, styled standalone HTML report for printing / saving as PDF."""
        risk_color = "#35C987" if not record.risk or record.risk.risk_level.value == "CLEAN" else (
            "#3b82f6" if record.risk.risk_level.value == "LOW" else (
                "#f59e0b" if record.risk.risk_level.value == "MEDIUM" else "#ef4444"
            )
        )
        
        findings_html = ""
        for f in record.findings:
            findings_html += f"""
            <div style="border: 1px solid #283548; background: #141F30; border-radius: 8px; padding: 14px; margin-bottom: 12px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <strong style="color: #F5F7FA; font-size: 14px;">[{f.rule_id}] {f.title}</strong>
                    <span style="background: {risk_color}22; color: {risk_color}; border: 1px solid {risk_color}; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: bold;">{f.severity.value}</span>
                </div>
                <p style="color: #9BAABC; font-size: 13px; margin: 6px 0;"><strong>Evidence:</strong> <code>{f.evidence}</code></p>
                <p style="color: #9BAABC; font-size: 13px; margin: 4px 0;">{f.explanation}</p>
                <p style="color: #35C987; font-size: 12px; margin: 4px 0;"><strong>Action:</strong> {f.remediation}</p>
            </div>
            """

        if not findings_html:
            findings_html = "<p style='color: #35C987;'>No suspicious indicators detected during full document introspection.</p>"

        return f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>DC Scanner Report - {record.filename}</title>
    <style>
        body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; background: #0C1421; color: #F5F7FA; padding: 30px; margin: 0; }}
        .header {{ border-bottom: 1px solid #283548; padding-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }}
        .title {{ font-size: 24px; font-weight: 700; color: #35C987; }}
        .grid {{ display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 24px 0; }}
        .card {{ background: #141F30; border: 1px solid #283548; border-radius: 8px; padding: 16px; }}
        .label {{ color: #9BAABC; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; }}
        .value {{ font-size: 14px; font-weight: 600; margin-top: 4px; word-break: break-all; }}
        code {{ background: #0C1421; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #F5F7FA; }}
        @media print {{
            body {{ background: #ffffff; color: #111827; }}
            .card {{ background: #f9fafb; border-color: #e5e7eb; }}
            .label {{ color: #6b7280; }}
            code {{ background: #e5e7eb; color: #111827; }}
        }}
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="title">DC SCANNER</div>
            <div style="color: #9BAABC; font-size: 13px; margin-top: 4px;">PDF Intelligence & Forensic Security Dossier</div>
        </div>
        <div style="text-align: right;">
            <div style="font-size: 12px; color: #9BAABC;">Report ID: {record.scan_id}</div>
            <div style="font-size: 12px; color: #9BAABC;">Date: {record.created_at.strftime('%Y-%m-%d %H:%M:%S UTC')}</div>
        </div>
    </div>

    <div class="grid">
        <div class="card">
            <div class="label">Target File</div>
            <div class="value">{record.filename} ({record.file_size:,} bytes)</div>
            <div class="label" style="margin-top: 12px;">SHA-256 Fingerprint</div>
            <div class="value" style="font-size: 11px; font-family: monospace;">{record.sha256}</div>
        </div>
        <div class="card" style="border-left: 4px solid {risk_color};">
            <div class="label">Forensic Classification</div>
            <div class="value" style="color: {risk_color}; font-size: 18px;">
                {record.risk.risk_level.value if record.risk else 'PROCESSING'} (Safety: {record.risk.safety_score if record.risk else 0}/100)
            </div>
            <div style="color: #9BAABC; font-size: 12px; margin-top: 6px;">
                {record.risk.verdict_summary if record.risk else 'Scan in progress'}
            </div>
        </div>
    </div>

    <h3 style="color: #F5F7FA; margin-top: 30px;">Security Findings ({len(record.findings)})</h3>
    {findings_html}

    <div style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #283548; font-size: 11px; color: #9BAABC; text-align: center;">
        Generated autonomously by DC Scanner Engine v1.0.0. Cryptographic verification & analysis completed without executing embedded binaries.
    </div>
</body>
</html>
"""
