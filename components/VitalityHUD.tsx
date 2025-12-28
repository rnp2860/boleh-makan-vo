// src/components/VitalityHUD.tsx
import React from 'react';

export const VitalityHUD = ({ data, isVerified, imageSrc }: { data: any, isVerified: boolean, imageSrc?: string | null }) => {
  const macros = data.macros;
  
  return (
    <div className="bg-blue-600 rounded-3xl p-6 text-white shadow-xl shadow-blue-200 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>

      <div className="flex items-center gap-4 mb-6 relative z-10">
        
        {/* THIS IS THE IMAGE CONTAINER */}
        <div className="h-16 w-16 bg-white/20 rounded-2xl overflow-hidden border-2 border-white/30 flex-shrink-0">
          {imageSrc ? (
            <img src={imageSrc} alt="Scanned" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full flex items-center justify-center text-2xl">📸</div>
          )}
        </div>

        <div>
           <div className="flex items-center gap-2 mb-1">
             <span className="bg-blue-500/50 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider border border-blue-400/30">
               {isVerified ? 'Verified' : 'AI Analysis'}
             </span>
           </div>
           <h2 className="text-2xl font-black leading-tight capitalize">{data.food_name}</h2>
        </div>
      </div>
      {/* ... macros grid ... */}
      <div className="grid grid-cols-4 gap-2 relative z-10">
        {/* ... (keep your existing macro grid code here) ... */}
        <div className="bg-blue-700/50 p-3 rounded-2xl text-center backdrop-blur-sm">
           <p className="text-[10px] text-blue-200 font-bold uppercase">Cal</p>
           <p className="text-xl font-black">{macros.calories}</p>
        </div>
        <div className="bg-blue-700/30 p-3 rounded-2xl text-center backdrop-blur-sm border border-white/5">
           <p className="text-[10px] text-blue-200 font-bold uppercase">Prot</p>
           <p className="text-lg font-bold">{macros.protein_g}g</p>
        </div>
        <div className="bg-blue-700/30 p-3 rounded-2xl text-center backdrop-blur-sm border border-white/5">
           <p className="text-[10px] text-blue-200 font-bold uppercase">Carb</p>
           <p className="text-lg font-bold">{macros.carbs_g}g</p>
        </div>
        <div className="bg-blue-700/30 p-3 rounded-2xl text-center backdrop-blur-sm border border-white/5">
           <p className="text-[10px] text-blue-200 font-bold uppercase">Fat</p>
           <p className="text-lg font-bold">{macros.fat_g}g</p>
        </div>
      </div>
    </div>
  );
};