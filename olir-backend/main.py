from fastapi import FastAPI, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from routers import chat, upload, history
from routers import training_history
import uvicorn

app = FastAPI()

# Allow frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(chat.router)
app.include_router(upload.router)
app.include_router(history.router)
app.include_router(training_history.router)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8818)