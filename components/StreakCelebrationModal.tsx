// components/StreakCelebrationModal.tsx
// 🎉 Milestone Streak Celebration

'use client';

import { useEffect, useState } from 'react';
import { Flame, Trophy, Star, Sparkles, X } from 'lucide-react';
import { getMilestoneMessage, STREAK_MILESTONES } from '@/lib/streakCalculator';

interface StreakCelebrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  streak: number;
  isNewRecord?: boolean;
}

export default function StreakCelebrationModal({ 
  isOpen, 
  onClose, 
  streak, 
  isNewRecord = false 
}: StreakCelebrationModalProps) {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowConfetti(true);
      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const { title, subtitle } = getMilestoneMessage(streak);
  const isMajorMilestone = streak >= 30;

  // Get milestone tier color
  const getTierColor = () => {
    if (streak >= 365) return 'from-purple-500 via-pink-500 to-red-500';
    if (streak >= 90) return 'from-amber-400 via-yellow-400 to-orange-400';
    if (streak >= 30) return 'from-orange-500 to-red-600';
    return 'from-orange-400 to-red-500';
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-confetti"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${2 + Math.random() * 2}s`,
              }}
            >
              <div 
                className={`w-3 h-3 ${
                  ['bg-orange-400', 'bg-red-400', 'bg-yellow-400', 'bg-amber-400'][i % 4]
                } ${['rounded-full', 'rounded-sm', 'rotate-45'][i % 3]}`}
              />
            </div>
          ))}
        </div>
      )}

      {/* Modal Content */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Gradient Header */}
        <div className={`bg-gradient-to-br ${getTierColor()} p-8 text-center relative overflow-hidden`}>
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
          
          {/* Close button */}
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-4 h-4 text-white" />
          </button>

          {/* Icon */}
          <div className="relative inline-block mb-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              {isMajorMilestone ? (
                <Trophy className="w-10 h-10 text-white drop-shadow-lg" />
              ) : (
                <Flame className="w-10 h-10 text-white drop-shadow-lg" />
              )}
            </div>
            {/* Sparkles */}
            <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-300 animate-pulse" />
            <Star className="absolute -bottom-1 -left-1 w-5 h-5 text-yellow-300 animate-pulse" style={{ animationDelay: '0.2s' }} />
          </div>

          {/* Title */}
          <h2 className="text-2xl font-black text-white mb-2 drop-shadow-lg">
            {title}
          </h2>
          <p className="text-white/90 text-sm">
            {subtitle}
          </p>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* New Record Badge */}
          {isNewRecord && (
            <div className="flex items-center justify-center gap-2 bg-amber-50 border border-amber-200 rounded-xl py-2 px-4 mb-4">
              <Trophy className="w-4 h-4 text-amber-600" />
              <span className="text-amber-700 font-bold text-sm">New Personal Best!</span>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-orange-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-orange-600">{streak}</div>
              <div className="text-xs text-orange-500 font-medium">Days</div>
            </div>
            <div className="bg-slate-50 rounded-xl p-3 text-center">
              <div className="text-2xl font-black text-slate-600">
                {streak >= 7 ? Math.floor(streak / 7) : 0}
              </div>
              <div className="text-xs text-slate-500 font-medium">Weeks</div>
            </div>
          </div>

          {/* Message */}
          <p className="text-center text-slate-600 text-sm mb-6">
            You're building incredible healthy habits! Keep logging your meals to maintain your streak.
          </p>

          {/* CTA Button */}
          <button
            onClick={onClose}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold rounded-2xl shadow-lg shadow-orange-200 hover:shadow-xl transition-all active:scale-[0.98]"
          >
            🔥 Keep It Going!
          </button>

          {/* Next milestone hint */}
          {streak < STREAK_MILESTONES[STREAK_MILESTONES.length - 1] && (
            <p className="text-center text-slate-400 text-xs mt-4">
              Next milestone: {STREAK_MILESTONES.find(m => m > streak)} days
            </p>
          )}
        </div>
      </div>

      {/* CSS for confetti animation */}
      <style jsx>{`
        @keyframes confetti {
          0% {
            transform: translateY(-100vh) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-confetti {
          animation: confetti 3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

