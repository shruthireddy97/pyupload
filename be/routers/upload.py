from fastapi import APIRouter, UploadFile, File
from services.transcriber import transcribe_audio
from services.pdf_generator import save_pdf
from motor.motor_asyncio import AsyncIOMotorClient
import os

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "static/uploads"

print(os.getenv("MONGO_URI"))

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))

# db = client[os.getenv("DB_NAME")]

# @router.get("/users")
# async def get_users():
#     users = db["users"].find()
#     return users

@router.post("/")
async def upload_audio(file: UploadFile = File(...)):
    print(os.getenv("MONGO_URI"))

    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    transcript = transcribe_audio(file_path)
    pdf_path = save_pdf(transcript, file.filename.replace(".wav", ".pdf"))
    return {"transcript": transcript, "pdf_path": pdf_path}
