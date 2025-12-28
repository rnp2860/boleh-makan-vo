// src/app/profile/page.tsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useFood } from '@/context/FoodContext';

export default function ProfilePage() {
  const { userProfile, setGoal, toggleCondition, updateDetails, dailyBudget, setManualOverride, setUserName } = useFood();

  const isGoal = (g: string) => userProfile.goal === g;
  const hasCondition = (c: string) => userProfile.healthConditions.includes(c);
  const { details, manualOverride } = userProfile;
  
  // Check if we have enough data to calculate
  const hasDetails = details.weight > 0 && details.height > 0 && details.age > 0;

  return (
    <div className="p-6 pb-24 min-h-screen bg-gray-50">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-8">
        <div className="h-16 w-16 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-blue-50">
          <Image 
            src="/assets/avatar-header.png" 
            alt="Dr. Reza Profile" 
            fill 
            className="object-cover"
          />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900">Dr. Reza</h1>
          <p className="text-sm text-gray-500">Kira Betul-Betul (Precision)</p>
        </div>
      </div>

      {/* 1. PERSONAL DETAILS */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <h2 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-widest flex justify-between items-center">
          <span>Butiran Diri (Details)</span>
          {hasDetails && !manualOverride && <span className="text-[10px] bg-green-100 text-green-700 px-2 py-1 rounded-full">Auto-Calc On</span>}
        </h2>
        
        {/* NAME INPUT */}
        <div className="mb-4">
          <label className="text-xs font-bold text-gray-500 mb-1 block">Nama / Nickname</label>
          <input 
            type="text" 
            value={userProfile.name === 'Dr. Reza User' ? '' : userProfile.name} 
            onChange={(e) => setUserName(e.target.value)}
            placeholder="Dr. Reza User"
            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-gray-800"
          />
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Berat (Weight) kg</label>
            <input 
              type="number" 
              value={details.weight || ''} 
              onChange={(e) => updateDetails({ weight: Number(e.target.value) })}
              placeholder="0"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-gray-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Tinggi (Height) cm</label>
            <input 
              type="number" 
              value={details.height || ''} 
              onChange={(e) => updateDetails({ height: Number(e.target.value) })}
              placeholder="0"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-gray-800"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Umur (Age)</label>
            <input 
              type="number" 
              value={details.age || ''} 
              onChange={(e) => updateDetails({ age: Number(e.target.value) })}
              placeholder="0"
              className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-blue-500 outline-none font-bold text-gray-800"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-gray-500 mb-1 block">Jantina (Gender)</label>
            <div className="flex bg-gray-50 rounded-xl p-1 border border-gray-200">
              <button 
                onClick={() => updateDetails({ gender: 'male' })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${details.gender === 'male' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}
              >Male</button>
              <button 
                onClick={() => updateDetails({ gender: 'female' })}
                className={`flex-1 py-2 rounded-lg text-sm font-bold transition-all ${details.gender === 'female' ? 'bg-white shadow-sm text-pink-500' : 'text-gray-400'}`}
              >Female</button>
            </div>
          </div>
        </div>

        {/* MANUAL OVERRIDE */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2 block">
            Tetapkan Sendiri (Manual Override)
          </label>
          <div className="flex gap-2">
            <input 
              type="number"
              value={manualOverride || ''}
              onChange={(e) => setManualOverride(e.target.value ? Number(e.target.value) : null)}
              placeholder="Custom (e.g. 1800)"
              className={`flex-1 p-3 rounded-xl border outline-none font-bold transition-all ${manualOverride ? 'border-purple-500 bg-purple-50 text-purple-700' : 'border-gray-200 bg-gray-50 text-gray-500'}`}
            />
            {manualOverride && (
              <button 
                onClick={() => setManualOverride(null)}
                className="px-4 py-2 bg-red-100 text-red-600 rounded-xl font-bold text-xs hover:bg-red-200 transition-colors"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* RESULT BOX */}
        <div className={`mt-4 p-4 rounded-xl border flex justify-between items-center animate-fade-in ${
          manualOverride 
            ? 'bg-purple-50 border-purple-200' 
            : (hasDetails ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200')
        }`}>
          <div>
             <p className={`text-xs font-bold uppercase ${manualOverride ? 'text-purple-600' : (hasDetails ? 'text-blue-600' : 'text-gray-500')}`}>
               {manualOverride ? 'Manual Limit Set' : (hasDetails ? 'Recommended Limit' : 'Standard Estimate')}
             </p>
             <p className={`text-[10px] ${manualOverride ? 'text-purple-400' : (hasDetails ? 'text-blue-400' : 'text-gray-400')}`}>
               {manualOverride ? 'Ignoring calculator' : (hasDetails ? 'Formula: Mifflin-St Jeor' : 'Generic Adult Baseline')}
             </p>
          </div>
          <div className={`text-3xl font-black ${manualOverride ? 'text-purple-700' : (hasDetails ? 'text-blue-700' : 'text-gray-700')}`}>
            {dailyBudget} <span className="text-sm font-medium">kcal / day</span>
          </div>
        </div>
      </div>

      {/* 2. GOAL SECTION */}
      <h2 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Apa Matlamat? (Goal)</h2>
      <div className="grid grid-cols-3 gap-2 mb-8">
        
        {/* GOAL 1: LOSE WEIGHT */}
        <button 
          onClick={() => setGoal('lose_weight')}
          disabled={!!manualOverride}
          className={`
            p-3 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center justify-center gap-2 h-36
            ${isGoal('lose_weight') && !manualOverride 
              ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            } 
            ${manualOverride ? 'opacity-40 cursor-not-allowed grayscale' : ''}
          `}
        >
          {/* 👇 INCREASED SIZE: w-14 h-14 */}
          <div className="w-14 h-14 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-weight-loss.png" 
              alt="Lose Weight" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="text-center">
             <div className={`font-bold text-sm leading-tight ${isGoal('lose_weight') ? 'text-blue-700' : 'text-gray-700'}`}>Nak Kurus</div>
             <div className="text-[10px] text-gray-400 mt-1">Deficit -500 kcal</div>
          </div>
        </button>

        {/* GOAL 2: MAINTAIN */}
        <button 
          onClick={() => setGoal('maintain')}
          disabled={!!manualOverride}
          className={`
            p-3 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center justify-center gap-2 h-36
            ${isGoal('maintain') && !manualOverride 
              ? 'border-green-500 bg-green-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            } 
            ${manualOverride ? 'opacity-40 cursor-not-allowed grayscale' : ''}
          `}
        >
          <div className="w-14 h-14 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-maintain.png" 
              alt="Maintain" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="text-center">
             <div className={`font-bold text-sm leading-tight ${isGoal('maintain') ? 'text-green-700' : 'text-gray-700'}`}>Maintain Je</div>
             <div className="text-[10px] text-gray-400 mt-1">Kekal Berat</div>
          </div>
        </button>

         {/* GOAL 3: BUILD MUSCLE */}
         <button 
          onClick={() => setGoal('build_muscle')}
          disabled={!!manualOverride}
          className={`
            p-3 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center justify-center gap-2 h-36
            ${isGoal('build_muscle') && !manualOverride 
              ? 'border-purple-500 bg-purple-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            } 
            ${manualOverride ? 'opacity-40 cursor-not-allowed grayscale' : ''}
          `}
        >
          <div className="w-14 h-14 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-muscle.png" 
              alt="Build Muscle" 
              fill 
              className="object-contain"
            />
          </div>
          <div className="text-center">
             <div className={`font-bold text-sm leading-tight ${isGoal('build_muscle') ? 'text-purple-700' : 'text-gray-700'}`}>Kasi Sado</div>
             <div className="text-[10px] text-gray-400 mt-1">Surplus +300 kcal</div>
          </div>
        </button>
      </div>

      {/* 3. CONDITIONS SECTION */}
      <h2 className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Pantang Larang (Conditions)</h2>
      <div className="grid grid-cols-2 gap-3">
        
        {/* CONDITION 1: DIABETES */}
        <button 
          onClick={() => toggleCondition('diabetes')}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center gap-2 text-center relative
            ${hasCondition('diabetes') 
              ? 'border-red-500 bg-red-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            }
          `}
        >
          {hasCondition('diabetes') && <div className="absolute top-2 right-2 text-red-500 text-xs animate-fade-in">✅</div>}
          {/* 👇 INCREASED SIZE: w-16 h-16 */}
          <div className="w-16 h-16 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-diabetes.png" 
              alt="Diabetes" 
              fill 
              className="object-contain"
            />
          </div>
          <div className={`font-bold text-sm ${hasCondition('diabetes') ? 'text-red-700' : 'text-gray-700'}`}>Potong Gula</div>
        </button>

        {/* CONDITION 2: HYPERTENSION */}
        <button 
          onClick={() => toggleCondition('hypertension')}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center gap-2 text-center relative
            ${hasCondition('hypertension') 
              ? 'border-orange-500 bg-orange-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            }
          `}
        >
          {hasCondition('hypertension') && <div className="absolute top-2 right-2 text-orange-500 text-xs animate-fade-in">✅</div>}
          <div className="w-16 h-16 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-kurang-masin.png" 
              alt="Hypertension" 
              fill 
              className="object-contain"
            />
          </div>
          <div className={`font-bold text-sm ${hasCondition('hypertension') ? 'text-orange-700' : 'text-gray-700'}`}>Kurang Masin</div>
        </button>

        {/* CONDITION 3: CHOLESTEROL */}
        <button 
          onClick={() => toggleCondition('cholesterol')}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center gap-2 text-center relative
            ${hasCondition('cholesterol') 
              ? 'border-yellow-500 bg-yellow-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            }
          `}
        >
          {hasCondition('cholesterol') && <div className="absolute top-2 right-2 text-yellow-500 text-xs animate-fade-in">✅</div>}
          <div className="w-16 h-16 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-tak-nak-minyak.png" 
              alt="Cholesterol" 
              fill 
              className="object-contain"
            />
          </div>
          <div className={`font-bold text-sm ${hasCondition('cholesterol') ? 'text-yellow-700' : 'text-gray-700'}`}>Tak Nak Minyak</div>
        </button>

        {/* CONDITION 4: KIDNEY */}
        <button 
          onClick={() => toggleCondition('kidney')}
          className={`
            p-4 rounded-2xl border-2 transition-all duration-300 ease-out flex flex-col items-center gap-2 text-center relative
            ${hasCondition('kidney') 
              ? 'border-blue-500 bg-blue-50 shadow-md scale-105' 
              : 'border-gray-100 bg-white hover:scale-105 hover:shadow-sm'
            }
          `}
        >
          {hasCondition('kidney') && <div className="absolute top-2 right-2 text-blue-500 text-xs animate-fade-in">✅</div>}
          <div className="w-16 h-16 relative drop-shadow-sm">
            <Image 
              src="/assets/icon-jaga-kidney.png" 
              alt="Kidney" 
              fill 
              className="object-contain"
            />
          </div>
          <div className={`font-bold text-sm ${hasCondition('kidney') ? 'text-blue-700' : 'text-gray-700'}`}>Jaga Kidney</div>
        </button>
      </div>
    </div>
  );
}