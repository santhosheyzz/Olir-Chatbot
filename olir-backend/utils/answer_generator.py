import requests
import os

# --- Configuration ---
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY", "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")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"
EXTRACTION_MODEL = "openai/gpt-4o-mini"
SYNTHESIS_MODEL = "openai/gpt-4o-mini"

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

# --- Step 1: Information Extraction ---
def extract_facts_from_context(context: str, query: str) -> str:
    """
    First LLM call to extract all relevant facts from the context based on the user query.
    This step focuses on gathering raw information, not on formatting.
    """
    extraction_prompt = (
        "You are a data extraction specialist. Your task is to extract ALL relevant facts, figures, and key points from the provided document context that directly answer the user's question.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Be comprehensive. Extract every piece of information related to the query.\n"
        "2. Do not summarize or rephrase. Extract the information as close to the original text as possible.\n"
        "3. If the context contains lists (e.g., commands, features, steps), extract all items in the list.\n"
        "4. Ignore information that is not relevant to the user's question.\n"
        "5. Present the extracted facts in a clear, structured list or a simple JSON format. Use bullet points for lists.\n"
        "6. If no relevant information is found, state 'NO_RELEVANT_INFORMATION_FOUND'.\n\n"
        f"DOCUMENT CONTEXT:\n---\n{context}\n---\n\n"
        f"USER QUESTION: {query}\n\n"
        "EXTRACTED FACTS:"
    )
    
    payload = {
        "model": EXTRACTION_MODEL,
        "messages": [{"role": "user", "content": extraction_prompt}],
        "temperature": 0.0,
        "max_tokens": 1500
    }
    
    return _call_llm(payload)

# --- Step 2: Answer Synthesis ---
def synthesize_answer_from_facts(facts: str, query: str) -> str:
    """
    Second LLM call to synthesize a final, well-structured answer from the extracted facts.
    This step focuses on presentation and clarity.
    """
    synthesis_prompt = (
        "You are an expert technical writer. Your task is to synthesize the provided extracted facts into a comprehensive, clear, and well-structured answer to the user's question.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Start with a clear, introductory sentence that directly addresses the user's question.\n"
        "2. Use the extracted facts to build your answer. Do NOT use any external knowledge.\n"
        "3. When presenting lists (like commands or features), use bullet points for readability.\n"
        "4. For each item in a list, provide the necessary details included in the facts (e.g., command descriptions, syntax).\n"
        "5. Combine related information into logical paragraphs.\n"
        "6. End with a concluding sentence that summarizes the key takeaway, if appropriate.\n"
        "7. If the facts state 'NO_RELEVANT_INFORMATION_FOUND', your response should be: 'The provided document does not contain specific information about your query.'\n\n"
        f"USER'S ORIGINAL QUESTION: {query}\n\n"
        f"EXTRACTED FACTS:\n---\n{facts}\n---\n\n"
        "FINAL COMPREHENSIVE ANSWER:"
    )
    
    payload = {
        "model": SYNTHESIS_MODEL,
        "messages": [{"role": "user", "content": synthesis_prompt}],
        "temperature": 0.1,
        "max_tokens": 1000
    }
    
    return _call_llm(payload)

# --- Step 3: General Answer Generation ---
def answer_general_query_from_text(context: str, query: str) -> str:
    """
    Answers a general question using the full text of a document.
    This is for broad questions that don't rely on specific vector-searched chunks.
    """
    general_prompt = (
        "You are a helpful AI assistant. Your task is to answer the user's question based on the provided document content.\n\n"
        "CRITICAL INSTRUCTIONS:\n"
        "1. Read the document content and the user's question carefully.\n"
        "2. Provide a comprehensive and clear answer based ONLY on the document.\n"
        "3. If the question is about summarizing the document, provide a concise summary.\n"
        "4. Do not use any external knowledge.\n\n"
        f"DOCUMENT CONTENT:\n---\n{context}\n---\n\n"
        f"USER QUESTION: {query}\n\n"
        "ANSWER:"
    )
    
    payload = {
        "model": SYNTHESIS_MODEL,
        "messages": [{"role": "user", "content": general_prompt}],
        "temperature": 0.2,
        "max_tokens": 1200
    }
    
    return _call_llm(payload)