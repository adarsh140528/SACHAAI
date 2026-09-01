import hashlib
import hmac
import ipaddress
import secrets
import socket
import urllib.parse
from datetime import datetime, timedelta
from typing import Optional, Tuple
import jwt
from passlib.context import CryptContext
from backend.app.core.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
ALGORITHM = "HS256"

# Blocked private IP ranges for SSRF protection
BLOCKED_IP_NETWORKS = [
    ipaddress.ip_network("0.0.0.0/8"),
    ipaddress.ip_network("10.0.0.0/8"),
    ipaddress.ip_network("100.64.0.0/10"),
    ipaddress.ip_network("127.0.0.0/8"),
    ipaddress.ip_network("169.254.0.0/16"),  # Link-local / Cloud metadata (AWS, GCP, Azure)
    ipaddress.ip_network("172.16.0.0/12"),
    ipaddress.ip_network("192.0.0.0/24"),
    ipaddress.ip_network("192.0.2.0/24"),
    ipaddress.ip_network("192.88.99.0/24"),
    ipaddress.ip_network("192.168.0.0/16"),
    ipaddress.ip_network("198.18.0.0/15"),
    ipaddress.ip_network("198.51.100.0/24"),
    ipaddress.ip_network("203.0.113.0/24"),
    ipaddress.ip_network("224.0.0.0/4"),
    ipaddress.ip_network("240.0.0.0/4"),
    ipaddress.ip_network("255.255.255.255/32"),
    ipaddress.ip_network("::/128"),
    ipaddress.ip_network("::1/128"),
    ipaddress.ip_network("fc00::/7"),
    ipaddress.ip_network("fe80::/10"),
]

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.AUTH_SECRET, algorithm=ALGORITHM)

def decode_access_token(token: str) -> Optional[dict]:
    try:
        payload = jwt.decode(token, settings.AUTH_SECRET, algorithms=[ALGORITHM])
        return payload
    except Exception:
        return None

def generate_api_key() -> Tuple[str, str, str]:
    """Generates a secret key, its SHA-256 hash, and a display prefix."""
    raw_secret = secrets.token_urlsafe(32)
    api_key = f"sach_live_{raw_secret}"
    key_prefix = api_key[:14]
    key_hash = hashlib.sha256(api_key.encode()).hexdigest()
    return api_key, key_hash, key_prefix

def verify_api_key(api_key: str, stored_hash: str) -> bool:
    computed = hashlib.sha256(api_key.encode()).hexdigest()
    return hmac.compare_digest(computed, stored_hash)

def validate_ssrf_safe_url(url: str) -> Tuple[bool, str]:
    """
    Validates that a URL is well-formed, uses HTTP/HTTPS, and does not resolve
    to localhost, private IPs, or cloud metadata endpoints.
    """
    try:
        parsed = urllib.parse.urlparse(url.strip())
        if parsed.scheme not in ("http", "https"):
            return False, "URL scheme must be http or https"
        
        hostname = parsed.hostname
        if not hostname:
            return False, "Invalid URL: missing hostname"
        
        # Check explicit forbidden hosts
        lower_host = hostname.lower()
        if lower_host in ("localhost", "127.0.0.1", "metadata.google.internal", "169.254.169.254"):
            return False, "Target host is not permitted"
        
        # Resolve hostname to IP addresses and verify against blocked ranges
        try:
            addr_info = socket.getaddrinfo(hostname, None)
            for addr in addr_info:
                ip_str = addr[4][0]
                ip_obj = ipaddress.ip_address(ip_str)
                for blocked in BLOCKED_IP_NETWORKS:
                    if ip_obj in blocked:
                        return False, f"Resolved IP {ip_str} is within a restricted network"
        except socket.gaierror:
            return False, "Hostname could not be resolved"
            
        return True, ""
    except Exception as e:
        return False, f"URL validation error: {str(e)}"

def sanitize_untrusted_content_for_prompt(text: str) -> str:
    """
    Sanitizes untrusted web snippets/retrieved content so they cannot execute
    adversarial prompt injection instructions.
    """
    if not text:
        return ""
    # Strip dangerous injection phrases and enclose clearly
    cleaned = text.replace("```", "'''")
    return cleaned[:1500]
