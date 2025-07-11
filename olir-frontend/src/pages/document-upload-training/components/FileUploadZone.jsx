import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { uploadDocument } from '../../../api/upload'; // <-- Import your upload API

const FileUploadZone = ({ onFilesSelected, isTraining }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);
  const [status, setStatus] = useState(null); // <-- Add status state

  const supportedTypes = {
    'application/pdf': { icon: 'FileText', label: 'PDF', color: 'text-error-600' },
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': { icon: 'FileText', label: 'DOCX', color: 'text-primary-600' },
    'text/plain': { icon: 'File', label: 'TXT', color: 'text-success-600' }
  };

  const handleDragEnter = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev + 1);
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDragOver(true);
    }
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragCounter(prev => prev - 1);
    if (dragCounter <= 1) {
      setIsDragOver(false);
    }
  }, [dragCounter]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    setDragCounter(0);

    const files = Array.from(e.dataTransfer.files);
    handleFiles(files);
  }, []);

  const handleFileInput = (e) => {
    const files = Array.from(e.target.files);
    handleFiles(files);
  };

  const handleFiles = async (files) => {
    const validFiles = files.filter(file => {
      const isValidType = Object.keys(supportedTypes).includes(file.type) ||
                         file.name.toLowerCase().endsWith('.txt');
      const isValidSize = file.size <= 50 * 1024 * 1024; // 50MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length > 0) {
      // Only add files to the selection, don't upload immediately
      // The upload will happen when user clicks "Start Training"
      if (onFilesSelected) onFilesSelected(validFiles);
      setStatus(`✅ Added ${validFiles.length} file(s) for training`);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <div
        className={`
          relative border-2 border-dashed rounded-xl p-8 transition-all duration-300
          ${isDragOver 
            ? 'border-primary-400 bg-primary-50 scale-105' :'border-border hover:border-primary-300 hover:bg-surface-secondary'
          }
          ${isTraining ? 'opacity-50 pointer-events-none' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <AnimatePresence>
          {isDragOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-primary-100 bg-opacity-50 rounded-xl flex items-center justify-center"
            >
              <div className="text-center">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Icon name="Upload" size={48} color="var(--color-primary)" />
                </motion.div>
                <p className="text-lg font-medium text-primary-600 mt-2">
                  Drop files here to upload
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="text-center">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="mb-4"
          >
            <Icon name="CloudUpload" size={64} color="var(--color-text-muted)" />
          </motion.div>

          <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
            Upload Your Study Materials
          </h3>
          
          <p className="text-text-secondary mb-6">
            Drag and drop files here, or click to browse
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-6">
            {Object.entries(supportedTypes).map(([type, config]) => (
              <div key={type} className="flex items-center space-x-2 px-3 py-2 bg-surface rounded-lg">
                <Icon name={config.icon} size={16} className={config.color} />
                <span className="text-sm font-medium text-text-secondary">{config.label}</span>
              </div>
            ))}
          </div>

          <input
            type="file"
            multiple
            accept=".pdf,.docx,.txt"
            onChange={handleFileInput}
            className="hidden"
            id="file-upload"
            disabled={isTraining}
          />
          
          <Button
            variant="primary"
            size="lg"
            iconName="Plus"
            onClick={() => document.getElementById('file-upload').click()}
            disabled={isTraining}
            className="px-8"
          >
            Choose Files
          </Button>

          <div className="mt-4 text-xs text-text-muted">
            Maximum file size: 50MB per file
            {status && <div className="mt-2">{status}</div>}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FileUploadZone;