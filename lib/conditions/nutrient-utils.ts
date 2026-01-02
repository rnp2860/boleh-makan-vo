// lib/conditions/nutrient-utils.ts
// 🏥 Nutrient Utilities - Calculations, warnings, and helpers

import {
  NutrientTarget,
  NutrientWarning,
  FoodNutrientCheck,
  NutrientCode,
  ConditionCode,
  DailyNutrientSummary,
  NutrientBarData,
  NutrientPriority,
  WarningLevel,
  UserCondition,
} from './types';
import {
  NUTRIENT_INFO,
  WARNING_THRESHOLDS,
  PRIORITY_ORDER,
  HIGH_PURINE_FOODS,
  HIGH_SODIUM_INDICATORS,
} from './constants';

// ============================================
// FOOD NUTRIENT CHECK
// ============================================

/**
 * Food nutrients structure (from food analysis)
 */
interface FoodNutrients {
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  sodium?: number;
  potassium?: number;
  phosphorus?: number;
  cholesterol?: number;
  saturatedFat?: number;
  transFat?: number;
  fiber?: number;
  sugar?: number;
  purine?: number;
  fructose?: number;
  alcohol?: number;
}

/**
 * Check a food's nutrients against user's targets
 * Returns warnings if food exceeds thresholds
 */
export function checkFoodNutrients(
  foodId: string,
  foodName: string,
  nutrients: FoodNutrients,
  targets: NutrientTarget[],
  userConditions: ConditionCode[]
): FoodNutrientCheck {
  const warnings: NutrientWarning[] = [];
  
  // Map nutrient values to codes
  const nutrientMap: Partial<Record<NutrientCode, number | undefined>> = {
    calories: nutrients.calories,
    carbs: nutrients.carbs,
    protein: nutrients.protein,
    fat: nutrients.fat,
    sodium: nutrients.sodium,
    potassium: nutrients.potassium,
    phosphorus: nutrients.phosphorus,
    cholesterol: nutrients.cholesterol,
    saturated_fat: nutrients.saturatedFat,
    trans_fat: nutrients.transFat,
    fiber: nutrients.fiber,
    sugar: nutrients.sugar,
    purine: nutrients.purine,
    fructose: nutrients.fructose,
    alcohol: nutrients.alcohol,
  };
  
  // Check each target
  for (const target of targets) {
    const value = nutrientMap[target.nutrientCode];
    
    if (value === undefined || value === null) continue;
    if (!target.maxValue) continue; // Only check max limits for single foods
    
    const percentOfDaily = (value / target.maxValue) * 100;
    
    // Determine warning level based on percentage of daily limit
    let level: WarningLevel | null = null;
    if (percentOfDaily >= WARNING_THRESHOLDS.SINGLE_FOOD_DANGER * 100) {
      level = 'danger';
    } else if (percentOfDaily >= WARNING_THRESHOLDS.SINGLE_FOOD_WARNING * 100) {
      level = 'warning';
    } else if (percentOfDaily >= WARNING_THRESHOLDS.SINGLE_FOOD_INFO * 100) {
      level = 'info';
    }
    
    if (level) {
      const info = NUTRIENT_INFO[target.nutrientCode];
      const relatedConditions = info.relevantConditions.filter(c => 
        userConditions.includes(c)
      );
      
      warnings.push({
        nutrient: target.nutrientCode,
        nutrientLabel: info.label,
        level,
        message: generateWarningMessage(target.nutrientCode, value, target.maxValue, target.unit, level),
        messageMs: generateWarningMessageMs(target.nutrientCode, value, target.maxValue, target.unit, level),
        currentValue: value,
        limitValue: target.maxValue,
        unit: target.unit,
        percentOfLimit: percentOfDaily,
        relatedConditions,
      });
    }
  }
  
  // Check for high purine foods (for gout)
  if (userConditions.includes('gout')) {
    const lowerFoodName = foodName.toLowerCase();
    const isPurineRisk = HIGH_PURINE_FOODS.some(food => lowerFoodName.includes(food));
    if (isPurineRisk && !warnings.some(w => w.nutrient === 'purine')) {
      warnings.push({
        nutrient: 'purine',
        nutrientLabel: 'Purine',
        level: 'warning',
        message: `${foodName} may be high in purines. Consider limiting intake for gout management.`,
        messageMs: `${foodName} mungkin tinggi purin. Pertimbangkan untuk mengehadkan pengambilan untuk pengurusan gout.`,
        currentValue: 0,
        limitValue: 400,
        unit: 'mg',
        percentOfLimit: 0,
        relatedConditions: ['gout'],
      });
    }
  }
  
  // Check for high sodium indicators (for hypertension)
  if (userConditions.includes('hypertension') || userConditions.some(c => c.startsWith('ckd_'))) {
    const lowerFoodName = foodName.toLowerCase();
    const isSodiumRisk = HIGH_SODIUM_INDICATORS.some(indicator => lowerFoodName.includes(indicator));
    if (isSodiumRisk && !warnings.some(w => w.nutrient === 'sodium')) {
      warnings.push({
        nutrient: 'sodium',
        nutrientLabel: 'Sodium',
        level: 'info',
        message: `${foodName} may be high in sodium. Check the nutrition label.`,
        messageMs: `${foodName} mungkin tinggi natrium. Semak label pemakanan.`,
        currentValue: 0,
        limitValue: 2000,
        unit: 'mg',
        percentOfLimit: 0,
        relatedConditions: userConditions.filter(c => c === 'hypertension' || c.startsWith('ckd_')),
      });
    }
  }
  
  // Sort by priority (danger > warning > info)
  warnings.sort((a, b) => {
    const levelOrder = { danger: 0, warning: 1, info: 2 };
    return levelOrder[a.level] - levelOrder[b.level];
  });
  
  return {
    foodId,
    foodName,
    warnings,
    hasWarnings: warnings.length > 0,
    hasCriticalWarnings: warnings.some(w => w.level === 'danger'),
  };
}

