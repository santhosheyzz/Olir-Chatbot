import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const TrainingHistory = ({ history, onRetrain, onViewDetails }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success-600 bg-success-50';
      case 'failed':
        return 'text-error-600 bg-error-50';
      case 'processing':
        return 'text-warning-600 bg-warning-50';
      default:
        return 'text-text-muted bg-surface-secondary';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return 'CheckCircle';
      case 'failed':
        return 'XCircle';
      case 'processing':
        return 'Clock';
      default:
        return 'Circle';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="glass-card p-6 rounded-xl border h-fit"
    >
      <div className="flex items-center space-x-2 mb-4">
        <Icon name="History" size={20} color="var(--color-primary)" />
        <h3 className="text-lg font-heading font-semibold text-text-primary">
          Training History
        </h3>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-8">
          <Icon name="FileX" size={48} className="mx-auto text-text-muted mb-3" />
          <p className="text-text-muted">No training history yet</p>
          <p className="text-sm text-text-muted mt-1">
            Upload and train documents to see history
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {history.map((session, index) => (
            <motion.div
              key={session.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="p-4 bg-surface rounded-lg border hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className={`
                      inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium
                      ${getStatusColor(session.status)}
                    `}>
                      <Icon name={getStatusIcon(session.status)} size={12} />
                      <span className="capitalize">{session.status}</span>
                    </span>
                    
                    <span className="text-xs text-text-muted">
                      {formatDate(session.timestamp)}
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-medium text-text-primary mb-1">
                    {session.documentsCount} document{session.documentsCount !== 1 ? 's' : ''} trained
                  </h4>
                  
                  <p className="text-xs text-text-muted">
                    Duration: {session.duration}
                  </p>
                </div>

                <div className="flex items-center space-x-1">
                  <Button
                    variant="ghost"
                    size="xs"
                    iconName="Eye"
                    onClick={() => onViewDetails(session)}
                    title="View details"
                  />
                  
                  {session.status === 'failed' && (
                    <Button
                      variant="ghost"
                      size="xs"
                      iconName="RefreshCw"
                      onClick={() => onRetrain(session)}
                      className="text-warning-600 hover:text-warning-700 hover:bg-warning-50"
                      title="Retry training"
                    />
                  )}
                </div>
              </div>

              {/* Document List */}
              <div className="space-y-1">
                {session.documents.slice(0, 3).map((doc, docIndex) => (
                  <div key={docIndex} className="flex items-center space-x-2 text-xs">
                    <Icon name="FileText" size={12} className="text-text-muted" />
                    <span className="text-text-muted truncate">{doc.name}</span>
                  </div>
                ))}
                
                {session.documents.length > 3 && (
                  <div className="text-xs text-text-muted pl-4">
                    +{session.documents.length - 3} more files
                  </div>
                )}
              </div>

              {/* Progress Bar for Processing */}
              {session.status === 'processing' && (
                <div className="mt-3">
                  <div className="w-full bg-surface-secondary rounded-full h-1 overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-warning-400 to-warning-600"
                      initial={{ width: 0 }}
                      animate={{ width: `${session.progress || 0}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default TrainingHistory;