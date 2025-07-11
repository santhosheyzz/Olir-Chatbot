import React, { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

const ChatArea = ({ messages, isTyping }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🤖</span>
            </div>
            <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
              Welcome to OLIR ChatBot!
            </h3>
            <p className="text-text-secondary text-sm leading-relaxed">
              Upload your documents and start asking questions. I'll help you understand your study materials better by providing accurate answers based on your uploaded content.
            </p>
            <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <p className="text-xs text-primary-700">
                💡 <strong>Tip:</strong> Try asking specific questions about concepts, definitions, or explanations from your documents for the best results.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message, index) => (
            <ChatMessage
              key={index}
              message={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          
          {isTyping && (
            <ChatMessage isTyping={true} />
          )}
        </>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};

export default ChatArea;