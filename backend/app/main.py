import os
import time
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from backend.app.core.config import settings
from backend.app.core.logging import logger
from backend.app.db.session import init_db
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.auth import router as auth_router
from backend.app.api.routes.checks import router as checks_router
from backend.app.api.routes.uploads import router as uploads_router

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize database tables and directories
    logger.info("Initializing SACHAI.AI backend services...")
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    await init_db()
    logger.info("Database initialized successfully.")
    yield
    # Shutdown
    logger.info("Shutting down SACHAI.AI backend...")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Evidence-Based AI Fact-Checking Engine API",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Observability Middleware: Tracks request latency and stage logging
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    process_time = (time.time() - start) * 1000
    response.headers["X-Process-Time-Ms"] = f"{process_time:.2f}"
    return response

# Serve uploaded media files securely
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")

# Mount Routers
app.include_router(health_router, tags=["Health"])
app.include_router(health_router, prefix=settings.API_V1_STR)
app.include_router(auth_router, prefix=settings.API_V1_STR)
app.include_router(checks_router, prefix=settings.API_V1_STR)
app.include_router(uploads_router, prefix=settings.API_V1_STR)

@app.get("/")
async def root():
    return {
        "name": settings.PROJECT_NAME,
        "tagline": "Don't Just Believe It. Verify It.",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "principle": "AI does not decide what is true by itself. Evidence does.",
    }
