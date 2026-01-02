'use client';

// components/vitals/BPLogModal.tsx
// 💓 BP Log Modal - Quick blood pressure logging with large touch targets

import React, { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown, HeartPulse } from 'lucide-react';
import { LogBPInput, BPArm, BPPosition } from '@/lib/vitals/types';
import { classifyBP } from '@/lib/vitals/status';
import { VitalStatusBadge } from './VitalStatusBadge';

// ============================================
// TYPES
// ============================================

interface BPLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: LogBPInput) => Promise<void>;
  isLoading?: boolean;
  language?: 'en' | 'ms';
}

// ============================================
// COMPONENT
// ============================================

export function BPLogModal({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  language = 'en',
}: BPLogModalProps) {
  const [systolic, setSystolic] = useState('');
  const [diastolic, setDiastolic] = useState('');
  const [pulse, setPulse] = useState('');
  const [arm, setArm] = useState<BPArm>('left');
  const [position, setPosition] = useState<BPPosition>('sitting');
  const [notes, setNotes] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  
  const systolicRef = useRef<HTMLInputElement>(null);
  
  // Focus on systolic input when modal opens
  useEffect(() => {
    if (isOpen && systolicRef.current) {
      setTimeout(() => systolicRef.current?.focus(), 100);
    }
  }, [isOpen]);
  
  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setSystolic('');
      setDiastolic('');
      setPulse('');
      setArm('left');
      setPosition('sitting');
      setNotes('');
      setShowOptions(false);
    }
  }, [isOpen]);
  
  // Get status preview
  const getPreview = () => {
    const sys = parseInt(systolic);
    const dia = parseInt(diastolic);
    if (!sys || !dia || sys < 60 || sys > 250 || dia < 40 || dia > 150) return null;
    return classifyBP(sys, dia);
  };
  
  const preview = getPreview();
  const isValid = preview !== null;
  
  const handleSubmit = async () => {
    if (!isValid) return;
    
    await onSubmit({
      systolicBp: parseInt(systolic),
      diastolicBp: parseInt(diastolic),
      pulse: pulse ? parseInt(pulse) : undefined,
      bpArm: arm,
      bpPosition: position,
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
            <div className="w-10 h-10 rounded-xl bg-red-100 flex items-center justify-center">
              <HeartPulse className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {language === 'ms' ? 'Log Tekanan Darah' : 'Log Blood Pressure'}
              </h2>
              <p className="text-xs text-muted">
                {language === 'ms' ? 'Masukkan bacaan BP anda' : 'Enter your BP reading'}
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
          {/* Main BP Input */}
          <div className="flex items-center justify-center gap-4">
            {/* Systolic */}
            <div className="text-center">
              <label className="block text-xs text-muted mb-2">
                {language === 'ms' ? 'Sistolik' : 'Systolic'}
              </label>
              <input
                ref={systolicRef}
                type="number"
                inputMode="numeric"
                value={systolic}
                onChange={(e) => setSystolic(e.target.value)}
                placeholder="120"
                className="w-24 h-20 text-4xl font-bold text-center bg-muted/10 border-2 border-border rounded-2xl focus:border-primary focus:outline-none transition-colors"
                min={60}
                max={250}
              />
            </div>
            
            {/* Separator */}
            <span className="text-4xl font-bold text-muted pt-6">/</span>
            
            {/* Diastolic */}
            <div className="text-center">
              <label className="block text-xs text-muted mb-2">
                {language === 'ms' ? 'Diastolik' : 'Diastolic'}
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={diastolic}
                onChange={(e) => setDiastolic(e.target.value)}
                placeholder="80"
                className="w-24 h-20 text-4xl font-bold text-center bg-muted/10 border-2 border-border rounded-2xl focus:border-primary focus:outline-none transition-colors"
                min={40}
                max={150}
              />
            </div>
          </div>
          
          {/* Unit label */}
          <p className="text-center text-sm text-muted">mmHg</p>
          
          {/* Preview */}
          {preview && (
            <div className="flex justify-center">
              <VitalStatusBadge
                status={preview.status}
                label={language === 'ms' ? preview.labelMs : preview.label}
                size="lg"
              />
            </div>
          )}
          
          {/* Optional: Pulse */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="block text-xs text-muted mb-1">
                {language === 'ms' ? 'Denyutan (pilihan)' : 'Pulse (optional)'}
              </label>
              <input
                type="number"
                inputMode="numeric"
                value={pulse}
                onChange={(e) => setPulse(e.target.value)}
                placeholder="72"
                className="w-full h-12 text-lg text-center bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none transition-colors"
                min={30}
                max={220}
              />
            </div>
            <span className="text-sm text-muted pt-5">bpm</span>
          </div>
          
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
              {/* Arm Selection */}
              <div>
                <label className="block text-xs text-muted mb-2">
                  {language === 'ms' ? 'Lengan' : 'Arm'}
                </label>
                <div className="flex gap-2">
                  {(['left', 'right'] as BPArm[]).map((a) => (
                    <button
                      key={a}
                      onClick={() => setArm(a)}
                      className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                        arm === a
                          ? 'bg-primary text-white'
                          : 'bg-muted/10 text-foreground hover:bg-muted/20'
                      }`}
                    >
                      {language === 'ms' 
                        ? (a === 'left' ? 'Kiri' : 'Kanan')
                        : (a === 'left' ? 'Left' : 'Right')
                      }
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Position Selection */}
              <div>
                <label className="block text-xs text-muted mb-2">
                  {language === 'ms' ? 'Posisi' : 'Position'}
                </label>
                <div className="flex gap-2">
                  {(['sitting', 'standing', 'lying'] as BPPosition[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPosition(p)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                        position === p
                          ? 'bg-primary text-white'
                          : 'bg-muted/10 text-foreground hover:bg-muted/20'
                      }`}
                    >
                      {language === 'ms'
                        ? (p === 'sitting' ? 'Duduk' : p === 'standing' ? 'Berdiri' : 'Baring')
                        : (p === 'sitting' ? 'Sitting' : p === 'standing' ? 'Standing' : 'Lying')
                      }
                    </button>
                  ))}
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


