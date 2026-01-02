// lib/cgm/types.ts
// 📊 CGM Waitlist - TypeScript Types

// ============================================
// DEVICE TYPES
// ============================================

export type CGMDeviceType =
  | 'freestyle_libre_1'
  | 'freestyle_libre_2'
  | 'freestyle_libre_3'
  | 'dexcom_g6'
  | 'dexcom_g7'
  | 'medtronic_guardian'
  | 'senseonics_eversense'
  | 'other'
  | 'none_planning_to_buy'
  | 'none_interested';

export type UsageFrequency =
  | 'daily_always'
  | 'daily_sometimes'
  | 'weekly'
  | 'monthly'
  | 'not_yet';

export type PriceSensitivity =
  | 'any_price'
  | 'under_30_myr'
  | 'under_50_myr'
  | 'free_only';

export type WaitlistStatus =
  | 'waiting'
  | 'beta_invited'
  | 'beta_active'
  | 'converted'
  | 'unsubscribed';

export type CGMProvider =
  | 'libreview'
  | 'dexcom_clarity'
  | 'medtronic_carelink'
  | 'senseonics'
  | 'nightscout'
  | 'tidepool';

export type ReferralSource =
  | 'in_app'
  | 'social'
  | 'doctor'
  | 'friend'
  | 'search'
  | 'advertisement'
  | 'other';

export type WaitlistEventType =
  | 'signed_up'
  | 'updated_preferences'
  | 'beta_invited'
  | 'beta_accepted'
  | 'clicked_email'
  | 'shared_referral'
  | 'referral_converted'
  | 'unsubscribed'
  | 'page_view'
  | 'step_completed';

// ============================================
// FEATURE CODES
// ============================================

export type CGMFeatureCode =
  | 'auto_sync'
  | 'meal_correlation'
  | 'predictive_alerts'
  | 'trend_analysis'
  | 'doctor_sharing'
  | 'ai_insights'
  | 'time_in_range'
  | 'export_reports';

// ============================================
// DATABASE TYPES
// ============================================

export interface CGMWaitlistEntry {
  id: string;
  user_id: string | null;
  tenant_id: string;
  email: string;
  name: string | null;
  current_device: CGMDeviceType | null;
  other_device_name: string | null;
  usage_frequency: UsageFrequency | null;
  willing_to_pay: boolean;
  price_sensitivity: PriceSensitivity | null;
  desired_features: CGMFeatureCode[];
  email_updates: boolean;
  whatsapp_updates: boolean;
  phone_number: string | null;
  referral_source: string | null;
  referral_code: string;
  referred_by: string | null;
  referral_count: number;
  queue_position: number;
  queue_boost: number;
  status: WaitlistStatus;
  beta_invited_at: string | null;
  beta_joined_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface CGMWaitlistEvent {
  id: string;
  waitlist_id: string;
  event_type: WaitlistEventType;
  metadata: Record<string, any>;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

export interface CGMConnection {
  id: string;
  user_id: string;
  tenant_id: string;
  provider: CGMProvider;
  provider_user_id: string | null;
  access_token_encrypted: string | null;
  refresh_token_encrypted: string | null;
  token_expires_at: string | null;
  last_sync_at: string | null;
  last_sync_status: 'success' | 'failed' | 'partial' | null;
  last_sync_error: string | null;
  readings_synced: number;
  status: 'pending' | 'connected' | 'disconnected' | 'expired' | 'error';
  auto_sync_enabled: boolean;
  sync_frequency_hours: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// DEVICE METADATA
// ============================================

export interface CGMDeviceInfo {
  id: CGMDeviceType;
  name: string;
  manufacturer: string;
  image: string;
  integrationMethod: CGMProvider | null;
  availableInMalaysia: boolean;
  approxPriceMYR: number | null;
  sensorLifeDays: number | null;
  description: string;
  features: string[];
}

export interface CGMFeatureInfo {
  code: CGMFeatureCode;
  label: string;
  description: string;
  icon: string;
  isPremium: boolean;
}

// ============================================
// FORM TYPES
// ============================================

export interface WaitlistSignupFormData {
  // Step 1: Contact
  email: string;
  name: string;
  
  // Step 2: Device
  currentDevice: CGMDeviceType | null;
  otherDeviceName: string;
  
  // Step 3: Usage
  usageFrequency: UsageFrequency | null;
  willingToPay: boolean;
  priceSensitivity: PriceSensitivity | null;
  
  // Step 4: Features
  desiredFeatures: CGMFeatureCode[];
  
  // Step 5: Contact Preferences
  emailUpdates: boolean;
  whatsappUpdates: boolean;
  phoneNumber: string;
  referralSource: ReferralSource | null;
  
  // Referral
  referredBy: string | null;
}

export interface WaitlistSignupRequest {
  email: string;
  name?: string;
  userId?: string;
  tenantId?: string;
  currentDevice?: CGMDeviceType;
  otherDeviceName?: string;
  usageFrequency?: UsageFrequency;
  willingToPay?: boolean;
  priceSensitivity?: PriceSensitivity;
  desiredFeatures?: CGMFeatureCode[];
  emailUpdates?: boolean;
  whatsappUpdates?: boolean;
  phoneNumber?: string;
  referralSource?: string;
  referredBy?: string;
}

export interface WaitlistUpdateRequest {
  currentDevice?: CGMDeviceType;
  otherDeviceName?: string;
  usageFrequency?: UsageFrequency;
  willingToPay?: boolean;
  priceSensitivity?: PriceSensitivity;
  desiredFeatures?: CGMFeatureCode[];
  emailUpdates?: boolean;
  whatsappUpdates?: boolean;
  phoneNumber?: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================

export interface WaitlistStatusResponse {
  entry: CGMWaitlistEntry;
  effectivePosition: number;
  totalWaiting: number;
  estimatedWaitWeeks: number;
  referralUrl: string;
}

export interface WaitlistStatsResponse {
  totalSignups: number;
  waitingCount: number;
  betaInvitedCount: number;
  betaActiveCount: number;
  convertedCount: number;
  deviceBreakdown: Record<CGMDeviceType, number>;
  featureBreakdown: Record<CGMFeatureCode, number>;
  signupsByDay: { date: string; count: number }[];
  topReferrers: { referralCode: string; count: number; name: string | null }[];
}

export interface CGMApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}


