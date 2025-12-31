'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

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
  
  // 📤 Export States
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  // 🎯 PRESCRIPTION STATES
  const [prescription, setPrescription] = useState<any>(null);
  const [prescriptionLoading, setPrescriptionLoading] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 📄 DOWNLOAD PDF FUNCTION
  const handleDownloadPDF = async () => {
    if (!reportData || !reportRef.current) return;
    
    setIsExporting(true);
    try {
      // Dynamically import html2pdf.js (client-side only)
      const html2pdf = (await import('html2pdf.js')).default;
      
      const element = reportRef.current;
      const opt = {
        margin: [10, 10, 10, 10],
        filename: `Boleh_Makan_Report_${startDate}_to_${endDate}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true,
          allowTaint: true,
          logging: false
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait' 
        },
        enableLinks: true
      };
      
      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // 💬 SHARE TO WHATSAPP FUNCTION
  const handleShareWhatsApp = () => {
    if (!reportData) return;
    
    const stats = reportData.summary_stats;
    const sodiumStatus = reportData.sodium_sugar_watch?.sodium?.status || 'Unknown';
    const sugarStatus = reportData.sodium_sugar_watch?.sugar?.status || 'Unknown';
    
    // Construct the share message
    const message = `📊 *My Boleh Makan Nutrition Report*

📅 *Period:* ${startDate} to ${endDate}
🍽️ *Meals Logged:* ${stats.total_meals} meals over ${stats.total_days} days

📈 *Daily Averages:*
• Calories: ${stats.avg_daily_calories} kcal
• Sodium: ${stats.avg_daily_sodium}mg (${sodiumStatus})
• Sugar: ${stats.avg_daily_sugar}g (${sugarStatus})

💪 *Total Macros:*
• Protein: ${stats.total_protein}g
• Carbs: ${stats.total_carbs}g
• Fat: ${stats.total_fat}g

${insight ? `🩺 *Dr. Reza says:*\n"${insight}"` : ''}

📲 Tracked with Boleh Makan App`;

    // Encode and open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  // 🎯 FETCH PRESCRIPTION FROM DR. REZA
  const fetchPrescription = async (reportSummary: any) => {
    setPrescriptionLoading(true);
    setPrescription(null);
    setGoalSaved(false);
    
    try {
      const response = await fetch('/api/goals/generate-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getUserId(),
          report_summary: reportSummary
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setPrescription(result.data);
      }
    } catch (err) {
      console.error('Failed to fetch prescription:', err);
    } finally {
      setPrescriptionLoading(false);
    }
  };

  // 💾 ACCEPT CHALLENGE - SAVE GOAL
  const handleAcceptChallenge = async () => {
    if (!prescription) return;
    
    try {
      const response = await fetch('/api/goals/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: getUserId(),
          goal_description: prescription.suggested_goal_text,
          metric_target: prescription.target_metric || {}
        })
      });
      
      const result = await response.json();
      if (result.success) {
        setGoalSaved(true);
        setShowConfetti(true);
        
        // Hide confetti after 3 seconds
        setTimeout(() => setShowConfetti(false), 3000);
      } else {
        alert('Failed to save goal. Please try again.');
      }
    } catch (err) {
      console.error('Failed to save goal:', err);
      alert('Failed to save goal. Please try again.');
    }
  };

  // 🔄 REGENERATE PRESCRIPTION
  const handleRegeneratePrescription = () => {
    if (reportData) {
      fetchPrescription(reportData);
    }
  };

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
      
      // Fetch Dr. Reza's insight and prescription if we have data
      if (result.data.total_logs > 0) {
        fetchInsight(result.data);
        fetchPrescription(result.data);
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
          
          {/* Generate + Export Buttons */}
          <div className="space-y-3">
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
            
            {/* Export Buttons - Only show when report is generated */}
            {reportData && reportData.total_logs > 0 && (
              <div className="grid grid-cols-2 gap-3">
                {/* Download PDF Button */}
                <button
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-200/50 active:scale-[0.98] transition-transform disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isExporting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Exporting...</span>
                    </>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                      </svg>
                      <span>Download PDF</span>
                    </>
                  )}
                </button>
                
                {/* Share to WhatsApp Button */}
                <button
                  onClick={handleShareWhatsApp}
                  className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-200/50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            )}
          </div>
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
          <div ref={reportRef} id="report-content" className="bg-white">
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

            {/* 🎯 DR. REZA'S PRESCRIPTION FOR NEXT WEEK */}
            <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-rose-50 rounded-2xl p-4 shadow-sm border-2 border-amber-200 mb-4 relative overflow-hidden">
              {/* Prescription Header */}
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-amber-300 shadow">
                  <Image src="/assets/avatar-header.png" alt="Dr Reza" width={40} height={40} className="object-cover" />
                </div>
                <div>
                  <p className="text-sm font-bold text-amber-800">📋 Dr. Reza's Prescription</p>
                  <p className="text-xs text-amber-600">Your challenge for next week</p>
                </div>
              </div>

              {/* Loading State */}
              {prescriptionLoading && (
                <div className="py-8 text-center">
                  <div className="w-8 h-8 border-3 border-amber-400 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                  <p className="text-amber-600 text-sm font-medium">Dr. Reza is analyzing your report...</p>
                </div>
              )}

              {/* Prescription Content */}
              {prescription && !prescriptionLoading && (
                <>
                  {/* Problem Identified */}
                  <div className="bg-white/60 rounded-xl p-3 mb-3 border border-amber-200">
                    <p className="text-xs font-bold text-amber-700 mb-1">🔍 Issue Found:</p>
                    <p className="text-sm text-slate-700">{prescription.problem_identified}</p>
                  </div>

                  {/* The Goal - Styled like a prescription */}
                  <div className="bg-white rounded-xl p-4 mb-3 border-2 border-dashed border-amber-300 relative">
                    <div className="absolute -top-2 left-4 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ℞ MICRO-GOAL
                    </div>
                    <p className="text-base font-bold text-slate-800 leading-relaxed mt-2">
                      {prescription.suggested_goal_text}
                    </p>
                    
                    {/* Target Metric Badge */}
                    {prescription.target_metric?.target_value && (
                      <div className="mt-3 inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-lg px-3 py-1.5">
                        <span className="text-teal-600 text-xs font-bold">🎯 Target:</span>
                        <span className="text-teal-800 font-bold">
                          {prescription.target_metric.target_value} {prescription.target_metric.unit}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Motivation */}
                  <p className="text-sm text-amber-700 italic text-center mb-4">
                    "{prescription.motivation}"
                  </p>

                  {/* Action Buttons */}
                  {!goalSaved ? (
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={handleRegeneratePrescription}
                        disabled={prescriptionLoading}
                        className="py-3 bg-white border-2 border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                        </svg>
                        <span className="text-sm">Easier one</span>
                      </button>
                      <button
                        onClick={handleAcceptChallenge}
                        className="py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-green-200/50 active:scale-[0.98] transition-transform flex items-center justify-center gap-2"
                      >
                        <span>🎯</span>
                        <span>Accept Challenge!</span>
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-100 border-2 border-green-300 rounded-xl p-4 text-center">
                      <span className="text-3xl mb-2 block">🎉</span>
                      <p className="text-green-800 font-bold">Challenge Accepted!</p>
                      <p className="text-green-600 text-sm">Good luck with your goal this week!</p>
                    </div>
                  )}
                </>
              )}

              {/* Empty State */}
              {!prescription && !prescriptionLoading && (
                <div className="py-6 text-center">
                  <span className="text-3xl mb-2 block">📋</span>
                  <p className="text-amber-600 text-sm">Generate a report to get your personalized prescription!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* 🎊 CONFETTI ANIMATION */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-[100]">
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute animate-confetti"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: '-10px',
                  animationDelay: `${Math.random() * 0.5}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                <div 
                  className="w-3 h-3 rounded-sm"
                  style={{
                    backgroundColor: ['#F59E0B', '#10B981', '#6366F1', '#EC4899', '#EF4444'][Math.floor(Math.random() * 5)],
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                />
              </div>
            ))}
          </div>

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

