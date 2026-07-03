import MessageList from './MessageList';
import ChatInput from './ChatInput';
import WelcomeScreen from './WelcomeScreen';
import ThinkingIndicator from './ThinkingIndicator';

export default function ChatArea({
  messages,
  isStreaming,
  hasApiKey,
  onSend,
  onPromptClick,
}) {
  const isEmpty = messages.length === 0;

  return (
    <div className="flex-1 flex flex-col h-full min-w-0">
      <div className="border-b border-surface-border px-4 py-3 flex items-center gap-2 shrink-0">
        <div className="w-7 h-7 rounded-lg bg-brand-orange flex items-center justify-center text-white text-xs font-bold">
          P
        </div>
        <span className="text-sm font-medium text-zinc-300">
          President of Exodia
        </span>
        <span className="w-2 h-2 rounded-full bg-green-500 ml-1" />
      </div>

      {isEmpty ? (
        <WelcomeScreen onPromptClick={onPromptClick} />
      ) : (
        <>
          <MessageList messages={messages} />
          {isStreaming && !messages[messages.length - 1]?.content && (
            <div className="px-4">
              <div className="max-w-3xl mx-auto">
                <ThinkingIndicator />
              </div>
            </div>
          )}
        </>
      )}

      <ChatInput
        onSend={onSend}
        disabled={isStreaming || !hasApiKey}
      />
    </div>
  );
}