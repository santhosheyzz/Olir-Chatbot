import os
import json
import uuid
from datetime import datetime
from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse
from models.schemas import ChatSession, Message
from pathlib import Path
from typing import List 

router = APIRouter(prefix="/api/v1/chat-history", tags=["Chat History"])

# Configuration
CHAT_HISTORY_DIR = Path("data/chat_history")
CHAT_HISTORY_DIR.mkdir(parents=True, exist_ok=True)

@router.post("/", response_model=ChatSession)
async def create_chat_session(document_id: str = None):
    """Create a new chat session"""
    session_id = str(uuid.uuid4())
    now = datetime.now()
    title = f"Chat Session {now.strftime('%Y-%m-%d %H:%M')}"
    
    session = ChatSession(
        id=session_id,
        title=title,
        created_at=now,
        updated_at=now,
        messages=[],
        document_id=document_id
    )
    
    file_path = CHAT_HISTORY_DIR / f"{session_id}.json"
    with open(file_path, "w") as f:
        json.dump(session.dict(), default=str)
    
    return session

@router.post("/{session_id}/messages", response_model=ChatSession)
async def add_message_to_session(session_id: str, message: Message):
    """Add a message to an existing chat session"""
    file_path = CHAT_HISTORY_DIR / f"{session_id}.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Session not found")
    
    with open(file_path, "r") as f:
        session_data = json.load(f)
    
    session = ChatSession(**session_data)
    message.timestamp = datetime.now()
    session.messages.append(message)
    session.updated_at = datetime.now()
    
    with open(file_path, "w") as f:
        json.dump(session.dict(), default=str)
    
    return session

@router.get("/list", response_model=List[ChatSession])
async def list_chat_sessions():
    """List all chat sessions"""
    sessions = []
    for file in CHAT_HISTORY_DIR.glob("*.json"):
        with open(file, "r") as f:
            session_data = json.load(f)
            sessions.append(ChatSession(**session_data))
    
    sessions.sort(key=lambda x: x.updated_at, reverse=True)
    return sessions

@router.get("/{session_id}", response_model=ChatSession)
async def get_chat_session(session_id: str):
    """Get a specific chat session"""
    file_path = CHAT_HISTORY_DIR / f"{session_id}.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Session not found")
    
    with open(file_path, "r") as f:
        session_data = json.load(f)
    
    return ChatSession(**session_data)

@router.delete("/{session_id}")
async def delete_chat_session(session_id: str):
    """Delete a chat session"""
    file_path = CHAT_HISTORY_DIR / f"{session_id}.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Session not found")
    
    file_path.unlink()
    return {"message": "Session deleted successfully"}

@router.get("/{session_id}/export")
async def export_chat_session(session_id: str):
    """Export a chat session as a downloadable file"""
    file_path = CHAT_HISTORY_DIR / f"{session_id}.json"
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="Session not found")
    
    return FileResponse(
        file_path,
        media_type="application/json",
        filename=f"chat_session_{session_id}.json"
    )