import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ConversationCard = ({ conversation, onContinue, onExport, onDelete, onToggleFavorite }) => {
  const [showActions, setShowActions] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays - 1} days ago`;
    return date.toLocaleDateString();
  };

  const getDocumentTypeIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'docx': return 'FileText';
      case 'youtube': return 'Youtube';
      default: return 'File';
    }
  };

  const getDocumentTypeColor = (type) => {
    switch (type) {
      case 'pdf': return 'text-error-600 bg-error-50';
      case 'docx': return 'text-primary-600 bg-primary-50';
      case 'youtube': return 'text-warning-600 bg-warning-50';
      default: return 'text-text-muted bg-surface-secondary';
    }
  };

  return (
    <div 
      className="glass-card p-4 rounded-lg border border-border hover:border-primary-200 transition-all duration-300 group cursor-pointer"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary-600 transition-colors duration-200">
              {conversation.firstQuestion}
            </h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(conversation.id);
              }}
              className="flex-shrink-0 p-1 rounded-full hover:bg-surface-secondary transition-colors duration-200"
            >
              <Icon 
                name={conversation.isFavorite ? 'Star' : 'Star'} 
                size={16} 
                color={conversation.isFavorite ? 'var(--color-warning-500)' : 'var(--color-text-muted)'}
                className={conversation.isFavorite ? 'fill-current' : ''}
              />
            </button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-text-muted mb-2">
            <span>{formatDate(conversation.date)}</span>
            <span>•</span>
            <span>{conversation.messageCount} messages</span>
            <span>•</span>
            <span>{conversation.duration}</span>
          </div>
        </div>
      </div>

      {/* Document Sources */}
      <div className="flex flex-wrap gap-2 mb-3">
        {conversation.documentSources.map((doc, index) => (
          <span
            key={index}
            className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getDocumentTypeColor(doc.type)}`}
          >
            <Icon name={getDocumentTypeIcon(doc.type)} size={12} />
            <span className="truncate max-w-24">{doc.name}</span>
          </span>
        ))}
      </div>

      {/* Tags */}
      {conversation.tags && conversation.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {conversation.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-accent-50 text-accent-600 text-xs rounded-full"
            >
              #{tag}
            </span>
          ))}
          {conversation.tags.length > 3 && (
            <span className="px-2 py-1 bg-surface-secondary text-text-muted text-xs rounded-full">
              +{conversation.tags.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Preview Snippet */}
      <div className="bg-surface-secondary rounded-lg p-3 mb-3">
        <p className="text-xs text-text-secondary line-clamp-2">
          {conversation.lastMessage}
        </p>
      </div>

      {/* Action Buttons */}
      <div className={`flex items-center justify-between transition-all duration-300 ${showActions ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="flex items-center space-x-2">
          <Button
            variant="primary"
            size="xs"
            iconName="MessageCircle"
            onClick={() => onContinue(conversation.id)}
          >
            Continue
          </Button>
          
          <Button
            variant="outline"
            size="xs"
            iconName="Download"
            onClick={() => onExport(conversation.id)}
          >
            Export
          </Button>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="xs"
            iconName="Share2"
            onClick={() => console.log('Share conversation:', conversation.id)}
          />
          
          <Button
            variant="ghost"
            size="xs"
            iconName="Trash2"
            onClick={() => onDelete(conversation.id)}
            className="text-error-600 hover:text-error-700 hover:bg-error-50"
          />
        </div>
      </div>
    </div>
  );
};

export default ConversationCard;