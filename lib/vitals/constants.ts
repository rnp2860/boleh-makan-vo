// lib/vitals/constants.ts
// 💓 Health Vitals Constants - Reference ranges and defaults

import { VitalTargets, GlucoseTiming, VitalType } from './types';

// ============================================
// DEFAULT TARGETS
// ============================================

export const DEFAULT_VITAL_TARGETS: Omit<VitalTargets, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
  // BP (AHA Guidelines)
  targetSystolicMax: 130,
  targetDiastolicMax: 80,
  
  // Glucose (ADA Guidelines, mmol/L)
  targetFastingGlucoseMin: 4.0,
  targetFastingGlucoseMax: 7.0,
  targetPostmealGlucoseMax: 10.0,
  targetHba1cMax: 7.0,
  
  // Lipids (Malaysian CPG, mmol/L)
  targetTotalCholesterolMax: 5.2,
  targetLdlMax: 2.6,
  targetHdlMin: 1.0,
  targetTriglyceridesMax: 1.7,
  
  // Weight
  targetWeightKg: undefined,
  targetBmiMax: 25.0,
  
  // Kidney
  targetEgfrMin: 60,
  targetUricAcidMax: 420, // umol/L (men default)
  
  setBy: 'system',
};

// ============================================
// VITAL TYPE METADATA
// ============================================

export interface VitalTypeInfo {
  type: VitalType;
  label: string;
  labelMs: string;
  icon: string;
  color: string;
  description: string;
  descriptionMs: string;
}

export const VITAL_TYPES: Record<VitalType, VitalTypeInfo> = {
  bp: {
    type: 'bp',
    label: 'Blood Pressure',
    labelMs: 'Tekanan Darah',
    icon: 'heart-pulse',
    color: '#EF4444',
    description: 'Track your blood pressure readings',
    descriptionMs: 'Jejaki bacaan tekanan darah anda',
  },
  weight: {
    type: 'weight',
    label: 'Weight',
    labelMs: 'Berat Badan',
    icon: 'scale',
    color: '#8B5CF6',
    description: 'Monitor your weight and body composition',
    descriptionMs: 'Pantau berat badan dan komposisi badan',
  },
  glucose: {
    type: 'glucose',
    label: 'Blood Glucose',
    labelMs: 'Glukosa Darah',
    icon: 'droplet',
    color: '#F59E0B',
    description: 'Log your blood sugar levels',
    descriptionMs: 'Catat paras gula darah anda',
  },
  labs: {
    type: 'labs',
    label: 'Lab Results',
    labelMs: 'Keputusan Makmal',
    icon: 'test-tube',
    color: '#3B82F6',
    description: 'Record your clinical lab results',
    descriptionMs: 'Rekod keputusan makmal klinikal',
  },
};

// ============================================
// GLUCOSE TIMING OPTIONS
// ============================================

export interface GlucoseTimingOption {
  value: GlucoseTiming;
  label: string;
  labelMs: string;
  description: string;
  descriptionMs: string;
}

export const GLUCOSE_TIMING_OPTIONS: GlucoseTimingOption[] = [
  {
    value: 'fasting',
    label: 'Fasting',
    labelMs: 'Puasa',
    description: 'First thing in morning, 8+ hours no food',
    descriptionMs: 'Pagi-pagi, 8+ jam tiada makanan',
  },
  {
    value: 'before_meal',
    label: 'Before Meal',
    labelMs: 'Sebelum Makan',
    description: 'Taken before eating',
    descriptionMs: 'Diambil sebelum makan',
  },
  {
    value: 'after_meal',
    label: 'After Meal',
    labelMs: 'Selepas Makan',
    description: '1-2 hours after eating',
    descriptionMs: '1-2 jam selepas makan',
  },
  {
    value: 'bedtime',
    label: 'Bedtime',
    labelMs: 'Waktu Tidur',
    description: 'Before going to sleep',
    descriptionMs: 'Sebelum tidur',
  },
  {
    value: 'random',
    label: 'Random',
    labelMs: 'Rawak',
    description: 'Any time of day',
    descriptionMs: 'Bila-bila masa',
  },
];

// ============================================
// BP CLASSIFICATION (AHA 2017)
// ============================================

export const BP_CLASSIFICATIONS = {
  normal: { systolic: [0, 120], diastolic: [0, 80], label: 'Normal', labelMs: 'Normal' },
  elevated: { systolic: [120, 130], diastolic: [0, 80], label: 'Elevated', labelMs: 'Meningkat' },
  stage1: { systolic: [130, 140], diastolic: [80, 90], label: 'Stage 1 Hypertension', labelMs: 'Hipertensi Tahap 1' },
  stage2: { systolic: [140, 180], diastolic: [90, 120], label: 'Stage 2 Hypertension', labelMs: 'Hipertensi Tahap 2' },
  crisis: { systolic: [180, 999], diastolic: [120, 999], label: 'Hypertensive Crisis', labelMs: 'Krisis Hipertensi' },
};

// ============================================
// BMI CLASSIFICATION (WHO Asian)
// ============================================

