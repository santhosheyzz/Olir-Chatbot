import React from 'react';
import Icon from '../../../components/AppIcon';

const ChatMessage = ({ message, isUser, timestamp, isTyping = false }) => {
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  if (isTyping) {
    return (
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <Icon name="Bot" size={16} color="white" />
          </div>
        </div>
        <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-start space-x-3 mb-4 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 bg-gradient-to-br from-accent-400 to-accent-600 rounded-full flex items-center justify-center">
            <Icon name="User" size={16} color="white" />
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center">
            <Icon name="Bot" size={16} color="white" />
          </div>
        )}
      </div>
      
      <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${isUser ? 'text-right' : ''}`}>
        <div className={`
          glass-card px-4 py-3 transition-all duration-300 hover:shadow-elevated
          ${isUser 
            ? 'bg-primary-500 text-white rounded-2xl rounded-tr-sm' :'rounded-2xl rounded-tl-sm'
          }
        `}>
          <p className="text-sm leading-relaxed whitespace-pre-wrap">{message}</p>
          
          {!isUser && (
            <div className="flex items-center space-x-2 mt-3 pt-2 border-t border-border">
              <button
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
                title="Copy message"
                onClick={() => navigator.clipboard.writeText(message)}
              >
                <Icon name="Copy" size={14} />
              </button>
              <button
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
                title="Download answer"
              >
                <Icon name="Download" size={14} />
              </button>
            </div>
          )}
        </div>
        
        <div className={`text-xs text-text-muted mt-1 ${isUser ? 'text-right' : 'text-left'}`}>
          {formatTime(timestamp)}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;