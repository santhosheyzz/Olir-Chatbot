import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import DocumentSidebar from '../../components/ui/DocumentSidebar';
import DocumentCard from './components/DocumentCard';
import DocumentFilters from './components/DocumentFilters';
import DocumentAnalytics from './components/DocumentAnalytics';
import DocumentPreviewModal from './components/DocumentPreviewModal';
import BulkActionModal from './components/BulkActionModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const DocumentLibraryManagement = () => {
  const navigate = useNavigate();
  const [documents, setDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [viewMode, setViewMode] = useState('grid');
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [bulkAction, setBulkAction] = useState({ isOpen: false, action: null });
  const [filters, setFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    sortBy: 'uploadDate',
    sortOrder: 'desc'
  });

  // Mock documents data
  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await fetch("http://localhost:8000/documents");
        const data = await response.json();

        const formatted = data.map((doc, index) => ({
          id: index + 1,
          name: doc.name,
          type: doc.type,
          size: parseFloat(doc.size) * 1024 * 1024, // convert MB to bytes
          uploadDate: doc.uploadDate + "T10:00:00Z", // add fake time
          lastAccessed: new Date().toISOString(), // optional
          trainingStatus: doc.status,
          trainingProgress: doc.status === 'trained' ? 100 : 0,
          pages: doc.pages || 1,
          queryCount: Math.floor(Math.random() * 20), // optional
          thumbnail: doc.thumbnail || "https://via.placeholder.com/400x300"
        }));

        setDocuments(formatted);
      } catch (error) {
        console.error("Failed to load documents:", error);
      }
    };

    fetchDocuments();
    const interval = setInterval(fetchDocuments, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, []);

  // Fetch chat history
  useEffect(() => {
    const fetchChatHistory = async () => {
      const res = await fetch("http://localhost:8000/chat/history");
      const data = await res.json();
      setConversations(data); // Replace mockConversations
    };
    fetchChatHistory();
  }, []);


  // Filter and sort documents
  useEffect(() => {
    let filtered = [...documents];

    // Apply search filter
    if (filters.search) {
      filtered = filtered.filter(doc =>
        doc.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Apply type filter
    if (filters.type !== 'all') {
      filtered = filtered.filter(doc => doc.type === filters.type);
    }

    // Apply status filter
    if (filters.status !== 'all') {
      filtered = filtered.filter(doc => doc.trainingStatus === filters.status);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue = a[filters.sortBy];
      let bValue = b[filters.sortBy];

      if (filters.sortBy === 'uploadDate' || filters.sortBy === 'lastAccessed') {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (filters.sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    setFilteredDocuments(filtered);
  }, [documents, filters]);

  const handleDocumentSelect = (documentId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(documentId)) {
        return prev.filter(id => id !== documentId);
      } else {
        return [...prev, documentId];
      }
    });
  };

  const handleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map(doc => doc.id));
    }
  };

  const handleDocumentAction = (action, document) => {
    switch (action) {
      case 'view':
        setPreviewDocument(document);
        break;
      case 'download':
        handleDownloadDocuments([document]);
        break;
      case 'retrain':
        handleRetrain(document);
        break;
      case 'delete':
        handleDeleteDocuments([document]);
        break;
      case 'chat':
        navigate('/chat', { state: { docName: document.name } });
        break;
      case 'menu':
        // Implement context menu logic if needed
        break;
      default:
        break;
    }
  };

  const handleBulkAction = (action) => {
    const selectedDocs = documents.filter(doc => selectedDocuments.includes(doc.id));
    setBulkAction({ isOpen: true, action, documents: selectedDocs });
  };

  const handleBulkActionConfirm = (action, documents) => {
    if (action === 'delete') {
      handleDeleteDocuments(documents);
    } else if (action === 'download') {
      handleDownloadDocuments(documents); // 👈 add this function below
    }
    setSelectedDocuments([]);
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({
      search: '',
      type: 'all',
      status: 'all',
      sortBy: 'uploadDate',
      sortOrder: 'desc'
    });
  };

  const handleUploadClick = () => {
    navigate('/document-upload-training');
  };

  
  const handleDeleteDocuments = async (selectedDocs) => {
    for (let doc of selectedDocs) {
      try {
        const res = await fetch(`http://localhost:8000/documents/${encodeURIComponent(doc.name)}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          const err = await res.json();
          console.error(err.detail);
        }
      } catch (err) {
        console.error('Delete error:', err);
      }
    }

    // Update state to remove deleted docs
    setDocuments(prev => prev.filter(d => !selectedDocs.some(s => s.name === d.name)));
  };

  const handleDownloadDocuments = async (documents) => {
    for (const doc of documents) {
      try {
        const response = await fetch(`http://localhost:8000/download/${encodeURIComponent(doc.name)}`);
        if (!response.ok) throw new Error('Failed to download');

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = doc.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (error) {
        console.error(`Failed to download ${doc.name}:`, error);
        alert(`⚠️ Failed to download ${doc.name}`);
      }
    }
  };

  const handleRetrain = async (document) => {
    try {
      const response = await fetch(`http://localhost:8000/retrain/${encodeURIComponent(document.name)}`, {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to start retraining');
      }
      // Optionally, show a notification to the user
      console.log(`Retraining started for ${document.name}`);
    } catch (error) {
      console.error(`Failed to retrain ${document.name}:`, error);
      alert(`⚠️ Failed to retrain ${document.name}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Main Content */}
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-heading font-bold text-text-primary">
                Document Library
              </h1>
              <p className="text-text-secondary mt-2">
                Manage your uploaded documents and training status
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                iconName="BarChart3"
                onClick={() => setShowAnalytics(!showAnalytics)}
                className={showAnalytics ? 'bg-primary-50 text-primary-600' : ''}
              >
                Analytics
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                iconName="FolderOpen"
                onClick={() => setShowSidebar(!showSidebar)}
                className="lg:hidden"
              >
                Documents
              </Button>
              
              <Button
                variant="primary"
                iconName="Plus"
                onClick={handleUploadClick}
              >
                Upload Document
              </Button>
            </div>
          </div>

          {/* Filters */}
          <DocumentFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            selectedCount={selectedDocuments.length}
            onBulkAction={handleBulkAction}
            onClearFilters={handleClearFilters}
          />

          {/* Document Grid/List */}
          <div className="flex-1">
            {filteredDocuments.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-12"
              >
                <div className="w-24 h-24 mx-auto mb-4 bg-surface-secondary rounded-full flex items-center justify-center">
                  <Icon name="FileX" size={48} color="var(--color-text-muted)" />
                </div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  {filters.search || filters.type !== 'all' || filters.status !== 'all' ?'No documents found' :'No documents uploaded yet'
                  }
                </h3>
                <p className="text-text-muted mb-6">
                  {filters.search || filters.type !== 'all' || filters.status !== 'all' ?'Try adjusting your filters to find what you\'re looking for.'
                    : 'Upload your first document to get started with AI-powered analysis.'
                  }
                </p>
                <Button
                  variant="primary"
                  iconName="Plus"
                  onClick={handleUploadClick}
                >
                  Upload Document
                </Button>
              </motion.div>
            ) : (
              <>
                {/* Select All */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedDocuments.length === filteredDocuments.length}
                      onChange={handleSelectAll}
                      className="w-4 h-4 text-primary-600 bg-white border-border rounded focus:ring-primary-500 focus:ring-2"
                    />
                    <span className="text-sm text-text-muted">
                      {selectedDocuments.length > 0
                        ? `${selectedDocuments.length} of ${filteredDocuments.length} selected`
                        : `${filteredDocuments.length} document${filteredDocuments.length !== 1 ? 's' : ''}`
                      }
                    </span>
                  </div>
                  
                  {selectedDocuments.length > 0 && (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="RefreshCw"
                        onClick={() => handleBulkAction('retrain')}
                      >
                        Retrain
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Download"
                        onClick={() => handleBulkAction('download')}
                      >
                        Download
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="Trash2"
                        onClick={() => handleBulkAction('delete')}
                        className="text-error-600 hover:text-error-700"
                      >
                        Delete
                      </Button>
                    </div>
                  )}
                </div>

                {/* Documents */}
                <div className={`
                  ${viewMode === 'grid' ?'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' :'space-y-4'
                  }
                `}>
                  {filteredDocuments.map((document) => (
                    <DocumentCard
                      key={document.id}
                      document={document}
                      isSelected={selectedDocuments.includes(document.id)}
                      onSelect={handleDocumentSelect}
                      onAction={handleDocumentAction}
                      viewMode={viewMode}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <DocumentSidebar
        isOpen={showSidebar}
        onToggle={() => setShowSidebar(!showSidebar)}
      />

      {/* Analytics Panel */}
      <DocumentAnalytics
        documents={documents}
        isVisible={showAnalytics}
      />

      {/* Preview Modal */}
      <DocumentPreviewModal
        document={previewDocument}
        isOpen={!!previewDocument}
        onClose={() => setPreviewDocument(null)}
        onAction={handleDocumentAction}
      />

      {/* Bulk Action Modal */}
      <BulkActionModal
        isOpen={bulkAction.isOpen}
        onClose={() => setBulkAction({ isOpen: false, action: null })}
        action={bulkAction.action}
        selectedDocuments={bulkAction.documents || []}
        onConfirm={handleBulkActionConfirm}
      />

      {/* Cute Assistant Mascot */}
      <motion.div
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div className="w-16 h-16 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full shadow-floating flex items-center justify-center cursor-pointer hover:scale-110 transition-transform duration-200">
          <Icon name="Bot" size={24} color="white" />
        </div>
      </motion.div>

      {/* Footer */}
      <footer className="bg-surface border-t border-border py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-text-muted">
            <p className="text-sm">
              Built by Santhoshkumar and Team at OLIR Institution • © {new Date().getFullYear()} All rights reserved
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default DocumentLibraryManagement;