'use client';

import { useState, useRef, useEffect } from 'react';
import UserProfileModal, { UserProfile } from '@/components/UserProfileModal'; 

export default function CheckFoodPage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load profile on mount
  useEffect(() => {
    const saved = localStorage.getItem('user_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUserProfile(parsed);
      } catch (e) {
        console.error('Failed to load profile', e);
      }
    }
  }, []);

  // Calculate TDEE for display
  const getTDEE = () => {
    if (!userProfile) return null;
    let bmr;
    if (userProfile.gender === 'male') {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    return Math.round(bmr * (multipliers[userProfile.activityLevel] || 1.2));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeFood(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeFood = async (base64Image: string) => {
    setLoading(true);
    setResult(null);
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64Image.split(',')[1],
          userProfile: userProfile 
        }),
      });
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Dr. Reza is currently offline. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Boleh Makan</h1>
          <p className="text-xs text-teal-600 font-medium">AI Metabolic Intelligence</p>
        </div>
        
        {/* THE GEAR ICON BUTTON */}
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors"
        >
          <span className="text-xl">⚙️</span>
        </button>
      </div>

      {/* PERSONALIZATION BADGE */}
      {userProfile && (
        <div className="bg-teal-600 text-white px-4 py-2 text-xs font-medium text-center shadow-sm">
          🎯 Customized for {userProfile.goal.replace('_', ' ')} • Daily Limit: {getTDEE()} kcal
        </div>
      )}

      <div className="max-w-md mx-auto p-4">
        
        {/* CAMERA UPLOAD SECTION */}
        {!image && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="mt-8 border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-3xl">
              📸
            </div>
            <p className="text-slate-600 font-medium">Tap to Scan Meal</p>
            <p className="text-xs text-slate-400 mt-2">Dr. Reza is ready</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
              accept="image/*" 
              className="hidden" 
            />
          </div>
        )}

        {/* IMAGE PREVIEW & RESULTS */}
        {image && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img src={image} alt="Food" className="w-full object-cover" />
              
              {/* RETAKE BUTTON */}
              <button 
                onClick={() => { setImage(null); setResult(null); }}
                className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md"
              >
                ✕ Retake
              </button>

              {/* LOADING STATE */}
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="font-medium animate-pulse">Dr. Reza is analyzing...</p>
                </div>
              )}
            </div>

            {/* RESULTS DASHBOARD */}
            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* 1. INVENTORY TAGS */}
                {result.ingredients && (
                  <div className="flex flex-wrap gap-2 justify-center">
                    {result.ingredients.map((item: string, i: number) => (
                      <span key={i} className="px-3 py-1 bg-slate-200 text-slate-700 text-xs font-semibold rounded-full border border-slate-300">
                        {item}
                      </span>
                    ))}
                  </div>
                )}

                {/* 2. THE VITALS (MACROS) */}
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(result.macros).map(([key, data]: any) => (
                    <div key={key} className={`p-4 rounded-xl border ${
                      data.status === 'High' ? 'bg-red-50 border-red-200' :
                      data.status === 'Good' ? 'bg-green-50 border-green-200' :
                      'bg-amber-50 border-amber-200'
                    }`}>
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">{key}</p>
                      <div className="flex items-end gap-2">
                        <span className="text-2xl font-black text-slate-800">{data.value}</span>
                        {data.status === 'High' && <span className="text-[10px] font-bold text-red-600 mb-1">HIGH</span>}
                      </div>
                    </div>
                  ))}
                </div>

                {/* 3. DR REZA'S DIAGNOSIS */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">🩺</span> Dr. Reza's Verdict
                  </h3>
                  <div className="space-y-3">
                    {(result.analysis_content || result.analysis_points || []).map((point: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm text-slate-700 leading-relaxed">
                        <span className="text-teal-500 mt-1">•</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. ACTIONABLE ADVICE */}
                <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                  <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Quick Actions
                  </h3>
                  <div className="space-y-3">
                    {(result.actionable_advice || []).map((point: string, i: number) => (
                      <div key={i} className="flex gap-3 text-sm text-teal-800 leading-relaxed">
                        <span className="text-teal-600 font-bold">✓</span>
                        <span>{point}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs text-slate-400 mt-8">
                  AI Metabolic Consultant • Not Medical Advice
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* SETTINGS MODAL */}
      <UserProfileModal 
        open={showSettings} 
        onClose={() => setShowSettings(false)} 
        onSave={(profile) => {
          setUserProfile(profile);
          setShowSettings(false);
        }} 
      />

    </main>
  );
}