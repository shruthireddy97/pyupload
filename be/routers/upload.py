from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.transcriber import transcribe_audio
from services.pdf_generator import save_pdf
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from routers.auth import get_db, User
from datetime import datetime
import cloudinary
import cloudinary.uploader
import os

router = APIRouter(prefix="/upload", tags=["Upload"])

UPLOAD_DIR = "static/uploads"

client = AsyncIOMotorClient(os.getenv("MONGO_URI"))
db = client[os.getenv("DB_NAME")]


@router.get("/user/{user_id}")
async def get_uploads_by_user(user_id: str, sql_db: AsyncSession = Depends(get_db)):
    print("Fetching uploads for user:", user_id)
    # validate user exists in SQL database
    try:
        uid = int(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id format")

    stmt = select(User).where(User.id == uid)
    res = await sql_db.execute(stmt)
    sql_user = res.scalar_one_or_none()
    print("SQL user found:", sql_user)
    if not sql_user:
        raise HTTPException(status_code=404, detail="User not found")

    # query uploads by string user_id (store SQL id as string)
    uploads_cursor = db["uploads"].find({"user_id": user_id}).sort("created_at", -1)

    uploads = []
    async for upload in uploads_cursor:
        upload["_id"] = str(upload["_id"])
        # keep user_id as string
        upload["user_id"] = str(upload.get("user_id"))
        uploads.append(upload)

    return uploads

@router.post("/")
async def upload_audio(
    user_id: str,
    file: UploadFile = File(...),
    sql_db: AsyncSession = Depends(get_db)
):
    file_path = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_path, "wb") as f:
        f.write(await file.read())

    try:
        transcript = transcribe_audio(file_path)
    except Exception:
        transcript = "Transcription failed"

    base = os.path.splitext(file.filename)[0]
    print(">>>>>>>>>>>base:", transcript, base)
    if not transcript or transcript == "Transcription failed":
        raise HTTPException(status_code=500, detail="Transcription failed")
    pdf_path = save_pdf(transcript, base)

    if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
        raise HTTPException(status_code=500, detail="PDF generation failed")

    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

    try:
        audio_result = cloudinary.uploader.upload(
            file_path,
            resource_type="raw",
            folder="uploads/audio"
        )

        pdf_result = cloudinary.uploader.upload(
            pdf_path,
            resource_type="raw",
            folder="uploads/pdf"
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Cloudinary upload failed")

    # validate user exists in SQL DB and store user_id as string
    try:
        uid = int(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id format")

    stmt = select(User).where(User.id == uid)
    res = await sql_db.execute(stmt)
    sql_user = res.scalar_one_or_none()
    if not sql_user:
        raise HTTPException(status_code=404, detail="User not found")

    upload_doc = {
        "user_id": user_id,
        "audio": {
            "filename": file.filename,
            "cloudinary_url": audio_result["secure_url"],
            "public_id": audio_result["public_id"]
        },
        "pdf": {
            "filename": os.path.basename(pdf_path),
            "cloudinary_url": pdf_result["secure_url"],
            "public_id": pdf_result["public_id"]
        },
        "transcript": transcript,
        "created_at": datetime.utcnow()
    }

    result = await db["uploads"].insert_one(upload_doc)

    return {
        "upload_id": str(result.inserted_id),
        "audio_url": audio_result["secure_url"],
        "pdf_url": pdf_result["secure_url"],
        "transcript": transcript
    }
