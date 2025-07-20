from contextlib import asynccontextmanager
import logging
import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, pest_router, insects_router, chatbot_router
from utils.vectorstore import initialize_vector_store
from routers.chatbot import init_vector_store

# Global vector store instance
vector_store = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle manager for the FastAPI app"""
    # Initialize resources before startup
    global vector_store
    try:
        logger.info("Initializing vector store...")
        vector_store = initialize_vector_store(logger, BASE_DIR, "sri-lankan-agriculture-guide.md")
        if vector_store is not None:
            init_vector_store(vector_store)
            logger.info("Vector store initialized successfully")
        else:
            logger.error("Vector store initialization returned None")
    except Exception as e:
        logger.error(f"Failed to initialize agriculture KB: {str(e)}")
        vector_store = None
    
    yield
    
    # Cleanup on shutdown
    logger.info("Shutting down vector store...")
    vector_store = None

app = FastAPI(
    title="Growa Core Engine",
    version="1.0.0",
    lifespan=lifespan
)

# Include routers
app.include_router(auth_router, prefix="/auth")
app.include_router(pest_router, prefix="/pest")
app.include_router(insects_router, prefix="/insects")
app.include_router(chatbot_router, prefix="/chatbot")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/", tags=["Root"])
def read_root():
    return {
        "message": "Welcome to Growa Core Engine 🌱"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8081, reload=True)