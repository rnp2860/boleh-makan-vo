// components/BolehScoreWidget.tsx
'use client';

import { useState, useEffect } from 'react';
import { BolehScoreInfo } from './InfoModal';

interface ScoreData {
  score: number;
  grade: string;
  label: string;
  emoji: string;
  insight: string;
  stats: {
    meals_logged: number;
    vitals_logged: number;
  };
}

interface BolehScoreWidgetProps {
  userId: string | null;
}

export default function BolehScoreWidget({ userId }: BolehScoreWidgetProps) {
  const [scoreData, setScoreData] = useState<ScoreData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`/api/user/score?user_id=${encodeURIComponent(userId)}`);
        const result = await response.json();

        if (result.success && result.data) {
          setScoreData({
            score: result.data.score,
            grade: result.data.grade,
            label: result.data.label,
            emoji: result.data.emoji,
            insight: result.data.insight,
            stats: result.data.stats,
          });
        } else {
          // Use default score if API fails
          setScoreData({
            score: 70,
            grade: 'B',
            label: 'Good',
            emoji: '👍',
            insight: 'Start tracking to get your personalized score!',
            stats: { meals_logged: 0, vitals_logged: 0 },
          });
        }
      } catch (err) {
        console.error('Failed to fetch score:', err);
        setError('Unable to load score');
        // Fallback
        setScoreData({
          score: 70,
          grade: 'B',
          label: 'Good',
          emoji: '👍',
          insight: 'Track meals to see your health score!',
          stats: { meals_logged: 0, vitals_logged: 0 },
        });
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, [userId]);

  // Get color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return { 
      primary: '#10B981', // Emerald-500
      secondary: '#D1FAE5', // Emerald-100
      bg: 'from-emerald-500 to-green-600',
      ring: '#10B981',
      text: 'text-emerald-600',
      label: 'Excellent'
    };
    if (score >= 50) return { 
      primary: '#F59E0B', // Amber-500
      secondary: '#FEF3C7', // Amber-100
      bg: 'from-amber-500 to-orange-500',
      ring: '#F59E0B',
      text: 'text-amber-600',
      label: 'Fair'
    };
    return { 
      primary: '#EF4444', // Red-500
      secondary: '#FEE2E2', // Red-100
      bg: 'from-red-500 to-rose-600',
      ring: '#EF4444',
      text: 'text-red-600',
      label: 'At Risk'
    };
  };

  const score = scoreData?.score ?? 70;
  const colors = getScoreColor(score);
  
  // Calculate stroke dasharray for circular progress
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 shadow-lg border border-slate-100">
        <div className="flex items-center justify-center gap-4">
          <div className="w-32 h-32 rounded-full bg-slate-100 animate-pulse"></div>
          <div className="flex-1 space-y-3">
            <div className="h-6 bg-slate-100 rounded-lg w-32 animate-pulse"></div>
            <div className="h-4 bg-slate-100 rounded-lg w-48 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-lg border border-slate-100 overflow-hidden relative">
      {/* Background Gradient Accent */}
      <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${colors.bg} opacity-10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2`}></div>
      
      <div className="flex items-center gap-5 relative">
        {/* Circular Score Gauge */}
        <div className="relative flex-shrink-0">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={colors.secondary}
              strokeWidth="10"
            />
            {/* Progress Circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              fill="none"
              stroke={colors.ring}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: `drop-shadow(0 0 8px ${colors.primary}40)`,
              }}
            />
          </svg>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-slate-900">{score}</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Boleh</span>
          </div>
        </div>

        {/* Score Details */}
        <div className="flex-1 min-w-0">
          {/* Grade Badge */}
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-2xl`}>{scoreData?.emoji}</span>
            <div className={`px-3 py-1 rounded-full text-xs font-bold ${colors.text} bg-opacity-20`} 
                 style={{ backgroundColor: `${colors.primary}20` }}>
              {scoreData?.grade} · {colors.label}
            </div>
          </div>
          
          {/* Insight */}
          <p className="text-sm text-slate-600 leading-snug mb-3 line-clamp-2">
            {scoreData?.insight}
          </p>
          
          {/* Stats Pills */}
          <div className="flex gap-2">
            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="text-xs">🍽️</span>
              <span className="text-[11px] font-bold text-slate-600">{scoreData?.stats.meals_logged} meals</span>
            </div>
            <div className="flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full">
              <span className="text-xs">❤️</span>
              <span className="text-[11px] font-bold text-slate-600">{scoreData?.stats.vitals_logged} vitals</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Label */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-teal-400 to-emerald-500 animate-pulse"></div>
          <span className="text-[11px] font-medium text-slate-400">Today's Health Score</span>
          <BolehScoreInfo />
        </div>
        <span className="text-[10px] font-bold text-slate-300 uppercase">Powered by Boleh AI</span>
      </div>
    </div>
  );
}

