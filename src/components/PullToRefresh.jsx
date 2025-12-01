import React, { useState, useEffect, useRef } from 'react';
import { ArrowDown, Loader2 } from 'lucide-react';

const PullToRefresh = ({ onRefresh, children }) => {
  const [startY, setStartY] = useState(0);
  const [currentY, setCurrentY] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const contentRef = useRef(null);
  
  // Configuration
  const PULL_THRESHOLD = 120; // Pixels to pull to trigger refresh
  const MAX_PULL = 200; // Maximum pixels the content can be pulled down
  
  useEffect(() => {
    const content = contentRef.current;
    if (!content) return;

    const handleTouchStart = (e) => {
      if (window.scrollY === 0) {
        setStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e) => {
      const y = e.touches[0].clientY;
      const diff = y - startY;

      // Only enable pull if at the top and pulling down
      if (window.scrollY === 0 && diff > 0 && !refreshing) {
        // Add resistance as the user pulls down (logarithmic)
        const resistance = 0.5;
        const newY = Math.min(diff * resistance, MAX_PULL);
        
        // Prevent default only if we are actually pulling (to avoid blocking normal scroll)
        if (newY > 0) {
            // Note: Preventing default here can be tricky with passive listeners.
            // Modern browsers treat touchmove as passive by default.
            // We'll rely on the visual feedback and user intent.
            setCurrentY(newY);
        }
      }
    };

    const handleTouchEnd = async () => {
      if (currentY > 0) {
        if (currentY > PULL_THRESHOLD * 0.5) { // Threshold to trigger
          setRefreshing(true);
          setCurrentY(60); // Snap to loading position
          
          try {
            await onRefresh();
          } finally {
            // Reset after refresh
            setTimeout(() => {
              setRefreshing(false);
              setCurrentY(0);
            }, 500);
          }
        } else {
          // Did not pull enough, snap back
          setCurrentY(0);
        }
      }
      setStartY(0);
    };

    // We add non-passive listener to prevent scroll if needed, but for simplicity
    // and performance, we'll attach to the specific element
    content.addEventListener('touchstart', handleTouchStart);
    content.addEventListener('touchmove', handleTouchMove);
    content.addEventListener('touchend', handleTouchEnd);

    return () => {
      content.removeEventListener('touchstart', handleTouchStart);
      content.removeEventListener('touchmove', handleTouchMove);
      content.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startY, currentY, refreshing, onRefresh]);

  // Calculate rotation for the arrow
  const rotation = Math.min((currentY / (PULL_THRESHOLD * 0.5)) * 180, 180);

  return (
    <div ref={contentRef} className="relative min-h-screen">
      {/* Loading Indicator Container */}
      <div 
        className="absolute top-0 left-0 w-full flex justify-center items-center pointer-events-none"
        style={{ 
          height: '60px',
          transform: `translateY(${currentY > 0 ? currentY - 60 : -60}px)`,
          opacity: currentY > 0 ? 1 : 0,
          transition: refreshing ? 'transform 0.3s ease' : 'none'
        }}
      >
        <div className="bg-white rounded-full p-2 shadow-md border border-slate-100">
          {refreshing ? (
            <Loader2 className="w-6 h-6 text-red-600 animate-spin" />
          ) : (
            <ArrowDown 
              className="w-6 h-6 text-slate-600" 
              style={{ transform: `rotate(${rotation}deg)`, transition: 'transform 0.1s' }}
            />
          )}
        </div>
      </div>

      {/* Main Content */}
      <div 
        style={{ 
          transform: `translateY(${currentY}px)`,
          transition: currentY === 0 || refreshing ? 'transform 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)' : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default PullToRefresh;
