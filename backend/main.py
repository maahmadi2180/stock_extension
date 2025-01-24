from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers.analysis import router as analysis_router
import os

app = FastAPI(title="Trade Journal")
DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analysis_router, prefix="/api")

@app.get("/")
async def root():
    return {"message": "API Active"}
