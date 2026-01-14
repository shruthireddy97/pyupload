from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import upload, record, lessons
from dotenv import load_dotenv
import os

load_dotenv()  # Load API key from .env
print(os.getenv("ASSEMBLYAI_API_KEY"))
os.environ["ASSEMBLYAI_API_KEY"] = os.getenv("ASSEMBLYAI_API_KEY")

app = FastAPI(title="Speech Transcriber API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router)
app.include_router(record.router)
app.include_router(lessons.router)

@app.get("/")
def root():
    print(os.getenv("MONGO_URI"), "uri")
    return {"message": "Speech Transcriber API running", "uri": os.getenv("DB_NAME")}
