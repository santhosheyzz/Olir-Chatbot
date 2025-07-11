import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const DocumentSidebar = ({ isOpen, onToggle, className = '' }) => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Mock document data - in real app, this would come from props or context
  useEffect(() => {
    const mockDocuments = [
      {
        id: 1,
        name: 'Machine Learning Fundamentals.pdf',
        type: 'pdf',
        size: '2.4 MB',
        uploadDate: '2024-01-15',
        trainingStatus: 'completed',
        pages: 45,
        lastAccessed: '2024-01-20'
      },
      {
        id: 2,
        name: 'Data Structures Notes.docx',
        type: 'docx',
        size: '1.8 MB',
        uploadDate: '2024-01-14',
        trainingStatus: 'processing',
        pages: 32,
        lastAccessed: '2024-01-19'
      },
      {
        id: 3,
        name: 'Research Paper - AI Ethics.pdf',
        type: 'pdf',
        size: '3.2 MB',
        uploadDate: '2024-01-13',
        trainingStatus: 'completed',
        pages: 28,
        lastAccessed: '2024-01-18'
      },
      {
        id: 4,
        name: 'Statistics Textbook Chapter 5.pdf',
        type: 'pdf',
        size: '5.1 MB',
        uploadDate: '2024-01-12',
        trainingStatus: 'failed',
        pages: 67,
        lastAccessed: '2024-01-17'
      }
    ];
    setDocuments(mockDocuments);
  }, []);

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'processing':
        return 'text-warning-600 bg-warning-50';
      case 'failed':
        return 'text-error-600 bg-error-50';
      default:
        return 'text-text-muted bg-surface-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'processing':
        return 'Clock';
      case 'failed':
        return 'XCircle';
      default:
        return 'Circle';
    }
  };

  const getFileIcon = (type) => {
    switch (type) {
      case 'pdf':
        return 'FileText';
      case 'docx':
        return 'FileText';
      case 'txt':
        return 'File';
      default:
        return 'File';
    }
  };

  const handleDocumentSelect = (document) => {
    setSelectedDocument(document.id === selectedDocument ? null : document.id);
  };

  const handleDocumentAction = (action, documentId) => {
    console.log(`${action} document:`, documentId);
    // Handle document actions (view, retrain, delete, etc.)
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[99] lg:hidden"
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed lg:fixed top-16 left-0 h-[calc(100vh-4rem)] z-100
        ${isCollapsed ? 'w-16' : 'w-80'}
        glass-card border-r border-border
        transform transition-all duration-300 ease-out-smooth
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Icon name="FolderOpen" size={20} color="var(--color-primary)" />
              <h2 className="text-lg font-heading font-semibold text-text-primary">
                Documents
              </h2>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </button>
            
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
              title="Close sidebar"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* Search */}
            <div className="p-4 border-b border-border">
              <div className="relative">
                <Icon 
                  name="Search" 
                  size={16} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
                />
                <input
                  type="text"
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Document List */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-2">
                {filteredDocuments.length === 0 ? (
                  <div className="text-center py-8">
                    <Icon name="FileX" size={48} className="mx-auto text-text-muted mb-3" />
                    <p className="text-text-muted">
                      {searchQuery ? 'No documents found' : 'No documents uploaded'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {filteredDocuments.map((document) => (
                      <div
                        key={document.id}
                        className={`
                          group relative rounded-lg border transition-all duration-200 cursor-pointer
                          ${selectedDocument === document.id
                            ? 'border-primary-300 bg-primary-50 shadow-sm'
                            : 'border-border hover:border-primary-200 hover:bg-surface-secondary'
                          }
                        `}
                        onClick={() => handleDocumentSelect(document)}
                      >
                        <div className="p-3">
                          <div className="flex items-start space-x-3">
                            <div className="flex-shrink-0 mt-1">
                              <Icon 
                                name={getFileIcon(document.type)} 
                                size={20} 
                                color="var(--color-text-secondary)" 
                              />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <h3 className="text-sm font-medium text-text-primary truncate">
                                {document.name}
                              </h3>
                              
                              <div className="flex items-center space-x-2 mt-1">
                                <span className={`
                                  inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                                  ${getStatusColor(document.trainingStatus)}
                                `}>
                                  <Icon name={getStatusIcon(document.trainingStatus)} size={12} />
                                  <span className="capitalize">{document.trainingStatus}</span>
                                </span>
                              </div>
                              
                              <div className="flex items-center justify-between mt-2 text-xs text-text-muted">
                                <span>{document.size}</span>
                                <span>{document.pages} pages</span>
                              </div>
                            </div>
                          </div>

                          {/* Expanded Actions */}
                          {selectedDocument === document.id && (
                            <div className="mt-3 pt-3 border-t border-border">
                              <div className="flex items-center justify-between text-xs text-text-muted mb-3">
                                <span>Uploaded: {new Date(document.uploadDate).toLocaleDateString()}</span>
                                <span>Last accessed: {new Date(document.lastAccessed).toLocaleDateString()}</span>
                              </div>
                              
                              <div className="flex items-center space-x-2">
                                <Button
                                  variant="outline"
                                  size="xs"
                                  iconName="Eye"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDocumentAction('view', document.id);
                                  }}
                                >
                                  View
                                </Button>
                                
                                {document.trainingStatus === 'failed' && (
                                  <Button
                                    variant="warning"
                                    size="xs"
                                    iconName="RefreshCw"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleDocumentAction('retrain', document.id);
                                    }}
                                  >
                                    Retrain
                                  </Button>
                                )}
                                
                                <Button
                                  variant="ghost"
                                  size="xs"
                                  iconName="Trash2"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDocumentAction('delete', document.id);
                                  }}
                                  className="text-error-600 hover:text-error-700 hover:bg-error-50"
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Processing Animation */}
                        {document.trainingStatus === 'processing' && (
                          <div className="absolute inset-x-0 bottom-0 h-1 bg-surface-secondary rounded-b-lg overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-warning-400 to-warning-600 animate-pulse" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 border-t border-border">
              <Button
                variant="primary"
                size="sm"
                iconName="Plus"
                fullWidth
                onClick={() => handleDocumentAction('upload')}
              >
                Upload Document
              </Button>
            </div>
          </>
        )}

        {/* Collapsed State */}
        {isCollapsed && (
          <div className="p-2">
            <div className="space-y-2">
              {documents.slice(0, 5).map((document) => (
                <button
                  key={document.id}
                  onClick={() => handleDocumentSelect(document)}
                  className={`
                    w-full p-2 rounded-lg transition-all duration-200 relative
                    ${selectedDocument === document.id
                      ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }
                  `}
                  title={document.name}
                >
                  <Icon name={getFileIcon(document.type)} size={20} />
                  
                  {/* Status Indicator */}
                  <div className={`
                    absolute top-1 right-1 w-2 h-2 rounded-full
                    ${document.trainingStatus === 'completed' ? 'bg-success-500' :
                      document.trainingStatus === 'processing' ? 'bg-warning-500 animate-pulse' :
                      document.trainingStatus === 'failed' ? 'bg-error-500' : 'bg-text-muted'
                    }
                  `} />
                </button>
              ))}
              
              {documents.length > 5 && (
                <div className="text-center py-2">
                  <span className="text-xs text-text-muted">+{documents.length - 5} more</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DocumentSidebar;