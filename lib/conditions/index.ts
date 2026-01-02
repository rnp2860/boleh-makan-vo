// lib/conditions/index.ts
// 🏥 Comorbidity Module - Barrel Export

// Types
export type {
  ConditionCategory,
  ConditionSeverity,
  NutrientPriority,
  TargetSource,
  WarningLevel,
  ConditionCode,
  DiabetesCondition,
  CKDStage,
  NutrientCode,
  ConditionType,
  UserCondition,
  ConditionNutrientTarget,
  UserNutrientTarget,
  NutrientTarget,
  DailyNutrientSummary,
  NutrientWarning,
  FoodNutrientCheck,
  AddUserConditionInput,
  UpdateUserConditionInput,
  SetUserNutrientTargetInput,
  AIHealthContext,
  ConditionDisplay,
  NutrientBarData,
  ConditionsByCategory,
} from './types';

// Constants
export {
  CONDITION_CODES,
  DIABETES_CONDITIONS,
  CKD_STAGES,
  COMMON_COMORBIDITIES,
  NUTRIENT_CODES,
  NUTRIENT_INFO,
  CONDITION_CATEGORIES,
  WARNING_THRESHOLDS,
  PRIORITY_ORDER,
  CKD_EGFR_RANGES,
  HIGH_PURINE_FOODS,
  HIGH_SODIUM_INDICATORS,
  getCKDStageFromEGFR,
} from './constants';

// Queries
export {
  getConditionTypes,
  getConditionTypesByCategory,
  getConditionTypeByCode,
  getUserConditions,
  getUserPrimaryCondition,
  userHasCondition,
  addUserCondition,
  updateUserCondition,
  removeUserCondition,
  setPrimaryCondition,
  getUserNutrientTargets,
  getConditionNutrientTargets,
  getUserNutrientTargetOverrides,
  setUserNutrientTarget,
  removeUserNutrientTarget,
  getDailyNutrientSummary,
  getDailyNutrientSummaries,
  updateDailyNutrientSummary,
} from './queries';

// Nutrient Utilities
export {
  checkFoodNutrients,
  checkDailyNutrients,
  generateNutrientBars,
  calculateRemainingNutrients,
  calculateWeightBasedTarget,
  adjustTargetsForWeight,
  getRelevantNutrients,
  getPriorityNutrients,
} from './nutrient-utils';

// AI Context
export {
  buildAIHealthContext,
  generateAISystemPromptContext,
  generateFoodAnalysisContext,
  generateMealRecommendationContext,
  generateWarningContext,
  getDailyTips,
} from './ai-context';


