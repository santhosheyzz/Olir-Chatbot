import os
import requests
import json
import numpy as np
from dotenv import load_dotenv
from fastapi import APIRouter, Query, Request
from utils.embedder import get_embedding
from utils.vector_store import load_faiss_index
from utils.chat_memory import save_chat_session, load_all_sessions, load_session_by_id, add_message_to_session
from models.schemas import ChatSession, Message
from utils.context_enhancer import enhance_context_for_query
from datetime import datetime
import uuid

load_dotenv()
router = APIRouter()

OPENROUTER_API_KEY = "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"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

def is_document_related_query(message: str) -> bool:
    """Check if the user query is related to document content"""
    message_lower = message.lower().strip()

    # Very specific greetings and casual conversation that should be rejected
    casual_patterns = [
        'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
        'how are you', 'what\'s up', 'thanks', 'thank you', 'bye', 'goodbye',
        'nice to meet you', 'how do you do', 'greetings', 'sup'
    ]

    # Check if message is ONLY a greeting (exact match or very short)
    if message_lower in casual_patterns or (any(pattern == message_lower for pattern in casual_patterns)):
        return False

    # If message contains greeting but also other content, it might be valid
    if any(pattern in message_lower for pattern in casual_patterns) and len(message_lower) < 15:
        return False

    # Document-related keywords that suggest the user wants information
    document_keywords = [
        'what', 'how', 'when', 'where', 'why', 'who', 'which', 'explain', 'describe',
        'tell me', 'show me', 'list', 'define', 'meaning', 'command', 'commands',
        'function', 'purpose', 'use', 'example', 'steps', 'process', 'method',
        'difference', 'compare', 'between', 'types', 'kinds', 'categories',
        'learn', 'predict', 'chatbot', 'ai', 'artificial intelligence', 'machine learning'
    ]

    # If the message contains document-related keywords, it's likely a valid query
    if any(keyword in message_lower for keyword in document_keywords):
        return True

    # If message is longer than 8 characters and doesn't match casual patterns, assume it's document-related
    return len(message_lower) > 8

def is_greeting(message: str) -> bool:
    message_lower = message.lower().strip()
    casual_patterns = [
        'hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening',
        'how are you', "what's up", 'thanks', 'thank you', 'bye', 'goodbye',
        'nice to meet you', 'how do you do', 'greetings', 'sup'
    ]
    return message_lower in casual_patterns or (any(pattern == message_lower for pattern in casual_patterns))

