// lib/conditions/constants.ts
// 🏥 Comorbidity Constants - Reference data for conditions and nutrients

import { ConditionCode, NutrientCode, ConditionCategory, NutrientPriority } from './types';

// ============================================
// CONDITION CODES
// ============================================

export const CONDITION_CODES = {
  // Diabetes
  DIABETES_T1: 'diabetes_t1' as ConditionCode,
  DIABETES_T2: 'diabetes_t2' as ConditionCode,
  PREDIABETES: 'prediabetes' as ConditionCode,
  GESTATIONAL_DIABETES: 'gestational_diabetes' as ConditionCode,
  
  // Cardiovascular
  HYPERTENSION: 'hypertension' as ConditionCode,
  DYSLIPIDEMIA: 'dyslipidemia' as ConditionCode,
  HEART_DISEASE: 'heart_disease' as ConditionCode,
  STROKE_HISTORY: 'stroke_history' as ConditionCode,
  
  // Renal
  CKD_STAGE1: 'ckd_stage1' as ConditionCode,
  CKD_STAGE2: 'ckd_stage2' as ConditionCode,
  CKD_STAGE3A: 'ckd_stage3a' as ConditionCode,
  CKD_STAGE3B: 'ckd_stage3b' as ConditionCode,
  CKD_STAGE4: 'ckd_stage4' as ConditionCode,
  CKD_STAGE5: 'ckd_stage5' as ConditionCode,
  
  // Metabolic
  OBESITY: 'obesity' as ConditionCode,
  NAFLD: 'nafld' as ConditionCode,
  GOUT: 'gout' as ConditionCode,
} as const;

// Diabetes-related codes for quick checks
export const DIABETES_CONDITIONS: ConditionCode[] = [
  'diabetes_t1',
  'diabetes_t2',
  'prediabetes',
  'gestational_diabetes',
];

// CKD stages in order
export const CKD_STAGES: ConditionCode[] = [
  'ckd_stage1',
  'ckd_stage2',
  'ckd_stage3a',
  'ckd_stage3b',
  'ckd_stage4',
  'ckd_stage5',
];

// Common comorbidities to show during onboarding
export const COMMON_COMORBIDITIES: ConditionCode[] = [
  'hypertension',
  'dyslipidemia',
  'obesity',
  'ckd_stage3a',
  'gout',
  'nafld',
];

// ============================================
// NUTRIENT CODES
// ============================================

export const NUTRIENT_CODES = {
  CALORIES: 'calories' as NutrientCode,
  CARBS: 'carbs' as NutrientCode,
  PROTEIN: 'protein' as NutrientCode,
  FAT: 'fat' as NutrientCode,
  SODIUM: 'sodium' as NutrientCode,
  POTASSIUM: 'potassium' as NutrientCode,
  PHOSPHORUS: 'phosphorus' as NutrientCode,
  CHOLESTEROL: 'cholesterol' as NutrientCode,
  SATURATED_FAT: 'saturated_fat' as NutrientCode,
  TRANS_FAT: 'trans_fat' as NutrientCode,
  FIBER: 'fiber' as NutrientCode,
  SUGAR: 'sugar' as NutrientCode,
  PURINE: 'purine' as NutrientCode,
  FRUCTOSE: 'fructose' as NutrientCode,
  ALCOHOL: 'alcohol' as NutrientCode,
} as const;

// ============================================
// NUTRIENT METADATA
// ============================================

export interface NutrientInfo {
  code: NutrientCode;
  label: string;
  labelMs: string;
  unit: string;
  defaultMax?: number;
  description: string;
  descriptionMs: string;
  relevantConditions: ConditionCode[];
}

