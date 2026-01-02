// lib/conditions/ai-context.ts
// 🏥 AI Health Context Builder - Context for Dr. Reza AI

import {
  UserCondition,
  NutrientTarget,
  ConditionCode,
  AIHealthContext,
  CKDStage,
  DailyNutrientSummary,
  NutrientWarning,
} from './types';
import { CONDITION_CODES, CKD_STAGES, NUTRIENT_INFO } from './constants';
import { checkDailyNutrients, calculateRemainingNutrients, getPriorityNutrients } from './nutrient-utils';

// ============================================
// BUILD AI HEALTH CONTEXT
// ============================================

/**
 * Build comprehensive health context for Dr. Reza AI
 */
export function buildAIHealthContext(
  conditions: UserCondition[],
  targets: NutrientTarget[]
): AIHealthContext {
  const conditionCodes = conditions.map(c => c.conditionCode);
  const primaryCondition = conditions.find(c => c.isPrimary) || conditions[0];
  
  // Get CKD stage if applicable
  const ckdStage = conditionCodes.find(c => c.startsWith('ckd_')) as CKDStage | undefined;
  
  // Get critical nutrients
  const criticalNutrients = targets
    .filter(t => t.priority === 'critical' && t.maxValue)
    .map(t => ({
      nutrient: t.nutrientCode,
      maxValue: t.maxValue!,
      unit: t.unit,
      guidance: t.guidance,
    }));
  
  return {
    primaryCondition: primaryCondition?.conditionCode || 'diabetes_t2',
    primaryConditionName: primaryCondition?.condition?.name || 'Type 2 Diabetes',
    allConditions: conditions.map(c => ({
      code: c.conditionCode,
      name: c.condition?.name || c.conditionCode,
      severity: c.severity,
    })),
    criticalNutrients,
    hasHypertension: conditionCodes.includes('hypertension'),
    hasCKD: conditionCodes.some(c => c.startsWith('ckd_')),
    hasGout: conditionCodes.includes('gout'),
    hasDyslipidemia: conditionCodes.includes('dyslipidemia'),
    ckdStage,
  };
}

// ============================================
// GENERATE SYSTEM PROMPT CONTEXT
// ============================================

/**
 * Generate the health context section for AI system prompt
 */
export function generateAISystemPromptContext(
  context: AIHealthContext,
  dailySummary?: Partial<DailyNutrientSummary>,
  targets?: NutrientTarget[]
): string {
  const lines: string[] = [];
  
  // Primary condition
  lines.push(`## User Health Profile`);
  lines.push(`- **Primary Condition:** ${context.primaryConditionName}`);
  
  // Other conditions
  if (context.allConditions.length > 1) {
    const otherConditions = context.allConditions
      .filter(c => c.code !== context.primaryCondition)
      .map(c => {
        const severity = c.severity ? ` (${c.severity})` : '';
        return `${c.name}${severity}`;
      })
      .join(', ');
    lines.push(`- **Other Conditions:** ${otherConditions}`);
  }
  
  // CKD stage specific
  if (context.ckdStage) {
    const stageNum = context.ckdStage.replace('ckd_stage', '');
    lines.push(`- **Kidney Function:** CKD Stage ${stageNum} - requires careful monitoring of protein, potassium, phosphorus, and sodium`);
  }
  
  // Critical nutrient limits
  if (context.criticalNutrients.length > 0) {
    lines.push(`\n### Critical Nutrient Limits (Daily)`);
    for (const nutrient of context.criticalNutrients) {
      const info = NUTRIENT_INFO[nutrient.nutrient];
      lines.push(`- **${info.label}:** max ${nutrient.maxValue}${nutrient.unit}`);
    }
  }
  
  // Today's progress if available
  if (dailySummary && targets) {
    const remaining = calculateRemainingNutrients(dailySummary, targets);
    const criticalRemaining = context.criticalNutrients
      .filter(n => remaining[n.nutrient])
      .map(n => {
        const r = remaining[n.nutrient]!;
        const info = NUTRIENT_INFO[n.nutrient];
        return `${info.label}: ${r.remaining.toFixed(0)}${r.unit} left (${r.percentage.toFixed(0)}% used)`;
      });
    
    if (criticalRemaining.length > 0) {
      lines.push(`\n### Today's Progress`);
      criticalRemaining.forEach(r => lines.push(`- ${r}`));
    }
  }
  
  // Special instructions based on conditions
  lines.push(`\n### Important Considerations`);
  lines.push(`When recommending foods or analyzing meals:`);
  
  if (context.hasHypertension) {
    lines.push(`- **HYPERTENSION:** Always warn about high sodium foods (>500mg per serving). Recommend DASH-friendly alternatives.`);
  }
  
  if (context.hasCKD) {
    lines.push(`- **CKD:** Monitor protein carefully. Warn about high potassium foods (bananas, oranges, tomatoes, potatoes). Warn about high phosphorus foods (dairy, cola, processed meats).`);
  }
  
  if (context.hasGout) {
    lines.push(`- **GOUT:** Warn about high-purine foods (organ meats, anchovies, sardines, shellfish, beer). Recommend low-purine alternatives.`);
  }
  
  if (context.hasDyslipidemia) {
    lines.push(`- **HIGH CHOLESTEROL:** Warn about saturated fat and trans fat. Recommend foods with fiber and healthy fats.`);
  }
  
  // General instruction
  lines.push(`\nALWAYS consider ALL of the user's conditions when making recommendations. Prioritize warnings by severity. Be specific about why a food may not be suitable.`);
  
  return lines.join('\n');
}

// ============================================
// FOOD ANALYSIS CONTEXT
// ============================================

/**
 * Generate context for food analysis request
 */
export function generateFoodAnalysisContext(
  context: AIHealthContext,
  dailySummary?: Partial<DailyNutrientSummary>,
  targets?: NutrientTarget[]
): string {
  const lines: string[] = [];
  
  lines.push(`User has: ${context.allConditions.map(c => c.name).join(', ')}`);
  
  // Add remaining allowances if available
  if (dailySummary && targets) {
    const remaining = calculateRemainingNutrients(dailySummary, targets);
    const criticalNutrients = context.criticalNutrients;
    
    if (criticalNutrients.length > 0) {
      lines.push(`\nRemaining daily allowances:`);
      for (const nutrient of criticalNutrients) {
        const r = remaining[nutrient.nutrient];
        if (r) {
          const info = NUTRIENT_INFO[nutrient.nutrient];
          lines.push(`- ${info.label}: ${r.remaining.toFixed(0)}${r.unit}`);
        }
      }
    }
  }
  
  // Specific warnings to include
  const warningsToInclude: string[] = [];
  
  if (context.hasHypertension) {
    warningsToInclude.push('sodium content');
  }
  if (context.hasCKD) {
    warningsToInclude.push('potassium', 'phosphorus', 'protein content');
  }
  if (context.hasGout) {
    warningsToInclude.push('purine level');
  }
  if (context.hasDyslipidemia) {
    warningsToInclude.push('saturated fat', 'cholesterol');
  }
  
  if (warningsToInclude.length > 0) {
    lines.push(`\nPlease specifically comment on: ${warningsToInclude.join(', ')}`);
  }
  
  return lines.join('\n');
}

// ============================================
// MEAL RECOMMENDATION CONTEXT
// ============================================

/**
 * Generate context for meal recommendations
 */
