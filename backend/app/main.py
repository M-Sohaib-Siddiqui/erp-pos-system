from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.core.config import settings
from app.core.redis import init_redis, close_redis
from app.api.v1.endpoints import auth


# Lifespan — runs on startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    await init_redis()
    print(f"✅ Redis connected")
    print(f"✅ {settings.APP_NAME} started")
    yield
    # Shutdown
    await close_redis()
    print("👋 Application shutdown")


# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    debug=settings.DEBUG,
    version="1.0.0",
    lifespan=lifespan,
)

# CORS middleware — allows frontend to talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "version": "1.0.0",
    }


# Root endpoint
@app.get("/")
async def root():
    return {"message": f"Welcome to {settings.APP_NAME} API"}