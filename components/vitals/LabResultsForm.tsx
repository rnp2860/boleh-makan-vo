'use client';

// components/vitals/LabResultsForm.tsx
// 💓 Lab Results Form - Comprehensive lab results entry modal

import React, { useState, useEffect } from 'react';
import { X, Check, TestTube, Calendar, Building2, ChevronDown } from 'lucide-react';
import { LogLabsInput } from '@/lib/vitals/types';
import { classifyHbA1c, classifyLDL, classifyEGFR } from '@/lib/vitals/status';
import { VitalStatusBadge } from './VitalStatusBadge';

// ============================================
// TYPES
// ============================================

interface LabResultsFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (input: LogLabsInput) => Promise<void>;
  isLoading?: boolean;
  language?: 'en' | 'ms';
}

interface LabField {
  key: keyof LogLabsInput;
  label: string;
  labelMs: string;
  unit: string;
  placeholder: string;
  min: number;
  max: number;
  step: number;
  group: 'glucose' | 'lipids' | 'kidney';
  classify?: (value: number) => { status: any; label: string };
}

const LAB_FIELDS: LabField[] = [
  // Glucose
  {
    key: 'hba1cPercent',
    label: 'HbA1c',
    labelMs: 'HbA1c',
    unit: '%',
    placeholder: '6.5',
    min: 3,
    max: 18,
    step: 0.1,
    group: 'glucose',
    classify: (v) => classifyHbA1c(v),
  },
  // Lipids
  {
    key: 'totalCholesterolMmol',
    label: 'Total Cholesterol',
    labelMs: 'Kolesterol Jumlah',
    unit: 'mmol/L',
    placeholder: '5.0',
    min: 1,
    max: 15,
    step: 0.1,
    group: 'lipids',
  },
  {
    key: 'ldlMmol',
    label: 'LDL Cholesterol',
    labelMs: 'Kolesterol LDL',
    unit: 'mmol/L',
    placeholder: '2.5',
    min: 0.5,
    max: 10,
    step: 0.1,
    group: 'lipids',
    classify: (v) => classifyLDL(v),
  },
  {
    key: 'hdlMmol',
    label: 'HDL Cholesterol',
    labelMs: 'Kolesterol HDL',
    unit: 'mmol/L',
    placeholder: '1.2',
    min: 0.3,
    max: 5,
    step: 0.1,
    group: 'lipids',
  },
  {
    key: 'triglyceridesMmol',
    label: 'Triglycerides',
    labelMs: 'Trigliserida',
    unit: 'mmol/L',
    placeholder: '1.5',
    min: 0.3,
    max: 15,
    step: 0.1,
    group: 'lipids',
  },
  // Kidney
  {
    key: 'egfr',
    label: 'eGFR',
    labelMs: 'eGFR',
    unit: 'mL/min/1.73m²',
    placeholder: '90',
    min: 5,
    max: 150,
    step: 1,
    group: 'kidney',
    classify: (v) => classifyEGFR(v),
  },
  {
    key: 'creatinineUmol',
    label: 'Creatinine',
    labelMs: 'Kreatinin',
    unit: 'μmol/L',
    placeholder: '80',
    min: 20,
    max: 1500,
    step: 1,
    group: 'kidney',
  },
  {
    key: 'uricAcidUmol',
    label: 'Uric Acid',
    labelMs: 'Asid Urik',
    unit: 'μmol/L',
    placeholder: '350',
    min: 100,
    max: 900,
    step: 1,
    group: 'kidney',
  },
];

// ============================================
// COMPONENT
// ============================================

