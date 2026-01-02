'use client';

// app/cgm/waitlist/page.tsx
// 📊 CGM Waitlist Signup Page - Dedicated signup flow

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Activity, ChevronRight, ChevronLeft, 
  Mail, CheckCircle, Loader2, Gift, ArrowLeft
} from 'lucide-react';
import Link from 'next/link';
import { DeviceSelector } from '@/components/cgm/DeviceSelector';
import { FeatureChecklist } from '@/components/cgm/FeatureChecklist';
import {
  CGMDeviceType,
  UsageFrequency,
  PriceSensitivity,
  CGMFeatureCode,
  ReferralSource,
  WaitlistSignupFormData,
} from '@/lib/cgm/types';
import { USAGE_FREQUENCY_OPTIONS, REFERRAL_SOURCE_OPTIONS } from '@/lib/cgm/devices';

// ============================================
// PAGE CONTENT COMPONENT (uses useSearchParams)
// ============================================

const TOTAL_STEPS = 5;

function WaitlistPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const referralCode = searchParams.get('ref');
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [referrerName, setReferrerName] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<WaitlistSignupFormData>({
    email: '',
    name: '',
    currentDevice: null,
    otherDeviceName: '',
    usageFrequency: null,
    willingToPay: false,
    priceSensitivity: null,
    desiredFeatures: [],
    emailUpdates: true,
    whatsappUpdates: false,
    phoneNumber: '',
    referralSource: null,
    referredBy: referralCode || null,
  });

  // Validate referral code
  useEffect(() => {
    if (referralCode) {
      fetch(`/api/cgm/waitlist/validate-referral?code=${referralCode}`)
        .then(res => res.json())
        .then(data => {
          if (data.valid) {
            setReferrerName(data.referrerName || null);
          }
        })
        .catch(console.error);
    }
  }, [referralCode]);

  const updateFormData = <K extends keyof WaitlistSignupFormData>(
    key: K,
    value: WaitlistSignupFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setError(null);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
      case 2:
        return formData.currentDevice !== null;
      case 3:
        return formData.usageFrequency !== null;
      case 4:
        return formData.desiredFeatures.length > 0;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (step < TOTAL_STEPS) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await fetch('/api/cgm/waitlist/join', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          name: formData.name || undefined,
          currentDevice: formData.currentDevice,
          otherDeviceName: formData.otherDeviceName || undefined,
          usageFrequency: formData.usageFrequency,
          willingToPay: formData.willingToPay,
          priceSensitivity: formData.priceSensitivity,
          desiredFeatures: formData.desiredFeatures,
          emailUpdates: formData.emailUpdates,
          whatsappUpdates: formData.whatsappUpdates,
          phoneNumber: formData.phoneNumber || undefined,
          referralSource: formData.referralSource,
          referredBy: formData.referredBy,
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        router.push(`/cgm/waitlist/success?code=${data.entry.referral_code}&pos=${data.entry.queue_position}`);
      } else {
        setError(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Back link */}
        <Link
          href="/cgm"
          className="inline-flex items-center text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to CGM Info
        </Link>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-2xl">
            <Activity className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Join the CGM Waitlist
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            Step {step} of {TOTAL_STEPS}
          </p>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden max-w-md mx-auto">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Referral notice */}
        {referralCode && (
          <div className="mb-6 flex items-center p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl">
            <Gift className="h-5 w-5 text-green-600 dark:text-green-400 mr-3 flex-shrink-0" />
            <span className="text-sm text-green-700 dark:text-green-300">
              {referrerName ? (
                <>Referred by <strong>{referrerName}</strong>! You'll get priority access.</>
              ) : (
                <>You were referred! You'll get priority access.</>
              )}
            </span>
          </div>
        )}

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6 md:p-8">
          {/* Error */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Let's get started
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  We'll notify you when CGM integration launches
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>
          )}

          {/* Step 2: Device Selection */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  What CGM do you use?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  This helps us prioritize which integrations to build first
                </p>
              </div>

              <DeviceSelector
                selectedDevice={formData.currentDevice}
                onSelect={(device) => updateFormData('currentDevice', device)}
                otherDeviceName={formData.otherDeviceName}
                onOtherNameChange={(name) => updateFormData('otherDeviceName', name)}
              />
            </div>
          )}

          {/* Step 3: Usage Pattern */}
          {step === 3 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  How often do you use your CGM?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Understanding your usage helps us design better features
                </p>
              </div>

              <div className="space-y-3">
                {USAGE_FREQUENCY_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => updateFormData('usageFrequency', option.value as UsageFrequency)}
                    className={`
                      w-full flex items-center p-4 rounded-xl border-2 transition-all text-left
                      ${formData.usageFrequency === option.value
                        ? 'border-violet-500 bg-violet-50 dark:bg-violet-900/30'
                        : 'border-gray-200 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-700'
                      }
                    `}
                  >
                    <span className="text-2xl mr-4">{option.icon}</span>
                    <div>
                      <span className="font-medium text-gray-900 dark:text-white block">
                        {option.label}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {option.description}
                      </span>
                    </div>
                    {formData.usageFrequency === option.value && (
                      <CheckCircle className="h-5 w-5 text-violet-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Feature Preferences */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  What features interest you?
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  Select all that apply
                </p>
              </div>

              <FeatureChecklist
                selectedFeatures={formData.desiredFeatures}
                onChange={(features) => updateFormData('desiredFeatures', features)}
              />
            </div>
          )}

          {/* Step 5: Contact Preferences */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Almost done!
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  How would you like us to reach you?
                </p>
              </div>

              {/* Notification preferences */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 text-gray-400 mr-3" />
                    <span className="text-gray-900 dark:text-white">Email updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.emailUpdates}
                    onChange={(e) => updateFormData('emailUpdates', e.target.checked)}
                    className="w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                  />
                </label>

                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                    </svg>
                    <span className="text-gray-900 dark:text-white">WhatsApp updates</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={formData.whatsappUpdates}
                    onChange={(e) => updateFormData('whatsappUpdates', e.target.checked)}
                    className="w-5 h-5 text-violet-600 rounded border-gray-300 focus:ring-violet-500"
                  />
                </label>
              </div>

              {/* Phone number for WhatsApp */}
              {formData.whatsappUpdates && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* How did you hear about us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  How did you hear about CGM integration?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REFERRAL_SOURCE_OPTIONS.slice(0, 6).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateFormData('referralSource', option.value as ReferralSource)}
                      className={`
                        px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left
                        ${formData.referralSource === option.value
                          ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/30'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }
                      `}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            {step > 1 ? (
              <button
                onClick={handleBack}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Continue
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex items-center px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Joining...
                  </>
                ) : (
                  <>
                    <Activity className="h-4 w-4 mr-2" />
                    Join Waitlist
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================
// PAGE COMPONENT (wraps content in Suspense)
// ============================================

export default function WaitlistPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-b from-violet-50 to-white dark:from-gray-900 dark:to-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <WaitlistPageContent />
    </Suspense>
  );
}
