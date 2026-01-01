// lib/calculateBolehScore.ts
// 🎯 BOLEH SCORE CALCULATION ENGINE
// Calculates a daily health score (0-100) based on food logs and vitals

import { createClient } from '@supabase/supabase-js';
import { MealContext, PreparationStyle } from '@/types/database';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

// ============================================
// TYPES
// ============================================

export interface ScoreBreakdown {
  baseScore: number;
  consistencyBonus: number;
  contextPenalty: number;
  prepPenalty: number;
  sugarPenalty: number;
  medicalPenalty: number;
  medicalBonus: number;
  healthyBonus: number;
  finalScore: number;
}

export interface ScoreResult {
  score: number;
  breakdown: ScoreBreakdown;
  insights: string[];
  mealCount: number;
  vitalsCount: number;
  date: string;
}

export interface FoodLogRow {
  id: string;
  user_id: string;
  meal_name: string;
  calories: number;
  meal_context: MealContext | null;
  preparation_style: PreparationStyle | null;
  sugar_source_detected: boolean | null;
  created_at: string;
}

export interface VitalRow {
  id: string;
  user_id: string;
  vital_type: string;
  reading_value: number;
  unit: string;
  context_tag: string;
  measured_at: string;
}

// ============================================
// SCORING CONSTANTS
// ============================================

const SCORING = {
  BASE_SCORE: 70,
  
  // Bonuses
  CONSISTENCY_PER_MEAL: 2,
  CONSISTENCY_MAX: 10,
  HEALTHY_PREP_BONUS: 5,
  GOOD_GLUCOSE_BONUS: 5,
  
  // Penalties
  UNHEALTHY_CONTEXT_PENALTY: 3,
  DEEP_FRIED_PENALTY: 3,
  SUGAR_DETECTED_PENALTY: 5,
  HIGH_GLUCOSE_PENALTY: 10,
  HIGH_BP_PENALTY: 10,
  
  // Thresholds
  GLUCOSE_HIGH: 8.0,
  GLUCOSE_GOOD_MIN: 4.0,
  GLUCOSE_GOOD_MAX: 7.0,
  BP_SYSTOLIC_HIGH: 130,
  BP_DIASTOLIC_HIGH: 80,
  
  // Healthy preparation styles
  HEALTHY_PREPS: ['steamed', 'raw_fresh', 'soup_boiled'] as PreparationStyle[],
  
  // Unhealthy contexts
  UNHEALTHY_CONTEXTS: ['hawker_stall', 'fast_food'] as MealContext[],
};

// ============================================
// MAIN SCORING FUNCTION
// ============================================

