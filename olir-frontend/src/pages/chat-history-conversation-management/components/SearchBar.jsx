import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const SearchBar = ({ onSearch, searchQuery, onClear, className = '' }) => {
  const [localQuery, setLocalQuery] = useState(searchQuery || '');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    setLocalQuery(searchQuery || '');
  }, [searchQuery]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (localQuery !== searchQuery) {
        setIsSearching(true);
        onSearch(localQuery);
        setTimeout(() => setIsSearching(false), 300);
      }
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [localQuery, searchQuery, onSearch]);

  const handleClear = () => {
    setLocalQuery('');
    onClear();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      onSearch(localQuery);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Icon 
          name="Search" 
          size={20} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
        />
        
        <Input
          type="search"
          placeholder="Search conversations, questions, or document names..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          className="pl-10 pr-20 py-3 text-sm bg-surface border-border focus:border-primary-300 focus:ring-primary-200"
        />

        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {isSearching && (
            <div className="animate-spin">
              <Icon name="Loader2" size={16} color="var(--color-primary)" />
            </div>
          )}
          
          {localQuery && (
            <Button
              variant="ghost"
              size="xs"
              iconName="X"
              onClick={handleClear}
              className="text-text-muted hover:text-text-primary"
            />
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {localQuery && (
        <div className="absolute top-full left-0 right-0 mt-1 glass-card border border-border rounded-lg shadow-lg z-50">
          <div className="p-2">
            <div className="text-xs text-text-muted mb-2 px-2">Search suggestions</div>
            <div className="space-y-1">
              {[
                'machine learning fundamentals',
                'data structures algorithms',
                'statistics probability',
                'research methodology'
              ].filter(suggestion => 
                suggestion.toLowerCase().includes(localQuery.toLowerCase())
              ).slice(0, 4).map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setLocalQuery(suggestion);
                    onSearch(suggestion);
                  }}
                  className="w-full text-left px-2 py-1 text-sm text-text-secondary hover:text-text-primary hover:bg-surface-secondary rounded transition-colors duration-200"
                >
                  <Icon name="Search" size={14} className="inline mr-2" />
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;