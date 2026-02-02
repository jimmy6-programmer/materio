// components/LoadingSpinner.tsx
import React from 'react';

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner - Modern and smooth */}
        <div className="w-12 h-12 border-4 border-brand-navy/20 border-t-brand-navy rounded-full animate-spin"></div>
        
        {/* Optional: Text */}
        <p className="text-brand-navy font-medium text-lg animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}