// ============================================
// DAILY SUMMARY WARNINGS
// ============================================

/**
 * Check daily nutrient totals against targets
 */
export function checkDailyNutrients(
  summary: Partial<DailyNutrientSummary>,
  targets: NutrientTarget[],
  userConditions: ConditionCode[]
): NutrientWarning[] {
  const warnings: NutrientWarning[] = [];
  
  // Map summary to nutrient codes
  const nutrientMap: Partial<Record<NutrientCode, number | undefined>> = {
    calories: summary.calories,
    carbs: summary.carbsG,
    protein: summary.proteinG,
    fat: summary.fatG,
    sodium: summary.sodiumMg,
    potassium: summary.potassiumMg,
    phosphorus: summary.phosphorusMg,
    cholesterol: summary.cholesterolMg,
    saturated_fat: summary.saturatedFatG,
    trans_fat: summary.transFatG,
    fiber: summary.fiberG,
    sugar: summary.sugarG,
    purine: summary.purineMg,
    fructose: summary.fructoseG,
    alcohol: summary.alcoholG,
  };
  
  for (const target of targets) {
    const value = nutrientMap[target.nutrientCode];
    if (value === undefined || value === null) continue;
    
    // Check max limit
    if (target.maxValue) {
      const percentOfDaily = (value / target.maxValue) * 100;
      
      let level: WarningLevel | null = null;
      if (percentOfDaily >= WARNING_THRESHOLDS.DAILY_DANGER * 100) {
        level = 'danger';
      } else if (percentOfDaily >= WARNING_THRESHOLDS.DAILY_WARNING * 100) {
        level = 'warning';
      } else if (percentOfDaily >= WARNING_THRESHOLDS.DAILY_INFO * 100) {
        level = 'info';
      }
      
      if (level) {
        const info = NUTRIENT_INFO[target.nutrientCode];
        warnings.push({
          nutrient: target.nutrientCode,
          nutrientLabel: info.label,
          level,
          message: generateDailyWarningMessage(target.nutrientCode, value, target.maxValue, target.unit, level),
          messageMs: generateDailyWarningMessageMs(target.nutrientCode, value, target.maxValue, target.unit, level),
          currentValue: value,
          limitValue: target.maxValue,
          unit: target.unit,
          percentOfLimit: percentOfDaily,
          relatedConditions: info.relevantConditions.filter(c => userConditions.includes(c)),
        });
      }
    }
    
    // Check min limit (for fiber, potassium when beneficial)
    if (target.minValue && value < target.minValue * 0.5) {
      const info = NUTRIENT_INFO[target.nutrientCode];
      warnings.push({
        nutrient: target.nutrientCode,
        nutrientLabel: info.label,
        level: 'info',
        message: `Consider eating more ${info.label.toLowerCase()} today (${value.toFixed(0)}${target.unit} of ${target.minValue}${target.unit} target).`,
        messageMs: `Pertimbangkan untuk makan lebih banyak ${info.labelMs.toLowerCase()} hari ini (${value.toFixed(0)}${target.unit} daripada ${target.minValue}${target.unit} sasaran).`,
        currentValue: value,
        limitValue: target.minValue,
        unit: target.unit,
        percentOfLimit: (value / target.minValue) * 100,
        relatedConditions: info.relevantConditions.filter(c => userConditions.includes(c)),
      });
    }
  }
  
  return warnings;
}

