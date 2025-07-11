import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import DocumentCard from './DocumentCard';

const DocumentPanel = ({ documents, onDocumentSelect, onDocumentAction, selectedDocumentId }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || doc.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const statusCounts = {
    all: documents.length,
    trained: documents.filter(d => d.status === 'trained').length,
    training: documents.filter(d => d.status === 'training').length,
    failed: documents.filter(d => d.status === 'failed').length
  };

  return (
    <div className="h-full flex flex-col bg-surface border-r border-border">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <Icon name="FolderOpen" size={20} color="var(--color-primary)" />
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              Documents
            </h2>
          </div>
          
          <Button
            variant="primary"
            size="xs"
            iconName="Plus"
            onClick={() => onDocumentAction('upload')}
          >
            Upload
          </Button>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Icon 
            name="Search" 
            size={16} 
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
          />
          <Input
            type="search"
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-1">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`
                px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200
                ${filterStatus === status
                  ? 'bg-primary-100 text-primary-700 border border-primary-200' :'text-text-muted hover:text-text-primary hover:bg-surface-secondary'
                }
              `}
            >
              <span className="capitalize">{status}</span>
              <span className="ml-1 opacity-75">({count})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Document List */}
      <div className="flex-1 overflow-y-auto p-4">
        {filteredDocuments.length === 0 ? (
          <div className="text-center py-8">
            {searchQuery ? (
              <>
                <Icon name="Search" size={48} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">No documents found matching "{searchQuery}"</p>
              </>
            ) : documents.length === 0 ? (
              <>
                <Icon name="FileX" size={48} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-muted mb-2">No documents uploaded yet</p>
                <p className="text-xs text-text-muted">Upload PDF, DOCX, or YouTube transcripts to get started</p>
              </>
            ) : (
              <>
                <Icon name="Filter" size={48} className="mx-auto text-text-muted mb-3" />
                <p className="text-text-muted">No documents match the current filter</p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocuments.map((document) => (
              <DocumentCard
                key={document.id}
                document={document}
                isSelected={selectedDocumentId === document.id}
                onSelect={onDocumentSelect}
                onAction={onDocumentAction}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 border-t border-border bg-background">
        <div className="flex items-center justify-between text-xs text-text-muted">
          <span>{documents.length} documents</span>
          <span>{statusCounts.trained} trained</span>
        </div>
      </div>
    </div>
  );
};

export default DocumentPanel;