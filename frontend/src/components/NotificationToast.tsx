import React, { useEffect } from 'react';
import { CheckCircle, Info, X } from 'lucide-react';

interface NotificationToastProps {
  message: string | null;
  onClose: () => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({ message, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => onClose(), 4000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 glass-panel border border-[var(--accent-gold)] p-4 rounded-2xl shadow-2xl animate-fade-in flex items-center gap-3 max-w-sm">
      <div className="p-2 rounded-full bg-[var(--accent-gold-glow)] text-[var(--accent-gold)]">
        <CheckCircle className="w-5 h-5" />
      </div>
      
      <p className="text-xs font-bold text-[var(--text-primary)] flex-1 leading-snug">
        {message}
      </p>

      <button onClick={onClose} className="text-[var(--text-muted)] hover:text-white p-1">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
