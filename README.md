# OLIR Chatbot – RAG-Based PDF Question Answering System

OLIR Chatbot is a document-aware AI assistant built using Retrieval-Augmented Generation (RAG). Users can upload PDF documents and chat with an AI that responds based on the uploaded content. The system includes a modern React-based frontend and a powerful FastAPI backend, featuring semantic search, GPT-based reasoning, and persistent chat history.

## 📌 Features

- 📁 Upload and process PDF documents  
- 🧠 Ask questions and get GPT answers based on your documents  
- 🔍 Semantic search using FAISS + SentenceTransformers  
- 💬 Interactive chat interface with session history  
- 📚 Document summaries and smart chunking  
- 📤 Export chat sessions (planned: TXT, Markdown, JSON)  
- ⚙️ Modern tech stack: React + FastAPI + OpenRouter + FAISS  

## 🖼️ System Architecture

### 🔧 Backend

- FastAPI (Python)  
- PyPDF2 – PDF text extraction  
- SentenceTransformers – `all-MiniLM-L6-v2` for embeddings  
- FAISS – Vector similarity search  
- OpenRouter API – LLM integration (GPT-4o-mini)  
- Uvicorn – ASGI server  
- Chat history, summaries, and vectors stored locally  

### 🌐 Frontend

- React 18 (Vite-based)  
- TailwindCSS for styling  
- React Router for navigation  
- Axios for API calls  
## Images

![img alt](https://github.com/santhosheyzz/Olir-Chatbot/blob/7c964627f9a8e6464789ec5c8b37d386f9aaf548/Documentation/loading%20screen.png)
![img alt](https://github.com/santhosheyzz/Olir-Chatbot/blob/7c964627f9a8e6464789ec5c8b37d386f9aaf548/Documentation/1.png)
![img alt](https://github.com/santhosheyzz/Olir-Chatbot/blob/7c964627f9a8e6464789ec5c8b37d386f9aaf548/Documentation/2.png)
![img alt](https://github.com/santhosheyzz/Olir-Chatbot/blob/7c964627f9a8e6464789ec5c8b37d386f9aaf548/Documentation/3.png)
![img alt](https://github.com/santhosheyzz/Olir-Chatbot/blob/7c964627f9a8e6464789ec5c8b37d386f9aaf548/Documentation/4.png)

## 📂 Project Structure

```
bash
olir-chatbot/
├── backend/
│   ├── main.py
│   ├── routers/
│   ├── utils/
│   ├── data/
│   │   ├── user_docs/
│   │   ├── faiss_index/
│   │   └── chat_history/
├── frontend/
│   ├── src/
│   ├── pages/
│   ├── components/

```

## 🚀 Getting Started

### 🛠 Backend Setup

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

### 💻 Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

## 📈 Future Enhancements

* 🗂 Multi-document querying
* 🔐 User authentication and profiles
* 📊 Filter/search by content in Document Library
* 🔄 Shareable chat sessions
* 📱 Mobile app version
* � YouTube transcript integration

## 🧠 How It Works (RAG Flow)

1. **Upload PDF** → Text is extracted, chunked, embedded
2. **Ask a Question** → Your question is embedded
3. **Search FAISS** → Most relevant chunks are retrieved
4. **LLM (GPT-4o)** → Generates a response grounded only in the retrieved content
5. **Chat Saved** → Session is logged for future reference

## 👨‍💻 Contributors

* Santhoshkumar T
* Sivaguru R
* Dilip Kumar S

## 📅 Project Timeline

* Initial build: June 2025
* Report completed: July 2025
* Deployment & enhancement: In Progress...

## 📜 License

MIT License

> 💡 Feel free to fork, star ⭐, and contribute to make this even better!
