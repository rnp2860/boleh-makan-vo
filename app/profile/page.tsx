// src/app/profile/page.tsx
'use client';

import { useFood } from '@/context/FoodContext';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { userProfile, setGoal, toggleCondition, updateDetails, dailyBudget, setManualOverride, setUserName } = useFood();
  const router = useRouter();

  // 🛡️ FIX: Handle the case where profile hasn't loaded yet
  // This satisfies TypeScript by ensuring userProfile exists before we use it
  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-400 font-bold animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  // Now it is safe to access properties because we passed the check above
  const isGoal = (g: string) => userProfile.goal === g;
  const hasCondition = (c: string) => userProfile.healthConditions.includes(c);
  const { details, manualOverride } = userProfile;

  return (
    <div className="min-h-screen bg-gray-50 pb-32 p-6 font-sans">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black text-gray-800 tracking-tight">Your Profile</h1>
        <button 
          onClick={() => router.push('/')} 
          className="bg-white px-4 py-2 rounded-xl text-sm font-bold text-gray-600 shadow-sm border border-gray-100"
        >
          Done
        </button>
      </div>

      {/* 1. NAME */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Name</label>
        <input 
          value={userProfile.name} 
          onChange={(e) => setUserName(e.target.value)} 
          className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-300"
          placeholder="Your Name"
        />
      </div>

      {/* 2. PHYSICAL STATS */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Age</label>
           <input 
             type="number" 
             value={details.age} 
             onChange={(e) => updateDetails({ age: Number(e.target.value) })}
             className="w-full text-2xl font-black text-gray-800 outline-none" 
           />
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Gender</label>
           <div className="flex bg-gray-100 rounded-lg p-1">
             <button onClick={() => updateDetails({ gender: 'male' })} className={`flex-1 py-1 rounded-md text-xs font-bold ${details.gender === 'male' ? 'bg-white shadow text-blue-600' : 'text-gray-400'}`}>Male</button>
             <button onClick={() => updateDetails({ gender: 'female' })} className={`flex-1 py-1 rounded-md text-xs font-bold ${details.gender === 'female' ? 'bg-white shadow text-pink-500' : 'text-gray-400'}`}>Fem</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Height (cm)</label>
           <input 
             type="number" 
             value={details.height} 
             onChange={(e) => updateDetails({ height: Number(e.target.value) })}
             className="w-full text-2xl font-black text-gray-800 outline-none" 
           />
        </div>
        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">Weight (kg)</label>
           <input 
             type="number" 
             value={details.weight} 
             onChange={(e) => updateDetails({ weight: Number(e.target.value) })}
             className="w-full text-2xl font-black text-gray-800 outline-none" 
           />
        </div>
      </div>

      {/* 3. HEALTH GOAL */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Health Goal</label>
        <div className="grid grid-cols-3 gap-2">
           <button onClick={() => setGoal('lose_weight')} className={`py-3 rounded-xl text-xs font-bold border transition-all ${isGoal('lose_weight') ? 'bg-green-100 border-green-500 text-green-700 ring-2 ring-green-500/20' : 'bg-gray-50 border-transparent text-gray-400'}`}>Turun Berat</button>
           <button onClick={() => setGoal('maintain')} className={`py-3 rounded-xl text-xs font-bold border transition-all ${isGoal('maintain') ? 'bg-blue-100 border-blue-500 text-blue-700 ring-2 ring-blue-500/20' : 'bg-gray-50 border-transparent text-gray-400'}`}>Kekal Sihat</button>
           <button onClick={() => setGoal('build_muscle')} className={`py-3 rounded-xl text-xs font-bold border transition-all ${isGoal('build_muscle') ? 'bg-purple-100 border-purple-500 text-purple-700 ring-2 ring-purple-500/20' : 'bg-gray-50 border-transparent text-gray-400'}`}>Bina Otot</button>
        </div>
      </div>

      {/* 4. ACTIVITY */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block">Activity Level</label>
        <div className="space-y-2">
          {['sedentary', 'light', 'moderate', 'active'].map((level) => (
             <button 
               key={level} 
               onClick={() => updateDetails({ activity: level as any })}
               className={`w-full text-left p-3 rounded-xl text-xs font-bold capitalize border transition-all ${details.activity === level ? 'bg-orange-50 border-orange-200 text-orange-700' : 'bg-gray-50 border-transparent text-gray-400'}`}
             >
               {level}
             </button>
          ))}
        </div>
      </div>

      {/* 5. MANUAL OVERRIDE */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-4">
         <div className="flex justify-between items-center mb-2">
           <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Daily Calorie Target</label>
           <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">Auto: {dailyBudget}</span>
         </div>
         <input 
           type="number" 
           placeholder="Auto (Tap to set manual)" 
           value={manualOverride || ''}
           onChange={(e) => setManualOverride(e.target.value ? Number(e.target.value) : null)}
           className="w-full text-xl font-bold text-gray-800 outline-none placeholder-gray-300" 
         />
         <p className="text-[10px] text-gray-400 mt-2">Leave empty to calculate automatically based on your stats.</p>
      </div>

      {/* 6. CONDITIONS */}
      <div className="mb-8">
        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 block px-2">Health Conditions</label>
        <div className="flex flex-wrap gap-2">
          {['Diabetes', 'High Blood Pressure', 'High Cholesterol'].map(c => (
            <button key={c} onClick={() => toggleCondition(c)} className={`px-4 py-2 rounded-full text-xs font-bold border transition-all ${hasCondition(c) ? 'bg-red-500 border-red-500 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>

    </div>
  );
}