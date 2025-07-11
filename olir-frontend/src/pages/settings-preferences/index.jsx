import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import SettingsSidebar from './components/SettingsSidebar';
import AppearanceSettings from './components/AppearanceSettings';
import ChatPreferences from './components/ChatPreferences';
import DocumentSettings from './components/DocumentSettings';
import AccountSettings from './components/AccountSettings';
import PrivacySettings from './components/PrivacySettings';

const SettingsPreferences = () => {
  const [activeSection, setActiveSection] = useState('appearance');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Settings state
  const [settings, setSettings] = useState({
    // Appearance
    theme: 'light',
    font: 'inter',
    animationIntensity: 'moderate',
    
    // Chat Preferences
    responseLength: 'balanced',
    typingIndicator: true,
    autoSave: true,
    messageTimestamps: true,
    soundEffects: false,
    
    // Document Settings
    maxFileSize: 10,
    supportedFormats: ['pdf', 'docx', 'txt', 'youtube'],
    autoTraining: true,
    storageUsed: 27.5,
    storageLimit: 100,
    
    // Privacy
    dataCollection: true,
    analytics: true,
    shareUsage: false
  });

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('olir-chatbot-settings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings(prev => ({ ...prev, ...parsed }));
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    localStorage.setItem('olir-chatbot-settings', JSON.stringify(settings));
  }, [settings]);

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasUnsavedChanges(true);
  };

  const handleResetToDefaults = () => {
    const defaultSettings = {
      theme: 'light',
      font: 'inter',
      animationIntensity: 'moderate',
      responseLength: 'balanced',
      typingIndicator: true,
      autoSave: true,
      messageTimestamps: true,
      soundEffects: false,
      maxFileSize: 10,
      supportedFormats: ['pdf', 'docx', 'txt', 'youtube'],
      autoTraining: true,
      dataCollection: true,
      analytics: true,
      shareUsage: false
    };
    
    setSettings(prev => ({ ...prev, ...defaultSettings }));
    setHasUnsavedChanges(false);
  };

  const renderActiveSection = () => {
    switch (activeSection) {
      case 'appearance':
        return (
          <AppearanceSettings
            theme={settings.theme}
            onThemeChange={(value) => updateSetting('theme', value)}
            font={settings.font}
            onFontChange={(value) => updateSetting('font', value)}
            animationIntensity={settings.animationIntensity}
            onAnimationIntensityChange={(value) => updateSetting('animationIntensity', value)}
          />
        );
      case 'chat':
        return (
          <ChatPreferences
            responseLength={settings.responseLength}
            onResponseLengthChange={(value) => updateSetting('responseLength', value)}
            typingIndicator={settings.typingIndicator}
            onTypingIndicatorChange={(value) => updateSetting('typingIndicator', value)}
            autoSave={settings.autoSave}
            onAutoSaveChange={(value) => updateSetting('autoSave', value)}
            messageTimestamps={settings.messageTimestamps}
            onMessageTimestampsChange={(value) => updateSetting('messageTimestamps', value)}
            soundEffects={settings.soundEffects}
            onSoundEffectsChange={(value) => updateSetting('soundEffects', value)}
          />
        );
      case 'documents':
        return (
          <DocumentSettings
            maxFileSize={settings.maxFileSize}
            onMaxFileSizeChange={(value) => updateSetting('maxFileSize', value)}
            supportedFormats={settings.supportedFormats}
            onSupportedFormatsChange={(value) => updateSetting('supportedFormats', value)}
            autoTraining={settings.autoTraining}
            onAutoTrainingChange={(value) => updateSetting('autoTraining', value)}
            storageUsed={settings.storageUsed}
            storageLimit={settings.storageLimit}
          />
        );
      case 'account':
        return <AccountSettings />;
      case 'privacy':
        return (
          <PrivacySettings
            dataCollection={settings.dataCollection}
            onDataCollectionChange={(value) => updateSetting('dataCollection', value)}
            analytics={settings.analytics}
            onAnalyticsChange={(value) => updateSetting('analytics', value)}
            shareUsage={settings.shareUsage}
            onShareUsageChange={(value) => updateSetting('shareUsage', value)}
          />
        );
      default:
        return null;
    }
  };

  const getSectionTitle = () => {
    const sections = {
      appearance: 'Appearance',
      chat: 'Chat Preferences',
      documents: 'Document Settings',
      account: 'Account',
      privacy: 'Privacy'
    };
    return sections[activeSection] || 'Settings';
  };

  return (
    <>
      <Helmet>
        <title>Settings & Preferences - OLIR ChatBot</title>
        <meta name="description" content="Customize your OLIR ChatBot experience with appearance, chat, document, account, and privacy settings." />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground">
        
        <div className="pt-16 flex">
          {/* Desktop Sidebar */}
{/* Back Button */}
          <div className="absolute top-4 left-4">
            <Button
              variant="ghost"
              size="sm"
              iconName="ArrowLeft"
              onClick={() => window.history.back()}
            >
              Back
            </Button>
          </div>
          <div className="hidden lg:block">
            <SettingsSidebar
              activeSection={activeSection}
              onSectionChange={setActiveSection}
              isMobile={false}
            />
          </div>

          {/* Mobile Sidebar */}
          <AnimatePresence>
            {isMobileSidebarOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setIsMobileSidebarOpen(false)}
                />
                <motion.div
                  initial={{ x: -320 }}
                  animate={{ x: 0 }}
                  exit={{ x: -320 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="lg:hidden"
                >
                  <SettingsSidebar
                    activeSection={activeSection}
                    onSectionChange={setActiveSection}
                    isMobile={true}
                    onClose={() => setIsMobileSidebarOpen(false)}
                  />
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            {/* Mobile Header */}
            <div className="lg:hidden bg-card border-b border p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setIsMobileSidebarOpen(true)}
                  className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary transition-all duration-200"
                >
                  <Icon name="Menu" size={20} />
                </button>
                
                <h1 className="text-lg font-heading font-semibold text-foreground">
                  {getSectionTitle()}
                </h1>
                
                <div className="w-10" /> {/* Spacer for centering */}
              </div>
            </div>

            {/* Content Area */}
            <div className="p-6 lg:p-8 max-w-4xl mx-auto">
              {/* Desktop Header */}
              <div className="hidden lg:block mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                      {getSectionTitle()}
                    </h1>
                    <p className="text-muted-foreground">
                      Customize your OLIR ChatBot experience to match your preferences
                    </p>
                  </div>
                  
                  {hasUnsavedChanges && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex items-center space-x-2 text-destructive">
                        <Icon name="AlertCircle" size={16} />
                        <span className="text-sm">Unsaved changes</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        iconName="RotateCcw"
                        onClick={handleResetToDefaults}
                      >
                        Reset to Defaults
                      </Button>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Settings Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderActiveSection()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="bg-card border-t border py-6 mt-12">
          <div className="max-w-4xl mx-auto px-6 lg:px-8">
            <div className="text-center">
              <p className="text-muted-foreground text-sm">
                OLIR ChatBot v1.0.0
              </p>
              <p className="text-muted-foreground text-sm">
                Built by Santhoshkumar and Team
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SettingsPreferences;