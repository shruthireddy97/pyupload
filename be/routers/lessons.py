from fastapi import APIRouter
import os

router = APIRouter(prefix="/lessons", tags=["Lessons"])

TRANSCRIPT_DIR = "static/transcripts"

@router.get("/")
def get_lessons():
    files = os.listdir(TRANSCRIPT_DIR)
    pdf_files = [f for f in files if f.endswith(".pdf")]
    return {"lessons": pdf_files}
