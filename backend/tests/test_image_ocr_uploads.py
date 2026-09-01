import io
import pytest
from httpx import AsyncClient, ASGITransport
from backend.app.main import app
from backend.app.api.routes.uploads import validate_magic_bytes
from backend.app.services.whatsapp_service import whatsapp_service

def test_magic_byte_validation():
    # Valid PNG header
    png_header = b"\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR"
    is_valid, mime = validate_magic_bytes(png_header)
    assert is_valid is True
    assert mime == "image/png"

    # Valid JPEG header
    jpg_header = b"\xff\xd8\xff\xe0\x00\x10JFIF"
    is_valid, mime = validate_magic_bytes(jpg_header)
    assert is_valid is True
    assert mime == "image/jpeg"

    # Forged file header (e.g. bash script / plain text masquerading as image)
    fake_header = b"#!/bin/bash\necho 'hello'"
    is_valid, mime = validate_magic_bytes(fake_header)
    assert is_valid is False

@pytest.mark.asyncio
async def test_upload_valid_png_image():
    # Create minimal 1x1 valid PNG in memory
    import io
    from PIL import Image
    img_byte_arr = io.BytesIO()
    img = Image.new("RGB", (10, 10), color="blue")
    img.save(img_byte_arr, format="PNG")
    img_bytes = img_byte_arr.getvalue()

    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        files = {"file": ("test_image.png", img_bytes, "image/png")}
        response = await ac.post("/api/v1/uploads", files=files)
        assert response.status_code == 200
        data = response.json()
        assert "file_id" in data
        assert data["mime_type"] == "image/png"

@pytest.mark.asyncio
async def test_upload_invalid_file_rejected():
    fake_bytes = b"This is a malicious plain text file."
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        files = {"file": ("malicious.png", fake_bytes, "image/png")}
        response = await ac.post("/api/v1/uploads", files=files)
        assert response.status_code == 400
        assert "Security Error" in response.json()["detail"]

@pytest.mark.asyncio
async def test_whatsapp_forward_decomposition():
    message = """Forwarded as received:
1. RBI has issued a complete ban on 500 rupee notes from tomorrow.
2. UNESCO announced Jana Gana Mana as the best anthem in the world.
Please share with 5 groups immediately!"""

    claims = await whatsapp_service.decompose_whatsapp_message(message)
    assert len(claims) >= 1
    assert any("500" in c.get("claim_text", "") or "Jana Gana" in c.get("claim_text", "") or "RBI" in c.get("claim_text", "") for c in claims)
