import React, { useState, useEffect } from 'react';

const LoadingScreen = ({ onLoadingComplete }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  const messages = [
    "Getting your AI assistant ready...",
    "Loading your documents and knowledge...",
    "Almost there! Preparing your study assistant...",
    "Welcome to OLIR Chatbot Centre!"
  ];

  useEffect(() => {
    // Animate progress
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 2;
      });
    }, 50);

    // Cycle through messages
    const messageInterval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % messages.length);
    }, 2000);

    // Complete loading after 5 seconds
    const completeTimeout = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        if (onLoadingComplete) onLoadingComplete();
      }, 500);
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(messageInterval);
      clearTimeout(completeTimeout);
    };
  }, [onLoadingComplete]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-purple-100 overflow-hidden">
      {/* Minimal background pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none select-none">
        <div className="absolute top-10 left-10 w-24 h-24 bg-blue-200 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-32 h-32 bg-purple-200 rounded-full blur-3xl" />
      </div>

      {/* Corner decorations */}
      <div className="absolute top-0 left-0 w-16 h-16 md:w-24 md:h-24 border-l-2 md:border-l-4 border-t-2 md:border-t-4 border-blue-200 opacity-20"></div>
      <div className="absolute bottom-0 right-0 w-16 h-16 md:w-24 md:h-24 border-r-2 md:border-r-4 border-b-2 md:border-b-4 border-purple-200 opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center space-y-6 md:space-y-8 p-4 md:p-8 max-w-sm md:max-w-md mx-auto">
        {/* Clean OLIR Logo, centered, no border, no glow, no ring */}
        <div className="mb-4 flex items-center justify-center">
          <img 
            src="/olir.ico" 
            alt="OLIR Chatbot" 
            className="w-20 h-20 md:w-24 md:h-24 object-contain"
          />
        </div>

        {/* Title */}
        <div className="text-center">
          <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            OLIR Chatbot Centre
          </h1>
          <p className="text-gray-600 text-sm md:text-lg">
            Your Intelligent Study Assistant
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="w-64 md:w-80 space-y-4">
          {/* Progress Bar */}
          <div className="relative">
            <div className="w-full bg-gray-200 rounded-full h-2 md:h-3 overflow-hidden shadow-inner">
              <div 
                className="h-full bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Progress percentage */}
            <div className="absolute -top-6 md:-top-8 right-0 text-xs md:text-sm font-semibold text-gray-600">
              {progress}%
            </div>
          </div>
        </div>

        {/* Welcome Message */}
        <div className="text-center max-w-xs md:max-w-md">
          <p className="text-gray-700 text-sm md:text-lg font-medium transition-all duration-500">
            {messages[currentMessage]}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen; 