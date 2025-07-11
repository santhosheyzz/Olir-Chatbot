import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import FileUploadZone from './components/FileUploadZone';
import FilePreviewCard from './components/FilePreviewCard';
import TrainingProgress from './components/TrainingProgress';
import TrainingHistory from './components/TrainingHistory';

const DocumentUploadTraining = () => {
  const navigate = useNavigate();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isTraining, setIsTraining] = useState(false);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [currentTrainingFile, setCurrentTrainingFile] = useState('');
  const [estimatedTime, setEstimatedTime] = useState(0);
  const [history, setHistory] = useState([]);

fetch("http://localhost:8000/training-history")
  .then((res) => res.json())
  .then((data) => {
    console.log(data.files);
    // show files in UI
  });

  const handleFilesSelected = (files) => {
    const newFiles = files.filter(file =>
      !selectedFiles.some(existing =>
        existing.name === file.name && existing.size === file.size
      )
    );
    setSelectedFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setSelectedFiles(prev => prev.filter(file => file !== fileToRemove));
  };

  const handleStartTraining = async () => {
    if (selectedFiles.length === 0 && !youtubeUrl) return;

    setIsTraining(true);
    setTrainingProgress(0);
    setEstimatedTime((selectedFiles.length + (youtubeUrl ? 1 : 0)) * 30); // 30 seconds per item estimate

    const startTime = Date.now();
    let successCount = 0;
    let failedFiles = [];
    let trainingItems = [...selectedFiles];
    if (youtubeUrl) {
      trainingItems.push({ name: youtubeUrl, isYoutube: true });
    }

    try {
      // Process each item through the real API
      for (let i = 0; i < trainingItems.length; i++) {
        const item = trainingItems[i];
        setCurrentTrainingFile(item.name);
        
        try {
          // Import the upload API function
          const { uploadDocument } = await import('../../api/upload');
          
          // Call the real upload API
          const result = await uploadDocument(item.isYoutube ? { youtube_url: item.name } : item);
          console.log(`✅ Successfully trained: ${item.name}`, result);
          if (item.isYoutube) {
            // For youtube, the result contains the real filename
            item.name = result.filename;
          }
          successCount++;
          
          // Update progress
          const overallProgress = ((i + 1) * 100) / trainingItems.length;
          setTrainingProgress(overallProgress);
          
        } catch (error) {
          console.error(`❌ Failed to train: ${item.name}`, error);
          failedFiles.push(item.name);
        }
      }

      const endTime = Date.now();
      const duration = Math.round((endTime - startTime) / 1000);

      // Add to training history
      const newSession = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        status: failedFiles.length === 0 ? 'completed' : 'partial',
        documentsCount: trainingItems.length,
        successCount: successCount,
        failedFiles: failedFiles,
        duration: `${duration}s`,
        progress: 100,
        documents: trainingItems.map(item => ({ name: item.isYoutube ? `youtube_transcript_${item.name.split("v=")[1]}.txt` : item.name }))
      };

      setHistory(prev => [newSession, ...prev]);
      setIsTraining(false);
      setCurrentTrainingFile('');
      setSelectedFiles([]);
      setYoutubeUrl('');
      setTrainingProgress(100);

      // Store training files in session storage to show status on next page
      const trainingFileNames = trainingItems.map(f => f.name);
      sessionStorage.setItem('trainingFiles', JSON.stringify(trainingFileNames));

      // Show completion message and redirect after delay
      setTimeout(() => {
        navigate('/main-chat-interface');
      }, 2000);

    } catch (error) {
      console.error('Training process failed:', error);
      setIsTraining(false);
      setCurrentTrainingFile('');
      // Don't clear selected files on error so user can retry
    }
  };

  const handleRetrain = (session) => {
    console.log('Retrain session:', session);
    // Implement retrain logic
  };

  const handleViewDetails = (session) => {
    console.log('View session details:', session);
    // Implement view details logic
  };

  const handleNavigateToChat = () => {
    navigate('/main-chat-interface');
  };

  const handleNavigateToLibrary = () => {
    navigate('/document-library-management');
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl lg:text-4xl font-heading font-bold text-text-primary mb-4">
              Document Upload & Training
            </h1>
            <p className="text-lg text-text-secondary max-w-2xl mx-auto">
              Upload your study materials and train your AI assistant to provide accurate, 
              document-based answers to your questions.
            </p>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-4 mb-8"
          >
            <Button
              variant="outline"
              iconName="MessageCircle"
              onClick={handleNavigateToChat}
            >
              Go to Chat
            </Button>
            <Button
              variant="outline"
              iconName="FolderOpen"
              onClick={handleNavigateToLibrary}
            >
              View Library
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Upload Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upload Zone */}
              <FileUploadZone 
                onFilesSelected={handleFilesSelected}
                isTraining={isTraining}
              />
              
              {/* YouTube URL Input */}
              <div className="glass-card p-6 rounded-xl border">
                <h3 className="text-lg font-heading font-semibold text-text-primary mb-4">
                  Train from YouTube
                </h3>
                <div className="flex items-center gap-4">
                  <input
                    type="text"
                    placeholder="Enter YouTube URL..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg bg-background-alt border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isTraining}
                  />
                </div>
              </div>

              {/* File Preview Section */}
              <AnimatePresence>
                {(selectedFiles.length > 0 || youtubeUrl) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="glass-card p-6 rounded-xl border">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-heading font-semibold text-text-primary">
                          Ready to Train ({selectedFiles.length + (youtubeUrl ? 1 : 0)} items)
                        </h3>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            iconName="Trash2"
                            onClick={() => {
                              setSelectedFiles([]);
                              setYoutubeUrl('');
                            }}
                            disabled={isTraining}
                            className="text-error-600 hover:text-error-700 hover:bg-error-50"
                          >
                            Clear All
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        <AnimatePresence>
                          {selectedFiles.map((file, index) => (
                            <FilePreviewCard
                              key={`${file.name}-${index}`}
                              file={file}
                              onRemove={handleRemoveFile}
                              isTraining={isTraining}
                            />
                          ))}
                          {youtubeUrl && (
                            <FilePreviewCard
                              file={{ name: youtubeUrl, isYoutube: true }}
                              onRemove={() => setYoutubeUrl('')}
                              isTraining={isTraining}
                            />
                          )}
                        </AnimatePresence>
                      </div>

                      {/* Training Button */}
                      <div className="text-center">
                        <Button
                          variant="primary"
                          size="lg"
                          iconName={isTraining ? "Loader" : "Zap"}
                          onClick={handleStartTraining}
                          disabled={isTraining || (selectedFiles.length === 0 && !youtubeUrl)}
                          loading={isTraining}
                          className="px-8"
                        >
                          {isTraining ? 'Training in Progress...' : 'Start Training'}
                        </Button>
                        
                        {!isTraining && (selectedFiles.length > 0 || youtubeUrl) && (
                          <p className="text-sm text-text-muted mt-2">
                            Estimated training time: {(selectedFiles.length + (youtubeUrl ? 1 : 0)) * 30} seconds
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Training Progress */}
              <AnimatePresence>
                {isTraining && (
                  <TrainingProgress
                    progress={trainingProgress}
                    currentFile={currentTrainingFile}
                    estimatedTime={estimatedTime}
                    isTraining={isTraining}
                  />
                )}
              </AnimatePresence>

              {/* Success Message */}
              <AnimatePresence>
                {trainingProgress >= 100 && !isTraining && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="glass-card p-6 rounded-xl border border-success-200 bg-success-50"
                  >
                    <div className="text-center">
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="mb-4"
                      >
                        <Icon name="CheckCircle" size={64} color="var(--color-success)" />
                      </motion.div>
                      
                      <h3 className="text-xl font-heading font-semibold text-success-700 mb-2">
                        Training Complete!
                      </h3>
                      
                      <p className="text-success-600 mb-4">
                        Your AI assistant has been successfully trained on your documents. 
                        You can now start asking questions!
                      </p>
                      
                      <Button
                        variant="success"
                        iconName="MessageCircle"
                        onClick={handleNavigateToChat}
                      >
                        Start Chatting
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <TrainingHistory
                history={history}
                onRetrain={handleRetrain}
                onViewDetails={handleViewDetails}
              />
            </div>
          </div>

          {/* Help Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 glass-card p-6 rounded-xl border"
          >
            <div className="text-center mb-6">
              <Icon name="HelpCircle" size={48} color="var(--color-primary)" className="mx-auto mb-3" />
              <h3 className="text-xl font-heading font-semibold text-text-primary mb-2">
                How Training Works
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Upload" size={24} color="var(--color-primary)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">1. Upload Documents</h4>
                <p className="text-sm text-text-secondary">
                  Upload PDF, DOCX, or TXT files containing your study materials
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="Zap" size={24} color="var(--color-primary)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">2. Train AI</h4>
                <p className="text-sm text-text-secondary">
                  Our AI analyzes and learns from your documents to understand the content
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Icon name="MessageCircle" size={24} color="var(--color-primary)" />
                </div>
                <h4 className="font-medium text-text-primary mb-2">3. Ask Questions</h4>
                <p className="text-sm text-text-secondary">
                  Chat with your AI assistant and get answers based on your uploaded documents
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DocumentUploadTraining;