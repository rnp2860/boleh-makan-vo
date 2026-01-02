// src/components/MealDetailsModal.tsx
'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface MealDetailsModalProps {
  meal: any;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function MealDetailsModal({ meal, onClose, onDelete }: MealDetailsModalProps) {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!meal) return null;

  // Get Dr. Reza's analysis from different possible locations
  const analysis = meal.analysis_data || meal.data?.analysis_content || meal.analysis || "No detailed analysis available for this meal.";
  const actionable = meal.actionable_advice || meal.data?.actionable_advice || [];
  const macros = meal.data?.macros || { 
    calories: meal.calories, 
    protein_g: meal.protein, 
    carbs_g: meal.carbs, 
    fat_g: meal.fat || 0,
    sugar_g: meal.sugar || 0,
    sodium_mg: meal.sodium || 0,
  };
  
  const dateObj = new Date(meal.timestamp);
  const dateStr = dateObj.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  const timeStr = dateObj.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const APP_URL = 'https://boleh-makan.vercel.app';
  
  // Generate share text
  const generateShareText = () => {
    const ingredientsList = meal.components?.length > 0 
      ? `\n🥗 Ingredients: ${meal.components.join(', ')}`
      : '';
    
    return `🍽️ My Meal: ${meal.name}

📊 Nutrition Facts:
• Calories: ${macros.calories} kcal
• Protein: ${macros.protein_g}g
• Carbs: ${macros.carbs_g}g
• Fat: ${macros.fat_g}g
${ingredientsList}

🩺 Dr. Reza says: "${analysis}"

📲 Track your meals with Boleh Makan 🇲🇾
${APP_URL}`;
  };

  const handleShare = async (platform: string) => {
    const text = generateShareText();
    const encodedText = encodeURIComponent(text);
    
    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodedText}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodedText}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?quote=${encodedText}`, '_blank');
        break;
      case 'copy':
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        break;
      case 'native':
        if (navigator.share) {
          try {
            // Try to include image if available
            const shareData: ShareData = {
              title: `My Meal: ${meal.name}`,
              text: text,
              url: APP_URL,
            };
            
            // If meal has an image, try to share it (works on mobile)
            if (meal.image && 'canShare' in navigator) {
              try {
                const response = await fetch(meal.image);
                const blob = await response.blob();
                const file = new File([blob], `${meal.name}.jpg`, { type: 'image/jpeg' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                  shareData.files = [file];
                }
              } catch (imgErr) {
                console.log('Could not include image in share');
              }
            }
            
            await navigator.share(shareData);
          } catch (err) {
            console.log('Share cancelled');
          }
        }
        break;
    }
    setShowShareMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="bg-white rounded-3xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl relative animate-scale-in flex flex-col">
        
        {/* HERO IMAGE */}
        <div className="relative h-56 w-full bg-gradient-to-br from-teal-400 to-emerald-500">
          {meal.image ? (
            <img src={meal.image} alt={meal.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-6xl">🥗</div>
          )}
          
          {/* Top buttons */}
          <div className="absolute top-4 left-4 right-4 flex justify-between">
            {/* Share Button */}
            <button 
              onClick={() => setShowShareMenu(true)}
              className="bg-white/90 text-slate-700 px-4 py-2 rounded-full backdrop-blur-md hover:bg-white transition-colors flex items-center gap-2 text-sm font-bold shadow-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
              Share
            </button>

            {/* Close Button */}
            <button 
              onClick={onClose}
              className="bg-black/40 text-white p-2 rounded-full backdrop-blur-md hover:bg-black/60 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Title Overlay */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-5 pt-16">
            <h2 className="text-xl font-black text-white capitalize leading-tight">{meal.name}</h2>
            <p className="text-white/80 text-sm font-medium">{dateStr} • {timeStr}</p>
          </div>
        </div>

        {/* CONTENT SCROLL AREA */}
        <div className="p-5 pb-8 space-y-5">
          
          {/* MACRO GRID - Full labels */}
          <div className="grid grid-cols-3 gap-2 mb-2">
            <div className="bg-blue-50 p-3 rounded-xl border border-blue-100 text-center">
              <div className="text-[9px] uppercase font-bold text-blue-400">Calories</div>
              <div className="text-lg font-black text-blue-700">{macros.calories}</div>
            </div>
            <div className="bg-green-50 p-3 rounded-xl border border-green-100 text-center">
              <div className="text-[9px] uppercase font-bold text-green-400">Protein</div>
              <div className="text-lg font-black text-green-700">{macros.protein_g}g</div>
            </div>
            <div className="bg-orange-50 p-3 rounded-xl border border-orange-100 text-center">
              <div className="text-[9px] uppercase font-bold text-orange-400">Carbs</div>
              <div className="text-lg font-black text-orange-700">{macros.carbs_g}g</div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-center">
              <div className="text-[9px] uppercase font-bold text-amber-500">Fat</div>
              <div className="text-lg font-black text-amber-600">{macros.fat_g}g</div>
            </div>
            <div className={`p-3 rounded-xl border text-center ${(macros.sugar_g || 0) > 15 ? 'bg-red-50 border-red-200' : 'bg-pink-50 border-pink-100'}`}>
              <div className="text-[9px] uppercase font-bold text-pink-400">Sugar 🩸</div>
              <div className={`text-lg font-black ${(macros.sugar_g || 0) > 15 ? 'text-red-600' : 'text-pink-600'}`}>{macros.sugar_g || 0}g</div>
            </div>
            <div className={`p-3 rounded-xl border text-center ${(macros.sodium_mg || 0) > 800 ? 'bg-red-50 border-red-200' : 'bg-purple-50 border-purple-100'}`}>
              <div className="text-[9px] uppercase font-bold text-purple-400">Sodium 🧂</div>
              <div className={`text-lg font-black ${(macros.sodium_mg || 0) > 800 ? 'text-red-600' : 'text-purple-600'}`}>{macros.sodium_mg || 0}mg</div>
            </div>
          </div>

          {/* DR REZA VERDICT */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <div className="flex gap-3 items-start">
              <div className="w-10 h-10 relative rounded-full overflow-hidden border-2 border-white shadow-sm bg-white flex-shrink-0">
                <Image 
                  src="/assets/avatar-header.png" 
                  alt="Dr. Reza" 
                  fill 
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-slate-800 text-sm mb-1">Dr. Reza says:</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  "{analysis}"
                </p>
              </div>
            </div>
          </div>

          {/* INGREDIENTS */}
          {meal.components && meal.components.length > 0 && (
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">🥗 Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {meal.components.map((comp: string, i: number) => (
                  <span key={i} className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-100">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* ADVICE */}
          {actionable.length > 0 && (
            <div className="bg-teal-50 rounded-2xl p-4 border border-teal-100">
              <h4 className="text-[10px] font-bold text-teal-600 uppercase tracking-widest mb-2">⚡ Quick Tips</h4>
              <ul className="space-y-1.5">
                {actionable.map((tip: string, i: number) => (
                  <li key={i} className="text-xs text-teal-800 flex gap-2">
                    <span className="font-bold">✓</span> {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* DELETE BUTTON */}
          <div className="pt-4 pb-24">
            <button 
              onClick={() => {
                if(confirm('Are you sure you want to delete this meal?')) {
                  onDelete(meal.id);
                  onClose();
                }
              }}
              className="w-full py-3.5 text-red-500 font-bold text-sm bg-red-50 hover:bg-red-100 rounded-xl transition-colors border border-red-100"
            >
              🗑️ Delete Meal
            </button>
          </div>
        </div>
      </div>

      {/* SHARE MENU MODAL */}
      {showShareMenu && (
        <div className="fixed inset-0 z-60 flex items-end justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowShareMenu(false)} />
          <div className="bg-white rounded-t-3xl w-full max-w-md p-6 relative animate-slideUp">
            <h3 className="text-lg font-bold text-slate-800 mb-4 text-center">Share This Meal</h3>
            
            <div className="grid grid-cols-4 gap-4 mb-6">
              <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl">
                  💬
                </div>
                <span className="text-xs text-slate-600 font-medium">WhatsApp</span>
              </button>
              
              <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-black rounded-2xl flex items-center justify-center text-white text-xl font-black">
                  𝕏
                </div>
                <span className="text-xs text-slate-600 font-medium">X</span>
              </button>
              
              <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl">
                  📘
                </div>
                <span className="text-xs text-slate-600 font-medium">Facebook</span>
              </button>
              
              <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 text-2xl">
                  {copied ? '✅' : '📋'}
                </div>
                <span className="text-xs text-slate-600 font-medium">{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            
            {typeof navigator !== 'undefined' && 'share' in navigator && (
              <button 
                onClick={() => handleShare('native')}
                className="w-full py-3 bg-teal-500 text-white font-bold rounded-xl mb-3"
              >
                More Options...
              </button>
            )}
            
            <button 
              onClick={() => setShowShareMenu(false)}
              className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
