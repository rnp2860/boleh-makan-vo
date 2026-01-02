// src/app/profile/page.tsx
// 🎨 REDESIGNED: Beautiful gamified profile page
'use client';

import { useState, useEffect } from 'react';
import { useFood } from '@/context/FoodContext';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Trash2, AlertTriangle, Download, FileJson, Loader2, CheckCircle, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import DeleteAccountModal from '@/components/DeleteAccountModal';

export default function ProfilePage() {
  const { userProfile, setGoal, toggleCondition, updateDetails, dailyBudget, setManualOverride, setUserName } = useFood();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  
  // Export data states
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  // Get user ID on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const id = localStorage.getItem('boleh_makan_user_id');
      setUserId(id);
    }
  }, []);

  // Handle successful deletion - redirect after showing message
  useEffect(() => {
    if (deleteSuccess) {
      // Clear all local data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('boleh_makan_user_id');
        localStorage.removeItem('boleh_makan_profile');
        localStorage.removeItem('boleh_makan_meals');
        // Clear any other localStorage items with boleh_makan prefix
        const keys = Object.keys(localStorage);
        keys.forEach(key => {
          if (key.startsWith('boleh_makan')) {
            localStorage.removeItem(key);
          }
        });
        
        // Also clear sessionStorage
        const sessionKeys = Object.keys(sessionStorage);
        sessionKeys.forEach(key => {
          if (key.startsWith('boleh_makan')) {
            sessionStorage.removeItem(key);
          }
        });
      }
      
      // Redirect to landing page after a short delay
      setTimeout(() => {
        router.push('/?deleted=true');
      }, 1500);
    }
  }, [deleteSuccess, router]);

  const handleDeleteAccount = async () => {
    if (!userId) {
      throw new Error('User ID not found');
    }

    const response = await fetch('/api/user/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userId }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to delete account');
    }

    console.log('✅ Account deleted:', data);
    setShowDeleteModal(false);
    setDeleteSuccess(true);
  };

  // Handle data export
  const handleExportData = async () => {
    if (!userId) {
      alert('User ID not found');
      return;
    }

    setIsExporting(true);
    setExportSuccess(false);

    try {
      const response = await fetch(`/api/user/export?user_id=${encodeURIComponent(userId)}`);
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }

      const data = await response.json();

      // Create pretty-printed JSON
      const jsonString = JSON.stringify(data, null, 2);
      
      // Create Blob
      const blob = new Blob([jsonString], { type: 'application/json' });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Generate filename with date
      const dateStr = new Date().toISOString().split('T')[0];
      link.download = `boleh-makan-export-${dateStr}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Cleanup
      URL.revokeObjectURL(url);
      
      console.log('✅ Data exported successfully');
      setExportSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => setExportSuccess(false), 3000);
      
    } catch (err: any) {
      console.error('❌ Export failed:', err);
      alert('Failed to export data. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
        <div className="text-teal-500 font-bold animate-pulse">Loading Profile...</div>
      </div>
    );
  }

  const isGoal = (g: string) => userProfile.goal === g;
  const hasCondition = (c: string) => userProfile.healthConditions.includes(c);
  const { details, manualOverride } = userProfile;

  // Check if values are default/empty
  const isNameEmpty = !userProfile.name || userProfile.name.trim() === '';
  const isAgeDefault = !details.age || details.age === 0;
  const isHeightDefault = !details.height || details.height === 0;
  const isWeightDefault = !details.weight || details.weight === 0;

  // 🎯 Health Goals with images
  const healthGoals = [
    { id: 'lose_weight', label: 'Turun Berat', icon: '/assets/icon-weight-loss.png', color: 'emerald' },
    { id: 'maintain', label: 'Kekal Sihat', icon: '/assets/icon-maintain.png', color: 'blue' },
    { id: 'build_muscle', label: 'Bina Otot', icon: '/assets/icon-muscle.png', color: 'purple' },
  ];

  // 🏥 Health Conditions with images
  const healthConditions = [
    { id: 'Diabetes', label: 'Diabetes', sublabel: '(Blood Sugar)', icon: '/assets/icon-diabetes.png', color: 'rose' },
    { id: 'High Blood Pressure', label: 'Darah Tinggi', sublabel: '(Blood Pressure)', icon: '/assets/icon-kurang-masin.png', color: 'orange' },
    { id: 'High Cholesterol', label: 'Kolesterol', sublabel: '(Cholesterol)', icon: '/assets/icon-tak-nak-minyak.png', color: 'amber' },
    { id: 'Kidney Care', label: 'Jaga Buah Pinggang', sublabel: '(Kidney Care)', icon: '/assets/icon-jaga-kidney.png', color: 'violet' },
  ];

  // 🏃 Activity Levels
  const activityLevels = [
    { id: 'sedentary', label: 'Duduk Jer', emoji: '🪑', desc: 'Office/WFH' },
    { id: 'light', label: 'Ringan', emoji: '🚶', desc: 'Jalan sikit' },
    { id: 'moderate', label: 'Aktif', emoji: '🏃', desc: 'Gym 3x/week' },
    { id: 'active', label: 'Atlet', emoji: '🔥', desc: 'Daily workout' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-teal-50/30 pb-32 font-sans">
      
      {/* 🎨 HEADER - Compact with softer colors */}
      <div className="bg-gradient-to-br from-teal-400 via-teal-500 to-emerald-500 px-5 pt-6 pb-10 rounded-b-[32px] shadow-md">
        <div className="flex justify-between items-start mb-3">
          <div>
            <p className="text-teal-100 text-xs font-medium mb-0.5">Your Profile</p>
            <h1 className="text-xl font-black text-white tracking-tight">
              {isNameEmpty ? 'Foodie Friend' : userProfile.name} 👋
            </h1>
          </div>
          <button 
            onClick={() => router.push('/dashboard')} 
            className="bg-white/20 backdrop-blur px-3 py-1.5 rounded-lg text-sm font-bold text-white border border-white/30"
          >
            Done
          </button>
        </div>
        
        {/* Dr. Reza Avatar - Compact */}
        <div className="flex items-center gap-3 bg-white/15 backdrop-blur rounded-xl p-3 mt-2">
          <div className="w-12 h-14 rounded-xl overflow-hidden bg-white/20 flex-shrink-0 shadow-lg">
            <Image src="/assets/avatar-profile.png" alt="Dr. Reza" width={48} height={56} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-white text-xs font-medium leading-relaxed">
              "Tell me about yourself so I can help you better!"
            </p>
            <p className="text-white/60 text-[10px] mt-0.5">— Dr. Reza</p>
          </div>
        </div>
      </div>

      {/* 📝 CONTENT */}
      <div className="px-5 -mt-8 space-y-4">
        
        {/* NAME CARD */}
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">
            Your Name <span className="font-normal normal-case text-slate-300">(what should Dr. Reza call you?)</span>
          </label>
          <input 
            value={userProfile.name} 
            onChange={(e) => setUserName(e.target.value)} 
            className={`w-full text-xl font-bold outline-none bg-transparent ${isNameEmpty ? 'text-slate-300' : 'text-slate-800'}`}
            placeholder="Enter your name or nickname"
          />
        </div>

        {/* PHYSICAL STATS */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Age</label>
            <div className="flex items-baseline gap-1">
              <input 
                type="number" 
                value={details.age || ''} 
                onChange={(e) => updateDetails({ age: Number(e.target.value) })}
                placeholder="25"
                className={`w-full text-2xl font-black outline-none bg-transparent placeholder-slate-300 ${isAgeDefault ? 'text-slate-300' : 'text-slate-800'}`}
              />
              <span className="text-slate-300 text-sm">yrs</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Gender</label>
            <div className="flex bg-slate-100 rounded-xl p-1">
              <button 
                onClick={() => updateDetails({ gender: 'male' })} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${details.gender === 'male' ? 'bg-white shadow-md text-blue-600' : 'text-slate-400'}`}
              >
                👨 Male
              </button>
              <button 
                onClick={() => updateDetails({ gender: 'female' })} 
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${details.gender === 'female' ? 'bg-white shadow-md text-pink-500' : 'text-slate-400'}`}
              >
                👩 Female
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Height</label>
            <div className="flex items-baseline gap-1">
              <input 
                type="number" 
                value={details.height || ''} 
                onChange={(e) => updateDetails({ height: Number(e.target.value) })}
                placeholder="165"
                className={`w-full text-2xl font-black outline-none bg-transparent placeholder-slate-300 ${isHeightDefault ? 'text-slate-300' : 'text-slate-800'}`}
              />
              <span className="text-slate-300 text-sm">cm</span>
            </div>
          </div>
          <div className="bg-white p-4 rounded-2xl shadow-md border border-slate-100">
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 block">Weight</label>
            <div className="flex items-baseline gap-1">
              <input 
                type="number" 
                value={details.weight || ''} 
                onChange={(e) => updateDetails({ weight: Number(e.target.value) })}
                placeholder="60"
                className={`w-full text-2xl font-black outline-none bg-transparent placeholder-slate-300 ${isWeightDefault ? 'text-slate-300' : 'text-slate-800'}`}
              />
              <span className="text-slate-300 text-sm">kg</span>
            </div>
          </div>
        </div>

        {/* 🎯 HEALTH GOAL */}
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">🎯 Health Goal</label>
          <div className="grid grid-cols-3 gap-3">
            {healthGoals.map((goal) => (
              <button 
                key={goal.id}
                onClick={() => setGoal(goal.id as any)} 
                className={`relative p-3 rounded-2xl border-2 transition-all duration-300 ${
                  isGoal(goal.id) 
                    ? `border-${goal.color}-400 bg-${goal.color}-50 ring-4 ring-${goal.color}-400/20 scale-105` 
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
                style={{
                  borderColor: isGoal(goal.id) ? (goal.color === 'emerald' ? '#34d399' : goal.color === 'blue' ? '#60a5fa' : '#a78bfa') : undefined,
                  backgroundColor: isGoal(goal.id) ? (goal.color === 'emerald' ? '#d1fae5' : goal.color === 'blue' ? '#dbeafe' : '#ede9fe') : undefined,
                  transform: isGoal(goal.id) ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: isGoal(goal.id) ? `0 0 20px ${goal.color === 'emerald' ? 'rgba(52,211,153,0.3)' : goal.color === 'blue' ? 'rgba(96,165,250,0.3)' : 'rgba(167,139,250,0.3)'}` : 'none'
                }}
              >
                <div className={`mx-auto mb-2 rounded-xl overflow-hidden transition-all duration-300 ${isGoal(goal.id) ? 'w-16 h-16' : 'w-14 h-14'}`}>
                  <Image src={goal.icon} alt={goal.label} width={64} height={64} className="w-full h-full object-contain" />
                </div>
                <p className={`text-xs font-bold text-center ${isGoal(goal.id) ? 'text-slate-700' : 'text-slate-500'}`}>
                  {goal.label}
                </p>
                {isGoal(goal.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-teal-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 🏃 ACTIVITY LEVEL - 2x2 Grid */}
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 block">🏃 Activity Level</label>
          <div className="grid grid-cols-2 gap-2">
            {activityLevels.map((level) => (
              <button 
                key={level.id}
                onClick={() => updateDetails({ activity: level.id as any })}
                className={`p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                  details.activity === level.id 
                    ? 'bg-orange-50 border-orange-300 shadow-md' 
                    : 'bg-slate-50 border-transparent hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl">{level.emoji}</span>
                <div className="text-left">
                  <p className={`text-sm font-bold ${details.activity === level.id ? 'text-orange-700' : 'text-slate-600'}`}>
                    {level.label}
                  </p>
                  <p className="text-[10px] text-slate-400">{level.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 🏥 HEALTH CONDITIONS */}
        <div className="bg-white p-5 rounded-3xl shadow-lg border border-slate-100">
          <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">🏥 Health Conditions</label>
          <p className="text-xs text-slate-400 mb-4 -mt-1">Select any that apply to you</p>
          <div className="grid grid-cols-2 gap-3">
            {healthConditions.map((condition) => (
              <button 
                key={condition.id}
                onClick={() => toggleCondition(condition.id)} 
                className={`relative p-3 rounded-2xl border-2 transition-all duration-300 ${
                  hasCondition(condition.id) 
                    ? 'border-red-300 bg-red-50 shadow-md scale-[1.02]' 
                    : 'border-slate-100 bg-slate-50 hover:border-slate-200'
                }`}
                style={{
                  boxShadow: hasCondition(condition.id) ? '0 0 15px rgba(239,68,68,0.2)' : 'none'
                }}
              >
                <div className={`w-14 h-14 mx-auto mb-2 rounded-xl overflow-hidden transition-all ${hasCondition(condition.id) ? 'scale-110' : ''}`}>
                  <Image src={condition.icon} alt={condition.label} width={56} height={56} className="w-full h-full object-contain" />
                </div>
                <p className={`text-sm font-bold text-center ${hasCondition(condition.id) ? 'text-red-600' : 'text-slate-600'}`}>
                  {condition.label}
                </p>
                <p className={`text-[10px] text-center ${hasCondition(condition.id) ? 'text-red-400' : 'text-slate-400'}`}>
                  {condition.sublabel}
                </p>
                {hasCondition(condition.id) && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 🔢 DAILY TARGET */}
        <div className="bg-gradient-to-br from-slate-100 to-slate-200 p-5 rounded-3xl shadow-lg border border-slate-200">
          <div className="flex justify-between items-center mb-3">
            <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">🔢 Daily Calorie Target</label>
            <span className="text-xs font-bold text-teal-600 bg-teal-100 px-3 py-1 rounded-lg">
              Auto: {dailyBudget} kcal
            </span>
          </div>
          
          {/* Input box with visible border */}
          <div className="bg-white rounded-xl border-2 border-slate-300 p-3 mb-3">
            <input 
              type="number" 
              placeholder="Leave empty for auto" 
              value={manualOverride || ''}
              onChange={(e) => setManualOverride(e.target.value ? Number(e.target.value) : null)}
              className="w-full text-2xl font-black text-slate-800 outline-none bg-transparent placeholder-slate-400 placeholder:text-base placeholder:font-medium" 
            />
          </div>
          
          <p className="text-[10px] text-slate-500 mb-4">
            💡 Override only if you have a specific target from a dietitian.
          </p>
          
          {/* Scientific Method Explanation */}
          <div className="bg-white/60 rounded-xl p-4 border border-slate-200">
            <div className="flex items-start gap-3">
              <span className="text-xl">🔬</span>
              <div>
                <p className="text-xs font-bold text-slate-700 mb-1">How We Calculate</p>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  We use the <span className="font-semibold text-teal-600">Mifflin-St Jeor Equation</span> — 
                  the gold standard method recommended by dietitians worldwide. 
                  Your BMR is calculated from age, height, weight & gender, 
                  then multiplied by your activity level to get your TDEE (Total Daily Energy Expenditure).
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ============================================ */}
        {/* 📦 YOUR DATA SECTION - PDPA Compliance */}
        {/* ============================================ */}
        <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-200">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-3xl border-2 border-blue-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <FileJson className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-blue-700 text-sm">Your Data</h3>
                <p className="text-blue-600/70 text-xs mt-0.5">
                  Access and download all your personal data
                </p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-2xl p-4 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 text-sm">Download My Data</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Export all meals, vitals, and goals as JSON
                  </p>
                </div>
                <button
                  onClick={handleExportData}
                  disabled={isExporting}
                  className={`px-4 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-md ${
                    exportSuccess
                      ? 'bg-green-500 text-white shadow-green-200'
                      : isExporting
                      ? 'bg-blue-400 text-white cursor-wait shadow-blue-200'
                      : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-200'
                  }`}
                >
                  {exportSuccess ? (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Downloaded!
                    </>
                  ) : isExporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download
                    </>
                  )}
                </button>
              </div>
              
              {/* What's included */}
              <div className="mt-3 pt-3 border-t border-blue-100">
                <p className="text-xs text-slate-500 mb-2 font-medium">Includes:</p>
                <div className="flex flex-wrap gap-2">
                  {['🍽️ Meal Logs', '🩸 Vitals', '🎯 Goals', '📊 Metadata'].map((item) => (
                    <span key={item} className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-lg">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              
              {/* PDPA Notice */}
              <div className="mt-3 pt-3 border-t border-blue-100">
                <p className="text-xs text-slate-500">
                  🇲🇾 <span className="font-medium">PDPA Rights:</span> Under Malaysia's Personal Data Protection Act 2010, 
                  you have the right to access and obtain a copy of your personal data.
                </p>
              </div>
            </div>
            
            {/* Privacy Policy Link */}
            <Link 
              href="/privacy-policy"
              className="mt-4 flex items-center justify-center gap-2 w-full py-3 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl font-medium text-sm transition-colors"
            >
              <span>Read Full Privacy Policy</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* ============================================ */}
        {/* 🗑️ DELETE ACCOUNT SECTION - PDPA Compliance */}
        {/* ============================================ */}
        <div className="mt-6">
          <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-3xl border-2 border-red-200">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="font-bold text-red-700 text-sm">Danger Zone</h3>
                <p className="text-red-600/70 text-xs mt-0.5">
                  Actions here are permanent and cannot be undone
                </p>
              </div>
            </div>
            
            <div className="bg-white/60 rounded-2xl p-4 border border-red-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-slate-700 text-sm">Delete Account</p>
                  <p className="text-slate-500 text-xs mt-0.5">
                    Permanently delete your account and all data
                  </p>
                </div>
                <button
                  onClick={() => setShowDeleteModal(true)}
                  className="px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-colors shadow-md shadow-red-200"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
              
              {/* PDPA Notice */}
              <div className="mt-3 pt-3 border-t border-red-100">
                <p className="text-xs text-slate-500">
                  🇲🇾 <span className="font-medium">PDPA Rights:</span> Under Malaysia's Personal Data Protection Act 2010, 
                  you have the right to request deletion of your personal data.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SPACER */}
        <div className="h-4"></div>
      </div>

      {/* DELETE ACCOUNT MODAL */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirmDelete={handleDeleteAccount}
        userName={userProfile.name || undefined}
      />

      {/* SUCCESS TOAST */}
      {deleteSuccess && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm w-full text-center animate-in zoom-in-95">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-800 mb-2">Account Deleted</h3>
            <p className="text-slate-500 text-sm mb-4">
              Your account and all data have been permanently deleted.
            </p>
            <p className="text-slate-400 text-xs">Redirecting to home page...</p>
          </div>
        </div>
      )}
    </div>
  );
}
