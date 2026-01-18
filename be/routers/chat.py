from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
import os
import httpx
from openai import OpenAI


router = APIRouter(prefix="/chat", tags=["Chat"])

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_API_URL = "https://api.openai.com/v1/chat/completions"



class ChatRequest(BaseModel):
    message: str

@router.post("/")
async def chat(req: ChatRequest):
    print("Received chat message:", req.message, OPENAI_API_KEY)
    if not OPENAI_API_KEY:
        raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured on the server")

    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": "gpt-5-nano",
        "input": "write a haiku about ai",
        "store": True
    }
    client = OpenAI(
        api_key=OPENAI_API_KEY
    )

    response = client.responses.create(
        model="gpt-5-nano",
        input=req.message,
        store=True,
    )
    
    print("OpenAI response data:", response)
    # return {"reply":  response.output[1].content[0].text }

    # async with httpx.AsyncClient(timeout=30.0) as client:
    #     resp = await client.post(OPENAI_API_URL, headers=headers, json=payload)

    # if resp.status_code != 200:
    #     raise HTTPException(status_code=502, detail=f"OpenAI error: {resp.text}")

    # data = resp.json()


    try:
        content =  response.output[1].content[0].text
        test = response
    except Exception:
        raise HTTPException(status_code=502, detail="Invalid response from OpenAI")

    return {"reply": content, "test" : test}
