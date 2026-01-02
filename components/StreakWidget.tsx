// components/StreakWidget.tsx
// 🔥 Daily Logging Streak Display

'use client';

import { useState, useEffect } from 'react';
import { Flame, Trophy, Zap } from 'lucide-react';
import { getStreakMessage } from '@/lib/streakCalculator';

interface StreakWidgetProps {
  userId: string | null;
  onStreakLoad?: (streak: number) => void;
  compact?: boolean;
}

export default function StreakWidget({ userId, onStreakLoad, compact = false }: StreakWidgetProps) {
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [animateStreak, setAnimateStreak] = useState(false);

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    const fetchStreak = async () => {
      try {
        const response = await fetch(`/api/user/streak?user_id=${encodeURIComponent(userId)}`);
        const data = await response.json();
        
        if (data.success) {
          setCurrentStreak(data.currentStreak);
          setLongestStreak(data.longestStreak);
          onStreakLoad?.(data.currentStreak);
        }
      } catch (error) {
        console.error('Failed to fetch streak:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStreak();
  }, [userId, onStreakLoad]);

  // Trigger animation on streak update
  useEffect(() => {
    if (currentStreak > 0) {
      setAnimateStreak(true);
      const timer = setTimeout(() => setAnimateStreak(false), 600);
      return () => clearTimeout(timer);
    }
  }, [currentStreak]);

  const message = getStreakMessage(currentStreak);

  // Get gradient based on streak
  const getGradient = () => {
    if (currentStreak === 0) return 'from-slate-200 to-slate-300';
    if (currentStreak < 7) return 'from-orange-400 to-red-500';
    if (currentStreak < 30) return 'from-orange-500 to-red-600';
    return 'from-amber-400 via-orange-500 to-red-600';
  };

  // Get fire icon color
  const getFireColor = () => {
    if (currentStreak === 0) return 'text-slate-400';
    return 'text-white';
  };

  if (isLoading) {
    return (
      <div className={`bg-white rounded-2xl ${compact ? 'p-3' : 'p-4'} shadow-lg border border-slate-100 animate-pulse`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-slate-200 rounded-xl"></div>
          <div className="flex-1">
            <div className="h-4 bg-slate-200 rounded w-20 mb-2"></div>
            <div className="h-3 bg-slate-100 rounded w-32"></div>
          </div>
        </div>
      </div>
    );
  }

  // Compact version for sidebar/header
  if (compact) {
    return (
      <div className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all ${
        currentStreak > 0 
          ? 'bg-gradient-to-r from-orange-100 to-red-100 border border-orange-200' 
          : 'bg-slate-100 border border-slate-200'
      }`}>
        <div className={`relative ${animateStreak ? 'animate-bounce' : ''}`}>
          <Flame className={`w-5 h-5 ${currentStreak > 0 ? 'text-orange-500' : 'text-slate-400'}`} />
          {currentStreak >= 7 && (
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          )}
        </div>
        <span className={`font-bold text-sm ${currentStreak > 0 ? 'text-orange-700' : 'text-slate-500'}`}>
          {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
        </span>
      </div>
    );
  }

  // Full version
  return (
    <div className="bg-white rounded-2xl p-4 shadow-lg border border-slate-100 overflow-hidden">
      <div className="flex items-center gap-4">
        {/* Streak Fire Icon */}
        <div className={`relative w-14 h-14 rounded-2xl bg-gradient-to-br ${getGradient()} flex items-center justify-center shadow-lg ${
          animateStreak ? 'animate-pulse scale-110' : ''
        } transition-transform`}>
          <Flame className={`w-7 h-7 ${getFireColor()} ${currentStreak > 0 ? 'drop-shadow-lg' : ''}`} />
          {currentStreak >= 7 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse">
              <Zap className="w-2.5 h-2.5 text-yellow-800" />
            </div>
          )}
        </div>

        {/* Streak Info */}
        <div className="flex-1">
          <div className="flex items-baseline gap-2">
            <span className={`text-3xl font-black ${currentStreak > 0 ? 'text-slate-800' : 'text-slate-400'}`}>
              {currentStreak}
            </span>
            <span className={`text-sm font-medium ${currentStreak > 0 ? 'text-slate-500' : 'text-slate-400'}`}>
              {currentStreak === 1 ? 'day streak' : 'days streak'}
            </span>
          </div>
          <p className={`text-xs mt-1 ${currentStreak > 0 ? 'text-orange-600' : 'text-slate-400'}`}>
            {message}
          </p>
        </div>

        {/* Longest Streak Badge */}
        {longestStreak > 0 && (
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
              <Trophy className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-[10px] font-bold text-amber-700 mt-1">
              {longestStreak} best
            </span>
          </div>
        )}
      </div>

      {/* Progress to next milestone */}
      {currentStreak > 0 && currentStreak < 7 && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span>Next: 7 day milestone</span>
            <span className="font-medium">{7 - currentStreak} days left</span>
          </div>
          <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full transition-all duration-500"
              style={{ width: `${(currentStreak / 7) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

