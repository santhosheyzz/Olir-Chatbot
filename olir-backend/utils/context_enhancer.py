import re
from typing import List, Tuple

def enhance_context_for_query(chunks: List[str], query: str) -> str:
    """
    Enhance the context by reordering and formatting chunks based on query relevance
    """
    # Check if this is a comprehensive query
    is_comprehensive = any(phrase in query.lower() for phrase in [
        'what are', 'list all', 'show all', 'all the', 'commands', 'what commands'
    ])

    # Score chunks based on keyword overlap with query
    query_keywords = extract_keywords(query.lower())
    scored_chunks = []

    for chunk in chunks:
        score = calculate_keyword_overlap(chunk.lower(), query_keywords)
        # Boost score for chunks that contain lists or multiple items
        if is_comprehensive and contains_multiple_items(chunk):
            score += 0.3  # Boost chunks with lists for comprehensive queries
        scored_chunks.append((chunk, score))

    # Sort by relevance score
    scored_chunks.sort(key=lambda x: x[1], reverse=True)

    # Format the context with clear separators
    formatted_chunks = []
    for i, (chunk, score) in enumerate(scored_chunks):
        # Add section headers for better organization
        section_header = f"=== DOCUMENT SECTION {i+1} ==="
        formatted_chunks.append(f"{section_header}\n{chunk}")

    return "\n\n".join(formatted_chunks)

def contains_multiple_items(text: str) -> bool:
    """Check if text contains multiple items (lists, commands, etc.)"""
    # Count numbered items, bullet points, or command patterns
    numbered_items = len(re.findall(r'^\d+[\.\)]\s+', text, re.MULTILINE))
    bullet_points = len(re.findall(r'^[•\-\*]\s+', text, re.MULTILINE))
    command_patterns = len(re.findall(r'`[^`]+`', text))  # Commands in backticks

    return (numbered_items + bullet_points + command_patterns) >= 3

def extract_keywords(text: str) -> List[str]:
    """Extract meaningful keywords from query text"""
    # Remove common stop words but keep technical terms
    stop_words = {
        'what', 'how', 'when', 'where', 'why', 'who', 'which', 'is', 'are',
        'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do',
        'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might',
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'about', 'can', 'tell', 'me', 'please', 'explain'
    }

    # Important technical terms that should always be included
    important_terms = {
        'linux', 'command', 'commands', 'terminal', 'shell', 'bash', 'system',
        'file', 'directory', 'process', 'user', 'permission', 'network'
    }

    # Extract words and filter
    words = re.findall(r'\b\w+\b', text.lower())
    keywords = []

    for word in words:
        if word in important_terms:
            keywords.append(word)
        elif word not in stop_words and len(word) > 2:
            keywords.append(word)

    return keywords

def calculate_keyword_overlap(text: str, keywords: List[str]) -> float:
    """Calculate how many query keywords appear in the text"""
    if not keywords:
        return 0.0
    
    text_words = set(re.findall(r'\b\w+\b', text.lower()))
    matches = sum(1 for keyword in keywords if keyword in text_words)
    
    # Also check for partial matches (important for technical terms)
    partial_matches = 0
    for keyword in keywords:
        if any(keyword in word or word in keyword for word in text_words):
            partial_matches += 0.5
    
    return (matches + partial_matches) / len(keywords)

def preprocess_pdf_text(text: str) -> str:
    """
    Preprocess PDF text to improve extraction quality
    """
    # Fix common PDF extraction issues
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)  # Add space between camelCase
    text = re.sub(r'(\w)(\d)', r'\1 \2', text)        # Add space between word and number
    text = re.sub(r'(\d)(\w)', r'\1 \2', text)        # Add space between number and word
    
    # Fix broken words across lines
    text = re.sub(r'(\w)-\s*\n\s*(\w)', r'\1\2', text)  # Remove hyphenation
    
    # Normalize whitespace but preserve paragraph structure
    text = re.sub(r'[ \t]+', ' ', text)               # Multiple spaces to single
    text = re.sub(r'\n{3,}', '\n\n', text)           # Multiple newlines to double
    
    # Fix common OCR errors
    text = re.sub(r'\bl\b', 'I', text)               # Common OCR error: l -> I
    text = re.sub(r'\b0\b', 'O', text)               # Common OCR error: 0 -> O
    
    return text.strip()

def extract_document_structure(text: str) -> dict:
    """
    Extract document structure like headings, sections, etc.
    """
    lines = text.split('\n')
    structure = {
        'headings': [],
        'sections': [],
        'numbered_items': [],
        'bullet_points': []
    }
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
        
        # Detect headings (various patterns)
        if (line.isupper() and len(line) > 3 and len(line) < 100) or \
           re.match(r'^\d+\.\s+[A-Z]', line) or \
           re.match(r'^[A-Z][^.!?]*$', line):
            structure['headings'].append((i, line))
        
        # Detect numbered items
        if re.match(r'^\d+[\.\)]\s+', line):
            structure['numbered_items'].append((i, line))
        
        # Detect bullet points
        if re.match(r'^[•\-\*]\s+', line):
            structure['bullet_points'].append((i, line))
    
    return structure
