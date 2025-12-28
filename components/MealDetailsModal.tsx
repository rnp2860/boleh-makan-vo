// src/components/MealDetailsModal.tsx
'use client';

import React from 'react';
import Image from 'next/image';

interface MealDetailsModalProps {
  meal: any; // Using any to be flexible with your data structure
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function MealDetailsModal({ meal, onClose, onDelete }: MealDetailsModalProps) {
  if (!meal) return null;

  // Extract analysis data safely
  // We check meal.data (new format) or fallback to basic properties
  const analysis = meal.data?.analysis_content || meal.analysis || "No detailed analysis available for this meal.";
  const actionable = meal.data?.actionable_advice || [];
  const macros = meal.data?.macros || { 
    calories: meal.calories, 
    protein_g: meal.protein, 
    carbs_g: meal.carbs, 
    fat_g: meal.fat || 0,
    sodium_mg: 0,
    sugar_g: 0
  };
  
  // Format Date
  const dateObj = new Date(meal.timestamp);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in flex flex-col">
        
        {/* HERO IMAGE */}
        <div className="relative h-64 w-full bg-gray-100">
          {meal.image ? (
            <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-6xl">🥗</div>
          )}
          
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/40 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Title Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-6 pt-20">
            <h2 className="text-2xl font-black text-white capitalize leading-tight">{meal.name}</h2>
            <p className="text-white/80 text-sm font-medium">{dateStr} • {timeStr}</p>
          </div>
        </div>

        {/* CONTENT SCROLL AREA */}
        <div className="p-6 space-y-6">
          
          {/* 1. MACRO GRID */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
              <div className="text-[10px] uppercase font-bold text-blue-400">Cal</div>
              <div className="text-lg font-black text-blue-700">{macros.calories}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
              <div className="text-[10px] uppercase font-bold text-green-400">Prot</div>
              <div className="text-lg font-black text-green-700">{macros.protein_g}g</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
              <div className="text-[10px] uppercase font-bold text-orange-400">Carb</div>
              <div className="text-lg font-black text-orange-700">{macros.carbs_g}g</div>
            </div>
            <div className="bg-yellow-50 p-3 rounded-xl border border-yellow-100 text-center">
              <div className="text-[10px] uppercase font-bold text-yellow-400">Fat</div>
              <div className="text-lg font-black text-yellow-700">{macros.fat_g}g</div>
            </div>
          </div>

          {/* 2. DR REZA VERDICT */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 relative overflow-hidden">
             <div className="flex gap-4 items-start relative z-10">
               <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex-shrink-0">
                  <Image 
                    src="/assets/avatar-header.png" 
                    alt="Dr. Reza" 
                    fill 
                    className="object-cover"
                  />
               </div>
               <div>
                 <h3 className="font-bold text-slate-900 text-sm mb-1">Dr. Reza says:</h3>
                 <p className="text-xs text-slate-600 leading-relaxed italic">
                   "{analysis}"
                 </p>
               </div>
             </div>
          </div>

          {/* 3. INGREDIENTS */}
          {meal.components && meal.components.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {meal.components.map((comp: string, i: number) => (
                  <span key={i} className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full border border-gray-200">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. ADVICE (If exists) */}
          {actionable.length > 0 && (
            <div className="bg-teal-50 rounded-2xl p-5 border border-teal-100">
               <h4 className="text-xs font-bold text-teal-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                 ⚡ Quick Tips
               </h4>
               <ul className="space-y-2">
                 {actionable.map((tip: string, i: number) => (
                   <li key={i} className="text-xs text-teal-800 flex gap-2">
                     <span className="font-bold">✓</span> {tip}
                   </li>
                 ))}
               </ul>
            </div>
          )}

          {/* DELETE BUTTON */}
          <button 
            onClick={() => {
              if(confirm('Are you sure you want to delete this meal?')) {
                onDelete(meal.id);
                onClose();
              }
            }}
            className="w-full py-4 text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 rounded-xl transition-colors"
          >
            Delete Meal
          </button>

        </div>
      </div>
    </div>
  );
}