// src/components/DynamicAvatar.tsx
import React from 'react';

export const DynamicAvatar = ({ current, max }: { current: number; max: number }) => {
  const percentage = (current / max) * 100;
  
  // 1. Determine State Logic
  // 🚨 UPDATED PATH: Removed '/assets'. Now it is just '/avatar/...'
  let imageSrc = '/avatar/state_2.png'; 
  let message = "Jom makan!";
  let animation = "";
  let textColor = "text-blue-600";

  if (percentage < 40) {
    // STATE 1: Skinny
    imageSrc = '/avatar/state_1.png';
    message = "Lapar gila boss...";
    textColor = "text-yellow-600";
    animation = "animate-pulse"; 
  } else if (percentage < 85) {
    // STATE 2: Fit
    imageSrc = '/avatar/state_2.png';
    message = "Steady! Keep it up.";
    textColor = "text-green-600";
    animation = "animate-bounce"; 
  } else if (percentage <= 100) {
    // STATE 3: Full
    imageSrc = '/avatar/state_3.png';
    message = "Alhamdulillah, kenyang.";
    textColor = "text-blue-600";
  } else if (percentage <= 120) {
    // STATE 4: Bloated
    imageSrc = '/avatar/state_4.png';
    message = "Aiyo, perut buncit!";
    textColor = "text-orange-600";
    animation = "animate-wiggle"; 
  } else {
    // STATE 5: Food Coma (JPG)
    imageSrc = '/avatar/state_5.jpg'; 
    message = "FOOD COMA. TOLONG!";
    textColor = "text-red-600";
    animation = "animate-spin-slow"; 
  }

  return (
    <div className="flex flex-col items-center justify-center relative w-full h-40">
      
      {/* Speech Bubble */}
      <div className={`absolute -top-2 z-20 bg-white border border-gray-100 shadow-sm px-4 py-1.5 rounded-full ${animation}`}>
        <p className={`text-xs font-black ${textColor} uppercase tracking-wider`}>
          {message}
        </p>
        <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rotate-45 border-b border-r border-gray-100"></div>
      </div>

      {/* The Character */}
      <div className="relative w-32 h-32 mt-4 transition-all duration-500">
        {/* Glow Effect for Overeating */}
        {percentage > 100 && (
          <div className="absolute inset-0 bg-red-500 blur-2xl opacity-20 rounded-full animate-pulse"></div>
        )}
        
        {/* USING STANDARD IMG TAG FOR DEBUGGING RELIABILITY
           If this works, we can switch back to Next/Image later.
        */}
        <img 
          src={imageSrc} 
          alt="Avatar Status" 
          className={`w-full h-full object-contain drop-shadow-xl transition-all duration-500 ${percentage > 100 ? 'scale-110' : 'scale-100'}`}
        />
      </div>

      {/* Progress Label */}
      <p className="text-[10px] text-gray-400 font-bold mt-1 bg-gray-50 px-2 py-0.5 rounded">
        {Math.round(percentage)}% Full
      </p>
    </div>
  );
};