// ============================================
// NUTRIENT BAR DATA
// ============================================

/**
 * Generate nutrient bar data for dashboard display
 */
export function generateNutrientBars(
  summary: Partial<DailyNutrientSummary>,
  targets: NutrientTarget[],
  userConditions: ConditionCode[]
): NutrientBarData[] {
  const bars: NutrientBarData[] = [];
  
  // Map summary to nutrient codes
  const nutrientMap: Partial<Record<NutrientCode, number | undefined>> = {
    calories: summary.calories,
    carbs: summary.carbsG,
    protein: summary.proteinG,
    fat: summary.fatG,
    sodium: summary.sodiumMg,
    potassium: summary.potassiumMg,
    phosphorus: summary.phosphorusMg,
    cholesterol: summary.cholesterolMg,
    saturated_fat: summary.saturatedFatG,
    trans_fat: summary.transFatG,
    fiber: summary.fiberG,
    sugar: summary.sugarG,
    purine: summary.purineMg,
    fructose: summary.fructoseG,
    alcohol: summary.alcoholG,
  };
  
  for (const target of targets) {
    const current = nutrientMap[target.nutrientCode] ?? 0;
    const targetValue = target.maxValue ?? target.minValue ?? 100;
    const percentage = (current / targetValue) * 100;
    const info = NUTRIENT_INFO[target.nutrientCode];
    
    // Determine status
    let status: 'good' | 'warning' | 'danger' = 'good';
    if (target.maxValue) {
      if (percentage >= 100) status = 'danger';
      else if (percentage >= 85) status = 'warning';
    }
    
    // Check if relevant to user's conditions
    const isRelevant = info.relevantConditions.some(c => userConditions.includes(c));
    
    bars.push({
      nutrient: target.nutrientCode,
      label: info.label,
      labelMs: info.labelMs,
      current,
      target: targetValue,
      unit: target.unit,
      percentage: Math.min(percentage, 150), // Cap at 150% for display
      status,
      isRelevant,
      priority: target.priority,
    });
  }
  
  // Sort by priority, then relevance
  bars.sort((a, b) => {
    // Relevant conditions first
    if (a.isRelevant !== b.isRelevant) return a.isRelevant ? -1 : 1;
    // Then by priority
    return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
  });
  
  return bars;
}

// ============================================
// REMAINING CALCULATIONS
// ============================================

/**
 * Calculate remaining nutrients for the day
 */
export function calculateRemainingNutrients(
  summary: Partial<DailyNutrientSummary>,
  targets: NutrientTarget[]
): Partial<Record<NutrientCode, { remaining: number; percentage: number; unit: string }>> {
  const remaining: Partial<Record<NutrientCode, { remaining: number; percentage: number; unit: string }>> = {};
  
  const nutrientMap: Partial<Record<NutrientCode, number | undefined>> = {
    calories: summary.calories,
    carbs: summary.carbsG,
    protein: summary.proteinG,
    fat: summary.fatG,
    sodium: summary.sodiumMg,
    potassium: summary.potassiumMg,
    phosphorus: summary.phosphorusMg,
    cholesterol: summary.cholesterolMg,
    saturated_fat: summary.saturatedFatG,
    trans_fat: summary.transFatG,
    fiber: summary.fiberG,
    sugar: summary.sugarG,
    purine: summary.purineMg,
  };
  
  for (const target of targets) {
    if (!target.maxValue) continue;
    
    const consumed = nutrientMap[target.nutrientCode] ?? 0;
    const remainingValue = Math.max(0, target.maxValue - consumed);
    
    remaining[target.nutrientCode] = {
      remaining: remainingValue,
      percentage: (consumed / target.maxValue) * 100,
      unit: target.unit,
    };
  }
  
  return remaining;
}

// ============================================
// MESSAGE GENERATORS
// ============================================

