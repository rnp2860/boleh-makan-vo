'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import Image from 'next/image'; 
import UserProfileModal, { UserProfile } from '@/components/UserProfileModal'; 
import DrRezaHeader from '@/components/DrRezaHeader';
// 👇 This connects us to the "Brain" you showed me in lib/supabaseClient.ts
import { supabase } from '@/lib/supabaseClient';

interface Ingredient {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export default function HomePage() {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  
  // Portion Control State (Default 1.0x)
  const [portionSize, setPortionSize] = useState<number>(1.0);
  const [dailyStats, setDailyStats] = useState({ calories: 0, count: 0 });
  const [isEditing, setIsEditing] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [newIngredient, setNewIngredient] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 1. Load Data
  useEffect(() => {
    // Load Profile
    const savedProfile = localStorage.getItem('user_profile');
    if (savedProfile) {
      try { setUserProfile(JSON.parse(savedProfile)); } catch (e) { setShowSettings(true); }
    } else { setShowSettings(true); }

    // Load Daily Log (Local for now, next step: load from Supabase!)
    const today = new Date().toISOString().split('T')[0];
    const savedLog = localStorage.getItem('daily_log');
    if (savedLog) {
       const log = JSON.parse(savedLog);
       if (log.date !== today) {
         localStorage.setItem('daily_log', JSON.stringify({ date: today, items: [] }));
         setDailyStats({ calories: 0, count: 0 });
       } else {
         const totalCals = log.items.reduce((acc: number, item: any) => acc + (parseInt(item.calories) || 0), 0);
         setDailyStats({ calories: totalCals, count: log.items.length });
       }
    }
  }, []);

  // 2. Add to Local Log (Updates the UI banner immediately)
  const addToDailyLog = (calories: number) => {
    const today = new Date().toISOString().split('T')[0];
    const val = Math.round(calories);
    const savedLog = localStorage.getItem('daily_log');
    let log = savedLog ? JSON.parse(savedLog) : { date: today, items: [] };
    if (log.date !== today) log = { date: today, items: [] };
    log.items.push({ calories: val, timestamp: new Date() });
    localStorage.setItem('daily_log', JSON.stringify(log));
    setDailyStats(prev => ({ calories: prev.calories + val, count: prev.count + 1 }));
  };

