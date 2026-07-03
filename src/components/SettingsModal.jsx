import { HiOutlineX } from 'react-icons/hi';

export default function SettingsModal({ isOpen, onClose }) {
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

        <div className="p-6 text-center">
          <p className="text-sm text-zinc-400 mb-4">
            API key and AI model are configured on the server.
          </p>
          <p className="text-xs text-zinc-600">
            Contact the administrator to change these settings.
          </p>
        </div>

        <div className="p-4 border-t border-surface-border flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-brand-orange text-white text-sm font-medium hover:bg-brand-orange-hover transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}