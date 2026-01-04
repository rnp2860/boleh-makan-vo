// components/dashboard/BolehScore.tsx
// 🎯 Enhanced Boleh Score with Gamification
'use client';

import { useState } from 'react';
import { Info } from 'lucide-react';
import { BolehScoreInfo } from '../InfoModal';

interface BolehScoreProps {
  score: number;
  previousScore: number;
  streak: number;
  mealsLogged: number;
  targetMeals?: number;
  vitalsLogged?: number;
}

export default function BolehScore({
  score,
  previousScore,
  streak,
  mealsLogged,
  targetMeals = 3,
  vitalsLogged = 0,
}: BolehScoreProps) {
  
  // Calculate score change
  const scoreChange = score - previousScore;
  const changeText = scoreChange > 0 
    ? `📈 Naik ${scoreChange} mata` 
    : scoreChange < 0 
      ? `📉 Turun ${Math.abs(scoreChange)} mata`
      : `➡️ Sama seperti semalam`;

  // Score category with color coding
  const getScoreCategory = () => {
    if (score >= 80) return {
      label: 'Cemerlang! 🌟',
      color: 'emerald',
      gradient: 'from-emerald-500 to-green-600',
      ringColor: '#10B981',
      bgColor: '#D1FAE5',
      textColor: 'text-emerald-600',
    };
    if (score >= 60) return {
      label: 'Bagus! 👍',
      color: 'teal',
      gradient: 'from-teal-500 to-cyan-600',
      ringColor: '#14B8A6',
      bgColor: '#CCFBF1',
      textColor: 'text-teal-600',
    };
    if (score >= 40) return {
      label: 'Boleh improve',
      color: 'yellow',
      gradient: 'from-yellow-500 to-amber-600',
      ringColor: '#EAB308',
      bgColor: '#FEF3C7',
      textColor: 'text-yellow-600',
    };
    return {
      label: 'Perlu perhatian',
      color: 'red',
      gradient: 'from-red-500 to-rose-600',
      ringColor: '#EF4444',
      bgColor: '#FEE2E2',
      textColor: 'text-red-600',
    };
  };

  const category = getScoreCategory();

  // Circular progress calculation
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  // Achievement badges
  const getAchievementBadge = () => {
    if (streak >= 7) return { emoji: '🏆', text: 'Minggu Sihat!', show: true };
    if (streak >= 3) return { emoji: '⭐', text: `${streak} Hari Berturut-turut!`, show: true };
    return { emoji: '', text: '', show: false };
  };

  const achievement = getAchievementBadge();

  // Motivational tip based on score level
  const getMotivationalTip = () => {
    if (score >= 80) return 'Anda sedang cemerlang! Teruskan usaha ini! 💪';
    if (score >= 60) return 'Prestasi bagus! Cuba tambah sayur-sayuran lagi. 🥗';
    if (score >= 40) return 'Anda boleh buat lebih baik! Elak makanan goreng. 🍳';
    return 'Jom mulakan perubahan! Log makanan sihat hari ini. 🌟';
  };

  return (
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-slate-100 overflow-hidden relative">
      {/* Background Gradient Accent */}
      <div className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-br ${category.gradient} opacity-10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2`}></div>
      
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wide">Boleh Score</h3>
          <BolehScoreInfo />
        </div>

        {/* Main Score Display */}
        <div className="flex items-center gap-6 mb-5">
          {/* Circular Score Ring */}
          <div className="relative flex-shrink-0">
            <svg width="130" height="130" className="transform -rotate-90">
              {/* Background Circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={category.bgColor}
                strokeWidth="12"
              />
              {/* Progress Circle */}
              <circle
                cx="65"
                cy="65"
                r={radius}
                fill="none"
                stroke={category.ringColor}
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-1000 ease-out"
                style={{
                  filter: `drop-shadow(0 0 10px ${category.ringColor}40)`,
                }}
              />
            </svg>
            
            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-black text-slate-900">{score}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">/ 100</span>
            </div>
          </div>

          {/* Score Details */}
          <div className="flex-1 min-w-0">
            {/* Category Label */}
            <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${category.textColor} font-bold text-sm mb-2`}
                 style={{ backgroundColor: category.bgColor }}>
              {category.label}
            </div>
            
            {/* Score Change */}
            <div className="text-xs font-medium text-slate-500 mb-3">
              {previousScore > 0 ? changeText : 'Skor pertama anda!'}
            </div>

            {/* Achievement Badge */}
            {achievement.show && (
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100 px-3 py-1.5 rounded-lg inline-flex items-center gap-1.5">
                <span className="text-base">{achievement.emoji}</span>
                <span className="text-xs font-bold text-purple-600">{achievement.text}</span>
              </div>
            )}
          </div>
        </div>

        {/* Meal Count Progress */}
        <div className="bg-slate-50 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-600">Makanan Hari Ini</span>
            <span className={`text-xs font-bold ${mealsLogged >= targetMeals ? 'text-emerald-600' : 'text-slate-400'}`}>
              {mealsLogged}/{targetMeals}
            </span>
          </div>
          
          {/* Meal Dots */}
          <div className="flex gap-2">
            {[...Array(targetMeals)].map((_, i) => (
              <div
                key={i}
                className={`flex-1 h-2 rounded-full transition-all duration-300 ${
                  i < mealsLogged 
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-sm' 
                    : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Streak Counter */}
        {streak > 0 && (
          <div className="bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-100 rounded-xl p-3 mb-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔥</span>
              <div className="flex-1">
                <div className="text-xs font-bold text-orange-700">{streak} Hari Berturut-turut!</div>
                <div className="text-[10px] text-orange-500">Jangan putuskan streak anda!</div>
              </div>
            </div>
          </div>
        )}

        {/* Motivational Tip */}
        <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-100 rounded-xl p-3">
          <div className="flex items-start gap-2">
            <span className="text-base flex-shrink-0">💡</span>
            <p className="text-xs text-blue-700 leading-relaxed">
              {getMotivationalTip()}
            </p>
          </div>
        </div>

        {/* Stats Pills */}
        {vitalsLogged > 0 && (
          <div className="flex gap-2 mt-3">
            <div className="flex items-center gap-1 bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
              <span className="text-xs">❤️</span>
              <span className="text-[11px] font-bold text-rose-600">{vitalsLogged} bacaan</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

