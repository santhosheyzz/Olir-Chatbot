import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DocumentPreviewModal = ({ document, isOpen, onClose, onAction }) => {
  const [analysis, setAnalysis] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen && document) {
      const fetchAnalysis = async () => {
        setIsLoading(true);
        try {
          const response = await fetch(`http://localhost:8000/documents/${encodeURIComponent(document.name)}/analysis`);
          if (!response.ok) {
            throw new Error('Failed to fetch analysis');
          }
          const data = await response.json();
          setAnalysis(data);
        } catch (error) {
          console.error("Failed to load analysis:", error);
          setAnalysis({
            summary: "Could not load summary.",
            key_points: ["No key points available."],
            table_of_contents: [{ title: "No table of contents available.", pages: "" }]
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchAnalysis();
    }
  }, [isOpen, document]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.9 }}
          className="bg-white rounded-lg shadow-lg w-full max-w-md"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{document.name}</h2>
            {isLoading ? (
              <div className="flex justify-center items-center py-10">
                <Icon name="Loader" className="animate-spin text-primary-500" size={32} />
              </div>
            ) : (
              analysis && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Summary</h3>
                    <p className="text-sm text-gray-600">{analysis.summary}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Key Points</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
                      {analysis.key_points.map((point, index) => (
                        <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-800 mb-2">Table of Contents</h3>
                    <ul className="space-y-1 text-sm text-gray-600">
                      {analysis.table_of_contents.map((item, index) => (
                        <li key={index} className="flex justify-between">
                          <span>{item.title}</span>
                          <span className="text-gray-500">{item.pages}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )
            )}
          </div>
          <div className="px-6 py-4 bg-gray-50 rounded-b-lg flex justify-end">
            <Button variant="primary" onClick={() => onAction('chat', document)}>
              Chat with this Document
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DocumentPreviewModal;