export async function calculateDailyScore(
  userId: string,
  date: Date = new Date()
): Promise<ScoreResult> {
  const insights: string[] = [];
  
  // Get start and end of the target day
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  
  const dateString = date.toISOString().split('T')[0];

  // ── FETCH FOOD LOGS ──
  const { data: foodLogs, error: foodError } = await supabase
    .from('food_logs')
    .select('*')
    .eq('user_id', userId)
    .gte('created_at', startOfDay.toISOString())
    .lte('created_at', endOfDay.toISOString());

  if (foodError) {
    console.error('Error fetching food logs:', foodError);
  }

  const meals: FoodLogRow[] = foodLogs || [];

  // ── FETCH VITALS ──
  const { data: vitals, error: vitalsError } = await supabase
    .from('user_vitals')
    .select('*')
    .eq('user_id', userId)
    .gte('measured_at', startOfDay.toISOString())
    .lte('measured_at', endOfDay.toISOString());

  if (vitalsError) {
    console.error('Error fetching vitals:', vitalsError);
  }

  const vitalReadings: VitalRow[] = vitals || [];

  // ── INITIALIZE BREAKDOWN ──
  const breakdown: ScoreBreakdown = {
    baseScore: SCORING.BASE_SCORE,
    consistencyBonus: 0,
    contextPenalty: 0,
    prepPenalty: 0,
    sugarPenalty: 0,
    medicalPenalty: 0,
    medicalBonus: 0,
    healthyBonus: 0,
    finalScore: 0,
  };

  // ══════════════════════════════════════════
  // CALCULATE FOOD-BASED SCORES
  // ══════════════════════════════════════════

  if (meals.length > 0) {
    // ── CONSISTENCY BONUS ──
    // +2 points per meal, max +10
    breakdown.consistencyBonus = Math.min(
      meals.length * SCORING.CONSISTENCY_PER_MEAL,
      SCORING.CONSISTENCY_MAX
    );
    
    if (meals.length >= 3) {
      insights.push(`Great consistency! ${meals.length} meals logged today.`);
    }

    // ── CONTEXT PENALTY ──
    // -3 points for each hawker_stall or fast_food meal
    const unhealthyContextMeals = meals.filter(
      m => m.meal_context && SCORING.UNHEALTHY_CONTEXTS.includes(m.meal_context as MealContext)
    );
    
    if (unhealthyContextMeals.length > 0) {
      breakdown.contextPenalty = unhealthyContextMeals.length * SCORING.UNHEALTHY_CONTEXT_PENALTY;
      const contextTypes = unhealthyContextMeals.map(m => 
        m.meal_context === 'fast_food' ? 'fast food' : 'hawker'
      );
      insights.push(`-${breakdown.contextPenalty} pts: ${unhealthyContextMeals.length} ${contextTypes[0]} meal(s)`);
    }

    // ── PREP PENALTY ──
    // -3 points for each deep_fried meal
    const deepFriedMeals = meals.filter(m => m.preparation_style === 'deep_fried');
    
    if (deepFriedMeals.length > 0) {
      breakdown.prepPenalty = deepFriedMeals.length * SCORING.DEEP_FRIED_PENALTY;
      insights.push(`-${breakdown.prepPenalty} pts: ${deepFriedMeals.length} deep-fried item(s)`);
    }

    // ── SUGAR PENALTY ──
    // -5 points if ANY item has sugar_source_detected = true
    const sugarDetectedMeals = meals.filter(m => m.sugar_source_detected === true);
    
    if (sugarDetectedMeals.length > 0) {
      breakdown.sugarPenalty = SCORING.SUGAR_DETECTED_PENALTY;
      const sugarItems = sugarDetectedMeals.map(m => m.meal_name).slice(0, 2);
      insights.push(`-${breakdown.sugarPenalty} pts: High sugar detected (${sugarItems.join(', ')})`);
    }

    // ── HEALTHY PREP BONUS ──
    // +5 points for steamed, raw_fresh, or soup_boiled meals
    const healthyPrepMeals = meals.filter(
      m => m.preparation_style && SCORING.HEALTHY_PREPS.includes(m.preparation_style as PreparationStyle)
    );
    
    if (healthyPrepMeals.length > 0) {
      breakdown.healthyBonus = SCORING.HEALTHY_PREP_BONUS;
      insights.push(`+${breakdown.healthyBonus} pts: Healthy cooking method detected!`);
    }
  } else {
    insights.push('No meals logged today. Start tracking to improve your score!');
  }

  // ══════════════════════════════════════════
  // CALCULATE VITALS-BASED SCORES
  // ══════════════════════════════════════════

  if (vitalReadings.length > 0) {
    // ── GLUCOSE ANALYSIS ──
    const glucoseReadings = vitalReadings.filter(v => v.vital_type === 'glucose');
    
    for (const reading of glucoseReadings) {
      const value = reading.reading_value;
      
      // High glucose penalty
      if (value > SCORING.GLUCOSE_HIGH) {
        breakdown.medicalPenalty += SCORING.HIGH_GLUCOSE_PENALTY;
        insights.push(`-${SCORING.HIGH_GLUCOSE_PENALTY} pts: Glucose ${value} mmol/L is high (>${SCORING.GLUCOSE_HIGH})`);
      }
      // Good glucose bonus
      else if (value >= SCORING.GLUCOSE_GOOD_MIN && value <= SCORING.GLUCOSE_GOOD_MAX) {
        breakdown.medicalBonus += SCORING.GOOD_GLUCOSE_BONUS;
        insights.push(`+${SCORING.GOOD_GLUCOSE_BONUS} pts: Glucose ${value} mmol/L is in healthy range!`);
      }
    }

    // ── BLOOD PRESSURE ANALYSIS ──
    const bpSystolicReadings = vitalReadings.filter(v => v.vital_type === 'bp_systolic');
    const bpDiastolicReadings = vitalReadings.filter(v => v.vital_type === 'bp_diastolic');
    
    // Check systolic
    for (const reading of bpSystolicReadings) {
      if (reading.reading_value > SCORING.BP_SYSTOLIC_HIGH) {
        breakdown.medicalPenalty += SCORING.HIGH_BP_PENALTY;
        insights.push(`-${SCORING.HIGH_BP_PENALTY} pts: Systolic BP ${reading.reading_value} mmHg is elevated`);
      }
    }
    
    // Check diastolic
    for (const reading of bpDiastolicReadings) {
      if (reading.reading_value > SCORING.BP_DIASTOLIC_HIGH) {
        breakdown.medicalPenalty += SCORING.HIGH_BP_PENALTY;
        insights.push(`-${SCORING.HIGH_BP_PENALTY} pts: Diastolic BP ${reading.reading_value} mmHg is elevated`);
      }
    }
  }

  // ══════════════════════════════════════════
  // CALCULATE FINAL SCORE
  // ══════════════════════════════════════════

  let finalScore = breakdown.baseScore
    + breakdown.consistencyBonus
    + breakdown.healthyBonus
    + breakdown.medicalBonus
    - breakdown.contextPenalty
    - breakdown.prepPenalty
    - breakdown.sugarPenalty
    - breakdown.medicalPenalty;

  // Clamp between 0 and 100
  finalScore = Math.max(0, Math.min(100, finalScore));
  breakdown.finalScore = Math.round(finalScore);

  // Add summary insight
  if (breakdown.finalScore >= 85) {
    insights.unshift('🌟 Excellent day! Keep up the great work!');
  } else if (breakdown.finalScore >= 70) {
    insights.unshift('👍 Good day! Room for improvement.');
  } else if (breakdown.finalScore >= 50) {
    insights.unshift('⚠️ Below average. Consider healthier choices.');
  } else {
    insights.unshift('❌ Poor score. Focus on meal quality and vitals.');
  }

  return {
    score: breakdown.finalScore,
    breakdown,
    insights,
    mealCount: meals.length,
    vitalsCount: vitalReadings.length,
    date: dateString,
  };
}

