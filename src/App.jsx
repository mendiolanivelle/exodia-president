import { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import GuidePage from './components/GuidePage';
import ObjectionAssistantPage from './components/ObjectionAssistantPage';
import SettingsModal from './components/SettingsModal';
import Toast from './components/Toast';
import { useChat } from './hooks/useChat';

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeView, setActiveView] = useState('chat');
  const {
    messages,
    isStreaming,
    error,
    send,
    clearChat,
    clearError,
  } = useChat();

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
        activeView={activeView}
        onSelectView={setActiveView}
        onToggle={() => setSidebarOpen((v) => !v)}
        onNewChat={handleNewChat}
        onOpenSettings={() => setSettingsOpen(true)}
      />

      <main
        className={`flex-1 flex flex-col min-w-0 h-full transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-72' : 'ml-0'
        }`}
      >
        {activeView === 'guide' ? (
          <GuidePage />
        ) : activeView === 'objections' ? (
          <ObjectionAssistantPage />
        ) : (
          <ChatArea
            messages={messages}
            isStreaming={isStreaming}
            onSend={send}
            onPromptClick={handlePromptClick}
          />
        )}
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
