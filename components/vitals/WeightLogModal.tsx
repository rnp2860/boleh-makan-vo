'use client';

// components/vitals/WeightLogModal.tsx
// 💓 Weight Log Modal - Quick weight logging with BMI preview

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown, Scale, TrendingDown, TrendingUp, Minus } from 'lucide-react';
import { LogWeightInput } from '@/lib/vitals/types';
import { calculateBMI } from '@/lib/vitals/calculations';
import { classifyBMI } from '@/lib/vitals/status';
import { VitalStatusBadge } from './VitalStatusBadge';

// ============================================
// TYPES
// ============================================

interface WeightLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: LogWeightInput) => Promise<void>;
  isLoading?: boolean;
  language?: 'en' | 'ms';
  userHeightCm?: number;
  previousWeight?: number;
}

// ============================================
// COMPONENT
// ============================================

export function WeightLogModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  language = 'en',
  userHeightCm,
  previousWeight,
}: WeightLogModalProps) {
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [waist, setWaist] = useState('');
  const [notes, setNotes] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const weightRef = useRef<HTMLInputElement>(null);
  
  // Focus on weight input when modal opens
  useEffect(() => {
    if (isOpen && weightRef.current) {
      setTimeout(() => weightRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setWeight('');
      setBodyFat('');
      setWaist('');
      setNotes('');
      setShowOptions(false);
    }
  }, [isOpen]);
  
  // Calculate BMI and status
  const weightNum = parseFloat(weight);
  const isValid = weightNum >= 20 && weightNum <= 300;
  
  const bmi = isValid && userHeightCm 
    ? calculateBMI(weightNum, userHeightCm) 
    : null;
  
  const bmiStatus = bmi ? classifyBMI(bmi) : null;
  
  // Calculate change from previous
  const weightChange = isValid && previousWeight 
    ? weightNum - previousWeight 
    : null;
  
  const handleSubmit = async () => {
    if (!isValid) return;
    
    await onSubmit({
      weightKg: weightNum,
      bodyFatPercent: bodyFat ? parseFloat(bodyFat) : undefined,
      waistCm: waist ? parseFloat(waist) : undefined,
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
            <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center">
              <Scale className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {language === 'ms' ? 'Log Berat Badan' : 'Log Weight'}
              </h2>
              <p className="text-xs text-muted">
                {language === 'ms' ? 'Masukkan berat badan anda' : 'Enter your weight'}
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
          {/* Main Weight Input */}
          <div className="text-center">
            <label className="block text-xs text-muted mb-3">
              {language === 'ms' ? 'Berat' : 'Weight'}
            </label>
            <div className="flex items-center justify-center gap-2">
              <input
                ref={weightRef}
                type="number"
                inputMode="decimal"
                step="0.1"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="65.0"
                className="w-40 h-24 text-5xl font-bold text-center bg-muted/10 border-2 border-border rounded-2xl focus:border-primary focus:outline-none transition-colors"
                min={20}
                max={300}
              />
              <span className="text-2xl font-medium text-muted">kg</span>
            </div>
          </div>
          
          {/* Change indicator */}
          {weightChange !== null && (
            <div className="flex justify-center">
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium ${
                weightChange < -0.1 
                  ? 'bg-green-100 text-green-700'
                  : weightChange > 0.1
                  ? 'bg-red-100 text-red-700'
                  : 'bg-muted/20 text-muted'
              }`}>
                {weightChange < -0.1 ? (
                  <TrendingDown className="w-4 h-4" />
                ) : weightChange > 0.1 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <Minus className="w-4 h-4" />
                )}
                {Math.abs(weightChange).toFixed(1)} kg
                <span className="text-xs opacity-70">
                  {language === 'ms' ? ' dari sebelum' : ' from last'}
                </span>
              </div>
            </div>
          )}
          
          {/* BMI Preview */}
          {bmi && bmiStatus && (
            <div className="bg-muted/10 rounded-2xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted mb-1">BMI</p>
                  <p className="text-2xl font-bold text-foreground">{bmi}</p>
                </div>
                <VitalStatusBadge
                  status={bmiStatus.status}
                  label={language === 'ms' ? bmiStatus.labelMs : bmiStatus.label}
                  size="md"
                />
              </div>
            </div>
          )}
          
          {!userHeightCm && isValid && (
            <p className="text-xs text-center text-muted">
              {language === 'ms' 
                ? 'Tambah tinggi di profil untuk lihat BMI' 
                : 'Add your height in profile to see BMI'}
            </p>
          )}
          
          {/* Advanced Options Toggle */}
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="w-full flex items-center justify-between py-2 text-sm text-muted hover:text-foreground transition-colors"
          >
            <span>{language === 'ms' ? 'Pilihan lanjutan' : 'More options'}</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showOptions ? 'rotate-180' : ''}`} />
          </button>
          
          {/* Advanced Options */}
          {showOptions && (
            <div className="space-y-4 animate-in slide-in-from-top-2">
              {/* Body Fat */}
              <div>
                <label className="block text-xs text-muted mb-2">
                  {language === 'ms' ? 'Lemak Badan (pilihan)' : 'Body Fat % (optional)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={bodyFat}
                    onChange={(e) => setBodyFat(e.target.value)}
                    placeholder="25.0"
                    className="flex-1 h-12 px-4 text-lg bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
                    min={1}
                    max={60}
                  />
                  <span className="text-sm text-muted">%</span>
                </div>
              </div>
              
              {/* Waist */}
              <div>
                <label className="block text-xs text-muted mb-2">
                  {language === 'ms' ? 'Lilitan Pinggang (pilihan)' : 'Waist Circumference (optional)'}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    inputMode="decimal"
                    step="0.1"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="85.0"
                    className="flex-1 h-12 px-4 text-lg bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
                    min={40}
                    max={200}
                  />
                  <span className="text-sm text-muted">cm</span>
                </div>
              </div>
              
              {/* Notes */}
              <div>
                <label className="block text-xs text-muted mb-2">
                  {language === 'ms' ? 'Nota' : 'Notes'}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={language === 'ms' ? 'Nota tambahan...' : 'Add notes...'}
                  className="w-full h-20 px-4 py-3 bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none resize-none text-sm"
                />
              </div>
            </div>
          )}
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


