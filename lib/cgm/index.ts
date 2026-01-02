// lib/cgm/index.ts
// 📊 CGM Module - Barrel Export

// Types
export type {
  CGMDeviceType,
  UsageFrequency,
  PriceSensitivity,
  WaitlistStatus,
  CGMProvider,
  ReferralSource,
  WaitlistEventType,
  CGMFeatureCode,
  CGMDeviceInfo,
  CGMFeatureInfo,
  CGMWaitlistEntry,
  CGMWaitlistEvent,
  CGMConnection,
  WaitlistSignupFormData,
  WaitlistSignupRequest,
  WaitlistUpdateRequest,
  WaitlistStatusResponse,
  WaitlistStatsResponse,
  CGMApiResponse,
} from './types';

// Device metadata
export {
  CGM_DEVICES,
  CGM_DEVICE_CATEGORIES,
  POPULAR_DEVICES_MY,
  CGM_FEATURES,
  CGM_FEATURE_MAP,
  USAGE_FREQUENCY_OPTIONS,
  PRICE_SENSITIVITY_OPTIONS,
  REFERRAL_SOURCE_OPTIONS,
  getDeviceInfo,
  getDevicesAvailableInMalaysia,
  getFeatureInfo,
  getPremiumFeatures,
  getFreeFeatures,
} from './devices';

// Waitlist operations
export {
  joinWaitlist,
  updateWaitlistPreferences,
  getWaitlistByEmail,
  getWaitlistByUserId,
  getWaitlistByReferralCode,
  getWaitlistStatus,
  unsubscribeFromWaitlist,
  getWaitlistCount,
  validateReferralCode,
  getWaitlistStats,
  inviteToBeta,
  exportWaitlistCSV,
  logWaitlistEvent,
} from './waitlist';


