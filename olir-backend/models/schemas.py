from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel

class Message(BaseModel):
    role: str  # "user" or "assistant"
    content: str
    timestamp: datetime

class ChatSession(BaseModel):
    id: str
    title: str
    created_at: datetime
    updated_at: datetime
    messages: List[Message]
    document_id: Optional[str] = None  # if chat is related to a specific document