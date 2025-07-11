import axios from 'axios';

const BASE_URL = 'http://localhost:8000'; // Backend URL

export const sendChatMessage = async (message) => {
  const res = await axios.post(`${BASE_URL}/chat`, null, {
    params: { message }
  });
  return res.data;
};

// src/api/chat.js

export const saveChatHistory = async (messages) => {
  const res = await fetch("http://localhost:8000/save_chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages }),
  });
  return await res.json();
};

export async function listChatHistories() {
  const res = await fetch("http://localhost:8000/api/v1/chat-history/list");
  const data = await res.json();
  return { chats: data };
}

export async function exportChatHistory(session_id) {
  const res = await fetch(`http://localhost:8000/chat-sessions/${session_id}`);
  const data = await res.json();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `chat-${session_id}.json`;
  link.click();
}
