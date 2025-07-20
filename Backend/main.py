from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth_router, pest_router, insects_router

app = FastAPI(
    title="Growa Core Engine",
    version="1.0.0"
)

app.include_router(auth_router, prefix="/auth")
app.include_router(pest_router, prefix="/pest")
app.include_router(insects_router, prefix="/insects")

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