  // 3. TDEE Calculation
  const getTDEE = () => {
    if (!userProfile) return 2000;
    if (userProfile.customCalorieLimit && userProfile.customCalorieLimit > 0) return userProfile.customCalorieLimit;
    let bmr;
    if (userProfile.gender === 'male') bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age + 5;
    else bmr = 10 * userProfile.weight + 6.25 * userProfile.height - 5 * userProfile.age - 161;
    const multipliers: any = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 };
    const tdee = Math.round(bmr * (multipliers[userProfile.activityLevel] || 1.2));
    if (userProfile.goal === 'weight_loss') return tdee - 500;
    if (userProfile.goal === 'weight_gain' || userProfile.goal === 'muscle_gain') return tdee + 300;
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
        setPortionSize(1.0);
        analyzeFood(reader.result as string, undefined); 
      };
      reader.readAsDataURL(file);
    }
  };

  // Calculate total macros dynamically based on ingredients state
  const totalMacros = useMemo(() => {
    return ingredients.reduce((totals, ingredient) => ({
      calories: totals.calories + ingredient.calories,
      protein: totals.protein + ingredient.protein,
      carbs: totals.carbs + ingredient.carbs,
      fat: totals.fat + ingredient.fat,
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [ingredients]);

  // 5. Main AI Analysis
  const analyzeFood = async (base64Image: string, manualIngredients?: string[]) => {
    setLoading(true);
    if (!manualIngredients) setResult(null); 
    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: base64Image.split(',')[1], userProfile, ingredients: manualIngredients }),
      });
      const data = await response.json();
      if (data.error) throw new Error("Dr. Reza is momentarily unavailable.");
      setResult(data);
      
      // Initialize ingredients state with detected items (convert string array to Ingredient objects)
      // Each detected ingredient gets default values from the API result macros divided by ingredient count
      const detectedItems = data.ingredients || [];
      const ingredientCount = detectedItems.length || 1;
      const baseCalories = data.macros?.calories?.value || 150;
      const baseProtein = data.macros?.protein?.value || 10;
      const baseCarbs = data.macros?.carbs?.value || 20;
      const baseFat = data.macros?.fat?.value || 5;
      
      const initialIngredients: Ingredient[] = detectedItems.map((name: string) => ({
        name,
        calories: Math.round(baseCalories / ingredientCount),
        protein: Math.round(baseProtein / ingredientCount),
        carbs: Math.round(baseCarbs / ingredientCount),
        fat: Math.round(baseFat / ingredientCount),
      }));
      
      setIngredients(initialIngredients);
      setIsEditing(false); 
    } catch (error) {
      console.error('Error:', error);
      alert('Dr. Reza encountered an issue. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 6. Ingredient Management
  const handleAddIngredient = (e: React.FormEvent) => {
    e.preventDefault();
    const name = newIngredient.trim();
    if (name) {
      const newIngredientObj: Ingredient = {
        name: name,
        calories: 150,
        protein: 10,
        carbs: 20,
        fat: 5,
      };
      setIngredients([...ingredients, newIngredientObj]);
      setNewIngredient('');
    }
  };
  
  const handleRemoveIngredient = (index: number) => {
    const newList = [...ingredients];
    newList.splice(index, 1);
    setIngredients(newList);
  };
  
  const handleUpdateAnalysis = () => {
    // Update result with new calculated macros and close editing mode
    // Macros are already being calculated dynamically via useMemo
    if (result) {
      const updatedResult = {
        ...result,
        macros: {
          calories: { value: totalMacros.calories, unit: 'kcal', status: totalMacros.calories > 600 ? 'High' : totalMacros.calories > 400 ? 'Moderate' : 'Good' },
          protein: { value: totalMacros.protein, unit: 'g' },
          carbs: { value: totalMacros.carbs, unit: 'g' },
          fat: { value: totalMacros.fat, unit: 'g' },
        },
        ingredients: ingredients.map(ing => ing.name),
      };
      setResult(updatedResult);
    }
    setIsEditing(false);
  };

  // 7. CONFIRM & SAVE TO SUPABASE (This is the new part!)
  const handleConfirmLog = async () => {
    if (totalMacros.calories > 0) {
       // Calculate final numbers based on portion (using dynamically calculated totals)
       const finalCalories = Math.round(totalMacros.calories * portionSize);
       const finalProtein = Math.round(totalMacros.protein * portionSize);
       const finalCarbs = Math.round(totalMacros.carbs * portionSize);
       const finalFat = Math.round(totalMacros.fat * portionSize);
       const mealName = result?.main_dish_name || "Unknown Meal";

       // A. Update UI immediately (Instant gratification)
       addToDailyLog(finalCalories);

       // B. Save to Cloud (Supabase)
       console.log("Saving to Supabase...");
       try {
         const { error } = await supabase.from('food_logs').insert([
            {
                meal_name: mealName,
                calories: finalCalories,
                protein: finalProtein,
                carbs: finalCarbs,
                fat: finalFat,
                portion_size: portionSize
            }
         ]);
         
         if (error) {
             console.error("Supabase Error:", error);
             alert("Saved locally, but failed to sync to cloud.");
         } else {
             console.log("✅ Saved to Supabase successfully!");
         }
       } catch (err) {
         console.error("Save failed:", err);
       }

       // Reset Screen
       setImage(null); setResult(null); setIsEditing(false);
    }
  };

  const tdee = getTDEE() || 2000;
  const remaining = tdee - dailyStats.calories;

  return (
    <main className="min-h-screen bg-slate-50 pb-28">
      {/* Navbar */}
      <div className="bg-white p-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Boleh Makan</h1>
          <p className="text-xs text-teal-600 font-medium">AI Metabolic Intelligence</p>
        </div>
        <button onClick={() => setShowSettings(true)} className="p-2 rounded-full bg-slate-100 hover:bg-teal-50 text-slate-600 hover:text-teal-600 transition-colors"><span className="text-xl">⚙️</span></button>
      </div>

      <DrRezaHeader />

      {/* Tracker Banner */}
      <div className="bg-slate-900 text-white p-4">
        <div className="grid grid-cols-3 divide-x divide-slate-700 text-center">
            <div><p className="text-xs text-slate-400 uppercase font-bold">Today</p><p className="text-lg font-bold text-teal-400">{dailyStats.calories}</p><p className="text-[10px] text-slate-500">kcal</p></div>
            <div><p className="text-xs text-slate-400 uppercase font-bold">Limit</p><p className="text-lg font-bold">{tdee}</p><p className="text-[10px] text-slate-500">kcal</p></div>
            <div><p className="text-xs text-slate-400 uppercase font-bold">Meals</p><p className="text-lg font-bold text-yellow-400">{dailyStats.count}</p><p className="text-[10px] text-slate-500">scans</p></div>
        </div>
        <div className="mt-3 w-full bg-slate-800 rounded-full h-2 overflow-hidden">
            <div className={`h-full ${remaining < 0 ? 'bg-red-500' : 'bg-teal-500'} transition-all duration-500`} style={{ width: `${Math.min((dailyStats.calories / tdee) * 100, 100)}%` }}></div>
        </div>
        <div className="text-center mt-1"><p className="text-[10px] text-slate-400">{remaining < 0 ? `${Math.abs(remaining)} kcal over limit!` : `${remaining} kcal remaining`}</p></div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {/* Upload */}
        {!image && (
          <div onClick={() => fileInputRef.current?.click()} className="mt-8 border-2 border-dashed border-slate-300 rounded-2xl p-10 flex flex-col items-center justify-center bg-white cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-all">
            <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mb-4 text-3xl">📸</div>
            <p className="text-slate-600 font-medium">Tap to Scan Meal</p>
            <p className="text-xs text-slate-400 mt-2">Dr. Reza is ready</p>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </div>
        )}

        {/* Results */}
        {image && (
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden shadow-md">
              <img src={image} alt="Food" className="w-full object-cover" />
              <button onClick={() => { setImage(null); setResult(null); setIsEditing(false); }} className="absolute top-3 right-3 bg-black/50 text-white px-3 py-1 rounded-full text-xs backdrop-blur-md">✕ Retake</button>
              {loading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white backdrop-blur-sm">
                  <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin mb-3"></div>
                  <p className="font-medium animate-pulse">{isEditing ? "Recalculating..." : "Dr. Reza is analyzing..."}</p>
                </div>
              )}
            </div>

            {result && !loading && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6">
                
                {/* Inventory */}
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                   <div className="flex justify-between items-center mb-3">
                      <p className="text-xs font-bold text-slate-500 uppercase">Detected Inventory</p>
                      {!isEditing ? (
                        <button onClick={() => setIsEditing(true)} className="text-teal-600 text-xs font-bold hover:underline">✎ Edit Ingredients</button>
                      ) : (
                        <button onClick={handleUpdateAnalysis} className="bg-teal-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm hover:bg-teal-700">✓ Update Analysis</button>
                      )}
                   </div>
                   <div className="flex flex-wrap gap-2">
                      {ingredients.map((ingredient, i) => (
                        <span key={i} className={`px-3 py-1 rounded-full text-xs font-semibold border flex items-center gap-2 ${isEditing ? 'bg-white border-teal-300 text-teal-700' : 'bg-slate-100 border-slate-200 text-slate-700'}`}>
                          {ingredient.name}
                          {isEditing && <button onClick={() => handleRemoveIngredient(i)} className="text-teal-400 hover:text-red-500 font-bold">✕</button>}
                        </span>
                      ))}
                   </div>
                   {isEditing && (
                     <form onSubmit={handleAddIngredient} className="mt-3 flex gap-2">
                        <input type="text" placeholder="Add missing item..." className="flex-1 text-xs p-2 border border-slate-300 rounded-lg outline-none focus:border-teal-500" value={newIngredient} onChange={(e) => setNewIngredient(e.target.value)} />
                        <button type="submit" className="bg-slate-100 text-slate-600 px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-200">+</button>
                     </form>
                   )}
                </div>

                {/* Portion Control */}
                <div className="flex flex-col items-center">
                   <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Portion Size / Saiz Hidangan</p>
                   <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
                      {[0.5, 1.0, 1.5, 2.0].map((size) => (
                        <button key={size} onClick={() => setPortionSize(size)} className={`px-4 py-2 text-xs font-bold rounded-lg transition-all ${portionSize === size ? 'bg-white text-teal-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}>{size}x</button>
                      ))}
                   </div>
                </div>

                {/* Macros - Now calculated dynamically from ingredients state */}
                {result && (
                  <div className="grid grid-cols-2 gap-3">
                    <div className={`p-4 rounded-xl border ${totalMacros.calories > 600 ? 'bg-red-50 border-red-200' : totalMacros.calories > 400 ? 'bg-amber-50 border-amber-200' : 'bg-green-50 border-green-200'}`}>
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">calories</p>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-slate-800">{Math.round(totalMacros.calories * portionSize)}</span>
                        <span className="text-xs font-bold text-slate-500 mb-1">kcal</span>
                        {totalMacros.calories > 600 && <span className="ml-auto text-[10px] font-bold text-red-600 mb-1 bg-red-100 px-1 rounded">HIGH</span>}
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">protein</p>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-slate-800">{Math.round(totalMacros.protein * portionSize)}</span>
                        <span className="text-xs font-bold text-slate-500 mb-1">g</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">carbs</p>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-slate-800">{Math.round(totalMacros.carbs * portionSize)}</span>
                        <span className="text-xs font-bold text-slate-500 mb-1">g</span>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl border bg-slate-50 border-slate-200">
                      <p className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-1">fat</p>
                      <div className="flex items-end gap-1">
                        <span className="text-2xl font-black text-slate-800">{Math.round(totalMacros.fat * portionSize)}</span>
                        <span className="text-xs font-bold text-slate-500 mb-1">g</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Verdict */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full border border-slate-200 overflow-hidden relative">
                       <Image src="/assets/avatar-header.png" alt="Dr Reza" fill className="object-cover" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Dr. Reza's Verdict</h3>
                  </div>
                  
                  <div className="space-y-3">
                    {(result.analysis_content || result.analysis_points || []).map((point: string, i: number) => {
                       const isVerified = point.includes("Verified Database");
                       return (
                        <div key={i} className={`flex gap-3 text-sm leading-relaxed ${isVerified ? 'bg-emerald-50 p-3 rounded-lg border border-emerald-100 text-emerald-800' : 'text-slate-700'}`}>
                            <span className={isVerified ? 'text-emerald-600' : 'text-teal-500 mt-1'}>{isVerified ? '✅' : '•'}</span>
                            <span className={isVerified ? 'font-medium' : ''}>{point.replace('✅ ', '')}</span>
                        </div>
                       );
                    })}
                  </div>
                </div>

                {/* Quick Actions */}
                {result.actionable_advice && result.actionable_advice.length > 0 && (
                  <div className="bg-teal-50 rounded-2xl p-6 border border-teal-100">
                    <h3 className="text-lg font-bold text-teal-900 mb-4 flex items-center gap-2"><span className="text-2xl">⚡</span> Quick Actions</h3>
                    <div className="space-y-3">
                      {result.actionable_advice.map((point: string, i: number) => (
                        <div key={i} className="flex gap-3 text-sm text-teal-800 leading-relaxed">
                          <span className="text-teal-600 font-bold">✓</span><span>{point}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* CONFIRM BUTTON (Sends to Supabase!) */}
                <button 
                  onClick={handleConfirmLog}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl shadow-lg active:scale-95 transition-transform flex flex-col items-center justify-center"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-lg">Log Meal ({Math.round(totalMacros.calories * portionSize)} kcal)</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                    Tap to save to history
                  </span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
      <UserProfileModal open={showSettings} onClose={() => setShowSettings(false)} onSave={(profile) => { setUserProfile(profile); setShowSettings(false); }} />
    </main>
  );
}