function generateWarningMessage(
  nutrient: NutrientCode,
  value: number,
  limit: number,
  unit: string,
  level: WarningLevel
): string {
  const info = NUTRIENT_INFO[nutrient];
  const percent = Math.round((value / limit) * 100);
  
  switch (level) {
    case 'danger':
      return `High ${info.label.toLowerCase()}! This serving contains ${value.toFixed(0)}${unit} (${percent}% of your daily limit).`;
    case 'warning':
      return `This is moderately high in ${info.label.toLowerCase()} (${value.toFixed(0)}${unit}, ${percent}% of daily limit).`;
    case 'info':
    default:
      return `Contains ${value.toFixed(0)}${unit} ${info.label.toLowerCase()} (${percent}% of daily limit).`;
  }
}

function generateWarningMessageMs(
  nutrient: NutrientCode,
  value: number,
  limit: number,
  unit: string,
  level: WarningLevel
): string {
  const info = NUTRIENT_INFO[nutrient];
  const percent = Math.round((value / limit) * 100);
  
  switch (level) {
    case 'danger':
      return `${info.labelMs} tinggi! Sajian ini mengandungi ${value.toFixed(0)}${unit} (${percent}% had harian anda).`;
    case 'warning':
      return `Ini sederhana tinggi dalam ${info.labelMs.toLowerCase()} (${value.toFixed(0)}${unit}, ${percent}% had harian).`;
    case 'info':
    default:
      return `Mengandungi ${value.toFixed(0)}${unit} ${info.labelMs.toLowerCase()} (${percent}% had harian).`;
  }
}

function generateDailyWarningMessage(
  nutrient: NutrientCode,
  value: number,
  limit: number,
  unit: string,
  level: WarningLevel
): string {
  const info = NUTRIENT_INFO[nutrient];
  const remaining = Math.max(0, limit - value);
  
  switch (level) {
    case 'danger':
      return `You've exceeded your daily ${info.label.toLowerCase()} limit (${value.toFixed(0)}/${limit}${unit}).`;
    case 'warning':
      return `Almost at your daily ${info.label.toLowerCase()} limit. ${remaining.toFixed(0)}${unit} remaining.`;
    case 'info':
    default:
      return `${remaining.toFixed(0)}${unit} ${info.label.toLowerCase()} remaining today.`;
  }
}

function generateDailyWarningMessageMs(
  nutrient: NutrientCode,
  value: number,
  limit: number,
  unit: string,
  level: WarningLevel
): string {
  const info = NUTRIENT_INFO[nutrient];
  const remaining = Math.max(0, limit - value);
  
  switch (level) {
    case 'danger':
      return `Anda telah melebihi had harian ${info.labelMs.toLowerCase()} (${value.toFixed(0)}/${limit}${unit}).`;
    case 'warning':
      return `Hampir mencapai had harian ${info.labelMs.toLowerCase()}. ${remaining.toFixed(0)}${unit} lagi.`;
    case 'info':
    default:
      return `${remaining.toFixed(0)}${unit} ${info.labelMs.toLowerCase()} berbaki hari ini.`;
  }
}

// ============================================
// WEIGHT-BASED CALCULATIONS
// ============================================

/**
 * Calculate actual target from per-kg value
 */
export function calculateWeightBasedTarget(
  perKgValue: number,
  weightKg: number
): number {
  return perKgValue * weightKg;
}

/**
 * Adjust targets for weight-based nutrients (like protein for CKD)
 */
export function adjustTargetsForWeight(
  targets: NutrientTarget[],
  weightKg: number
): NutrientTarget[] {
  return targets.map(target => {
    if (target.isPerKgBodyWeight && weightKg > 0) {
      return {
        ...target,
        minValue: target.minValue ? target.minValue * weightKg : undefined,
        maxValue: target.maxValue ? target.maxValue * weightKg : undefined,
        unit: 'g', // Convert from g/kg to g
      };
    }
    return target;
  });
}

// ============================================
// CONDITION HELPERS
// ============================================

/**
 * Get nutrients relevant to a set of conditions
 */
export function getRelevantNutrients(conditions: ConditionCode[]): NutrientCode[] {
  const relevant = new Set<NutrientCode>();
  
  for (const nutrient of Object.values(NUTRIENT_INFO)) {
    if (nutrient.relevantConditions.some(c => conditions.includes(c))) {
      relevant.add(nutrient.code);
    }
  }
  
  return Array.from(relevant);
}

/**
 * Get priority nutrients for AI context
 */
export function getPriorityNutrients(
  targets: NutrientTarget[],
  priority: NutrientPriority = 'critical'
): NutrientTarget[] {
  const priorityOrder = PRIORITY_ORDER[priority];
  return targets.filter(t => PRIORITY_ORDER[t.priority] <= priorityOrder);
}


