import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const AccountSettings = () => {
  const [userProfile, setUserProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@student.edu',
    institution: 'OLIR Institution',
    studentId: 'STU2024001',
    joinDate: '2024-01-15'
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState(userProfile);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSaveProfile = () => {
    setUserProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setEditedProfile(userProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleExportData = () => {
    // Mock export functionality
    const exportData = {
      profile: userProfile,
      settings: {
        theme: localStorage.getItem('theme') || 'light',
        exportDate: new Date().toISOString()
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'olir-chatbot-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Profile Information */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
              <Icon name="User" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <h3 className="text-lg font-heading font-semibold text-text-primary">Profile Information</h3>
              <p className="text-sm text-text-secondary">Manage your account details</p>
            </div>
          </div>
          
          <Button
            variant={isEditing ? "success" : "outline"}
            size="sm"
            iconName={isEditing ? "Check" : "Edit"}
            onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Full Name</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedProfile.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-text-secondary bg-surface-secondary p-3 rounded-lg">{userProfile.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Email Address</label>
              {isEditing ? (
                <Input
                  type="email"
                  value={editedProfile.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-text-secondary bg-surface-secondary p-3 rounded-lg">{userProfile.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Institution</label>
              {isEditing ? (
                <Input
                  type="text"
                  value={editedProfile.institution}
                  onChange={(e) => handleInputChange('institution', e.target.value)}
                  className="w-full"
                />
              ) : (
                <p className="text-text-secondary bg-surface-secondary p-3 rounded-lg">{userProfile.institution}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Student ID</label>
              <p className="text-text-secondary bg-surface-secondary p-3 rounded-lg">{userProfile.studentId}</p>
              <p className="text-xs text-text-muted mt-1">Student ID cannot be changed</p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-border">
            <Button variant="success" onClick={handleSaveProfile}>
              Save Changes
            </Button>
            <Button variant="outline" onClick={handleCancelEdit}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Account Statistics */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <Icon name="BarChart3" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Account Statistics</h3>
            <p className="text-sm text-text-secondary">Your usage overview</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-surface-secondary rounded-lg"
          >
            <Icon name="MessageSquare" size={24} className="mx-auto mb-2 text-primary-500" />
            <p className="text-2xl font-bold text-text-primary">1,247</p>
            <p className="text-xs text-text-muted">Messages Sent</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-surface-secondary rounded-lg"
          >
            <Icon name="FileText" size={24} className="mx-auto mb-2 text-accent-500" />
            <p className="text-2xl font-bold text-text-primary">23</p>
            <p className="text-xs text-text-muted">Documents Uploaded</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-surface-secondary rounded-lg"
          >
            <Icon name="Clock" size={24} className="mx-auto mb-2 text-success-500" />
            <p className="text-2xl font-bold text-text-primary">47h</p>
            <p className="text-xs text-text-muted">Study Time</p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-surface-secondary rounded-lg"
          >
            <Icon name="Calendar" size={24} className="mx-auto mb-2 text-warning-500" />
            <p className="text-2xl font-bold text-text-primary">89</p>
            <p className="text-xs text-text-muted">Days Active</p>
          </motion.div>
        </div>

        <div className="mt-6 p-4 bg-primary-50 rounded-lg border border-primary-200">
          <div className="flex items-center space-x-3">
            <Icon name="Trophy" size={20} color="var(--color-primary)" />
            <div>
              <h4 className="font-medium text-primary-700">Member since {new Date(userProfile.joinDate).toLocaleDateString()}</h4>
              <p className="text-sm text-primary-600">You've been learning with OLIR ChatBot for {Math.floor((new Date() - new Date(userProfile.joinDate)) / (1000 * 60 * 60 * 24))} days!</p>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-success-100 rounded-lg flex items-center justify-center">
            <Icon name="Database" size={20} color="var(--color-success)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Data Management</h3>
            <p className="text-sm text-text-secondary">Export or manage your data</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Export Account Data</h4>
              <p className="text-sm text-text-secondary">Download your profile and settings</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={handleExportData}
            >
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg">
            <div>
              <h4 className="font-medium text-text-primary">Clear Chat History</h4>
              <p className="text-sm text-text-secondary">Remove all conversation data</p>
            </div>
            <Button
              variant="warning"
              size="sm"
              iconName="Trash2"
            >
              Clear History
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 bg-error-50 rounded-lg border border-error-200">
            <div>
              <h4 className="font-medium text-error-700">Delete Account</h4>
              <p className="text-sm text-error-600">Permanently remove your account and all data</p>
            </div>
            <Button
              variant="danger"
              size="sm"
              iconName="AlertTriangle"
              onClick={() => setShowDeleteConfirm(true)}
            >
              Delete Account
            </Button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-surface rounded-xl p-6 max-w-md mx-4 border border-border"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-error-100 rounded-lg flex items-center justify-center">
                <Icon name="AlertTriangle" size={20} color="var(--color-error)" />
              </div>
              <h3 className="text-lg font-heading font-semibold text-text-primary">Delete Account</h3>
            </div>
            
            <p className="text-text-secondary mb-6">
              Are you sure you want to delete your account? This action cannot be undone and will permanently remove all your data, documents, and chat history.
            </p>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="danger"
                onClick={() => {
                  // Handle account deletion
                  setShowDeleteConfirm(false);
                }}
              >
                Yes, Delete Account
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AccountSettings;