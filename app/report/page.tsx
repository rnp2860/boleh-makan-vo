// src/app/report/page.tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFood } from '@/context/FoodContext';

export default function ReportPage() {
  const router = useRouter();
  const { meals, userProfile, dailyBudget } = useFood();
  const [generating, setGenerating] = useState(false);
  const [drRezaSummary, setDrRezaSummary] = useState<string>('');
  const [reportPeriod, setReportPeriod] = useState<'week' | 'month'>('week');

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  const userName = userProfile.name || 'Patient';
  const today = new Date();
  const reportDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const reportTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  const reportId = `BM-${Date.now().toString(36).toUpperCase()}`;

  // Get meals for selected period (max 1 month)
  const periodDays = reportPeriod === 'week' ? 7 : 30;
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - periodDays + 1);
  startDate.setHours(0, 0, 0, 0);

  const periodMeals = useMemo(() => {
    return meals.filter(meal => {
      const mealDate = new Date(meal.timestamp);
      return mealDate >= startDate && mealDate <= today;
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [meals, startDate, today]);

  const dateRange = `${startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;

  // Calculate statistics
  const stats = useMemo(() => {
    const totalCalories = periodMeals.reduce((sum, m) => sum + (m.calories || 0), 0);
    const totalProtein = periodMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
    const totalCarbs = periodMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
    const totalFat = periodMeals.reduce((sum, m) => sum + (m.fat || 0), 0);
    const totalSodium = periodMeals.reduce((sum, m) => sum + (m.sodium || 0), 0);
    const totalSugar = periodMeals.reduce((sum, m) => sum + (m.sugar || 0), 0);
    
    // Count unique days with meals
    const uniqueDays = new Set(periodMeals.map(m => new Date(m.timestamp).toDateString())).size;
    
    return {
      totalMeals: periodMeals.length,
      daysTracked: uniqueDays,
      avgCalories: uniqueDays > 0 ? Math.round(totalCalories / uniqueDays) : 0,
      avgProtein: uniqueDays > 0 ? Math.round(totalProtein / uniqueDays) : 0,
      avgCarbs: uniqueDays > 0 ? Math.round(totalCarbs / uniqueDays) : 0,
      avgFat: uniqueDays > 0 ? Math.round(totalFat / uniqueDays) : 0,
      avgSodium: uniqueDays > 0 ? Math.round(totalSodium / uniqueDays) : 0,
      avgSugar: uniqueDays > 0 ? Math.round(totalSugar / uniqueDays) : 0,
      calorieAdherence: dailyBudget > 0 ? Math.round((totalCalories / uniqueDays / dailyBudget) * 100) : 0,
    };
  }, [periodMeals, dailyBudget]);

  // Group meals by date for display
  const mealsByDate = useMemo(() => {
    const grouped: { [key: string]: typeof periodMeals } = {};
    periodMeals.forEach(meal => {
      const dateKey = new Date(meal.timestamp).toDateString();
      if (!grouped[dateKey]) grouped[dateKey] = [];
      grouped[dateKey].push(meal);
    });
    return grouped;
  }, [periodMeals]);

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          weeklyData: Object.entries(mealsByDate).map(([date, meals]) => ({
            date,
            meals: meals.length,
            calories: meals.reduce((s, m) => s + (m.calories || 0), 0),
          })),
          userProfile, 
          dailyBudget, 
          ...stats 
        })
      });
      const data = await response.json();
      setDrRezaSummary(data.summary || "Patient has been tracking meals consistently. Continue monitoring intake and maintaining balanced nutrition.");
    } catch (err) {
      setDrRezaSummary("Patient demonstrates commitment to nutritional tracking. Recommend continued monitoring and consultation with healthcare provider for personalized guidance.");
    } finally {
      setGenerating(false);
    }
  };

  const handlePrint = () => window.print();

  const getGoalText = () => {
    if (userProfile.goal === 'lose_weight') return 'Weight Management';
    if (userProfile.goal === 'build_muscle') return 'Muscle Development';
    return 'Weight Maintenance';
  };

  const getBMI = () => {
    if (userProfile.details.height > 0 && userProfile.details.weight > 0) {
      const heightM = userProfile.details.height / 100;
      return (userProfile.details.weight / (heightM * heightM)).toFixed(1);
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-slate-200 pb-8">
      {/* Top nav - hidden in print */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center print:hidden">
        <button onClick={() => router.back()} className="text-slate-600 font-medium flex items-center gap-1">
          ← Back
        </button>
        <div className="flex gap-2">
          <button 
            onClick={() => setReportPeriod('week')}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition ${reportPeriod === 'week' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            7 Days
          </button>
          <button 
            onClick={() => setReportPeriod('month')}
            className={`px-3 py-1 rounded-lg text-sm font-bold transition ${reportPeriod === 'month' ? 'bg-teal-500 text-white' : 'bg-slate-100 text-slate-600'}`}
          >
            30 Days
          </button>
        </div>
        <button onClick={handlePrint} className="text-teal-600 font-bold text-sm">
          📄 PDF
        </button>
      </div>

      {/* PROFESSIONAL MEDICAL REPORT */}
      <div className="max-w-[210mm] mx-auto bg-white my-4 shadow-xl print:shadow-none print:my-0 print:mx-0 print:max-w-none" style={{ minHeight: '297mm' }}>
        
        {/* ═══════════════ HEADER ═══════════════ */}
        <div className="border-b-4 border-teal-600 p-6 print:p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg print:w-12 print:h-12">
                <span className="text-3xl print:text-2xl">🍽️</span>
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 print:text-xl">BOLEH MAKAN</h1>
                <p className="text-xs text-slate-500 font-medium">AI-Powered Nutritional Analysis Platform</p>
                <p className="text-[10px] text-slate-400">www.boleh-makan.vercel.app</p>
              </div>
            </div>
            <div className="text-right">
              <h2 className="text-lg font-black text-teal-700 uppercase tracking-wide print:text-base">Nutrition Report</h2>
              <p className="text-xs text-slate-500">{dateRange}</p>
              <p className="text-[10px] text-slate-400 mt-1">Report ID: {reportId}</p>
            </div>
          </div>
        </div>

        {/* ═══════════════ PATIENT INFO ═══════════════ */}
        <div className="grid grid-cols-2 border-b border-slate-200">
          <div className="p-4 border-r border-slate-200 print:p-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Patient Information</h3>
            <table className="w-full text-sm print:text-xs">
              <tbody>
                <tr><td className="text-slate-500 py-0.5 w-24">Name:</td><td className="font-bold text-slate-800">{userName}</td></tr>
                <tr><td className="text-slate-500 py-0.5">Age:</td><td className="font-medium text-slate-700">{userProfile.details.age > 0 ? `${userProfile.details.age} years` : 'Not specified'}</td></tr>
                <tr><td className="text-slate-500 py-0.5">Gender:</td><td className="font-medium text-slate-700 capitalize">{userProfile.details.gender}</td></tr>
                <tr><td className="text-slate-500 py-0.5">Height:</td><td className="font-medium text-slate-700">{userProfile.details.height > 0 ? `${userProfile.details.height} cm` : 'N/A'}</td></tr>
                <tr><td className="text-slate-500 py-0.5">Weight:</td><td className="font-medium text-slate-700">{userProfile.details.weight > 0 ? `${userProfile.details.weight} kg` : 'N/A'}</td></tr>
                <tr><td className="text-slate-500 py-0.5">BMI:</td><td className="font-bold text-slate-800">{getBMI()}</td></tr>
              </tbody>
            </table>
          </div>
          <div className="p-4 print:p-3">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Health Profile</h3>
            <table className="w-full text-sm print:text-xs">
              <tbody>
                <tr><td className="text-slate-500 py-0.5 w-28">Primary Goal:</td><td className="font-bold text-teal-700">{getGoalText()}</td></tr>
                <tr><td className="text-slate-500 py-0.5">Daily Target:</td><td className="font-bold text-slate-800">{dailyBudget} kcal</td></tr>
                <tr><td className="text-slate-500 py-0.5">Activity:</td><td className="font-medium text-slate-700 capitalize">{userProfile.details.activity}</td></tr>
                <tr>
                  <td className="text-slate-500 py-0.5 align-top">Conditions:</td>
                  <td className="font-medium text-slate-700">
                    {userProfile.healthConditions.length > 0 
                      ? userProfile.healthConditions.join(', ')
                      : <span className="text-slate-400">None reported</span>
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* ═══════════════ SUMMARY METRICS ═══════════════ */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 print:p-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Period Summary: {reportPeriod === 'week' ? '7 Days' : '30 Days'}</h3>
          <div className="grid grid-cols-8 gap-1">
            <div className="text-center p-1.5 bg-white rounded-lg border border-slate-200">
              <div className="text-sm font-black text-slate-800">{stats.totalMeals}</div>
              <div className="text-[7px] text-slate-500 font-medium uppercase">Meals</div>
            </div>
            <div className="text-center p-1.5 bg-white rounded-lg border border-slate-200">
              <div className="text-sm font-black text-slate-800">{stats.daysTracked}</div>
              <div className="text-[7px] text-slate-500 font-medium uppercase">Days</div>
            </div>
            <div className="text-center p-1.5 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-sm font-black text-blue-600">{stats.avgCalories}</div>
              <div className="text-[7px] text-blue-500 font-medium uppercase">kcal</div>
            </div>
            <div className="text-center p-1.5 bg-green-50 rounded-lg border border-green-200">
              <div className="text-sm font-black text-green-600">{stats.avgProtein}g</div>
              <div className="text-[7px] text-green-500 font-medium uppercase">Protein</div>
            </div>
            <div className="text-center p-1.5 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-sm font-black text-orange-500">{stats.avgCarbs}g</div>
              <div className="text-[7px] text-orange-400 font-medium uppercase">Carbs</div>
            </div>
            <div className="text-center p-1.5 bg-amber-50 rounded-lg border border-amber-200">
              <div className="text-sm font-black text-amber-500">{stats.avgFat}g</div>
              <div className="text-[7px] text-amber-400 font-medium uppercase">Fat</div>
            </div>
            <div className="text-center p-1.5 bg-pink-50 rounded-lg border border-pink-200">
              <div className="text-sm font-black text-pink-500">{stats.avgSugar}g</div>
              <div className="text-[7px] text-pink-400 font-medium uppercase">Sugar</div>
            </div>
            <div className="text-center p-1.5 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-sm font-black text-purple-500">{stats.avgSodium}</div>
              <div className="text-[7px] text-purple-400 font-medium uppercase">Na(mg)</div>
            </div>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex-1 bg-slate-200 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all ${
                  stats.calorieAdherence > 110 ? 'bg-red-500' :
                  stats.calorieAdherence >= 90 ? 'bg-green-500' :
                  stats.calorieAdherence >= 70 ? 'bg-amber-500' : 'bg-slate-400'
                }`}
                style={{ width: `${Math.min(stats.calorieAdherence, 150)}%` }}
              />
            </div>
            <span className={`text-sm font-bold ${
              stats.calorieAdherence > 110 ? 'text-red-600' :
              stats.calorieAdherence >= 90 ? 'text-green-600' :
              stats.calorieAdherence >= 70 ? 'text-amber-600' : 'text-slate-500'
            }`}>
              {stats.calorieAdherence}% of target
            </span>
          </div>
        </div>

        {/* ═══════════════ MEAL LOG WITH THUMBNAILS ═══════════════ */}
        <div className="p-4 border-b border-slate-200 print:p-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Meal Log (Most Recent)</h3>
          <div className="grid grid-cols-2 gap-3 print:gap-2">
            {periodMeals.slice(0, 8).map((meal, index) => (
              <div key={meal.id || index} className="flex gap-2 p-2 bg-slate-50 rounded-lg border border-slate-100 print:p-1">
                {/* Meal Thumbnail */}
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200 flex-shrink-0 print:w-10 print:h-10">
                  {meal.image ? (
                    <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xl">🍽️</div>
                  )}
                </div>
                {/* Meal Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-800 truncate print:text-[10px]">{meal.name}</p>
                  <p className="text-[10px] text-slate-400 print:text-[8px]">
                    {new Date(meal.timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • {new Date(meal.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <div className="flex gap-2 mt-0.5">
                    <span className="text-[9px] font-bold text-blue-600 print:text-[8px]">{meal.calories} kcal</span>
                    <span className="text-[9px] text-slate-400 print:text-[8px]">P:{meal.protein}g</span>
                    <span className="text-[9px] text-slate-400 print:text-[8px]">C:{meal.carbs}g</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {periodMeals.length > 8 && (
            <p className="text-[10px] text-slate-400 text-center mt-2">+ {periodMeals.length - 8} more meals in this period</p>
          )}
          {periodMeals.length === 0 && (
            <p className="text-sm text-slate-400 text-center py-4">No meals logged in this period</p>
          )}
        </div>

        {/* ═══════════════ CLINICAL ASSESSMENT ═══════════════ */}
        <div className="p-4 border-b border-slate-200 print:p-3">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3">Clinical Assessment</h3>
          <div className="bg-gradient-to-br from-teal-50 to-emerald-50 rounded-xl p-4 border border-teal-200 print:p-3">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-full bg-white shadow-sm overflow-hidden flex-shrink-0 border-2 border-teal-200 print:w-10 print:h-10">
                <Image src="/assets/avatar-header.png" alt="Dr. Reza" width={48} height={48} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800 text-sm print:text-xs">Dr. Reza's Assessment</h4>
                  <span className="text-[9px] bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">AI Nutritionist</span>
                </div>
                {drRezaSummary ? (
                  <p className="text-slate-600 text-xs leading-relaxed print:text-[10px]">"{drRezaSummary}"</p>
                ) : (
                  <button 
                    onClick={generateSummary}
                    disabled={generating}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50 print:hidden"
                  >
                    {generating ? '⏳ Analyzing...' : '✨ Generate AI Assessment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ FOOTER ═══════════════ */}
        <div className="p-4 bg-slate-100 print:p-3">
          <div className="flex justify-between items-start text-[9px] text-slate-400">
            <div>
              <p className="font-bold text-slate-500 mb-1">Disclaimer</p>
              <p className="max-w-md leading-relaxed">
                This report is generated by Boleh Makan AI for informational and tracking purposes only. 
                It does not constitute medical advice. Please consult a qualified healthcare professional 
                or registered dietitian for personalized nutritional guidance.
              </p>
            </div>
            <div className="text-right">
              <p className="font-bold text-slate-500 mb-1">Report Details</p>
              <p>Generated: {reportDate}</p>
              <p>Time: {reportTime}</p>
              <p>ID: {reportId}</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-200 flex justify-between items-center">
            <p className="text-[8px] text-slate-400">© 2024 Boleh Makan - AI Nutritional Intelligence</p>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-teal-500 rounded flex items-center justify-center">
                <span className="text-white text-xs">🍽️</span>
              </div>
              <span className="text-[10px] font-bold text-slate-500">BOLEH MAKAN</span>
            </div>
          </div>
        </div>
      </div>

      {/* SHARE OPTIONS - Hidden in print */}
      <div className="max-w-[210mm] mx-auto px-4 print:hidden">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-center">Share This Report</h3>
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(`📊 My Nutrition Report (${dateRange})\n👤 ${userName}\n📈 Avg: ${stats.avgCalories} kcal/day\n\nGenerated by Boleh Makan\nhttps://boleh-makan.vercel.app`)}`, '_blank')} className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-xl hover:bg-green-100">
              <span className="text-2xl">💬</span>
              <span className="text-[10px] font-bold text-green-700">WhatsApp</span>
            </button>
            <button onClick={() => window.open(`mailto:?subject=Nutrition Report - ${userName}&body=${encodeURIComponent(`My Nutrition Report\nPeriod: ${dateRange}\n\nAverage Daily Intake:\n• Calories: ${stats.avgCalories} kcal\n• Protein: ${stats.avgProtein}g\n• Carbs: ${stats.avgCarbs}g\n• Fat: ${stats.avgFat}g\n\nGenerated by Boleh Makan\nhttps://boleh-makan.vercel.app`)}`, '_blank')} className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-xl hover:bg-blue-100">
              <span className="text-2xl">📧</span>
              <span className="text-[10px] font-bold text-blue-700">Email</span>
            </button>
            <button onClick={handlePrint} className="flex flex-col items-center gap-2 p-3 bg-amber-50 rounded-xl hover:bg-amber-100">
              <span className="text-2xl">📄</span>
              <span className="text-[10px] font-bold text-amber-700">Save PDF</span>
            </button>
            <button onClick={() => { navigator.clipboard.writeText(`My Nutrition Report (${dateRange})\nAvg: ${stats.avgCalories} kcal/day | P:${stats.avgProtein}g C:${stats.avgCarbs}g F:${stats.avgFat}g\n\nGenerated by Boleh Makan`); alert('Copied!'); }} className="flex flex-col items-center gap-2 p-3 bg-slate-100 rounded-xl hover:bg-slate-200">
              <span className="text-2xl">📋</span>
              <span className="text-[10px] font-bold text-slate-700">Copy</span>
            </button>
          </div>
        </div>
        
        {/* Back button at bottom */}
        <button 
          onClick={() => router.back()}
          className="w-full mt-4 py-4 bg-slate-800 text-white font-bold rounded-2xl"
        >
          ← Back to Diary
        </button>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          @page { 
            size: A4; 
            margin: 10mm;
          }
          body { 
            -webkit-print-color-adjust: exact !important; 
            print-color-adjust: exact !important;
            color-adjust: exact !important;
          }
          .print\\:hidden { display: none !important; }
        }
      `}</style>
    </div>
  );
}
