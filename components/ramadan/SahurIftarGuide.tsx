// components/ramadan/SahurIftarGuide.tsx
// 🍽️ Sahur/Iftar Meal Guide Component

'use client';

import { useState } from 'react';
import { 
  Moon, 
  Sun, 
  AlertTriangle,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Utensils,
  Droplets,
  Timer,
  Activity
} from 'lucide-react';
import {
  SAHUR_RECOMMENDATIONS,
  IFTAR_RECOMMENDATIONS,
  FOODS_TO_AVOID_RAMADAN,
  RamadanFoodRecommendation,
} from '@/lib/types/ramadan';
import { getMealRecommendations } from '@/lib/ramadan/fasting-utils';

interface SahurIftarGuideProps {
  mealType: 'sahur' | 'iftar';
  hasDiabetes?: boolean;
  lang?: 'en' | 'bm';
  className?: string;
  onLogMeal?: () => void;
}

export default function SahurIftarGuide({
  mealType,
  hasDiabetes = true,
  lang = 'en',
  className = '',
  onLogMeal,
}: SahurIftarGuideProps) {
  const [showAvoid, setShowAvoid] = useState(false);

  const isSahur = mealType === 'sahur';
  const recommendations = isSahur ? SAHUR_RECOMMENDATIONS : IFTAR_RECOMMENDATIONS;
  const tips = getMealRecommendations(mealType, hasDiabetes, lang);

  const labels = {
    en: {
      sahurTitle: 'Sahur Guide',
      iftarTitle: 'Iftar Guide',
      sahurSubtitle: 'Pre-dawn meal for sustained energy',
      iftarSubtitle: 'Breaking fast the healthy way',
      recommended: 'Recommended Foods',
      avoid: 'Foods to Avoid',
      diabeticTips: 'Tips for Diabetics',
      logMeal: 'Log Meal',
      lowGI: 'Low GI',
      mediumGI: 'Medium GI',
      highGI: 'High GI',
    },
    bm: {
      sahurTitle: 'Panduan Sahur',
      iftarTitle: 'Panduan Berbuka',
      sahurSubtitle: 'Makanan sebelum subuh untuk tenaga berpanjangan',
      iftarSubtitle: 'Berbuka puasa dengan cara sihat',
      recommended: 'Makanan Disyorkan',
      avoid: 'Makanan Dielakkan',
      diabeticTips: 'Tips untuk Pesakit Diabetes',
      logMeal: 'Log Makanan',
      lowGI: 'GI Rendah',
      mediumGI: 'GI Sederhana',
      highGI: 'GI Tinggi',
    },
  };

  const t = labels[lang];

  const getGIBadge = (gi: 'low' | 'medium' | 'high') => {
    switch (gi) {
      case 'low':
        return {
          text: t.lowGI,
          color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
        };
      case 'medium':
        return {
          text: t.mediumGI,
          color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        };
      case 'high':
        return {
          text: t.highGI,
          color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
        };
    }
  };

  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className={`p-4 text-white ${isSahur 
        ? 'bg-gradient-to-r from-indigo-600 to-purple-600'
        : 'bg-gradient-to-r from-orange-500 to-red-500'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl">
            {isSahur ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {isSahur ? t.sahurTitle : t.iftarTitle}
            </h3>
            <p className="text-sm opacity-90">
              {isSahur ? t.sahurSubtitle : t.iftarSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      {hasDiabetes && (
        <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-b border-blue-100 dark:border-blue-800">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h4 className="font-medium text-blue-800 dark:text-blue-200">
              {t.diabeticTips}
            </h4>
          </div>
          <ul className="space-y-1">
            {tips.map((tip, index) => (
              <li key={index} className="text-sm text-blue-700 dark:text-blue-300">
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommended Foods */}
      <div className="p-4">
        <h4 className="font-medium text-slate-700 dark:text-slate-200 mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-green-500" />
          {t.recommended}
        </h4>
        <div className="space-y-2">
          {recommendations.map((food, index) => {
            const giBadge = getGIBadge(food.glycemicIndex);
            return (
              <div 
                key={index}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl"
              >
                <div className="flex-1">
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {lang === 'en' ? food.name : food.name_bm}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? food.benefits : food.benefits_bm}
                  </p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${giBadge.color}`}>
                  {giBadge.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Foods to Avoid (Collapsible) */}
      <div className="px-4 pb-4">
        <button
          onClick={() => setShowAvoid(!showAvoid)}
          className="w-full flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-xl text-red-700 dark:text-red-300"
        >
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{t.avoid}</span>
          </div>
          {showAvoid ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
        
        {showAvoid && (
          <div className="mt-2 space-y-2">
            {FOODS_TO_AVOID_RAMADAN.map((food, index) => (
              <div 
                key={index}
                className="flex items-center gap-3 p-3 bg-red-50/50 dark:bg-red-900/10 rounded-xl"
              >
                <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                <div>
                  <p className="font-medium text-slate-700 dark:text-slate-200">
                    {lang === 'en' ? food.name : food.name_bm}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {lang === 'en' ? food.benefits : food.benefits_bm}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log Meal Button */}
      {onLogMeal && (
        <div className="p-4 border-t border-slate-100 dark:border-slate-700">
          <button
            onClick={onLogMeal}
            className={`w-full py-3 px-4 rounded-xl text-white font-medium flex items-center justify-center gap-2 ${
              isSahur 
                ? 'bg-indigo-600 hover:bg-indigo-700'
                : 'bg-orange-500 hover:bg-orange-600'
            } transition-colors`}
          >
            <Utensils className="w-5 h-5" />
            {t.logMeal}
          </button>
        </div>
      )}
    </div>
  );
}

// Quick Iftar Reminder Component
export function IftarReminder({ 
  lang = 'en',
  onDismiss,
}: { 
  lang?: 'en' | 'bm';
  onDismiss?: () => void;
}) {
  return (
    <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-2xl p-4 text-white">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <Sun className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h4 className="font-semibold mb-1">
            {lang === 'en' ? '🌴 Time to Break Fast!' : '🌴 Masa Berbuka!'}
          </h4>
          <p className="text-sm opacity-90 mb-3">
            {lang === 'en' 
              ? 'Remember the Sunnah: Break fast with dates and water first, then pray Maghrib before main meal.'
              : 'Ingat Sunnah: Berbuka dengan kurma dan air dahulu, kemudian solat Maghrib sebelum makan utama.'
            }
          </p>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-lg">
              <Timer className="w-4 h-4" />
              <span>{lang === 'en' ? '3 dates' : '3 biji kurma'}</span>
            </div>
            <div className="flex items-center gap-1 text-sm bg-white/20 px-2 py-1 rounded-lg">
              <Droplets className="w-4 h-4" />
              <span>{lang === 'en' ? 'Water' : 'Air'}</span>
            </div>
          </div>
        </div>
        {onDismiss && (
          <button onClick={onDismiss} className="text-white/70 hover:text-white">
            <XCircle className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

