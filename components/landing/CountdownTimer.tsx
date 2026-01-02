'use client';

// 🌙 Ramadan Countdown Timer Component

import React, { useState, useEffect } from 'react';

// Ramadan 2026 start date (approximate - Feb 28, 2026)
const RAMADAN_START = new Date('2026-02-28T00:00:00+08:00');

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = RAMADAN_START.getTime() - now.getTime();
      
      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };
    
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  if (!isClient) {
    return (
      <div className="flex items-center justify-center gap-4">
        <div className="animate-pulse bg-amber-200 rounded-xl w-20 h-24" />
        <div className="animate-pulse bg-amber-200 rounded-xl w-20 h-24" />
        <div className="animate-pulse bg-amber-200 rounded-xl w-20 h-24" />
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center gap-3 sm:gap-4">
      <TimeUnit value={timeLeft.days} label="Hari" />
      <Separator />
      <TimeUnit value={timeLeft.hours} label="Jam" />
      <Separator />
      <TimeUnit value={timeLeft.minutes} label="Minit" />
      <Separator className="hidden sm:block" />
      <TimeUnit value={timeLeft.seconds} label="Saat" className="hidden sm:flex" />
    </div>
  );
}

function TimeUnit({ 
  value, 
  label, 
  className = '' 
}: { 
  value: number; 
  label: string; 
  className?: string;
}) {
  return (
    <div className={`flex flex-col items-center ${className}`}>
      <div className="relative">
        <div className="bg-gradient-to-b from-amber-100 to-amber-50 rounded-xl px-4 py-3 sm:px-5 sm:py-4 
                        border border-amber-200 shadow-sm min-w-[60px] sm:min-w-[72px]">
          <span className="text-2xl sm:text-3xl font-bold text-amber-800 tabular-nums">
            {String(value).padStart(2, '0')}
          </span>
        </div>
        {/* Subtle pulse animation */}
        <div className="absolute inset-0 rounded-xl bg-amber-400/10 animate-pulse pointer-events-none" />
      </div>
      <span className="text-xs sm:text-sm font-medium text-amber-700 mt-2">{label}</span>
    </div>
  );
}

function Separator({ className = '' }: { className?: string }) {
  return (
    <div className={`flex flex-col items-center justify-center h-full ${className}`}>
      <span className="text-2xl font-bold text-amber-400">:</span>
    </div>
  );
}

export default CountdownTimer;

