'use client';

// 🇲🇾 Waitlist Signup Form Component

import React, { useState, useEffect } from 'react';
import { Loader2, CheckCircle, Mail, User, Sparkles } from 'lucide-react';

interface WaitlistFormProps {
  variant?: 'hero' | 'ramadan' | 'final';
  showConditions?: boolean;
  showRamadanCheckbox?: boolean;
  showNameField?: boolean;
  source?: string;
  className?: string;
}

const CONDITIONS = [
  { id: 'diabetes', label: 'Diabetes', labelBm: 'Kencing Manis' },
  { id: 'hypertension', label: 'Hypertension', labelBm: 'Darah Tinggi' },
  { id: 'cholesterol', label: 'High Cholesterol', labelBm: 'Kolesterol' },
  { id: 'ckd', label: 'Kidney Disease', labelBm: 'Buah Pinggang' },
];

export function WaitlistForm({
  variant = 'hero',
  showConditions = false,
  showRamadanCheckbox = false,
  showNameField = false,
  source = 'landing_page',
  className = '',
}: WaitlistFormProps) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [conditions, setConditions] = useState<string[]>([]);
  const [interestedInRamadan, setInterestedInRamadan] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  
  // Get UTM params from URL
  const [utmParams, setUtmParams] = useState({
    utmSource: '',
    utmMedium: '',
    utmCampaign: '',
  });
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      setUtmParams({
        utmSource: params.get('utm_source') || '',
        utmMedium: params.get('utm_medium') || '',
        utmCampaign: params.get('utm_campaign') || '',
      });
    }
  }, []);
  
  const handleConditionToggle = (conditionId: string) => {
    setConditions(prev =>
      prev.includes(conditionId)
        ? prev.filter(c => c !== conditionId)
        : [...prev, conditionId]
    );
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: showNameField ? name : undefined,
          conditions: showConditions ? conditions : undefined,
          interestedInRamadan: showRamadanCheckbox ? interestedInRamadan : undefined,
          source,
          ...utmParams,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Pendaftaran gagal');
      }
      
      setIsSuccess(true);
      setMessage(data.message);
      
      // Track success event
      if (typeof window !== 'undefined' && (window as Window & { gtag?: (...args: unknown[]) => void }).gtag) {
        (window as Window & { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'waitlist_signup', {
          source,
          has_conditions: conditions.length > 0,
          interested_ramadan: interestedInRamadan,
        });
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ralat. Sila cuba lagi.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Success state
  if (isSuccess) {
    return (
      <div className={`text-center py-8 ${className}`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-emerald-600" />
        </div>
        <h3 className="text-xl font-bold text-slate-800 mb-2">
          Terima Kasih! 🎉
        </h3>
        <p className="text-slate-600">
          {message || 'Anda dalam senarai menunggu. Kami akan hubungi anda tidak lama lagi!'}
        </p>
      </div>
    );
  }
  
  // Variant-specific styles
  const getInputStyles = () => {
    if (variant === 'ramadan') {
      return 'bg-white/90 border-amber-200 focus:ring-amber-500 focus:border-amber-500';
    }
    return 'bg-white border-slate-200 focus:ring-emerald-500 focus:border-emerald-500';
  };
  
  const getButtonStyles = () => {
    if (variant === 'ramadan') {
      return 'bg-amber-500 hover:bg-amber-600 focus:ring-amber-500';
    }
    return 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500';
  };
  
  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="space-y-4">
        {/* Email Input */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email anda"
            required
            className={`w-full pl-12 pr-4 py-4 rounded-xl border text-slate-800 placeholder-slate-400
                       focus:outline-none focus:ring-2 transition-all duration-200 ${getInputStyles()}`}
          />
        </div>
        
        {/* Name Input (optional) */}
        {showNameField && (
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama anda (pilihan)"
              className={`w-full pl-12 pr-4 py-4 rounded-xl border text-slate-800 placeholder-slate-400
                         focus:outline-none focus:ring-2 transition-all duration-200 ${getInputStyles()}`}
            />
          </div>
        )}
        
        {/* Conditions Checkboxes */}
        {showConditions && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-slate-600 mb-2">
              Keadaan kesihatan anda (pilihan):
            </p>
            <div className="grid grid-cols-2 gap-2">
              {CONDITIONS.map((condition) => (
                <label
                  key={condition.id}
                  className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer
                             transition-all duration-200 ${
                    conditions.includes(condition.id)
                      ? 'bg-emerald-50 border-emerald-300'
                      : 'bg-white border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={conditions.includes(condition.id)}
                    onChange={() => handleConditionToggle(condition.id)}
                    className="sr-only"
                  />
                  <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                    conditions.includes(condition.id)
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-300'
                  }`}>
                    {conditions.includes(condition.id) && (
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm text-slate-700">{condition.labelBm}</span>
                </label>
              ))}
            </div>
          </div>
        )}
        
        {/* Ramadan Interest Checkbox */}
        {showRamadanCheckbox && (
          <label className="flex items-center gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 cursor-pointer">
            <input
              type="checkbox"
              checked={interestedInRamadan}
              onChange={(e) => setInterestedInRamadan(e.target.checked)}
              className="w-5 h-5 rounded border-amber-300 text-amber-500 focus:ring-amber-500"
            />
            <div>
              <span className="font-medium text-amber-800">🌙 Mod Ramadan</span>
              <p className="text-sm text-amber-700">Saya berminat dengan ciri-ciri puasa khas</p>
            </div>
          </label>
        )}
        
        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-4 px-6 rounded-xl text-white font-semibold
                     transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2
                     disabled:opacity-50 disabled:cursor-not-allowed
                     flex items-center justify-center gap-2 ${getButtonStyles()}`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Mendaftar...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Sertai Waitlist
            </>
          )}
        </button>
      </div>
    </form>
  );
}

export default WaitlistForm;

