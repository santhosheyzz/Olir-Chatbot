import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AppearanceSettings = ({ theme, onThemeChange, font, onFontChange, animationIntensity, onAnimationIntensityChange }) => {
  const [previewTheme, setPreviewTheme] = useState(theme);

  const fonts = [
    { value: 'inter', label: 'Inter', className: 'font-sans' },
    { value: 'poppins', label: 'Poppins', className: 'font-poppins' }
  ];

  const animationLevels = [
    { value: 'minimal', label: 'Minimal', description: 'Basic transitions only' },
    { value: 'moderate', label: 'Moderate', description: 'Smooth animations' },
    { value: 'enhanced', label: 'Enhanced', description: 'Rich animations' }
  ];

  const handleThemePreview = (newTheme) => {
    setPreviewTheme(newTheme);
    // Apply preview temporarily
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleThemeConfirm = () => {
    onThemeChange(previewTheme);
  };

  const handleThemeCancel = () => {
    setPreviewTheme(theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      {/* Theme Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center">
            <Icon name="Palette" size={20} color="var(--color-primary)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Theme</h3>
            <p className="text-sm text-text-secondary">Choose your preferred color scheme</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Light Theme */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${previewTheme === 'light' ?'border-primary-500 bg-primary-50' :'border-border hover:border-primary-300'
              }
            `}
            onClick={() => handleThemePreview('light')}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="Sun" size={20} color={previewTheme === 'light' ? 'var(--color-primary)' : 'currentColor'} />
              <span className="font-medium text-text-primary">Light Mode</span>
            </div>
            
            {/* Theme Preview */}
            <div className="bg-white rounded-md p-3 border border-gray-200">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <div className="w-16 h-2 bg-gray-200 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 bg-gray-100 rounded"></div>
                <div className="w-3/4 h-2 bg-gray-100 rounded"></div>
              </div>
            </div>
            
            {previewTheme === 'light' && (
              <div className="absolute top-2 right-2">
                <Icon name="Check" size={16} color="var(--color-primary)" />
              </div>
            )}
          </motion.div>

          {/* Dark Theme */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`
              relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
              ${previewTheme === 'dark' ?'border-primary-500 bg-primary-50' :'border-border hover:border-primary-300'
              }
            `}
            onClick={() => handleThemePreview('dark')}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Icon name="Moon" size={20} color={previewTheme === 'dark' ? 'var(--color-primary)' : 'currentColor'} />
              <span className="font-medium text-text-primary">Dark Mode</span>
            </div>
            
            {/* Theme Preview */}
            <div className="bg-gray-800 rounded-md p-3 border border-gray-700">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <div className="w-16 h-2 bg-gray-600 rounded"></div>
              </div>
              <div className="space-y-1">
                <div className="w-full h-2 bg-gray-700 rounded"></div>
                <div className="w-3/4 h-2 bg-gray-700 rounded"></div>
              </div>
            </div>
            
            {previewTheme === 'dark' && (
              <div className="absolute top-2 right-2">
                <Icon name="Check" size={16} color="var(--color-primary)" />
              </div>
            )}
          </motion.div>
        </div>

        {previewTheme !== theme && (
          <div className="flex items-center space-x-3">
            <Button variant="primary" size="sm" onClick={handleThemeConfirm}>
              Apply Theme
            </Button>
            <Button variant="outline" size="sm" onClick={handleThemeCancel}>
              Cancel
            </Button>
          </div>
        )}
      </div>

      {/* Font Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-accent-100 rounded-lg flex items-center justify-center">
            <Icon name="Type" size={20} color="var(--color-accent)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Typography</h3>
            <p className="text-sm text-text-secondary">Select your preferred font family</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fonts.map((fontOption) => (
            <motion.div
              key={fontOption.value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-200
                ${font === fontOption.value 
                  ? 'border-accent-500 bg-accent-50' :'border-border hover:border-accent-300'
                }
              `}
              onClick={() => onFontChange(fontOption.value)}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-medium text-text-primary">{fontOption.label}</span>
                {font === fontOption.value && (
                  <Icon name="Check" size={16} color="var(--color-accent)" />
                )}
              </div>
              
              <div className={`${fontOption.className} space-y-2`}>
                <p className="text-lg font-semibold text-text-primary">The quick brown fox</p>
                <p className="text-sm text-text-secondary">jumps over the lazy dog</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Animation Settings */}
      <div className="bg-surface rounded-xl p-6 border border-border">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-warning-100 rounded-lg flex items-center justify-center">
            <Icon name="Zap" size={20} color="var(--color-warning)" />
          </div>
          <div>
            <h3 className="text-lg font-heading font-semibold text-text-primary">Animations</h3>
            <p className="text-sm text-text-secondary">Control animation intensity and effects</p>
          </div>
        </div>

        <div className="space-y-4">
          {animationLevels.map((level) => (
            <motion.div
              key={level.value}
              whileHover={{ scale: 1.01 }}
              className={`
                p-4 rounded-lg border cursor-pointer transition-all duration-200
                ${animationIntensity === level.value 
                  ? 'border-warning-500 bg-warning-50' :'border-border hover:border-warning-300'
                }
              `}
              onClick={() => onAnimationIntensityChange(level.value)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`
                    w-4 h-4 rounded-full border-2 transition-all duration-200
                    ${animationIntensity === level.value 
                      ? 'border-warning-500 bg-warning-500' :'border-border'
                    }
                  `}>
                    {animationIntensity === level.value && (
                      <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-text-primary">{level.label}</h4>
                    <p className="text-sm text-text-secondary">{level.description}</p>
                  </div>
                </div>
                
                {/* Animation Preview */}
                <motion.div
                  animate={animationIntensity === level.value ? {
                    scale: level.value === 'minimal' ? [1, 1.05, 1] : 
                           level.value === 'moderate' ? [1, 1.1, 1] : [1, 1.2, 1],
                    rotate: level.value === 'enhanced' ? [0, 5, -5, 0] : 0
                  } : {}}
                  transition={{ 
                    duration: level.value === 'minimal' ? 0.2 : 
                             level.value === 'moderate' ? 0.4 : 0.6,
                    repeat: animationIntensity === level.value ? Infinity : 0,
                    repeatDelay: 2
                  }}
                  className="w-8 h-8 bg-gradient-to-br from-warning-400 to-warning-600 rounded-lg"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default AppearanceSettings;