import { useState, useEffect } from 'react';
import { HiOutlineX, HiOutlineKey, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { useLocalStorage } from '../hooks/useLocalStorage';

const MODELS = [
  { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini (Fast)' },
  { id: 'openai/gpt-4o', label: 'GPT-4o (Powerful)' },
  { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { id: 'google/gemini-2.0-flash', label: 'Gemini 2.0 Flash' },
];

export default function SettingsModal({ isOpen, onClose }) {
  const [apiKey, setApiKey] = useLocalStorage('exodia-api-key', '');
  const [model, setModel] = useLocalStorage('exodia-model', 'openai/gpt-4o-mini');
  const [showKey, setShowKey] = useState(false);
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
              OpenRouter API Key
            </label>
            <div className="relative">
              <HiOutlineKey className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input
                type={showKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setSaved(false);
                }}
                placeholder="sk-or-v1-..."
                className="w-full bg-surface-input border border-surface-border rounded-xl pl-10 pr-10 py-2.5 text-sm text-white outline-none focus:border-brand-orange transition-colors"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? (
                  <HiOutlineEyeOff className="w-4 h-4" />
                ) : (
                  <HiOutlineEye className="w-4 h-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-zinc-600 mt-1.5">
              Get your key at{' '}
              <a
                href="https://openrouter.ai/keys"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-orange hover:underline"
              >
                openrouter.ai/keys
              </a>
            </p>
          </div>

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
            Stored locally in your browser
          </p>
          <button
            onClick={() => {
              setSaved(true);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-hover transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}