export const BMI_CLASSIFICATIONS = {
  underweight: { range: [0, 18.5], label: 'Underweight', labelMs: 'Kurang Berat' },
  normal: { range: [18.5, 23], label: 'Normal', labelMs: 'Normal' },
  overweight: { range: [23, 25], label: 'Overweight', labelMs: 'Lebihan Berat' },
  obese1: { range: [25, 30], label: 'Obese Class I', labelMs: 'Obes Kelas I' },
  obese2: { range: [30, 999], label: 'Obese Class II', labelMs: 'Obes Kelas II' },
};

// ============================================
// GLUCOSE REFERENCE RANGES (mmol/L)
// ============================================

export const GLUCOSE_RANGES = {
  fasting: {
    low: [0, 4.0],
    normal: [4.0, 5.6],
    prediabetes: [5.6, 7.0],
    diabetes: [7.0, 999],
  },
  postmeal: {
    low: [0, 4.0],
    normal: [4.0, 7.8],
    prediabetes: [7.8, 11.1],
    diabetes: [11.1, 999],
  },
  random: {
    low: [0, 4.0],
    normal: [4.0, 7.8],
    high: [7.8, 11.1],
    veryHigh: [11.1, 999],
  },
};

// ============================================
// HBA1C CLASSIFICATION
// ============================================

export const HBA1C_CLASSIFICATIONS = {
  normal: { range: [0, 5.7], label: 'Normal', labelMs: 'Normal' },
  prediabetes: { range: [5.7, 6.5], label: 'Prediabetes', labelMs: 'Pradiabetes' },
  diabetes: { range: [6.5, 8.0], label: 'Diabetes (suboptimal)', labelMs: 'Diabetes (kurang optimum)' },
  poorControl: { range: [8.0, 999], label: 'Poor Control', labelMs: 'Kawalan Lemah' },
};

// ============================================
// LIPID REFERENCE RANGES (mmol/L)
// ============================================

export const LIPID_RANGES = {
  totalCholesterol: {
    optimal: [0, 5.2],
    borderline: [5.2, 6.2],
    high: [6.2, 999],
  },
  ldl: {
    optimal: [0, 2.6],
    nearOptimal: [2.6, 3.4],
    borderline: [3.4, 4.1],
    high: [4.1, 4.9],
    veryHigh: [4.9, 999],
  },
  hdl: {
    low: [0, 1.0],
    normal: [1.0, 1.5],
    optimal: [1.5, 999],
  },
  triglycerides: {
    normal: [0, 1.7],
    borderline: [1.7, 2.3],
    high: [2.3, 5.6],
    veryHigh: [5.6, 999],
  },
};

// ============================================
// EGFR CLASSIFICATION (CKD Stages)
// ============================================

export const EGFR_CLASSIFICATIONS = {
  normal: { range: [90, 999], label: 'Normal', labelMs: 'Normal', stage: 'G1' },
  mildDecrease: { range: [60, 90], label: 'Mildly Decreased', labelMs: 'Menurun Ringan', stage: 'G2' },
  moderateDecrease: { range: [45, 60], label: 'Moderately Decreased', labelMs: 'Menurun Sederhana', stage: 'G3a' },
  severeDecrease: { range: [30, 45], label: 'Moderately to Severely Decreased', labelMs: 'Menurun Sederhana-Teruk', stage: 'G3b' },
  kidneyFailure: { range: [15, 30], label: 'Severely Decreased', labelMs: 'Menurun Teruk', stage: 'G4' },
  endStage: { range: [0, 15], label: 'Kidney Failure', labelMs: 'Kegagalan Buah Pinggang', stage: 'G5' },
};

// ============================================
// URIC ACID REFERENCE (umol/L)
// ============================================

export const URIC_ACID_RANGES = {
  male: {
    normal: [0, 420],
    high: [420, 999],
  },
  female: {
    normal: [0, 360],
    high: [360, 999],
  },
};

// ============================================
// REMINDER THRESHOLDS (days)
// ============================================

export const REMINDER_THRESHOLDS = {
  bp: {
    normalReminder: 7,      // Remind if no BP log in 7 days
    hypertensiveReminder: 3, // More frequent for hypertensive users
  },
  weight: {
    reminder: 7,            // Weekly weight check
  },
  glucose: {
    diabeticReminder: 1,    // Daily for diabetics
    prediabeticReminder: 7, // Weekly for prediabetics
  },
  labs: {
    hba1cReminder: 90,      // Every 3 months
    lipidsReminder: 180,    // Every 6 months
  },
};

// ============================================
// UNIT CONVERSIONS
// ============================================

// Glucose: mg/dL to mmol/L
export const GLUCOSE_MGDL_TO_MMOL = 0.0555;
export const GLUCOSE_MMOL_TO_MGDL = 18.02;

// Convert mg/dL to mmol/L
export function convertGlucoseToMmol(mgdl: number): number {
  return Math.round(mgdl * GLUCOSE_MGDL_TO_MMOL * 10) / 10;
}

// Convert mmol/L to mg/dL
export function convertGlucoseToMgdl(mmol: number): number {
  return Math.round(mmol * GLUCOSE_MMOL_TO_MGDL);
}

// Weight: lbs to kg
export const LBS_TO_KG = 0.453592;
export const KG_TO_LBS = 2.20462;

export function convertWeightToKg(lbs: number): number {
  return Math.round(lbs * LBS_TO_KG * 10) / 10;
}

export function convertWeightToLbs(kg: number): number {
  return Math.round(kg * KG_TO_LBS * 10) / 10;
}


