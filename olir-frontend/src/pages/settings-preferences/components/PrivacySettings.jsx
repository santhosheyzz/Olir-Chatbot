import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PrivacySettings = ({
  dataCollection,
  onDataCollectionChange,
  analytics,
  onAnalyticsChange,
  shareUsage,
  onShareUsageChange
}) => {
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);

  const ToggleSwitch = ({ enabled, onChange, label, description, icon, color = 'primary' }) => (
    <div className="flex items-center justify-between p-4 bg-neutral rounded-lg">
      <div className="flex items-start space-x-3 flex-1">
        <div className={`w-8 h-8 bg-${color}/10 rounded-lg flex items-center justify-center mt-1`}>
          <Icon name={icon} size={16} className={`text-${color}`} />
        </div>
        <div className="flex-1">
          <h4 className="font-medium text-text-primary">{label}</h4>
          <p className="text-sm text-text-muted mt-1">{description}</p>
        </div>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={() => onChange(!enabled)}
        className={`
          relative w-12 h-6 rounded-full transition-all duration-200 ml-4
          ${enabled ? `bg-${color}` : 'bg-border-color'}
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

  const privacyPolicyContent = `
    OLIR ChatBot Privacy Policy

    Last updated: ${new Date().toLocaleDateString()}

    1. Information We Collect
    - Documents you upload for training
    - Chat conversations and interactions
    - Usage patterns and preferences
    - Technical information about your device

    2. How We Use Your Information
    - To provide AI-powered document analysis
    - To improve our services and user experience
    - To maintain and secure your account
    - To provide customer support

    3. Data Storage and Security
    - Your data is encrypted in transit and at rest
    - We use industry-standard security measures
    - Documents are processed locally when possible
    - Chat history is stored securely on our servers

    4. Data Sharing
    - We do not sell your personal information
    - Anonymous usage data may be used for research
    - We may share data as required by law
    - Third-party integrations follow strict privacy standards

    5. Your Rights
    - Access your personal data
    - Request data deletion
    - Export your data
    - Opt-out of data collection

    6. Contact Us
    For privacy concerns, contact: privacy@olir.edu
  `;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Privacy Overview */}
      <div className="bg-surface rounded-xl p-6 border border-border-color">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="Shield" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Privacy Overview</h3>
            <p className="text-sm text-text-muted">Your privacy and data security matter to us</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-error/10 rounded-lg border border-error/20"
          >
            <Icon name="Lock" size={24} className="mx-auto mb-2 text-error" />
            <h4 className="font-medium text-error">Encrypted</h4>
            <p className="text-xs text-error/80 mt-1">All data is encrypted in transit and at rest</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-primary/10 rounded-lg border border-primary/20"
          >
            <Icon name="UserCheck" size={24} className="mx-auto mb-2 text-primary" />
            <h4 className="font-medium text-primary">Your Control</h4>
            <p className="text-xs text-primary/80 mt-1">You control what data is collected and shared</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-accent/10 rounded-lg border border-accent/20"
          >
            <Icon name="Eye" size={24} className="mx-auto mb-2 text-accent" />
            <h4 className="font-medium text-accent">Transparent</h4>
            <p className="text-xs text-accent/80 mt-1">Clear information about data usage</p>
          </motion.div>
        </div>
      </div>

      {/* Data Collection Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border-color">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
            <Icon name="Database" size={20} className="text-warning" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Data Collection</h3>
            <p className="text-sm text-text-muted">Control what information we collect</p>
          </div>
        </div>

        <div className="space-y-4">
          <ToggleSwitch
            enabled={dataCollection}
            onChange={onDataCollectionChange}
            label="Essential Data Collection"
            description="Collect basic usage data required for core functionality"
            icon="Database"
            color="warning"
          />

          <ToggleSwitch
            enabled={analytics}
            onChange={onAnalyticsChange}
            label="Analytics & Performance"
            description="Help us improve the service by sharing anonymous usage analytics"
            icon="BarChart3"
            color="accent"
          />

          <ToggleSwitch
            enabled={shareUsage}
            onChange={onShareUsageChange}
            label="Usage Statistics"
            description="Share anonymized usage patterns for educational research"
            icon="TrendingUp"
            color="error"
          />
        </div>
      </div>

      {/* Document Privacy */}
      <div className="bg-surface rounded-xl p-6 border border-border-color">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-error/10 rounded-lg flex items-center justify-center">
            <Icon name="FileText" size={20} className="text-error" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Document Privacy</h3>
            <p className="text-sm text-text-muted">How your uploaded documents are handled</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="p-4 bg-error/10 rounded-lg border border-error/20">
            <div className="flex items-start space-x-3">
              <Icon name="CheckCircle" size={20} className="text-error mt-0.5" />
              <div>
                <h4 className="font-medium text-error">Private Processing</h4>
                <p className="text-sm text-error/80 mt-1">
                  Your documents are processed privately and are not shared with other users or used to train our models.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-start space-x-3">
              <Icon name="Clock" size={20} className="text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary">Automatic Deletion</h4>
                <p className="text-sm text-primary/80 mt-1">
                  Documents are automatically deleted after 90 days of inactivity unless you choose to keep them longer.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
            <div className="flex items-start space-x-3">
              <Icon name="Download" size={20} className="text-accent mt-0.5" />
              <div>
                <h4 className="font-medium text-accent">Data Portability</h4>
                <p className="text-sm text-accent/80 mt-1">
                  You can export all your data at any time in standard formats.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Policy */}
      <div className="bg-surface rounded-xl p-6 border border-border-color">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-neutral/10 rounded-lg flex items-center justify-center">
              <Icon name="FileText" size={20} className="text-neutral" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-text-primary">Privacy Policy</h3>
              <p className="text-sm text-text-muted">Read our complete privacy policy</p>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            iconName={showPrivacyPolicy ? "ChevronUp" : "ChevronDown"}
            onClick={() => setShowPrivacyPolicy(!showPrivacyPolicy)}
          >
            {showPrivacyPolicy ? 'Hide' : 'Show'} Policy
          </Button>
        </div>

        <motion.div
          initial={false}
          animate={{ height: showPrivacyPolicy ? 'auto' : 0, opacity: showPrivacyPolicy ? 1 : 0 }}
          className="overflow-hidden"
        >
          <div className="bg-neutral rounded-lg p-4 border border-border-color">
            <pre className="text-sm text-text-muted whitespace-pre-wrap font-mono">
              {privacyPolicyContent}
            </pre>
          </div>
        </motion.div>

        <div className="flex items-center space-x-3 mt-4">
          <Button variant="outline" size="sm" iconName="Download">
            Download Policy
          </Button>
          <Button variant="outline" size="sm" iconName="ExternalLink">
            View Online
          </Button>
        </div>
      </div>

      {/* Contact & Support */}
      <div className="bg-surface rounded-xl p-6 border border-border-color">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <Icon name="MessageCircle" size={20} className="text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Privacy Support</h3>
            <p className="text-sm text-text-muted">Questions about your privacy and data?</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-neutral rounded-lg border border-border-color cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Icon name="Mail" size={20} className="text-text-muted" />
              <div>
                <h4 className="font-medium text-text-primary">Email Support</h4>
                <p className="text-sm text-text-muted">support@olirlearning.com</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="p-4 bg-neutral rounded-lg border border-border-color cursor-pointer"
          >
            <div className="flex items-center space-x-3">
              <Icon name="HelpCircle" size={20} className="text-text-muted" />
              <div>
                <h4 className="font-medium text-text-primary">Privacy FAQ</h4>
                <p className="text-sm text-text-muted">Common questions</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default PrivacySettings;