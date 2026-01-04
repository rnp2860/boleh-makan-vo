// src/app/dashboard/page.tsx
'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import { DateStrip } from '@/components/DateStrip';
import { WeeklyChart } from '@/components/WeeklyChart';
import { DailyProgress } from '@/components/DailyProgress';
import MealDetailsModal from '@/components/MealDetailsModal';
import DaySummaryShare from '@/components/DaySummaryShare';
import LogVitalsModal from '@/components/LogVitalsModal';
import BolehScore from '@/components/dashboard/BolehScore';
import RiskChart, { FoodLogEntry, VitalEntry } from '@/components/RiskChart';
import StreakWidget from '@/components/StreakWidget';
import StreakCelebrationModal from '@/components/StreakCelebrationModal';
import { useFood } from '@/context/FoodContext';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function DashboardPage() {
  const { meals, userProfile, dailyBudget, deleteMeal, getWeeklyStats, streak, isLoaded } = useFood();
  const router = useRouter();
  const [selectedMeal, setSelectedMeal] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showDayShare, setShowDayShare] = useState(false);
  const [isVitalsOpen, setIsVitalsOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  
  // 🌙 Ramadan Mode state
  const [isRamadanMode, setIsRamadanMode] = useState(false);
  const [sahurLogged, setSahurLogged] = useState(false);
  const [iftarLogged, setIftarLogged] = useState(false);
  
  // Streak celebration
  const [showStreakCelebration, setShowStreakCelebration] = useState(false);
  const [celebrationStreak, setCelebrationStreak] = useState(0);
  const [isNewStreakRecord, setIsNewStreakRecord] = useState(false);
  
  // Risk Chart data
  const [riskChartFoodLogs, setRiskChartFoodLogs] = useState<FoodLogEntry[]>([]);
  const [riskChartVitals, setRiskChartVitals] = useState<VitalEntry[]>([]);
  const [riskChartLoading, setRiskChartLoading] = useState(true);

  // Boleh Score data
  const [todayScore, setTodayScore] = useState<number>(70);
  const [yesterdayScore, setYesterdayScore] = useState<number>(70);
  const [mealsLoggedToday, setMealsLoggedToday] = useState<number>(0);
  const [vitalsLoggedToday, setVitalsLoggedToday] = useState<number>(0);
  const [scoreLoading, setScoreLoading] = useState(true);

  // Get user ID for Boleh Score
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let id = localStorage.getItem('boleh_makan_user_id');
      if (!id) {
        id = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
        localStorage.setItem('boleh_makan_user_id', id);
      }
      setUserId(id);
      
      // Check if Ramadan mode is enabled
      const ramadanModeEnabled = localStorage.getItem('boleh_makan_ramadan_mode') === 'true';
      setIsRamadanMode(ramadanModeEnabled);
      
      // Check if Sahur/Iftar logged today (check localStorage flags)
      if (ramadanModeEnabled) {
        const today = new Date().toDateString();
        const sahurLoggedDate = localStorage.getItem('boleh_makan_sahur_logged_date');
        const iftarLoggedDate = localStorage.getItem('boleh_makan_iftar_logged_date');
        
        setSahurLogged(sahurLoggedDate === today);
        setIftarLogged(iftarLoggedDate === today);
      }
    }
  }, [meals]);

  // Check if user needs onboarding (new user without profile setup)
  useEffect(() => {
    if (typeof window !== 'undefined' && isLoaded) {
      const onboardingComplete = localStorage.getItem('boleh_makan_onboarding_complete');
      
      // Redirect to onboarding if:
      // 1. Onboarding not marked complete AND
      // 2. User profile is missing key data (no goal set or no physical details)
      const needsOnboarding = !onboardingComplete && userProfile && (
        !userProfile.goal ||
        !userProfile.details?.age ||
        !userProfile.details?.height ||
        !userProfile.details?.weight
      );
      
      if (needsOnboarding) {
        router.push('/onboarding');
      }
    }
  }, [isLoaded, userProfile, router]);

  // Check for streak celebration from meal logging
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const celebrationData = sessionStorage.getItem('boleh_makan_streak_celebration');
      if (celebrationData) {
        try {
          const { streak, isMilestone, isNewRecord } = JSON.parse(celebrationData);
          if (isMilestone) {
            setCelebrationStreak(streak);
            setIsNewStreakRecord(isNewRecord);
            setShowStreakCelebration(true);
          }
          // Clear the celebration data
          sessionStorage.removeItem('boleh_makan_streak_celebration');
        } catch (e) {
          console.error('Failed to parse streak celebration data:', e);
        }
      }
    }
  }, []);

  // State to force chart refetch (increments after delete)
  const [chartRefreshKey, setChartRefreshKey] = useState(0);

  // Function to refetch chart data
  const refetchChartData = async () => {
    if (!userId) return;
    
    setRiskChartLoading(true);
    
    // Get start and end of selected day
    const startOfDay = new Date(selectedDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      // Fetch food logs for the selected date
      const { data: foodData, error: foodError } = await supabase
        .from('food_logs')
        .select('id, meal_name, calories, image_url, created_at, meal_context, preparation_style')
        .eq('user_id', userId)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: true });

      if (foodError) {
        console.error('Error fetching food logs for chart:', foodError);
      } else {
        console.log('📊 Dashboard: Food logs fetched for chart:', foodData?.length, foodData);
        setRiskChartFoodLogs(foodData || []);
      }

      // Fetch vitals for the selected date
      const { data: vitalsData, error: vitalsError } = await supabase
        .from('user_vitals')
        .select('id, vital_type, reading_value, unit, context_tag, measured_at')
        .eq('user_id', userId)
        .gte('measured_at', startOfDay.toISOString())
        .lte('measured_at', endOfDay.toISOString())
        .order('measured_at', { ascending: true });

      if (vitalsError) {
        console.error('Error fetching vitals for chart:', vitalsError);
      } else {
        console.log('📊 Dashboard: Vitals fetched for chart:', vitalsData?.length, vitalsData);
        setRiskChartVitals(vitalsData || []);
      }
    } catch (err) {
      console.error('Failed to fetch risk chart data:', err);
    } finally {
      setRiskChartLoading(false);
    }
  };

  // Fetch Risk Chart data when date, userId, or refreshKey changes
  useEffect(() => {
    refetchChartData();
  }, [userId, selectedDate, chartRefreshKey]);

  // Fetch Boleh Score data for today and yesterday
  useEffect(() => {
    const fetchScoreData = async () => {
      if (!userId) return;
      
      setScoreLoading(true);
      
      try {
        // Fetch today's score
        const todayResponse = await fetch(`/api/user/score?user_id=${encodeURIComponent(userId)}`);
        const todayResult = await todayResponse.json();
        
        if (todayResult.success && todayResult.data) {
          setTodayScore(todayResult.data.score);
          setMealsLoggedToday(todayResult.data.stats.meals_logged);
          setVitalsLoggedToday(todayResult.data.stats.vitals_logged);
        }
        
        // Fetch yesterday's score for comparison
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayDateStr = yesterday.toISOString().split('T')[0];
        
        const yesterdayResponse = await fetch(
          `/api/user/score?user_id=${encodeURIComponent(userId)}&date=${yesterdayDateStr}`
        );
        const yesterdayResult = await yesterdayResponse.json();
        
        if (yesterdayResult.success && yesterdayResult.data) {
          setYesterdayScore(yesterdayResult.data.score);
        }
      } catch (error) {
        console.error('Error fetching score data:', error);
      } finally {
        setScoreLoading(false);
      }
    };
    
    fetchScoreData();
  }, [userId]);


  // Handler for meal deletion that also refreshes the chart
  const handleDeleteMeal = async (mealId: string) => {
    await deleteMeal(mealId);
    // Immediately refetch chart data after delete
    setChartRefreshKey(prev => prev + 1);
  };
  
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
    if (isToday) return "Hari Ini";
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    if (selectedDate.toDateString() === yesterday.toDateString()) return "Semalam";
    return selectedDate.toLocaleDateString('ms-MY', { weekday: 'short', month: 'short', day: 'numeric' });
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
              <p className="text-xs text-slate-500 font-medium mt-1">Selamat kembali, {firstName}</p>
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

      {/* 🔥 STREAK + BOLEH SCORE - HERO POSITION */}
      <div className="px-4 mt-5 space-y-4">
        {/* 🌙 RAMADAN MODE WIDGET - Show if enabled */}
        {isRamadanMode && (
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl p-4 text-white mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🌙</span>
              <h3 className="font-semibold">Ramadan Mubarak</h3>
            </div>
            <div className="grid grid-cols-2 gap-3 mt-3">
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-white/80 text-xs">Sahur</p>
                <p className="font-semibold">{sahurLogged ? '✅ Logged' : '⏳ Belum log'}</p>
              </div>
              <div className="bg-white/20 rounded-lg p-3">
                <p className="text-white/80 text-xs">Iftar</p>
                <p className="font-semibold">{iftarLogged ? '✅ Logged' : '⏳ Belum log'}</p>
              </div>
            </div>
            <p className="text-xs text-white/70 mt-3">
              💡 Tip: Minum air secukupnya antara Iftar dan Sahur
            </p>
          </div>
        )}
        
        {/* Streak Widget - Compact inline with Score */}
        <div className="flex gap-3">
          <div className="flex-1">
            {scoreLoading ? (
              <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
                <div className="flex items-center justify-center gap-4">
                  <div className="w-32 h-32 rounded-full bg-slate-100 animate-pulse"></div>
                  <div className="flex-1 space-y-3">
                    <div className="h-6 bg-slate-100 rounded-lg w-32 animate-pulse"></div>
                    <div className="h-4 bg-slate-100 rounded-lg w-48 animate-pulse"></div>
                  </div>
                </div>
              </div>
            ) : (
              <BolehScore 
                score={todayScore}
                previousScore={yesterdayScore}
                streak={streak}
                mealsLogged={mealsLoggedToday}
                targetMeals={3}
                vitalsLogged={vitalsLoggedToday}
              />
            )}
          </div>
        </div>
          
          {/* Streak Widget - Full */}
          <StreakWidget userId={userId} />
        </div>

        {/* 📊 CARTA KORELASI RISIKO (Risk Correlation Chart) */}
        <div className="px-4 mt-4">
          {riskChartLoading ? (
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-slate-200 rounded-xl animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded w-32 animate-pulse"></div>
                <div className="h-3 bg-slate-100 rounded w-24 animate-pulse"></div>
              </div>
            </div>
            <div className="h-48 bg-slate-100 rounded-xl animate-pulse"></div>
          </div>
        ) : (
          <RiskChart 
            foodLogs={riskChartFoodLogs} 
            vitals={riskChartVitals}
            date={selectedDate}
          />
        )}
      </div>

      {/* DAILY PROGRESS RING */}
      <div className="px-4 mt-4">
        <DailyProgress 
          consumed={dayStats.calories}
          budget={budget}
          protein={dayStats.protein}
          carbs={dayStats.carbs}
          fat={dayStats.fat}
        />
      </div>

      {/* QUICK ACTIONS */}
      <div className="px-4 mt-5">
        <div className="grid grid-cols-2 gap-3">
          {/* Log Makanan (Log Food) */}
          <Link 
            href="/check-food"
            className="bg-gradient-to-br from-teal-500 to-emerald-600 p-4 rounded-2xl shadow-lg shadow-teal-200/50 flex items-center gap-3 active:scale-[0.98] transition-transform"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Log Makanan</p>
              <p className="text-teal-100 text-xs">Scan atau taip</p>
            </div>
          </Link>

          {/* Log Bacaan (Log Vitals) */}
          <button 
            onClick={() => setIsVitalsOpen(true)}
            className="bg-gradient-to-br from-rose-500 to-pink-600 p-4 rounded-2xl shadow-lg shadow-rose-200/50 flex items-center gap-3 active:scale-[0.98] transition-transform text-left"
          >
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              {/* Heart Pulse Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h2l1-3 2 6 1-3h2" />
              </svg>
            </div>
            <div>
              <p className="text-white font-bold text-sm">Log Bacaan</p>
              <p className="text-rose-100 text-xs">Glukosa, BP, Berat</p>
            </div>
          </button>
        </div>
      </div>

      {/* WEEKLY CHART - Always show, with overlay if locked */}
      <div className="px-4 mt-5">
        <div className="relative overflow-hidden rounded-2xl">
          <WeeklyChart data={weeklyData} />
          
          {/* Lock Screen Overlay - Centered, no lock icon */}
          {shouldShowLockOverlay && (
            <div className="absolute inset-0 bg-gradient-to-br from-slate-800/85 via-slate-900/75 to-teal-900/65 backdrop-blur-[3px] flex flex-col items-center justify-center p-4 z-50 overflow-hidden">
              
              {/* Title */}
              <h3 className="text-white font-bold text-lg mb-1">Statistik Mingguan</h3>
              
              {/* Message */}
              <p className="text-teal-300 text-xs font-medium mb-4 text-center">
                Log 3 hari pertama untuk buka!
              </p>
              
              {/* Progress Checkboxes - Day 1, 2, 3 */}
              <div className="flex items-center gap-3 mb-4">
                {[1, 2, 3].map((day) => {
                  const isCompleted = day <= daysTrackedCount;
                  return (
                    <div key={day} className="flex flex-col items-center">
                      <div 
                        className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold transition-all duration-300 relative ${
                          isCompleted 
                            ? 'bg-gradient-to-br from-teal-400 to-teal-600 text-white shadow-lg shadow-teal-500/40' 
                            : 'bg-slate-700/50 text-slate-400 border-2 border-slate-600/50'
                        }`}
                      >
                        {/* Day number */}
                        <span className={isCompleted ? 'opacity-70' : ''}>{day}</span>
                        {/* Strikethrough line when completed */}
                        {isCompleted && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-0.5 bg-white rounded-full transform -rotate-45"></div>
                          </div>
                        )}
                      </div>
                      <span className={`text-[10px] mt-1.5 font-medium ${isCompleted ? 'text-teal-400' : 'text-slate-500'}`}>
                        Day {day}
                      </span>
                    </div>
                  );
                })}
              </div>
              
              {/* CTA Button */}
              <Link 
                href="/check-food" 
                className="bg-gradient-to-r from-teal-500 to-teal-600 text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 transition-all"
              >
                📸 Log Makanan Hari Ini
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
          {isToday ? "Makanan Hari Ini" : `Makanan pada ${selectedDate.toLocaleDateString('ms-MY', { month: 'short', day: 'numeric' })}`}
        </h3>
        {filteredMeals.length > 0 && (
          <button 
            onClick={() => setShowDayShare(true)}
            className="text-xs font-bold text-teal-600 flex items-center gap-1"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
            </svg>
            Kongsi
          </button>
        )}
      </div>

      {/* MEAL LIST */}
      <div className="px-4 mt-3">
        {filteredMeals.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-dashed border-slate-200">
            <div className="text-4xl mb-3">🍽️</div>
            <p className="text-slate-500 font-medium">Tiada makanan dilog {isToday ? 'hari ini' : 'pada hari ini'}.</p>
            {isToday && (
              <div className="mt-4">
                {/* Prominent CTA for first-time users */}
                <div className="bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-4 border border-blue-100">
                  <p className="text-blue-700 font-bold text-sm mb-2">
                    Bersedia untuk mulakan perjalanan sihat anda?
                  </p>
                  <p className="text-slate-500 text-xs">
                    Tekan butang kamera di bawah untuk log makanan pertama anda!
                  </p>
                </div>
                
                {/* Animated Arrow Pointing Down */}
                <div className="flex flex-col items-center mt-5">
                  <div className="animate-bounce">
                    {/* Cool double-line arrow with gradient effect */}
                    <div className="relative">
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="h-16 w-16 text-blue-500 drop-shadow-lg" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="url(#arrowGradient)"
                        strokeWidth={2}
                      >
                        <defs>
                          <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#3B82F6" />
                            <stop offset="100%" stopColor="#14B8A6" />
                          </linearGradient>
                        </defs>
                        {/* Main arrow shaft */}
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v14" />
                        {/* Arrow head - wider chevron */}
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l7 7 7-7" />
                        {/* Second chevron for depth */}
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 10l4 4 4-4" opacity="0.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
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
            📄 Jana Laporan Mingguan
          </Link>
        </div>
      )}

      {/* MEAL DETAILS MODAL */}
      <MealDetailsModal 
        meal={selectedMeal} 
        onClose={() => setSelectedMeal(null)} 
        onDelete={handleDeleteMeal} 
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

      {/* LOG VITALS MODAL */}
      <LogVitalsModal 
        isOpen={isVitalsOpen}
        onClose={() => setIsVitalsOpen(false)}
        onSuccess={() => {
          // Optional: Show success toast or refresh data
          console.log('✅ Vital logged successfully');
        }}
      />

      {/* STREAK CELEBRATION MODAL */}
      <StreakCelebrationModal
        isOpen={showStreakCelebration}
        onClose={() => setShowStreakCelebration(false)}
        streak={celebrationStreak}
        isNewRecord={isNewStreakRecord}
      />
    </div>
  );
}

