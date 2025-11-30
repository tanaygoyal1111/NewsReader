import React from 'react';
import { RefreshCw, X } from 'lucide-react';

const NotificationToast = ({ onRefresh, onClose }) => {
  return (
    <div className="fixed top-24 right-6 z-50 animate-bounce-in">
      <div className="bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 border border-slate-700">
        <div className="flex flex-col">
          <span className="font-bold text-sm">New articles available</span>
          <span className="text-xs text-slate-400">Click refresh to see them</span>
        </div>
        <div className="flex items-center gap-2 border-l border-slate-700 pl-4">
          <button 
            onClick={onRefresh}
            className="flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs font-bold transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            REFRESH
          </button>
          <button 
            onClick={onClose}
            className="p-1 hover:bg-slate-800 rounded-full transition-colors text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
