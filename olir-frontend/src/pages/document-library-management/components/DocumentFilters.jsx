import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const DocumentFilters = ({ 
  filters, 
  onFiltersChange, 
  viewMode, 
  onViewModeChange,
  selectedCount,
  onBulkAction,
  onClearFilters 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const filterOptions = {
    type: [
      { value: 'all', label: 'All Types', icon: 'File' },
      { value: 'pdf', label: 'PDF', icon: 'FileText' },
      { value: 'docx', label: 'Word', icon: 'FileText' },
      { value: 'txt', label: 'Text', icon: 'File' },
      { value: 'youtube', label: 'YouTube', icon: 'Youtube' }
    ],
    status: [
      { value: 'all', label: 'All Status', icon: 'Circle' },
      { value: 'completed', label: 'Completed', icon: 'CheckCircle' },
      { value: 'processing', label: 'Processing', icon: 'Clock' },
      { value: 'failed', label: 'Failed', icon: 'XCircle' },
      { value: 'pending', label: 'Pending', icon: 'Circle' }
    ],
    sortBy: [
      { value: 'name', label: 'Name' },
      { value: 'uploadDate', label: 'Upload Date' },
      { value: 'size', label: 'File Size' },
      { value: 'queryCount', label: 'Usage' },
      { value: 'lastAccessed', label: 'Last Accessed' }
    ],
    sortOrder: [
      { value: 'asc', label: 'Ascending', icon: 'ArrowUp' },
      { value: 'desc', label: 'Descending', icon: 'ArrowDown' }
    ]
  };

  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const handleSearch = (value) => {
    onFiltersChange({
      ...filters,
      search: value
    });
  };

  const getActiveFiltersCount = () => {
    let count = 0;
    if (filters.type !== 'all') count++;
    if (filters.status !== 'all') count++;
    if (filters.search) count++;
    return count;
  };

  return (
    <div className="glass-card border border-border rounded-lg p-4 mb-6">
      {/* Top Row - Search, View Mode, Bulk Actions */}
      <div className="flex items-center justify-between mb-4">
        {/* Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon 
              name="Search" 
              size={16} 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-muted" 
            />
            <Input
              type="search"
              placeholder="Search documents..."
              value={filters.search || ''}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 mx-4">
          <Button
            variant={viewMode === 'grid' ? 'primary' : 'ghost'}
            size="sm"
            iconName="Grid3X3"
            onClick={() => onViewModeChange('grid')}
          />
          <Button
            variant={viewMode === 'list' ? 'primary' : 'ghost'}
            size="sm"
            iconName="List"
            onClick={() => onViewModeChange('list')}
          />
        </div>

        {/* Bulk Actions */}
        {selectedCount > 0 && (
          <div className="flex items-center space-x-2">
            <span className="text-sm text-text-muted">
              {selectedCount} selected
            </span>
            <Button
              variant="outline"
              size="sm"
              iconName="RefreshCw"
              onClick={() => onBulkAction('retrain')}
            >
              Retrain
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Download"
              onClick={() => onBulkAction('download')}
            >
              Download
            </Button>
            <Button
              variant="outline"
              size="sm"
              iconName="Trash2"
              onClick={() => onBulkAction('delete')}
              className="text-error-600 hover:text-error-700"
            >
              Delete
            </Button>
          </div>
        )}

        {/* Filter Toggle */}
        <Button
          variant="ghost"
          size="sm"
          iconName={isExpanded ? 'ChevronUp' : 'ChevronDown'}
          onClick={() => setIsExpanded(!isExpanded)}
          className="ml-2"
        >
          Filters
          {getActiveFiltersCount() > 0 && (
            <span className="ml-1 px-1.5 py-0.5 bg-primary-500 text-white text-xs rounded-full">
              {getActiveFiltersCount()}
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="pt-4 border-t border-border">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* File Type Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                File Type
              </label>
              <div className="space-y-1">
                {filterOptions.type.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('type', option.value)}
                    className={`
                      w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${filters.type === option.value
                        ? 'bg-primary-50 text-primary-600 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }
                    `}
                  >
                    <Icon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Training Status
              </label>
              <div className="space-y-1">
                {filterOptions.status.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('status', option.value)}
                    className={`
                      w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${filters.status === option.value
                        ? 'bg-primary-50 text-primary-600 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }
                    `}
                  >
                    <Icon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sort By
              </label>
              <div className="space-y-1">
                {filterOptions.sortBy.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('sortBy', option.value)}
                    className={`
                      w-full flex items-center px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${filters.sortBy === option.value
                        ? 'bg-primary-50 text-primary-600 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">
                Sort Order
              </label>
              <div className="space-y-1">
                {filterOptions.sortOrder.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleFilterChange('sortOrder', option.value)}
                    className={`
                      w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all duration-200
                      ${filters.sortOrder === option.value
                        ? 'bg-primary-50 text-primary-600 border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                      }
                    `}
                  >
                    <Icon name={option.icon} size={16} />
                    <span>{option.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Clear Filters */}
          {getActiveFiltersCount() > 0 && (
            <div className="mt-4 pt-4 border-t border-border">
              <Button
                variant="ghost"
                size="sm"
                iconName="X"
                onClick={onClearFilters}
              >
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentFilters;