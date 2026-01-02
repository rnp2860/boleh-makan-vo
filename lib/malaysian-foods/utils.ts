// 🇲🇾 Malaysian Food Database Utilities

import { 
  MalaysianFood, 
  MalaysianFoodRow, 
  AdjustedNutrients, 
  ConditionWarning,
  ConditionRating,
  DAILY_LIMITS,
  GICategory
} from './types';

// ============================================
// ROW TO MODEL CONVERSION
// ============================================

export function rowToMalaysianFood(row: MalaysianFoodRow): MalaysianFood {
  return {
    id: row.id,
    nameEn: row.name_en,
    nameBm: row.name_bm,
    aliases: row.aliases || [],
    category: row.category as MalaysianFood['category'],
    subcategory: row.subcategory || undefined,
    tags: row.tags || [],
    servingDescription: row.serving_description,
    servingDescriptionEn: row.serving_description_en || undefined,
    servingGrams: row.serving_grams,
    caloriesKcal: row.calories_kcal,
    carbsG: row.carbs_g,
    sugarG: row.sugar_g ?? undefined,
    fiberG: row.fiber_g ?? undefined,
    glycemicIndex: row.glycemic_index ?? undefined,
    giCategory: row.gi_category as GICategory | undefined,
    sodiumMg: row.sodium_mg ?? undefined,
    potassiumMg: row.potassium_mg ?? undefined,
    totalFatG: row.total_fat_g ?? undefined,
    saturatedFatG: row.saturated_fat_g ?? undefined,
    transFatG: row.trans_fat_g ?? undefined,
    cholesterolMg: row.cholesterol_mg ?? undefined,
    proteinG: row.protein_g ?? undefined,
    phosphorusMg: row.phosphorus_mg ?? undefined,
    diabetesRating: row.diabetes_rating as ConditionRating | undefined,
    hypertensionRating: row.hypertension_rating as ConditionRating | undefined,
    cholesterolRating: row.cholesterol_rating as ConditionRating | undefined,
    ckdRating: row.ckd_rating as ConditionRating | undefined,
    imageUrl: row.image_url ?? undefined,
    source: row.source as MalaysianFood['source'],
    verified: row.verified,
    popularityScore: row.popularity_score,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ============================================
// PORTION CALCULATIONS
// ============================================

export function calculateAdjustedNutrients(
  food: MalaysianFood,
  multiplier: number
): AdjustedNutrients {
  return {
    servingGrams: Math.round(food.servingGrams * multiplier),
    caloriesKcal: Math.round(food.caloriesKcal * multiplier),
    carbsG: Math.round(food.carbsG * multiplier * 10) / 10,
    sugarG: food.sugarG ? Math.round(food.sugarG * multiplier * 10) / 10 : undefined,
    fiberG: food.fiberG ? Math.round(food.fiberG * multiplier * 10) / 10 : undefined,
    sodiumMg: food.sodiumMg ? Math.round(food.sodiumMg * multiplier) : undefined,
    totalFatG: food.totalFatG ? Math.round(food.totalFatG * multiplier * 10) / 10 : undefined,
    saturatedFatG: food.saturatedFatG ? Math.round(food.saturatedFatG * multiplier * 10) / 10 : undefined,
    proteinG: food.proteinG ? Math.round(food.proteinG * multiplier * 10) / 10 : undefined,
    cholesterolMg: food.cholesterolMg ? Math.round(food.cholesterolMg * multiplier) : undefined,
    phosphorusMg: food.phosphorusMg ? Math.round(food.phosphorusMg * multiplier) : undefined,
    potassiumMg: food.potassiumMg ? Math.round(food.potassiumMg * multiplier) : undefined,
  };
}

// ============================================
// CONDITION WARNINGS
// ============================================

export function getConditionWarnings(
  food: MalaysianFood,
  userConditions: string[],
  multiplier: number = 1
): ConditionWarning[] {
  const warnings: ConditionWarning[] = [];
  const adjusted = calculateAdjustedNutrients(food, multiplier);
  
  // Diabetes warnings
  if (userConditions.includes('diabetes') || userConditions.includes('type2_diabetes')) {
    if (food.diabetesRating) {
      const warning: ConditionWarning = {
        condition: 'diabetes',
        rating: food.diabetesRating,
        message: getDiabetesMessage(food, adjusted),
      };
      
      if (food.glycemicIndex) {
        warning.detail = `GI: ${food.glycemicIndex} (${food.giCategory || 'unknown'})`;
      }
      
      warnings.push(warning);
    }
  }
  
  // Hypertension warnings
  if (userConditions.includes('hypertension')) {
    if (food.hypertensionRating) {
      const sodiumPercent = adjusted.sodiumMg 
        ? Math.round((adjusted.sodiumMg / DAILY_LIMITS.sodium) * 100)
        : 0;
      
      warnings.push({
        condition: 'hypertension',
        rating: food.hypertensionRating,
        message: getHypertensionMessage(food, adjusted),
        detail: adjusted.sodiumMg ? `${adjusted.sodiumMg}mg sodium (${sodiumPercent}% daily)` : undefined,
      });
    }
  }
  
  // Cholesterol warnings
  if (userConditions.includes('dyslipidemia') || userConditions.includes('high_cholesterol')) {
    if (food.cholesterolRating) {
      warnings.push({
        condition: 'cholesterol',
        rating: food.cholesterolRating,
        message: getCholesterolMessage(food, adjusted),
        detail: adjusted.saturatedFatG ? `${adjusted.saturatedFatG}g saturated fat` : undefined,
      });
    }
  }
  
  // CKD warnings
  if (userConditions.includes('ckd') || userConditions.includes('kidney_disease')) {
    if (food.ckdRating) {
      warnings.push({
        condition: 'ckd',
        rating: food.ckdRating,
        message: getCKDMessage(food, adjusted),
        detail: adjusted.proteinG ? `${adjusted.proteinG}g protein, ${adjusted.phosphorusMg || '?'}mg phosphorus` : undefined,
      });
    }
  }
  
  return warnings;
}

function getDiabetesMessage(food: MalaysianFood, adjusted: AdjustedNutrients): string {
  if (food.diabetesRating === 'limit') {
    if (food.giCategory === 'high') {
      return `High GI food - may cause rapid glucose spike`;
    }
    if (adjusted.carbsG > 60) {
      return `Very high carbs (${adjusted.carbsG}g) - portion control essential`;
    }
    return `Limit this food - high impact on blood sugar`;
  }
  
  if (food.diabetesRating === 'caution') {
    if (food.giCategory === 'medium' || food.giCategory === 'high') {
      return `Moderate GI - pair with protein/fiber to slow absorption`;
    }
    return `Watch your portion - count toward daily carb limit`;
  }
  
  return `Good choice for blood sugar management`;
}

function getHypertensionMessage(food: MalaysianFood, adjusted: AdjustedNutrients): string {
  const sodiumMg = adjusted.sodiumMg || 0;
  
  if (food.hypertensionRating === 'limit') {
    return `Very high sodium (${sodiumMg}mg) - avoid if possible`;
  }
  
  if (food.hypertensionRating === 'caution') {
    return `Moderate sodium - limit to occasional treat`;
  }
  
  return `Low sodium - heart-healthy choice`;
}

function getCholesterolMessage(food: MalaysianFood, adjusted: AdjustedNutrients): string {
  if (food.cholesterolRating === 'limit') {
    if ((adjusted.saturatedFatG || 0) > 10) {
      return `High saturated fat - limit for heart health`;
    }
    if ((adjusted.cholesterolMg || 0) > 150) {
      return `High cholesterol content - occasional only`;
    }
    return `High in unhealthy fats - choose alternatives`;
  }
  
  if (food.cholesterolRating === 'caution') {
    return `Moderate fat content - enjoy in moderation`;
  }
  
  return `Good choice for cholesterol management`;
}

function getCKDMessage(food: MalaysianFood, adjusted: AdjustedNutrients): string {
  const proteinG = adjusted.proteinG || 0;
  const phosphorusMg = adjusted.phosphorusMg || 0;
  const potassiumMg = adjusted.potassiumMg || 0;
  
  if (food.ckdRating === 'limit') {
    if (proteinG > 20) {
      return `High protein (${proteinG}g) - exceeds kidney-safe portion`;
    }
    if (phosphorusMg > 200) {
      return `High phosphorus - limit for kidney health`;
    }
    if (potassiumMg > 400) {
      return `High potassium - monitor intake carefully`;
    }
    return `Not recommended for kidney disease`;
  }
  
  if (food.ckdRating === 'caution') {
    return `Count toward daily protein/phosphorus limits`;
  }
  
  return `Kidney-friendly choice`;
}

// ============================================
// RATING HELPERS
// ============================================

export function getRatingColor(rating: ConditionRating): string {
  switch (rating) {
    case 'safe': return 'text-green-600 bg-green-50 border-green-200';
    case 'caution': return 'text-amber-600 bg-amber-50 border-amber-200';
    case 'limit': return 'text-red-600 bg-red-50 border-red-200';
    default: return 'text-gray-600 bg-gray-50 border-gray-200';
  }
}

export function getRatingIcon(rating: ConditionRating): string {
  switch (rating) {
    case 'safe': return '✓';
    case 'caution': return '⚠';
    case 'limit': return '✕';
    default: return '?';
  }
}

export function getRatingLabel(rating: ConditionRating): string {
  switch (rating) {
    case 'safe': return 'Safe';
    case 'caution': return 'Caution';
    case 'limit': return 'Limit';
    default: return 'Unknown';
  }
}

// ============================================
// GI HELPERS
// ============================================

export function getGIColor(gi: number | undefined): string {
  if (!gi) return 'text-gray-500';
  if (gi < 55) return 'text-green-600';
  if (gi < 70) return 'text-amber-600';
  return 'text-red-600';
}

export function getGILabel(gi: number | undefined, category?: GICategory): string {
  if (!gi && !category) return 'GI tidak diketahui';
  
  if (category === 'low' || (gi && gi < 55)) {
    return `Low GI${gi ? ` (${gi})` : ''}`;
  }
  if (category === 'medium' || (gi && gi < 70)) {
    return `Medium GI${gi ? ` (${gi})` : ''}`;
  }
  return `High GI${gi ? ` (${gi})` : ''}`;
}

// ============================================
// SEARCH HELPERS
// ============================================

export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) return text;
  
  const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 rounded px-0.5">$1</mark>');
}

function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================
// FORMATTING HELPERS
// ============================================

export function formatNutrient(value: number | undefined, unit: string): string {
  if (value === undefined || value === null) return '-';
  return `${value}${unit}`;
}

export function formatCalories(kcal: number): string {
  return `${Math.round(kcal)} kcal`;
}

export function formatServing(food: MalaysianFood, multiplier: number = 1): string {
  const grams = Math.round(food.servingGrams * multiplier);
  const desc = multiplier === 1 
    ? food.servingDescription 
    : `${multiplier}x ${food.servingDescription}`;
  
  return `${desc} (${grams}g)`;
}