export function generateMealRecommendationContext(
  context: AIHealthContext,
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack',
  dailySummary?: Partial<DailyNutrientSummary>,
  targets?: NutrientTarget[]
): string {
  const lines: string[] = [];
  
  lines.push(`Recommend ${mealType} options for someone with: ${context.allConditions.map(c => c.name).join(', ')}`);
  
  // Add constraints
  const constraints: string[] = [];
  
  if (context.hasHypertension) {
    constraints.push('low sodium (under 600mg per meal)');
  }
  
  if (context.hasCKD) {
    const stage = context.ckdStage;
    if (stage && ['ckd_stage3b', 'ckd_stage4', 'ckd_stage5'].includes(stage)) {
      constraints.push('low potassium');
      constraints.push('low phosphorus');
      constraints.push('controlled protein');
    }
  }
  
  if (context.hasGout) {
    constraints.push('low purine');
  }
  
  if (context.hasDyslipidemia) {
    constraints.push('low saturated fat');
    constraints.push('no trans fat');
  }
  
  // Diabetes is assumed for all users
  constraints.push('diabetes-friendly (low GI, controlled carbs)');
  
  if (constraints.length > 0) {
    lines.push(`\nMust be: ${constraints.join(', ')}`);
  }
  
  // Add remaining allowances
  if (dailySummary && targets) {
    const remaining = calculateRemainingNutrients(dailySummary, targets);
    const carbsRemaining = remaining['carbs'];
    const sodiumRemaining = remaining['sodium'];
    
    if (carbsRemaining) {
      lines.push(`\nCarbs remaining today: ${carbsRemaining.remaining.toFixed(0)}g`);
    }
    if (sodiumRemaining && context.hasHypertension) {
      lines.push(`Sodium remaining today: ${sodiumRemaining.remaining.toFixed(0)}mg`);
    }
  }
  
  lines.push(`\nProvide 3 Malaysian food options with brief explanations of why they're suitable.`);
  
  return lines.join('\n');
}

// ============================================
// WARNING CONTEXT FOR DISPLAY
// ============================================

/**
 * Generate human-readable warning context
 */
export function generateWarningContext(
  warnings: NutrientWarning[],
  language: 'en' | 'ms' = 'en'
): string[] {
  return warnings.map(w => language === 'ms' ? w.messageMs || w.message : w.message);
}

// ============================================
// CONDITION-SPECIFIC TIPS
// ============================================

interface ConditionTip {
  condition: ConditionCode;
  tip: string;
  tipMs: string;
  icon: string;
}

/**
 * Get daily tips based on user's conditions
 */
export function getDailyTips(conditions: ConditionCode[]): ConditionTip[] {
  const tips: ConditionTip[] = [];
  
  if (conditions.includes('hypertension')) {
    tips.push({
      condition: 'hypertension',
      tip: 'Choose fresh foods over processed. Check labels for sodium - aim for under 2000mg daily.',
      tipMs: 'Pilih makanan segar berbanding yang diproses. Semak label untuk natrium - sasarkan bawah 2000mg sehari.',
      icon: 'heart-pulse',
    });
  }
  
  if (conditions.some(c => c.startsWith('ckd_'))) {
    tips.push({
      condition: 'ckd_stage3a',
      tip: 'Limit high-potassium foods like bananas, oranges, and potatoes. Boiling vegetables reduces potassium.',
      tipMs: 'Hadkan makanan tinggi kalium seperti pisang, oren, dan kentang. Merebus sayuran mengurangkan kalium.',
      icon: 'filter',
    });
  }
  
  if (conditions.includes('gout')) {
    tips.push({
      condition: 'gout',
      tip: 'Avoid organ meats, shellfish, and beer. Drink plenty of water to help flush uric acid.',
      tipMs: 'Elakkan organ dalaman, kerang, dan bir. Minum banyak air untuk membantu mengeluarkan asid urik.',
      icon: 'bone',
    });
  }
  
  if (conditions.includes('dyslipidemia')) {
    tips.push({
      condition: 'dyslipidemia',
      tip: 'Choose lean proteins and healthy fats (olive oil, nuts). Eat oats and beans for fiber that helps lower cholesterol.',
      tipMs: 'Pilih protein tanpa lemak dan lemak sihat (minyak zaitun, kacang). Makan oat dan kekacang untuk serat yang membantu menurunkan kolesterol.',
      icon: 'activity',
    });
  }
  
  return tips;
}


