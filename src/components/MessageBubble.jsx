export default function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`flex items-start gap-3 max-w-[80%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {!isUser && (
          <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            P
          </div>
        )}

        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? 'bg-brand-orange text-white rounded-br-md'
              : 'bg-surface-card border border-surface-border text-zinc-200 rounded-bl-md'
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div className="whitespace-pre-wrap">
              {message.content || (
                <span className="text-zinc-500 italic">Thinking...</span>
              )}
            </div>
          )}
        </div>

        {isUser && (
          <div className="w-8 h-8 rounded-full bg-orange-700 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
            U
          </div>
        )}
      </div>
    </div>
  );
}