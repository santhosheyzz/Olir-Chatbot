import React from 'react';
import { motion } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const DocumentAnalytics = ({ documents, isVisible }) => {
  // Calculate analytics data
  const totalDocuments = documents.length;
  const completedDocuments = documents.filter(doc => doc.trainingStatus === 'completed').length;
  const processingDocuments = documents.filter(doc => doc.trainingStatus === 'processing').length;
  const failedDocuments = documents.filter(doc => doc.trainingStatus === 'failed').length;
  
  const totalSize = documents.reduce((sum, doc) => sum + (doc.size || 0), 0);
  const totalQueries = documents.reduce((sum, doc) => sum + (doc.queryCount || 0), 0);
  
  // Most queried documents
  const mostQueried = documents
    .filter(doc => doc.queryCount > 0)
    .sort((a, b) => (b.queryCount || 0) - (a.queryCount || 0))
    .slice(0, 5);

  // Document type distribution
  const typeDistribution = documents.reduce((acc, doc) => {
    const type = doc.type.toLowerCase();
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  const pieData = Object.entries(typeDistribution).map(([type, count]) => ({
    name: type.toUpperCase(),
    value: count,
    color: getTypeColor(type)
  }));

  // Training status over time (mock data for demo)
  const trainingData = [
    { month: 'Jan', completed: 12, failed: 2 },
    { month: 'Feb', completed: 18, failed: 1 },
    { month: 'Mar', completed: 25, failed: 3 },
    { month: 'Apr', completed: 32, failed: 2 },
    { month: 'May', completed: 28, failed: 1 },
    { month: 'Jun', completed: 35, failed: 4 }
  ];

  function getTypeColor(type) {
    const colors = {
      pdf: '#ef4444',
      docx: '#3b82f6',
      txt: '#10b981',
      youtube: '#f59e0b'
    };
    return colors[type] || '#6b7280';
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 300 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 300 }}
      transition={{ duration: 0.3 }}
      className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-80 glass-card border-l border-border overflow-y-auto z-50"
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-heading font-semibold text-text-primary">
            Analytics
          </h2>
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
        </div>

        {/* Overview Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="glass-card p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <Icon name="FileText" size={16} color="var(--color-primary)" />
              <span className="text-xs text-text-muted">Total Docs</span>
            </div>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {totalDocuments}
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
              <span className="text-xs text-text-muted">Trained</span>
            </div>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {completedDocuments}
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <Icon name="HardDrive" size={16} color="var(--color-accent)" />
              <span className="text-xs text-text-muted">Storage</span>
            </div>
            <p className="text-sm font-semibold text-text-primary mt-1">
              {formatFileSize(totalSize)}
            </p>
          </div>
          
          <div className="glass-card p-3 rounded-lg border border-border">
            <div className="flex items-center space-x-2">
              <Icon name="MessageCircle" size={16} color="var(--color-warning)" />
              <span className="text-xs text-text-muted">Queries</span>
            </div>
            <p className="text-xl font-semibold text-text-primary mt-1">
              {totalQueries}
            </p>
          </div>
        </div>

        {/* Training Status */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Training Status</h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success-500 rounded-full"></div>
                <span className="text-sm text-text-secondary">Completed</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {completedDocuments}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
                <span className="text-sm text-text-secondary">Processing</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {processingDocuments}
              </span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-error-500 rounded-full"></div>
                <span className="text-sm text-text-secondary">Failed</span>
              </div>
              <span className="text-sm font-medium text-text-primary">
                {failedDocuments}
              </span>
            </div>
          </div>
        </div>

        {/* Document Types */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Document Types</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={50}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {pieData.map((entry, index) => (
              <div key={index} className="flex items-center space-x-1">
                <div 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: entry.color }}
                ></div>
                <span className="text-xs text-text-muted">
                  {entry.name} ({entry.value})
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Most Queried Documents */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Most Queried</h3>
          <div className="space-y-2">
            {mostQueried.length > 0 ? (
              mostQueried.map((doc, index) => (
                <div key={doc.id} className="flex items-center space-x-2">
                  <span className="text-xs text-text-muted w-4">
                    #{index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-text-primary truncate">
                      {doc.name}
                    </p>
                  </div>
                  <span className="text-xs text-text-muted">
                    {doc.queryCount}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-text-muted">No queries yet</p>
            )}
          </div>
        </div>

        {/* Training Progress Over Time */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-text-primary mb-3">Training History</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={trainingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: 'var(--color-text-muted)' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'var(--color-surface)',
                    border: '1px solid var(--color-border)',
                    borderRadius: '8px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="completed" fill="var(--color-success)" />
                <Bar dataKey="failed" fill="var(--color-error)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Storage Usage */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Storage Usage</h3>
          <div className="glass-card p-3 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-text-muted">Used</span>
              <span className="text-xs text-text-primary">
                {formatFileSize(totalSize)} / 1 GB
              </span>
            </div>
            <div className="w-full bg-surface-secondary rounded-full h-2">
              <div 
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((totalSize / (1024 * 1024 * 1024)) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-text-muted mt-1">
              {Math.round((totalSize / (1024 * 1024 * 1024)) * 100)}% of storage used
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DocumentAnalytics;