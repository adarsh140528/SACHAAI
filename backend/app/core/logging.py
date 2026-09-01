import logging
import sys
from backend.app.core.config import settings

def setup_logging():
    log_format = "%(asctime)s | %(levelname)-7s | [sachai] %(message)s"
    date_format = "%Y-%m-%d %H:%M:%S"

    handler = logging.StreamHandler(sys.stdout)
    if hasattr(sys.stdout, "reconfigure"):
        try:
            sys.stdout.reconfigure(encoding="utf-8", errors="replace")
        except Exception:
            pass

    log_level = getattr(settings, "LOG_LEVEL", "INFO")
    logging.basicConfig(
        level=getattr(logging, log_level.upper(), logging.INFO),
        format=log_format,
        datefmt=date_format,
        handlers=[handler]
    )
    return logging.getLogger("sachai")

logger = setup_logging()
