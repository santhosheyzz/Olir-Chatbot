import faiss
import numpy as np
import os
import pickle
import traceback

INDEX_PATH = "data/faiss_index/index.faiss"
DOCS_PATH = "data/faiss_index/docs.pkl"
def save_faiss_index(index, docs):
    # ✅ Create directory if it doesn't exist
    os.makedirs(os.path.dirname(INDEX_PATH), exist_ok=True)

    faiss.write_index(index, INDEX_PATH)
    with open(DOCS_PATH, "wb") as f:
        pickle.dump(docs, f)

def load_faiss_index(doc_filter=None):
    """Load FAISS index and documents. Returns (index, docs) or (None, []) if not found."""
    if not os.path.exists(INDEX_PATH) or not os.path.exists(DOCS_PATH):
        return None, []
    
    try:
        index = faiss.read_index(INDEX_PATH)
        with open(DOCS_PATH, "rb") as f:
            docs = pickle.load(f)
        
        # Apply document filter if specified
        if doc_filter:
            # Simple substring match (original logic)
            filtered_docs = [doc for doc in docs if doc_filter in str(doc)]
            return index, filtered_docs
        
        return index, docs
    except Exception as e:
        print(f"Error loading FAISS index: {e}")
        return None, []


def create_or_update_index(embedding, chunk, docs_param=None):
    """Add a new embedding and chunk to the index"""
    index, existing_docs = load_faiss_index()

    if index is None:
        # Create new index
        dim = len(embedding)
        index = faiss.IndexFlatL2(dim)
        docs = []
    else:
        # Use existing docs
        docs = existing_docs

    # Add new embedding and chunk
    index.add(np.array([embedding]).astype('float32'), np.array([len(docs)]))
    docs.append(chunk)

    # Save updated index
    save_faiss_index(index, docs)
    
def delete_from_index(doc_name):
    if not os.path.exists(INDEX_PATH) or not os.path.exists(DOCS_PATH):
        print("⚠️ No index or docs found to delete from.")
        return

    index = faiss.read_index(INDEX_PATH)

    with open(DOCS_PATH, "rb") as f:
        docs = pickle.load(f)

    # Create new filtered docs and index
    new_docs = []
    new_vectors = []

    for i, doc_source in enumerate(docs):
        if doc_name not in doc_source:
            new_docs.append(doc_source)
            vector = index.reconstruct(i)
            new_vectors.append(vector)

    if new_vectors:
        new_index = faiss.IndexFlatL2(index.d)
        new_index.add(np.array(new_vectors).astype('float32'), np.arange(len(new_vectors)))
        faiss.write_index(new_index, INDEX_PATH)
    else:
        # Save an empty index
        new_index = faiss.IndexFlatL2(index.d)
        faiss.write_index(new_index, INDEX_PATH)

    with open(DOCS_PATH, "wb") as f:
        pickle.dump(new_docs, f)

    print(f"✅ Deleted vectors related to {doc_name} from index.")