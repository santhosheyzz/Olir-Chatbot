from fastapi import APIRouter, UploadFile, File, Body
import os
import datetime
import json
from fastapi.responses import FileResponse
from utils.processor import extract_text_from_pdf, smart_chunk_text, extract_key_information
from utils.context_enhancer import preprocess_pdf_text
from utils.embedder import get_embedding
from utils.vector_store import create_or_update_index
from utils.summarizer import generate_summary_from_text
from utils.training_memory import training_sessions
from datetime import datetime
import uuid
import time
from fastapi import HTTPException
from fastapi.responses import JSONResponse
from utils.vector_store import delete_from_index
import traceback

router = APIRouter()

UPLOAD_DIR = "data/user_docs/"
os.makedirs(UPLOAD_DIR, exist_ok=True)  # ✅ Important fix here

def fetch_youtube_transcript(url: str) -> str:
    # MOCK: Replace with real implementation or use youtube_transcript_api
    # For now, just return a dummy transcript
    return f"Transcript for {url}\nThis is a mock transcript. Replace with real fetch logic."

@router.post("/upload-youtube")
async def upload_youtube_and_train(youtube_url: str = Body(..., embed=True)):
    start_time = time.time()

    # Fetch transcript
    transcript_text = fetch_youtube_transcript(youtube_url)
    if not transcript_text or len(transcript_text.strip()) < 10:
        return {"error": "Failed to fetch transcript or transcript is empty."}

    # Save transcript as a .txt file
    import re
    safe_title = re.sub(r'[^a-zA-Z0-9_-]', '_', youtube_url[-20:])
    filename = f"youtube_{safe_title}.txt"
    file_path = os.path.join(UPLOAD_DIR, filename)
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(transcript_text)

    # Preprocess text to improve quality
    text = preprocess_pdf_text(transcript_text)

    # Extract key information for better context
    key_info = extract_key_information(text)
    
    # Create intelligent chunks with better parameters for accuracy
    chunks = smart_chunk_text(text, chunk_size=1200, overlap=200)
    
    # Add document metadata to each chunk for better retrieval
    enhanced_chunks = []
    for i, chunk in enumerate(chunks):
        enhanced_chunk = f"Document: {filename}\nChunk {i+1}/{len(chunks)}\n\n{chunk}"
        enhanced_chunks.append(enhanced_chunk)
    
    # Store embeddings for all chunks
    for chunk in enhanced_chunks:
        emb = get_embedding(chunk)
        create_or_update_index(emb, chunk, [])
    
    # Also store key information separately for better retrieval
    for heading in key_info['headings'][:5]:
        enhanced_heading = f"Document: {filename}\nHeading: {heading}"
        emb = get_embedding(enhanced_heading)
        create_or_update_index(emb, enhanced_heading, [])
    for definition in key_info['definitions'][:10]:
        enhanced_definition = f"Document: {filename}\nDefinition: {definition}"
        emb = get_embedding(enhanced_definition)
        create_or_update_index(emb, enhanced_definition, [])

    duration = round(time.time() - start_time, 2)

    training_sessions.append({
        "id": str(uuid.uuid4()),
        "status": "completed",
        "timestamp": datetime.now().isoformat(),
        "duration": f"{duration}s",
        "documentsCount": 1,
        "documents": [{"name": filename}]
    })

    return {
        "message": "YouTube transcript uploaded and trained successfully",
        "filename": filename,
        "duration": duration
    }

@router.post("/upload")
async def upload_and_train(file: UploadFile = File(...)):
    start_time = time.time()

    # Fix: Ensure file.filename is not None
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file name provided.")
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Extract text from PDF
    raw_text = extract_text_from_pdf(file_path)

    # Preprocess text to improve quality
    text = preprocess_pdf_text(raw_text)

    # Extract key information for better context
    key_info = extract_key_information(text)
    
    # Create intelligent chunks with better parameters for accuracy
    chunks = smart_chunk_text(text, chunk_size=1200, overlap=200)
    
    # Add document metadata to each chunk for better retrieval
    enhanced_chunks = []
    for i, chunk in enumerate(chunks):
        # Add document context to each chunk
        enhanced_chunk = f"Document: {file.filename}\nChunk {i+1}/{len(chunks)}\n\n{chunk}"
        enhanced_chunks.append(enhanced_chunk)
    
    # Store embeddings for all chunks
    for chunk in enhanced_chunks:
        emb = get_embedding(chunk)
        create_or_update_index(emb, chunk, [])
    
    # Also store key information separately for better retrieval
    for heading in key_info['headings'][:5]:  # Limit to top 5 headings
        enhanced_heading = f"Document: {file.filename}\nHeading: {heading}"
        emb = get_embedding(enhanced_heading)
        create_or_update_index(emb, enhanced_heading, [])
    
    for definition in key_info['definitions'][:10]:  # Limit to top 10 definitions
        enhanced_definition = f"Document: {file.filename}\nDefinition: {definition}"
        emb = get_embedding(enhanced_definition)
        create_or_update_index(emb, enhanced_definition, [])

    duration = round(time.time() - start_time, 2)

    training_sessions.append({
        "id": str(uuid.uuid4()),
        "status": "completed",
        "timestamp": datetime.now().isoformat(),
        "duration": f"{duration}s",
        "documentsCount": 1,
        "documents": [{"name": file.filename}]
    })

    # ✅ This return was missing
    return {
        "message": "File uploaded and trained successfully",
        "filename": file.filename,
        "duration": duration
    }
 

@router.get("/documents")
async def list_documents():
    files = os.listdir(UPLOAD_DIR)
    docs = []

    for f in files:
        file_path = os.path.join(UPLOAD_DIR, f)

        # Skip if it's not a file
        if not os.path.isfile(file_path):
            continue

        # Calculate file size in MB
        size_mb = os.path.getsize(file_path) / (1024 * 1024)

        # Get last modified time
        upload_date = datetime.fromtimestamp(
            os.path.getmtime(file_path)
        ).strftime('%Y-%m-%d')

        # Attempt to load summary from JSON
        summary = "No summary available."
        summary_path = os.path.splitext(file_path)[0] + ".json"
        if os.path.exists(summary_path):
            try:
                with open(summary_path, "r") as sf:
                    summary_data = json.load(sf)
                    summary = summary_data.get("summary", summary)
            except Exception as e:
                print(f"Failed to read summary for {f}: {e}")

        # Append document info
        docs.append({
            "name": f,
            "type": f.split(".")[-1],
            "size": f"{size_mb:.1f} MB",
            "pages": None,  # You can update if you extract page count
            "status": "trained",  # Optionally derive from training logic
            "uploadDate": upload_date,
            "summary": summary
        })

    return docs



@router.delete("/documents/{filename}")
async def delete_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    summary_path = os.path.splitext(file_path)[0] + ".json"

    if not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="File not found")

    try:
        # Optional: remove from FAISS index
        delete_from_index(filename)  # <-- could be failing

        os.remove(file_path)
        if os.path.exists(summary_path):
            os.remove(summary_path)

        return {"detail": "Document deleted successfully"}
    except Exception as e:
        print("🔥 DELETE ERROR:", traceback.format_exc())  # Debug log
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")
    
    
@router.get("/download/{filename}")
async def download_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(path=file_path, filename=filename, media_type='application/octet-stream')
    return {"error": "File not found"}