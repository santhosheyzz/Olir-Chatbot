import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';


const ChatPreferences = ({ 
  responseLength, 
  onResponseLengthChange, 
  typingIndicator, 
  onTypingIndicatorChange,
  autoSave,
  onAutoSaveChange,
  messageTimestamps,
  onMessageTimestampsChange,
  soundEffects,
  onSoundEffectsChange
}) => {
  const responseLengthOptions = [
    { value: 'concise', label: 'Concise', description: 'Brief, to-the-point answers' },
    { value: 'balanced', label: 'Balanced', description: 'Moderate detail with examples' },
    { value: 'detailed', label: 'Detailed', description: 'Comprehensive explanations' }
  ];

  const ToggleSwitch = ({ enabled, onChange, label, description }) => (
    <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
      <div className="flex-1">
        <h4 className="font-medium text-text-primary">{label}</h4>
        <p className="text-sm text-text-secondary mt-1">{description}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!enabled)}
        className={`
          relative w-12 h-6 rounded-full transition-all duration-200
          ${enabled ? 'bg-primary-500' : 'bg-border'}
        `}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 2 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm"
        />
      </motion.button>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Response Length */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon name="MessageSquare" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Response Length</h3>
            <p className="text-sm text-text-secondary">Control how detailed AI responses should be</p>
          </div>
        </div>

        <div className="space-y-3">
          {responseLengthOptions.map((option) => (
            <motion.div
              key={option.value}
              whileHover={{ scale: 1.01 }}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${responseLength === option.value 
                  ? 'border-primary-500 bg-primary-50' :'border-border hover:border-primary-300'
                }
              `}
              onClick={() => onResponseLengthChange(option.value)}
            >
              <div className="flex items-center space-x-3">
                <div className={`
                  w-4 h-4 rounded-full border-2 transition-all duration-200
                  ${responseLength === option.value 
                    ? 'border-primary-500 bg-primary-500' :'border-border'
                  }
                `}>
                  {responseLength === option.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-text-primary">{option.label}</h4>
                  <p className="text-sm text-text-secondary">{option.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Chat Interface Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <Icon name="Settings" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Interface Settings</h3>
            <p className="text-sm text-text-secondary">Customize your chat experience</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSwitch
            enabled={typingIndicator}
            onChange={onTypingIndicatorChange}
            label="Typing Indicator"
            description="Show animated dots when AI is generating response"
          />

          <ToggleSwitch
            enabled={autoSave}
            onChange={onAutoSaveChange}
            label="Auto-save Conversations"
            description="Automatically save chat history during session"
          />

          <ToggleSwitch
            enabled={messageTimestamps}
            onChange={onMessageTimestampsChange}
            label="Message Timestamps"
            description="Display time stamps for each message"
          />

          <ToggleSwitch
            enabled={soundEffects}
            onChange={onSoundEffectsChange}
            label="Sound Effects"
            description="Play notification sounds for new messages"
          />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Quick Actions</h3>
            <p className="text-sm text-text-secondary">Shortcuts for common chat actions</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-surface-secondary rounded-lg border border-border"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Copy" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-text-primary">Copy Response</span>
            </div>
            <p className="text-xs text-text-muted">Double-click any AI response to copy</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-surface-secondary rounded-lg border border-border"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Download" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-text-primary">Export Chat</span>
            </div>
            <p className="text-xs text-text-muted">Ctrl/Cmd + E to export conversation</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-surface-secondary rounded-lg border border-border"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="RotateCcw" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-text-primary">Regenerate</span>
            </div>
            <p className="text-xs text-text-muted">Ctrl/Cmd + R to regenerate last response</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-surface-secondary rounded-lg border border-border"
          >
            <div className="flex items-center space-x-3 mb-2">
              <Icon name="Trash2" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-text-primary">Clear Chat</span>
            </div>
            <p className="text-xs text-text-muted">Ctrl/Cmd + Shift + Delete to clear</p>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default ChatPreferences;