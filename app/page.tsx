// src/app/page.tsx
'use client';

import { useState } from 'react'; // 👈 Added useState
import Link from 'next/link';
import Image from 'next/image';
import { DateStrip } from '@/components/DateStrip';
import { WeeklyChart } from '@/components/WeeklyChart';
import MealDetailsModal from '@/components/MealDetailsModal'; // 👈 Added Import
import { useFood } from '@/context/FoodContext';

export default function HomePage() {
  const { stats, meals, userProfile, dailyBudget, deleteMeal, getWeeklyStats, streak } = useFood();
  const [selectedMeal, setSelectedMeal] = useState<any>(null); // 👈 State for Modal
  
  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-24 h-24 relative mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl animate-bounce">
          <Image 
            src="/assets/avatar-header.png" 
            alt="Dr. Reza" 
            fill 
            className="object-cover" 
          />
        </div>
        <div className="text-blue-600 font-bold animate-pulse">Loading Dr. Reza...</div>
      </div>
    );
  }

  const budget = dailyBudget || 2000;
  const rawRemaining = budget - stats.calories;
  const isOverBudget = rawRemaining < 0;
  const progressPercent = Math.min((stats.calories / budget) * 100, 100);

  // Avatar Logic
  const ratio = stats.calories / budget;
  let currentStage = 1;

  if (ratio >= 1) {
    currentStage = 5; 
  } else {
    currentStage = Math.floor(ratio * 4) + 1;
    currentStage = Math.min(Math.max(currentStage, 1), 4);
  }

  const getGoalLabel = () => {
    if (userProfile.goal === 'lose_weight') return "Nak Kurus";
    if (userProfile.goal === 'build_muscle') return "Kasi Sado";
    return "Maintain Je";
  };

  const firstName = userProfile.name ? userProfile.name.split(' ')[0] : 'User';
  
  // CHART LOGIC
  const weeklyData = getWeeklyStats();
  const daysTrackedCount = weeklyData.filter(day => day.calories > 0).length;
  const isChartUnlocked = daysTrackedCount >= 3;
  const daysRemainingToUnlock = 3 - daysTrackedCount;

  const sortedMeals = [...meals].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  const getTimeGap = (current: Date, previous: Date) => {
    const diffMs = current.getTime() - previous.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) return `${hours}h ${mins}m gap`;
    return `${mins}m gap`;
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      
      {/* HEADER */}
      <div className="bg-white p-6 pb-4 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
           {/* HEADER WITH AVATAR */}
           <div className="flex items-center gap-3">
             <div className="w-12 h-12 relative rounded-full overflow-hidden border border-gray-100 shadow-sm bg-gray-50">
               <Image 
                 src="/assets/avatar-header.png" 
                 alt="Dr. Reza Profile" 
                 fill 
                 className="object-cover"
               />
             </div>
             <div>
               <h1 className="text-2xl font-black text-gray-900 leading-none">Today</h1>
               <p className="text-xs text-gray-500 font-bold mt-1">Welcome back, {firstName}</p>
             </div>
           </div>
           
           {/* STREAK BADGE */}
           <div className="flex flex-col items-end">
             <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
               <span className="text-lg">🔥</span>
               <span className="text-xs font-bold text-orange-600">{streak} Day Streak</span>
             </div>
             <p className="text-[9px] text-gray-300 mt-1 font-bold tracking-wider uppercase">Current Goal</p>
             <p className="text-xs font-bold text-blue-600">{getGoalLabel()}</p>
           </div>
        </div>
        <DateStrip />
      </div>

      {/* SUMMARY CARD CONTAINER */}
      <div className="px-4 mt-6"> 
        <div className={`
          rounded-3xl p-6 text-white shadow-lg transition-colors duration-500 relative overflow-hidden
          ${isOverBudget ? 'bg-gradient-to-br from-red-600 to-red-500' : 'bg-gradient-to-br from-blue-600 to-blue-500'}
        `}>
          
          {/* Main Content Row */}
          <div className="flex justify-between items-center h-28 relative z-10">
            
            {/* Left: Calories */}
            <div className="z-10">
              <p className="text-white/80 text-xs font-bold uppercase tracking-wider">
                {isOverBudget ? 'Over Limit' : 'Calories Left'}
              </p>
              <h2 className="text-4xl font-black mt-1">
                {isOverBudget ? Math.abs(rawRemaining) : rawRemaining}
                {isOverBudget && <span className="text-sm font-medium opacity-70 ml-1">over</span>}
              </h2>
            </div>

            {/* CENTER: SNUG STATUS AVATAR */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 z-0">
              <Image
                src={`/avatar/state_${currentStage}.png`}
                alt="Status Avatar"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Right: Budget */}
            <div className="text-right z-10">
              <p className="text-white/80 text-xs font-bold uppercase">Budget</p>
              <p className="font-bold text-lg">{budget}</p>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="mt-2">
            {isOverBudget ? (
              <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-2xl p-3 animate-fade-in">
                 <span className="text-sm font-bold text-white">Food Coma imminent!</span>
              </div>
            ) : (
              <div className="w-full bg-black/20 h-2.5 rounded-full overflow-hidden">
                 <div className="bg-white h-full rounded-full transition-all duration-1000 ease-out" style={{ width: `${progressPercent}%` }}></div>
              </div>
            )}
            
            <p className="text-xs text-white/80 mt-3 text-right font-medium">
              {stats.calories} kcal consumed
            </p>
          </div>
        </div>
        
        {/* BADGES */}
        {userProfile.healthConditions.length > 0 && (
           <div className="mt-4 flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
             {userProfile.healthConditions.map(c => (
               <span key={c} className="bg-blue-50 text-blue-700 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-100 capitalize">
                 {c.replace('_', ' ')}
               </span>
             ))}
           </div>
        )}
      </div>

      {/* WEEKLY CHART SECTION */}
      <div className="px-4 mb-6 mt-8">
        {isChartUnlocked ? (
          <WeeklyChart data={weeklyData} />
        ) : (
          <div className="bg-white rounded-3xl p-6 border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-3 text-2xl grayscale opacity-50">
              📊
            </div>
            <h3 className="text-gray-900 font-bold text-sm">Trend Chart Locked</h3>
            <p className="text-gray-400 text-xs mt-1 mb-4 max-w-[200px] leading-relaxed">
              Track meals for <span className="font-bold text-blue-600">{daysRemainingToUnlock} more {daysRemainingToUnlock === 1 ? 'day' : 'days'}</span> to unlock your weekly analysis!
            </p>
            
            <div className="w-48 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-500" 
                style={{ width: `${(daysTrackedCount / 3) * 100}%` }}
              ></div>
            </div>
            <p className="text-[10px] text-gray-400 mt-2 font-bold uppercase tracking-widest">{daysTrackedCount} / 3 Days</p>
          </div>
        )}
      </div>

      {/* MEAL LIST */}
      <div className="px-4">
        <h3 className="font-bold text-gray-800 mb-4 ml-1">Your Meals</h3>
        {sortedMeals.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-dashed border-gray-300">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-gray-500 font-medium">No meals tracked today.</p>
            <p className="text-xs text-gray-400 mt-1">Tap the camera button to start!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedMeals.map((meal, index) => {
              const previousMeal = sortedMeals[index - 1];
              const timeGapLabel = previousMeal 
                ? getTimeGap(new Date(meal.timestamp), new Date(previousMeal.timestamp))
                : "First meal";

              return (
                <div key={meal.id} className="relative group">
                  {/* Timeline Connector */}
                  {index < sortedMeals.length - 1 && <div className="absolute left-7 top-16 bottom-[-24px] w-0.5 bg-gray-100 z-0"></div>}
                  
                  {/* CLICKABLE CARD (Trigger Modal) */}
                  <div 
                    onClick={() => setSelectedMeal(meal)} // 👈 OPEN MODAL ON CLICK
                    className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 flex justify-between items-start animate-slide-up z-10 relative cursor-pointer active:scale-95 transition-transform"
                  >
                    <div className="flex gap-4">
                      <div className="h-16 w-16 bg-gray-100 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-50">
                        {meal.image ? <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" /> : <div className="h-full w-full flex items-center justify-center text-2xl">🥗</div>}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 capitalize leading-tight text-sm mb-1">{meal.name}</h4>
                        {meal.components && meal.components.length > 0 && <p className="text-[10px] text-gray-400 leading-tight mt-0.5 mb-1 line-clamp-1">{meal.components.join(', ')}</p>}
                        <div className="flex items-center gap-2 mb-2">
                          <p className="text-[10px] text-gray-400 font-bold bg-gray-50 px-2 py-0.5 rounded-lg">{new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                          <p className="text-[10px] text-blue-500 font-black uppercase tracking-tighter">{timeGapLabel}</p>
                        </div>
                        <div className="flex gap-1.5 text-[9px] font-bold">
                          <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-lg">P: {meal.protein}g</span>
                          <span className="bg-orange-50 text-orange-600 px-2 py-1 rounded-lg">C: {meal.carbs}g</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between h-16">
                      <div className="text-right">
                        <span className="font-black text-gray-900 block leading-none text-base">{meal.calories}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">kcal</span>
                      </div>
                      
                      {/* Trash Button - stopPropagation prevents opening modal */}
                      <button 
                        onClick={(e) => { e.stopPropagation(); deleteMeal(meal.id); }} 
                        className="text-gray-300 hover:text-red-500 transition-colors p-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* MEAL DETAILS MODAL */}
      <MealDetailsModal 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        onDelete={deleteMeal} 
      />

    </div>
  );
}