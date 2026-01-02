// lib/conditions/types.ts
// 🏥 Comorbidity Types - TypeScript definitions for health conditions

// ============================================
// ENUMS & LITERAL TYPES
// ============================================

export type ConditionCategory = 'metabolic' | 'cardiovascular' | 'renal' | 'other';

export type ConditionSeverity = 'mild' | 'moderate' | 'severe' | 'controlled' | 'uncontrolled';

export type NutrientPriority = 'critical' | 'important' | 'moderate' | 'minor';

export type TargetSource = 'system_default' | 'doctor' | 'dietitian' | 'self';

export type WarningLevel = 'info' | 'warning' | 'danger';

// ============================================
// CONDITION CODES
// ============================================

export type ConditionCode =
  | 'diabetes_t1'
  | 'diabetes_t2'
  | 'prediabetes'
  | 'gestational_diabetes'
  | 'hypertension'
  | 'dyslipidemia'
  | 'ckd_stage1'
  | 'ckd_stage2'
  | 'ckd_stage3a'
  | 'ckd_stage3b'
  | 'ckd_stage4'
  | 'ckd_stage5'
  | 'obesity'
  | 'nafld'
  | 'gout'
  | 'heart_disease'
  | 'stroke_history';

// Diabetes-related conditions
export type DiabetesCondition = 'diabetes_t1' | 'diabetes_t2' | 'prediabetes' | 'gestational_diabetes';

// CKD stages
export type CKDStage = 'ckd_stage1' | 'ckd_stage2' | 'ckd_stage3a' | 'ckd_stage3b' | 'ckd_stage4' | 'ckd_stage5';

// ============================================
// NUTRIENT CODES
// ============================================

export type NutrientCode =
  | 'calories'
  | 'carbs'
  | 'protein'
  | 'fat'
  | 'sodium'
  | 'potassium'
  | 'phosphorus'
  | 'cholesterol'
  | 'saturated_fat'
  | 'trans_fat'
  | 'fiber'
  | 'sugar'
  | 'purine'
  | 'fructose'
  | 'alcohol';

// ============================================
// DATABASE TYPES
// ============================================

/**
 * System reference for supported health conditions
 */
export interface ConditionType {
  id: string;
  code: ConditionCode;
  name: string;
  nameMs: string;
  category: ConditionCategory;
  description?: string;
  descriptionMs?: string;
  icon: string;
  color: string;
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
}

/**
 * User's health condition (many-to-many relationship)
 */
export interface UserCondition {
  id: string;
  userId: string;
  tenantId?: string;
  conditionCode: ConditionCode;
  diagnosedDate?: string;
  severity?: ConditionSeverity;
  onMedication: boolean;
  medicationNames?: string[];
  medicationNotes?: string;
  managingDoctor?: string;
  hospitalClinic?: string;
  isPrimary: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  // Joined data
  condition?: ConditionType;
}

/**
 * Default nutrient target for a condition (from clinical guidelines)
 */
export interface ConditionNutrientTarget {
  id: string;
  conditionCode: ConditionCode;
  nutrientCode: NutrientCode;
  minValue?: number;
  maxValue?: number;
  unit: string;
  isPerKgBodyWeight: boolean;
  priority: NutrientPriority;
  guidance?: string;
  guidanceMs?: string;
  sourceReference?: string;
  createdAt: string;
}

/**
 * User-specific nutrient target override
 */
