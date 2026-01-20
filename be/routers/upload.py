from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from services.transcriber import transcribe_audio
from services.pdf_generator import save_pdf
from services.text_extractor import extract_text
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from routers.auth import get_db, User
from datetime import datetime
import cloudinary
import cloudinary.uploader
import os
import easyocr
from pathlib import Path

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
async def upload_file(
    user_id: str,
    file: UploadFile = File(...),
    sql_db: AsyncSession = Depends(get_db)
):
    """
    Upload and process various file types:
    - Audio files: transcribed to text
    - PDF files: text extracted from PDF
    - DOCX/DOC files: text extracted from document
    - Image files: text extracted via OCR
    """
    os.makedirs(UPLOAD_DIR, exist_ok=True)
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    # reader = easyocr.Reader(['en'], gpu=False)
    # results = reader.readtext(file_path)
    # transcript = " ".join([res[1] for res in results])
    # print(f"OCR extracted {len(transcript)} characters from image.", transcript)
    # Save uploaded file
    with open(file_path, "wb") as f:
        f.write(await file.read())

    file_extension = Path(file.filename).suffix.lower()
    base_name = os.path.splitext(file.filename)[0]
    transcript = ""

    # Process file based on type
    if file_extension in [".mp3", ".wav", ".m4a", ".flac", ".ogg"]:
        # Audio file - transcribe
        try:
            transcript = transcribe_audio(file_path)
        except Exception as e:
            print(f"Transcription failed: {e}")
            raise HTTPException(status_code=500, detail="Transcription failed")
    
    elif file_extension in [".pdf", ".docx", ".doc", ".png", ".jpg", ".jpeg", ".bmp", ".tiff", ".tif"]:
        # Document or Image file - extract text
        try:
            transcript = extract_text(file_path)
            if not transcript:
                raise HTTPException(status_code=500, detail="No text could be extracted from file")
        except ValueError as ve:
            raise HTTPException(status_code=400, detail=str(ve))
        except Exception as e:
            error_msg = str(e)
            print(f"Text extraction failed: {error_msg}")
            # Return user-friendly error message
            raise HTTPException(status_code=500, detail=error_msg)
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported file type: {file_extension}")

    if not transcript or transcript == "":
        raise HTTPException(status_code=500, detail="Failed to extract text from file")

    # Generate PDF from extracted text
    pdf_path = save_pdf(transcript, base_name)

    if not os.path.exists(pdf_path) or os.path.getsize(pdf_path) == 0:
        raise HTTPException(status_code=500, detail="PDF generation failed")

    # Configure and upload to Cloudinary
    cloudinary.config(
        cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
        api_key=os.getenv("CLOUDINARY_API_KEY"),
        api_secret=os.getenv("CLOUDINARY_API_SECRET"),
        secure=True
    )

    try:
        file_result = cloudinary.uploader.upload(
            file_path,
            resource_type="auto",
            folder="uploads/files"
        )

        pdf_result = cloudinary.uploader.upload(
            pdf_path,
            resource_type="raw",
            folder="uploads/pdf"
        )
    except Exception as e:
        print(f"Cloudinary upload failed: {e}")
        raise HTTPException(status_code=500, detail="Cloudinary upload failed")

    # Validate user exists in SQL DB
    try:
        uid = int(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user id format")

    stmt = select(User).where(User.id == uid)
    res = await sql_db.execute(stmt)
    sql_user = res.scalar_one_or_none()
    if not sql_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Create upload document
    upload_doc = {
        "user_id": user_id,
        "file_type": file_extension,
        "original_file": {
            "filename": file.filename,
            "cloudinary_url": file_result["secure_url"],
            "public_id": file_result["public_id"]
        },
        "pdf": {
            "filename": os.path.basename(pdf_path),
            "cloudinary_url": pdf_result["secure_url"],
            "public_id": pdf_result["public_id"]
        },
        "extracted_text": transcript,
        "created_at": datetime.utcnow()
    }

    result = await db["uploads"].insert_one(upload_doc)

    return {
        "upload_id": str(result.inserted_id),
        "file_url": file_result["secure_url"],
        "pdf_url": pdf_result["secure_url"],
        "extracted_text": transcript
    }
