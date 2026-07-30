import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface ToastProps {
  message: string | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed top-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900 border border-emerald-500/60 shadow-2xl text-white text-xs font-semibold animate-in slide-in-from-right duration-200">
      <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white cursor-pointer">
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
