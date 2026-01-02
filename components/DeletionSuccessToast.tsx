// components/DeletionSuccessToast.tsx
// 🗑️ Toast notification for successful account deletion

'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, X } from 'lucide-react';

export default function DeletionSuccessToast() {
  const searchParams = useSearchParams();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Check if redirected after deletion
    if (searchParams.get('deleted') === 'true') {
      setShow(true);
      
      // Auto-hide after 5 seconds
      const timer = setTimeout(() => {
        setShow(false);
        // Clean up the URL
        window.history.replaceState({}, '', '/');
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-bottom-4 fade-in duration-300">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 pr-12 flex items-center gap-3 min-w-[320px]">
        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
          <CheckCircle className="w-5 h-5 text-green-600" />
        </div>
        <div>
          <p className="font-bold text-slate-800 text-sm">Account Deleted</p>
          <p className="text-slate-500 text-xs">Your data has been permanently removed</p>
        </div>
        <button 
          onClick={() => {
            setShow(false);
            window.history.replaceState({}, '', '/');
          }}
          className="absolute top-3 right-3 w-6 h-6 bg-slate-100 hover:bg-slate-200 rounded-full flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4 text-slate-500" />
        </button>
      </div>
    </div>
  );
}

