from fastapi import FastAPI, Request
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Allow CORS so frontend can talk to backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify: ["http://localhost:3000"]
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input format
class ChatRequest(BaseModel):
    question: str

@app.post("/chat")
async def chat_endpoint(chat: ChatRequest):
    # For now, just echo back the input
    return {"answer": f"თქვენ თქვით: {chat.question}"}
