import React, { useState } from 'react';
import ConversationCard from './ConversationCard';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationList = ({ 
  conversations, 
  loading, 
  onContinue, 
  onExport, 
  onDelete, 
  onToggleFavorite,
  searchQuery,
  className = '' 
}) => {
  const [selectedConversations, setSelectedConversations] = useState([]);
  const [showBulkActions, setShowBulkActions] = useState(false);

  const handleSelectConversation = (conversationId) => {
    setSelectedConversations(prev => {
      const newSelection = prev.includes(conversationId)
        ? prev.filter(id => id !== conversationId)
        : [...prev, conversationId];
      
      setShowBulkActions(newSelection.length > 0);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    if (selectedConversations.length === conversations.length) {
      setSelectedConversations([]);
      setShowBulkActions(false);
    } else {
      setSelectedConversations(conversations.map(conv => conv.id));
      setShowBulkActions(true);
    }
  };

  const handleBulkAction = (action) => {
    console.log(`Bulk ${action} for conversations:`, selectedConversations);
    // Handle bulk actions here
    setSelectedConversations([]);
    setShowBulkActions(false);
  };

  const groupConversationsByDate = (conversations) => {
    const groups = {};
    conversations.forEach(conv => {
      const date = new Date(conv.date);
      const today = new Date();
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      
      let groupKey;
      if (date.toDateString() === today.toDateString()) {
        groupKey = 'Today';
      } else if (date.toDateString() === yesterday.toDateString()) {
        groupKey = 'Yesterday';
      } else {
        groupKey = date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
      
      if (!groups[groupKey]) {
        groups[groupKey] = [];
      }
      groups[groupKey].push(conv);
    });
    
    return groups;
  };

  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-warning-200 text-warning-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  if (loading) {
    return (
      <div className={`space-y-4 ${className}`}>
        {[...Array(6)].map((_, index) => (
          <div key={index} className="glass-card p-4 rounded-lg animate-pulse">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="h-4 bg-surface-secondary rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-surface-secondary rounded w-1/2"></div>
              </div>
              <div className="w-4 h-4 bg-surface-secondary rounded"></div>
            </div>
            <div className="flex space-x-2 mb-3">
              <div className="h-6 bg-surface-secondary rounded-full w-20"></div>
              <div className="h-6 bg-surface-secondary rounded-full w-16"></div>
            </div>
            <div className="h-12 bg-surface-secondary rounded mb-3"></div>
            <div className="flex justify-between">
              <div className="flex space-x-2">
                <div className="h-8 bg-surface-secondary rounded w-20"></div>
                <div className="h-8 bg-surface-secondary rounded w-16"></div>
              </div>
              <div className="flex space-x-1">
                <div className="w-8 h-8 bg-surface-secondary rounded"></div>
                <div className="w-8 h-8 bg-surface-secondary rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <Icon name="MessageCircleOff" size={64} className="mx-auto text-text-muted mb-4" />
        <h3 className="text-lg font-medium text-text-primary mb-2">
          {searchQuery ? 'No conversations found' : 'No conversations yet'}
        </h3>
        <p className="text-text-secondary mb-6">
          {searchQuery 
            ? `No conversations match "${searchQuery}". Try adjusting your search terms.`
            : 'Start a conversation with your AI assistant to see your chat history here.'
          }
        </p>
        {!searchQuery && (
          <Button
            variant="primary"
            iconName="MessageCircle"
            onClick={() => window.location.href = '/main-chat-interface'}
          >
            Start New Conversation
          </Button>
        )}
      </div>
    );
  }

  const groupedConversations = groupConversationsByDate(conversations);

  return (
    <div className={className}>
      {/* Bulk Actions Bar */}
      {showBulkActions && (
        <div className="glass-card p-4 rounded-lg border border-primary-200 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-text-primary">
                {selectedConversations.length} conversation{selectedConversations.length !== 1 ? 's' : ''} selected
              </span>
              <Button
                variant="outline"
                size="xs"
                onClick={() => {
                  setSelectedConversations([]);
                  setShowBulkActions(false);
                }}
              >
                Clear Selection
              </Button>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="xs"
                iconName="Download"
                onClick={() => handleBulkAction('export')}
              >
                Export All
              </Button>
              
              <Button
                variant="outline"
                size="xs"
                iconName="Trash2"
                onClick={() => handleBulkAction('delete')}
                className="text-error-600 hover:text-error-700 hover:bg-error-50"
              >
                Delete All
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Select All Option */}
      {conversations.length > 1 && (
        <div className="flex items-center justify-between mb-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={selectedConversations.length === conversations.length}
              onChange={handleSelectAll}
              className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
            />
            <span className="text-sm text-text-secondary">
              Select all conversations
            </span>
          </label>
          
          <span className="text-sm text-text-muted">
            {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} total
          </span>
        </div>
      )}

      {/* Grouped Conversations */}
      <div className="space-y-6">
        {Object.entries(groupedConversations).map(([dateGroup, groupConversations]) => (
          <div key={dateGroup}>
            <h3 className="text-sm font-medium text-text-primary mb-3 sticky top-0 bg-background py-2 z-10">
              {dateGroup}
            </h3>
            
            <div className="space-y-3">
              {groupConversations.map((conversation) => (
                <div key={conversation.id} className="relative">
                  {/* Selection Checkbox */}
                  <div className="absolute top-4 left-4 z-10">
                    <input
                      type="checkbox"
                      checked={selectedConversations.includes(conversation.id)}
                      onChange={() => handleSelectConversation(conversation.id)}
                      className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                    />
                  </div>
                  
                  {/* Conversation Card with Search Highlighting */}
                  <div className="ml-8">
                    <ConversationCard
                      conversation={{
                        ...conversation,
                        firstQuestion: highlightSearchTerm(conversation.firstQuestion, searchQuery),
                        lastMessage: highlightSearchTerm(conversation.lastMessage, searchQuery)
                      }}
                      onContinue={onContinue}
                      onExport={onExport}
                      onDelete={onDelete}
                      onToggleFavorite={onToggleFavorite}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConversationList;