import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';

const AssistantMascot = ({ isTraining, filesCount, trainingProgress }) => {
  const [currentMessage, setCurrentMessage] = useState(0);
  const [showMessage, setShowMessage] = useState(true);

  const messages = [
    {
      text: "Hi! I'm your study assistant. Upload your documents to get started!",
      condition: () => filesCount === 0 && !isTraining
    },
    {
      text: `Great! You've uploaded ${filesCount} document${filesCount !== 1 ? 's' : ''}. Ready to train me?`,
      condition: () => filesCount > 0 && !isTraining
    },
    {
      text: "I'm learning from your documents. This will help me answer your questions better!",
      condition: () => isTraining && trainingProgress < 50
    },
    {
      text: "Almost done! I'm getting smarter with each document I process.",
      condition: () => isTraining && trainingProgress >= 50 && trainingProgress < 100
    },
    {
      text: "Training complete! I\'m ready to help you with your studies. Let\'s chat!",
      condition: () => trainingProgress >= 100
    }
  ];

  useEffect(() => {
    const activeMessage = messages.findIndex(msg => msg.condition());
    if (activeMessage !== -1 && activeMessage !== currentMessage) {
      setCurrentMessage(activeMessage);
      setShowMessage(true);
    }
  }, [filesCount, isTraining, trainingProgress]);

  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showMessage, currentMessage]);

  const handleMascotClick = () => {
    setShowMessage(!showMessage);
  };

  return (
    <div className="fixed top-20 right-4 z-50">
      <div className="relative">
        {/* Speech Bubble */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-full right-0 mb-2 w-64"
            >
              <div className="glass-card p-3 rounded-lg shadow-lg border">
                <p className="text-sm text-text-primary">
                  {messages[currentMessage]?.text}
                </p>
                
                {/* Speech bubble arrow */}
                <div className="absolute top-full right-4 w-0 h-0 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mascot */}
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleMascotClick}
          className="cursor-pointer"
        >
          <div className={`
            w-16 h-16 rounded-full glass-card border-2 flex items-center justify-center
            transition-all duration-300 shadow-lg
            ${isTraining 
              ? 'border-primary-400 bg-primary-50' :'border-primary-300 hover:border-primary-400 hover:shadow-xl'
            }
          `}>
            <motion.div
              animate={isTraining ? { rotate: 360 } : {}}
              transition={isTraining ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
            >
              <Icon 
                name="Bot" 
                size={32} 
                color={isTraining ? "var(--color-primary)" : "var(--color-primary-600)"} 
              />
            </motion.div>
          </div>

          {/* Activity Indicator */}
          {isTraining && (
            <motion.div
              className="absolute -top-1 -right-1 w-4 h-4 bg-success-500 rounded-full flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </motion.div>
          )}

          {/* Notification Badge */}
          {filesCount > 0 && !isTraining && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold"
            >
              {filesCount > 9 ? '9+' : filesCount}
            </motion.div>
          )}
        </motion.div>

        {/* Floating Particles (when training) */}
        {isTraining && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-primary-400 rounded-full"
                animate={{
                  y: [-20, -40, -20],
                  x: [0, Math.random() * 20 - 10, 0],
                  opacity: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.5,
                  ease: "easeInOut"
                }}
                style={{
                  left: `${20 + i * 20}%`,
                  top: '50%'
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssistantMascot;