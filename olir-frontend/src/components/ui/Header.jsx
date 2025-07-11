import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');
  const location = useLocation();
  const navigate = useNavigate();

  const navigationItems = [
    {
      label: 'Chat',
      path: '/main-chat-interface',
      icon: 'MessageCircle',
      tooltip: 'AI Chat Interface'
    },
    {
      label: 'Upload',
      path: '/document-upload-training',
      icon: 'Upload',
      tooltip: 'Upload & Train Documents'
    },
    {
      label: 'Library',
      path: '/document-library-management',
      icon: 'FolderOpen',
      tooltip: 'Document Library'
    },
    {
      label: 'History',
      path: '/chat-history-conversation-management',
      icon: 'Clock',
      tooltip: 'Chat History'
    }
  ];

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings-preferences');
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-1000 glass-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo Section */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <img
                  src="/olir.ico"
                  alt="OLIR Logo"
                  className="w-8 h-8 rounded-lg"
                />
                <span className="text-xl font-heading font-semibold text-text-primary">
                  OLIR CHATBOT
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    flex items-center space-x-2 min-h-[48px]
                    ${isActivePath(item.path)
                      ? 'bg-primary-50 text-primary-600 shadow-sm'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }
                  `}
                  title={item.tooltip}
                >
                  <Icon 
                    name={item.icon} 
                    size={18} 
                    color={isActivePath(item.path) ? 'var(--color-primary)' : 'currentColor'} 
                  />
                  <span>{item.label}</span>
                  {isActivePath(item.path) && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-0.5 bg-primary-500 rounded-full" />
                  )}
                </button>
              ))}
            </nav>

            {/* Right Section - Theme Toggle & Settings */}
            <div className="flex items-center space-x-2">
              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
                title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              >
                <Icon 
                  name={theme === 'light' ? 'Moon' : 'Sun'} 
                  size={20} 
                />
              </button>

              {/* Settings - Desktop */}
              <button
                onClick={handleSettingsClick}
                className={`
                  hidden md:flex p-2 rounded-lg transition-all duration-200
                  ${isActivePath('/settings-preferences')
                    ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  }
                `}
                title="Settings & Preferences"
              >
                <Icon 
                  name="Settings" 
                  size={20} 
                  color={isActivePath('/settings-preferences') ? 'var(--color-primary)' : 'currentColor'} 
                />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={toggleMobileMenu}
                className="md:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
                title="Open menu"
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-border glass-card">
            <div className="px-4 py-2 space-y-1">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`
                    w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200
                    ${isActivePath(item.path)
                      ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }
                  `}
                >
                  <Icon 
                    name={item.icon} 
                    size={20} 
                    color={isActivePath(item.path) ? 'var(--color-primary)' : 'currentColor'} 
                  />
                  <div>
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-text-muted">{item.tooltip}</div>
                  </div>
                </button>
              ))}
              
              {/* Settings - Mobile */}
              <button
                onClick={handleSettingsClick}
                className={`
                  w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-all duration-200
                  ${isActivePath('/settings-preferences')
                    ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                  }
                `}
              >
                <Icon 
                  name="Settings" 
                  size={20} 
                  color={isActivePath('/settings-preferences') ? 'var(--color-primary)' : 'currentColor'} 
                />
                <div>
                  <div className="font-medium">Settings</div>
                  <div className="text-xs text-text-muted">Settings & Preferences</div>
                </div>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-[999] md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
};

export default Header;