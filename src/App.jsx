import { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { useChat } from './hooks/useChat';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {
    messages,
    isStreaming,
    error,
    send,
    clearChat,
    clearError,
    loadMessages,
  } = useChat();

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const handleNewChat = useCallback(() => {
    clearChat();
  }, [clearChat]);

  const handlePromptClick = useCallback(
    (prompt) => {
      send(prompt);
    },
    [send],
  );

  return (
    <div className="h-screen flex bg-surface-dark text-white overflow-hidden">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        onNewChat={handleNewChat}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'ml-0'
        }`}
      >
        <ChatArea
          messages={messages}
          isStreaming={isStreaming}
          onSend={send}
          onPromptClick={handlePromptClick}
        />
      </main>

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />

      {error && (
        <Toast message={error} onDismiss={clearError} />
      )}
    </div>
  );
}