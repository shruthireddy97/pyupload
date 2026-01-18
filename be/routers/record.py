from fastapi import APIRouter, UploadFile, File
from services.transcriber import transcribe_audio

router = APIRouter(prefix="/record", tags=["Record"])

@router.post("/")
async def record_audio(file: UploadFile = File(...)):
    transcript = transcribe_audio(file.file)
    return {"transcript": transcript}
