import io
import os
from typing import Dict, Any, Optional
from PIL import Image
from backend.app.core.config import settings
from backend.app.core.logging import logger

class OCRVisionService:
    """
    OCR and Vision Service for extracting text, dates, entities, and visual context
    from uploaded screenshots, infographics, and WhatsApp forward images.
    """
    def __init__(self):
        self._gemini_model = None
        if settings.GEMINI_API_KEY:
            try:
                import google.generativeai as genai
                genai.configure(api_key=settings.GEMINI_API_KEY)
                for candidate in ["gemini-3.5-flash-lite", "gemini-3.5-flash", "gemini-flash-latest"]:
                    try:
                        self._gemini_model = genai.GenerativeModel(candidate)
                        break
                    except Exception:
                        continue
                if not self._gemini_model:
                    self._gemini_model = genai.GenerativeModel("gemini-3.5-flash-lite")
            except Exception as e:
                logger.warning(f"Could not configure Gemini vision: {e}")

    async def extract_text_and_context(self, image_path: str) -> Dict[str, Any]:
        logger.info(f"Running multimodal OCR on image: {image_path}")
        
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Image file not found: {image_path}")

        extracted_text = ""
        visual_context = ""
        image_type = "PHOTOGRAPH"

        try:
            pil_image = Image.open(image_path)
            # Basic Pillow inspection
            width, height = pil_image.size
            format_name = pil_image.format
            
            if self._gemini_model:
                prompt = """You are a forensic multimodal OCR and image analysis agent for an evidence fact-checking engine.
Analyze this image carefully:
1. Extract ALL readable text verbatim (headlines, captions, message text, timestamps, usernames, dates, numbers).
2. Determine image type: WHATSAPP_SCREENSHOT, SOCIAL_MEDIA_SCREENSHOT, NEWS_SCREENSHOT, INFOGRAPHIC, DOCUMENT, or PHOTOGRAPH.
3. Describe visual context (e.g. what is shown in the photo, claimed location, claimed date).
4. Separate the statement claim from image authenticity (note if image appears to be a recycled old photo or out of context).

Return a JSON object with this exact structure:
{
  "extracted_text": "All transcribed text from the image...",
  "image_type": "WHATSAPP_SCREENSHOT",
  "visual_context": "Visual description...",
  "claimed_event": "...",
  "claimed_location": "...",
  "claimed_date": "..."
}
"""
                try:
                    response = self._gemini_model.generate_content([prompt, pil_image])
                    content = response.text.strip()
                    if content.startswith("```json"):
                        content = content[7:]
                    if content.startswith("```"):
                        content = content[3:]
                    if content.endswith("```"):
                        content = content[:-3]
                    
                    import json
                    parsed = json.loads(content.strip())
                    return {
                        "extracted_text": parsed.get("extracted_text", "").strip(),
                        "image_type": parsed.get("image_type", "SCREENSHOT"),
                        "visual_context": parsed.get("visual_context", ""),
                        "metadata": {
                            "dimensions": f"{width}x{height}",
                            "format": format_name,
                            "claimed_event": parsed.get("claimed_event"),
                            "claimed_location": parsed.get("claimed_location"),
                            "claimed_date": parsed.get("claimed_date"),
                        }
                    }
                except Exception as g_err:
                    logger.error(f"Gemini Vision API error: {g_err}")

            # Fallback heuristic image metadata
            return {
                "extracted_text": f"Image uploaded ({width}x{height} {format_name}). Optical text extraction ready for verification.",
                "image_type": "IMAGE",
                "visual_context": f"Image file format {format_name}",
                "metadata": {"dimensions": f"{width}x{height}", "format": format_name}
            }

        except Exception as e:
            logger.error(f"OCR processing failure: {e}")
            return {
                "extracted_text": "Unable to extract text from image.",
                "image_type": "UNKNOWN",
                "visual_context": str(e),
                "metadata": {}
            }

ocr_vision_service = OCRVisionService()
