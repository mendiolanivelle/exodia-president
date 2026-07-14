import { useState } from 'react';
import {
  HiOutlineChatAlt2,
  HiOutlineBookOpen,
  HiOutlineChevronDown,
  HiOutlineChevronRight,
  HiOutlineMenu,
  HiOutlinePlus,
  HiOutlineCog,
  HiOutlineX,
} from 'react-icons/hi';

export default function Sidebar({
  isOpen,
  activeView,
  onSelectView,
  onToggle,
  onNewChat,
  onOpenSettings,
}) {
  const [mancomExpanded, setMancomExpanded] = useState(false);

  const itemClass = (view) =>
    `w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${
      activeView === view
        ? 'bg-brand-orange text-white'
        : 'text-zinc-400 hover:bg-surface-input hover:text-white'
    }`;

  const subItemClass = (view) =>
    `w-full flex items-center gap-2 pl-10 pr-3 py-2 rounded-lg text-sm transition-colors ${
      activeView === view
        ? 'bg-brand-orange text-white'
        : 'text-zinc-400 hover:bg-surface-input hover:text-white'
    }`;

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-30 h-full bg-surface-card border-r border-surface-border flex flex-col transition-transform duration-300 ease-in-out w-72 lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-surface-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-orange flex items-center justify-center text-white font-bold text-sm">
              E
            </div>
            <span className="font-semibold text-white">Exodia President</span>
          </div>
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg hover:bg-surface-input text-zinc-400 hover:text-white transition-colors lg:hidden"
          >
            <HiOutlineX className="w-5 h-5" />
          </button>
        </div>

        <div className="p-3 space-y-1">
          <button
            onClick={() => onSelectView('chat')}
            className={itemClass('chat')}
          >
            <HiOutlineChatAlt2 className="w-4 h-4" />
            Chat
          </button>

          <button
            onClick={() => setMancomExpanded((v) => !v)}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-zinc-400 hover:bg-surface-input hover:text-white transition-colors"
          >
            <HiOutlineBookOpen className="w-4 h-4" />
            <span className="flex-1 text-left">Management Committee Meeting</span>
            {mancomExpanded ? (
              <HiOutlineChevronDown className="w-4 h-4" />
            ) : (
              <HiOutlineChevronRight className="w-4 h-4" />
            )}
          </button>

          {mancomExpanded && (
            <button
              onClick={() => onSelectView('doc')}
              className={subItemClass('doc')}
            >
              Mancom Program Template
            </button>
          )}

          <button
            onClick={() => {
              onSelectView('chat');
              onNewChat();
            }}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg border border-surface-border hover:bg-surface-input text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <HiOutlinePlus className="w-4 h-4" />
            New Chat
          </button>
        </div>

        <div className="flex-1" />

        <div className="p-3 border-t border-surface-border space-y-1">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg hover:bg-surface-input text-sm text-zinc-400 hover:text-white transition-colors"
          >
            <HiOutlineCog className="w-4 h-4" />
            Settings
          </button>
          <p className="text-center text-xs text-zinc-600 pt-1">
            Office of the President v1.0
          </p>
        </div>
      </aside>

      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed top-4 left-4 z-20 p-2 rounded-lg bg-surface-card border border-surface-border text-zinc-400 hover:text-white hover:bg-surface-input transition-colors"
        >
          <HiOutlineMenu className="w-5 h-5" />
        </button>
      )}
    </>
  );
}