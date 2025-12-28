// src/app/check-food/page.tsx
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { VitalityHUD } from '@/components/VitalityHUD';
import { useFood } from '@/context/FoodContext';
import { MALAYSIAN_FOOD_ANCHORS, FoodAnchor, searchFoodDB, FoodCategory } from '@/data/malaysian_food_anchors';

// 👇 1. ADDED COMPRESSION UTILITY
const compressImage = (base64Str: string, maxWidth = 800, quality = 0.7) => {
  return new Promise<string>((resolve) => {
    const img = new window.Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

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
        resolve(base64Str); // Fallback if context fails
      }
    };
  });
};

export default function CheckFoodPage() {
  const [image, setImage] = useState<string | null>(null);
  const [baseResult, setBaseResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // 🎤 VOICE STATE
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🎛️ TUNING CONTROLS
  const [portion, setPortion] = useState(1.0);
  const [kuahLevel, setKuahLevel] = useState<'asing' | 'biasa' | 'banjir'>('biasa');
  
  const [excludedComponents, setExcludedComponents] = useState<string[]>([]);
  const [customItems, setCustomItems] = useState<FoodAnchor[]>([]);
  
  // MODAL & MEMORY
  const [showAddModal, setShowAddModal] = useState<FoodCategory | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodAnchor[]>([]);
  const [popularItems, setPopularItems] = useState<string[]>([]);

  const { addMeal, userProfile } = useFood();
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem('food_popularity');
    if (stored) setPopularItems(JSON.parse(stored));
  }, []);

  const bumpPopularity = (id: string) => {
    const newPopular = [id, ...popularItems.filter(i => i !== id)].slice(0, 20);
    setPopularItems(newPopular);
    localStorage.setItem('food_popularity', JSON.stringify(newPopular));
  };

  // 🎤 VOICE LOGIC
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await processVoice(audioBlob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setError('');
    } catch (err) {
      console.error(err);
      setError("Microphone access denied.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const processVoice = async (audioBlob: Blob) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'recording.webm');

      const res = await fetch('/api/voice-log', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Voice processing failed");

      setImage(data.image);
      
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getSuggestions = (category: FoodCategory) => {
    const all = MALAYSIAN_FOOD_ANCHORS.filter(i => i.category === category);
    const sorted = all.sort((a, b) => {
      const aIndex = popularItems.indexOf(a.id);
      const bIndex = popularItems.indexOf(b.id);
      if (aIndex > -1 && bIndex > -1) return aIndex - bIndex;
      if (aIndex > -1) return -1;
      if (bIndex > -1) return 1;
      return 0;
    });
    return sorted.slice(0, 3);
  };

  const MODIFIERS = {
    kuah: { asing: { cal: -50, sodium: -100 }, biasa: { cal: 0, sodium: 0 }, banjir: { cal: 120, sodium: 400 } }
  };

  const handleReset = () => {
    setImage(null);
    setBaseResult(null);
    setPortion(1.0);
    setKuahLevel('biasa');
    setExcludedComponents([]);
    setCustomItems([]);
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
        setBaseResult(null);
        setPortion(1.0);
        setKuahLevel('biasa');
        setExcludedComponents([]);
        setCustomItems([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!image) return;
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/analyze-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image, userProfile }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Scan failed');
      setBaseResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const isValidInput = (text: string) => {
    if (text.length < 3) return false;
    if (/^[^a-zA-Z0-9\s]+$/.test(text)) return false;
    if (/(.)\1{3,}/.test(text)) return false;
    return true;
  };

  const getFinalData = () => {
    if (!baseResult) return null;
    let totalCal = 0; let totalProt = 0; let totalCarb = 0; let totalFat = 0; let totalSodium = baseResult.data.risk_analysis?.is_high_sodium ? 800 : 400; let totalSugar = 0;
    const activeComponentsName: string[] = [];

    const components = baseResult.data.components || [];
    components.forEach((comp: any) => {
      if (!excludedComponents.includes(comp.name)) {
        totalCal += comp.calories; totalProt += comp.macros?.p || 0; totalCarb += comp.macros?.c || 0; totalFat += comp.macros?.f || 0;
        activeComponentsName.push(comp.name);
      }
    });

    customItems.forEach(item => {
       totalCal += item.calories; totalProt += item.protein_g; totalCarb += item.carbs_g; totalFat += item.fat_g; totalSodium += item.sodium_mg; if (item.sugar_g) totalSugar += item.sugar_g;
       activeComponentsName.push(item.name);
    });

    const nonScalableCal = customItems.filter(i => i.category === 'drink').reduce((sum, i) => sum + i.calories, 0);
    const scalableCal = totalCal - nonScalableCal;

    totalCal = Math.round(scalableCal * portion) + nonScalableCal;
    totalProt = Math.round(totalProt * portion);
    totalCarb = Math.round(totalCarb * portion);
    totalFat = Math.round(totalFat * portion);

    if (shouldShowKuah()) {
       const kuahMod = MODIFIERS.kuah[kuahLevel];
       totalCal += kuahMod.cal;
       totalSodium += kuahMod.sodium;
    }

    return {
      food_name: baseResult.data.food_name,
      components: activeComponentsName,
      analysis_content: baseResult.data.analysis_content,
      actionable_advice: baseResult.data.actionable_advice,
      macros: { calories: totalCal, protein_g: totalProt, carbs_g: totalCarb, fat_g: totalFat, sodium_mg: totalSodium, sugar_g: totalSugar }
    };
  };

  const shouldShowKuah = () => {
    if (!baseResult) return false;
    const name = baseResult.data.food_name.toLowerCase();
    const category = baseResult.data.category || 'other';
    if (name.includes('ayam') && name.includes('nasi') && !name.includes('kandar') && !name.includes('curry')) return false; 
    if (name.includes('fried rice') || name.includes('goreng')) return false; 
    if (category === 'western' || category === 'bread' || category === 'dessert') return false;
    if (category === 'rice_dish' || category === 'noodle_dish' || category === 'soup') return true;
    return false;
  };

  const finalData = getFinalData();

  // 👇 2. UPDATED HANDLE SAVE
  // Now async, and compresses image before sending to Context
  const handleSave = async () => {
    if (finalData) {
      setLoading(true); // Show loading while compressing
      try {
        // Compress if an image exists
        const processedImage = image ? await compressImage(image) : undefined;
        
        addMeal({ 
          data: finalData, 
          is_verified: baseResult.is_verified, 
          components: finalData.components 
        }, processedImage);

        router.push('/');
      } catch (err) {
        console.error("Storage error", err);
        // Fallback: Try saving without image if compression still fails storage
        if ((err as any).name === 'QuotaExceededError') {
           alert("Storage is full! Saving meal without photo.");
           addMeal({ 
             data: finalData, 
             is_verified: baseResult.is_verified, 
             components: finalData.components 
           }, undefined);
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
      bumpPopularity(item.id);
    }
  };

  const openModal = (type: FoodCategory) => {
    setShowAddModal(type);
    setSearchQuery('');
    setSearchResults(MALAYSIAN_FOOD_ANCHORS.filter(i => i.category === type));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (!showAddModal) return;
    if (q.trim() === '') {
       setSearchResults(MALAYSIAN_FOOD_ANCHORS.filter(i => i.category === showAddModal));
    } else {
       setSearchResults(searchFoodDB(q, showAddModal));
    }
  };

  const addManualItem = () => {
    if (!isValidInput(searchQuery)) {
      alert("Please enter a valid food name.");
      return;
    }
    const genericItem: FoodAnchor = {
      id: Date.now().toString(),
      name: searchQuery,
      calories: showAddModal === 'drink' ? 100 : 150,
      protein_g: 0, carbs_g: 20, fat_g: 5, sodium_mg: 10, fiber_g: 0, sugar_g: showAddModal === 'drink' ? 15 : 0,
      category: showAddModal!,
      source: 'Manual_Audit',
      serving_size: '1 serving',
      keywords: []
    };
    setCustomItems(prev => [...prev, genericItem]);
    setShowAddModal(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans pb-32">
      <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">Scan Meal</h1>
      
      {/* 🚀 THE NEW ECSTATIC STUDIO UI */}
      {/* Only show this selection screen if we haven't captured an image yet */}
      {!image && (
        <div className="flex flex-col gap-4 h-[70vh] justify-center animate-fade-in">
          
          {/* HIDDEN FILE INPUT */}
          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />

          {/* 1. BIG CAMERA CARD */}
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 bg-gradient-to-br from-blue-500 to-cyan-400 text-white rounded-3xl p-6 shadow-xl shadow-blue-200 transform transition active:scale-95 flex flex-col items-center justify-center gap-2 group border border-white/20"
          >
            <div className="bg-white/20 p-5 rounded-full backdrop-blur-sm group-hover:bg-white/30 transition-all group-hover:scale-110">
              <span className="text-5xl">📸</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black tracking-tight">Snap Photo</h3>
              <p className="text-white/80 text-sm font-medium">Use Camera or Gallery</p>
            </div>
          </button>

          {/* 2. BIG VOICE CARD */}
          <button
            onMouseDown={startRecording}
            onMouseUp={stopRecording}
            onTouchStart={startRecording}
            onTouchEnd={stopRecording}
            disabled={loading}
            className={`flex-1 bg-gradient-to-br from-indigo-500 to-purple-500 text-white rounded-3xl p-6 shadow-xl shadow-purple-200 transform transition active:scale-95 flex flex-col items-center justify-center gap-2 border border-white/20 ${isRecording ? 'animate-pulse ring-4 ring-purple-300 scale-105' : ''}`}
          >
            <div className={`bg-white/20 p-5 rounded-full backdrop-blur-sm transition-all ${isRecording ? 'bg-red-500/80 animate-ping' : ''}`}>
              <span className="text-5xl">🎙️</span>
            </div>
            <div className="text-center">
              <h3 className="text-2xl font-black tracking-tight">
                {isRecording ? 'Listening...' : (loading ? 'Processing...' : 'Voice Log')}
              </h3>
              <p className="text-white/80 text-sm font-medium">
                {isRecording ? 'Release to Send' : 'Hold to Speak'}
              </p>
            </div>
          </button>

          <p className="text-center text-xs text-gray-400 font-bold uppercase tracking-widest mt-2 opacity-50">
            Choose your method
          </p>
        </div>
      )}

      {/* Preview & Analyze Button (Only visible after capture) */}
      {image && !baseResult && (
        <div className="text-center animate-fade-in mt-4">
          <div className="relative max-h-64 mx-auto rounded-2xl shadow-xl mb-6 overflow-hidden">
             <img src={image} alt="Preview" className="object-cover w-full h-full" />
             
             {/* 3. RETAKE BUTTON (Icon only) */}
             <button 
                onClick={handleReset}
                className="absolute top-3 right-3 bg-black/50 text-white p-2 rounded-full backdrop-blur-sm hover:bg-black/70 transition-colors z-20"
                aria-label="Remove image"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
          </div>
          
          <div className="flex flex-col gap-3">
            {/* 1. ANALYZE BUTTON WITH THINKING STATE */}
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className={`w-full py-4 rounded-2xl flex items-center justify-center gap-3 transition-all ${
                loading
                  ? 'bg-slate-100 text-slate-500 cursor-not-allowed'
                  : 'bg-teal-600 text-white hover:bg-teal-700 shadow-lg hover:shadow-xl'
              }`}
            >
              <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white/50 bg-slate-200">
                <Image
                  // Switch image based on loading state
                  src={loading ? "/assets/avatar-header-thinking.png" : "/assets/avatar-header.png"}
                  alt="Dr Reza"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-lg font-bold">
                {loading ? 'Dr. Reza is thinking...' : 'Analyze Meal'}
              </span>
              {loading && (
                <div className="w-5 h-5 border-2 border-slate-300 border-t-teal-600 rounded-full animate-spin ml-1"></div>
              )}
            </button>
          </div>
        </div>
      )}

      {/* RESULT & TUNING PANEL (Same as before) */}
      {baseResult && finalData && (
        <div className="animate-slide-up">
           <VitalityHUD data={finalData} isVerified={baseResult.is_verified} imageSrc={image} />

           <div className="mt-4 bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3 items-start">
             {/* 2. UPDATED VERDICT HEADER WITH AVATAR */}
             <div className="w-12 h-12 relative rounded-full overflow-hidden border-2 border-white shadow-sm flex-shrink-0">
               <Image
                 src="/assets/avatar-header.png"
                 alt="Dr Reza"
                 fill
                 className="object-cover"
               />
             </div>
             <div>
                 <h4 className="font-bold text-blue-800 text-sm mb-1">Dr. Reza says:</h4>
                 <p className="text-xs text-blue-700 leading-relaxed">
                   {baseResult.data.analysis_content || "Remember to drink water!"}
                 </p>
             </div>
           </div>

           <div className="mt-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-200">
             {/* 1. PORTION */}
             <div className="mb-6">
               <div className="flex justify-between text-xs font-bold text-gray-500 mb-2"><span>Portion</span><span className="text-blue-600">{portion}x</span></div>
               <input type="range" min="0.5" max="2.0" step="0.5" value={portion} onChange={(e) => setPortion(Number(e.target.value))} className="w-full h-2 bg-gray-200 rounded-lg accent-blue-600" />
               <div className="grid grid-cols-3 text-[10px] text-gray-400 mt-1"><span className="text-left">Half</span><span className="text-center">Standard</span><span className="text-right">Double</span></div>
             </div>

             {/* 2. INGREDIENTS */}
             <div className="mb-6">
               <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">🥘 Inside this Meal</p>
               <div className="flex flex-wrap gap-2">
                 {baseResult.data.components?.map((comp: any) => (
                   <button key={comp.name} onClick={() => toggleComponent(comp.name)} className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${!excludedComponents.includes(comp.name) ? 'bg-green-100 border-green-200 text-green-800' : 'bg-gray-100 border-gray-200 text-gray-400 line-through'}`}>{comp.name}</button>
                 ))}
                 {customItems.filter(i => i.category === 'main').map((item) => (
                    <button key={item.id} onClick={() => toggleCustomItem(item)} className="px-3 py-1.5 rounded-full text-xs font-bold border bg-green-100 border-green-200 text-green-800 flex items-center gap-1">{item.name} <span className="text-[10px]">✕</span></button>
                 ))}
                 <button onClick={() => openModal('main')} className="px-3 py-1.5 rounded-full text-xs font-bold border border-dashed border-gray-300 text-gray-500 hover:bg-gray-50">+ Add</button>
               </div>
             </div>

             {/* 3. ADDONS */}
             <div className="mb-6">
               <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">🥚 Lauk Tambah</p>
               <div className="flex flex-wrap gap-2">
                 {getSuggestions('addon').map(item => (
                   <button key={item.id} onClick={() => toggleCustomItem(item)} className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${customItems.find(i => i.id === item.id) ? 'bg-blue-600 border-blue-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>{item.name} {customItems.find(i => i.id === item.id) && '✓'}</button>
                 ))}
                 <button onClick={() => openModal('addon')} className="px-3 py-2 rounded-lg text-[10px] font-bold border border-dashed border-gray-300 text-gray-500">🔍 Search</button>
               </div>
             </div>

             {/* 4. DRINKS */}
             <div className="mb-6">
               <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">🥤 Minum Apa?</p>
               <div className="flex flex-wrap gap-2">
                 {getSuggestions('drink').map(item => (
                   <button key={item.id} onClick={() => toggleCustomItem(item)} className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${customItems.find(i => i.id === item.id) ? 'bg-purple-600 border-purple-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>{item.name} {customItems.find(i => i.id === item.id) && '✓'}</button>
                 ))}
                 <button onClick={() => openModal('drink')} className="px-3 py-2 rounded-lg text-[10px] font-bold border border-dashed border-gray-300 text-gray-500">🔍 Search</button>
               </div>
             </div>

             {/* 5. DESSERTS */}
             <div className="mb-6">
               <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">🍧 Pencuci Mulut</p>
               <div className="flex flex-wrap gap-2">
                 {getSuggestions('dessert').map(item => (
                   <button key={item.id} onClick={() => toggleCustomItem(item)} className={`px-3 py-2 rounded-lg text-[10px] font-bold border transition-all ${customItems.find(i => i.id === item.id) ? 'bg-pink-600 border-pink-600 text-white' : 'bg-gray-50 border-gray-100 text-gray-600'}`}>{item.name} {customItems.find(i => i.id === item.id) && '✓'}</button>
                 ))}
                 <button onClick={() => openModal('dessert')} className="px-3 py-2 rounded-lg text-[10px] font-bold border border-dashed border-gray-300 text-gray-500">🔍 Search</button>
               </div>
             </div>

             {/* KUAH */}
             {shouldShowKuah() && (
               <div className="mb-6">
                 <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider flex items-center gap-1">🍛 Kuah Level</p>
                 <div className="flex bg-gray-100 rounded-lg p-1">
                   {(['asing', 'biasa', 'banjir'] as const).map((level) => (
                     <button key={level} onClick={() => setKuahLevel(level)} className={`flex-1 py-2 rounded-md text-xs font-bold capitalize transition-all ${kuahLevel === level ? 'bg-white shadow-sm text-blue-600' : 'text-gray-400'}`}>{level}</button>
                   ))}
                 </div>
               </div>
             )}
           </div>
           
           <div className="mt-6 flex flex-col gap-3">
             <button onClick={handleSave} className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-xl">
               {loading ? 'Compressing...' : `✅ Track All (${finalData.macros.calories} kcal)`}
             </button>
             <button onClick={handleReset} className="w-full bg-white text-gray-400 py-3 rounded-xl font-bold text-sm hover:bg-red-50 hover:text-red-500 border border-transparent hover:border-red-100 transition-all">Discard & Scan Again</button>
           </div>
        </div>
      )}

      {/* SEARCH MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm animate-scale-in shadow-2xl h-[80vh] flex flex-col">
            <h3 className="text-lg font-black mb-1 capitalize text-gray-800">Add {showAddModal}</h3>
            <p className="text-xs text-gray-400 mb-4">Tap to add</p>
            <input className="w-full p-3 bg-gray-50 rounded-xl mb-4 border focus:border-blue-500 outline-none font-bold" placeholder="Search..." value={searchQuery} onChange={handleSearch} autoFocus />
            <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-1 custom-scrollbar">
              {searchResults.length > 0 ? (
                searchResults.map(item => (
                  <button key={item.id} onClick={() => { toggleCustomItem(item); setShowAddModal(null); }} className="w-full text-left p-3 rounded-xl hover:bg-blue-50 flex justify-between items-center border border-transparent hover:border-blue-100 group">
                    <span className="font-bold text-gray-700 group-hover:text-blue-700">{item.name}</span>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-lg group-hover:bg-white">{item.calories} kcal</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-500 mb-2">Not found.</p>
                  <button onClick={addManualItem} className="text-blue-600 font-bold text-sm underline">Add "{searchQuery}" anyway</button>
                </div>
              )}
            </div>
            <button onClick={() => setShowAddModal(null)} className="w-full py-3 bg-gray-100 rounded-xl font-bold text-gray-500">Cancel</button>
          </div>
        </div>
      )}

      {error && <div className="p-4 bg-red-50 text-red-700 rounded-lg text-center">{error}</div>}
    </div>
  );
}