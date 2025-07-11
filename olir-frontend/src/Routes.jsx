import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import MainChatInterface from "pages/main-chat-interface";
import DocumentUploadTraining from "pages/document-upload-training";
import ChatHistoryConversationManagement from "pages/chat-history-conversation-management";
import SettingsPreferences from "pages/settings-preferences";
import DocumentLibraryManagement from "pages/document-library-management";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<MainChatInterface />} />
        <Route path="/main-chat-interface" element={<MainChatInterface />} />
        <Route path="/document-upload-training" element={<DocumentUploadTraining />} />
        <Route path="/chat-history-conversation-management" element={<ChatHistoryConversationManagement />} />
        <Route path="/settings-preferences" element={<SettingsPreferences />} />
        <Route path="/document-library-management" element={<DocumentLibraryManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;