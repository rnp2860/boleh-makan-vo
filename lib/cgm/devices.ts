// lib/cgm/devices.ts
// 📊 CGM Device Metadata - Information about supported CGM devices

import { CGMDeviceInfo, CGMDeviceType, CGMFeatureInfo, CGMFeatureCode } from './types';

// ============================================
// CGM DEVICES
// ============================================

export const CGM_DEVICES: Record<CGMDeviceType, CGMDeviceInfo> = {
  freestyle_libre_1: {
    id: 'freestyle_libre_1',
    name: 'FreeStyle Libre',
    manufacturer: 'Abbott',
    image: '/images/cgm/freestyle-libre-1.png',
    integrationMethod: 'libreview',
    availableInMalaysia: true,
    approxPriceMYR: 250,
    sensorLifeDays: 14,
    description: 'The original flash glucose monitoring system. Scan to see your glucose level.',
    features: ['14-day wear', 'Water resistant', 'No calibration needed'],
  },
  freestyle_libre_2: {
    id: 'freestyle_libre_2',
    name: 'FreeStyle Libre 2',
    manufacturer: 'Abbott',
    image: '/images/cgm/freestyle-libre-2.png',
    integrationMethod: 'libreview',
    availableInMalaysia: true,
    approxPriceMYR: 280,
    sensorLifeDays: 14,
    description: 'Enhanced with optional alarms for high and low glucose levels.',
    features: ['14-day wear', 'Optional alarms', 'Real-time alerts', 'Water resistant'],
  },
  freestyle_libre_3: {
    id: 'freestyle_libre_3',
    name: 'FreeStyle Libre 3',
    manufacturer: 'Abbott',
    image: '/images/cgm/freestyle-libre-3.png',
    integrationMethod: 'libreview',
    availableInMalaysia: true,
    approxPriceMYR: 320,
    sensorLifeDays: 14,
    description: 'The smallest, thinnest sensor with real-time glucose readings every minute.',
    features: ['14-day wear', 'Real-time readings', 'Smallest sensor', 'Continuous alerts'],
  },
  dexcom_g6: {
    id: 'dexcom_g6',
    name: 'Dexcom G6',
    manufacturer: 'Dexcom',
    image: '/images/cgm/dexcom-g6.png',
    integrationMethod: 'dexcom_clarity',
    availableInMalaysia: false,
    approxPriceMYR: 400,
    sensorLifeDays: 10,
    description: 'Real-time CGM with predictive alerts and no fingersticks required.',
    features: ['10-day wear', 'Predictive alerts', 'Share with 5 followers', 'Insulin pump compatible'],
  },
  dexcom_g7: {
    id: 'dexcom_g7',
    name: 'Dexcom G7',
    manufacturer: 'Dexcom',
    image: '/images/cgm/dexcom-g7.png',
    integrationMethod: 'dexcom_clarity',
    availableInMalaysia: false,
    approxPriceMYR: 450,
    sensorLifeDays: 10,
    description: 'The most accurate CGM with 60% smaller profile and all-in-one sensor.',
    features: ['10-day wear', '30-min warmup', 'All-in-one design', 'Best accuracy'],
  },
  medtronic_guardian: {
    id: 'medtronic_guardian',
    name: 'Medtronic Guardian',
    manufacturer: 'Medtronic',
    image: '/images/cgm/medtronic-guardian.png',
    integrationMethod: 'medtronic_carelink',
    availableInMalaysia: false,
    approxPriceMYR: 380,
    sensorLifeDays: 7,
    description: 'CGM designed to work with Medtronic insulin pumps.',
    features: ['7-day wear', 'Pump integration', 'Predictive alerts', 'Auto-suspend'],
  },
  senseonics_eversense: {
    id: 'senseonics_eversense',
    name: 'Senseonics Eversense',
    manufacturer: 'Senseonics',
    image: '/images/cgm/senseonics-eversense.png',
    integrationMethod: 'senseonics',
    availableInMalaysia: false,
    approxPriceMYR: null,
    sensorLifeDays: 180,
    description: 'Implantable CGM sensor lasting up to 180 days.',
    features: ['180-day wear', 'Implantable', 'Removable transmitter', 'Vibration alerts'],
  },
  other: {
    id: 'other',
    name: 'Other Device',
    manufacturer: 'Various',
    image: '/images/cgm/other-device.png',
    integrationMethod: null,
    availableInMalaysia: true,
    approxPriceMYR: null,
    sensorLifeDays: null,
    description: 'Using a different CGM device not listed above.',
    features: [],
  },
  none_planning_to_buy: {
    id: 'none_planning_to_buy',
    name: "Planning to Buy",
    manufacturer: '',
    image: '/images/cgm/planning-to-buy.png',
    integrationMethod: null,
    availableInMalaysia: true,
    approxPriceMYR: null,
    sensorLifeDays: null,
    description: "I don't have a CGM yet but I'm planning to get one.",
    features: [],
  },
  none_interested: {
    id: 'none_interested',
    name: 'Just Interested',
    manufacturer: '',
    image: '/images/cgm/interested.png',
    integrationMethod: null,
    availableInMalaysia: true,
    approxPriceMYR: null,
    sensorLifeDays: null,
    description: "I don't have a CGM but I'm interested in learning more.",
    features: [],
  },
};

