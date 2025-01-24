from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from routers.analysis import router as analysis_router
import os

app = FastAPI(title="Trade Journal")
#DEEPSEEK_API_KEY = os.getenv("DEEPSEEK_API_KEY", "sk-9fdfda1dc0814439b1bfd9df93cf07ef")
DEEPSEEK_API_KEY = os.getenv("sk-7e003f3efe61404bb5710e7aaa095ab9")  # حذف مقدار پیشفرض

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
app.include_router(analysis_router, prefix="/api")

@app.get("/")
async def serve_frontend():
    return FileResponse("static/index.html")