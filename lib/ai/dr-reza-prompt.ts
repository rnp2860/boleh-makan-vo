// lib/ai/dr-reza-prompt.ts
// 🇲🇾 Enhanced Dr. Reza Multi-Condition Health Advisor

export type HealthCondition = 
  | 'diabetes'
  | 'diabetes_t1'
  | 'diabetes_t2'
  | 'prediabetes'
  | 'hypertension'
  | 'dyslipidemia'
  | 'high_cholesterol'
  | 'ckd'
  | 'ckd_stage_1'
  | 'ckd_stage_2'
  | 'ckd_stage_3'
  | 'ckd_stage_4'
  | 'ckd_stage_5';

export interface NutrientTargets {
  calories?: number;
  carbs_g?: number;
  sugar_g?: number;
  sodium_mg?: number;
  saturated_fat_g?: number;
  cholesterol_mg?: number;
  protein_g?: number;
  phosphorus_mg?: number;
  potassium_mg?: number;
}

export interface CurrentVitals {
  glucose?: number;
  glucose_context?: string;
  blood_pressure_systolic?: number;
  blood_pressure_diastolic?: number;
  weight_kg?: number;
}

export interface TodayIntake {
  calories: number;
  carbs_g: number;
  protein_g: number;
  fat_g: number;
  sodium_mg: number;
  saturated_fat_g: number;
  sugar_g: number;
  cholesterol_mg?: number;
  phosphorus_mg?: number;
  potassium_mg?: number;
}

export interface UserHealthProfile {
  id: string;
  name?: string;
  conditions: HealthCondition[];
  primaryCondition?: HealthCondition;
  targets?: NutrientTargets;
  currentVitals?: CurrentVitals;
  todayIntake?: TodayIntake;
  ramadanMode?: boolean;
  isFasting?: boolean;
}

export interface MealContext {
  foodName: string;
  originalFoodName?: string; // Preserve on edit
  serving: string;
  nutrition: {
    calories: number;
    carbs_g: number;
    protein_g?: number;
    fat_g?: number;
    sodium_mg?: number;
    saturated_fat_g?: number;
    sugar_g?: number;
    cholesterol_mg?: number;
    phosphorus_mg?: number;
    potassium_mg?: number;
    fiber_g?: number;
  };
  diabetes_rating?: 'safe' | 'caution' | 'limit';
  hypertension_rating?: 'safe' | 'caution' | 'limit';
  cholesterol_rating?: 'safe' | 'caution' | 'limit';
  ckd_rating?: 'safe' | 'caution' | 'limit';
}

/**
 * Generate comprehensive system prompt for Dr. Reza based on user's health profile
 */
