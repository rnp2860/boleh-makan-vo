// lib/dailyContextHelper.ts
// 🗓️ Helper to fetch user's daily nutrition context for Dr. Reza

import { getSupabaseClient } from './supabase';
import { DailyContext, getDefaultDailyContext } from './advisorPrompts';

/**
 * Fetch user's daily context for Dr. Reza's personalized advice
 * This includes today's meals, user targets, and recent glucose readings
 */
export async function getDailyContext(userId: string, date?: string): Promise<DailyContext> {
  const supabase = getSupabaseClient();
  const targetDate = date || new Date().toISOString().split('T')[0];

  try {
    // Run all queries in parallel for speed
    const [mealsResult, profileResult, glucoseResult, weeklyGlucoseResult] = await Promise.all([
      // 1. Get today's meals
      supabase
        .from('food_logs')
        .select('calories, protein, carbs, fat, sugar, sodium, meal_type, created_at')
        .eq('user_id', userId)
        .gte('created_at', `${targetDate}T00:00:00`)
        .lte('created_at', `${targetDate}T23:59:59`),
      
      // 2. Get user's profile and targets
      supabase
        .from('user_profiles')
        .select('daily_targets, health_conditions, goal')
        .eq('user_id', userId)
        .single(),
      
      // 3. Get latest glucose reading
      supabase
        .from('user_vitals')
        .select('reading_value, context_tag, measured_at')
        .eq('user_id', userId)
        .eq('vital_type', 'glucose')
        .order('measured_at', { ascending: false })
        .limit(1)
        .single(),
      
      // 4. Get weekly glucose average
      supabase
        .from('user_vitals')
        .select('reading_value')
        .eq('user_id', userId)
        .eq('vital_type', 'glucose')
        .gte('measured_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
    ]);

    // Process today's meals
    const todaysMeals = mealsResult.data || [];
    const totals = todaysMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      sugar: acc.sugar + (meal.sugar || 0),
      sodium: acc.sodium + (meal.sodium || 0),
      protein: acc.protein + (meal.protein || 0),
      fat: acc.fat + (meal.fat || 0),
      count: acc.count + 1
    }), { calories: 0, carbs: 0, sugar: 0, sodium: 0, protein: 0, fat: 0, count: 0 });

    // Process user profile/targets
    const profile = profileResult.data;
    const dailyTargets = profile?.daily_targets || {};
    
    // Calculate default calorie target based on goal if not set
    let calorieTarget = dailyTargets.calories || 2000;
    if (!dailyTargets.calories && profile?.goal) {
      switch (profile.goal) {
        case 'lose_weight':
          calorieTarget = 1600;
          break;
        case 'build_muscle':
          calorieTarget = 2400;
          break;
        case 'maintain':
        default:
          calorieTarget = 2000;
      }
    }

    // Process glucose data
    const latestGlucose = glucoseResult.data;
    const weeklyGlucoseReadings = weeklyGlucoseResult.data || [];
    
    // Calculate weekly average
    let avgGlucose: number | null = null;
    if (weeklyGlucoseReadings.length > 0) {
      const sum = weeklyGlucoseReadings.reduce((acc, r) => acc + (r.reading_value || 0), 0);
      avgGlucose = Math.round((sum / weeklyGlucoseReadings.length) * 10) / 10;
    }

    return {
      daily_calories_before: totals.calories,
      daily_carbs_before: totals.carbs,
      daily_sugar_before: totals.sugar,
      daily_sodium_before: totals.sodium,
      daily_protein_before: totals.protein,
      daily_fat_before: totals.fat,
      meals_today: totals.count,
      daily_target: calorieTarget,
      sodium_limit: dailyTargets.sodium_mg || 2300,
      sugar_limit: dailyTargets.sugar_g || 30,
      health_conditions: profile?.health_conditions || [],
      last_glucose: latestGlucose?.reading_value || null,
      glucose_context: latestGlucose?.context_tag || null,
      avg_glucose: avgGlucose
    };

  } catch (error) {
    console.error('Error fetching daily context:', error);
    return getDefaultDailyContext();
  }
}

/**
 * Quick context fetch (no glucose data) - for faster response times
 */
