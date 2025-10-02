#!/usr/bin/env python3
"""
Malta Grocery Stores Indexer API Server
Run this file directly to start the server: python main.py
"""
import sys
import os
import uvicorn
import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add the backend directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.config import settings
from app.database import create_tables
from app.api.stores import router as stores_router
from app.api.businesses import router as businesses_router

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create FastAPI application
app = FastAPI(
    title=settings.api_title,
    version=settings.api_version,
    description="A comprehensive API for indexing and managing grocery stores in Malta",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Initialize database tables at module level
try:
    create_tables()
    logger.info("Database tables created/verified successfully")
except Exception as e:
    logger.error(f"Failed to create database tables: {str(e)}")
    raise

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stores_router)
app.include_router(businesses_router, prefix="/api/businesses", tags=["businesses"])


@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Malta Grocery Stores Indexer API",
        "version": settings.api_version,
        "status": "operational",
        "docs": "/docs",
        "endpoints": {
            "stores": "/api/stores",
            "businesses": "/api/businesses",
            "categories": "/api/businesses/categories",
            "search": "/api/stores/search",
            "nearby": "/api/stores/nearby",
            "refresh": "/api/stores/refresh",
            "stats": "/api/stores/stats/overview"
        }
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "malta-grocery-indexer-api",
        "version": settings.api_version
    }


@app.exception_handler(500)
async def internal_server_error_handler(request, exc):
    """Global exception handler for internal server errors"""
    logger.error(f"Internal server error: {str(exc)}")
    return HTTPException(
        status_code=500,
        detail="Internal server error occurred. Please try again later."
    )


def main():
    """Main entry point for the server"""
    logger.info("🚀 Starting Malta Grocery Stores Indexer API...")
    
    try:
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=5000,
            reload=False,
            log_level="info",
            access_log=True
        )
    except KeyboardInterrupt:
        logger.info("⭐ Server stopped by user")
    except Exception as e:
        logger.error(f"❌ Server error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()