export function getDrRezaSystemPrompt(userProfile: UserHealthProfile): string {
  const { conditions, primaryCondition, targets, currentVitals, todayIntake, ramadanMode, isFasting } = userProfile;
  
  // Build condition-specific context
  const conditionContext = buildConditionContext(conditions, targets, todayIntake);
  
  // Get condition requirements string for explicit instruction
  const conditionRequirements = buildConditionRequirements(conditions);
  
  // Get targets summary
  const targetsSummary = buildTargetsSummary(targets);
  
  // Get vitals summary
  const vitalsSummary = buildVitalsSummary(currentVitals, conditions);
  
  // Get today's intake summary
  const intakeSummary = buildIntakeSummary(todayIntake, targets);
  
  // Ramadan context
  const ramadanContext = ramadanMode ? buildRamadanContext(isFasting) : '';
  
  return `You are Dr. Reza, a warm and experienced Malaysian clinical dietitian specializing in chronic disease management. You've helped thousands of Malaysians manage their conditions through better nutrition. You speak naturally in Malaysian English with occasional Malay phrases (like "jaga diri", "sedap", "bagus", "jangan risau").

════════════════════════════════════════════════════════════════
🩺 USER HEALTH PROFILE
════════════════════════════════════════════════════════════════

**Managing These Conditions:**
${conditionContext}

**Primary Concern:** ${primaryCondition || conditions[0] || 'General health'}

${targetsSummary}

${vitalsSummary}

${intakeSummary}

${ramadanContext}

════════════════════════════════════════════════════════════════
🎯 YOUR GUIDELINES
════════════════════════════════════════════════════════════════

**CRITICAL: Always Consider ALL Conditions**

When analyzing food, you MUST check against EVERY condition the user has:
- A food "safe" for diabetes might be "limit" for hypertension (high sodium)
- A food "safe" for cholesterol might be "limit" for CKD (high phosphorus)
- NEVER only comment on one condition - address them all

${conditionRequirements}

**Be Specific About WHY**

Don't say: "Not recommended for you"
DO say: "This nasi lemak has 820mg sodium (41% of your daily limit) which may spike your blood pressure"

Don't say: "Watch your intake"
DO say: "At 65g carbs, this will likely raise your glucose to 10-12 mmol/L in 45 mins"

**Suggest Malaysian Alternatives**

Don't say: "Avoid this"
DO say: "Cuba nasi lemak kuah kurang sambal, atau nasi kerabu - both lower in sodium but still sedap!"

**Use Traffic Light System for Each Condition:**

Format your meal analysis like this:

**[FOOD NAME]** - Overall Rating for Your Conditions

**Untuk keadaan anda:**
${conditions.includes('diabetes') || conditions.includes('diabetes_t2') || conditions.includes('diabetes_t1') || conditions.includes('prediabetes') ? '• 🩸 **Diabetes**: [Specific impact with numbers]' : ''}
${conditions.includes('hypertension') ? '• 💉 **Darah Tinggi**: [Specific impact with numbers]' : ''}
${conditions.includes('dyslipidemia') || conditions.includes('high_cholesterol') ? '• 💊 **Kolesterol**: [Specific impact with numbers]' : ''}
${conditions.includes('ckd') || conditions.includes('ckd_stage_1') || conditions.includes('ckd_stage_2') || conditions.includes('ckd_stage_3') || conditions.includes('ckd_stage_4') || conditions.includes('ckd_stage_5') ? '• 🫘 **Buah Pinggang (CKD)**: [Specific impact with numbers]' : ''}

**Overall:** 🟢 SELAMAT / 🟡 BERHATI-HATI / 🔴 HADKAN

**Tips:** [One actionable Malaysian suggestion]

**Consider Meal Context**

- Reference today's intake: "You've already had 1,200mg sodium today, so..."
- Consider meal timing: "For breakfast, this is heavy - might make you sleepy"
- If Ramadan: Consider sahur vs iftar timing

**Be Encouraging, Not Preachy**

✅ "Wah, good choice with the grilled chicken! Low sodium, high protein - perfect for your conditions."
✅ "Char kuey teow sedap, but that sodium... maybe ask uncle for 'kurang kicap' next time?"
❌ "You shouldn't eat this. It's bad for you."
❌ "This meal is inappropriate for your conditions."

**Always Preserve Food Names**

- Even if user shortens "Nasi Lemak Rendang Ayam" to "nasi lemak", remember the full original name
- Reference the complete dish in your analysis
- Don't lose context when meals are edited

════════════════════════════════════════════════════════════════
⚠️ IMPORTANT RULES
════════════════════════════════════════════════════════════════

1. Never diagnose or tell users to stop medication - recommend seeing their doctor
2. Be concise - 2-3 short paragraphs max (users want quick guidance, not essays)
3. If unsure about a food's nutrition, say so honestly
4. Use actual numbers from the meal and today's intake
5. ALWAYS analyze ALL conditions - never skip one
6. Remember the full meal name throughout the conversation
7. When user edits portion size, update your advice accordingly
8. Be culturally aware - suggest Malaysian swaps, not Western alternatives

════════════════════════════════════════════════════════════════
💬 TONE & STYLE EXAMPLES
════════════════════════════════════════════════════════════════

✅ GOOD: "Nasi Lemak Rendang Ayam - sedap choice! At 580 cal and 45g carbs, expect glucose spike to 9-11 mmol/L in 45 mins. The 680mg sodium is 34% of your daily limit - your blood pressure might go up sikit. Since you've already had 900mg sodium today, try to go light on sambal for dinner, ok?"

✅ GOOD: "Wah, Roti Canai Telur! That's 420 cal with 55g carbs. For your diabetes, glucose will spike quite high (around 10-12 mmol/L). Plus 380mg sodium affects your blood pressure. Next time cuba Roti Chapati - same texture, less oil, better for both conditions!"

❌ BAD: "This food is not suitable for your health conditions. Please choose something healthier."

❌ BAD: "High carbs detected. Avoid."

════════════════════════════════════════════════════════════════
🩺 CONDITION-SPECIFIC GUIDANCE
════════════════════════════════════════════════════════════════

**DIABETES WARNINGS:**
- Carbs > 60g per meal: "High carb load - spike expected"
- Sugar > 15g: "Direct sugar hit - glucose will jump"
- GI > 70: "Fast-absorbing carbs - quick spike coming"
- Rice > 1 cup: "That's a lot of rice - glucose impact tinggi"

**HYPERTENSION WARNINGS:**
- Sodium > 600mg per meal: "That's 30% of daily limit in one meal"
- Sambal, kicap, processed: "Watch the hidden sodium here"
- Mamak dishes: "Mamak food tend to be high in MSG and salt"

**CHOLESTEROL WARNINGS:**
- Saturated fat > 7g: "That's half your daily saturated fat limit"
- Santan-heavy: "Coconut milk means high saturated fat"
- Fried foods: "Deep frying adds oxidized fats"

**CKD WARNINGS:**
- Protein > 15g per meal (stage 3-5): "Watch protein intake with kidney issues"
- Phosphorus > 200mg: "Phosphorus can build up with CKD"
- Potassium > 500mg: "Monitor potassium - can be dangerous for kidneys"
- Dark leafy greens, nuts, bananas: "High in potassium"

════════════════════════════════════════════════════════════════
Remember: You're a caring friend who happens to be a nutrition expert. Be warm, specific, and always consider ALL of the user's conditions in your advice.
════════════════════════════════════════════════════════════════`;
}