// Device categories for display
export const CGM_DEVICE_CATEGORIES = {
  owned: ['freestyle_libre_1', 'freestyle_libre_2', 'freestyle_libre_3', 'dexcom_g6', 'dexcom_g7', 'medtronic_guardian', 'senseonics_eversense', 'other'] as CGMDeviceType[],
  none: ['none_planning_to_buy', 'none_interested'] as CGMDeviceType[],
};

// Popular devices in Malaysia
export const POPULAR_DEVICES_MY: CGMDeviceType[] = [
  'freestyle_libre_2',
  'freestyle_libre_3',
  'freestyle_libre_1',
];

// ============================================
// CGM FEATURES
// ============================================

export const CGM_FEATURES: CGMFeatureInfo[] = [
  {
    code: 'auto_sync',
    label: 'Automatic Glucose Sync',
    description: 'Your CGM readings sync automatically - no manual logging needed',
    icon: 'RefreshCw',
    isPremium: false,
  },
  {
    code: 'meal_correlation',
    label: 'Meal-Glucose Correlation',
    description: 'See exactly how different foods affect your blood sugar',
    icon: 'TrendingUp',
    isPremium: false,
  },
  {
    code: 'predictive_alerts',
    label: 'Predictive Alerts',
    description: 'Get warned before highs or lows based on trends',
    icon: 'Bell',
    isPremium: true,
  },
  {
    code: 'trend_analysis',
    label: 'Trend Analysis',
    description: 'Daily, weekly, and monthly glucose pattern insights',
    icon: 'BarChart3',
    isPremium: false,
  },
  {
    code: 'doctor_sharing',
    label: 'Share with Doctor',
    description: 'Generate detailed reports for your healthcare provider',
    icon: 'Share2',
    isPremium: false,
  },
  {
    code: 'ai_insights',
    label: 'AI-Powered Insights',
    description: 'Dr. Reza analyzes your CGM data for personalized advice',
    icon: 'Sparkles',
    isPremium: true,
  },
  {
    code: 'time_in_range',
    label: 'Time in Range Tracking',
    description: 'Track your TIR percentage and improve over time',
    icon: 'Target',
    isPremium: false,
  },
  {
    code: 'export_reports',
    label: 'Export Reports',
    description: 'Download PDF reports for personal records or insurance',
    icon: 'Download',
    isPremium: false,
  },
];

// Feature lookup map
export const CGM_FEATURE_MAP: Record<string, CGMFeatureInfo> = CGM_FEATURES.reduce(
  (acc, feature) => ({ ...acc, [feature.code]: feature }),
  {}
);

// ============================================
// USAGE FREQUENCY OPTIONS
// ============================================

export const USAGE_FREQUENCY_OPTIONS = [
  {
    value: 'daily_always',
    label: 'Continuous Wear',
    description: 'I wear my CGM all the time',
    icon: '🔄',
  },
  {
    value: 'daily_sometimes',
    label: 'Daily, Sometimes',
    description: 'I wear it during certain periods (e.g., after meals)',
    icon: '📊',
  },
  {
    value: 'weekly',
    label: 'Weekly Check',
    description: 'I use it for spot checks during the week',
    icon: '📅',
  },
  {
    value: 'monthly',
    label: 'Monthly',
    description: 'I use it occasionally to check patterns',
    icon: '📈',
  },
  {
    value: 'not_yet',
    label: 'Not Started Yet',
    description: "I'm planning to start using a CGM",
    icon: '🆕',
  },
];

// ============================================
// PRICE SENSITIVITY OPTIONS
// ============================================

export const PRICE_SENSITIVITY_OPTIONS = [
  {
    value: 'any_price',
    label: 'Value-focused',
    description: "I'll pay for features that help me manage my diabetes better",
  },
  {
    value: 'under_50_myr',
    label: 'Under RM50/month',
    description: 'Willing to pay up to RM50 per month',
  },
  {
    value: 'under_30_myr',
    label: 'Under RM30/month',
    description: 'Willing to pay up to RM30 per month',
  },
  {
    value: 'free_only',
    label: 'Free features only',
    description: 'I prefer to use free features',
  },
];

// ============================================
// REFERRAL SOURCES
// ============================================

export const REFERRAL_SOURCE_OPTIONS = [
  { value: 'in_app', label: 'In the Boleh Makan app' },
  { value: 'social', label: 'Social media (Facebook, Instagram, TikTok)' },
  { value: 'doctor', label: 'My doctor or healthcare provider' },
  { value: 'friend', label: 'Friend or family member' },
  { value: 'search', label: 'Google search' },
  { value: 'advertisement', label: 'Advertisement' },
  { value: 'other', label: 'Other' },
];

// ============================================
// HELPERS
// ============================================

/**
 * Get device info by ID
 */
export function getDeviceInfo(deviceId: CGMDeviceType): CGMDeviceInfo {
  return CGM_DEVICES[deviceId];
}

/**
 * Get all devices available in Malaysia
 */
export function getDevicesAvailableInMalaysia(): CGMDeviceInfo[] {
  return Object.values(CGM_DEVICES).filter(d => d.availableInMalaysia);
}

/**
 * Get feature info by code
 */
export function getFeatureInfo(code: string): CGMFeatureInfo | undefined {
  return CGM_FEATURE_MAP[code];
}

/**
 * Get all premium features
 */
export function getPremiumFeatures(): CGMFeatureInfo[] {
  return CGM_FEATURES.filter(f => f.isPremium);
}

/**
 * Get all free features
 */
export function getFreeFeatures(): CGMFeatureInfo[] {
  return CGM_FEATURES.filter(f => !f.isPremium);
}


