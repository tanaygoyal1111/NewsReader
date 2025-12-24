import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const Toast = ({ id, message, type, onClose }) => {
  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  const icons = {
    success: <CheckCircle className="w-5 h-5 text-green-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${styles[type]} min-w-[300px] animate-slide-in`}>
      {icons[type]}
      <p className="flex-grow text-sm font-medium">{message}</p>
      <button onClick={() => onClose(id)} className="p-1 hover:bg-black/5 rounded-full transition-colors">
        <X className="w-4 h-4 opacity-60" />
      </button>
    </div>
  );
};

export default Toast;
