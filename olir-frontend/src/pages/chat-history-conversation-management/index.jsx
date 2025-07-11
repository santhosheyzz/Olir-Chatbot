import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import QuickAccessSidebar from './components/QuickAccessSidebar';
import FilterSidebar from './components/FilterSidebar';
import SearchBar from './components/SearchBar';
import ConversationList from './components/ConversationList';
import ExportModal from './components/ExportModal';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { listChatSessions, deleteChatSession } from '../../api/chatHistory';

const ChatHistoryConversationManagement = () => {
  const navigate = useNavigate();
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickAccess, setShowQuickAccess] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [selectedConversationForExport, setSelectedConversationForExport] = useState(null);
  const [filters, setFilters] = useState({
    documentType: 'all',
    dateRange: 'all',
    sortBy: 'recent',
    showFavorites: false,
    customDateFrom: '',
    customDateTo: ''
  });

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await listChatSessions();

        const mapped = data.map((chat) => {
          const firstMessage = chat.messages[0]?.content || "New Chat";
          return {
            id: chat.id,
            firstQuestion: firstMessage,
            lastMessage: chat.messages[chat.messages.length - 1]?.content || "",
            date: chat.updated_at,
            tags: [],
            documentSources: [], // You can enhance this later with PDF metadata
            isFavorite: false,
            messageCount: chat.messages.length,
            duration: `${Math.max(1, Math.floor(chat.messages.length / 2))} min`
          };
        });

        setConversations(mapped);
      } catch (err) {
        console.error("Failed to fetch chat history:", err);
      } finally {
        setLoading(false);
      }
    };

    // Initial fetch
    fetchHistory();

    // Set up polling interval
    const pollInterval = setInterval(fetchHistory, 5000); // Poll every 5 seconds

    // Cleanup interval on component unmount
    return () => clearInterval(pollInterval);
  }, []); // Empty dependency array since we want this to run only once on mount

  // Filter and search conversations
  useEffect(() => {
    let filtered = [...conversations];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(conv =>
        conv.firstQuestion.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()) ||
        conv.documentSources.some(doc => 
          doc.name.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        conv.tags.some(tag => 
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply document type filter
    if (filters.documentType !== 'all') {
      filtered = filtered.filter(conv =>
        conv.documentSources.some(doc => doc.type === filters.documentType)
      );
    }

    // Apply favorites filter
    if (filters.showFavorites) {
      filtered = filtered.filter(conv => conv.isFavorite);
    }

    // Apply date range filter
    if (filters.dateRange !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'quarter':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        case 'custom':
          if (filters.customDateFrom && filters.customDateTo) {
            const fromDate = new Date(filters.customDateFrom);
            const toDate = new Date(filters.customDateTo);
            filtered = filtered.filter(conv => {
              const convDate = new Date(conv.date);
              return convDate >= fromDate && convDate <= toDate;
            });
          }
          break;
      }
      
      if (filters.dateRange !== 'custom') {
        filtered = filtered.filter(conv => new Date(conv.date) >= filterDate);
      }
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case 'messages':
        filtered.sort((a, b) => b.messageCount - a.messageCount);
        break;
      case 'duration':
        filtered.sort((a, b) => {
          const getDurationMinutes = (duration) => {
            const match = duration.match(/(\d+)\s*min/);
            return match ? parseInt(match[1]) : 0;
          };
          return getDurationMinutes(b.duration) - getDurationMinutes(a.duration);
        });
        break;
      case 'alphabetical':
        filtered.sort((a, b) => a.firstQuestion.localeCompare(b.firstQuestion));
        break;
    }

    setFilteredConversations(filtered);
  }, [conversations, searchQuery, filters]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  const handleFiltersChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleContinueConversation = (conversationId) => {
    navigate(`/main-chat-interface?conversation=${conversationId}`);
  };

  const handleExportConversation = (conversationId) => {
    const conversation = conversations.find(conv => conv.id === conversationId);
    setSelectedConversationForExport(conversation);
    setShowExportModal(true);
  };

  const handleDeleteConversation = async (conversationId) => {
    if (window.confirm('Are you sure you want to delete this conversation? This action cannot be undone.')) {
      try {
        await deleteChatSession(conversationId);
        setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      } catch (error) {
        console.error("Failed to delete conversation:", error);
        alert("Failed to delete conversation. Please try again.");
      }
    }
  };

  const handleToggleFavorite = (conversationId) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === conversationId
          ? { ...conv, isFavorite: !conv.isFavorite }
          : conv
      )
    );
  };

 const handleExport = async (exportData) => {
  const conversation = conversations.find(c => c.id === exportData.conversationId);
  const fileName = exportData.fileName || `chat_${conversation.id}`;
  const content = JSON.stringify(conversation, null, 2);

  let blob;
  switch (exportData.format) {
    case 'json':
      blob = new Blob([content], { type: 'application/json' });
      break;
    case 'txt':
      blob = new Blob([content], { type: 'text/plain' });
      break;
    case 'markdown':
      const markdown = conversation.messages
        .map(msg => `**${msg.role.toUpperCase()}**: ${msg.content}`).join('\n\n');
      blob = new Blob([markdown], { type: 'text/markdown' });
      break;
    default:
      blob = new Blob([content], { type: 'application/json' });
  }

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${fileName}.${exportData.format}`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  setShowExportModal(false);
};
  const handleConversationSelect = (conversationId) => {
    handleContinueConversation(conversationId);
  };

  // Prepare data for quick access sidebar
  const favoriteConversations = conversations.filter(conv => conv.isFavorite);
  const recentSessions = conversations.slice(0, 5);
  const documentThreads = conversations.reduce((acc, conv) => {
    conv.documentSources.forEach(doc => {
      const existingThread = acc.find(thread => thread.documentName === doc.name);
      if (existingThread) {
        existingThread.conversations.push(conv);
      } else {
        acc.push({
          documentId: doc.name,
          documentName: doc.name,
          documentType: doc.type,
          conversations: [conv]
        });
      }
    });
    return acc;
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Quick Access Sidebar */}
      <QuickAccessSidebar
        isOpen={showQuickAccess}
        onToggle={() => setShowQuickAccess(!showQuickAccess)}
        favoriteConversations={favoriteConversations}
        recentSessions={recentSessions}
        documentThreads={documentThreads}
        onConversationSelect={handleConversationSelect}
      />

      {/* Filter Sidebar */}
      <FilterSidebar
        isOpen={showFilters}
        onToggle={() => setShowFilters(!showFilters)}
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />

      {/* Main Content */}
      <main className={`
        pt-16 transition-all duration-300
        ${showQuickAccess ? 'lg:pl-80' : ''}
        ${showFilters ? 'lg:pr-80' : ''}
      `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-heading font-bold text-text-primary mb-2">
                  Chat History & Conversation Management
                </h1>
                <p className="text-text-secondary">
                  Review, organize, and continue your previous study sessions with the AI assistant
                </p>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  iconName="Zap"
                  onClick={() => setShowQuickAccess(!showQuickAccess)}
                  className="lg:hidden"
                >
                  Quick Access
                </Button>
                
                <Button
                  variant="outline"
                  iconName="Filter"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  Filters
                </Button>
                
                <Button
                  variant="primary"
                  iconName="MessageCircle"
                  onClick={() => navigate('/main-chat-interface')}
                >
                  New Chat
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div className="glass-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="MessageCircle" size={20} color="var(--color-primary)" />
                  <div>
                    <p className="text-sm text-text-muted">Total Conversations</p>
                    <p className="text-xl font-semibold text-text-primary">{conversations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Star" size={20} color="var(--color-warning-500)" />
                  <div>
                    <p className="text-sm text-text-muted">Favorites</p>
                    <p className="text-xl font-semibold text-text-primary">{favoriteConversations.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="FileText" size={20} color="var(--color-accent)" />
                  <div>
                    <p className="text-sm text-text-muted">Documents Used</p>
                    <p className="text-xl font-semibold text-text-primary">{documentThreads.length}</p>
                  </div>
                </div>
              </div>
              
              <div className="glass-card p-4 rounded-lg border border-border">
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={20} color="var(--color-success)" />
                  <div>
                    <p className="text-sm text-text-muted">Total Study Time</p>
                    <p className="text-xl font-semibold text-text-primary">
                      {conversations.reduce((total, conv) => {
                        const minutes = parseInt(conv.duration.match(/(\d+)/)?.[1] || 0);
                        return total + minutes;
                      }, 0)} min
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <SearchBar
              onSearch={handleSearch}
              searchQuery={searchQuery}
              onClear={handleClearSearch}
              className="mb-6"
            />
          </div>

          {/* Conversation List */}
          <ConversationList
            conversations={filteredConversations}
            loading={loading}
            onContinue={handleContinueConversation}
            onExport={handleExportConversation}
            onDelete={handleDeleteConversation}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
          />
        </div>
      </main>

      {/* Export Modal */}
      <ExportModal
        isOpen={showExportModal}
        onClose={() => setShowExportModal(false)}
        conversation={selectedConversationForExport}
        onExport={handleExport}
      />

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-text-muted">
              Built by Santhoshkumar and Team at OLIR Institution • © {new Date().getFullYear()}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ChatHistoryConversationManagement;

