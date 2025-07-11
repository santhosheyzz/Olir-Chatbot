import api from './index';

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  messages: Message[];
  documentId?: string;
}

export const createChatSession = async (documentId?: string): Promise<ChatSession> => {
  const response = await api.post('/api/v1/chat-history/', { document_id: documentId });
  return response.data;
};

export const addMessageToSession = async (sessionId: string, message: Omit<Message, 'timestamp'>): Promise<ChatSession> => {
  const response = await api.post(`/api/v1/chat-history/${sessionId}/messages`, message);
  return response.data;
};

export const listChatSessions = async (): Promise<ChatSession[]> => {
  const response = await api.get('/api/v1/chat-history/list');
  return response.data;
};

export const getChatSession = async (sessionId: string): Promise<ChatSession> => {
  const response = await api.get(`/api/v1/chat-history/${sessionId}`);
  return response.data;
};

export const deleteChatSession = async (sessionId: string): Promise<void> => {
  await api.delete(`/api/v1/chat-history/${sessionId}`);
};

export const exportChatSession = async (sessionId: string): Promise<void> => {
  const response = await api.get(`/api/v1/chat-history/${sessionId}/export`, {
    responseType: 'blob',
  });
  
  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `chat_session_${sessionId}.json`);
  document.body.appendChild(link);
  link.click();
  link.parentNode?.removeChild(link);
};
