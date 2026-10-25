"""
DC Scanner - REST API Integration Test Suite
"""
import pytest
from pathlib import Path
from fastapi.testclient import TestClient
from backend.app.main import app

client = TestClient(app)
SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples"

def test_health_endpoint():
    res = client.get("/api/v1/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "HEALTHY"
    assert "pypdf" in data["engines"]
    assert "pikepdf" in data["engines"]

def test_scan_upload_and_pipeline():
    clean_pdf = SAMPLES_DIR / "invoice_march_2026.pdf"
    with open(clean_pdf, "rb") as f:
        res = client.post(
            "/api/v1/scans",
            files={"file": ("invoice_march_2026.pdf", f, "application/pdf")},
            data={"profile": "standard"}
        )
    assert res.status_code == 202
    data = res.json()
    scan_id = data["scan_id"]
    assert scan_id is not None
    assert data["filename"] == "invoice_march_2026.pdf"

    # Poll scan record
    get_res = client.get(f"/api/v1/scans/{scan_id}")
    assert get_res.status_code == 200
    scan_data = get_res.json()
    assert scan_data["scan_id"] == scan_id

    # Test report export
    json_report = client.get(f"/api/v1/scans/{scan_id}/report?format=json")
    assert json_report.status_code == 200
    assert "risk_assessment" in json_report.json()

    html_report = client.get(f"/api/v1/scans/{scan_id}/report?format=html")
    assert html_report.status_code == 200
    assert "DC SCANNER" in html_report.text

def test_api_keys_workflow():
    # 1. Create key
    create_res = client.post("/api/v1/keys", json={"name": "CI Test Key"})
    assert create_res.status_code == 201
    key_data = create_res.json()
    key_id = key_data["key_id"]
    assert key_data["api_key"].startswith("dcs_live_")

    # 2. List keys
    list_res = client.get("/api/v1/keys")
    assert list_res.status_code == 200
    keys = list_res.json()
    assert any(k["key_id"] == key_id for k in keys)

    # 3. Revoke key
    del_res = client.delete(f"/api/v1/keys/{key_id}")
    assert del_res.status_code == 200
