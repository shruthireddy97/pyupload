import cloudinary
import cloudinary.uploader
import os

cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
)

def upload_pdf(file_path: str):
    result = cloudinary.uploader.upload(
        file_path,
        resource_type="raw",
        folder="transcripts"
    )
    return result["secure_url"]
