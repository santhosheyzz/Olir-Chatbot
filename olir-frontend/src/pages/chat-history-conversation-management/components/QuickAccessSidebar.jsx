import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';


const QuickAccessSidebar = ({ 
  isOpen, 
  onToggle, 
  favoriteConversations, 
  recentSessions, 
  documentThreads,
  onConversationSelect,
  className = '' 
}) => {
  const [activeTab, setActiveTab] = useState('favorites');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const tabs = [
    { id: 'favorites', label: 'Favorites', icon: 'Star', count: favoriteConversations?.length || 0 },
    { id: 'recent', label: 'Recent', icon: 'Clock', count: recentSessions?.length || 0 },
    { id: 'documents', label: 'By Document', icon: 'FileText', count: documentThreads?.length || 0 }
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString();
  };

  const getDocumentIcon = (type) => {
    switch (type) {
      case 'pdf': return 'FileText';
      case 'docx': return 'FileText';
      case 'youtube': return 'Youtube';
      default: return 'File';
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'favorites':
        return (
          <div className="space-y-2">
            {favoriteConversations && favoriteConversations.length > 0 ? (
              favoriteConversations.map((conversation) => (
                <button
                  key={conversation.id}
                  onClick={() => onConversationSelect(conversation.id)}
                  className="w-full p-3 text-left rounded-lg border border-border hover:border-primary-200 hover:bg-surface-secondary transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-2">
                    <Icon name="Star" size={16} color="var(--color-warning-500)" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary-600">
                        {conversation.firstQuestion}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-text-muted">{formatDate(conversation.date)}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{conversation.messageCount} msgs</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <Icon name="Star" size={32} className="mx-auto text-text-muted mb-2" />
                <p className="text-sm text-text-muted">No favorite conversations yet</p>
              </div>
            )}
          </div>
        );

      case 'recent':
        return (
          <div className="space-y-2">
            {recentSessions && recentSessions.length > 0 ? (
              recentSessions.map((session) => (
                <button
                  key={session.id}
                  onClick={() => onConversationSelect(session.id)}
                  className="w-full p-3 text-left rounded-lg border border-border hover:border-primary-200 hover:bg-surface-secondary transition-all duration-200 group"
                >
                  <div className="flex items-start space-x-2">
                    <Icon name="Clock" size={16} color="var(--color-text-secondary)" className="mt-0.5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text-primary line-clamp-2 group-hover:text-primary-600">
                        {session.firstQuestion}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-text-muted">{formatDate(session.date)}</span>
                        <span className="text-xs text-text-muted">•</span>
                        <span className="text-xs text-text-muted">{session.duration}</span>
                      </div>
                    </div>
                  </div>
                </button>
              ))
            ) : (
              <div className="text-center py-8">
                <Icon name="Clock" size={32} className="mx-auto text-text-muted mb-2" />
                <p className="text-sm text-text-muted">No recent sessions</p>
              </div>
            )}
          </div>
        );

      case 'documents':
        return (
          <div className="space-y-3">
            {documentThreads && documentThreads.length > 0 ? (
              documentThreads.map((thread) => (
                <div key={thread.documentId} className="border border-border rounded-lg p-3">
                  <div className="flex items-center space-x-2 mb-2">
                    <Icon name={getDocumentIcon(thread.documentType)} size={16} color="var(--color-text-secondary)" />
                    <h4 className="text-sm font-medium text-text-primary truncate">
                      {thread.documentName}
                    </h4>
                  </div>
                  
                  <div className="space-y-1">
                    {thread.conversations.slice(0, 3).map((conversation) => (
                      <button
                        key={conversation.id}
                        onClick={() => onConversationSelect(conversation.id)}
                        className="w-full p-2 text-left rounded hover:bg-surface-secondary transition-colors duration-200 group"
                      >
                        <p className="text-xs text-text-secondary line-clamp-1 group-hover:text-text-primary">
                          {conversation.firstQuestion}
                        </p>
                        <span className="text-xs text-text-muted">{formatDate(conversation.date)}</span>
                      </button>
                    ))}
                    
                    {thread.conversations.length > 3 && (
                      <button className="w-full p-2 text-left text-xs text-primary-600 hover:text-primary-700">
                        +{thread.conversations.length - 3} more conversations
                      </button>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Icon name="FileText" size={32} className="mx-auto text-text-muted mb-2" />
                <p className="text-sm text-text-muted">No document threads yet</p>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-[99] lg:hidden"
        onClick={onToggle}
      />
      
      {/* Sidebar */}
      <div className={`
        fixed lg:fixed top-16 left-0 h-[calc(100vh-4rem)] z-100
        ${isCollapsed ? 'w-16' : 'w-80'}
        glass-card border-r border-border
        transform transition-all duration-300 ease-out-smooth
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          {!isCollapsed && (
            <div className="flex items-center space-x-2">
              <Icon name="Zap" size={20} color="var(--color-primary)" />
              <h2 className="text-lg font-heading font-semibold text-text-primary">
                Quick Access
              </h2>
            </div>
          )}
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
              title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              <Icon name={isCollapsed ? 'ChevronRight' : 'ChevronLeft'} size={16} />
            </button>
            
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
              title="Close sidebar"
            >
              <Icon name="X" size={16} />
            </button>
          </div>
        </div>

        {!isCollapsed && (
          <>
            {/* Tabs */}
            <div className="flex border-b border-border">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex-1 flex items-center justify-center space-x-1 px-3 py-3 text-sm font-medium transition-all duration-200
                    ${activeTab === tab.id
                      ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }
                  `}
                >
                  <Icon name={tab.icon} size={16} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.count > 0 && (
                    <span className={`
                      px-1.5 py-0.5 text-xs rounded-full
                      ${activeTab === tab.id
                        ? 'bg-primary-600 text-white' :'bg-surface-secondary text-text-muted'
                      }
                    `}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {renderTabContent()}
            </div>
          </>
        )}

        {/* Collapsed State */}
        {isCollapsed && (
          <div className="p-2">
            <div className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setIsCollapsed(false);
                  }}
                  className={`
                    w-full p-2 rounded-lg transition-all duration-200 relative
                    ${activeTab === tab.id
                      ? 'bg-primary-50 text-primary-600' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }
                  `}
                  title={tab.label}
                >
                  <Icon name={tab.icon} size={20} />
                  
                  {/* Count Badge */}
                  {tab.count > 0 && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary-600 text-white text-xs rounded-full flex items-center justify-center">
                      {tab.count > 9 ? '9+' : tab.count}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default QuickAccessSidebar;