export async function getQuickDailyContext(userId: string): Promise<DailyContext> {
  const supabase = getSupabaseClient();
  const today = new Date().toISOString().split('T')[0];

  try {
    // Just get today's meals and profile (skip glucose for speed)
    const [mealsResult, profileResult] = await Promise.all([
      supabase
        .from('food_logs')
        .select('calories, protein, carbs, fat, sugar, sodium')
        .eq('user_id', userId)
        .gte('created_at', `${today}T00:00:00`)
        .lte('created_at', `${today}T23:59:59`),
      
      supabase
        .from('user_profiles')
        .select('daily_targets, health_conditions')
        .eq('user_id', userId)
        .single()
    ]);

    const todaysMeals = mealsResult.data || [];
    const totals = todaysMeals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      sugar: acc.sugar + (meal.sugar || 0),
      sodium: acc.sodium + (meal.sodium || 0),
      protein: acc.protein + (meal.protein || 0),
      fat: acc.fat + (meal.fat || 0),
      count: acc.count + 1
    }), { calories: 0, carbs: 0, sugar: 0, sodium: 0, protein: 0, fat: 0, count: 0 });

    const profile = profileResult.data;
    const dailyTargets = profile?.daily_targets || {};

    return {
      daily_calories_before: totals.calories,
      daily_carbs_before: totals.carbs,
      daily_sugar_before: totals.sugar,
      daily_sodium_before: totals.sodium,
      daily_protein_before: totals.protein,
      daily_fat_before: totals.fat,
      meals_today: totals.count,
      daily_target: dailyTargets.calories || 2000,
      sodium_limit: dailyTargets.sodium_mg || 2300,
      sugar_limit: dailyTargets.sugar_g || 30,
      health_conditions: profile?.health_conditions || [],
      last_glucose: null,
      glucose_context: null,
      avg_glucose: null
    };

  } catch (error) {
    console.error('Error fetching quick daily context:', error);
    return getDefaultDailyContext();
  }
}

/**
 * Get calorie budget status message
 */
export function getCalorieBudgetMessage(
  caloriesBefore: number, 
  mealCalories: number, 
  dailyTarget: number
): string {
  const caloriesAfter = caloriesBefore + mealCalories;
  const remaining = dailyTarget - caloriesAfter;
  const percentUsed = Math.round((caloriesAfter / dailyTarget) * 100);

  if (remaining > 600) {
    return `You have ${remaining} cal left for the day - plenty of room!`;
  } else if (remaining > 300) {
    return `${remaining} cal remaining - a light meal would fit perfectly.`;
  } else if (remaining > 0) {
    return `Only ${remaining} cal left today - go easy for the rest.`;
  } else {
    return `You're ${Math.abs(remaining)} cal over target - extra walk might help!`;
  }
}

/**
 * Determine concern flags based on daily totals
 */
export function getConcernFlags(
  context: DailyContext, 
  mealData: { sugar: number; sodium: number; calories: number }
): string[] {
  const flags: string[] = [];
  
  const totalSugar = context.daily_sugar_before + mealData.sugar;
  const totalSodium = context.daily_sodium_before + mealData.sodium;
  const totalCalories = context.daily_calories_before + mealData.calories;
  
  if (totalSugar > context.sugar_limit) {
    flags.push('sugar');
  }
  if (totalSodium > context.sodium_limit) {
    flags.push('sodium');
  }
  if (totalCalories > context.daily_target * 1.1) { // 10% buffer
    flags.push('calories');
  }
  
  return flags;
}

/**
 * Predict glucose impact based on food characteristics
 */
export function predictGlucoseImpact(
  foodName: string,
  carbs: number,
  sugar: number,
  category: string
): { impact: 'low' | 'moderate' | 'high' | 'very_high'; peakTime: string; reason: string } {
  const lowerName = foodName.toLowerCase();
  
  // Very high impact foods
  const veryHighImpact = [
    'teh tarik', 'milo', 'sirap', 'cendol', 'ais kacang', 
    'kuih', 'roti canai', 'naan', 'white rice', 'nasi putih'
  ];
  
  // High impact foods
  const highImpact = [
    'nasi lemak', 'char kuey teow', 'mee goreng', 'nasi kandar',
    'fried rice', 'nasi goreng', 'laksa', 'mee rebus'
  ];
  
  // Check by name first
  if (veryHighImpact.some(food => lowerName.includes(food))) {
    return {
      impact: 'very_high',
      peakTime: '30-45 mins',
      reason: 'High refined carbs/sugar - expect significant glucose spike'
    };
  }
  
  if (highImpact.some(food => lowerName.includes(food))) {
    return {
      impact: 'high',
      peakTime: '45-60 mins',
      reason: 'Rice/noodle-heavy meal - moderate to high glucose spike expected'
    };
  }
  
  // Check by macros
  if (sugar > 20 || (carbs > 60 && category !== 'Protein')) {
    return {
      impact: 'high',
      peakTime: '45-60 mins',
      reason: 'High carb content - glucose will rise'
    };
  }
  
  if (carbs > 40 || sugar > 10) {
    return {
      impact: 'moderate',
      peakTime: '60-90 mins',
      reason: 'Moderate carbs - gradual glucose rise expected'
    };
  }
  
  return {
    impact: 'low',
    peakTime: '60-120 mins',
    reason: 'Low carb/protein-focused - minimal glucose impact'
  };
}

