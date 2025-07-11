import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ExportModal = ({ isOpen, onClose, conversation, onExport }) => {
  const [exportFormat, setExportFormat] = useState('pdf');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeDocumentSources, setIncludeDocumentSources] = useState(true);
  const [customFileName, setCustomFileName] = useState('');
  const [isExporting, setIsExporting] = useState(false);

  const exportFormats = [
    {
      id: 'pdf',
      label: 'PDF Document',
      description: 'Formatted document with styling',
      icon: 'FileText',
      extension: '.pdf'
    },
    {
      id: 'txt',
      label: 'Plain Text',
      description: 'Simple text format',
      icon: 'File',
      extension: '.txt'
    },
    {
      id: 'json',
      label: 'JSON Data',
      description: 'Structured data format',
      icon: 'Code',
      extension: '.json'
    },
    {
      id: 'markdown',
      label: 'Markdown',
      description: 'Markdown formatted text',
      icon: 'Hash',
      extension: '.md'
    }
  ];

  const handleExport = async () => {
    setIsExporting(true);
    
    const exportData = {
      conversationId: conversation?.id,
      format: exportFormat,
      fileName: customFileName || `conversation-${conversation?.id}`,
      options: {
        includeMetadata,
        includeDocumentSources
      }
    };

    try {
      await onExport(exportData);
      onClose();
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const generateFileName = () => {
    if (!conversation) return '';
    
    const date = new Date(conversation.date).toISOString().split('T')[0];
    const title = conversation.firstQuestion
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
    
    return `${date}-${title}`;
  };

  React.useEffect(() => {
    if (conversation && !customFileName) {
      setCustomFileName(generateFileName());
    }
  }, [conversation]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[1000] flex items-center justify-center p-4">
      <div className="glass-card rounded-lg border border-border max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Download" size={20} color="var(--color-primary)" />
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              Export Conversation
            </h2>
          </div>
          
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Conversation Preview */}
          {conversation && (
            <div className="bg-surface-secondary rounded-lg p-4">
              <h3 className="text-sm font-medium text-text-primary mb-2">
                Conversation Preview
              </h3>
              <p className="text-sm text-text-secondary line-clamp-2 mb-2">
                {conversation.firstQuestion}
              </p>
              <div className="flex items-center space-x-2 text-xs text-text-muted">
                <span>{new Date(conversation.date).toLocaleDateString()}</span>
                <span>•</span>
                <span>{conversation.messageCount} messages</span>
                <span>•</span>
                <span>{conversation.duration}</span>
              </div>
            </div>
          )}

          {/* Export Format Selection */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Export Format
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {exportFormats.map((format) => (
                <label
                  key={format.id}
                  className={`
                    relative cursor-pointer rounded-lg border-2 p-3 transition-all duration-200
                    ${exportFormat === format.id
                      ? 'border-primary-300 bg-primary-50' :'border-border hover:border-primary-200 hover:bg-surface-secondary'
                    }
                  `}
                >
                  <input
                    type="radio"
                    name="exportFormat"
                    value={format.id}
                    checked={exportFormat === format.id}
                    onChange={(e) => setExportFormat(e.target.value)}
                    className="sr-only"
                  />
                  
                  <div className="flex items-center space-x-2 mb-1">
                    <Icon 
                      name={format.icon} 
                      size={16} 
                      color={exportFormat === format.id ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
                    />
                    <span className={`text-sm font-medium ${
                      exportFormat === format.id ? 'text-primary-600' : 'text-text-primary'
                    }`}>
                      {format.label}
                    </span>
                  </div>
                  
                  <p className="text-xs text-text-muted">
                    {format.description}
                  </p>
                  
                  {exportFormat === format.id && (
                    <div className="absolute top-2 right-2">
                      <Icon name="Check" size={16} color="var(--color-primary)" />
                    </div>
                  )}
                </label>
              ))}
            </div>
          </div>

          {/* File Name */}
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              File Name
            </label>
            <div className="relative">
              <Input
                type="text"
                value={customFileName}
                onChange={(e) => setCustomFileName(e.target.value)}
                placeholder="Enter file name"
                className="pr-16"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-text-muted">
                {exportFormats.find(f => f.id === exportFormat)?.extension}
              </span>
            </div>
          </div>

          {/* Export Options */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">
              Export Options
            </h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeMetadata}
                  onChange={(e) => setIncludeMetadata(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                />
                <div>
                  <span className="text-sm text-text-primary">Include Metadata</span>
                  <p className="text-xs text-text-muted">Date, time, message count, and duration</p>
                </div>
              </label>
              
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeDocumentSources}
                  onChange={(e) => setIncludeDocumentSources(e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                />
                <div>
                  <span className="text-sm text-text-primary">Include Document Sources</span>
                  <p className="text-xs text-text-muted">Referenced documents and file information</p>
                </div>
              </label>
            </div>
          </div>

          {/* Preview Size */}
          <div className="bg-surface-secondary rounded-lg p-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Estimated file size:</span>
              <span className="font-medium text-text-primary">
                {exportFormat === 'pdf' ? '~2.5 MB' : 
                 exportFormat === 'json' ? '~150 KB' : 
                 exportFormat === 'markdown' ? '~85 KB' : '~45 KB'}
              </span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isExporting}
          >
            Cancel
          </Button>
          
          <Button
            variant="primary"
            onClick={handleExport}
            loading={isExporting}
            iconName="Download"
          >
            {isExporting ? 'Exporting...' : 'Export'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExportModal;