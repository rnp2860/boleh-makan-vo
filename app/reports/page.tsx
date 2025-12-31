'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

// 🎨 Color Palettes
const MEAL_COLORS: Record<string, string> = {
  Breakfast: '#F59E0B', // Amber
  Lunch: '#10B981',     // Emerald
  Dinner: '#6366F1',    // Indigo
  Snack: '#EC4899',     // Pink
  Other: '#94A3B8'      // Slate
};

const MACRO_COLORS = {
  protein: '#EF4444',   // Red
  carbs: '#F59E0B',     // Amber
  fat: '#3B82F6'        // Blue
};

// 🆔 Get user ID
const getUserId = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('boleh_makan_user_id');
};

// 📅 Format date for display
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-MY', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export default function NutritionReportPage() {
  const router = useRouter();
  
  // 📅 Date Range State
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(date.getDate() - 7); // Default: last 7 days
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => {
    return new Date().toISOString().split('T')[0];
  });
  
  // 📊 Report Data State
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🩺 Dr. Reza Insight
  const [insight, setInsight] = useState('');
  const [insightLoading, setInsightLoading] = useState(false);

  // 📥 Fetch Report Data
  const generateReport = async () => {
    setLoading(true);
    setError('');
    setReportData(null);
    setInsight('');
    
    try {
      const userId = getUserId();
      const params = new URLSearchParams({
        start_date: startDate,
        end_date: endDate,
        ...(userId && { user_id: userId })
      });
      
      const response = await fetch(`/api/reports/generate?${params}`);
      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to generate report');
      }
      
      setReportData(result.data);
      
      // Fetch Dr. Reza's insight if we have data
      if (result.data.total_logs > 0) {
        fetchInsight(result.data);
      }
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // 🩺 Fetch Dr. Reza's Insight
  const fetchInsight = async (data: any) => {
    setInsightLoading(true);
    try {
      const response = await fetch('/api/reports/insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          summaryStats: data.summary_stats,
          mealBreakdown: data.meal_breakdown,
          sodiumSugarWatch: data.sodium_sugar_watch,
          period: data.period
        })
      });
      const result = await response.json();
      setInsight(result.insight || '');
    } catch (err) {
      console.error('Failed to fetch insight:', err);
    } finally {
      setInsightLoading(false);
    }
  };

  // 📊 Prepare chart data
  const getMealChartData = () => {
    if (!reportData?.meal_breakdown) return [];
    return Object.entries(reportData.meal_breakdown)
      .filter(([_, data]: [string, any]) => data.calories > 0)
      .map(([name, data]: [string, any]) => ({
        name,
        value: data.calories,
        percentage: data.percentage
      }));
  };

  const getMacroChartData = () => {
    if (!reportData?.macro_distribution) return [];
    return [
      { name: 'Protein', value: reportData.macro_distribution.protein.calories, grams: reportData.macro_distribution.protein.grams },
      { name: 'Carbs', value: reportData.macro_distribution.carbs.calories, grams: reportData.macro_distribution.carbs.grams },
      { name: 'Fat', value: reportData.macro_distribution.fat.calories, grams: reportData.macro_distribution.fat.grams }
    ];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white pb-24">
      {/* ========== HEADER ========== */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="px-4 py-3 flex items-center gap-3">
          <button 
            onClick={() => router.back()}
            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-slate-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-bold text-slate-800">📊 Nutrition Report</h1>
            <p className="text-xs text-slate-400">Analyze your eating patterns</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-4">
        {/* ========== DATE RANGE PICKER ========== */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
          <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">📅 Select Date Range</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-200 focus:border-teal-400 focus:outline-none"
              />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full p-3 bg-slate-50 rounded-xl text-slate-700 font-medium border border-slate-200 focus:border-teal-400 focus:outline-none"
              />
            </div>
          </div>
          <button
            onClick={generateReport}
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl shadow-lg shadow-teal-200/50 active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Generating...
              </span>
            ) : (
              '📊 Generate Report'
            )}
          </button>
        </div>

        {/* ========== ERROR MESSAGE ========== */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
            <p className="text-red-600 text-sm font-medium">{error}</p>
          </div>
        )}

        {/* ========== NO DATA MESSAGE ========== */}
        {reportData && reportData.total_logs === 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center mb-4">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-amber-700 font-bold mb-1">No meals logged in this period</p>
            <p className="text-amber-600 text-sm">Try selecting a different date range or log some meals first!</p>
          </div>
        )}

        {/* ========== REPORT CONTENT ========== */}
        {reportData && reportData.total_logs > 0 && (
          <>
            {/* 🩺 DR. REZA'S INSIGHT */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 mb-4 border border-blue-100">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow-lg">
                  <Image 
                    src="/assets/avatar-header.png" 
                    alt="Dr Reza" 
                    width={48} 
                    height={48} 
                    className="object-cover" 
                  />
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-blue-600 mb-1">🩺 Dr. Reza's Insight</p>
                  {insightLoading ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm">Analyzing your report...</span>
                    </div>
                  ) : (
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {insight || "Generate a report to get personalized insights!"}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* 📈 SUMMARY STATS CARDS */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl font-black text-slate-800">{reportData.summary_stats.total_meals}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Meals</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl font-black text-slate-800">{reportData.summary_stats.total_days}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Days</p>
              </div>
              <div className="bg-white rounded-xl p-3 shadow-sm border border-slate-100 text-center">
                <p className="text-2xl font-black text-teal-600">{reportData.summary_stats.avg_daily_calories}</p>
                <p className="text-[10px] text-slate-400 font-bold uppercase">Avg Cal/Day</p>
              </div>
            </div>

            {/* 🥧 CHARTS SECTION */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {/* Calorie by Meal Type */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">🍽️ By Meal Type</p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getMealChartData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {getMealChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={MEAL_COLORS[entry.name] || '#94A3B8'} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`${value} kcal`]}
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-2 mt-2">
                  {getMealChartData().map((entry) => (
                    <div key={entry.name} className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full" 
                        style={{ backgroundColor: MEAL_COLORS[entry.name] }}
                      />
                      <span className="text-[10px] text-slate-500">{entry.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Macro Distribution */}
              <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider text-center">🥗 Macros</p>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getMacroChartData()}
                        cx="50%"
                        cy="50%"
                        innerRadius={30}
                        outerRadius={55}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        <Cell fill={MACRO_COLORS.protein} />
                        <Cell fill={MACRO_COLORS.carbs} />
                        <Cell fill={MACRO_COLORS.fat} />
                      </Pie>
                      <Tooltip 
                        formatter={(value, name, props) => [
                          `${props.payload.grams}g (${value} kcal)`
                        ]}
                        contentStyle={{ borderRadius: '8px', fontSize: '12px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                {/* Legend */}
                <div className="flex justify-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MACRO_COLORS.protein }} />
                    <span className="text-[10px] text-slate-500">Protein</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MACRO_COLORS.carbs }} />
                    <span className="text-[10px] text-slate-500">Carbs</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: MACRO_COLORS.fat }} />
                    <span className="text-[10px] text-slate-500">Fat</span>
                  </div>
                </div>
              </div>
            </div>

            {/* ⚠️ DIABETIC WATCH - SODIUM & SUGAR */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
              <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">⚠️ Diabetic Watch</p>
              
              {/* Sodium Bar */}
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    🧂 Avg Daily Sodium
                    {reportData.sodium_sugar_watch.sodium.status === 'Danger' && (
                      <span className="text-red-500 text-xs">⚠️</span>
                    )}
                  </span>
                  <span className={`text-sm font-bold ${
                    reportData.sodium_sugar_watch.sodium.status === 'Safe' ? 'text-green-600' :
                    reportData.sodium_sugar_watch.sodium.status === 'Warning' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {reportData.sodium_sugar_watch.sodium.avg_daily}mg / 2000mg
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      reportData.sodium_sugar_watch.sodium.status === 'Safe' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      reportData.sodium_sugar_watch.sodium.status === 'Warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${Math.min(reportData.sodium_sugar_watch.sodium.percentage_of_limit, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{reportData.sodium_sugar_watch.sodium.message}</p>
              </div>

              {/* Sugar Bar */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-bold text-slate-700 flex items-center gap-1">
                    🍬 Avg Daily Sugar
                    {reportData.sodium_sugar_watch.sugar.status === 'Danger' && (
                      <span className="text-red-500 text-xs">⚠️</span>
                    )}
                  </span>
                  <span className={`text-sm font-bold ${
                    reportData.sodium_sugar_watch.sugar.status === 'Safe' ? 'text-green-600' :
                    reportData.sodium_sugar_watch.sugar.status === 'Warning' ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {reportData.sodium_sugar_watch.sugar.avg_daily}g / 25g
                  </span>
                </div>
                <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-500 ${
                      reportData.sodium_sugar_watch.sugar.status === 'Safe' ? 'bg-gradient-to-r from-green-400 to-green-500' :
                      reportData.sodium_sugar_watch.sugar.status === 'Warning' ? 'bg-gradient-to-r from-amber-400 to-amber-500' : 
                      'bg-gradient-to-r from-red-400 to-red-500'
                    }`}
                    style={{ width: `${Math.min(reportData.sodium_sugar_watch.sugar.percentage_of_limit, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">{reportData.sodium_sugar_watch.sugar.message}</p>
              </div>
            </div>

            {/* 🖼️ VISUAL FOOD DIARY */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
              <p className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-wider">
                🖼️ Visual Food Diary ({reportData.gallery_data.length} meals)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {reportData.gallery_data.map((meal: any) => {
                  const isHighSodium = (meal.sodium || 0) > 800;
                  const isHighSugar = (meal.sugar || 0) > 15;
                  const hasWarning = isHighSodium || isHighSugar;
                  
                  return (
                    <div 
                      key={meal.id} 
                      className="bg-slate-50 rounded-xl overflow-hidden border border-slate-100 relative"
                    >
                      {/* Warning Badge */}
                      {hasWarning && (
                        <div className="absolute top-2 right-2 z-10 flex gap-1">
                          {isHighSodium && (
                            <span className="bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                              🧂
                            </span>
                          )}
                          {isHighSugar && (
                            <span className="bg-pink-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                              🍬
                            </span>
                          )}
                        </div>
                      )}
                      
                      {/* Image */}
                      <div className="h-24 bg-gradient-to-br from-slate-200 to-slate-300 relative">
                        {meal.image_url ? (
                          <img 
                            src={meal.image_url} 
                            alt={meal.food_name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-3xl">🍽️</span>
                          </div>
                        )}
                        {/* Meal Type Badge */}
                        <div 
                          className="absolute bottom-2 left-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white"
                          style={{ backgroundColor: MEAL_COLORS[meal.meal_type] || MEAL_COLORS.Other }}
                        >
                          {meal.meal_type}
                        </div>
                      </div>
                      
                      {/* Info */}
                      <div className="p-2">
                        <p className="text-xs font-bold text-slate-700 truncate">{meal.food_name}</p>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-[10px] text-slate-400">{formatDate(meal.created_at)}</span>
                          <span className="text-xs font-bold text-teal-600">{meal.calories} kcal</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 📊 DETAILED STATS */}
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 mb-4">
              <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">📊 Total Nutrients</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Total Calories</p>
                  <p className="text-xl font-black text-slate-800">{reportData.summary_stats.total_calories.toLocaleString()} <span className="text-sm font-medium">kcal</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Total Protein</p>
                  <p className="text-xl font-black text-red-500">{reportData.summary_stats.total_protein} <span className="text-sm font-medium">g</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Total Carbs</p>
                  <p className="text-xl font-black text-amber-500">{reportData.summary_stats.total_carbs} <span className="text-sm font-medium">g</span></p>
                </div>
                <div className="bg-slate-50 rounded-xl p-3">
                  <p className="text-xs text-slate-400">Total Fat</p>
                  <p className="text-xl font-black text-blue-500">{reportData.summary_stats.total_fat} <span className="text-sm font-medium">g</span></p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ========== EMPTY STATE (before generating) ========== */}
        {!reportData && !loading && !error && (
          <div className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-teal-100 to-cyan-100 rounded-full flex items-center justify-center">
              <span className="text-4xl">📊</span>
            </div>
            <p className="text-slate-600 font-bold mb-1">Ready to analyze your nutrition?</p>
            <p className="text-slate-400 text-sm">Select a date range and tap "Generate Report"</p>
          </div>
        )}
      </div>
    </div>
  );
}

