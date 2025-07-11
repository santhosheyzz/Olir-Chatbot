import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentCard = ({ document, isSelected, onSelect, onAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'trained':
        return 'text-success-600 bg-success-50';
      case 'training':
        return 'text-warning-600 bg-warning-50';
      case 'failed':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-text-muted bg-surface-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'trained':
        return 'CheckCircle';
      case 'training':
        return 'Clock';
      case 'failed':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getFileIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'pdf':
        return 'FileText';
      case 'docx': case'doc':
        return 'FileText';
      case 'youtube':
        return 'Youtube';
      default:
        return 'File';
    }
  };

  return (
    <div
      className={`
        group relative rounded-lg border transition-all duration-200 cursor-pointer
        ${isSelected
          ? 'border-primary-300 bg-primary-50 shadow-sm'
          : 'border-border hover:border-primary-200 hover:bg-surface-secondary'
        }
      `}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-1">
            <Icon
              name={getFileIcon(document.type)}
              size={20}
              color={document.type === 'youtube' ? '#FF0000' : 'var(--color-text-secondary)'}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-text-primary truncate" title={document.name}>
              {document.name}
            </h3>
            
            <div className="flex items-center space-x-2 mt-1">
              <span className={`
                inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                ${getStatusColor(document.status)}
              `}>
                <Icon name={getStatusIcon(document.status)} size={12} />
                <span className="capitalize">{document.status}</span>
              </span>
            </div>
            
            {document.summary && (
              <p className="text-xs text-text-muted mt-2 line-clamp-2">
                {document.summary}
              </p>
            )}
            
            <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
              <span>{document.size}</span>
              <span>{document.pages} pages</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1 mt-3 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="xs"
            iconName="MessageCircle"
            onClick={(e) => {
              e.stopPropagation();
              onAction('chat', document.id);
            }}
          >
            Chat
          </Button>
          
          <Button
            variant="ghost"
            size="xs"
            iconName="Eye"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(document.id);
              onAction('view', document.id);
            }}
          >
            View
          </Button>
          
          {document.status === 'failed' && (
            <Button
              variant="warning"
              size="xs"
              iconName="RefreshCw"
              onClick={(e) => {
                e.stopPropagation();
                onAction('retrain', document.id);
              }}
            >
              Retrain
            </Button>
          )}
        </div>

        {/* Training Progress */}
        {document.status === 'training' && (
          <div className="absolute inset-x-0 bottom-0 h-1 bg-surface-secondary rounded-b-lg overflow-hidden">
            <div className="h-full bg-gradient-to-r from-warning-400 to-warning-600 animate-pulse" />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocumentCard;