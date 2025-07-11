import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const FilePreviewCard = ({ file, onRemove, isTraining }) => {
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return { icon: 'FileText', color: 'text-error-600' };
      case 'docx':
        return { icon: 'FileText', color: 'text-primary-600' };
      case 'txt':
        return { icon: 'File', color: 'text-success-600' };
      default:
        return { icon: 'File', color: 'text-text-muted' };
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const fileConfig = getFileIcon(file.name);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
      className={`
        glass-card p-4 rounded-lg border transition-all duration-200
        ${isTraining ? 'opacity-50' : 'hover:shadow-elevated'}
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0 mt-1">
          <Icon name={fileConfig.icon} size={24} className={fileConfig.color} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-text-primary truncate" title={file.name}>
            {file.name}
          </h4>
          
          <div className="flex items-center space-x-4 mt-1">
            <span className="text-xs text-text-muted">
              {formatFileSize(file.size)}
            </span>
            
            <span className="text-xs text-text-muted">
              {file.type || 'Unknown type'}
            </span>
          </div>

          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-success-50 text-success-600 rounded-full text-xs">
              <Icon name="CheckCircle" size={12} />
              <span>Ready to train</span>
            </div>
          </div>
        </div>

        <div className="flex-shrink-0">
          <Button
            variant="ghost"
            size="xs"
            iconName="X"
            onClick={() => onRemove(file)}
            disabled={isTraining}
            className="text-text-muted hover:text-error-600 hover:bg-error-50"
            title="Remove file"
          />
        </div>
      </div>
    </motion.div>
  );
};

export default FilePreviewCard;