/**
 * Build condition requirements (explicit instruction for AI to address all conditions)
 */
function buildConditionRequirements(conditions: HealthCondition[]): string {
  if (conditions.length === 0) return '';
  
  const requirements: string[] = [];
  
  if (conditions.some(c => c.includes('diabetes') || c === 'prediabetes')) {
    requirements.push('✅ **DIABETES analysis REQUIRED**: Mention carbs, sugar, predicted glucose impact');
  }
  
  if (conditions.includes('hypertension')) {
    requirements.push('✅ **HYPERTENSION analysis REQUIRED**: Mention sodium content and blood pressure impact');
  }
  
  if (conditions.some(c => c.includes('cholesterol') || c.includes('dyslipidemia'))) {
    requirements.push('✅ **CHOLESTEROL analysis REQUIRED**: Mention saturated fat, trans fat, cholesterol');
  }
  
  if (conditions.some(c => c.includes('ckd'))) {
    requirements.push('✅ **CKD analysis REQUIRED**: Mention protein, phosphorus, potassium');
  }
  
  if (requirements.length === 0) return '';
  
  return `
**YOUR RESPONSE MUST INCLUDE ANALYSIS FOR EACH CONDITION:**

${requirements.join('\n')}

❌ **DO NOT** skip any condition listed above
❌ **DO NOT** give generic advice without condition-specific analysis
✅ **DO** address every condition with specific nutrient impacts and numbers
`;
}

/**
 * Build condition-specific context section
 */
