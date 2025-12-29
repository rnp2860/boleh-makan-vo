'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import Image from 'next/image';

const MicIcon = () => <span className="text-xl">🎙️</span>;
const CameraIcon = () => <span className="text-3xl">📷</span>;

// Define structure for a meal item
type MealItem = {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  type?: 'food' | 'drink' | 'dessert';
};

export default function ScanPage() {
  const [loading, setLoading] = useState(false);
  
  // 🛒 MEAL DATA
  const [mealItems, setMealItems] = useState<MealItem[]>([]);
  const [suggestions, setSuggestions] = useState<{name: string, calories: number}[]>([]);
  
  // 🖼️ UI STATE
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchCategory, setSearchCategory] = useState<'general' | 'drink' | 'dessert'>('general');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔎 SEARCH STATE
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  // 🧮 CALCULATE TOTALS
  const totals = useMemo(() => {
    return mealItems.reduce((acc, item) => ({
      calories: acc.calories + Number(item.calories),
      protein: acc.protein + Number(item.protein || 0),
      carbs: acc.carbs + Number(item.carbs || 0),
      fat: acc.fat + Number(item.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [mealItems]);

  // 🕵️ LIVE SEARCH EFFECT (Debounced)
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm.length > 1) {
        setSearching(true);
        try {
          // Calls the API we just created
          const res = await fetch(`/api/search-food?q=${searchTerm}`);
          const data = await res.json();
          setSearchResults(data || []);
        } catch (e) { console.error(e); }
        setSearching(false);
      } else {
        setSearchResults([]);
      }
    }, 400); // 400ms delay to save API calls

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);


  // 🎤 VOICE RECOGNITION
  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) return alert("Browser not supported.");
    // @ts-ignore
    const SpeechRecognition = window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-MY'; 
    recognition.continuous = false;
    setIsListening(true);
    recognition.start();
    recognition.onresult = (event: any) => {
      setIsListening(false);
      analyzeFood('voice', event.results[0][0].transcript);
    };
    recognition.onerror = () => setIsListening(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
      analyzeFood('image', reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  // 🧠 MAIN ANALYSIS
  const analyzeFood = async (type: 'image' | 'text' | 'voice', data: string) => {
    setLoading(true);
    try {
      const res = await fetch('/api/smart-analyze', {
        method: 'POST',
        body: JSON.stringify({ type, data }),
      });
      const json = await res.json();
      
      if (json.success) {
        const newItem: MealItem = {
          name: json.data.food_name,
          calories: json.data.macros.calories,
          protein: json.data.macros.protein_g,
          carbs: json.data.macros.carbs_g,
          fat: json.data.macros.fat_g,
          type: searchCategory === 'general' ? 'food' : searchCategory
        };

        if (mealItems.length > 0) {
          setMealItems(prev => [...prev, newItem]);
          setShowSearch(false);
          setSearchCategory('general');
          setSearchTerm('');
        } else {
          setMealItems([newItem]);
          setSuggestions(json.data.valid_lauk || []);
        }
      } else {
        alert("Could not identify food.");
      }
    } catch (error) {
      alert("Connection error.");
    } finally {
      setLoading(false);
    }
  };

  // ➕ ADD FROM SEARCH RESULT
  const addFromSearch = (item: any) => {
    const newItem: MealItem = {
      name: item.name,
      calories: item.calories,
      protein: item.protein || 5, 
      carbs: item.carbs || 10, 
      fat: item.fat || 5,
      type: searchCategory === 'general' ? 'food' : searchCategory
    };
    setMealItems(prev => [...prev, newItem]);
    setShowSearch(false);
    setSearchTerm('');
  };

  // ➕ ADD SUGGESTION
  const addSuggestion = (item: {name: string, calories: number}) => {
    const newItem: MealItem = {
      name: item.name,
      calories: item.calories,
      protein: 5, carbs: 5, fat: 5, type: 'food'
    };
    setMealItems(prev => [...prev, newItem]);
    setSuggestions(prev => prev.filter(s => s.name !== item.name));
  };

  // ❌ REMOVE ITEM
  const removeItem = (index: number) => {
    setMealItems(prev => prev.filter((_, i) => i !== index));
  };

  const openSearch = (category: 'general' | 'drink' | 'dessert') => {
    setSearchCategory(category);
    setShowSearch(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-6 px-4 font-sans pb-32">
      
      {/* 👨‍⚕️ DR. REZA */}
      <div className="mb-4 flex flex-col items-center">
        <div className={`relative h-20 w-20 rounded-full border-4 ${loading ? 'border-yellow-400 animate-pulse' : 'border-blue-500'} overflow-hidden shadow-lg bg-white`}>
          <Image 
            src={loading ? "/assets/avatar-header-thinking.png" : "/assets/avatar-header.png"} 
            alt="Dr. Reza" fill className="object-cover" priority 
            onError={(e) => { (e.target as HTMLImageElement).src = "https://ui-avatars.com/api/?name=Dr+Reza&background=0D8ABC&color=fff"; }}
          />
        </div>
        <div className="mt-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-200 text-center relative">
          <p className="text-xs text-gray-700 font-medium">
            {loading ? "Analyzing..." : mealItems.length > 0 ? "Tap items to remove them." : "Show me your food!"}
          </p>
        </div>
      </div>

      {/* 📸 SCANNER (Only if empty) */}
      {mealItems.length === 0 && (
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 relative mb-6">
          {!imagePreview ? (
            <div onClick={() => fileInputRef.current?.click()} className="h-60 bg-slate-50 flex flex-col items-center justify-center cursor-pointer hover:bg-slate-100 transition border-b border-gray-100">
              <div className="h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4"><CameraIcon /></div>
              <p className="text-gray-600 font-medium">Tap to Scan Food</p>
            </div>
          ) : (
            <div className="relative h-60 w-full bg-black">
               <Image src={imagePreview} alt="Preview" fill className="object-cover opacity-90" />
               {loading && <div className="absolute top-0 left-0 w-full h-1 bg-green-400 shadow-[0_0_15px_rgba(74,222,128,0.8)] animate-scan"></div>}
            </div>
          )}
          <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
          
          <div className="p-4 flex gap-2">
             <button onClick={() => openSearch('general')} className="flex-1 bg-gray-100 py-3 rounded-xl text-gray-600 font-medium text-sm hover:bg-gray-200">🔍 Search Manually</button>
             <button onClick={startListening} className="bg-blue-50 p-3 rounded-xl text-blue-600 hover:bg-blue-100"><MicIcon /></button>
          </div>
        </div>
      )}

      {/* ✅ MEAL BUILDER */}
      {mealItems.length > 0 && (
        <div className="w-full max-w-md animate-slideUp">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
            
            {/* 🟦 HEADER SUMMARY */}
            <div className="p-5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xs font-bold uppercase tracking-wider opacity-80">Total Calories</h2>
                <div className="flex items-baseline">
                  <span className="text-4xl font-black">{Math.round(totals.calories)}</span>
                  <span className="text-sm ml-1">Kcal</span>
                </div>
                <div className="text-xs opacity-90 mt-1 flex gap-2">
                   <span>Pro: {Math.round(totals.protein)}g</span> • <span>Carb: {Math.round(totals.carbs)}g</span> • <span>Fat: {Math.round(totals.fat)}g</span>
                </div>
              </div>
              {/* Thumbnail */}
              {imagePreview && (
                <div className="h-14 w-14 rounded-lg border-2 border-white/30 overflow-hidden">
                  <Image src={imagePreview} alt="Scan" width={56} height={56} className="object-cover h-full w-full" />
                </div>
              )}
            </div>

            {/* 📋 ITEM LIST */}
            <div className="bg-gray-50 p-4 max-h-60 overflow-y-auto">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2 pl-1">Your Meal Stack</p>
              {mealItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-2 px-3 bg-white rounded-lg border border-gray-100 mb-2 shadow-sm">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">{item.type === 'drink' ? '🥤' : item.type === 'dessert' ? '🍰' : '🍽️'}</span>
                    <div>
                      <p className="text-gray-800 font-medium text-sm capitalize">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.calories} kcal</p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(idx)} className="text-gray-300 hover:text-red-500 text-lg">×</button>
                </div>
              ))}
            </div>

            {/* ✨ SMART ADD-ONS */}
            {suggestions.length > 0 && (
              <div className="px-4 py-3 bg-white border-t border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Dr. Reza Detected (Tap to Add)</p>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {suggestions.map((item, i) => (
                    <button 
                      key={i}
                      onClick={() => addSuggestion(item)}
                      className="flex-shrink-0 px-3 py-1.5 bg-green-50 text-green-700 border border-green-200 rounded-full text-xs font-bold whitespace-nowrap"
                    >
                      + {item.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 🛠️ COMPACT ACTION BAR */}
            <div className="p-3 bg-gray-50 border-t border-gray-200 grid grid-cols-4 gap-2">
              <button onClick={() => openSearch('general')} className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50">
                <span className="text-xl">🔍</span>
                <span className="text-[10px] font-bold text-gray-600 mt-1">Food</span>
              </button>
              <button onClick={() => openSearch('drink')} className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-blue-50">
                <span className="text-xl">🥤</span>
                <span className="text-[10px] font-bold text-gray-600 mt-1">Drink</span>
              </button>
              <button onClick={() => openSearch('dessert')} className="flex flex-col items-center justify-center p-2 bg-white rounded-xl shadow-sm border border-gray-200 hover:bg-pink-50">
                <span className="text-xl">🍰</span>
                <span className="text-[10px] font-bold text-gray-600 mt-1">Dessert</span>
              </button>
              <button onClick={() => { setMealItems([]); setSuggestions([]); setImagePreview(null); }} className="flex flex-col items-center justify-center p-2 bg-red-50 rounded-xl shadow-sm border border-red-100 hover:bg-red-100">
                <span className="text-xl">🔄</span>
                <span className="text-[10px] font-bold text-red-500 mt-1">Reset</span>
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🔍 SEARCH MODAL WITH AUTOCOMPLETE */}
      {showSearch && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-start pt-20 justify-center p-4 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-slideUp">
            
            {/* Search Header */}
            <div className="p-4 border-b border-gray-100 flex gap-2 items-center bg-gray-50">
              <span className="text-xl">{searchCategory === 'drink' ? '🥤' : searchCategory === 'dessert' ? '🍰' : '🔍'}</span>
              <input 
                autoFocus
                type="text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={`Search for ${searchCategory}...`} 
                className="flex-1 bg-transparent outline-none text-lg font-medium text-gray-800 placeholder-gray-400"
              />
              <button onClick={() => setShowSearch(false)} className="text-gray-400 font-bold px-2">✕</button>
            </div>

            {/* Live Results List */}
            <div className="max-h-[300px] overflow-y-auto">
              {searching ? (
                <div className="p-4 text-center text-gray-400 text-sm">Searching Titanium DB...</div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => addFromSearch(item)}
                    className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b border-gray-50 flex justify-between items-center transition"
                  >
                    <span className="font-medium text-gray-700 capitalize">{item.name}</span>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-full">{item.calories} kcal</span>
                  </button>
                ))
              ) : searchTerm.length > 1 ? (
                <div className="p-4 text-center text-gray-400 text-sm">
                  No verified matches. <br/>
                  {/* Fallback to AI if database fails */}
                  <button onClick={() => analyzeFood('text', searchTerm)} className="text-blue-600 font-bold mt-2 hover:underline">Ask Dr. Reza to Estimate "{searchTerm}"</button>
                </div>
              ) : (
                <div className="p-4 text-center text-gray-300 text-sm">Type to search database...</div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}