export const NUTRIENT_INFO: Record<NutrientCode, NutrientInfo> = {
  calories: {
    code: 'calories',
    label: 'Calories',
    labelMs: 'Kalori',
    unit: 'kcal',
    description: 'Total energy intake',
    descriptionMs: 'Jumlah pengambilan tenaga',
    relevantConditions: ['obesity', 'diabetes_t2'],
  },
  carbs: {
    code: 'carbs',
    label: 'Carbohydrates',
    labelMs: 'Karbohidrat',
    unit: 'g',
    defaultMax: 250,
    description: 'Total carbohydrate intake',
    descriptionMs: 'Jumlah pengambilan karbohidrat',
    relevantConditions: ['diabetes_t1', 'diabetes_t2', 'prediabetes', 'gestational_diabetes'],
  },
  protein: {
    code: 'protein',
    label: 'Protein',
    labelMs: 'Protein',
    unit: 'g',
    description: 'Total protein intake',
    descriptionMs: 'Jumlah pengambilan protein',
    relevantConditions: ['ckd_stage3a', 'ckd_stage3b', 'ckd_stage4', 'ckd_stage5'],
  },
  fat: {
    code: 'fat',
    label: 'Total Fat',
    labelMs: 'Jumlah Lemak',
    unit: 'g',
    description: 'Total fat intake',
    descriptionMs: 'Jumlah pengambilan lemak',
    relevantConditions: ['dyslipidemia', 'obesity'],
  },
  sodium: {
    code: 'sodium',
    label: 'Sodium',
    labelMs: 'Natrium',
    unit: 'mg',
    defaultMax: 2300,
    description: 'Salt/sodium intake',
    descriptionMs: 'Pengambilan garam/natrium',
    relevantConditions: ['hypertension', 'ckd_stage3a', 'ckd_stage3b', 'ckd_stage4', 'ckd_stage5', 'heart_disease'],
  },
  potassium: {
    code: 'potassium',
    label: 'Potassium',
    labelMs: 'Kalium',
    unit: 'mg',
    description: 'Potassium intake',
    descriptionMs: 'Pengambilan kalium',
    relevantConditions: ['ckd_stage3a', 'ckd_stage3b', 'ckd_stage4', 'ckd_stage5', 'hypertension'],
  },
  phosphorus: {
    code: 'phosphorus',
    label: 'Phosphorus',
    labelMs: 'Fosforus',
    unit: 'mg',
    description: 'Phosphorus intake',
    descriptionMs: 'Pengambilan fosforus',
    relevantConditions: ['ckd_stage3b', 'ckd_stage4', 'ckd_stage5'],
  },
  cholesterol: {
    code: 'cholesterol',
    label: 'Cholesterol',
    labelMs: 'Kolesterol',
    unit: 'mg',
    defaultMax: 300,
    description: 'Dietary cholesterol intake',
    descriptionMs: 'Pengambilan kolesterol dari makanan',
    relevantConditions: ['dyslipidemia', 'heart_disease'],
  },
  saturated_fat: {
    code: 'saturated_fat',
    label: 'Saturated Fat',
    labelMs: 'Lemak Tepu',
    unit: 'g',
    defaultMax: 20,
    description: 'Saturated fat intake',
    descriptionMs: 'Pengambilan lemak tepu',
    relevantConditions: ['dyslipidemia', 'heart_disease', 'nafld', 'hypertension'],
  },
  trans_fat: {
    code: 'trans_fat',
    label: 'Trans Fat',
    labelMs: 'Lemak Trans',
    unit: 'g',
    defaultMax: 0,
    description: 'Trans fat intake (should be zero)',
    descriptionMs: 'Pengambilan lemak trans (sepatutnya sifar)',
    relevantConditions: ['dyslipidemia', 'heart_disease'],
  },
  fiber: {
    code: 'fiber',
    label: 'Fiber',
    labelMs: 'Serat',
    unit: 'g',
    description: 'Dietary fiber intake',
    descriptionMs: 'Pengambilan serat',
    relevantConditions: ['diabetes_t2', 'dyslipidemia', 'obesity', 'prediabetes'],
  },
  sugar: {
    code: 'sugar',
    label: 'Sugar',
    labelMs: 'Gula',
    unit: 'g',
    defaultMax: 25,
    description: 'Added sugar intake',
    descriptionMs: 'Pengambilan gula tambahan',
    relevantConditions: ['diabetes_t1', 'diabetes_t2', 'prediabetes', 'gestational_diabetes', 'obesity', 'nafld'],
  },
  purine: {
    code: 'purine',
    label: 'Purine',
    labelMs: 'Purin',
    unit: 'mg',
    defaultMax: 400,
    description: 'Purine intake (affects uric acid)',
    descriptionMs: 'Pengambilan purin (mempengaruhi asid urik)',
    relevantConditions: ['gout'],
  },
  fructose: {
    code: 'fructose',
    label: 'Fructose',
    labelMs: 'Fruktosa',
    unit: 'g',
    description: 'Fructose intake',
    descriptionMs: 'Pengambilan fruktosa',
    relevantConditions: ['gout', 'nafld'],
  },
  alcohol: {
    code: 'alcohol',
    label: 'Alcohol',
    labelMs: 'Alkohol',
    unit: 'g',
    defaultMax: 0,
    description: 'Alcohol intake',
    descriptionMs: 'Pengambilan alkohol',
    relevantConditions: ['gout', 'diabetes_t2', 'nafld'],
  },
};

