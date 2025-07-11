import os
import json
from fastapi import APIRouter, HTTPException
from pathlib import Path
from typing import List
from models.schemas import ChatSession

router = APIRouter()

CHAT_HISTORY_DIR = Path("data/chat_history")

@router.get("/history/list", response_model=List[ChatSession])
async def list_chat_sessions():
    """Lists all chat sessions."""
    if not CHAT_HISTORY_DIR.exists():
        return []
    
    sessions = []
    for file_path in CHAT_HISTORY_DIR.glob("*.json"):
        with open(file_path, "r") as f:
            try:
                session_data = json.load(f)
                sessions.append(ChatSession(**session_data))
            except (json.JSONDecodeError, TypeError) as e:
                print(f"Error reading history file {file_path}: {e}")
                continue
    
    sessions.sort(key=lambda s: s.updated_at, reverse=True)
    return sessions