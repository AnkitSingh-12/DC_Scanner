"""
DC Scanner - PDF Structure Explorer API Endpoints
Provides low-level introspection into PDF catalog, page tree, and indirect objects.
"""
from pathlib import Path
from fastapi import APIRouter, HTTPException, Query
import pikepdf
from ...services.scan_service import scan_service
from ...core.config import settings
from ...models.schemas import PDFTreeCatalog, PDFObjectItem

router = APIRouter(prefix="/scans/{scan_id}/explorer", tags=["PDF Explorer"])

def get_pdf_path(scan_id: str) -> Path:
    p = settings.UPLOAD_DIR / scan_id / "target.pdf"
    if not p.exists():
        raise HTTPException(status_code=404, detail="Underlying document file not found.")
    return p

@router.get("/tree", response_model=dict)
def get_structure_tree(scan_id: str):
    """Retrieve catalog dictionary, page hierarchy, fonts, and form overview."""
    file_path = get_pdf_path(scan_id)
    try:
        with pikepdf.open(str(file_path), allow_overwriting_input=False) as pdf:
            root = pdf.Root
            catalog_summary = {}
            for k in root.keys():
                catalog_summary[str(k)] = str(root[k])[:120]

            pages_tree = []
            fonts = set()
            images_count = 0

            for idx, page in enumerate(pdf.pages):
                page_info = {
                    "page_index": idx + 1,
                    "media_box": [float(x) for x in page.get("/MediaBox", [0, 0, 0, 0])],
                    "rotate": int(page.get("/Rotate", 0)),
                    "annotations_count": len(page.get("/Annots", []))
                }
                # Check resources
                if "/Resources" in page:
                    res = page["/Resources"]
                    if "/Font" in res and isinstance(res["/Font"], pikepdf.Dictionary):
                        for f_key in res["/Font"].keys():
                            fonts.add(str(f_key).lstrip("/"))
                    if "/XObject" in res and isinstance(res["/XObject"], pikepdf.Dictionary):
                        images_count += len(res["/XObject"])
                pages_tree.append(page_info)

            has_acroform = "/AcroForm" in root
            has_outlines = "/Outlines" in root
            has_embedded_files = "/Names" in root and "/EmbeddedFiles" in root["/Names"]

            return {
                "scan_id": scan_id,
                "catalog": catalog_summary,
                "page_count": len(pdf.pages),
                "pages": pages_tree[:50],  # first 50 pages for UI preview
                "fonts": sorted(list(fonts)),
                "images_count": images_count,
                "has_acroform": has_acroform,
                "has_outlines": has_outlines,
                "has_embedded_files": has_embedded_files,
                "total_indirect_objects": len(pdf.objects)
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to inspect PDF tree: {str(e)}")

@router.get("/objects", response_model=list[PDFObjectItem])
def list_objects(scan_id: str, limit: int = Query(50, ge=1, le=200), offset: int = Query(0, ge=0)):
    """List indirect objects with previews."""
    file_path = get_pdf_path(scan_id)
    try:
        items = []
        with pikepdf.open(str(file_path), allow_overwriting_input=False) as pdf:
            all_objs = list(pdf.objects)
            slice_objs = all_objs[offset : offset + limit]
            
            for obj in slice_objs:
                num, gen = obj.objgen
                is_stream = isinstance(obj, pikepdf.Stream)
                stream_len = None
                filter_name = None
                if is_stream:
                    try:
                        stream_len = len(obj.read_raw_bytes())
                        if "/Filter" in obj:
                            filter_name = str(obj["/Filter"])
                    except Exception:
                        pass
                
                # Preview
                try:
                    preview = str(obj)[:250]
                except Exception:
                    preview = "<Binary stream or complex dictionary>"

                items.append(PDFObjectItem(
                    object_number=num,
                    generation=gen,
                    object_type="Stream" if is_stream else type(obj).__name__,
                    is_stream=is_stream,
                    stream_length=stream_len,
                    filter=filter_name,
                    content_preview=preview
                ))
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to list objects: {str(e)}")