// ============================================
// CONDITION CATEGORY METADATA
// ============================================

export const CONDITION_CATEGORIES: Record<ConditionCategory, { label: string; labelMs: string; color: string }> = {
  metabolic: {
    label: 'Metabolic',
    labelMs: 'Metabolik',
    color: '#F97316',
  },
  cardiovascular: {
    label: 'Cardiovascular',
    labelMs: 'Kardiovaskular',
    color: '#8B5CF6',
  },
  renal: {
    label: 'Kidney',
    labelMs: 'Buah Pinggang',
    color: '#14B8A6',
  },
  other: {
    label: 'Other',
    labelMs: 'Lain-lain',
    color: '#6B7280',
  },
};

// ============================================
// WARNING THRESHOLDS
// ============================================

/**
 * Percentage of daily limit at which to show warning
 */
export const WARNING_THRESHOLDS = {
  // Single food item thresholds (% of daily max)
  SINGLE_FOOD_INFO: 0.15,     // 15% of daily limit - show info
  SINGLE_FOOD_WARNING: 0.25,  // 25% of daily limit - show warning
  SINGLE_FOOD_DANGER: 0.40,   // 40% of daily limit - show danger
  
  // Daily total thresholds
  DAILY_INFO: 0.70,           // 70% of daily limit - show info
  DAILY_WARNING: 0.85,        // 85% of daily limit - show warning
  DAILY_DANGER: 1.0,          // 100% of daily limit - show danger
} as const;

// ============================================
// PRIORITY ORDER
// ============================================

export const PRIORITY_ORDER: Record<NutrientPriority, number> = {
  critical: 1,
  important: 2,
  moderate: 3,
  minor: 4,
};

// ============================================
// CKD eGFR RANGES
// ============================================

export const CKD_EGFR_RANGES = {
  ckd_stage1: { min: 90, max: Infinity, label: '≥90' },
  ckd_stage2: { min: 60, max: 89, label: '60-89' },
  ckd_stage3a: { min: 45, max: 59, label: '45-59' },
  ckd_stage3b: { min: 30, max: 44, label: '30-44' },
  ckd_stage4: { min: 15, max: 29, label: '15-29' },
  ckd_stage5: { min: 0, max: 14, label: '<15' },
} as const;

/**
 * Get CKD stage from eGFR value
 */
export function getCKDStageFromEGFR(egfr: number): ConditionCode | null {
  if (egfr >= 90) return 'ckd_stage1';
  if (egfr >= 60) return 'ckd_stage2';
  if (egfr >= 45) return 'ckd_stage3a';
  if (egfr >= 30) return 'ckd_stage3b';
  if (egfr >= 15) return 'ckd_stage4';
  if (egfr >= 0) return 'ckd_stage5';
  return null;
}

// ============================================
// HIGH PURINE FOODS (for gout warnings)
// ============================================

export const HIGH_PURINE_FOODS = [
  'organ meats',      // hati, buah pinggang
  'liver',
  'kidney',
  'anchovies',        // ikan bilis
  'sardines',
  'mackerel',
  'shellfish',        // kerang, kupang
  'mussels',
  'scallops',
  'beer',
  'yeast',
  'meat extract',     // bovril
  'gravy',
];

// ============================================
// HIGH SODIUM FOODS (for hypertension warnings)
// ============================================

export const HIGH_SODIUM_INDICATORS = [
  'kicap',            // soy sauce
  'soy sauce',
  'belacan',          // shrimp paste
  'ikan masin',       // salted fish
  'salted',
  'preserved',
  'canned',
  'instant noodle',
  'mi segera',
  'processed',
  'ham',
  'bacon',
  'sausage',
  'fast food',
];


