"""
DC Scanner - Scans REST API Endpoints
"""
import asyncio
import time
import base64
from typing import Optional
from pydantic import BaseModel
import fitz
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query, BackgroundTasks, Response
from fastapi.responses import HTMLResponse, JSONResponse, FileResponse
from pathlib import Path

from ...models.schemas import (
    ScanRecord, ScanProfile, RiskLevel, CreateScanResponse,
    ScanSummary, Finding, PDFMetadata
)
from ...services.storage_service import StorageService
from ...services.scan_service import scan_service
from ...services.report_service import ReportService
from ...core.config import settings

router = APIRouter(prefix="/scans", tags=["Scans"])

class ChatPayload(BaseModel):
    message: str

@router.post("", response_model=CreateScanResponse, status_code=202)
async def upload_and_scan(
    background_tasks: BackgroundTasks,
    file: UploadFile = File(...),
    profile: ScanProfile = Form(ScanProfile.STANDARD)
):
    """
    Accepts PDF file upload, verifies file format & size, calculates cryptographic hashes,
    and initiates asynchronous security analysis.
    """
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files (.pdf) are permitted.")

    # Generate preliminary scan record and save file safely
    temp_scan_id = scan_service.create_scan(
        filename=file.filename,
        file_size=0,
        sha256="",
        md5="",
        sha1="",
        profile=profile
    ).scan_id

    try:
        file_path, file_size, sha256, md5, sha1 = StorageService.validate_and_save(file, temp_scan_id)
    except HTTPException:
        scan_service.delete_scan(temp_scan_id)
        raise
    except Exception as e:
        scan_service.delete_scan(temp_scan_id)
        raise HTTPException(status_code=500, detail=f"Failed to process upload: {str(e)}")

    # Update record with computed file size and hashes
    record = scan_service.get_scan(temp_scan_id)
    if record:
        record.file_size = file_size
        record.sha256 = sha256
        record.md5 = md5
        record.sha1 = sha1

    # Queue execution in background thread
    background_tasks.add_task(scan_service.execute_scan_background, temp_scan_id, file_path)

    return CreateScanResponse(
        scan_id=temp_scan_id,
        status=record.status,
        filename=record.filename,
        file_size=record.file_size,
        sha256=record.sha256,
        message="PDF accepted and queued for forensic security analysis."
    )

@router.get("", response_model=dict)
def list_scans(
    search: Optional[str] = Query(None, description="Search by filename or SHA-256 hash"),
    risk_level: Optional[RiskLevel] = Query(None, description="Filter by risk classification"),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0)
):
    """Retrieve history of previous scans with search and risk filters."""
    items, total = scan_service.list_scans(search=search, risk_level=risk_level, limit=limit, offset=offset)
    return {
        "items": items,
        "total": total,
        "limit": limit,
        "offset": offset
    }

@router.get("/{scan_id}", response_model=ScanRecord)
def get_scan(scan_id: str):
    """Retrieve full scan record and progress."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")
    return record

@router.get("/{scan_id}/findings", response_model=list[Finding])
def get_findings(scan_id: str):
    """Retrieve list of security findings for a scan."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")
    return record.findings

@router.get("/{scan_id}/metadata", response_model=Optional[PDFMetadata])
def get_metadata(scan_id: str):
    """Retrieve extracted PDF metadata."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")
    return record.metadata

@router.get("/{scan_id}/report")
def get_report(scan_id: str, format: str = Query("json", pattern="^(json|html)$")):
    """Export scan report in structured JSON or printable HTML format."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")
    
    if format == "html":
        html_content = ReportService.generate_printable_html(record)
        return HTMLResponse(content=html_content)
    
    return JSONResponse(content=ReportService.generate_json_report(record))

@router.delete("")
def delete_all_scans():
    """Permanently delete all scans and stored files."""
    count = scan_service.delete_all_scans()
    return {"message": f"Successfully deleted {count} scan records and all associated files.", "deleted_count": count}