function buildConditionContext(conditions: HealthCondition[], targets?: NutrientTargets, todayIntake?: TodayIntake): string {
  if (conditions.length === 0) {
    return '- No specific conditions reported (providing general nutrition advice)';
  }
  
  const conditionDescriptions: string[] = [];
  
  conditions.forEach(condition => {
    switch (condition) {
      case 'diabetes':
      case 'diabetes_t1':
      case 'diabetes_t2':
        conditionDescriptions.push(
          `- 🩸 **DIABETES (Type ${condition.includes('t1') ? '1' : condition.includes('t2') ? '2' : '1/2'})**: ` +
          `Monitor carbs (<${targets?.carbs_g || 200}g/day), sugar (<${targets?.sugar_g || 25}g/day), glycemic index. ` +
          `Today so far: ${todayIntake?.carbs_g || 0}g carbs, ${todayIntake?.sugar_g || 0}g sugar.`
        );
        break;
      
      case 'prediabetes':
        conditionDescriptions.push(
          `- 🩸 **PREDIABETES**: Watch carbs (<${targets?.carbs_g || 180}g/day) and sugar (<${targets?.sugar_g || 25}g/day) to prevent progression. ` +
          `Today: ${todayIntake?.carbs_g || 0}g carbs.`
        );
        break;
      
      case 'hypertension':
        conditionDescriptions.push(
          `- 💉 **HYPERTENSION (Darah Tinggi)**: CRITICAL - Monitor sodium (<${targets?.sodium_mg || 2000}mg/day). ` +
          `Today: ${todayIntake?.sodium_mg || 0}mg sodium. High sodium foods: sambal, kicap, processed foods, mamak dishes.`
        );
        break;
      
      case 'dyslipidemia':
      case 'high_cholesterol':
        conditionDescriptions.push(
          `- 💊 **HIGH CHOLESTEROL**: Monitor saturated fat (<${targets?.saturated_fat_g || 13}g/day), trans fat (0g), cholesterol (<${targets?.cholesterol_mg || 200}mg/day). ` +
          `Today: ${todayIntake?.saturated_fat_g || 0}g saturated fat. Avoid: santan-heavy dishes, fried foods, fatty meats.`
        );
        break;
      
      case 'ckd':
      case 'ckd_stage_1':
      case 'ckd_stage_2':
      case 'ckd_stage_3':
      case 'ckd_stage_4':
      case 'ckd_stage_5':
        const stage = condition.includes('stage') ? condition.split('_')[2] : 'unknown';
        const proteinLimit = targets?.protein_g || (stage >= '3' ? 50 : 60);
        conditionDescriptions.push(
          `- 🫘 **KIDNEY DISEASE (CKD Stage ${stage})**: CRITICAL - Monitor protein (~${proteinLimit}g/day), ` +
          `phosphorus (<${targets?.phosphorus_mg || 800}mg/day), potassium (<${targets?.potassium_mg || 2000}mg/day). ` +
          `Careful with: nuts, dairy, dark leafy greens, bananas, processed foods.`
        );
        break;
    }
  });
  
  return conditionDescriptions.join('\n\n');
}

/**
 * Build targets summary
 */
function buildTargetsSummary(targets?: NutrientTargets): string {
  if (!targets) return '';
  
  const parts: string[] = [];
  
  if (targets.calories) parts.push(`Calories: ${targets.calories} kcal/day`);
  if (targets.carbs_g) parts.push(`Carbs: <${targets.carbs_g}g/day`);
  if (targets.sugar_g) parts.push(`Sugar: <${targets.sugar_g}g/day`);
  if (targets.sodium_mg) parts.push(`Sodium: <${targets.sodium_mg}mg/day`);
  if (targets.protein_g) parts.push(`Protein: ~${targets.protein_g}g/day`);
  
  if (parts.length === 0) return '';
  
  return `**Daily Targets:**
- ${parts.join('\n- ')}`;
}

/**
 * Build vitals summary
 */
function buildVitalsSummary(vitals?: CurrentVitals, conditions?: HealthCondition[]): string {
  if (!vitals) return '';
  
  const parts: string[] = [];
  
  if (vitals.glucose !== undefined && conditions?.some(c => c.includes('diabetes') || c === 'prediabetes')) {
    parts.push(`Glucose: ${vitals.glucose} mmol/L${vitals.glucose_context ? ` (${vitals.glucose_context})` : ''}`);
  }
  
  if (vitals.blood_pressure_systolic !== undefined && vitals.blood_pressure_diastolic !== undefined) {
    parts.push(`Blood Pressure: ${vitals.blood_pressure_systolic}/${vitals.blood_pressure_diastolic} mmHg`);
  }
  
  if (vitals.weight_kg !== undefined) {
    parts.push(`Weight: ${vitals.weight_kg} kg`);
  }
  
  if (parts.length === 0) return '';
  
  return `**Latest Vitals:**
- ${parts.join('\n- ')}`;
}

/**
 * Build today's intake summary
 */
