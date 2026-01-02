// components/ramadan/FastingCountdown.tsx
// 🌙 Countdown timer for Iftar/Sahur

'use client';

import { useState, useEffect, useMemo } from 'react';
import { Moon, Sun, Clock, Utensils } from 'lucide-react';
import { FastingStatus, RAMADAN_LABELS } from '@/lib/types/ramadan';
import { formatCountdownDetailed } from '@/lib/ramadan/fasting-utils';

interface FastingCountdownProps {
  fastingStatus: FastingStatus;
  imsakTime: string;
  maghribTime: string;
  lang?: 'en' | 'bm';
  className?: string;
}

export default function FastingCountdown({
  fastingStatus,
  imsakTime,
  maghribTime,
  lang = 'en',
  className = '',
}: FastingCountdownProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const labels = RAMADAN_LABELS[lang];

  // Update every second for smooth countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Calculate countdown based on current meal window
  const countdown = useMemo(() => {
    const targetMinutes = fastingStatus.currentMealWindow === 'sahur' 
      ? fastingStatus.timeUntilImsak 
      : fastingStatus.currentMealWindow === 'fasting'
        ? fastingStatus.timeUntilMaghrib
        : fastingStatus.timeUntilNextMeal;

    if (!targetMinutes || targetMinutes <= 0) {
      return { hours: '00', minutes: '00', seconds: '00' };
    }

    // Calculate seconds remaining
    const now = currentTime;
    const [targetHour, targetMin] = (
      fastingStatus.currentMealWindow === 'sahur' ? imsakTime :
      fastingStatus.currentMealWindow === 'fasting' ? maghribTime :
      imsakTime
    ).split(':').map(Number);

    const targetDate = new Date(now);
    targetDate.setHours(targetHour, targetMin, 0, 0);
    
    if (targetDate < now) {
      targetDate.setDate(targetDate.getDate() + 1);
    }

    const diffMs = targetDate.getTime() - now.getTime();
    const totalSeconds = Math.max(0, Math.floor(diffMs / 1000));
    
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return {
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    };
  }, [currentTime, fastingStatus, imsakTime, maghribTime]);

  // Dynamic styling based on meal window
  const getWindowStyles = () => {
    switch (fastingStatus.currentMealWindow) {
      case 'sahur':
        return {
          bg: 'bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-800',
          icon: Moon,
          title: labels.sahur,
          subtitle: lang === 'en' ? 'Time until Imsak' : 'Masa sehingga Imsak',
          accent: 'text-purple-300',
          glow: 'shadow-purple-500/30',
        };
      case 'fasting':
        return {
          bg: 'bg-gradient-to-br from-amber-600 via-orange-600 to-red-600',
          icon: Sun,
          title: labels.fasting,
          subtitle: lang === 'en' ? 'Time until Iftar' : 'Masa sehingga Berbuka',
          accent: 'text-amber-200',
          glow: 'shadow-orange-500/30',
        };
      case 'iftar':
        return {
          bg: 'bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600',
          icon: Utensils,
          title: labels.iftar,
          subtitle: lang === 'en' ? 'Break your fast' : 'Berbuka puasa',
          accent: 'text-emerald-200',
          glow: 'shadow-emerald-500/30',
        };
      default:
        return {
          bg: 'bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600',
          icon: Clock,
          title: lang === 'en' ? 'Night' : 'Malam',
          subtitle: lang === 'en' ? 'Rest well' : 'Rehat dengan baik',
          accent: 'text-slate-300',
          glow: 'shadow-slate-500/30',
        };
    }
  };

  const styles = getWindowStyles();
  const Icon = styles.icon;

  return (
    <div className={`${styles.bg} rounded-2xl p-6 text-white shadow-xl ${styles.glow} ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{styles.title}</h3>
            <p className={`text-sm ${styles.accent}`}>{styles.subtitle}</p>
          </div>
        </div>
        
        {/* Progress indicator for fasting */}
        {fastingStatus.currentMealWindow === 'fasting' && (
          <div className="text-right">
            <span className="text-2xl font-bold">{fastingStatus.fastingProgress}%</span>
            <p className="text-xs opacity-80">
              {lang === 'en' ? 'complete' : 'selesai'}
            </p>
          </div>
        )}
      </div>

      {/* Countdown Display */}
      <div className="flex justify-center items-center gap-2 my-6">
        {/* Hours */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
          <div className="text-4xl font-mono font-bold text-center">
            {countdown.hours}
          </div>
          <div className="text-xs text-center opacity-70 mt-1">
            {lang === 'en' ? 'hours' : 'jam'}
          </div>
        </div>

        <span className="text-3xl font-bold animate-pulse">:</span>

        {/* Minutes */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
          <div className="text-4xl font-mono font-bold text-center">
            {countdown.minutes}
          </div>
          <div className="text-xs text-center opacity-70 mt-1">
            {lang === 'en' ? 'min' : 'minit'}
          </div>
        </div>

        <span className="text-3xl font-bold animate-pulse">:</span>

        {/* Seconds */}
        <div className="bg-black/30 backdrop-blur-sm rounded-xl px-4 py-3 min-w-[70px]">
          <div className="text-4xl font-mono font-bold text-center">
            {countdown.seconds}
          </div>
          <div className="text-xs text-center opacity-70 mt-1">
            {lang === 'en' ? 'sec' : 'saat'}
          </div>
        </div>
      </div>

      {/* Progress Bar (for fasting period) */}
      {fastingStatus.currentMealWindow === 'fasting' && (
        <div className="mt-4">
          <div className="h-2 bg-black/30 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white/80 rounded-full transition-all duration-1000"
              style={{ width: `${fastingStatus.fastingProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs opacity-70">
            <span>{imsakTime}</span>
            <span>{maghribTime}</span>
          </div>
        </div>
      )}

      {/* Meal Window Indicator */}
      {(fastingStatus.currentMealWindow === 'sahur' || fastingStatus.currentMealWindow === 'iftar') && (
        <div className="mt-4 p-3 bg-white/10 rounded-xl backdrop-blur-sm">
          <p className="text-sm text-center">
            {fastingStatus.currentMealWindow === 'sahur' ? (
              lang === 'en' 
                ? '🍽️ Eat a balanced sahur meal for sustained energy'
                : '🍽️ Makan sahur yang seimbang untuk tenaga berpanjangan'
            ) : (
              lang === 'en'
                ? '🌴 Break fast with dates and water first'
                : '🌴 Berbuka dengan kurma dan air dahulu'
            )}
          </p>
        </div>
      )}
    </div>
  );
}

