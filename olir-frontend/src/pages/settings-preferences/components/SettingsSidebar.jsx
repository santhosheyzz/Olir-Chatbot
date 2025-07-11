import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const SettingsSidebar = ({ activeSection, onSectionChange, isMobile, onClose }) => {
  const sections = [
    { id: 'appearance', label: 'Appearance', icon: 'Palette' },
    { id: 'chat', label: 'Chat Preferences', icon: 'MessageSquare' },
    { id: 'documents', label: 'Document Settings', icon: 'FileText' },
    { id: 'account', label: 'Account', icon: 'User' },
    { id: 'privacy', label: 'Privacy', icon: 'Shield' }
  ];

  const handleSectionClick = (sectionId) => {
    onSectionChange(sectionId);
    if (isMobile && onClose) {
      onClose();
    }
  };

  return (
    <div className={`
      h-screen bg-surface border-r border-border
      ${isMobile ? 'w-80 p-4' : 'w-64 p-6'}
      flex flex-col
    `}>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <Icon name="Settings" size={24} color="var(--color-primary)" />
          <h2 className="text-xl font-heading font-bold text-text-primary">Settings</h2>
        </div>
        {isMobile && (
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary"
          >
            <Icon name="X" size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-2">
        {sections.map((section) => (
          <motion.a
            key={section.id}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleSectionClick(section.id);
            }}
            className={`
              flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200
              text-sm font-medium
              ${activeSection === section.id
                ? 'bg-primary-100 text-primary-700 shadow-sm'
                : 'text-text-secondary hover:bg-surface-secondary hover:text-text-primary'
              }
            `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <Icon 
              name={section.icon} 
              size={18} 
              className={activeSection === section.id ? 'text-primary-600' : ''}
            />
            <span>{section.label}</span>
          </motion.a>
        ))}
      </nav>

      <div className="mt-auto pt-6 border-t border-border-muted">
        <div className="bg-surface-secondary rounded-lg p-4 text-center">
          <div className="w-12 h-12 bg-primary-100 rounded-full mx-auto flex items-center justify-center mb-3">
            <Icon name="HelpCircle" size={24} color="var(--color-primary)" />
          </div>
          <h4 className="font-semibold text-text-primary mb-1">Need Help?</h4>
          <p className="text-xs text-text-secondary mb-3">
            Our support team is here to assist you.
          </p>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
        
        <div className="text-center mt-6">
          <p className="text-xs text-text-muted">
            OLIR ChatBot v1.0.0
          </p>
        </div>
      </div>
    </div>
  );
};

export default SettingsSidebar;