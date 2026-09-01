import os
import uuid
from typing import Tuple
from fastapi import APIRouter, UploadFile, File, HTTPException, status
from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.services.ocr_service import ocr_vision_service

router = APIRouter(prefix="/uploads", tags=["Uploads"])

# Known Magic Byte signatures for security hardening (Section 46)
MAGIC_SIGNATURES = {
    "png": b"\x89PNG\r\n\x1a\n",
    "jpg": b"\xff\xd8\xff",
    "webp": b"RIFF",
}

def validate_magic_bytes(header: bytes) -> Tuple[bool, str]:
    if header.startswith(MAGIC_SIGNATURES["png"]):
        return True, "image/png"
    if header.startswith(MAGIC_SIGNATURES["jpg"]):
        return True, "image/jpeg"
    if header.startswith(MAGIC_SIGNATURES["webp"]) and b"WEBP" in header[:16]:
        return True, "image/webp"
    return False, "Unsupported or forged file signature"

@router.post("")
async def upload_image_and_ocr(file: UploadFile = File(...)):
    # 1. Read first chunk for magic-byte security inspection
    header_bytes = await file.read(64)
    if not header_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    is_valid, detected_mime = validate_magic_bytes(header_bytes)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Security Error: {detected_mime}. Only authentic PNG, JPG, and WEBP image files are permitted."
        )

    # 2. Read full content and check size limit (10MB)
    rest_of_bytes = await file.read()
    total_content = header_bytes + rest_of_bytes
    max_size_bytes = settings.MAX_UPLOAD_SIZE_MB * 1024 * 1024

    if len(total_content) > max_size_bytes:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {settings.MAX_UPLOAD_SIZE_MB}MB."
        )

    # 3. Save to disk with secure random UUID filename
    ext = "png" if "png" in detected_mime else "jpg" if "jpeg" in detected_mime else "webp"
    file_id = str(uuid.uuid4())
    filename = f"{file_id}.{ext}"
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(settings.UPLOAD_DIR, filename)

    with open(file_path, "wb") as f:
        f.write(total_content)

    logger.info(f"Saved verified image upload: {file_path} ({len(total_content)} bytes)")

    # 4. Execute OCR and Multimodal extraction
    ocr_result = await ocr_vision_service.extract_text_and_context(file_path)

    return {
        "file_id": file_id,
        "filename": filename,
        "file_url": f"/uploads/{filename}",
        "mime_type": detected_mime,
        "size_bytes": len(total_content),
        "extracted_text": ocr_result.get("extracted_text", ""),
        "visual_context": ocr_result.get("visual_context", ""),
        "image_type": ocr_result.get("image_type", "SCREENSHOT"),
        "metadata": ocr_result.get("metadata", {}),
    }