@router.post("/chat")
async def chat_endpoint(request: Request, message: str = Query(None), session_id: str = Query(None)):
    """Main chat endpoint that handles both simple messages and document-filtered queries"""
    try:
        # Handle query parameter format (from frontend)
        if message:
            doc_name = None
        else:
            # Handle JSON body format
            body = await request.json()
            
            # Handle different request formats
            if "message" in body:
                # Simple message format
                message = body["message"]
                doc_name = body.get("doc_name")
                session_id = body.get("session_id")
            elif "messages" in body:
                # Messages array format
                messages = body["messages"]
                message = messages[-1]["content"] if messages else ""
                doc_name = body.get("doc_name")
                session_id = body.get("session_id")
            else:
                return {"reply": "❌ Invalid request format"}

        if not message:
            return {"reply": "❌ No message provided"}

        # Handle chat session
        if not session_id:
            # Create new session if none exists
            session_id = str(uuid.uuid4())
            session = ChatSession(
                id=session_id,
                title=f"Chat Session {datetime.now().strftime('%Y-%m-%d %H:%M')}",
                created_at=datetime.now(),
                updated_at=datetime.now(),
                messages=[],
                document_id=doc_name
            )
            save_chat_session(session)
        
        # Save user message to session
        user_message = Message(
            role="user",
            content=message,
            timestamp=datetime.now()
        )
        add_message_to_session(session_id, user_message)

        # NEW: Friendly greeting logic
        if is_greeting(message):
            friendly_greetings = [
                "Hello! How can I help you today?",
                "Hi there! What would you like to know from your documents?",
                "Hey! I'm here to assist you with your study materials.",
                "Greetings! Ask me anything about your uploaded PDFs."
            ]
            import random
            reply = random.choice(friendly_greetings)
            assistant_message = Message(
                role="assistant",
                content=reply,
                timestamp=datetime.now()
            )
            add_message_to_session(session_id, assistant_message)
            return {"reply": reply, "session_id": session_id}

        # Check if the query is document-related
        if not is_document_related_query(message):
            # Save assistant message for non-document queries too
            assistant_message = Message(
                role="assistant",
                content="I can only answer questions based on your uploaded documents. Please ask about the content in your PDFs.",
                timestamp=datetime.now()
            )
            add_message_to_session(session_id, assistant_message)
            
            return {
                "reply": "I can only answer questions based on your uploaded documents. Please ask about the content in your PDFs.",
                "session_id": session_id
            }

        # Embed the user question
        query_embedding = get_embedding(message)

        # Search vector index for most relevant chunks
        index, docs = load_faiss_index(doc_filter=doc_name)
        if index is None or not docs:
            error_message = f"❌ No data available for document: {doc_name}" if doc_name else "❌ No documents have been trained yet."
            
            # Save assistant message for error cases
            assistant_message = Message(
                role="assistant",
                content=error_message,
                timestamp=datetime.now()
            )
            add_message_to_session(session_id, assistant_message)
            
            return {
                "reply": error_message,
                "session_id": session_id
            }

        # Search for more relevant chunks with improved scoring
        D, I = index.search(np.array([query_embedding]), k=12)  # Get more candidates for comprehensive results

        # Improved relevance filtering with dynamic threshold
        relevant_chunks = []
        chunk_scores = []

        for i, distance in zip(I[0], D[0]):
            if i < len(docs):
                # Calculate relevance score (lower distance = higher relevance)
                relevance_score = 1.0 / (1.0 + distance)
                chunk_scores.append((docs[i], relevance_score, distance))

        # Sort by relevance score and filter by adaptive threshold
        chunk_scores.sort(key=lambda x: x[1], reverse=True)

        # Special handling for comprehensive queries (like "what are linux commands")
        is_comprehensive_query = any(word in message.lower() for word in ['what are', 'list all', 'show all', 'all the', 'commands'])

        # Make the search more inclusive
        if is_comprehensive_query:
            threshold = 0.2  # Lower threshold for more inclusive results
            max_chunks = 12   # More chunks for comprehensive answers
        else:
            if chunk_scores:
                best_score = chunk_scores[0][1]
                threshold = best_score * 0.4  # More lenient than before
            else:
                threshold = 0.3
            max_chunks = 8

        for chunk, score, distance in chunk_scores:
            if score >= threshold and distance < 3.0:  # More lenient distance threshold
                relevant_chunks.append(chunk)
            if len(relevant_chunks) >= max_chunks:
                break

        # If no chunks meet threshold, take the best ones
        if not relevant_chunks:
            relevant_chunks = [chunk for chunk, _, _ in chunk_scores[:max_chunks]]

        # Prepare enhanced context with better formatting and query-specific ordering
        selected_chunks = relevant_chunks[:max_chunks]
        context = enhance_context_for_query(selected_chunks, message)

        # Prepare request payload for LLM
        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost:5173",
            "X-Title": "OLIR Chatbot"
        }

        # Update system instruction to encourage use of all context
        system_instruction = (
            "You are a helpful document analysis assistant. Your task is to provide accurate and COMPREHENSIVE answers based on the provided document context.\n\n"
            "INSTRUCTIONS:\n"
            "1. Use ALL relevant information from the provided context.\n"
            "2. If the answer is present in the context, provide it clearly.\n"
            "3. If the answer is not directly in the context, but you can infer it from the context, do so and explain your reasoning.\n"
            "4. If the answer truly cannot be found, say: 'The provided document does not contain specific information about [topic]'.\n"
            "5. Include examples, details, and references from the document when available.\n"
            "6. If multiple sections are relevant, combine them in your answer.\n"
            "7. Be precise and specific.\n\n"
            "Format your response as:\n"
            "- Direct comprehensive answer using ALL relevant information from context\n"
            "- Include specific examples and syntax when available\n"
            "- Reference page/section numbers if mentioned in context"
        )

        payload = {
            "model": "mistralai/mistral-small-3.2-24b-instruct:free",  # Better model for accuracy
            "messages": [
                {"role": "system", "content": system_instruction},
                {"role": "user", "content": f"DOCUMENT CONTEXT:\n{context}\n\nUSER QUESTION: {message}\n\nPlease provide an accurate answer based solely on the document context above."}
            ],
            "temperature": 0.1,  # Lower temperature for more consistent, accurate responses
            "max_tokens": 1000
        }

        response = requests.post(OPENROUTER_URL, headers=headers, json=payload)

        if response.status_code != 200:
            error_message = f"⚠️ LLM provider error {response.status_code}"
            
            # Save assistant message for error cases
            assistant_message = Message(
                role="assistant",
                content=error_message,
                timestamp=datetime.now()
            )
            add_message_to_session(session_id, assistant_message)
            
            return {
                "reply": error_message,
                "error": response.text,
                "session_id": session_id
            }

        data = response.json()
        reply = data["choices"][0]["message"]["content"]

        # Save assistant message to session
        assistant_message = Message(
            role="assistant",
            content=reply.strip(),
            timestamp=datetime.now()
        )
        add_message_to_session(session_id, assistant_message)

        return {
            "reply": reply.strip(),
            "context_used": selected_chunks,
            "session_id": session_id
        }
        
    except Exception as e:
        print(f"Chat endpoint error: {e}")
        error_message = f"❌ Server error: {str(e)}"
        
        # Try to save error message if session_id exists
        if 'session_id' in locals():
            try:
                assistant_message = Message(
                    role="assistant",
                    content=error_message,
                    timestamp=datetime.now()
                )
                add_message_to_session(session_id, assistant_message)
            except:
                pass  # Don't fail if we can't save the error message
        
        return {"reply": error_message}

@router.get("/chat/history")
def get_all_chat_history():
    return load_all_sessions()

@router.get("/chat/history/{session_id}")
def get_chat_by_id(session_id: str):
    return load_session_by_id(session_id)
