import { useState, useRef, useEffect } from 'react';
import { HiOutlinePaperAirplane } from 'react-icons/hi';

export default function ChatInput({ onSend, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  const handleSend = () => {
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="border-t border-surface-border px-4 py-3">
      <div className="max-w-3xl mx-auto flex items-end gap-2 bg-surface-input rounded-2xl border border-surface-border px-4 py-2 focus-within:border-brand-orange transition-colors">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Message the President..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent text-white text-sm resize-none outline-none placeholder:text-zinc-500 py-2 max-h-40"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !input.trim()}
          className="p-2 rounded-xl bg-brand-orange text-white hover:bg-brand-orange-hover disabled:opacity-40 disabled:cursor-not-allowed transition-all shrink-0 mb-1"
        >
          <HiOutlinePaperAirplane className="w-4 h-4" />
        </button>
      </div>
      <p className="text-center text-xs text-zinc-600 mt-2">
        Office of the President may produce inaccurate information. Verify important facts.
      </p>
    </div>
  );
}