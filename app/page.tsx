// src/app/page.tsx
'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DateStrip } from '@/components/DateStrip';
import { WeeklyChart } from '@/components/WeeklyChart';
import { DailyProgress } from '@/components/DailyProgress';
import MealDetailsModal from '@/components/MealDetailsModal';
import DaySummaryShare from '@/components/DaySummaryShare';
import { useFood } from '@/context/FoodContext';

export default function HomePage() {
  const { meals, userProfile, dailyBudget, deleteMeal, getWeeklyStats, streak, isLoaded } = useFood();
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayShare, setShowDayShare] = useState(false);
  
  if (!userProfile) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-teal-50 to-white">
        <div className="w-20 h-20 relative mb-4 rounded-full overflow-hidden border-4 border-white shadow-xl animate-bounce">
          <Image 
            src="/assets/avatar-header.png" 
            alt="Dr. Reza" 
            fill 
            className="object-cover" 
          />
        </div>
        <div className="text-teal-600 font-bold animate-pulse">Loading Dr. Reza...</div>
      </div>
    );
  }

  // Filter meals by selected date
  const filteredMeals = useMemo(() => {
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);
    
    return meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      return mealDate >= startOfDay && mealDate <= endOfDay;
    }).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [meals, selectedDate]);

  // Calculate stats for selected day
  const dayStats = useMemo(() => {
    return filteredMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [filteredMeals]);

  const budget = dailyBudget || 2000;
  const rawRemaining = budget - dayStats.calories;
  const isOverBudget = rawRemaining < 0;
  const isToday = selectedDate.toDateString() === new Date().toDateString();

  // User greeting
  const firstName = userProfile.name && userProfile.name.trim() !== '' 
    ? userProfile.name.split(' ')[0] 
    : 'Foodie';

  const getGoalLabel = () => {
    if (userProfile.goal === 'lose_weight') return "Nak Kurus";
    if (userProfile.goal === 'build_muscle') return "Kasi Sado";
    return "Maintain Je";
  };

  // Chart logic - only unlock after data is loaded AND user has 3+ days of data
  const weeklyData = getWeeklyStats();
  const daysTrackedCount = weeklyData.filter(day => day.calories > 0).length;
  // Chart stays locked until: loaded + has 3+ days tracked
  // Use explicit variable to avoid any hydration issues
  const shouldShowLockOverlay = !isLoaded || daysTrackedCount < 3;

  const getTimeGap = (current: Date, previous: Date) => {
    const diffMs = current.getTime() - previous.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    if (hours > 0) return `${hours}h ${mins}m gap`;
    return `${mins}m gap`;
  };

  // Date display
  const getDateTitle = () => {
    if (isToday) return "Today";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate.toDateString() === yesterday.toDateString()) return "Yesterday";
    return selectedDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      
      {/* HEADER */}
      <div className="bg-white px-5 pt-6 pb-4 border-b border-slate-100">
        <div className="flex justify-between items-center mb-4">
          {/* Left: Avatar + Greeting */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-teal-100 shadow-sm bg-teal-50">
              <Image 
                src="/assets/avatar-header.png" 
                alt="Dr. Reza" 
                fill 
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="text-xl font-black text-slate-900 leading-none">{getDateTitle()}</h1>
              <p className="text-xs text-slate-500 font-medium mt-1">Welcome back, {firstName}</p>
            </div>
          </div>
          
          {/* Right: Streak + Goal */}
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <span className="text-base">🔥</span>
              <span className="text-xs font-bold text-orange-600">{streak}</span>
            </div>
            <p className="text-[9px] text-slate-300 mt-1 font-bold uppercase">{getGoalLabel()}</p>
          </div>
        </div>
        
        {/* Date Strip */}
        <DateStrip selectedDate={selectedDate} onSelectDate={setSelectedDate} />
      </div>

      {/* DAILY PROGRESS RING */}
      <div className="px-4 mt-5">
        <DailyProgress 
          consumed={dayStats.calories}
          budget={budget}
          protein={dayStats.protein}
          carbs={dayStats.carbs}
          fat={dayStats.fat}
        />
      </div>

      {/* WEEKLY CHART - Always show, with overlay if locked */}
      <div className="px-4 mt-5">
        <div className="relative">
          <WeeklyChart data={weeklyData} />
          
          {/* Cool Lock Screen Overlay */}
          {shouldShowLockOverlay && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/70 via-slate-900/60 to-teal-900/50 backdrop-blur-[3px] rounded-3xl flex flex-col items-center justify-center p-5 z-50">
              {/* Glowing Lock Icon */}
              <div className="relative mb-4">
                <div className="absolute inset-0 bg-teal-500/30 rounded-full blur-xl animate-pulse"></div>
                <div className="relative w-16 h-16 bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center shadow-2xl border border-slate-600/50">
                  <span className="text-3xl">🔐</span>
                </div>
              </div>
              
              {/* Title */}
              <h3 className="text-white font-bold text-lg mb-1">Weekly Insights</h3>
              <p className="text-teal-300 text-xs font-semibold mb-3">🔒 LOCKED</p>
              
              {/* Dr. Reza Avatar + Message */}
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-3 mb-4 max-w-[260px] border border-white/10">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-teal-400/50 flex-shrink-0">
                    <Image 
                      src="/assets/avatar-header.png" 
                      alt="Dr. Reza" 
                      width={40} 
                      height={40} 
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-white/90 text-xs leading-relaxed">
                      {daysTrackedCount === 0 && "\"Log your first meal to start your health journey with me!\""}
                      {daysTrackedCount === 1 && "\"Good start! 2 more days and I can show you your trends.\""}
                      {daysTrackedCount === 2 && "\"Almost there! One more day of logging!\""}
                    </p>
                    <p className="text-teal-400 text-[10px] font-bold mt-1">— Dr. Reza</p>
                  </div>
                </div>
              </div>
              
              {/* Progress Dots */}
              <div className="flex items-center gap-3 mb-3">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="flex flex-col items-center">
                    <div 
                      className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                        i < daysTrackedCount 
                          ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/30 scale-110' 
                          : 'bg-slate-700/60 text-slate-400 border border-slate-600/50'
                      }`}
                    >
                      {i < daysTrackedCount ? '✓' : `D${i + 1}`}
                    </div>
                    <span className={`text-[9px] mt-1 ${i < daysTrackedCount ? 'text-teal-400' : 'text-slate-500'}`}>
                      {i < daysTrackedCount ? 'Done' : 'Log'}
                    </span>
                  </div>
                ))}
              </div>
              
              {/* CTA */}
              <Link 
                href="/check-food" 
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
              >
                📸 Scan Your Next Meal
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* HEALTH CONDITION BADGES */}
      {userProfile.healthConditions.length > 0 && (
        <div className="px-4 mt-4">
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {userProfile.healthConditions.map(c => (
              <span key={c} className="bg-teal-50 text-teal-700 text-[10px] font-bold px-3 py-1 rounded-full border border-teal-100 capitalize whitespace-nowrap">
                {c.replace('_', ' ')}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* MEAL LIST HEADER */}
      <div className="px-4 mt-6 flex justify-between items-center">
        <h3 className="font-bold text-slate-800">
          {isToday ? "Today's Meals" : `Meals on ${selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`}
        </h3>
        {filteredMeals.length > 0 && (
          <button 
            onClick={() => setShowDayShare(true)}
            className="text-xs font-bold text-teal-600 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Share Day
          </button>
        )}
      </div>

      {/* MEAL LIST */}
      <div className="px-4 mt-3">
        {filteredMeals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-slate-500 font-medium">No meals tracked {isToday ? 'today' : 'on this day'}.</p>
            {isToday && (
              <p className="text-xs text-slate-400 mt-1">Tap the camera button to start!</p>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMeals.map((meal, index) => {
              const previousMeal = filteredMeals[index - 1];
              const timeGapLabel = previousMeal 
                ? getTimeGap(new Date(meal.timestamp), new Date(previousMeal.timestamp))
                : "First meal";

              return (
                <div key={meal.id} className="relative">
                  {/* Timeline Connector */}
                  {index < filteredMeals.length - 1 && (
                    <div className="absolute left-7 top-16 bottom-[-16px] w-0.5 bg-slate-100 z-0"></div>
                  )}
                  
                  {/* MEAL CARD */}
                  <div 
                    onClick={() => setSelectedMeal(meal)}
                    className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex gap-3 z-10 relative cursor-pointer active:scale-[0.98] transition-transform"
                  >
                    {/* Image */}
                    <div className="h-14 w-14 bg-slate-100 rounded-xl overflow-hidden flex-shrink-0">
                      {meal.image ? (
                        <img src={meal.image} alt={meal.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center text-xl bg-gradient-to-br from-teal-100 to-emerald-100">🥗</div>
                      )}
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <div className="min-w-0 flex-1">
                          <h4 className="font-bold text-slate-800 text-sm truncate">{meal.name}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-slate-400 font-medium bg-slate-50 px-2 py-0.5 rounded">
                              {new Date(meal.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            <span className="text-[10px] text-teal-600 font-bold">{timeGapLabel}</span>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0 ml-2">
                          <span className="font-black text-slate-900 text-base">{meal.calories}</span>
                          <span className="text-[10px] text-slate-400 font-bold ml-0.5">kcal</span>
                        </div>
                      </div>
                      
                      {/* Macro Pills - Full labels */}
                      <div className="flex gap-1.5 mt-2">
                        <span className="bg-green-50 text-green-600 text-[9px] font-bold px-2 py-1 rounded-lg">
                          Protein {meal.protein}g
                        </span>
                        <span className="bg-orange-50 text-orange-500 text-[9px] font-bold px-2 py-1 rounded-lg">
                          Carbs {meal.carbs}g
                        </span>
                        <span className="bg-amber-50 text-amber-500 text-[9px] font-bold px-2 py-1 rounded-lg">
                          Fat {meal.fat || 0}g
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* PDF REPORT BUTTON (if chart unlocked) */}
      {!shouldShowLockOverlay && (
        <div className="px-4 mt-6">
          <Link 
            href="/report"
            className="block w-full py-4 bg-gradient-to-r from-slate-800 to-slate-900 text-white font-bold text-center rounded-2xl shadow-lg"
          >
            📄 Generate Weekly Report
          </Link>
        </div>
      )}

      {/* MEAL DETAILS MODAL */}
      <MealDetailsModal 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        onDelete={deleteMeal} 
      />

      {/* DAY SUMMARY SHARE MODAL */}
      {showDayShare && (
        <DaySummaryShare
          meals={filteredMeals}
          date={selectedDate}
          totalCalories={dayStats.calories}
          totalProtein={dayStats.protein}
          totalCarbs={dayStats.carbs}
          totalFat={dayStats.fat}
          userName={firstName}
          onClose={() => setShowDayShare(false)}
        />
      )}
    </div>
  );
}
