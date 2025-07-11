import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const FilterSidebar = ({ isOpen, onToggle, filters, onFiltersChange, className = '' }) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const documentTypes = [
    { id: 'all', label: 'All Documents', icon: 'Files' },
    { id: 'pdf', label: 'PDF Files', icon: 'FileText' },
    { id: 'docx', label: 'Word Documents', icon: 'FileText' },
    { id: 'youtube', label: 'YouTube Transcripts', icon: 'Youtube' }
  ];

  const dateRanges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
    { id: 'quarter', label: 'Last 3 Months' },
    { id: 'year', label: 'This Year' },
    { id: 'custom', label: 'Custom Range' }
  ];

  const sortOptions = [
    { id: 'recent', label: 'Most Recent', icon: 'Clock' },
    { id: 'oldest', label: 'Oldest First', icon: 'Calendar' },
    { id: 'messages', label: 'Most Messages', icon: 'MessageCircle' },
    { id: 'duration', label: 'Longest Duration', icon: 'Timer' },
    { id: 'alphabetical', label: 'Alphabetical', icon: 'AlphabeticalSort' }
  ];

  const handleFilterChange = (key, value) => {
    const updatedFilters = { ...localFilters, [key]: value };
    setLocalFilters(updatedFilters);
    onFiltersChange(updatedFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      documentType: 'all',
      dateRange: 'all',
      sortBy: 'recent',
      showFavorites: false,
      customDateFrom: '',
      customDateTo: ''
    };
    setLocalFilters(resetFilters);
    onFiltersChange(resetFilters);
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
        fixed lg:fixed top-16 right-0 h-[calc(100vh-4rem)] w-80 z-100
        glass-card border-l border-border
        transform transition-all duration-300 ease-out-smooth
        ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center space-x-2">
            <Icon name="Filter" size={20} color="var(--color-primary)" />
            <h2 className="text-lg font-heading font-semibold text-text-primary">
              Filters & Sort
            </h2>
          </div>
          
          <button
            onClick={onToggle}
            className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-all duration-200"
            title="Close filters"
          >
            <Icon name="X" size={16} />
          </button>
        </div>

        {/* Filter Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Quick Filters */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Quick Filters</h3>
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={localFilters.showFavorites}
                  onChange={(e) => handleFilterChange('showFavorites', e.target.checked)}
                  className="w-4 h-4 text-primary-600 bg-surface border-border rounded focus:ring-primary-500 focus:ring-2"
                />
                <Icon name="Star" size={16} color="var(--color-warning-500)" />
                <span className="text-sm text-text-secondary">Favorites Only</span>
              </label>
            </div>
          </div>

          {/* Document Type Filter */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Document Type</h3>
            <div className="space-y-2">
              {documentTypes.map((type) => (
                <label key={type.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="documentType"
                    value={type.id}
                    checked={localFilters.documentType === type.id}
                    onChange={(e) => handleFilterChange('documentType', e.target.value)}
                    className="w-4 h-4 text-primary-600 bg-surface border-border focus:ring-primary-500 focus:ring-2"
                  />
                  <Icon name={type.icon} size={16} color="var(--color-text-secondary)" />
                  <span className="text-sm text-text-secondary">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Date Range Filter */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Date Range</h3>
            <div className="space-y-2">
              {dateRanges.map((range) => (
                <label key={range.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="dateRange"
                    value={range.id}
                    checked={localFilters.dateRange === range.id}
                    onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    className="w-4 h-4 text-primary-600 bg-surface border-border focus:ring-primary-500 focus:ring-2"
                  />
                  <span className="text-sm text-text-secondary">{range.label}</span>
                </label>
              ))}
            </div>

            {/* Custom Date Range */}
            {localFilters.dateRange === 'custom' && (
              <div className="mt-3 space-y-2">
                <Input
                  type="date"
                  placeholder="From date"
                  value={localFilters.customDateFrom}
                  onChange={(e) => handleFilterChange('customDateFrom', e.target.value)}
                  className="text-sm"
                />
                <Input
                  type="date"
                  placeholder="To date"
                  value={localFilters.customDateTo}
                  onChange={(e) => handleFilterChange('customDateTo', e.target.value)}
                  className="text-sm"
                />
              </div>
            )}
          </div>

          {/* Sort Options */}
          <div>
            <h3 className="text-sm font-medium text-text-primary mb-3">Sort By</h3>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.id} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="sortBy"
                    value={option.id}
                    checked={localFilters.sortBy === option.id}
                    onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    className="w-4 h-4 text-primary-600 bg-surface border-border focus:ring-primary-500 focus:ring-2"
                  />
                  <Icon name={option.icon} size={16} color="var(--color-text-secondary)" />
                  <span className="text-sm text-text-secondary">{option.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-border space-y-2">
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            fullWidth
            onClick={handleReset}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;