export interface UserNutrientTarget {
  id: string;
  userId: string;
  tenantId?: string;
  nutrientCode: NutrientCode;
  minValue?: number;
  maxValue?: number;
  unit: string;
  isPerKgBodyWeight: boolean;
  source: TargetSource;
  sourceName?: string;
  sourceDate?: string;
  sourceNotes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Combined nutrient target (from function get_user_nutrient_targets)
 */
export interface NutrientTarget {
  nutrientCode: NutrientCode;
  minValue?: number;
  maxValue?: number;
  unit: string;
  isPerKgBodyWeight: boolean;
  priority: NutrientPriority;
  source: string;
  guidance?: string;
  guidanceMs?: string;
}

/**
 * Daily aggregated nutrient summary
 */
export interface DailyNutrientSummary {
  id: string;
  userId: string;
  tenantId?: string;
  date: string;
  calories: number;
  carbsG: number;
  proteinG: number;
  fatG: number;
  sodiumMg: number;
  potassiumMg: number;
  phosphorusMg: number;
  cholesterolMg: number;
  saturatedFatG: number;
  transFatG: number;
  fiberG: number;
  sugarG: number;
  purineMg: number;
  fructoseG: number;
  alcoholG: number;
  mealsLogged: number;
  snacksLogged: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// WARNING & FEEDBACK TYPES
// ============================================

/**
 * Warning when nutrient exceeds limits
 */
export interface NutrientWarning {
  nutrient: NutrientCode;
  nutrientLabel: string;
  level: WarningLevel;
  message: string;
  messageMs?: string;
  currentValue: number;
  limitValue: number;
  unit: string;
  percentOfLimit: number;
  relatedConditions: ConditionCode[];
}

/**
 * Food nutrient check result
 */
export interface FoodNutrientCheck {
  foodId: string;
  foodName: string;
  warnings: NutrientWarning[];
  hasWarnings: boolean;
  hasCriticalWarnings: boolean;
}

// ============================================
// INPUT TYPES (for forms/mutations)
// ============================================

export interface AddUserConditionInput {
  conditionCode: ConditionCode;
  diagnosedDate?: string;
  severity?: ConditionSeverity;
  onMedication?: boolean;
  medicationNames?: string[];
  medicationNotes?: string;
  managingDoctor?: string;
  hospitalClinic?: string;
  isPrimary?: boolean;
}

export interface UpdateUserConditionInput {
  diagnosedDate?: string;
  severity?: ConditionSeverity;
  onMedication?: boolean;
  medicationNames?: string[];
  medicationNotes?: string;
  managingDoctor?: string;
  hospitalClinic?: string;
  isPrimary?: boolean;
  isActive?: boolean;
}

export interface SetUserNutrientTargetInput {
  nutrientCode: NutrientCode;
  minValue?: number;
  maxValue?: number;
  unit: string;
  isPerKgBodyWeight?: boolean;
  source: TargetSource;
  sourceName?: string;
  sourceDate?: string;
  sourceNotes?: string;
}

// ============================================
// AI CONTEXT TYPES
// ============================================

/**
 * Health context for Dr. Reza AI
 */
export interface AIHealthContext {
  primaryCondition: ConditionCode;
  primaryConditionName: string;
  allConditions: Array<{
    code: ConditionCode;
    name: string;
    severity?: ConditionSeverity;
  }>;
  criticalNutrients: Array<{
    nutrient: NutrientCode;
    maxValue: number;
    unit: string;
    guidance?: string;
  }>;
  hasHypertension: boolean;
  hasCKD: boolean;
  hasGout: boolean;
  hasDyslipidemia: boolean;
  ckdStage?: CKDStage;
}

// ============================================
// UI HELPER TYPES
// ============================================

/**
 * Condition for display in UI (with metadata)
 */
export interface ConditionDisplay {
  code: ConditionCode;
  name: string;
  nameMs: string;
  category: ConditionCategory;
  icon: string;
  color: string;
  isSelected?: boolean;
  isPrimary?: boolean;
  severity?: ConditionSeverity;
}

/**
 * Nutrient bar for dashboard display
 */
export interface NutrientBarData {
  nutrient: NutrientCode;
  label: string;
  labelMs: string;
  current: number;
  target: number;
  unit: string;
  percentage: number;
  status: 'good' | 'warning' | 'danger';
  isRelevant: boolean; // relevant to user's conditions
  priority: NutrientPriority;
}

/**
 * Grouped conditions by category
 */
export interface ConditionsByCategory {
  metabolic: ConditionType[];
  cardiovascular: ConditionType[];
  renal: ConditionType[];
  other: ConditionType[];
}


