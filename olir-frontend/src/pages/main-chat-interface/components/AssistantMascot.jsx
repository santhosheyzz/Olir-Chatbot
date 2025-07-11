import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const AssistantMascot = ({ isThinking = false, messageCount = 0 }) => {
  const [currentExpression, setCurrentExpression] = useState('happy');
  const [isAnimating, setIsAnimating] = useState(false);

  const expressions = {
    happy: { icon: 'Smile', color: 'var(--color-success)' },
    thinking: { icon: 'Brain', color: 'var(--color-warning)' },
    excited: { icon: 'Zap', color: 'var(--color-primary)' },
    sleepy: { icon: 'Moon', color: 'var(--color-text-muted)' }
  };

  useEffect(() => {
    if (isThinking) {
      setCurrentExpression('thinking');
      setIsAnimating(true);
    } else if (messageCount > 0) {
      setCurrentExpression('excited');
      setIsAnimating(true);
      
      const timer = setTimeout(() => {
        setCurrentExpression('happy');
        setIsAnimating(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    } else {
      setCurrentExpression('sleepy');
      setIsAnimating(false);
    }
  }, [isThinking, messageCount]);

  return (
    <div className="fixed top-20 right-6 z-50 hidden lg:block">
      <div className={`
        relative transition-all duration-500 ease-out
        ${isAnimating ? 'animate-bounce' : 'hover:scale-110'}
      `}>
        {/* Main Mascot Body */}
        <div className="glass-card w-16 h-16 rounded-full flex items-center justify-center shadow-floating">
          <div className={`
            w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300
            ${isThinking ? 'animate-pulse' : ''}
          `} style={{ backgroundColor: expressions[currentExpression].color + '20' }}>
            <Icon 
              name={expressions[currentExpression].icon} 
              size={24} 
              color={expressions[currentExpression].color}
            />
          </div>
        </div>

        {/* Thinking Bubbles */}
        {isThinking && (
          <div className="absolute -top-8 -left-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-primary-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1 h-1 bg-primary-200 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}

        {/* Speech Bubble for Welcome */}
        {messageCount === 0 && (
          <div className="absolute -left-48 top-1/2 transform -translate-y-1/2">
            <div className="glass-card px-3 py-2 rounded-lg shadow-lg relative">
              <p className="text-xs text-text-primary whitespace-nowrap">
                Hi! Upload documents to get started! 👋
              </p>
              <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-white border-t-2 border-t-transparent border-b-2 border-b-transparent"></div>
            </div>
          </div>
        )}

        {/* Activity Indicator */}
        <div className="absolute -bottom-1 -right-1">
          <div className={`
            w-4 h-4 rounded-full border-2 border-background flex items-center justify-center
            ${messageCount > 0 ? 'bg-success-500' : 'bg-text-muted'}
          `}>
            <span className="text-xs text-white font-bold">
              {messageCount > 9 ? '9+' : messageCount}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantMascot;