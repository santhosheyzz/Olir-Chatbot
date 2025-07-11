import requests
import os
import json

# --- Configuration ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
ANALYSIS_MODEL = "openai/gpt-4o-mini"

# --- Helper Function to Call LLM ---
def _call_llm(payload: dict) -> str:
    """Generic function to make a call to the OpenRouter API."""
    headers = {
        "Authorization": f"Bearer {OPENROUTER_API_KEY}",
        "Content-Type": "application/json",
        "HTTP-Referer": "http://localhost:5173",
        "X-Title": "OLIR Chatbot"
    }
    
    response = requests.post(OPENROUTER_URL, headers=headers, json=payload)
    
    if response.status_code != 200:
        print(f"LLM provider error {response.status_code}: {response.text}")
        return f"Error: LLM provider returned status {response.status_code}"
        
    data = response.json()
    if "choices" in data and data["choices"]:
        return data["choices"][0]["message"]["content"]
    else:
        print(f"LLM response format error: {data}")
        return "Error: Could not get a valid response from the language model."

def generate_document_analysis(text: str) -> dict:
    """
    Generates a structured analysis of the document, including summary, key points, and table of contents.
    """
    analysis_prompt = (
        "You are a document analysis expert. Your task is to analyze the provided document content and generate a structured JSON output containing a summary, key points, and a table of contents.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1.  **Summary**: Provide a concise summary of the document (4-5 sentences).\n"
        "2.  **Key Points**: Extract the most important topics or conclusions as a list of strings.\n"
        "3.  **Table of Contents**: Create a table of contents with chapter/section titles and corresponding page ranges (e.g., 'Chapter 1: Introduction, Pages 1-5'). If the document has no clear structure, create a logical one based on the content.\n"
        "4.  Format the output as a single, clean JSON object with the keys 'summary', 'key_points', and 'table_of_contents'.\n\n"
        f"DOCUMENT CONTENT (first 4000 characters):\n---\n{text[:4000]}\n---\n\n"
        "JSON OUTPUT:"
    )
    
    payload = {
        "model": ANALYSIS_MODEL,
        "messages": [{"role": "user", "content": analysis_prompt}],
        "temperature": 0.1,
        "max_tokens": 1500,
        "response_format": {"type": "json_object"}
    }
    
    response_str = _call_llm(payload)
    try:
        return json.loads(response_str)
    except (json.JSONDecodeError, TypeError):
        return {
            "summary": "Could not generate summary.",
            "key_points": [],
            "table_of_contents": []
        }