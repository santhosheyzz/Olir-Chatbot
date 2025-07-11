import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const TrainingProgress = ({ progress, currentFile, estimatedTime, isTraining }) => {
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  if (!isTraining) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="glass-card p-6 rounded-xl border"
    >
      <div className="text-center mb-6">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block mb-3"
        >
          <Icon name="Bot" size={48} color="var(--color-primary)" />
        </motion.div>
        
        <h3 className="text-lg font-heading font-semibold text-text-primary mb-2">
          Training Your AI Assistant
        </h3>
        
        <p className="text-text-secondary">
          Processing documents to enhance your study experience
        </p>
      </div>

      <div className="space-y-4">
        {/* Overall Progress */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-text-primary">
              Overall Progress
            </span>
            <span className="text-sm text-text-secondary">
              {Math.round(progress)}%
            </span>
          </div>
          
          <div className="w-full bg-surface-secondary rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Current File */}
        {currentFile && (
          <div className="flex items-center space-x-3 p-3 bg-surface rounded-lg">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Icon name="FileText" size={20} color="var(--color-primary)" />
            </motion.div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text-primary truncate">
                Processing: {currentFile}
              </p>
              
              <div className="flex items-center space-x-2 mt-1">
                <div className="flex space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-primary-500 rounded-full"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
                <span className="text-xs text-text-muted">
                  Analyzing content...
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Estimated Time */}
        {estimatedTime > 0 && (
          <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
            <div className="flex items-center space-x-2">
              <Icon name="Clock" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm text-text-secondary">
                Estimated time remaining
              </span>
            </div>
            <span className="text-sm font-medium text-text-primary">
              {formatTime(estimatedTime)}
            </span>
          </div>
        )}

        {/* Training Steps */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-text-primary">Training Steps:</h4>
          
          {[
            { step: 'Document parsing', completed: progress > 25 },
            { step: 'Content extraction', completed: progress > 50 },
            { step: 'AI model training', completed: progress > 75 },
            { step: 'Optimization', completed: progress >= 100 }
          ].map((item, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div className={`
                w-4 h-4 rounded-full flex items-center justify-center
                ${item.completed 
                  ? 'bg-success-500' 
                  : progress > (index * 25) 
                    ? 'bg-primary-500 animate-pulse' :'bg-surface-secondary'
                }
              `}>
                {item.completed && (
                  <Icon name="Check" size={10} color="white" />
                )}
              </div>
              
              <span className={`
                text-sm
                ${item.completed 
                  ? 'text-success-600 font-medium' 
                  : progress > (index * 25)
                    ? 'text-primary-600 font-medium' :'text-text-muted'
                }
              `}>
                {item.step}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default TrainingProgress;