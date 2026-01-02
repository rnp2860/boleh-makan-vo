'use client';

// components/vitals/QuickLogFAB.tsx
// 💓 Quick Log FAB - Floating action button for fast vital logging

import React, { useState } from 'react';
import { Plus, X, HeartPulse, Scale, Droplet, TestTube } from 'lucide-react';
import { VitalType } from '@/lib/vitals/types';
import { VITAL_TYPES } from '@/lib/vitals/constants';

// ============================================
// TYPES
// ============================================

interface QuickLogFABProps {
  onSelectType: (type: VitalType) => void;
  language?: 'en' | 'ms';
  position?: 'bottom-right' | 'bottom-center' | 'bottom-left';
  className?: string;
}

// ============================================
// ICON MAP
// ============================================

const VITAL_ICONS = {
  bp: HeartPulse,
  weight: Scale,
  glucose: Droplet,
  labs: TestTube,
};

// ============================================
// COMPONENT
// ============================================

export function QuickLogFAB({
  onSelectType,
  language = 'en',
  position = 'bottom-right',
  className = '',
}: QuickLogFABProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const positionClasses = {
    'bottom-right': 'right-4 bottom-20',
    'bottom-center': 'left-1/2 -translate-x-1/2 bottom-20',
    'bottom-left': 'left-4 bottom-20',
  };
  
  const handleSelect = (type: VitalType) => {
    setIsOpen(false);
    onSelectType(type);
  };
  
  return (
    <div className={`fixed ${positionClasses[position]} z-50 ${className}`}>
      {/* Options */}
      <div
        className={`
          absolute bottom-16 right-0 flex flex-col gap-2
          transition-all duration-200 ease-out
          ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
        `}
      >
        {(['bp', 'glucose', 'weight', 'labs'] as VitalType[]).map((type, index) => {
          const Icon = VITAL_ICONS[type];
          const typeInfo = VITAL_TYPES[type];
          
          return (
            <button
              key={type}
              onClick={() => handleSelect(type)}
              className="flex items-center gap-3 px-4 py-3 bg-background rounded-xl shadow-lg border border-border hover:border-primary/30 transition-all group"
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
              }}
            >
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${typeInfo.color}15` }}
              >
                <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
              </div>
              <div className="text-left">
                <p className="font-medium text-foreground text-sm">
                  {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
                </p>
                <p className="text-xs text-muted">
                  {language === 'ms' ? 'Tekan untuk log' : 'Tap to log'}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Main FAB */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center
          transition-all duration-200
          ${isOpen 
            ? 'bg-foreground text-background rotate-45' 
            : 'bg-primary text-white hover:bg-primary-hover'
          }
        `}
        aria-label={isOpen ? 'Close' : 'Log vitals'}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <Plus className="w-6 h-6" />
        )}
      </button>
      
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 -z-10"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}

// ============================================
// INLINE QUICK LOG BUTTONS
// ============================================

interface QuickLogButtonsProps {
  onSelectType: (type: VitalType) => void;
  language?: 'en' | 'ms';
  compact?: boolean;
  className?: string;
}

export function QuickLogButtons({
  onSelectType,
  language = 'en',
  compact = false,
  className = '',
}: QuickLogButtonsProps) {
  return (
    <div className={`flex gap-2 ${compact ? 'flex-wrap' : ''} ${className}`}>
      {(['bp', 'glucose', 'weight', 'labs'] as VitalType[]).map((type) => {
        const Icon = VITAL_ICONS[type];
        const typeInfo = VITAL_TYPES[type];
        
        if (compact) {
          return (
            <button
              key={type}
              onClick={() => onSelectType(type)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <Icon className="w-4 h-4" style={{ color: typeInfo.color }} />
              <span className="text-sm font-medium text-foreground">
                {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
              </span>
            </button>
          );
        }
        
        return (
          <button
            key={type}
            onClick={() => onSelectType(type)}
            className="flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border border-border hover:border-primary/30 hover:bg-primary/5 transition-all group"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform"
              style={{ backgroundColor: `${typeInfo.color}15` }}
            >
              <Icon className="w-5 h-5" style={{ color: typeInfo.color }} />
            </div>
            <span className="text-xs font-medium text-foreground">
              {language === 'ms' ? typeInfo.labelMs : typeInfo.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}


