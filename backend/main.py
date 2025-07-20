from fastapi import FastAPI, Request, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import httpx
import asyncio

app = FastAPI(title="Georgian Legal AI API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

COLAB_API_URL = "https://a2898df3dfb7.ngrok-free.app"

async def get_answer(query: str):
    """Send query to Colab API and get response"""
    try:
        timeout = httpx.Timeout(120.0)  # 2 minute timeout
        async with httpx.AsyncClient(timeout=timeout) as client:
            print(f"🔄 Sending query to Colab: {query}")
            
            response = await client.post(
                f"{COLAB_API_URL}/ask",
                json={"question": query},
                headers={"Content-Type": "application/json"}
            )
            
            response.raise_for_status()
            data = response.json()
            
            print(f"✅ Received response from Colab")
            return data.get("answer", "No answer received")
    
    except httpx.TimeoutException:
        print("⏰ Request timeout")
        raise HTTPException(status_code=408, detail="Request timeout - the query took too long to process")
    
    except httpx.HTTPStatusError as e:
        print(f"❌ HTTP error: {e.response.status_code}")
        if e.response.status_code == 500:
            try:
                error_data = e.response.json()
                raise HTTPException(status_code=500, detail=f"Colab API error: {error_data.get('error', 'Unknown error')}")
            except:
                raise HTTPException(status_code=500, detail="Internal server error in Colab")
        else:
            raise HTTPException(status_code=e.response.status_code, detail=f"HTTP {e.response.status_code} error")
    
    except httpx.RequestError as e:
        print(f"🔌 Connection error: {e}")
        raise HTTPException(
            status_code=503, 
            detail=f"Cannot connect to Colab API. Make sure your Colab notebook is running and ngrok URL is correct. Error: {str(e)}"
        )
    
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

class ChatRequest(BaseModel):
    question: str

class ChatResponse(BaseModel):
    answer: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat: ChatRequest):
    """Main chat endpoint that forwards requests to Colab"""
    if not chat.question.strip():
        raise HTTPException(status_code=400, detail="Question cannot be empty")
    
    try:
        answer = await get_answer(chat.question)
        return ChatResponse(answer=answer)
    
    except HTTPException:
        raise
    
    except Exception as e:
        print(f"❌ Unexpected error in chat_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@app.get("/health")
async def health_check():
    """Check if both FastAPI and Colab API are healthy"""
    try:
        timeout = httpx.Timeout(10.0)
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.get(f"{COLAB_API_URL}/health")
            response.raise_for_status()
            colab_health = response.json()
            
            return {
                "fastapi_status": "healthy",
                "colab_status": colab_health,
                "colab_url": COLAB_API_URL,
                "overall_status": "healthy" if colab_health.get("models_loaded", False) else "colab_not_ready"
            }
    
    except Exception as e:
        return {
            "fastapi_status": "healthy", 
            "colab_status": "unhealthy",
            "colab_url": COLAB_API_URL,
            "error": str(e),
            "overall_status": "unhealthy"
        }

@app.get("/")
async def root():
    """Root endpoint with API information"""
    return {
        "message": "Georgian Legal AI API",
        "endpoints": {
            "chat": "/chat - POST - Send a legal question",
            "health": "/health - GET - Check API health status"
        },
        "colab_url": COLAB_API_URL
    }


