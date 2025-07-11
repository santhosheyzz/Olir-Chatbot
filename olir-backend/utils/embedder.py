import os
from sentence_transformers import SentenceTransformer
import openai
from dotenv import load_dotenv

load_dotenv()

EMBED_MODEL = os.getenv("EMBED_MODEL", "sentence-transformers/all-MiniLM-L6-v2")
openai.api_key = os.getenv("OPENAI_API_KEY")

model = SentenceTransformer(EMBED_MODEL)

def get_embedding(text: str):
    return model.encode([text])[0]
