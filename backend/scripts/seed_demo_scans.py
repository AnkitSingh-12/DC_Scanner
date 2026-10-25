"""
DC Scanner - Seed Demo Scans
Scans synthetic samples to populate initial dashboard and ticker with realistic data.
"""
from pathlib import Path
from backend.app.services.scan_service import scan_service
from backend.app.models.schemas import ScanProfile
from backend.app.services.storage_service import StorageService

SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples"

def seed():
    samples = [
        ("invoice_march_2026.pdf", "Quarterly Invoice INV-2026-089"),
        ("urgent_notice_js.pdf", "Notice of Payment Requirement"),
        ("account_verification_url.pdf", "Urgent Verification Request"),
        ("system_diagnostic_launch.pdf", "System Diagnostic Executable")
    ]

    for fname, desc in samples:
        fpath = SAMPLES_DIR / fname
        if not fpath.exists():
            continue
        
        # Check if already seeded
        existing, _ = scan_service.list_scans(search=fname)
        if existing:
            print(f"Sample {fname} already seeded.")
            continue

        with open(fpath, "rb") as f:
            # We mock the upload file by writing to upload dir
            rec = scan_service.create_scan(
                filename=fname,
                file_size=fpath.stat().st_size,
                sha256="",
                md5="",
                sha1="",
                profile=ScanProfile.STANDARD
            )
            # Save file to storage
            target_dir = scan_service._db_path.parent / "uploads" / rec.scan_id
            target_dir.mkdir(parents=True, exist_ok=True)
            target_pdf = target_dir / "target.pdf"
            target_pdf.write_bytes(fpath.read_bytes())

            import hashlib
            data = fpath.read_bytes()
            rec.sha256 = hashlib.sha256(data).hexdigest()
            rec.md5 = hashlib.md5(data).hexdigest()
            rec.sha1 = hashlib.sha1(data).hexdigest()

            # Execute scan
            scan_service.execute_scan_sync(rec.scan_id, str(target_pdf))
            print(f"Seeded scan for {fname}: Risk = {rec.risk.risk_level.value}, Score = {rec.risk.risk_score}")

if __name__ == "__main__":
    seed()
