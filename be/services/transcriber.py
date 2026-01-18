import assemblyai as aai
import os

print("Loading AssemblyAI API Key", os.getenv("ASSEMBLYAI_API_KEY"))
aai.settings.api_key = "4d55daf2cfac4f3eb5203045608afea5"

def transcribe_audio(file_path: str) -> str:
    transcriber = aai.Transcriber()
    transcript = transcriber.transcribe(file_path)
    return transcript.text