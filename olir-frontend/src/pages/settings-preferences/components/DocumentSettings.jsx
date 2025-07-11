import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentSettings = ({
  maxFileSize,
  onMaxFileSizeChange,
  supportedFormats,
  onSupportedFormatsChange,
  autoTraining,
  onAutoTrainingChange,
  storageUsed,
  storageLimit
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const fileSizeOptions = [
    { value: 5, label: '5 MB', description: 'Small documents only' },
    { value: 10, label: '10 MB', description: 'Standard documents' },
    { value: 25, label: '25 MB', description: 'Large documents' },
    { value: 50, label: '50 MB', description: 'Very large documents' }
  ];

  const formatOptions = [
    { value: 'pdf', label: 'PDF', icon: 'FileText', enabled: true },
    { value: 'docx', label: 'DOCX', icon: 'FileText', enabled: true },
    { value: 'txt', label: 'TXT', icon: 'File', enabled: true },
    { value: 'youtube', label: 'YouTube Transcripts', icon: 'Video', enabled: true }
  ];

  const storagePercentage = (storageUsed / storageLimit) * 100;

  const handleFormatToggle = (format) => {
    const updatedFormats = supportedFormats.includes(format)
      ? supportedFormats.filter(f => f !== format)
      : [...supportedFormats, format];
    onSupportedFormatsChange(updatedFormats);
  };

  const getStorageColor = () => {
    if (storagePercentage >= 90) return 'bg-error-500';
    if (storagePercentage >= 75) return 'bg-warning-500';
    return 'bg-success-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Storage Usage */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon name="HardDrive" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Storage Usage</h3>
            <p className="text-sm text-text-secondary">Monitor your document storage</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-text-primary">
              {storageUsed.toFixed(1)} MB of {storageLimit} MB used
            </span>
            <span className="text-sm text-text-secondary">
              {storagePercentage.toFixed(1)}%
            </span>
          </div>

          <div className="w-full bg-surface-secondary rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${storagePercentage}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className={`h-full rounded-full ${getStorageColor()}`}
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <Icon name="FileText" size={24} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-xs text-text-muted">PDF Files</p>
              <p className="text-sm font-medium text-text-primary">12.4 MB</p>
            </div>
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <Icon name="FileText" size={24} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-xs text-text-muted">DOCX Files</p>
              <p className="text-sm font-medium text-text-primary">8.7 MB</p>
            </div>
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <Icon name="File" size={24} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-xs text-text-muted">TXT Files</p>
              <p className="text-sm font-medium text-text-primary">2.1 MB</p>
            </div>
            <div className="text-center p-3 bg-surface-secondary rounded-lg">
              <Icon name="Video" size={24} className="mx-auto mb-2 text-text-secondary" />
              <p className="text-xs text-text-muted">Transcripts</p>
              <p className="text-sm font-medium text-text-primary">4.3 MB</p>
            </div>
          </div>
        </div>
      </div>

      {/* File Size Limits */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <Icon name="Upload" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Upload Limits</h3>
            <p className="text-sm text-text-secondary">Set maximum file size for uploads</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fileSizeOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${maxFileSize === option.value 
                  ? 'border-accent-500 bg-accent-50' :'border-border hover:border-accent-300'
                }
              `}
              onClick={() => onMaxFileSizeChange(option.value)}
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-text-primary">{option.label}</h4>
                  <p className="text-sm text-text-secondary">{option.description}</p>
                </div>
                {maxFileSize === option.value && (
                  <Icon name="Check" size={16} color="var(--color-accent)" />
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Supported Formats */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <Icon name="FileType" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Supported Formats</h3>
            <p className="text-sm text-text-secondary">Choose which file types to accept</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formatOptions.map((format) => (
            <motion.div
              key={format.value}
              whileHover={{ scale: 1.01 }}
              className={`
                p-4 rounded-lg border transition-all duration-200
                ${supportedFormats.includes(format.value)
                  ? 'border-success-500 bg-success-50' :'border-border bg-surface-secondary'
                }
              `}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Icon 
                    name={format.icon} 
                    size={20} 
                    color={supportedFormats.includes(format.value) ? 'var(--color-success)' : 'var(--color-text-secondary)'} 
                  />
                  <span className="font-medium text-text-primary">{format.label}</span>
                </div>
                
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleFormatToggle(format.value)}
                  className={`
                    relative w-10 h-5 rounded-full transition-all duration-200
                    ${supportedFormats.includes(format.value) ? 'bg-success-500' : 'bg-border'}
                  `}
                >
                  <motion.div
                    animate={{ x: supportedFormats.includes(format.value) ? 20 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Training Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
            <Icon name="Brain" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Training Settings</h3>
            <p className="text-sm text-text-secondary">Configure document processing behavior</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div className="flex-1">
              <h4 className="font-medium text-text-primary">Auto-train Documents</h4>
              <p className="text-sm text-text-secondary mt-1">Automatically process documents after upload</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => onAutoTrainingChange(!autoTraining)}
              className={`
                relative w-12 h-6 rounded-full transition-all duration-200
                ${autoTraining ? 'bg-warning-500' : 'bg-border'}
              `}
            >
              <motion.div
                animate={{ x: autoTraining ? 24 : 2 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
              />
            </motion.button>
          </div>

          <motion.div
            initial={false}
            animate={{ height: showAdvanced ? 'auto' : 0, opacity: showAdvanced ? 1 : 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-4 pt-4">
              <div className="p-4 bg-surface-secondary rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">Processing Priority</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">Low</Button>
                  <Button variant="primary" size="sm">Normal</Button>
                  <Button variant="outline" size="sm">High</Button>
                </div>
              </div>

              <div className="p-4 bg-surface-secondary rounded-lg">
                <h4 className="font-medium text-text-primary mb-2">Chunk Size</h4>
                <input
                  type="range"
                  min="500"
                  max="2000"
                  step="100"
                  defaultValue="1000"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-text-muted mt-1">
                  <span>500 words</span>
                  <span>2000 words</span>
                </div>
              </div>
            </div>
          </motion.div>

          <Button
            variant="ghost"
            size="sm"
            iconName={showAdvanced ? 'ChevronUp' : 'ChevronDown'}
            onClick={() => setShowAdvanced(!showAdvanced)}
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced Settings
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentSettings;