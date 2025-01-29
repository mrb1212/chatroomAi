import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

export function Toast({ message, type, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const backgrounds = {
    success: 'bg-green-500/10 border-green-500',
    error: 'bg-red-500/10 border-red-500',
    info: 'bg-blue-500/10 border-blue-500',
  };

  return (
    <div
      className={`fixed bottom-4 left-4 p-4 rounded-lg border ${backgrounds[type]} flex items-center gap-3 max-w-md animate-slide-up`}
      role="alert"
    >
      {icons[type]}
      <p className="flex-1">{message}</p>
      <button
        onClick={onClose}
        className="p-1 hover:bg-white/10 rounded-full"
        aria-label="Close"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}