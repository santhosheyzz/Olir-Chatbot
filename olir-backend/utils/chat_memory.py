import json
import uuid
from pathlib import Path
from datetime import datetime
from typing import List, Dict, Optional
from models.schemas import Message, ChatSession

# Configuration
CHAT_HISTORY_DIR = Path("data/chat_history")
CHAT_HISTORY_DIR.mkdir(parents=True, exist_ok=True)

def save_chat_session(session: ChatSession) -> None:
    """Save a chat session to a JSON file"""
    file_path = CHAT_HISTORY_DIR / f"{session.id}.json"
    with open(file_path, "w") as f:
        json.dump(session.dict(), f, default=str)

def load_session_by_id(session_id: str) -> Optional[ChatSession]:
    """Load a specific chat session by its ID"""
    file_path = CHAT_HISTORY_DIR / f"{session_id}.json"
    if not file_path.exists():
        return None
    
    with open(file_path, "r") as f:
        session_data = json.load(f)
    return ChatSession(**session_data)

def load_all_sessions() -> List[ChatSession]:
    """Load all chat sessions from the history directory"""
    sessions = []
    for file in CHAT_HISTORY_DIR.glob("*.json"):
        with open(file, "r") as f:
            session_data = json.load(f)
            sessions.append(ChatSession(**session_data))
    
    # Sort by updated_at descending (newest first)
    sessions.sort(key=lambda x: x.updated_at, reverse=True)
    return sessions

def create_new_session(document_id: Optional[str] = None) -> ChatSession:
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
    
    save_chat_session(session)
    return session

def add_message_to_session(session_id: str, message: Message) -> Optional[ChatSession]:
    """Add a message to an existing chat session"""
    session = load_session_by_id(session_id)
    if not session:
        return None
    
    session.messages.append(message)
    session.updated_at = datetime.now()
    save_chat_session(session)
    return session