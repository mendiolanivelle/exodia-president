import { useState, useEffect } from 'react';
import { HiOutlineX } from 'react-icons/hi';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MODELS = [
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
  { id: 'openai/gpt-4o', label: 'GPT-4o (Powerful)' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
];

export default function SettingsModal({ isOpen, onClose }) {
  const [model, setModel] = useLocalStorage('exodia-model', 'openai/gpt-4o-mini');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (saved) {
      const timer = setTimeout(() => setSaved(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [saved]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-surface-card border border-surface-border rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <h2 className="font-semibold text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-surface-input text-zinc-400 hover:text-white transition-colors"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <label className="block text-sm text-zinc-400 mb-1.5 font-medium">
              Model
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-surface-input border border-surface-border rounded-xl px-3 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-colors appearance-none cursor-pointer"
            >
              {MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-4 border-t border-surface-border flex items-center justify-between">
          <p className="text-xs text-zinc-500">
            API key is configured on the server
          </p>
          <button
            onClick={() => {
              setSaved(true);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-hover transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}