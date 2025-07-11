import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DocumentSidebar from '../../components/ui/DocumentSidebar';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import ChatArea from './components/ChatArea';
import ChatInput from './components/ChatInput';
import DocumentPanel from './components/DocumentPanel';

const MainChatInterface = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [conversationId, setConversationId] = useState(null);
  const [showDocBanner, setShowDocBanner] = useState(true);

  // Fetch documents
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("http://localhost:8000/documents");
        const data = await response.json();

        const trainingFiles = JSON.parse(sessionStorage.getItem('trainingFiles') || '[]');
        
        const formatted = data.map((doc, index) => ({
          id: index + 1,
          name: doc.name,
          type: doc.type,
          size: doc.size,
          pages: doc.pages || null,
          status: trainingFiles.includes(doc.name) ? 'training' : (doc.status || "trained"),
          uploadDate: doc.uploadDate || "Unknown",
          summary: doc.summary || "No summary available."
        }));

        setDocuments(formatted);

        if (trainingFiles.length > 0) {
          setTimeout(() => {
            setDocuments(prevDocs => prevDocs.map(doc =>
              trainingFiles.includes(doc.name) ? { ...doc, status: 'trained' } : doc
            ));
            sessionStorage.removeItem('trainingFiles');
          }, 3000); // Simulate training time
        }

      } catch (error) {
        console.error("Failed to load documents:", error);
      }
    };

    fetchDocuments();
  }, []);

  // Handle conversation loading
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const conversationIdFromUrl = params.get('conversation');

    if (conversationIdFromUrl) {
      handleContinueChat(conversationIdFromUrl);
    } else {
      const welcomeMessages = [
        "👋 Hi! I'm your AI study assistant. Ask me anything about your documents.",
        "Hello! I'm ready to help you study. What would you like to know from your PDFs?",
        "Welcome! Your personal AI study partner is here. How can I assist you with your documents?",
        "Hey there! Let's dive into your documents. What are you curious about?",
      ];

      const welcomeMessage = {
        content: welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)],
        isUser: false,
        timestamp: new Date()
      };
      setMessages([welcomeMessage]);
    }
  }, []);

  const handleContinueChat = async (conversationId) => {
    try {
      const res = await fetch(`http://localhost:8000/api/v1/chat-history/${conversationId}`);
      const data = await res.json();
      const formattedMessages = data.messages.map(msg => ({
        content: msg.content,
        isUser: msg.role === 'user',
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(formattedMessages);
      setConversationId(conversationId);
    } catch (error) {
      console.error("Failed to load conversation:", error);
      setMessages([{
        content: "⚠️ Failed to load conversation history.",
        isUser: false,
        timestamp: new Date()
      }]);
    }
  };

  const handleSendMessage = async (message) => {
    const userMessage = {
      content: message,
      isUser: true,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      let url = "http://localhost:8000/chat?message=" + encodeURIComponent(message);
      if (selectedDocumentId) {
        const selectedDoc = documents.find(doc => doc.id === selectedDocumentId);
        if (selectedDoc) {
          url += "&doc_name=" + encodeURIComponent(selectedDoc.name);
        }
      }
      if (conversationId) {
        url += `&session_id=${conversationId}`;
      }

      const res = await fetch(url, {
        method: "POST"
      });

      const data = await res.json();
      if (!conversationId) {
        setConversationId(data.session_id);
      }
      const aiResponse = {
        content: data.reply || "❌ Sorry, I couldn't find an answer based on your documents.",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error("Chat API error:", error);
      setMessages(prev => [...prev, {
        content: "⚠️ Failed to connect to the AI backend.",
        isUser: false,
        timestamp: new Date()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleDocumentSelect = (documentId) => {
    setSelectedDocumentId(documentId === selectedDocumentId ? null : documentId);
  };

  const handleDocumentAction = (action, documentId) => {
    switch (action) {
      case 'upload': navigate('/document-upload-training');
        break;
      case 'chat':
        setSelectedDocumentId(documentId);
        break;
      case 'view': navigate('/document-library-management');
        break;
      case 'retrain': console.log('Retraining document:', documentId);
        break;
      default:
        console.log(`${action} action for document:`, documentId);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="pt-16 h-screen flex">
        {/* Desktop Document Panel - Left Side (30%) */}
        <div className="hidden lg:block w-80 xl:w-96">
          <DocumentPanel
            documents={documents}
            onDocumentSelect={handleDocumentSelect}
            onDocumentAction={handleDocumentAction}
            selectedDocumentId={selectedDocumentId}
          />
        </div>

        {/* Main Chat Area - Right Side (70%) */}
        <div className="flex-1 flex flex-col">
          {/* Selected Document Banner */}
          {selectedDocumentId && showDocBanner && (
            <div className="bg-primary-50 border-b border-primary-200 px-6 py-3 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="FileText" size={18} color="var(--color-primary)" />
                <span className="text-primary-700 font-medium text-sm">
                  Chatting with: {documents.find(doc => doc.id === selectedDocumentId)?.name}
                </span>
              </div>
              <button
                className="ml-4 text-primary-400 hover:text-primary-700 text-xs font-semibold"
                onClick={() => setShowDocBanner(false)}
                title="Hide banner"
              >
                Hide
              </button>
            </div>
          )}

          {/* Chat Messages Area */}
          <ChatArea messages={messages} isTyping={isTyping} />

          {/* Chat Input */}
          <ChatInput 
            onSendMessage={handleSendMessage}
            disabled={documents.filter(d => d.status === 'trained').length === 0}
          />
        </div>

        {/* Mobile Document Sidebar */}
        <DocumentSidebar
          isOpen={isSidebarOpen}
          onToggle={() => setIsSidebarOpen(false)}
          className="lg:hidden"
        />

        {/* Assistant Mascot (REMOVED) */}
        {/* <AssistantMascot
          isThinking={isTyping}
          messageCount={messages.length}
        /> */}

        {/* Floating Upload Button - Mobile */}
        <div className="lg:hidden fixed bottom-20 right-4 z-40">
          <Button
            variant="primary"
            size="lg"
            iconName="Plus"
            onClick={() => navigate('/document-upload-training')}
            className="rounded-full w-14 h-14 shadow-floating"
          />
        </div>
      </div>

      {/* No Documents State Overlay */}
      {documents.filter(d => d.status === 'trained').length === 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 pt-16">
          <div className="glass-card max-w-md mx-4 p-6 text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon name="Upload" size={24} color="var(--color-primary)" />
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
              No Trained Documents
            </h3>
            <p className="text-text-secondary text-sm mb-6">
              Upload and train your documents to start chatting with your AI study assistant.
            </p>
            <Button
              variant="primary"
              iconName="Upload"
              onClick={() => navigate('/document-upload-training')}
              fullWidth
            >
              Upload Documents
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainChatInterface;