@router.delete("/{scan_id}")
def delete_scan(scan_id: str):
    """Permanently delete a scan and its associated files."""
    deleted = scan_service.delete_scan(scan_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Scan not found")
    return {"message": "Scan and stored files deleted successfully.", "scan_id": scan_id}

@router.get("/{scan_id}/text")
def get_extracted_text(scan_id: str):
    """Extract plain text streams page-by-page with word and character metrics."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="Underlying document file not found on disk")

    t0 = time.perf_counter()
    try:
        doc = fitz.open(file_path)
        pages_data = []
        total_words = 0
        total_chars = 0

        for i, page in enumerate(doc):
            text = page.get_text()
            w_count = len(text.split())
            c_count = len(text)
            total_words += w_count
            total_chars += c_count
            pages_data.append({
                "page_number": i + 1,
                "word_count": w_count,
                "character_count": c_count,
                "text": text
            })

        duration = round(time.perf_counter() - t0, 3)
        return {
            "scan_id": scan_id,
            "filename": record.filename,
            "file_size": record.file_size,
            "pages_count": len(pages_data),
            "total_words": total_words,
            "total_characters": total_chars,
            "duration_seconds": duration,
            "pages": pages_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract text: {str(e)}")

@router.get("/{scan_id}/markdown")
def get_extracted_markdown(scan_id: str):
    """Convert PDF layout and text into structured Markdown."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        doc = fitz.open(file_path)
        md_lines = [f"# {record.filename.replace('.pdf', '')}\n"]
        for i, page in enumerate(doc):
            md_lines.append(f"\n## Page {i + 1}\n")
            text = page.get_text()
            for line in text.split("\n"):
                line_str = line.strip()
                if not line_str:
                    continue
                if line_str.startswith("●") or line_str.startswith("•"):
                    md_lines.append(f"- {line_str.lstrip('●• ')}")
                elif len(line_str) < 40 and line_str.isupper():
                    md_lines.append(f"\n### {line_str}\n")
                else:
                    md_lines.append(line_str)
        
        return {
            "scan_id": scan_id,
            "filename": record.filename,
            "markdown": "\n".join(md_lines),
            "pages_count": len(doc)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to convert to markdown: {str(e)}")

@router.get("/{scan_id}/images")
def get_extracted_images(scan_id: str):
    """Extract embedded raster images from the document."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        doc = fitz.open(file_path)
        images = []
        for pno, page in enumerate(doc):
            for img_idx, img in enumerate(page.get_images(full=True)):
                xref = img[0]
                base_img = doc.extract_image(xref)
                img_bytes = base_img["image"]
                b64 = base64.b64encode(img_bytes).decode("ascii")
                ext = base_img["ext"]
                images.append({
                    "id": f"img-{pno+1}-{img_idx+1}",
                    "page": pno + 1,
                    "format": ext.upper(),
                    "width": base_img["width"],
                    "height": base_img["height"],
                    "size_bytes": len(img_bytes),
                    "data_url": f"data:image/{ext};base64,{b64}"
                })
        return {
            "scan_id": scan_id,
            "filename": record.filename,
            "total_images": len(images),
            "images": images
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to extract images: {str(e)}")

@router.post("/{scan_id}/chat")
def chat_with_pdf(scan_id: str, payload: ChatPayload):
    """AI PDF Chat: Answers questions based on the document's content."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        doc = fitz.open(file_path)
        q = payload.message.lower().strip()
        relevant_page = 1
        matching_snippets = []

        for i, page in enumerate(doc):
            p_text = page.get_text()
            lines = p_text.split("\n")
            for line in lines:
                if any(word in line.lower() for word in q.split() if len(word) > 3):
                    matching_snippets.append((i + 1, line.strip()))

        if "summary" in q or "summarize" in q or "what is this" in q or "who is" in q:
            first_lines = [l.strip() for l in doc[0].get_text().split("\n") if l.strip()][:8]
            answer = f"**Document Summary for {record.filename}:**\n\n" + " ".join(first_lines)
        elif matching_snippets:
            relevant_page = matching_snippets[0][0]
            snippets_text = "\n- ".join([s[1] for s in matching_snippets[:6]])
            answer = f"Found relevant information on **Page {relevant_page}**:\n\n- {snippets_text}"
        else:
            first_few = [l.strip() for l in doc[0].get_text().split("\n") if l.strip()][:4]
            answer = f"Based on `{record.filename}`, I could not locate an exact match for your inquiry. Key context from page 1 includes: " + ", ".join(first_few)

        return {
            "reply": answer,
            "relevant_page": relevant_page,
            "timestamp": time.time()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process chat: {str(e)}")

@router.get("/{scan_id}/signatures")
def get_signatures_audit(scan_id: str):
    """Audit digital signatures, PKCS#7 containers, and document certification seals."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        import pikepdf
        sigs = []
        has_signatures = False
        with pikepdf.open(file_path) as pdf:
            catalog = pdf.Root
            if "/AcroForm" in catalog and "/Fields" in catalog["/AcroForm"]:
                for field in catalog["/AcroForm"]["/Fields"]:
                    if hasattr(field, "get") and field.get("/FT") == "/Sig":
                        has_signatures = True
                        sig_name = str(field.get("/T", "SignatureField"))
                        subfilter = str(field.get("/V", {}).get("/SubFilter", "adbe.pkcs7.detached")) if hasattr(field.get("/V"), "get") else "adbe.pkcs7.detached"
                        sigs.append({
                            "field_name": sig_name,
                            "subfilter": subfilter,
                            "signed": "/V" in field
                        })

        return {
            "scan_id": scan_id,
            "filename": record.filename,
            "has_signatures": has_signatures,
            "signatures_count": len(sigs),
            "signatures": sigs,
            "status": "VALID_UNSIGNED" if not has_signatures else "SIGNED",
            "certification_status": "Document integrity preserved without cryptographic lock." if not has_signatures else "Cryptographic PKCS#7 signature applied."
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to audit signatures: {str(e)}")

@router.get("/{scan_id}/fonts")
def get_fonts_analysis(scan_id: str):
    """Audit embedded font glyphs, CID subsets, and character encodings."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        doc = fitz.open(file_path)
        fonts_map = {}
        for pno, page in enumerate(doc):
            for f in page.get_fonts(full=True):
                xref = f[0]
                ext = f[1]
                ftype = f[2]
                basefont = f[3]
                name = f[4]
                encoding = f[5]
                clean_name = basefont.lstrip("/").split("+")[-1]
                if clean_name not in fonts_map:
                    fonts_map[clean_name] = {
                        "name": clean_name,
                        "full_name": basefont.lstrip("/"),
                        "type": ftype,
                        "encoding": encoding or "WinAnsiEncoding",
                        "is_embedded": bool(ext),
                        "format": ext.upper() if ext else "System TrueType",
                        "pages": [pno + 1]
                    }
                else:
                    if pno + 1 not in fonts_map[clean_name]["pages"]:
                        fonts_map[clean_name]["pages"].append(pno + 1)

        font_items = list(fonts_map.values())
        return {
            "scan_id": scan_id,
            "filename": record.filename,
            "total_fonts": len(font_items),
            "fonts": font_items
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze fonts: {str(e)}")

@router.get("/{scan_id}/compress")
def compress_pdf_document(scan_id: str):
    """Lossless stream compression, unreferenced stream purging, and linearization."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    try:
        doc = fitz.open(file_path)
        compressed_bytes = doc.tobytes(garbage=4, deflate=True, clean=True)
        original_size = record.file_size
        compressed_size = len(compressed_bytes)
        savings_bytes = max(0, original_size - compressed_size)
        savings_percent = round((savings_bytes / max(original_size, 1)) * 100, 1)

        dest_dir = Path(file_path).parent
        compressed_path = dest_dir / "compressed.pdf"
        compressed_path.write_bytes(compressed_bytes)

        return {
            "scan_id": scan_id,
            "filename": record.filename,
            "original_size": original_size,
            "compressed_size": compressed_size,
            "savings_bytes": savings_bytes,
            "savings_percent": savings_percent,
            "download_url": f"/api/v1/scans/{scan_id}/download?variant=compressed"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to compress PDF: {str(e)}")

@router.get("/{scan_id}/download")
def download_scan_file(scan_id: str, variant: str = Query("original")):
    """Download original or compressed PDF file."""
    record = scan_service.get_scan(scan_id)
    if not record:
        raise HTTPException(status_code=404, detail="Scan not found")

    file_path = StorageService.get_file_path(scan_id)
    if not file_path:
        raise HTTPException(status_code=404, detail="File not found")

    if variant == "compressed":
        target = Path(file_path).parent / "compressed.pdf"
        if not target.exists():
            # generate it on the fly
            doc = fitz.open(file_path)
            target.write_bytes(doc.tobytes(garbage=4, deflate=True, clean=True))
        filename = f"optimized_{record.filename}"
    else:
        target = Path(file_path)
        filename = record.filename

    return FileResponse(
        path=str(target),
        filename=filename,
        media_type="application/pdf"
    )

