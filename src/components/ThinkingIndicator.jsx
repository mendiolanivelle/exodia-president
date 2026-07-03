export default function ThinkingIndicator() {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="w-8 h-8 rounded-full bg-brand-orange flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
        P
      </div>
      <div className="bg-surface-card border border-surface-border rounded-2xl rounded-bl-md px-4 py-3">
        <div className="flex items-center gap-1.5 py-1">
          <span className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse-dot" style={{ animationDelay: '0s' }} />
          <span className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse-dot" style={{ animationDelay: '0.2s' }} />
          <span className="w-2 h-2 bg-zinc-500 rounded-full animate-pulse-dot" style={{ animationDelay: '0.4s' }} />
        </div>
      </div>
    </div>
  );
}