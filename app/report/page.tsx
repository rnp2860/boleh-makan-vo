// src/app/report/page.tsx
'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useFood } from '@/context/FoodContext';

export default function ReportPage() {
  const router = useRouter();
  const { meals, userProfile, getWeeklyStats, dailyBudget } = useFood();
  const [generating, setGenerating] = useState(false);
  const [drRezaSummary, setDrRezaSummary] = useState<string>('');
  const reportRef = useRef<HTMLDivElement>(null);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-slate-500 animate-pulse">Loading...</div>
      </div>
    );
  }

  const weeklyData = getWeeklyStats();
  const userName = userProfile.name || 'Patient';
  
  const weeklyTotals = weeklyData.reduce((acc, day) => ({
    calories: acc.calories + day.calories,
    protein: acc.protein + (day.protein || 0),
    carbs: acc.carbs + (day.carbs || 0),
    fat: acc.fat + (day.fat || 0),
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const daysWithData = weeklyData.filter(d => d.calories > 0).length;
  const avgCalories = daysWithData > 0 ? Math.round(weeklyTotals.calories / daysWithData) : 0;
  const avgProtein = daysWithData > 0 ? Math.round(weeklyTotals.protein / daysWithData) : 0;
  const avgCarbs = daysWithData > 0 ? Math.round(weeklyTotals.carbs / daysWithData) : 0;
  const avgFat = daysWithData > 0 ? Math.round(weeklyTotals.fat / daysWithData) : 0;

  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(today.getDate() - 6);
  const dateRange = `${weekAgo.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
  const reportDate = today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  const generateSummary = async () => {
    setGenerating(true);
    try {
      const response = await fetch('/api/generate-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ weeklyData, userProfile, dailyBudget, avgCalories, avgProtein, avgCarbs, avgFat })
      });
      const data = await response.json();
      setDrRezaSummary(data.summary || "Great progress this week! Keep tracking your meals consistently.");
    } catch (err) {
      setDrRezaSummary("You've been tracking well this week! Focus on balancing your macros and staying hydrated. Keep up the great work! 💪");
    } finally {
      setGenerating(false);
    }
  };

  const generateShareText = () => {
    return `📊 Weekly Nutrition Report | ${dateRange}
👤 ${userName}
📈 Avg Daily: ${avgCalories} kcal | P: ${avgProtein}g | C: ${avgCarbs}g | F: ${avgFat}g
🩺 Dr. Reza: "${drRezaSummary || 'Keep tracking!'}"
#BolehMakan`;
  };

  const handleShare = async (platform: string) => {
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    
    switch (platform) {
      case 'whatsapp': window.open(`https://wa.me/?text=${encodedText}`, '_blank'); break;
      case 'email': window.open(`mailto:?subject=Weekly Nutrition Report - ${userName}&body=${encodedText}`, '_blank'); break;
      case 'copy': await navigator.clipboard.writeText(text); alert('Report copied!'); break;
    }
  };

  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-slate-100 pb-8">
      {/* Top nav - hidden in print */}
      <div className="bg-white border-b border-slate-200 px-4 py-3 flex justify-between items-center print:hidden">
        <button onClick={() => router.back()} className="text-slate-600 font-medium flex items-center gap-1">
          ← Back
        </button>
        <h1 className="font-bold text-slate-800">Weekly Report</h1>
        <button onClick={handlePrint} className="text-teal-600 font-bold text-sm">
          📄 PDF
        </button>
      </div>

      {/* PRINTABLE REPORT */}
      <div ref={reportRef} className="max-w-2xl mx-auto bg-white my-4 mx-4 shadow-lg print:shadow-none print:my-0 print:mx-0 print:max-w-none">
        
        {/* HEADER */}
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white p-8 print:bg-teal-600">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  🍽️
                </div>
                <span className="font-bold text-teal-100 text-sm">BOLEH MAKAN</span>
              </div>
              <h1 className="text-2xl font-black mb-1">Weekly Nutrition Report</h1>
              <p className="text-teal-100 text-sm">{dateRange}</p>
            </div>
            <div className="text-right text-sm">
              <p className="text-teal-100">Report Generated</p>
              <p className="font-bold">{reportDate}</p>
            </div>
          </div>
        </div>

        {/* PATIENT INFO */}
        <div className="border-b border-slate-200 p-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-3xl">
              👤
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-slate-800">{userName}</h2>
              <div className="flex gap-4 text-sm text-slate-500 mt-1">
                {userProfile.details.age > 0 && <span>{userProfile.details.age} years</span>}
                {userProfile.details.weight > 0 && <span>{userProfile.details.weight} kg</span>}
                {userProfile.details.height > 0 && <span>{userProfile.details.height} cm</span>}
              </div>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">
                  Goal: {userProfile.goal === 'lose_weight' ? 'Weight Loss' : userProfile.goal === 'build_muscle' ? 'Muscle Building' : 'Maintenance'}
                </span>
                {userProfile.healthConditions.map(c => (
                  <span key={c} className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium">{c}</span>
                ))}
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase">Daily Target</p>
              <p className="text-2xl font-black text-teal-600">{dailyBudget}</p>
              <p className="text-xs text-slate-400">kcal</p>
            </div>
          </div>
        </div>

        {/* SUMMARY STATS */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Weekly Averages (Per Day)</h3>
          <div className="grid grid-cols-5 gap-3">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-2xl font-black text-blue-600">{avgCalories}</div>
              <div className="text-[10px] text-blue-500 font-medium uppercase">Calories</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-black text-green-600">{avgProtein}g</div>
              <div className="text-[10px] text-green-500 font-medium uppercase">Protein</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-xl">
              <div className="text-2xl font-black text-orange-500">{avgCarbs}g</div>
              <div className="text-[10px] text-orange-400 font-medium uppercase">Carbs</div>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-xl">
              <div className="text-2xl font-black text-amber-500">{avgFat}g</div>
              <div className="text-[10px] text-amber-400 font-medium uppercase">Fat</div>
            </div>
            <div className="text-center p-4 bg-slate-100 rounded-xl">
              <div className="text-2xl font-black text-slate-600">{daysWithData}/7</div>
              <div className="text-[10px] text-slate-400 font-medium uppercase">Days Logged</div>
            </div>
          </div>
        </div>

        {/* DAILY BREAKDOWN TABLE */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Daily Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-500 font-medium">Date</th>
                <th className="text-center py-2 text-slate-500 font-medium">Calories</th>
                <th className="text-center py-2 text-slate-500 font-medium">vs Target</th>
                <th className="text-right py-2 text-slate-500 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {weeklyData.map((day, index) => {
                const dayDate = new Date();
                dayDate.setDate(dayDate.getDate() - (6 - index));
                const diff = day.calories - dailyBudget;
                const pct = dailyBudget > 0 ? Math.round((day.calories / dailyBudget) * 100) : 0;
                
                return (
                  <tr key={index} className="border-b border-slate-100">
                    <td className="py-3 font-medium text-slate-700">
                      {dayDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </td>
                    <td className="py-3 text-center font-bold text-slate-800">
                      {day.calories > 0 ? `${day.calories} kcal` : '-'}
                    </td>
                    <td className="py-3 text-center">
                      {day.calories > 0 ? (
                        <span className={diff > 0 ? 'text-red-500' : 'text-green-500'}>
                          {diff > 0 ? '+' : ''}{diff}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="py-3 text-right">
                      {day.calories > 0 ? (
                        <span className={`text-xs px-2 py-1 rounded-full font-bold ${
                          pct > 110 ? 'bg-red-100 text-red-600' :
                          pct >= 90 ? 'bg-green-100 text-green-600' :
                          pct >= 70 ? 'bg-amber-100 text-amber-600' :
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {pct}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-300">No data</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* DR. REZA ASSESSMENT */}
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Clinical Assessment</h3>
          <div className="bg-slate-50 rounded-xl p-5 border border-slate-200">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-full bg-white shadow-sm overflow-hidden flex-shrink-0">
                <Image src="/assets/avatar-header.png" alt="Dr. Reza" width={56} height={56} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-bold text-slate-800">Dr. Reza's Summary</h4>
                  <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full">AI Nutritionist</span>
                </div>
                {drRezaSummary ? (
                  <p className="text-slate-600 text-sm leading-relaxed italic">"{drRezaSummary}"</p>
                ) : (
                  <button 
                    onClick={generateSummary}
                    disabled={generating}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors disabled:opacity-50 print:hidden"
                  >
                    {generating ? '⏳ Analyzing...' : '✨ Generate AI Assessment'}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-slate-50 text-center">
          <p className="text-xs text-slate-400 mb-2">
            This report is generated by Boleh Makan AI for informational purposes only.
          </p>
          <p className="text-xs text-slate-400">
            Please consult a healthcare professional for medical advice.
          </p>
          <div className="mt-4 pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-300">Report ID: BM-{Date.now().toString(36).toUpperCase()}</p>
          </div>
        </div>
      </div>

      {/* SHARE OPTIONS - Hidden in print */}
      <div className="max-w-2xl mx-auto px-4 print:hidden">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 text-center">Share This Report</h3>
          <div className="grid grid-cols-4 gap-3">
            <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2 p-3 bg-green-50 rounded-xl hover:bg-green-100">
              <span className="text-2xl">💬</span>
              <span className="text-[10px] font-bold text-green-700">WhatsApp</span>
            </button>
            <button onClick={() => handleShare('email')} className="flex flex-col items-center gap-2 p-3 bg-blue-50 rounded-xl hover:bg-blue-100">
              <span className="text-2xl">📧</span>
              <span className="text-[10px] font-bold text-blue-700">Email</span>
            </button>
            <button onClick={handlePrint} className="flex flex-col items-center gap-2 p-3 bg-amber-50 rounded-xl hover:bg-amber-100">
              <span className="text-2xl">📄</span>
              <span className="text-[10px] font-bold text-amber-700">Save PDF</span>
            </button>
            <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-2 p-3 bg-slate-100 rounded-xl hover:bg-slate-200">
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
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .print\\:hidden { display: none !important; }
          .print\\:bg-teal-600 { background-color: #0d9488 !important; }
        }
      `}</style>
    </div>
  );
}
