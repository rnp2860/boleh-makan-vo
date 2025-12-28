// src/components/MobileLayout.tsx
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export const MobileLayout = ({ children }: MobileLayoutProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path ? 'text-blue-600' : 'text-gray-400';

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center">
      <div className="w-full max-w-md bg-white min-h-screen shadow-2xl relative flex flex-col">
        
        {/* MAIN CONTENT - Grow to fill space */}
        <div className="flex-1 overflow-y-auto pb-24"> 
           {/* Added pb-24 so content doesn't get hidden behind the nav bar */}
          {children}
        </div>

        {/* BOTTOM NAV */}
        <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-20 flex justify-around items-end pb-4 z-50">
          
          {/* 1. DIARY */}
          <Link href="/" className={`flex flex-col items-center gap-1 w-16 ${isActive('/')}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-[10px] font-bold">Diary</span>
          </Link>

          {/* 2. SCAN (Floating Button) */}
          <Link href="/check-food" className="relative -top-6">
            <div className="bg-blue-600 rounded-full h-16 w-16 flex items-center justify-center shadow-lg border-4 border-white transform transition-transform active:scale-95">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </Link>

          {/* 3. PROFILE */}
          <Link href="/profile" className={`flex flex-col items-center gap-1 w-16 ${isActive('/profile')}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-[10px] font-bold">Me</span>
          </Link>

        </div>
      </div>
    </div>
  );
};