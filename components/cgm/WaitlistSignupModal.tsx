'use client';

// components/cgm/WaitlistSignupModal.tsx
// 📊 Waitlist Signup Modal - Multi-step signup flow

import React, { useState, useCallback } from 'react';
import { 
  X, ChevronRight, ChevronLeft, Activity, 
  Mail, User, Bell, CheckCircle, Loader2,
  Sparkles, Gift, Share2
} from 'lucide-react';
import { DeviceSelector } from './DeviceSelector';
import { FeatureChecklist } from './FeatureChecklist';
import {
  CGMDeviceType,
  UsageFrequency,
  PriceSensitivity,
  CGMFeatureCode,
  ReferralSource,
  WaitlistSignupFormData,
} from '@/lib/cgm/types';
import { USAGE_FREQUENCY_OPTIONS, PRICE_SENSITIVITY_OPTIONS, REFERRAL_SOURCE_OPTIONS } from '@/lib/cgm/devices';

// ============================================
// TYPES
// ============================================

interface WaitlistSignupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: { referralCode: string; position: number }) => void;
  referralCode?: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

const TOTAL_STEPS = 5;

// ============================================
// COMPONENT
// ============================================

export function WaitlistSignupModal({
  isOpen,
  onClose,
  onSuccess,
  referralCode: initialReferralCode,
  userId,
  userEmail,
  userName,
}: WaitlistSignupModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<WaitlistSignupFormData>({
    email: userEmail || '',
    name: userName || '',
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
    referredBy: initialReferralCode || null,
  });

  const updateFormData = useCallback(<K extends keyof WaitlistSignupFormData>(
    key: K,
    value: WaitlistSignupFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    setError(null);
  }, []);

  const canProceed = useCallback(() => {
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
  }, [step, formData]);

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
          userId,
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
        onSuccess({
          referralCode: data.entry.referral_code,
          position: data.entry.queue_position,
        });
      } else {
        setError(data.error || 'Failed to join waitlist. Please try again.');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-hidden bg-white dark:bg-gray-900 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="relative px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-gradient-to-br from-violet-500 to-fuchsia-500 rounded-xl">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">
                Join CGM Waitlist
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Step {step} of {TOTAL_STEPS}
              </p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-100 dark:bg-gray-800">
            <div 
              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 transition-all duration-300"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-[60vh] overflow-y-auto">
          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {/* Step 1: Contact Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
                  <Mail className="h-8 w-8 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Let's get started
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  We'll notify you when CGM integration launches
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => updateFormData('email', e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  disabled={!!userEmail}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name (optional)
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData('name', e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>

              {formData.referredBy && (
                <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <Gift className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="text-sm text-green-700 dark:text-green-300">
                    Referred by a friend! You'll get priority access.
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Device Selection */}
          {step === 2 && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  What CGM do you use?
                </h3>
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
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  How often do you use your CGM?
                </h3>
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
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Feature Preferences */}
          {step === 4 && (
            <div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  What features interest you?
                </h3>
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

          {/* Step 5: Contact Preferences & Submit */}
          {step === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                  <Bell className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Almost done!
                </h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                  How would you like us to reach you?
                </p>
              </div>

              {/* Notification preferences */}
              <div className="space-y-3">
                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
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

                <label className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800">
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
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => updateFormData('phoneNumber', e.target.value)}
                    placeholder="+60 12-345 6789"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />
                </div>
              )}

              {/* How did you hear about us */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  How did you hear about CGM integration?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {REFERRAL_SOURCE_OPTIONS.slice(0, 6).map((option) => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => updateFormData('referralSource', option.value as ReferralSource)}
                      className={`
                        px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${formData.referralSource === option.value
                          ? 'bg-violet-100 dark:bg-violet-900/50 text-violet-700 dark:text-violet-300 ring-2 ring-violet-500/30'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
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
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
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
              className="flex items-center px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Continue
              <ChevronRight className="h-4 w-4 ml-1" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl font-semibold hover:from-violet-700 hover:to-fuchsia-700 disabled:opacity-50 transition-all"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Joining...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Join Waitlist
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}


