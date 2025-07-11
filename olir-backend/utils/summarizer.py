import requests
import os

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
MODEL = "mistralai/mistral-7b-instruct"

def generate_summary_from_text(text):
    if not OPENROUTER_API_KEY:
        raise ValueError("Missing OpenRouter API key")

    prompt = f"Summarize this document content in 3–4 sentences:\n\n{text[:1500]}"

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
            "HTTP-Referer": "http://localhost",  # Optional
            "X-Title": "OLIR Chatbot",
        },
        json={
            "model": MODEL,
            "messages": [
                {"role": "user", "content": prompt}
            ]
        }
    )

    result = response.json()
    if "choices" in result:
        return result["choices"][0]["message"]["content"]
    else:
        return "Summary not available."
