// src/components/DaySummaryShare.tsx
'use client';

import React, { useState } from 'react';

interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: string;
}

interface DaySummaryShareProps {
  meals: Meal[];
  date: Date;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  userName: string;
  onClose: () => void;
}

export default function DaySummaryShare({ 
  meals, 
  date, 
  totalCalories, 
  totalProtein, 
  totalCarbs, 
  totalFat,
  userName,
  onClose 
}: DaySummaryShareProps) {
  const [copied, setCopied] = useState(false);

  const dateStr = date.toLocaleDateString('en-US', { 
    weekday: 'long', 
    month: 'long', 
    day: 'numeric',
    year: 'numeric'
  });

  const generateShareText = () => {
    const mealsList = meals.map((m, i) => 
      `${i + 1}. ${m.name} - ${m.calories} kcal`
    ).join('\n');

    return `📅 ${userName}'s Food Diary
${dateStr}

🍽️ Meals Today:
${mealsList}

📊 Daily Totals:
• Calories: ${totalCalories} kcal
• Protein: ${totalProtein}g
• Carbs: ${totalCarbs}g
• Fat: ${totalFat}g

Tracked with Boleh Makan 🇲🇾
#BolehMakan #HealthyEating`;
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
            await navigator.share({
              title: `${userName}'s Food Diary - ${dateStr}`,
              text: text,
            });
          } catch (err) {
            console.log('Share cancelled');
          }
        }
        break;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="bg-white rounded-t-3xl w-full max-w-md relative animate-slideUp">
        {/* Preview Card */}
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 mb-1">Share Today's Summary</h3>
          <p className="text-xs text-slate-400">{dateStr}</p>
          
          {/* Mini Summary */}
          <div className="mt-4 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-2xl p-4 text-white">
            <div className="flex justify-between items-center mb-3">
              <span className="text-teal-100 text-xs font-medium">{meals.length} meals logged</span>
              <span className="text-2xl font-black">{totalCalories} kcal</span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-white/20 rounded-lg py-2">
                <div className="text-xs text-teal-100">Protein</div>
                <div className="font-bold">{totalProtein}g</div>
              </div>
              <div className="bg-white/20 rounded-lg py-2">
                <div className="text-xs text-teal-100">Carbs</div>
                <div className="font-bold">{totalCarbs}g</div>
              </div>
              <div className="bg-white/20 rounded-lg py-2">
                <div className="text-xs text-teal-100">Fat</div>
                <div className="font-bold">{totalFat}g</div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Share Options */}
        <div className="p-6">
          <div className="grid grid-cols-4 gap-4 mb-6">
            <button onClick={() => handleShare('whatsapp')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-green-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                💬
              </div>
              <span className="text-xs text-slate-600 font-medium">WhatsApp</span>
            </button>
            
            <button onClick={() => handleShare('twitter')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-sky-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                🐦
              </div>
              <span className="text-xs text-slate-600 font-medium">Twitter</span>
            </button>
            
            <button onClick={() => handleShare('facebook')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg">
                📘
              </div>
              <span className="text-xs text-slate-600 font-medium">Facebook</span>
            </button>
            
            <button onClick={() => handleShare('copy')} className="flex flex-col items-center gap-2">
              <div className="w-14 h-14 bg-slate-200 rounded-2xl flex items-center justify-center text-slate-600 text-2xl shadow-lg">
                {copied ? '✅' : '📋'}
              </div>
              <span className="text-xs text-slate-600 font-medium">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          
          {typeof navigator !== 'undefined' && navigator.share && (
            <button 
              onClick={() => handleShare('native')}
              className="w-full py-3 bg-teal-500 text-white font-bold rounded-xl mb-3"
            >
              More Options...
            </button>
          )}
          
          <button 
            onClick={onClose}
            className="w-full py-3 bg-slate-100 text-slate-600 font-bold rounded-xl"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

