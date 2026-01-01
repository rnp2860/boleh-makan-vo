// components/LogVitalsModal.tsx
'use client';

import { useState } from 'react';
import { 
  VitalType, 
  VitalContextTag, 
  VITAL_TYPE_CONFIG, 
  VITAL_CONTEXT_OPTIONS 
} from '@/types/database';

interface LogVitalsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LogVitalsModal({ isOpen, onClose, onSuccess }: LogVitalsModalProps) {
  const [step, setStep] = useState<'type' | 'value'>('type');
  const [selectedType, setSelectedType] = useState<VitalType | null>(null);
  const [readingValue, setReadingValue] = useState('');
  // Blood Pressure needs two values
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [contextTag, setContextTag] = useState<VitalContextTag>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Get user ID from localStorage
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    let userId = localStorage.getItem('boleh_makan_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('boleh_makan_user_id', userId);
    }
    return userId;
  };

  const handleTypeSelect = (type: VitalType) => {
    setSelectedType(type);
    setStep('value');
    setReadingValue('');
    setBpSystolic('');
    setBpDiastolic('');
    setError('');
    
    // Default context based on vital type
    if (type === 'glucose') {
      setContextTag('fasting');
    } else {
      setContextTag('general');
    }
  };

  const handleSave = async () => {
    if (!selectedType) return;

    // Special handling for Blood Pressure (two values)
    const isBP = selectedType === 'bp_systolic';
    
    if (isBP) {
      // Validate both BP values
      const systolicNum = parseFloat(bpSystolic);
      const diastolicNum = parseFloat(bpDiastolic);
      const systolicConfig = VITAL_TYPE_CONFIG['bp_systolic'];
      const diastolicConfig = VITAL_TYPE_CONFIG['bp_diastolic'];
      
      if (isNaN(systolicNum) || systolicNum < systolicConfig.min || systolicNum > systolicConfig.max) {
        setError(`Systolic must be between ${systolicConfig.min} and ${systolicConfig.max} mmHg`);
        return;
      }
      if (isNaN(diastolicNum) || diastolicNum < diastolicConfig.min || diastolicNum > diastolicConfig.max) {
        setError(`Diastolic must be between ${diastolicConfig.min} and ${diastolicConfig.max} mmHg`);
        return;
      }
      if (diastolicNum >= systolicNum) {
        setError('Diastolic should be lower than Systolic');
        return;
      }
    } else {
      // Standard single-value validation
      if (!readingValue) return;
      const config = VITAL_TYPE_CONFIG[selectedType];
      const numValue = parseFloat(readingValue);
      
      if (isNaN(numValue) || numValue < config.min || numValue > config.max) {
        setError(`Please enter a valid ${config.label} between ${config.min} and ${config.max} ${config.unit}`);
        return;
      }
    }

    const userId = getUserId();
    if (!userId) {
      setError('User session not found. Please refresh the page.');
      return;
    }
    
    // Ensure user_id is a string (safety check for database compatibility)
    const safeUserId = String(userId);

    setIsSaving(true);
    setError('');

    try {
      const measuredAt = new Date().toISOString();
      
      // Build request body based on vital type
      let requestBody: Record<string, any>;
      
      if (isBP) {
        // Blood Pressure - send both values
        requestBody = {
          user_id: safeUserId,
          vital_type: 'blood_pressure',
          bp_systolic: bpSystolic,
          bp_diastolic: bpDiastolic,
          context_tag: contextTag,
          measured_at: measuredAt,
        };
      } else {
        // Single value vital
        const config = VITAL_TYPE_CONFIG[selectedType];
        requestBody = {
          user_id: safeUserId,
          vital_type: selectedType,
          reading_value: readingValue,
          unit: config.unit,
          context_tag: contextTag,
          measured_at: measuredAt,
        };
      }

      console.log('📊 Saving vital:', requestBody);

      // Call the API endpoint
      const response = await fetch('/api/log-vital', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      // Check if response is OK
      if (!response.ok) {
        const statusText = response.statusText || 'Unknown error';
        console.error(`❌ API Error: ${response.status} ${statusText}`);
        
        // Try to get error details from response body
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `Server error: ${response.status}`);
        } catch {
          throw new Error(`Server error: ${response.status} ${statusText}`);
        }
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Failed to save vital');
      }

      console.log('✅ Vital saved successfully:', result);

      // Success - reset and close
      handleClose();
      onSuccess?.();
    } catch (err: any) {
      console.error('❌ Failed to save vital:', err);
      
      // Provide user-friendly error messages
      let userMessage = 'Failed to save. Please try again.';
      if (err.message.includes('fetch')) {
        userMessage = 'Network error. Check your connection and try again.';
      } else if (err.message.includes('404')) {
        userMessage = 'Service unavailable. Please try again later.';
      } else if (err.message) {
        userMessage = err.message;
      }
      
      setError(userMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setStep('type');
    setSelectedType(null);
    setReadingValue('');
    setBpSystolic('');
    setBpDiastolic('');
    setContextTag('general');
    setError('');
    onClose();
  };

  if (!isOpen) return null;

  const config = selectedType ? VITAL_TYPE_CONFIG[selectedType] : null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-end justify-center backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-t-3xl overflow-hidden animate-slideUp shadow-2xl">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-500 to-pink-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl">{step === 'type' ? '📊' : config?.emoji}</span>
              </div>
              <div>
                <h2 className="text-xl font-bold">
                  {step === 'type' ? 'Log Vitals' : `Log ${config?.label}`}
                </h2>
                <p className="text-rose-100 text-sm">
                  {step === 'type' ? 'Select what to track' : `Enter your reading`}
                </p>
              </div>
            </div>
            <button 
              onClick={handleClose}
              className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* Step 1: Select Vital Type */}
          {step === 'type' && (
            <div className="space-y-3">
              <p className="text-slate-500 text-sm mb-4">What would you like to log?</p>
              
              {/* Primary Vitals */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTypeSelect('glucose')}
                  className="p-4 bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-100 rounded-2xl text-left hover:border-red-300 hover:shadow-md transition-all group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🩸</span>
                  <p className="font-bold text-slate-800">Blood Glucose</p>
                  <p className="text-xs text-slate-500">mmol/L</p>
                </button>
                
                <button
                  onClick={() => handleTypeSelect('bp_systolic')}
                  className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 border-2 border-pink-100 rounded-2xl text-left hover:border-pink-300 hover:shadow-md transition-all group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">❤️</span>
                  <p className="font-bold text-slate-800">Blood Pressure</p>
                  <p className="text-xs text-slate-500">mmHg</p>
                </button>
              </div>
              
              {/* Secondary Vitals */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleTypeSelect('weight')}
                  className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-100 rounded-2xl text-left hover:border-blue-300 hover:shadow-md transition-all group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">⚖️</span>
                  <p className="font-bold text-slate-800">Weight</p>
                  <p className="text-xs text-slate-500">kg</p>
                </button>
                
                <button
                  onClick={() => handleTypeSelect('waist_circumference')}
                  className="p-4 bg-gradient-to-br from-purple-50 to-violet-50 border-2 border-purple-100 rounded-2xl text-left hover:border-purple-300 hover:shadow-md transition-all group"
                >
                  <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">📏</span>
                  <p className="font-bold text-slate-800">Waist</p>
                  <p className="text-xs text-slate-500">cm</p>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Enter Value */}
          {step === 'value' && config && (
            <div className="space-y-5">
              
              {/* Back Button */}
              <button 
                onClick={() => setStep('type')}
                className="flex items-center gap-2 text-slate-500 hover:text-slate-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                <span className="text-sm font-medium">Back</span>
              </button>

              {/* Blood Pressure - Two Inputs */}
              {selectedType === 'bp_systolic' ? (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    Blood Pressure Reading
                  </label>
                  <p className="text-xs text-slate-400 mb-3">
                    📟 Enter the reading from your BP Cuff
                  </p>
                  
                  <div className="flex items-center gap-3">
                    {/* Systolic */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-rose-600 mb-1">Systolic (Top)</label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={bpSystolic}
                          onChange={(e) => setBpSystolic(e.target.value)}
                          placeholder="120"
                          className="w-full p-4 text-2xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white transition-colors text-center"
                          autoFocus
                        />
                      </div>
                    </div>
                    
                    <span className="text-2xl text-slate-300 font-bold pt-5">/</span>
                    
                    {/* Diastolic */}
                    <div className="flex-1">
                      <label className="block text-xs font-medium text-pink-600 mb-1">Diastolic (Bottom)</label>
                      <div className="relative">
                        <input
                          type="number"
                          inputMode="numeric"
                          value={bpDiastolic}
                          onChange={(e) => setBpDiastolic(e.target.value)}
                          placeholder="80"
                          className="w-full p-4 text-2xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-pink-400 focus:bg-white transition-colors text-center"
                        />
                      </div>
                    </div>
                    
                    <span className="text-slate-400 font-medium pt-5">mmHg</span>
                  </div>
                  
                  <p className="text-xs text-slate-400 mt-2">
                    Normal: 120/80 mmHg • High: &gt;130/80 mmHg
                  </p>
                </div>
              ) : (
                /* Standard Single Value Input */
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-1">
                    {config.label} Reading
                  </label>
                  {/* UX Hint based on type */}
                  <p className="text-xs text-slate-400 mb-3">
                    {selectedType === 'glucose' && '🩸 Enter the reading from your Glucometer'}
                    {selectedType === 'weight' && '⚖️ Use a weighing scale for best accuracy'}
                    {selectedType === 'waist_circumference' && '📏 Measure at belly button level'}
                  </p>
                  <div className="relative">
                    <input
                      type="number"
                      inputMode="decimal"
                      step="0.1"
                      min={config.min}
                      max={config.max}
                      value={readingValue}
                      onChange={(e) => setReadingValue(e.target.value)}
                      placeholder={
                        selectedType === 'glucose' ? 'e.g., 5.5' : 
                        selectedType === 'weight' ? 'e.g., 75.5' : 
                        'e.g., 85'
                      }
                      className="w-full p-4 pr-16 text-2xl font-bold text-slate-800 bg-slate-50 border-2 border-slate-200 rounded-2xl outline-none focus:border-rose-400 focus:bg-white transition-colors"
                      autoFocus
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                      {config.unit}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Valid range: {config.min} - {config.max} {config.unit}
                    {selectedType === 'glucose' && ' • Target: 4.0-7.0 (fasting)'}
                  </p>
                </div>
              )}

              {/* Context Selector - Only for Glucose */}
              {selectedType === 'glucose' && (
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">
                    When was this taken?
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {VITAL_CONTEXT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setContextTag(option.value)}
                        className={`p-3 rounded-xl text-sm font-medium border-2 transition-all ${
                          contextTag === option.value
                            ? 'bg-rose-500 border-rose-500 text-white shadow-lg'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-rose-200'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={selectedType === 'bp_systolic' ? (!bpSystolic || !bpDiastolic || isSaving) : (!readingValue || isSaving)}
                className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white font-bold text-lg rounded-2xl shadow-lg shadow-rose-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all active:scale-[0.98]"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Saving...
                  </span>
                ) : (
                  `Save ${selectedType === 'bp_systolic' ? 'Blood Pressure' : config.label}`
                )}
              </button>
            </div>
          )}
        </div>

        {/* Footer Tip */}
        <div className="px-6 pb-6">
          <div className="bg-slate-50 rounded-xl p-3 flex items-start gap-3">
            <span className="text-lg">💡</span>
            <p className="text-xs text-slate-500">
              {step === 'type' 
                ? 'Regular tracking helps identify patterns and improve health outcomes.'
                : selectedType === 'glucose'
                  ? 'For best accuracy, measure glucose first thing in the morning before eating.'
                  : 'Consistent daily measurements provide the most useful data.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

