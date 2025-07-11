import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const BulkActionModal = ({ isOpen, onClose, action, selectedDocuments, onConfirm }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const getActionConfig = (action) => {
    switch (action) {
      case 'retrain':
        return {
          title: 'Retrain Documents',
          description: 'This will retrain the AI model on the selected documents. The process may take several minutes.',
          icon: 'RefreshCw',
          color: 'warning',
          confirmText: 'Start Retraining'
        };
      case 'download':
        return {
          title: 'Download Documents',
          description: 'This will download all selected documents as a ZIP file.',
          icon: 'Download',
          color: 'primary',
          confirmText: 'Download All'
        };
      case 'delete':
        return {
          title: 'Delete Documents',
          description: 'This action cannot be undone. All selected documents and their training data will be permanently removed.',
          icon: 'Trash2',
          color: 'danger',
          confirmText: 'Delete Forever'
        };
      default:
        return {
          title: 'Bulk Action',
          description: 'Perform action on selected documents.',
          icon: 'Settings',
          color: 'primary',
          confirmText: 'Confirm'
        };
    }
  };

  const config = getActionConfig(action);

  const handleConfirm = async () => {
    setIsProcessing(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsProcessing(false);
            onConfirm(action, selectedDocuments);
            onClose();
          }, 500);
          return 100;
        }
        return prev + Math.random() * 20;
      });
    }, 200);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalSize = selectedDocuments.reduce((sum, doc) => sum + (doc.size || 0), 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[999] flex items-center justify-center p-4"
            onClick={!isProcessing ? onClose : undefined}
          >
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-lg border border-border w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center space-x-3 p-6 border-b border-border">
                <div className={`
                  w-10 h-10 rounded-lg flex items-center justify-center
                  ${config.color === 'danger' ? 'bg-error-50' :
                    config.color === 'warning' ? 'bg-warning-50' : 'bg-primary-50'}
                `}>
                  <Icon 
                    name={config.icon} 
                    size={20} 
                    color={
                      config.color === 'danger' ? 'var(--color-error)' :
                      config.color === 'warning' ? 'var(--color-warning)' : 'var(--color-primary)'
                    }
                  />
                </div>
                <div>
                  <h2 className="text-lg font-heading font-semibold text-text-primary">
                    {config.title}
                  </h2>
                  <p className="text-sm text-text-muted">
                    {selectedDocuments.length} document{selectedDocuments.length !== 1 ? 's' : ''} selected
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {!isProcessing ? (
                  <>
                    {/* Description */}
                    <p className="text-text-secondary mb-4">
                      {config.description}
                    </p>

                    {/* Document List */}
                    <div className="mb-4">
                      <h3 className="text-sm font-medium text-text-primary mb-2">
                        Selected Documents:
                      </h3>
                      <div className="max-h-32 overflow-y-auto space-y-1">
                        {selectedDocuments.map((doc) => (
                          <div key={doc.id} className="flex items-center space-x-2 p-2 bg-surface-secondary rounded text-sm">
                            <Icon name="FileText" size={14} color="var(--color-text-muted)" />
                            <span className="flex-1 truncate text-text-primary">{doc.name}</span>
                            <span className="text-text-muted">{formatFileSize(doc.size)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-surface-secondary rounded-lg p-3 mb-6">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-text-muted">Total Size:</span>
                        <span className="text-text-primary font-medium">{formatFileSize(totalSize)}</span>
                      </div>
                      {action === 'retrain' && (
                        <div className="flex items-center justify-between text-sm mt-1">
                          <span className="text-text-muted">Estimated Time:</span>
                          <span className="text-text-primary font-medium">
                            {Math.ceil(selectedDocuments.length * 2)} - {Math.ceil(selectedDocuments.length * 5)} minutes
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Warning for delete action */}
                    {action === 'delete' && (
                      <div className="bg-error-50 border border-error-200 rounded-lg p-3 mb-6">
                        <div className="flex items-start space-x-2">
                          <Icon name="AlertTriangle" size={16} color="var(--color-error)" className="mt-0.5" />
                          <div>
                            <p className="text-sm font-medium text-error-700">Warning</p>
                            <p className="text-sm text-error-600">
                              This action is irreversible. All training data and chat history related to these documents will also be deleted.
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    {/* Processing State */}
                    <div className="text-center mb-6">
                      <div className="w-16 h-16 mx-auto mb-4 bg-primary-50 rounded-full flex items-center justify-center">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          <Icon name={config.icon} size={24} color="var(--color-primary)" />
                        </motion.div>
                      </div>
                      <h3 className="text-lg font-medium text-text-primary mb-2">
                        {action === 'retrain' ? 'Retraining Documents...' :
                         action === 'download' ? 'Preparing Download...' :
                         action === 'delete' ? 'Deleting Documents...' : 'Processing...'}
                      </h3>
                      <p className="text-text-muted">
                        Please wait while we process your request.
                      </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-text-muted">Progress</span>
                        <span className="text-text-primary font-medium">{Math.round(progress)}%</span>
                      </div>
                      <div className="w-full bg-surface-secondary rounded-full h-2">
                        <motion.div 
                          className="bg-primary-500 h-2 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.3 }}
                        />
                      </div>
                    </div>

                    {/* Current Document */}
                    <div className="text-center">
                      <p className="text-sm text-text-muted">
                        Processing: {selectedDocuments[Math.floor((progress / 100) * selectedDocuments.length)]?.name || 'Finalizing...'}
                      </p>
                    </div>
                  </>
                )}
              </div>

              {/* Actions */}
              {!isProcessing && (
                <div className="flex items-center justify-end space-x-3 p-6 border-t border-border">
                  <Button
                    variant="ghost"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant={config.color}
                    onClick={handleConfirm}
                    iconName={config.icon}
                  >
                    {config.confirmText}
                  </Button>
                </div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BulkActionModal;