// ============================================
// HELPER: Get score label/grade
// ============================================

export function getScoreGrade(score: number): { 
  grade: string; 
  label: string; 
  color: string;
  emoji: string;
} {
  if (score >= 90) return { grade: 'A+', label: 'Excellent', color: 'emerald', emoji: '🌟' };
  if (score >= 80) return { grade: 'A', label: 'Great', color: 'green', emoji: '💚' };
  if (score >= 70) return { grade: 'B', label: 'Good', color: 'teal', emoji: '👍' };
  if (score >= 60) return { grade: 'C', label: 'Fair', color: 'yellow', emoji: '😐' };
  if (score >= 50) return { grade: 'D', label: 'Needs Work', color: 'orange', emoji: '⚠️' };
  return { grade: 'F', label: 'Poor', color: 'red', emoji: '❌' };
}

// ============================================
// HELPER: Get weekly trend
// ============================================

export async function getWeeklyScores(userId: string): Promise<{ day: string; score: number }[]> {
  const scores: { day: string; score: number }[] = [];
  
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    try {
      const result = await calculateDailyScore(userId, date);
      scores.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        score: result.score,
      });
    } catch (error) {
      console.error(`Error calculating score for day -${i}:`, error);
      scores.push({
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        score: 70, // Default base score
      });
    }
  }
  
  return scores;
}