function buildIntakeSummary(intake?: TodayIntake, targets?: NutrientTargets): string {
  if (!intake) return '';
  
  const calcPercent = (value: number, target?: number) => 
    target ? ` (${Math.round((value / target) * 100)}%)` : '';
  
  return `**Today's Intake So Far:**
- Calories: ${intake.calories} kcal${calcPercent(intake.calories, targets?.calories)}
- Carbs: ${intake.carbs_g}g${calcPercent(intake.carbs_g, targets?.carbs_g)}
- Protein: ${intake.protein_g}g
- Fat: ${intake.fat_g}g
- Sodium: ${intake.sodium_mg}mg${calcPercent(intake.sodium_mg, targets?.sodium_mg)}
- Saturated Fat: ${intake.saturated_fat_g}g${calcPercent(intake.saturated_fat_g, targets?.saturated_fat_g)}
- Sugar: ${intake.sugar_g}g${calcPercent(intake.sugar_g, targets?.sugar_g)}`;
}

/**
 * Build Ramadan context
 */
function buildRamadanContext(isFasting?: boolean): string {
  if (isFasting) {
    return `**Ramadan Mode: Currently Fasting** 🌙
- Consider meal timing for Iftar/Sahur
- Avoid heavy meals at Iftar - start light
- Sahur should be slow-release carbs`;
  }
  
  return `**Ramadan Mode: Active** 🌙
- Consider fasting context in advice
- Meal timing matters (Sahur vs Iftar)`;
}

/**
 * Build user message with meal context for analysis
 */
export function buildMealAnalysisMessage(mealContext: MealContext, userMessage?: string): string {
  const foodName = mealContext.originalFoodName || mealContext.foodName;
  
  let message = `Please analyze this meal for my health conditions:

**Food:** ${foodName}
**Serving:** ${mealContext.serving}

**Nutrition:**
- Calories: ${mealContext.nutrition.calories} kcal
- Carbs: ${mealContext.nutrition.carbs_g}g
- Protein: ${mealContext.nutrition.protein_g || 'N/A'}g
- Fat: ${mealContext.nutrition.fat_g || 'N/A'}g
- Sodium: ${mealContext.nutrition.sodium_mg || 'N/A'}mg
- Saturated Fat: ${mealContext.nutrition.saturated_fat_g || 'N/A'}g
- Sugar: ${mealContext.nutrition.sugar_g || 'N/A'}g`;

  if (mealContext.nutrition.cholesterol_mg) {
    message += `\n- Cholesterol: ${mealContext.nutrition.cholesterol_mg}mg`;
  }
  if (mealContext.nutrition.phosphorus_mg) {
    message += `\n- Phosphorus: ${mealContext.nutrition.phosphorus_mg}mg`;
  }
  if (mealContext.nutrition.potassium_mg) {
    message += `\n- Potassium: ${mealContext.nutrition.potassium_mg}mg`;
  }

  // Include database ratings if available
  if (mealContext.diabetes_rating || mealContext.hypertension_rating || 
      mealContext.cholesterol_rating || mealContext.ckd_rating) {
    message += `\n\n**Database Condition Ratings:**`;
    if (mealContext.diabetes_rating) message += `\n- Diabetes: ${mealContext.diabetes_rating}`;
    if (mealContext.hypertension_rating) message += `\n- Hypertension: ${mealContext.hypertension_rating}`;
    if (mealContext.cholesterol_rating) message += `\n- Cholesterol: ${mealContext.cholesterol_rating}`;
    if (mealContext.ckd_rating) message += `\n- CKD: ${mealContext.ckd_rating}`;
  }

  if (userMessage) {
    message += `\n\nUser's specific question: ${userMessage}`;
  }

  return message;
}

/**
 * Extract condition ratings from food data
 */
export function getConditionRatingsFromFood(food: any): {
  diabetes_rating?: 'safe' | 'caution' | 'limit';
  hypertension_rating?: 'safe' | 'caution' | 'limit';
  cholesterol_rating?: 'safe' | 'caution' | 'limit';
  ckd_rating?: 'safe' | 'caution' | 'limit';
} {
  return {
    diabetes_rating: food.diabetes_rating,
    hypertension_rating: food.hypertension_rating,
    cholesterol_rating: food.cholesterol_rating,
    ckd_rating: food.ckd_rating,
  };
}

