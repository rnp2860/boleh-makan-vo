// src/app/check-food/page.tsx
// 🔥 REDESIGNED: Beautiful Dr. Reza scanning experience
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VitalityHUD } from '@/components/VitalityHUD';
import { useFood } from '@/context/FoodContext';
import { MALAYSIAN_FOOD_ANCHORS, FoodAnchor, FoodCategory } from '@/data/malaysian_food_anchors';

// 🗜️ IMAGE COMPRESSION - Optimized for API speed
const compressImage = (base64Str: string, maxWidth = 512, quality = 0.6) => {
  return new Promise<string>((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;
      
      // Scale down for faster API processing
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }
      
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', quality));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => resolve(base64Str);
  });
};

export default function CheckFoodPage() {
  const [image, setImage] = useState<string | null>(null);
  const [baseResult, setBaseResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🎛️ TUNING CONTROLS
  const [portion, setPortion] = useState<0.5 | 1 | 1.5 | 2>(1);
  const [kuahLevel, setKuahLevel] = useState<'asing' | 'biasa' | 'banjir'>('biasa');
  const [excludedComponents, setExcludedComponents] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<FoodAnchor[]>([]);
  
  // 🔍 SEARCH MODAL
  const [showAddModal, setShowAddModal] = useState<FoodCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // 📝 TEXT INPUT (Alternative to voice)
  const [showTextInput, setShowTextInput] = useState(false);
  const [textInput, setTextInput] = useState('');

  // 🥗 ADDED INGREDIENTS (user can add missed items)
  const [addedIngredients, setAddedIngredients] = useState<{name: string, calories: number, macros: {p: number, c: number, f: number}}[]>([]);
  const [showAddIngredient, setShowAddIngredient] = useState(false);
  const [newIngredientName, setNewIngredientName] = useState('');

  const { addMeal, userProfile } = useFood();
  const router = useRouter();

  // 🆔 Get or create user ID for Supabase
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    let userId = localStorage.getItem('boleh_makan_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('boleh_makan_user_id', userId);
    }
    return userId;
  };

  // 🔎 DEBOUNCED SUPABASE SEARCH
  useEffect(() => {
    if (!showAddModal) return;
    
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        setSearching(true);
        try {
          const res = await fetch(`/api/search-food?q=${encodeURIComponent(searchQuery)}`);
          const data = await res.json();
          setSearchResults(Array.isArray(data) ? data : []);
        } catch (e) { 
          console.error(e);
          setSearchResults(MALAYSIAN_FOOD_ANCHORS.filter(i => 
            i.category === showAddModal && 
            i.name.toLowerCase().includes(searchQuery.toLowerCase())
          ));
        }
        setSearching(false);
      } else if (searchQuery === '') {
        setSearchResults(MALAYSIAN_FOOD_ANCHORS.filter(i => i.category === showAddModal).slice(0, 8));
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, showAddModal]);

  const MODIFIERS = {
    kuah: { asing: { cal: -50, sodium: -100 }, biasa: { cal: 0, sodium: 0 }, banjir: { cal: 120, sodium: 400 } }
  };

  const handleReset = () => {
    setImage(null);
    setBaseResult(null);
    setPortion(1);
    setKuahLevel('biasa');
    setExcludedComponents([]);
    setCustomItems([]);
    setAddedIngredients([]);
    setError('');
    setTextInput('');
  };

  // 📸 AUTO-ANALYZE ON IMAGE SELECT (with compression for speed)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      setBaseResult(null);
      setPortion(1);
      setKuahLevel('biasa');
      setExcludedComponents([]);
      setCustomItems([]);
      
      const reader = new FileReader();
      reader.onloadend = async () => {
        const rawImage = reader.result as string;
        setImage(rawImage); // Show original for display
        
        // Compress for faster API analysis
        const compressedImage = await compressImage(rawImage, 512, 0.6);
        
        // Auto-analyze with compressed image
        await analyzeFood('image', compressedImage);
      };
      reader.readAsDataURL(file);
    }
  };

  // 📝 TEXT INPUT ANALYSIS
  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;
    setShowTextInput(false);
    // Reset states for fresh analysis
    setImage(null); // No image for text input - will show placeholder
    setBaseResult(null);
    setPortion(1);
    setKuahLevel('biasa');
    setExcludedComponents([]);
    setCustomItems([]);
    setAddedIngredients([]);
    await analyzeFood('text', textInput.trim());
    setTextInput('');
  };

  // 🧠 MAIN ANALYSIS
  const analyzeFood = async (type: 'image' | 'text', data: string) => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/smart-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type, 
          data,
          healthConditions: userProfile?.healthConditions || []
        }),
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        // Show helpful message for invalid food input
        const errorMsg = result.suggestion 
          ? `${result.error}\n💡 ${result.suggestion}`
          : result.error || 'Analysis failed';
        throw new Error(errorMsg);
      }

      setBaseResult({
        data: {
          food_name: result.data.food_name,
          category: result.data.category || 'other',
          components: result.data.components || [{
            name: result.data.food_name,
            calories: result.data.macros.calories,
            macros: { p: result.data.macros.protein_g, c: result.data.macros.carbs_g, f: result.data.macros.fat_g }
          }],
          analysis_content: result.data.analysis_content,
          risk_analysis: result.data.risk_analysis || { is_high_sodium: false, is_high_sugar: false },
          valid_lauk: result.data.valid_lauk || []
        },
        is_verified: result.verified,
        source: result.source
      });

    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getFinalData = () => {
    if (!baseResult) return null;
    let totalCal = 0, totalProt = 0, totalCarb = 0, totalFat = 0;
    let totalSodium = baseResult.data.risk_analysis?.is_high_sodium ? 800 : 400;
    let totalSugar = 0;
    const activeComponentsName: string[] = [];

    // Original components from AI/DB
    (baseResult.data.components || []).forEach((comp: any) => {
      if (!excludedComponents.includes(comp.name)) {
        totalCal += comp.calories || 0;
        totalProt += comp.macros?.p || 0;
        totalCarb += comp.macros?.c || 0;
        totalFat += comp.macros?.f || 0;
        activeComponentsName.push(comp.name);
      }
    });

    // User-added ingredients
    addedIngredients.forEach(ing => {
      totalCal += ing.calories;
      totalProt += ing.macros.p;
      totalCarb += ing.macros.c;
      totalFat += ing.macros.f;
      activeComponentsName.push(ing.name);
    });

    // Side dishes (lauk, drinks, etc.)
    customItems.forEach(item => {
      totalCal += item.calories;
      totalProt += item.protein_g;
      totalCarb += item.carbs_g;
      totalFat += item.fat_g;
      totalSodium += item.sodium_mg;
      if (item.sugar_g) totalSugar += item.sugar_g;
      activeComponentsName.push(item.name);
    });

    // Apply portion multiplier (drinks don't scale)
    const nonScalableCal = customItems.filter(i => i.category === 'drink').reduce((sum, i) => sum + i.calories, 0);
    const scalableCal = totalCal - nonScalableCal;

    totalCal = Math.round(scalableCal * portion) + nonScalableCal;
    totalProt = Math.round(totalProt * portion);
    totalCarb = Math.round(totalCarb * portion);
    totalFat = Math.round(totalFat * portion);

    // Apply kuah modifier
    if (shouldShowKuah()) {
      const kuahMod = MODIFIERS.kuah[kuahLevel];
      totalCal += kuahMod.cal;
      totalSodium += kuahMod.sodium;
    }

    return {
      food_name: baseResult.data.food_name,
      components: activeComponentsName,
      analysis_content: baseResult.data.analysis_content,
      macros: { calories: totalCal, protein_g: totalProt, carbs_g: totalCarb, fat_g: totalFat, sodium_mg: totalSodium, sugar_g: totalSugar }
    };
  };

  const shouldShowKuah = () => {
    if (!baseResult) return false;
    const name = baseResult.data.food_name.toLowerCase();
    const category = baseResult.data.category || 'other';
    if (name.includes('goreng') || name.includes('fried')) return false;
    if (category === 'western' || category === 'bread' || category === 'dessert' || category === 'drink') return false;
    if (category === 'rice_dish' || category === 'noodle_dish' || category === 'soup') return true;
    return false;
  };

  const finalData = getFinalData();

  const handleSave = async () => {
    if (finalData) {
      setLoading(true);
      try {
        const processedImage = image ? await compressImage(image) : undefined;
        
        // 1️⃣ Save to localStorage (existing flow)
        addMeal({ 
          data: finalData, 
          is_verified: baseResult.is_verified, 
          components: finalData.components 
        }, processedImage);

        // 2️⃣ Save to Supabase (cloud backup)
        try {
          await fetch('/api/log-meal', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              meal_name: finalData.food_name,
              calories: finalData.macros.calories,
              protein: finalData.macros.protein_g,
              carbs: finalData.macros.carbs_g,
              fat: finalData.macros.fat_g,
              portion_size: portion,
              image_base64: processedImage,
              user_id: getUserId(),
              components: finalData.components,
              analysis_content: baseResult.data?.analysis_content
            })
          });
          console.log('✅ Meal saved to Supabase');
        } catch (supabaseErr) {
          console.error('Supabase save failed (local save succeeded):', supabaseErr);
        }
        
        router.push('/');
      } catch (err) {
        console.error("Storage error", err);
        if ((err as any).name === 'QuotaExceededError') {
          alert("Storage full! Saving without photo.");
          addMeal({ data: finalData, is_verified: baseResult.is_verified, components: finalData.components }, undefined);
          router.push('/');
        }
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleComponent = (name: string) => {
    setExcludedComponents(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);
  };

  const toggleCustomItem = (item: FoodAnchor) => {
    const exists = customItems.find(i => i.id === item.id);
    if (exists) {
      setCustomItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      setCustomItems(prev => [...prev, item]);
    }
  };

  const addFromSearch = (item: any) => {
    const newItem: FoodAnchor = {
      id: item.id || Date.now().toString(),
      name: item.name,
      calories: item.calories || 100,
      protein_g: item.protein || 5,
      carbs_g: item.carbs || 20,
      fat_g: item.fat || 5,
      sodium_mg: item.sodium || 100,
      fiber_g: 0,
      sugar_g: item.sugar || 0,
      category: showAddModal || 'addon',
      source: 'Manual_Audit',
      serving_size: '1 serving',
      keywords: []
    };
    setCustomItems(prev => [...prev, newItem]);
    setShowAddModal(null);
    setSearchQuery('');
  };

  const openModal = (type: FoodCategory) => {
    setShowAddModal(type);
    setSearchQuery('');
    setSearchResults(MALAYSIAN_FOOD_ANCHORS.filter(i => i.category === type).slice(0, 8));
  };

  // ============================================
  // 🎨 RENDER
  // ============================================
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pb-32">
      
      {/* ========== WELCOME SCREEN ========== */}
      {!image && !baseResult && !loading && (
        <div className="px-6 pt-8 animate-fade-in">
          
          {/* 👨‍⚕️ DR. REZA HEADER */}
          <div className="flex flex-col items-center mb-8">
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-gradient-to-br from-teal-400 to-cyan-500">
                <Image 
                  src="/assets/avatar-header.png" 
                  alt="Dr. Reza" 
                  fill 
                  className="object-cover" 
                  priority 
                />
              </div>
              <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            </div>
            
            {/* Speech Bubble */}
            <div className="mt-4 bg-white rounded-2xl px-6 py-4 shadow-lg border border-slate-100 relative max-w-xs">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white rotate-45 border-l border-t border-slate-100"></div>
              <p className="text-slate-700 text-center font-medium text-base leading-relaxed">
                Hai! 👋 I'm <span className="text-teal-600 font-bold">Dr. Reza</span>. 
                <br/>Show me what you're eating today!
              </p>
            </div>
          </div>

          {/* 📸 ACTION BUTTONS */}
          <div className="space-y-4">
            
            {/* Camera Button - Primary */}
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white rounded-2xl p-5 shadow-lg shadow-teal-200/50 flex items-center gap-4 active:scale-[0.98] transition-transform"
            >
              <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-3xl">📸</span>
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold">Take a Photo</h3>
                <p className="text-teal-100 text-base">Snap or choose from gallery</p>
              </div>
            </button>

            {/* Text Input Button - Secondary */}
            <button 
              onClick={() => setShowTextInput(true)}
              className="w-full bg-white text-slate-700 rounded-2xl p-5 shadow-md border border-slate-200 flex items-center gap-4 active:scale-[0.98] transition-transform hover:border-teal-300"
            >
              <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center">
                <span className="text-3xl">✏️</span>
              </div>
              <div className="text-left flex-1">
                <h3 className="text-lg font-bold">Type It In</h3>
                <p className="text-slate-400 text-base">Quick log without photo</p>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">BASIC</span>
            </button>

            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
            />
          </div>

          {/* Pro tip */}
          <div className="bg-teal-50 border border-teal-100 rounded-xl p-4 mt-6 mx-1">
            <div className="flex items-start gap-3">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm font-bold text-teal-700 mb-1">Pro Tip</p>
                <p className="text-xs text-teal-600 leading-relaxed">
                  <strong>Take a Photo</strong> gives you the most accurate analysis — I can see portion sizes, ingredients, and cooking style! 
                  <span className="text-teal-500"> Type It In is great for quick entries, but may miss some details.</span>
                </p>
              </div>
            </div>
          </div>

          {/* Footer with Dr. Reza Speech Bubble */}
          <div className="flex items-end justify-center gap-3 mt-6">
            {/* Dr. Reza Full Body - Using img tag for better mobile compatibility */}
            <div className="w-24 h-36 flex-shrink-0 relative">
              <img 
                src="/assets/avatar-fullbody-pointing.png" 
                alt="Dr. Reza" 
                className="w-full h-full object-contain"
                style={{ maxWidth: '96px', maxHeight: '144px' }}
              />
            </div>
            {/* Speech Bubble */}
            <div className="relative bg-white rounded-2xl px-5 py-4 shadow-md border border-slate-100 mb-8">
              <div className="absolute -left-2 bottom-6 w-3 h-3 bg-white rotate-45 border-l border-b border-slate-100"></div>
              <p className="text-base text-slate-700 font-medium">
                "I'll analyze it instantly!" ⚡
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========== TEXT INPUT MODAL ========== */}
      {showTextInput && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center backdrop-blur-sm">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slideUp">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <Image src="/assets/avatar-header.png" alt="Dr. Reza" width={40} height={40} className="object-cover" />
              </div>
              <p className="text-slate-700 font-medium">What did you eat?</p>
            </div>
            <input 
              autoFocus
              type="text"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleTextSubmit()}
              placeholder="e.g. Nasi Lemak Ayam Goreng"
              className="w-full p-4 bg-slate-50 rounded-xl text-lg font-medium text-slate-800 placeholder-slate-400 outline-none border-2 border-transparent focus:border-teal-400 transition-colors"
            />
            <div className="flex gap-3 mt-4">
              <button 
                onClick={() => setShowTextInput(false)} 
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={handleTextSubmit}
                disabled={!textInput.trim()}
                className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-bold disabled:opacity-50"
              >
                Analyze
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== LOADING STATE ========== */}
      {loading && (
        <div className="px-6 pt-8">
          <div className="flex flex-col items-center">
            {/* Thinking Avatar */}
            <div className="relative mb-6">
              <div className="w-28 h-28 rounded-full border-4 border-teal-200 overflow-hidden bg-white shadow-xl animate-pulse">
                <Image src="/assets/avatar-header-thinking.png" alt="Dr. Reza thinking" fill className="object-cover" />
              </div>
              <div className="absolute inset-0 rounded-full border-4 border-teal-400 border-t-transparent animate-spin"></div>
            </div>
            
            <p className="text-slate-600 font-bold text-lg mb-2">Analyzing your meal...</p>
            <p className="text-slate-400 text-sm">Dr. Reza is identifying ingredients</p>
            
            {/* Image preview while loading */}
            {image && (
              <div className="mt-6 w-full max-w-xs rounded-2xl overflow-hidden shadow-lg">
                <img src={image} alt="Your meal" className="w-full h-48 object-cover" />
                <div className="h-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-teal-400 animate-pulse"></div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== RESULTS SCREEN ========== */}
      {baseResult && finalData && !loading && (
        <div className="px-4 pt-4 animate-slideUp">
          
          {/* 🍽️ MEAL CARD */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden mb-4">
            {/* Image + Title */}
            <div className="relative">
              {image ? (
                <div className="h-44 w-full">
                  <img src={image} alt={finalData.food_name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                </div>
              ) : (
                /* 📝 TEXT INPUT PLACEHOLDER - Gradient background with food emoji */
                <div className="h-36 w-full bg-gradient-to-br from-teal-400 via-emerald-400 to-green-500 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-6xl">🍽️</span>
                    <p className="text-white/80 text-xs mt-2 font-medium">Typed Entry</p>
                  </div>
                </div>
              )}
              <div className={`${image ? 'absolute bottom-0 left-0 right-0' : ''} p-4`}>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  {baseResult.is_verified && (
                    <span className="bg-green-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">✓ VERIFIED</span>
                  )}
                  {!baseResult.is_verified && (
                    <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">AI ESTIMATE</span>
                  )}
                  {/* 🕌 HALAL STATUS BADGE */}
                  {baseResult.data.halal_status?.status === 'non_halal' && (
                    <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      ⚠️ NON-HALAL
                    </span>
                  )}
                </div>
                <h2 className={`text-2xl font-black ${image ? 'text-white' : 'text-slate-800'}`}>
                  {finalData.food_name}
                </h2>
                {/* Show non-halal reason if applicable */}
                {baseResult.data.halal_status?.status === 'non_halal' && (
                  <p className="text-red-200 text-xs mt-1">
                    {baseResult.data.halal_status.reason}
                  </p>
                )}
              </div>
              
              {/* Reset button */}
              <button 
                onClick={handleReset}
                className="absolute top-3 right-3 bg-black/40 text-white p-2 rounded-full backdrop-blur-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Calories Summary */}
            <div className="p-4 bg-gradient-to-r from-teal-500 to-cyan-500 text-white">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-teal-100 text-xs font-bold uppercase tracking-wider">Total Calories</p>
                  <p className="text-4xl font-black">{finalData.macros.calories}<span className="text-lg font-medium ml-1">kcal</span></p>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <p className="text-white/80 text-[10px] font-bold">Protein</p>
                    <p className="text-white font-black">{finalData.macros.protein_g}g</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <p className="text-white/80 text-[10px] font-bold">Carbs</p>
                    <p className="text-white font-black">{finalData.macros.carbs_g}g</p>
                  </div>
                  <div className="bg-white/20 rounded-lg px-3 py-2 backdrop-blur-sm">
                    <p className="text-white/80 text-[10px] font-bold">Fat</p>
                    <p className="text-white font-black">{finalData.macros.fat_g}g</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 🩺 DR. REZA'S TIP */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl mb-4 flex gap-3 items-start border border-blue-100">
            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 border-2 border-white shadow">
              <Image src="/assets/avatar-header.png" alt="Dr Reza" width={40} height={40} className="object-cover" />
            </div>
            <div>
              <p className="text-xs font-bold text-blue-600 mb-1">Dr. Reza says</p>
              <p className="text-sm text-slate-700 leading-relaxed">
                {baseResult.data.analysis_content || "Looks good! Remember to stay hydrated 💧"}
              </p>
            </div>
          </div>

          {/* 🎛️ TUNING SECTION */}
          <div className="bg-white rounded-2xl p-4 shadow-lg mb-4">
            
            {/* PORTION SIZE - Cool Pills */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">📏 Portion Size</p>
              <div className="grid grid-cols-4 gap-2">
                {([0.5, 1, 1.5, 2] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setPortion(size)}
                    className={`py-3 rounded-xl font-bold text-sm transition-all ${
                      portion === size 
                        ? 'bg-teal-500 text-white shadow-lg shadow-teal-200 scale-105' 
                        : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                    }`}
                  >
                    {size === 0.5 ? '½' : size === 1 ? '1x' : size === 1.5 ? '1.5x' : '2x'}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 mt-2 px-1">
                <span>Small</span>
                <span>Regular</span>
                <span>Large</span>
                <span>XL</span>
              </div>
            </div>

            {/* INGREDIENTS BREAKDOWN */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-3">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">🥗 Ingredients Detected</p>
                <button 
                  onClick={() => setShowAddIngredient(true)}
                  className="text-xs font-bold text-teal-600 hover:text-teal-700"
                >
                  + Add Missing
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {/* AI/DB detected components */}
                {baseResult.data.components?.map((comp: any, idx: number) => (
                  <button 
                    key={`comp-${idx}`}
                    onClick={() => toggleComponent(comp.name)} 
                    className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                      !excludedComponents.includes(comp.name) 
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700' 
                        : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                    }`}
                  >
                    {comp.name}
                    <span className="ml-1 opacity-60">{comp.calories}kcal</span>
                  </button>
                ))}
                {/* User-added ingredients */}
                {addedIngredients.map((ing, idx) => (
                  <button 
                    key={`added-${idx}`}
                    onClick={() => setAddedIngredients(prev => prev.filter((_, i) => i !== idx))}
                    className="px-3 py-2 rounded-xl text-xs font-bold border-2 bg-teal-50 border-teal-200 text-teal-700 flex items-center gap-1"
                  >
                    {ing.name}
                    <span className="opacity-60">{ing.calories}kcal</span>
                    <span className="ml-1 text-teal-400">✕</span>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-slate-400 mt-2">Tap to exclude • Added items show in teal</p>
            </div>

            {/* LAUK TAMBAH - From API suggestions */}
            {baseResult.data.valid_lauk && baseResult.data.valid_lauk.length > 0 && (
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">🥚 Add Side Dishes</p>
                <div className="flex flex-wrap gap-2">
                  {baseResult.data.valid_lauk.slice(0, 5).map((item: any, idx: number) => {
                    const isAdded = customItems.find(i => i.name === item.name);
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          if (isAdded) {
                            setCustomItems(prev => prev.filter(i => i.name !== item.name));
                          } else {
                            const newItem: FoodAnchor = {
                              id: `lauk-${idx}`,
                              name: item.name,
                              calories: item.calories || 80,
                              protein_g: item.protein || 5,
                              carbs_g: item.carbs || 5,
                              fat_g: item.fat || 3,
                              sodium_mg: 100,
                              fiber_g: 0,
                              category: 'addon',
                              source: 'Manual_Audit',
                              serving_size: '1 serving',
                              keywords: []
                            };
                            setCustomItems(prev => [...prev, newItem]);
                          }
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                          isAdded
                            ? 'bg-orange-500 border-orange-500 text-white'
                            : 'bg-orange-50 border-orange-200 text-orange-700 hover:bg-orange-100'
                        }`}
                      >
                        {isAdded ? '✓ ' : '+ '}{item.name}
                      </button>
                    );
                  })}
                  <button 
                    onClick={() => openModal('addon')}
                    className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-dashed border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-600"
                  >
                    🔍 More
                  </button>
                </div>
              </div>
            )}

            {/* DRINKS */}
            <div className="mb-6">
              <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">🥤 Add Drink</p>
              <div className="flex flex-wrap gap-2">
                {MALAYSIAN_FOOD_ANCHORS.filter(i => i.category === 'drink').slice(0, 4).map(item => {
                  const isAdded = customItems.find(i => i.id === item.id);
                  return (
                    <button 
                      key={item.id} 
                      onClick={() => toggleCustomItem(item)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                        isAdded 
                          ? 'bg-purple-500 border-purple-500 text-white' 
                          : 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100'
                      }`}
                    >
                      {isAdded ? '✓ ' : '+ '}{item.name}
                    </button>
                  );
                })}
                <button 
                  onClick={() => openModal('drink')}
                  className="px-3 py-2 rounded-xl text-xs font-bold border-2 border-dashed border-slate-300 text-slate-500 hover:border-teal-400 hover:text-teal-600"
                >
                  🔍 More
                </button>
              </div>
            </div>

            {/* KUAH LEVEL */}
            {shouldShowKuah() && (
              <div>
                <p className="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">🍛 Kuah Level</p>
                <div className="grid grid-cols-3 gap-2">
                  {(['asing', 'biasa', 'banjir'] as const).map((level) => (
                    <button 
                      key={level} 
                      onClick={() => setKuahLevel(level)} 
                      className={`py-3 rounded-xl text-sm font-bold capitalize transition-all ${
                        kuahLevel === level 
                          ? 'bg-amber-500 text-white shadow-lg' 
                          : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                      }`}
                    >
                      {level === 'asing' ? '🥄 Asing' : level === 'biasa' ? '🍲 Biasa' : '🌊 Banjir'}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 💾 SAVE BUTTONS */}
          <div className="space-y-3 mb-6">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-green-200 active:scale-[0.98] transition-transform disabled:opacity-50"
            >
              {loading ? 'Saving...' : `✅ Log This Meal (${finalData.macros.calories} kcal)`}
            </button>
            <button 
              onClick={handleReset}
              className="w-full bg-white text-slate-400 py-3 rounded-2xl font-bold text-sm border border-slate-200 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-colors"
            >
              Discard & Start Over
            </button>
          </div>
        </div>
      )}

      {/* ========== SEARCH MODAL ========== */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
          <div className="bg-white w-full max-h-[80vh] rounded-t-3xl overflow-hidden animate-slideUp">
            {/* Header */}
            <div className="p-4 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {showAddModal === 'drink' ? '🥤' : showAddModal === 'dessert' ? '🍰' : '🥚'}
                </span>
                <input 
                  autoFocus
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${showAddModal}...`} 
                  className="flex-1 bg-white p-3 rounded-xl text-slate-800 font-medium outline-none border border-slate-200 focus:border-teal-400"
                />
                <button 
                  onClick={() => { setShowAddModal(null); setSearchQuery(''); }} 
                  className="text-slate-400 p-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Results */}
            <div className="max-h-[50vh] overflow-y-auto p-4">
              {searching ? (
                <div className="text-center py-8 text-slate-400">
                  <div className="w-6 h-6 border-2 border-teal-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Searching...
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-2">
                  {searchResults.map((item, idx) => (
                    <button 
                      key={item.id || idx} 
                      onClick={() => addFromSearch(item)}
                      className="w-full text-left p-4 rounded-xl bg-slate-50 hover:bg-teal-50 border border-slate-100 hover:border-teal-200 flex justify-between items-center transition-colors"
                    >
                      <span className="font-bold text-slate-700">{item.name}</span>
                      <span className="text-xs font-bold text-slate-400 bg-white px-2 py-1 rounded-lg">{item.calories} kcal</span>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length > 1 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-2">No results found</p>
                  <button 
                    onClick={() => { 
                      analyzeFood('text', searchQuery); 
                      setShowAddModal(null); 
                    }}
                    className="text-teal-600 font-bold"
                  >
                    Ask Dr. Reza to estimate "{searchQuery}"
                  </button>
                </div>
              ) : (
                <p className="text-center py-8 text-slate-300">Type to search...</p>
              )}
            </div>

            {/* Cancel */}
            <div className="p-4 border-t border-slate-100">
              <button 
                onClick={() => { setShowAddModal(null); setSearchQuery(''); }}
                className="w-full py-3 rounded-xl bg-slate-100 text-slate-500 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== ADD INGREDIENT MODAL ========== */}
      {showAddIngredient && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
          <div className="bg-white w-full rounded-t-3xl p-6 animate-slideUp">
            <h3 className="text-lg font-bold text-slate-800 mb-4">Add Missing Ingredient</h3>
            
            <input 
              autoFocus
              type="text"
              value={newIngredientName}
              onChange={(e) => setNewIngredientName(e.target.value)}
              placeholder="e.g. Fried Egg, Sambal, Cucumber..."
              className="w-full p-4 bg-slate-50 rounded-xl text-lg font-medium text-slate-800 placeholder-slate-400 outline-none border-2 border-transparent focus:border-teal-400 transition-colors mb-4"
            />
            
            <p className="text-xs text-slate-400 mb-4">
              We'll estimate the calories automatically based on the ingredient name.
            </p>
            
            <div className="flex gap-3">
              <button 
                onClick={() => { setShowAddIngredient(false); setNewIngredientName(''); }}
                className="flex-1 py-3 rounded-xl bg-slate-100 text-slate-500 font-bold"
              >
                Cancel
              </button>
              <button 
                onClick={async () => {
                  if (!newIngredientName.trim()) return;
                  
                  // Quick estimate based on common ingredients
                  const estimates: Record<string, {cal: number, p: number, c: number, f: number}> = {
                    'egg': { cal: 70, p: 6, c: 0, f: 5 },
                    'telur': { cal: 70, p: 6, c: 0, f: 5 },
                    'rice': { cal: 200, p: 4, c: 45, f: 0 },
                    'nasi': { cal: 200, p: 4, c: 45, f: 0 },
                    'sambal': { cal: 50, p: 1, c: 5, f: 3 },
                    'cucumber': { cal: 10, p: 0, c: 2, f: 0 },
                    'timun': { cal: 10, p: 0, c: 2, f: 0 },
                    'peanut': { cal: 80, p: 4, c: 3, f: 7 },
                    'kacang': { cal: 80, p: 4, c: 3, f: 7 },
                    'anchovy': { cal: 40, p: 5, c: 0, f: 2 },
                    'ikan bilis': { cal: 40, p: 5, c: 0, f: 2 },
                    'chicken': { cal: 150, p: 20, c: 0, f: 8 },
                    'ayam': { cal: 150, p: 20, c: 0, f: 8 },
                    'beef': { cal: 180, p: 22, c: 0, f: 10 },
                    'daging': { cal: 180, p: 22, c: 0, f: 10 },
                    'vegetable': { cal: 30, p: 2, c: 5, f: 0 },
                    'sayur': { cal: 30, p: 2, c: 5, f: 0 },
                  };
                  
                  const lowerName = newIngredientName.toLowerCase();
                  let estimate = { cal: 80, p: 5, c: 10, f: 3 }; // default
                  
                  for (const [key, val] of Object.entries(estimates)) {
                    if (lowerName.includes(key)) {
                      estimate = val;
                      break;
                    }
                  }
                  
                  setAddedIngredients(prev => [...prev, {
                    name: newIngredientName.trim(),
                    calories: estimate.cal,
                    macros: { p: estimate.p, c: estimate.c, f: estimate.f }
                  }]);
                  
                  setShowAddIngredient(false);
                  setNewIngredientName('');
                }}
                disabled={!newIngredientName.trim()}
                className="flex-1 py-3 rounded-xl bg-teal-500 text-white font-bold disabled:opacity-50"
              >
                Add Ingredient
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========== ERROR TOAST ========== */}
      {error && (
        <div className="fixed bottom-24 left-4 right-4 p-4 bg-red-500 text-white rounded-xl shadow-xl animate-slideUp flex justify-between items-center">
          <span className="font-medium">{error}</span>
          <button onClick={() => setError('')} className="ml-2 font-bold">✕</button>
        </div>
      )}
    </div>
  );
}
