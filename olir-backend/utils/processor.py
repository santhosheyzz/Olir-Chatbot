import re
from PyPDF2 import PdfReader
import os

def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from PDF with better formatting"""
    reader = PdfReader(file_path)
    text = ""
    for page_num, page in enumerate(reader.pages):
        page_text = page.extract_text()
        # Add page number for reference
        text += f"\n=== Page {page_num + 1} ===\n{page_text}\n"
    return text

def smart_chunk_text(text: str, chunk_size: int = 1200, overlap: int = 200) -> list:
    """
    Create intelligent text chunks that respect paragraph and sentence boundaries
    and maintain context with meaningful overlap for better accuracy
    """
    # Clean up the text but preserve paragraph structure
    text = re.sub(r'\n{3,}', '\n\n', text)  # Normalize excessive newlines to double
    text = re.sub(r'[ \t]+', ' ', text)     # Normalize spaces and tabs

    # Split into paragraphs first, then sentences
    paragraphs = text.split('\n\n')
    chunks = []
    current_chunk = ""

    for paragraph in paragraphs:
        paragraph = paragraph.strip()
        if not paragraph:
            continue

        # If adding this paragraph would exceed chunk size
        if len(current_chunk) + len(paragraph) > chunk_size and current_chunk:
            chunks.append(current_chunk.strip())

            # Create meaningful overlap by including last sentences
            if overlap > 0:
                sentences = re.split(r'(?<=[.!?])\s+', current_chunk)
                overlap_text = ""
                for sentence in reversed(sentences):
                    if len(overlap_text) + len(sentence) <= overlap:
                        overlap_text = sentence + " " + overlap_text
                    else:
                        break
                current_chunk = overlap_text.strip() + "\n\n" + paragraph
            else:
                current_chunk = paragraph
        else:
            if current_chunk:
                current_chunk += "\n\n" + paragraph
            else:
                current_chunk = paragraph

    # Add the last chunk
    if current_chunk.strip():
        chunks.append(current_chunk.strip())

    # If we have very long paragraphs, split them by sentences
    final_chunks = []
    for chunk in chunks:
        if len(chunk) > chunk_size * 1.5:  # If chunk is too large
            sentences = re.split(r'(?<=[.!?])\s+', chunk)
            temp_chunk = ""
            for sentence in sentences:
                if len(temp_chunk) + len(sentence) > chunk_size and temp_chunk:
                    final_chunks.append(temp_chunk.strip())
                    temp_chunk = sentence
                else:
                    temp_chunk += " " + sentence if temp_chunk else sentence
            if temp_chunk.strip():
                final_chunks.append(temp_chunk.strip())
        else:
            final_chunks.append(chunk)

    return final_chunks

def extract_key_information(text: str) -> dict:
    """Extract key information like headings, definitions, etc."""
    lines = text.split('\n')
    key_info = {
        'headings': [],
        'definitions': [],
        'important_points': []
    }
    
    for line in lines:
        line = line.strip()
        if not line:
            continue
            
        # Detect headings (all caps, or numbered sections)
        if (line.isupper() and len(line) > 3) or re.match(r'^\d+\.', line):
            key_info['headings'].append(line)
        
        # Detect definitions (contains "is", "means", "refers to")
        if any(word in line.lower() for word in ['is defined as', 'means', 'refers to', 'is the']):
            key_info['definitions'].append(line)
        
        # Detect important points (starts with bullet points or numbers)
        if re.match(r'^[•\-\*]\s+|^\d+\.\s+', line):
            key_info['important_points'].append(line)
    
    return key_info
