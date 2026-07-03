import { useEffect, useState } from 'react';
import { HiOutlineX, HiOutlineExclamation } from 'react-icons/hi';

export default function Toast({ message, type = 'error', onDismiss }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onDismiss, 300);
    }, 6000);
    return () => clearTimeout(timer);
  }, [onDismiss]);

  return (
    <div
      className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-3 rounded-xl border shadow-lg transition-all duration-300 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
      } ${
        type === 'error'
          ? 'bg-red-950/90 border-red-800 text-red-200'
          : 'bg-surface-card border-surface-border text-zinc-200'
      }`}
    >
      <HiOutlineExclamation className="w-5 h-5 shrink-0 text-red-400" />
      <span className="text-sm">{message}</span>
      <button
        onClick={() => {
          setVisible(false);
          setTimeout(onDismiss, 300);
        }}
        className="p-1 hover:bg-white/10 rounded-lg transition-colors shrink-0"
      >
        <HiOutlineX className="w-4 h-4" />
      </button>
    </div>
  );
}