export function LabResultsForm({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  language = 'en',
}: LabResultsFormProps) {
  const [values, setValues] = useState<Record<string, string>>({});
  const [labDate, setLabDate] = useState('');
  const [labProvider, setLabProvider] = useState('');
  const [notes, setNotes] = useState('');
  const [expandedGroup, setExpandedGroup] = useState<string | null>('glucose');
  
  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setValues({});
      setLabDate('');
      setLabProvider('');
      setNotes('');
      setExpandedGroup('glucose');
    } else {
      // Default to today's date
      setLabDate(new Date().toISOString().split('T')[0]);
    }
  }, [isOpen]);
  
  const handleValueChange = (key: string, value: string) => {
    setValues(prev => ({ ...prev, [key]: value }));
  };
  
  // Check if we have at least one lab value
  const hasAnyValue = Object.values(values).some(v => v && v.trim() !== '');
  const hasLabDate = labDate.trim() !== '';
  const isValid = hasAnyValue && hasLabDate;
  
  const handleSubmit = async () => {
    if (!isValid) return;
    
    const input: LogLabsInput = {
      labDate,
      labProvider: labProvider || undefined,
      notes: notes || undefined,
    };
    
    // Add all non-empty values
    LAB_FIELDS.forEach(field => {
      const value = values[field.key];
      if (value && value.trim() !== '') {
        const numValue = parseFloat(value);
        if (!isNaN(numValue)) {
          (input as any)[field.key] = numValue;
        }
      }
    });
    
    await onSubmit(input);
    onClose();
  };
  
  if (!isOpen) return null;
  
  const groupLabels = {
    glucose: { en: 'Glucose Control', ms: 'Kawalan Glukosa' },
    lipids: { en: 'Lipid Profile', ms: 'Profil Lipid' },
    kidney: { en: 'Kidney Function', ms: 'Fungsi Buah Pinggang' },
  };
  
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg bg-background rounded-t-3xl sm:rounded-3xl shadow-xl animate-in slide-in-from-bottom-4 max-h-[90vh] flex flex-col">
        {/* Handle bar (mobile) */}
        <div className="sm:hidden flex justify-center py-2">
          <div className="w-10 h-1 bg-border rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
              <TestTube className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">
                {language === 'ms' ? 'Keputusan Makmal' : 'Lab Results'}
              </h2>
              <p className="text-xs text-muted">
                {language === 'ms' ? 'Masukkan keputusan ujian darah' : 'Enter your blood test results'}
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
        
        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Lab Date & Provider */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-1.5 text-xs text-muted mb-2">
                <Calendar className="w-3.5 h-3.5" />
                {language === 'ms' ? 'Tarikh Ujian' : 'Test Date'} *
              </label>
              <input
                type="date"
                value={labDate}
                onChange={(e) => setLabDate(e.target.value)}
                className="w-full h-11 px-3 bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-sm"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="flex items-center gap-1.5 text-xs text-muted mb-2">
                <Building2 className="w-3.5 h-3.5" />
                {language === 'ms' ? 'Makmal / Klinik' : 'Lab / Clinic'}
              </label>
              <input
                type="text"
                value={labProvider}
                onChange={(e) => setLabProvider(e.target.value)}
                placeholder={language === 'ms' ? 'cth: Hospital Pantai' : 'e.g., Pantai Hospital'}
                className="w-full h-11 px-3 bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-sm"
              />
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
            <p className="text-xs text-blue-700">
              💡 {language === 'ms' 
                ? 'Masukkan nilai yang anda ada. Anda tidak perlu mengisi semua.'
                : 'Enter the values you have. You don\'t need to fill everything.'}
            </p>
          </div>
          
          {/* Lab Fields by Group */}
          {(['glucose', 'lipids', 'kidney'] as const).map((group) => {
            const groupFields = LAB_FIELDS.filter(f => f.group === group);
            const isExpanded = expandedGroup === group;
            
            return (
              <div key={group} className="border border-border rounded-xl overflow-hidden">
                {/* Group Header */}
                <button
                  onClick={() => setExpandedGroup(isExpanded ? null : group)}
                  className="w-full flex items-center justify-between p-4 bg-muted/5 hover:bg-muted/10 transition-colors"
                >
                  <span className="font-medium text-foreground">
                    {language === 'ms' ? groupLabels[group].ms : groupLabels[group].en}
                  </span>
                  <ChevronDown className={`w-5 h-5 text-muted transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </button>
                
                {/* Group Fields */}
                {isExpanded && (
                  <div className="p-4 space-y-4 border-t border-border">
                    {groupFields.map((field) => {
                      const value = values[field.key] || '';
                      const numValue = parseFloat(value);
                      const classification = field.classify && !isNaN(numValue) ? field.classify(numValue) : null;
                      
                      return (
                        <div key={field.key}>
                          <div className="flex items-center justify-between mb-1.5">
                            <label className="text-sm font-medium text-foreground">
                              {language === 'ms' ? field.labelMs : field.label}
                            </label>
                            {classification && (
                              <VitalStatusBadge
                                status={classification.status}
                                label={classification.label}
                                size="sm"
                                showDot={false}
                              />
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              inputMode="decimal"
                              step={field.step}
                              min={field.min}
                              max={field.max}
                              value={value}
                              onChange={(e) => handleValueChange(field.key, e.target.value)}
                              placeholder={field.placeholder}
                              className="flex-1 h-11 px-4 bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none transition-colors text-base"
                            />
                            <span className="text-sm text-muted w-24 text-right">
                              {field.unit}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
          
          {/* Notes */}
          <div>
            <label className="block text-xs text-muted mb-2">
              {language === 'ms' ? 'Nota (pilihan)' : 'Notes (optional)'}
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={language === 'ms' ? 'Nota tambahan...' : 'Additional notes...'}
              className="w-full h-20 px-4 py-3 bg-muted/10 border border-border rounded-xl focus:border-primary focus:outline-none resize-none text-sm"
            />
          </div>
        </div>
        
        {/* Footer */}
        <div className="px-6 pb-6 pt-4 border-t border-border">
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
                {language === 'ms' ? 'Simpan Keputusan' : 'Save Results'}
              </>
            )}
          </button>
          
          {!hasAnyValue && (
            <p className="text-xs text-center text-muted mt-2">
              {language === 'ms' 
                ? 'Masukkan sekurang-kurangnya satu nilai'
                : 'Enter at least one lab value'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}


