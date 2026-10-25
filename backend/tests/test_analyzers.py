"""
DC Scanner - Automated Test Suite
Tests Metadata, Structure, Security, and Risk analyzers on synthetic PDFs and malformed inputs.
"""
import pytest
from pathlib import Path
from backend.app.analyzers.metadata_analyzer import MetadataAnalyzer
from backend.app.analyzers.structure_analyzer import StructureAnalyzer
from backend.app.analyzers.security_analyzer import SecurityAnalyzer
from backend.app.analyzers.risk_engine import RiskEngine
from backend.app.models.schemas import RiskLevel, FindingSeverity

SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples"

def test_clean_invoice_scan():
    clean_pdf = str(SAMPLES_DIR / "invoice_march_2026.pdf")
    
    meta_analyzer = MetadataAnalyzer(clean_pdf)
    meta, meta_checks, meta_findings = meta_analyzer.analyze()
    assert meta.title == "Quarterly Invoice INV-2026-089"
    assert meta.producer == "DC PDF Engine 2.1"
    assert meta.is_encrypted is False

    sec_analyzer = SecurityAnalyzer(clean_pdf)
    sec_findings, js_items, uris, attachments, actions, sec_checks = sec_analyzer.analyze()
    assert len(js_items) == 0
    assert len(attachments) == 0

    all_findings = meta_findings + sec_findings
    all_checks = meta_checks + sec_checks
    risk = RiskEngine.calculate(all_findings, all_checks)
    assert risk.risk_level in [RiskLevel.CLEAN, RiskLevel.LOW]
    assert risk.safety_score >= 80

def test_javascript_detection():
    js_pdf = str(SAMPLES_DIR / "urgent_notice_js.pdf")
    
    sec_analyzer = SecurityAnalyzer(js_pdf)
    sec_findings, js_items, uris, attachments, actions, sec_checks = sec_analyzer.analyze()
    assert len(js_items) >= 1
    assert any("app.alert" in p for item in js_items for p in item.suspicious_patterns)

    # Risk should flag this
    risk = RiskEngine.calculate(sec_findings, sec_checks)
    assert risk.risk_score >= 15

def test_suspicious_url_detection():
    url_pdf = str(SAMPLES_DIR / "account_verification_url.pdf")
    
    sec_analyzer = SecurityAnalyzer(url_pdf)
    sec_findings, js_items, uris, attachments, actions, sec_checks = sec_analyzer.analyze()
    assert len(uris) >= 1
    target_uri = uris[0]
    assert target_uri.is_ip_address is True
    assert "Raw IP Address Destination" in target_uri.risk_flags
    assert any(f.rule_id == "SEC-URI-IP-001" for f in sec_findings)

def test_launch_action_critical():
    launch_pdf = str(SAMPLES_DIR / "system_diagnostic_launch.pdf")
    
    sec_analyzer = SecurityAnalyzer(launch_pdf)
    sec_findings, js_items, uris, attachments, actions, sec_checks = sec_analyzer.analyze()
    launch_findings = [f for f in sec_findings if f.rule_id == "SEC-LAUNCH-001"]
    assert len(launch_findings) >= 1
    assert launch_findings[0].severity == FindingSeverity.CRITICAL

    risk = RiskEngine.calculate(sec_findings, sec_checks)
    assert risk.risk_level == RiskLevel.HIGH
    assert risk.risk_score >= 70

def test_corrupt_file_handling(tmp_path):
    bad_pdf = tmp_path / "corrupt.pdf"
    bad_pdf.write_bytes(b"%PDF-1.4\nJUNK CORRUPT BYTES NOT A VALID PDF TRAILER")
    
    meta_analyzer = MetadataAnalyzer(str(bad_pdf))
    meta, meta_checks, meta_findings = meta_analyzer.analyze()
    assert meta_checks[0].status.value in ["COMPLETED", "FAILED"]

    sec_analyzer = SecurityAnalyzer(str(bad_pdf))
    sec_findings, js_items, uris, attachments, actions, sec_checks = sec_analyzer.analyze()
    
    risk = RiskEngine.calculate(meta_findings + sec_findings, meta_checks + sec_checks)
    # Corrupt file should be inconclusive or handled gracefully without uncaught exceptions
    assert risk is not None
