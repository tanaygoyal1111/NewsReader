import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';

const OfflineNotice = () => {
  const [showOffline, setShowOffline] = useState(false);
  const [showOnline, setShowOnline] = useState(false);

  useEffect(() => {
    // Check initial state
    if (!navigator.onLine) {
      setShowOffline(true);
      const timer = setTimeout(() => setShowOffline(false), 3000);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      setShowOffline(false);
      setShowOnline(true);
      setTimeout(() => setShowOnline(false), 3000);
    };

    const handleOffline = () => {
      setShowOnline(false);
      setShowOffline(true);
      setTimeout(() => setShowOffline(false), 3000);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (showOffline) {
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
        <div className="bg-red-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-red-700">
          <WifiOff className="w-5 h-5" />
          <span className="font-bold text-sm">No Internet Connection</span>
        </div>
      </div>
    );
  }

  if (showOnline) {
    return (
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-bounce-in">
        <div className="bg-green-600 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-3 border border-green-700">
          <Wifi className="w-5 h-5" />
          <span className="font-bold text-sm">Back Online</span>
        </div>
      </div>
    );
  }

  return null;
};

export default OfflineNotice;
