// src/components/DateStrip.tsx
'use client';

import React from 'react';

export const DateStrip = () => {
  // Generate last 5 days + Today + Next 2 days
  const dates = [];
  const today = new Date();
  
  for (let i = -5; i <= 2; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-4 px-4 scrollbar-hide">
      {dates.map((date, index) => {
        const isToday = date.getDate() === today.getDate();
        const dayName = date.toLocaleDateString('en-MY', { weekday: 'short' }); // Mon, Tue
        const dayNum = date.getDate();

        return (
          <div 
            key={index}
            className={`
              flex flex-col items-center justify-center min-w-[3.5rem] h-20 rounded-2xl border transition-all cursor-pointer
              ${isToday 
                ? 'bg-blue-600 text-white border-blue-600 shadow-lg scale-105' 
                : 'bg-white text-gray-400 border-gray-100 hover:border-blue-200'}
            `}
          >
            <span className="text-xs font-medium">{dayName}</span>
            <span className={`text-xl font-bold ${isToday ? 'text-white' : 'text-gray-800'}`}>
              {dayNum}
            </span>
          </div>
        );
      })}
    </div>
  );
};