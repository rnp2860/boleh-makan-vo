// src/components/DailyProgress.tsx
'use client';

import React from 'react';

interface DailyProgressProps {
  consumed: number;
  budget: number;
  protein: number;
  carbs: number;
  fat: number;
}

export const DailyProgress = ({ consumed, budget, protein, carbs, fat }: DailyProgressProps) => {
  const percentage = Math.min((consumed / budget) * 100, 100);
  const remaining = budget - consumed;
  const isOver = remaining < 0;
  
  // Calculate macro percentages (rough targets: 30% protein, 40% carbs, 30% fat)
  const totalMacros = protein * 4 + carbs * 4 + fat * 9; // calories from macros
  const proteinPct = totalMacros > 0 ? ((protein * 4) / totalMacros) * 100 : 0;
  const carbsPct = totalMacros > 0 ? ((carbs * 4) / totalMacros) * 100 : 0;
  const fatPct = totalMacros > 0 ? ((fat * 9) / totalMacros) * 100 : 0;

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-slate-800 text-sm">Today's Progress</h3>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${
          isOver ? 'bg-red-100 text-red-600' : 'bg-teal-100 text-teal-600'
        }`}>
          {isOver ? `${Math.abs(remaining)} over` : `${remaining} left`}
        </span>
      </div>
      
      {/* Circular Progress */}
      <div className="flex items-center justify-center mb-5">
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke="#e2e8f0"
              strokeWidth="12"
              fill="none"
            />
            <circle
              cx="64"
              cy="64"
              r="56"
              stroke={isOver ? '#ef4444' : '#14b8a6'}
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${percentage * 3.52} 352`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-800">{consumed}</span>
            <span className="text-[10px] text-slate-400 font-bold uppercase">of {budget} kcal</span>
          </div>
        </div>
      </div>
      
      {/* Macro Bars */}
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-green-600">Protein</span>
            <span className="text-slate-500">{protein}g ({Math.round(proteinPct)}%)</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(proteinPct * 2.5, 100)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-orange-500">Carbs</span>
            <span className="text-slate-500">{carbs}g ({Math.round(carbsPct)}%)</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(carbsPct * 2, 100)}%` }}
            />
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="font-bold text-amber-500">Fat</span>
            <span className="text-slate-500">{fat}g ({Math.round(fatPct)}%)</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(fatPct * 2.5, 100)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

