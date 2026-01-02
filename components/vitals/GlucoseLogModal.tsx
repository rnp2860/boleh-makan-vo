'use client';

// components/vitals/GlucoseLogModal.tsx
// 💓 Glucose Log Modal - Quick blood glucose logging with timing selection

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, Droplet, Sun, Coffee, Utensils, Moon, Clock } from 'lucide-react';
import { LogGlucoseInput, GlucoseTiming } from '@/lib/vitals/types';
import { GLUCOSE_TIMING_OPTIONS, convertGlucoseToMmol } from '@/lib/vitals/constants';
import { classifyGlucose } from '@/lib/vitals/status';
import { VitalStatusBadge } from './VitalStatusBadge';

// ============================================
// TYPES
// ============================================

interface GlucoseLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: LogGlucoseInput) => Promise<void>;
  isLoading?: boolean;
  language?: 'en' | 'ms';
}

// ============================================
// TIMING ICONS
// ============================================

const TIMING_ICONS: Record<GlucoseTiming, React.ElementType> = {
  fasting: Sun,
  before_meal: Coffee,
  after_meal: Utensils,
  bedtime: Moon,
  random: Clock,
};

// ============================================
// COMPONENT
// ============================================

export function GlucoseLogModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  language = 'en',
}: GlucoseLogModalProps) {
  const [glucoseValue, setGlucoseValue] = useState('');
  const [timing, setTiming] = useState<GlucoseTiming>('random');
  const [unit, setUnit] = useState<'mmol' | 'mgdl'>('mmol');
  const [notes, setNotes] = useState('');
  
  const glucoseRef = useRef<HTMLInputElement>(null);
  
  // Focus on glucose input when modal opens
  useEffect(() => {
    if (isOpen && glucoseRef.current) {
      setTimeout(() => glucoseRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setGlucoseValue('');
      setTiming('random');
      setNotes('');
    }
  }, [isOpen]);
  
  // Convert value to mmol/L
  const getValueInMmol = (): number | null => {
    const val = parseFloat(glucoseValue);
    if (isNaN(val)) return null;
    
    if (unit === 'mgdl') {
      return convertGlucoseToMmol(val);
    }
    return val;
  };
  
  // Validate and get status
  const mmolValue = getValueInMmol();
  const isValid = mmolValue !== null && mmolValue >= 1 && mmolValue <= 35;
  const status = isValid ? classifyGlucose(mmolValue!, timing) : null;
  
  const handleSubmit = async () => {
    if (!isValid || mmolValue === null) return;
    
    await onSubmit({
      glucoseMmol: mmolValue,
      glucoseTiming: timing,
      notes: notes || undefined,
    });
    
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-background rounded-t-3xl sm:rounded-3xl shadow-xl animate-in slide-in-from-bottom-4">
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
              <Droplet className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {language === 'ms' ? 'Log Glukosa Darah' : 'Log Blood Glucose'}
              </h2>
              <p className="text-xs text-muted">
                {language === 'ms' ? 'Masukkan bacaan glukosa anda' : 'Enter your glucose reading'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-muted" />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Timing Selection */}
          <div>
            <label className="block text-xs text-muted mb-3">
              {language === 'ms' ? 'Masa' : 'Timing'}
            </label>
            <div className="grid grid-cols-5 gap-2">
              {GLUCOSE_TIMING_OPTIONS.map((option) => {
                const Icon = TIMING_ICONS[option.value];
                const isSelected = timing === option.value;
                
                return (
                  <button
                    key={option.value}
                    onClick={() => setTiming(option.value)}
                    className={`
                      flex flex-col items-center gap-1 p-2 rounded-xl transition-all
                      ${isSelected 
                        ? 'bg-primary text-white' 
                        : 'bg-muted/10 text-foreground hover:bg-muted/20'
                      }
                    `}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-[10px] font-medium text-center leading-tight">
                      {language === 'ms' ? option.labelMs : option.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
          
          {/* Unit Toggle */}
          <div className="flex justify-center">
            <div className="inline-flex bg-muted/10 rounded-lg p-1">
              <button
                onClick={() => setUnit('mmol')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  unit === 'mmol' 
                    ? 'bg-background shadow text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                mmol/L
              </button>
              <button
                onClick={() => setUnit('mgdl')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  unit === 'mgdl' 
                    ? 'bg-background shadow text-foreground' 
                    : 'text-muted hover:text-foreground'
                }`}
              >
                mg/dL
              </button>
            </div>
          </div>
          
          {/* Glucose Input */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2">
              <input
                ref={glucoseRef}
                type="number"
                inputMode="decimal"
                step={unit === 'mmol' ? '0.1' : '1'}
                value={glucoseValue}
                onChange={(e) => setGlucoseValue(e.target.value)}
                placeholder={unit === 'mmol' ? '5.5' : '100'}
                className="w-40 h-24 text-5xl font-bold text-center bg-muted/10 border-2 border-border rounded-2xl focus:border-primary focus:outline-none transition-colors"
              />
              <span className="text-lg text-muted">
                {unit === 'mmol' ? 'mmol/L' : 'mg/dL'}
              </span>
            </div>
            
            {/* Show conversion */}
            {glucoseValue && unit === 'mgdl' && mmolValue && (
              <p className="text-sm text-muted mt-2">
                = {mmolValue.toFixed(1)} mmol/L
              </p>
            )}
          </div>
          
          {/* Status Preview */}
          {status && (
            <div className="flex justify-center">
              <VitalStatusBadge
                status={status.status}
                label={language === 'ms' ? status.labelMs : status.label}
                size="lg"
              />
            </div>
          )}
          
          {/* Reference ranges */}
          <div className="bg-muted/10 rounded-xl p-3">
            <p className="text-xs text-muted text-center">
              {timing === 'fasting' || timing === 'before_meal' ? (
                language === 'ms' 
                  ? 'Sasaran puasa: 4.0 - 7.0 mmol/L'
                  : 'Fasting target: 4.0 - 7.0 mmol/L'
              ) : (
                language === 'ms'
                  ? 'Sasaran selepas makan: < 10.0 mmol/L'
                  : 'Post-meal target: < 10.0 mmol/L'
              )}
            </p>
          </div>
          
          {/* Notes */}
          <div>
            <label className="block text-xs text-muted mb-2">
              {language === 'ms' ? 'Nota (pilihan)' : 'Notes (optional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ms' ? 'Nota tambahan...' : 'Add notes...'}
              className="w-full h-16 px-4 py-3 bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none resize-none text-sm"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 pt-2">
          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className={`
              w-full h-14 rounded-2xl font-semibold text-lg
              flex items-center justify-center gap-2
              transition-all
              ${isValid && !isLoading
                ? 'bg-primary text-white hover:bg-primary-hover active:scale-[0.98]'
                : 'bg-muted/20 text-muted cursor-not-allowed'
              }
            `}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Check className="w-5 h-5" />
                {language === 'ms' ? 'Simpan' : 'Save'}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}


