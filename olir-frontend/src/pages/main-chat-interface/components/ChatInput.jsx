import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ChatInput = ({ onSendMessage, disabled = false }) => {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="border-t border-border bg-background p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-3">
        <div className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Ask a question about your documents..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={disabled}
              className="pr-12 resize-none min-h-[44px] max-h-32"
            />
            
            {/* Attachment Button */}
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
              title="Attach file"
            >
              <Icon name="Paperclip" size={16} />
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center space-x-2 text-xs text-text-muted">
              <Icon name="Info" size={12} />
              <span>Press Enter to send, Shift+Enter for new line</span>
            </div>
            
            <div className="text-xs text-text-muted">
              {message.length}/500
            </div>
          </div>
        </div>
        
        <Button
          type="submit"
          variant="primary"
          iconName="Send"
          disabled={!message.trim() || disabled}
          className="min-h-[44px]"
        >
          Ask
        </Button>
      </form>
    </div>
  );
};

export default ChatInput;