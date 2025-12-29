// src/components/DateStrip.tsx
'use client';

import React from 'react';

interface DateStripProps {
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
}

export const DateStrip = ({ selectedDate, onSelectDate }: DateStripProps) => {
  // Generate last 5 days + Today + Next 2 days
  const dates = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  for (let i = -5; i <= 2; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dates.push(date);
  }

  const isSameDay = (d1: Date, d2: Date) => {
    return d1.getDate() === d2.getDate() && 
           d1.getMonth() === d2.getMonth() && 
           d1.getFullYear() === d2.getFullYear();
  };

  const isToday = (date: Date) => isSameDay(date, today);
  const isSelected = (date: Date) => isSameDay(date, selectedDate);

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      {dates.map((date, index) => {
        const dayName = date.toLocaleDateString('en-MY', { weekday: 'short' });
        const dayNum = date.getDate();
        const selected = isSelected(date);
        const todayDate = isToday(date);

        return (
          <button 
            key={index}
            onClick={() => onSelectDate(date)}
            className={`
              flex flex-col items-center justify-center min-w-[3.5rem] h-20 rounded-2xl border transition-all
              ${selected 
                ? 'bg-teal-600 text-white border-teal-600 shadow-lg scale-105' 
                : todayDate
                  ? 'bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-300'
                  : 'bg-white text-slate-400 border-slate-100 hover:border-slate-200'}
            `}
          >
            <span className={`text-xs font-medium ${selected ? 'text-teal-100' : ''}`}>{dayName}</span>
            <span className={`text-xl font-bold ${selected ? 'text-white' : todayDate ? 'text-teal-600' : 'text-slate-800'}`}>
              {dayNum}
            </span>
            {todayDate && !selected && (
              <div className="w-1.5 h-1.5 bg-teal-500 rounded-full mt-0.5"></div>
            )}
          </button>
        );
      })}
    </div>
  );
};
