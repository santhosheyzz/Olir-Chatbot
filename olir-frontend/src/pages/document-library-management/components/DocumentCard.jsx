import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const DocumentCard = ({ document, isSelected, onSelect, onAction, viewMode = 'grid' }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50 border-success-200';
      case 'processing':
        return 'text-warning-600 bg-warning-50 border-warning-200';
      case 'failed':
        return 'text-error-600 bg-error-50 border-error-200';
      case 'pending':
        return 'text-text-muted bg-surface-secondary border-border';
      default:
        return 'text-text-muted bg-surface-secondary border-border';
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
      case 'pending':
        return 'Circle';
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
      case 'txt':
        return 'File';
      case 'youtube':
        return 'Youtube';
      default:
        return 'File';
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`
          glass-card p-4 rounded-lg border transition-all duration-300
          ${isSelected ? 'border-primary-300 bg-primary-50' : 'border-border hover:border-primary-200'}
          ${isHovered ? 'shadow-elevated' : 'shadow-custom'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center space-x-4">
          {/* Selection Checkbox */}
          <div className="flex-shrink-0">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelect(document.id)}
              className="w-4 h-4 text-primary-600 bg-white border-border rounded focus:ring-primary-500 focus:ring-2"
            />
          </div>

          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-surface-secondary rounded-lg flex items-center justify-center">
              <Icon name={getFileIcon(document.type)} size={20} color="var(--color-text-secondary)" />
            </div>
          </div>

          {/* Document Info */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-text-primary truncate">
              {document.name}
            </h3>
            <p className="text-xs text-text-secondary truncate mt-1">
                {document.summary || 'No summary available.'}
            </p>
            <div className="flex items-center space-x-4 mt-1 text-xs text-text-muted">
              <span>{formatFileSize(document.size)}</span>
              <span>{formatDate(document.uploadDate)}</span>
              <span>{document.pages} pages</span>
            </div>
          </div>

          {/* Status */}
          <div className="flex-shrink-0">
            <span className={`
              inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border
              ${getStatusColor(document.trainingStatus)}
            `}>
              <Icon name={getStatusIcon(document.trainingStatus)} size={12} />
              <span className="capitalize">{document.trainingStatus}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex-shrink-0 flex items-center space-x-1">
            <Button
              variant="ghost"
              size="xs"
              iconName="Eye"
              onClick={() => onAction('view', document)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <Button
              variant="ghost"
              size="xs"
              iconName="Download"
              onClick={() => onAction('download', document)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
            <Button
              variant="ghost"
              size="xs"
              iconName="MoreVertical"
              onClick={() => onAction('menu', document)}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Processing Progress */}
        {document.trainingStatus === 'processing' && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-muted mb-1">
              <span>Training Progress</span>
              <span>{document.trainingProgress || 0}%</span>
            </div>
            <div className="w-full bg-surface-secondary rounded-full h-1.5">
              <div 
                className="bg-warning-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${document.trainingProgress || 0}%` }}
              />
            </div>
          </div>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -4 }}
      className={`
        glass-card rounded-lg border transition-all duration-300 cursor-pointer group
        ${isSelected ? 'border-primary-300 bg-primary-50' : 'border-border hover:border-primary-200'}
        ${isHovered ? 'shadow-elevated' : 'shadow-custom'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onSelect(document.id)}
    >
      {/* Selection Checkbox */}
      <div className="absolute top-3 left-3 z-10">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onSelect(document.id);
          }}
          className="w-4 h-4 text-primary-600 bg-white border-border rounded focus:ring-primary-500 focus:ring-2"
        />
      </div>

      {/* Document Thumbnail */}
      <div className="relative h-32 bg-surface-secondary rounded-t-lg overflow-hidden">
        {document.thumbnail ? (
          <Image
            src={document.thumbnail}
            alt={document.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Icon name={getFileIcon(document.type)} size={48} color="var(--color-text-muted)" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-2 right-2">
          <span className={`
            inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border backdrop-blur-sm
            ${getStatusColor(document.trainingStatus)}
          `}>
            <Icon name={getStatusIcon(document.trainingStatus)} size={10} />
            <span className="capitalize">{document.trainingStatus}</span>
          </span>
        </div>

        {/* Processing Progress Overlay */}
        {document.trainingStatus === 'processing' && (
          <div className="absolute inset-x-0 bottom-0 bg-black bg-opacity-50 backdrop-blur-sm p-2">
            <div className="flex items-center justify-between text-xs text-white mb-1">
              <span>Training...</span>
              <span>{document.trainingProgress || 0}%</span>
            </div>
            <div className="w-full bg-white bg-opacity-20 rounded-full h-1">
              <div 
                className="bg-warning-400 h-1 rounded-full transition-all duration-300"
                style={{ width: `${document.trainingProgress || 0}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Document Info */}
      <div className="p-4">
        <h3 className="text-sm font-medium text-text-primary truncate mb-2">
          {document.name}
        </h3>
        
        <p className="text-xs text-text-muted mb-3 h-10 overflow-hidden">
            {document.summary || 'No summary available.'}
        </p>

        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span>{formatFileSize(document.size)}</span>
          <span>{document.pages} pages</span>
        </div>
        
        <div className="flex items-center justify-between text-xs text-text-muted mb-3">
          <span>Uploaded: {formatDate(document.uploadDate)}</span>
          <span>Queries: {document.queryCount || 0}</span>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="xs"
            iconName="Eye"
            onClick={(e) => {
              e.stopPropagation();
              onAction('view', document);
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
                onAction('retrain', document);
              }}
            >
              Retrain
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="xs"
            iconName="Download"
            onClick={(e) => {
              e.stopPropagation();
              onAction('download', document);
            }}
          />
          
          <Button
            variant="ghost"
            size="xs"
            iconName="MoreVertical"
            onClick={(e) => {
              e.stopPropagation();
              onAction('menu', document);
            }}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentCard;