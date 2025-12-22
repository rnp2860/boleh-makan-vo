'use client';

import { useState, useRef, useEffect } from 'react';
import UserProfileModal, { UserProfile } from '@/components/UserProfileModal'; 

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Daily Stats State
  const [dailyStats, setDailyStats] = useState({ calories: 0, count: 0 });

  // Edit Mode State
  const [isEditing, setIsEditing] = useState(false);
  const [editableIngredients, setEditableIngredients] = useState<string[]>([]);
  const [newIngredient, setNewIngredient] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Load Profile & Daily Stats on Mount
  useEffect(() => {
    // Load Profile
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try { 
        setUserProfile(JSON.parse(savedProfile)); 
      } catch (e) { 
        setShowSettings(true); 
      }
    } else {
      setShowSettings(true);
    }

    // Load Daily Stats
    const today = new Date().toISOString().split('T')[0];
    const savedLog = localStorage.getItem('daily_log');
    
    if (savedLog) {
       const log = JSON.parse(savedLog);
       // Reset if it's a new day
       if (log.date !== today) {
         localStorage.setItem('daily_log', JSON.stringify({ date: today, items: [] }));
         setDailyStats({ calories: 0, count: 0 });
       } else {
         // Sum up existing logs
         const totalCals = log.items.reduce((acc: number, item: any) => acc + (parseInt(item.calories) || 0), 0);
         setDailyStats({ calories: totalCals, count: log.items.length });
       }
    }
  }, []);

  // 2. Add Calorie Scan to History
  const addToDailyLog = (calories: string) => {
    const today = new Date().toISOString().split('T')[0];
    const val = parseInt(calories) || 0;
    
    // Read existing
    const savedLog = localStorage.getItem('daily_log');
    let log = savedLog ? JSON.parse(savedLog) : { date: today, items: [] };
    
    // Reset if day changed
    if (log.date !== today) log = { date: today, items: [] };

    // Add new entry
    log.items.push({ calories: val, timestamp: new Date() });
    localStorage.setItem('daily_log', JSON.stringify(log));

    // Update UI
    setDailyStats(prev => ({ 
      calories: prev.calories + val, 
      count: prev.count + 1 
    }));
  };

  // 3. Calculate Daily Limit (Priority: Manual > Calculated)
  const getTDEE = () => {
    if (!userProfile) return 2000; // Default fallback
    
    // Priority: User's Manual Limit
    if (userProfile.customCalorieLimit && userProfile.customCalorieLimit > 0) {
        return userProfile.customCalorieLimit;
    }

    // Fallback: Calculate BMR
    let bmr;
    if (userProfile.gender === 'male') {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    } else {
      bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    }
    
    // Activity Multiplier
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (multipliers[userProfile.activityLevel] || 1.2));

    // MEDICAL LOGIC UPDATE:
    if (userProfile.goal === 'weight_loss') return tdee - 500;
    if (userProfile.goal === 'weight_gain' || userProfile.goal === 'muscle_gain') return tdee + 300;
    
    // Therapeutic Deficit for Medical Conditions
    if (['diabetes', 'hypertension', 'cholesterol'].includes(userProfile.goal)) return tdee - 250;
    
    return tdee;
  };

  // 4. Handle Image Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        analyzeFood(reader.result as string, undefined); 
      };
      reader.readAsDataURL(file);
    }
  };

  // 5. Main Analysis Function
  const analyzeFood = async (base64Image: string, manualIngredients?: string[]) => {
    setLoading(true);
    if (!manualIngredients) setResult(null); 
    
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: base64Image.split(',')[1],
          userProfile: userProfile,
          ingredients: manualIngredients 
        }),
      });
      const data = await response.json();
      
      if (data.error) throw new Error("Dr. Reza is momentarily unavailable.");
      
      setResult(data);
      setEditableIngredients(data.ingredients || []);
      
      // If this is a FRESH scan (not an edit), add to stats automatically
      if (!manualIngredients && data.macros?.calories?.value) {
         addToDailyLog(data.macros.calories.value);
      }
      
      setIsEditing(false); 
    } catch (error) {
      console.error('Error:', error);
      alert('Dr. Reza encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Ingredient Editing Handlers
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    if (newIngredient.trim()) {
      setEditableIngredients([...editableIngredients, newIngredient.trim()]);
      setNewIngredient('');
    }
  };

  const handleRemoveIngredient = (index: number) => {
    const newList = [...editableIngredients];
    newList.splice(index, 1);
    setEditableIngredients(newList);
  };

  const handleUpdateAnalysis = () => {
    if (image) {
       analyzeFood(image, editableIngredients);
    }
  };

  // 7. Calculate Banner Stats
  const tdee = getTDEE() || 2000;
  const remaining = tdee - dailyStats.calories;

  // --- RENDER ---
  return (
    <main className="min-h-screen bg-slate-50 pb-20">
      
      {/* HEADER */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Boleh Makan</h1>
          <p className="text-xs text-teal-600 font-medium">AI Metabolic Intelligence</p>
        </div>
        <button 
          onClick={() => setShowSettings(true)}
          className="p-2 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors"
        >
          <span className="text-xl">⚙️</span>
        </button>
      </div>

      {/* TRACKER BANNER */}
      <div className="bg-slate-900 text-white p-4">
        <div className="grid grid-cols-3 divide-x divide-slate-700 text-center">
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Today</p>
                <p className="text-lg font-bold text-teal-400">{dailyStats.calories}</p>
                <p className="text-[10px] text-slate-500">kcal</p>
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Limit</p>
                <p className="text-lg font-bold">{tdee}</p>
                <p className="text-[10px] text-slate-500">kcal</p>
            </div>
            <div>
                <p className="text-xs text-slate-400 uppercase font-bold">Meals</p>
                <p className="text-lg font-bold text-yellow-400">{dailyStats.count}</p>
                <p className="text-[10px] text-slate-500">scans</p>
            </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full ${remaining < 0 ? 'bg-red-500' : 'bg-teal-500'} transition-all duration-500`}
              style={{ width: `${Math.min((dailyStats.calories / tdee) * 100, 100)}%` }}
            ></div>
        </div>
        <div className="text-center mt-1">
            <p className="text-[10px] text-slate-400">
                {remaining < 0 
                  ? `${Math.abs(remaining)} kcal over limit!` 
                  : `${remaining} kcal remaining`}
            </p>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        
        {/* CAMERA UPLOAD */}
        {!image && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="mt-8 border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all"
          >
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-3xl">📸</div>
            <p className="text-slate-600 font-medium">Tap to Scan Meal</p>
            <p className="text-xs text-slate-400 mt-2">Dr. Reza is ready</p>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
        )}

        {/* IMAGE & RESULTS */}
        {image && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img src={image} alt="Food" className="w-full object-cover" />
              
              {/* RETAKE BUTTON */}
              <button 
                onClick={() => { setImage(null); setResult(null); setIsEditing(false); }}
                className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md"
              >
                ✕ Retake
              </button>

              {/* LOADING STATE */}
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="font-medium animate-pulse">{isEditing ? "Recalculating..." : "Dr. Reza is analyzing..."}</p>
                </div>
              )}
            </div>

            {/* RESULTS DASHBOARD */}
            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* 1. INVENTORY SECTION (EDITABLE + SAFE MAP) */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-slate-500 uppercase">Detected Inventory</p>
                      {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-teal-600 text-xs font-bold hover:underline">
                          ✎ Edit Ingredients
                        </button>
                      ) : (
                        <button onClick={handleUpdateAnalysis} className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm hover:bg-teal-700">
                          ✓ Update Analysis
                        </button>
                      )}
                   </div>

                   {/* Tags Container */}
                   <div className="flex flex-wrap gap-2">
                      {(isEditing ? editableIngredients : (result.ingredients || [])).map((item: string, i: number) => (
                        <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${
                            isEditing ? 'bg-white border-teal-300 text-teal-700' : 'bg-slate-100 border-slate-200 text-slate-700'
                        }`}>
                          {item}
                          {isEditing && (
                            <button onClick={() => handleRemoveIngredient(i)} className="text-teal-400 hover:text-red-500 font-bold">✕</button>
                          )}
                        </span>
                      ))}
                   </div>
                   
                   {/* Add Ingredient Input */}
                   {isEditing && (
                     <form onSubmit={handleAddIngredient} className="mt-3 flex gap-2">
                        <input 
                          type="text" 
                          placeholder="Add missing item..." 
                          className="flex-1 text-xs p-2 border border-slate-300 rounded-lg outline-none focus:border-teal-500"
                          value={newIngredient}
                          onChange={(e) => setNewIngredient(e.target.value)}
                        />
                        <button type="submit" className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">+</button>
                     </form>
                   )}
                </div>

                {/* 2. THE VITALS (MACROS) */}
                {result.macros && (
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
                )}

                {/* 3. VERDICT */}
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
              </div>
            )}
          </div>
        )}
      </div>

      {/* USER PROFILE MODAL */}
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