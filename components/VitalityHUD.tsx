// src/components/VitalityHUD.tsx
import React from 'react';
import { SmartPill } from './SmartPill';

interface VitalityHUDProps {
  data: any; // The raw JSON from Dr. Reza
  isVerified: boolean;
}

export const VitalityHUD = ({ data, isVerified }: VitalityHUDProps) => {
  const macros = data.macros;
  
  // 🏥 MALAYSIAN MOH DAILY LIMITS (Hardcoded for V1)
  const LIMITS = {
    calories: 2000,
    sodium: 2000, // Renal Danger Line
    sugar: 50,    // Diabetes Danger Line
    protein: 60,  // Target (Higher is good)
    fiber: 25     // Target (Higher is good)
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      
      {/* 1. Header Section */}
      <div className="bg-blue-600 p-4 text-white">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold capitalize">{data.food_name}</h2>
            <div className="flex items-center gap-1 text-xs opacity-90 mt-1">
               {isVerified ? (
                 <span className="bg-green-500 text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                   ✓ Verified Anchor
                 </span>
               ) : (
                 <span className="bg-yellow-500 text-black px-2 py-0.5 rounded-full font-bold">
                   ⚠️ AI Estimate
                 </span>
               )}
            </div>
          </div>
          <div className="text-right">
             <div className="text-3xl font-black">{macros.calories}</div>
             <div className="text-xs opacity-75">kcal</div>
          </div>
        </div>
      </div>

      {/* 2. Dr. Reza's Comment Bubble */}
      <div className="p-4 bg-blue-50 border-b border-blue-100">
        <div className="flex gap-3">
           <div className="text-2xl">👨‍⚕️</div>
           <p className="text-sm text-blue-900 italic">"{data.description}"</p>
        </div>
      </div>

      {/* 3. The Vitality Metrics (The Pills) */}
      <div className="p-5 space-y-4">
        
        {/* THE BIG KILLERS (Sodium & Sugar) */}
        <div className="p-3 bg-red-50 rounded-lg border border-red-100">
            <h3 className="text-xs font-bold text-red-800 uppercase mb-3 tracking-wider">⚠️ Kidney & Diabetes Watch</h3>
            <SmartPill label="Sodium (Salt)" value={macros.sodium_mg} max={LIMITS.sodium} unit="mg" />
            <SmartPill label="Sugar" value={macros.sugar_g} max={LIMITS.sugar} unit="g" />
        </div>

        {/* THE FUEL (Protein & Fiber) */}
        <div className="p-3 bg-green-50 rounded-lg border border-green-100">
            <h3 className="text-xs font-bold text-green-800 uppercase mb-3 tracking-wider">💪 Nutrition Goals</h3>
            <SmartPill label="Protein" value={macros.protein_g} max={LIMITS.protein} unit="g" isInverse={true} />
            <SmartPill label="Fiber" value={macros.fiber_g} max={LIMITS.fiber} unit="g" isInverse={true} />
        </div>

      </div>

      {/* 4. Component List (The Nasi Campur Breakdown) */}
      {data.components && data.components.length > 0 && (
        <div className="px-5 pb-5">
           <p className="text-xs font-bold text-gray-400 uppercase mb-2">Detected Components:</p>
           <div className="flex flex-wrap gap-2">
             {data.components.map((item: string, i: number) => (
               <span key={i} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded border">
                 {item}
               </span>
             ))}
           </div>
        </div>
      )}

    </div>
  );
};