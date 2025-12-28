// src/components/WeeklyChart.tsx
import React from 'react';

type DayData = {
  day: string;
  calories: number;
  budget: number;
};

export const WeeklyChart = ({ data }: { data: DayData[] }) => {
  const maxVal = Math.max(...data.map(d => d.calories), ...data.map(d => d.budget), 2000);

  return (
    <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 text-sm">Last 7 Days</h3>
        <span className="text-[10px] text-gray-400 uppercase tracking-wider">Calorie Trend</span>
      </div>

      <div className="flex justify-between items-end h-32 gap-2">
        {data.map((d, i) => {
          const isOver = d.calories > d.budget;
          // Calculate height percentage (min 10% so bar is visible)
          const height = Math.max((d.calories / maxVal) * 100, 10);
          
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="relative w-full flex justify-center items-end h-full bg-gray-50 rounded-lg overflow-hidden">
                {/* Budget Line Indicator (Invisible if bar is short, but good for context) */}
                <div 
                  className="absolute w-full border-t border-dashed border-gray-300 z-0" 
                  style={{ bottom: `${(d.budget / maxVal) * 100}%` }} 
                />
                
                {/* The Bar */}
                <div 
                  className={`w-full mx-1 rounded-t-md transition-all duration-500 relative z-10 ${
                    isOver ? 'bg-red-400' : 'bg-blue-400 group-hover:bg-blue-500'
                  }`}
                  style={{ height: `${height}%` }}
                ></div>
              </div>
              <span className={`text-[10px] font-bold ${i === 6 ? 'text-blue-600' : 'text-gray-400'}`}>
                {d.day}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};