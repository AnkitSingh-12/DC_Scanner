"""
DC Scanner - Synthetic Test PDF Generator
Generates benign synthetic PDFs with specific structural features to validate detection rules safely.
"""
from pathlib import Path
import pikepdf

SAMPLES_DIR = Path(__file__).resolve().parent.parent.parent / "samples"
SAMPLES_DIR.mkdir(parents=True, exist_ok=True)

def create_clean_pdf(output_path: Path):
    """Creates a clean, benign business invoice PDF."""
    pdf = pikepdf.new()
    pdf.add_blank_page(page_size=(595.28, 841.89))  # A4
    pdf.docinfo["/Title"] = "Quarterly Invoice INV-2026-089"
    pdf.docinfo["/Author"] = "DC Enterprise Billing Systems"
    pdf.docinfo["/Producer"] = "DC PDF Engine 2.1"
    pdf.docinfo["/CreationDate"] = "D:20261025100000+00'00'"
    pdf.save(str(output_path))
    print(f"Generated clean sample: {output_path}")

def create_js_pdf(output_path: Path):
    """Creates a PDF containing an embedded JavaScript action."""
    pdf = pikepdf.new()
    pdf.add_blank_page()
    pdf.docinfo["/Title"] = "Form Calculation Document"
    
    # Create JavaScript Action
    js_code = b"app.alert({cMsg: 'Notice: This document requires verification.', cTitle: 'Security Check'});"
    js_stream = pdf.make_stream(js_code)
    
    act = pikepdf.Dictionary(
        Type=pikepdf.Name.Action,
        S=pikepdf.Name.JavaScript,
        JS=js_stream
    )
    pdf.Root.OpenAction = act
    pdf.save(str(output_path))
    print(f"Generated JS sample: {output_path}")

def create_suspicious_url_pdf(output_path: Path):
    """Creates a PDF containing a raw IP hyperlink."""
    pdf = pikepdf.new()
    pdf.add_blank_page()
    pdf.docinfo["/Title"] = "Urgent Account Verification Request"
    
    act = pikepdf.Dictionary(
        Type=pikepdf.Name.Action,
        S=pikepdf.Name("/URI"),
        URI=pikepdf.String("http://192.168.1.105/login/verify-banking-account")
    )
    pdf.Root.OpenAction = act
    pdf.save(str(output_path))
    print(f"Generated Suspicious URL sample: {output_path}")

def create_launch_action_pdf(output_path: Path):
    """Creates a PDF containing a /Launch action."""
    pdf = pikepdf.new()
    pdf.add_blank_page()
    pdf.docinfo["/Title"] = "Automated System Diagnostic Tool"
    
    act = pikepdf.Dictionary(
        Type=pikepdf.Name.Action,
        S=pikepdf.Name("/Launch"),
        F=pikepdf.String("powershell.exe -ExecutionPolicy Bypass -Command Write-Host DC_Scanner_Test")
    )
    pdf.Root.OpenAction = act
    pdf.save(str(output_path))
    print(f"Generated Launch Action sample: {output_path}")

def main():
    clean_p = SAMPLES_DIR / "invoice_march_2026.pdf"
    js_p = SAMPLES_DIR / "urgent_notice_js.pdf"
    url_p = SAMPLES_DIR / "account_verification_url.pdf"
    launch_p = SAMPLES_DIR / "system_diagnostic_launch.pdf"

    create_clean_pdf(clean_p)
    create_js_pdf(js_p)
    create_suspicious_url_pdf(url_p)
    create_launch_action_pdf(launch_p)

if __name__ == "__main__":
    main()
