# routers/training_history.py

from fastapi import APIRouter
import os
from pathlib import Path

router = APIRouter()

@router.get("/training-history")
def get_training_history():
    training_folder = Path("data/user_docs/")
    if not training_folder.exists():
        return {"files": []}
    
    files = [
        {
            "filename": file.name,
            "size": file.stat().st_size,
        }
        for file in training_folder.glob("*.pdf")
    ]
    return {"files": files}
