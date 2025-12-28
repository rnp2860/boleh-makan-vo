// src/components/SmartPill.tsx
import React from 'react';

interface SmartPillProps {
  label: string;
  value: number;
  max: number;
  unit: string;
  isInverse?: boolean; // If true, "Higher is Better" (like Fiber)
}

export const SmartPill = ({ label, value, max, unit, isInverse = false }: SmartPillProps) => {
  // 1. Calculate Percentage
  let percentage = Math.min((value / max) * 100, 100);
  
  // 2. Determine Color (Traffic Light Logic)
  // Standard: Low = Green, High = Red (e.g. Sodium)
  // Inverse: Low = Red, High = Green (e.g. Fiber)
  let colorClass = 'bg-green-500';
  
  if (!isInverse) {
    if (percentage > 85) colorClass = 'bg-red-500 animate-pulse'; // DANGER
    else if (percentage > 50) colorClass = 'bg-yellow-500'; // CAUTION
  } else {
    if (percentage < 50) colorClass = 'bg-red-500'; // NOT ENOUGH FIBER
    else if (percentage < 80) colorClass = 'bg-yellow-500';
    else colorClass = 'bg-green-500';
  }

  return (
    <div className="mb-3">
      {/* Header: Label + Value */}
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-gray-700">{label}</span>
        <span className="font-bold text-gray-900">
          {value} <span className="text-xs text-gray-500">/ {max}{unit}</span>
        </span>
      </div>

      {/* The Bar (The "Limit Line") */}
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden relative">
        {/* The Fill */}
        <div 
          className={`h-full ${colorClass} transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        />
        
        {/* The "Safety Limit" Marker (A tiny white line at 85% to show warning zone) */}
        {!isInverse && (
            <div className="absolute top-0 bottom-0 w-0.5 bg-white opacity-50" style={{ left: '85%' }} />
        )}
      </div>
    </div>
  );
};