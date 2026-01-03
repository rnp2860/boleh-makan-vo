// lib/user/health-profile.ts
// 🩺 User Health Profile Helpers for Dr. Reza

import { getSupabaseClient } from '@/lib/supabase';
import type { UserHealthProfile, TodayIntake, HealthCondition } from '@/lib/ai/dr-reza-prompt';

/**
 * Get complete user health profile for Dr. Reza
 */
export async function getUserHealthProfile(userId: string): Promise<UserHealthProfile> {
  const supabase = getSupabaseClient();
  
  try {
    // Fetch user profile with conditions and targets
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select(`
        user_id,
        name,
        health_conditions,
        daily_targets,
        ramadan_mode_active
      `)
      .eq('user_id', userId)
      .single();
    
    if (error || !profile) {
      console.error('Error fetching user profile:', error);
      return getDefaultHealthProfile(userId);
    }
    
    // Fetch latest vitals
    const vitals = await getLatestVitals(userId);
    
    return {
      id: userId,
      name: profile.name,
      conditions: (profile.health_conditions || []) as HealthCondition[],
      primaryCondition: profile.health_conditions?.[0] as HealthCondition,
      targets: {
        calories: profile.daily_targets?.calories,
        carbs_g: profile.daily_targets?.carbs_g,
        sugar_g: profile.daily_targets?.sugar_g,
        sodium_mg: profile.daily_targets?.sodium_mg,
        saturated_fat_g: profile.daily_targets?.saturated_fat_g,
        cholesterol_mg: profile.daily_targets?.cholesterol_mg,
        protein_g: profile.daily_targets?.protein_g,
        phosphorus_mg: profile.daily_targets?.phosphorus_mg,
        potassium_mg: profile.daily_targets?.potassium_mg,
      },
      currentVitals: vitals,
      ramadanMode: profile.ramadan_mode_active || false,
      isFasting: profile.ramadan_mode_active ? await checkIfCurrentlyFasting(userId) : false,
    };
  } catch (error) {
    console.error('Error getting health profile:', error);
    return getDefaultHealthProfile(userId);
  }
}

/**
 * Get today's nutritional intake
 */
export async function getTodayIntake(userId: string): Promise<TodayIntake> {
  const supabase = getSupabaseClient();
  const today = new Date().toISOString().split('T')[0];
  
  try {
    const { data: meals, error } = await supabase
      .from('food_logs')
      .select('calories, carbs, protein, fat, sodium, sugar')
      .eq('user_id', userId)
      .gte('logged_at', `${today}T00:00:00`)
      .lte('logged_at', `${today}T23:59:59`);
    
    if (error || !meals || meals.length === 0) {
      return {
        calories: 0,
        carbs_g: 0,
        protein_g: 0,
        fat_g: 0,
        sodium_mg: 0,
        saturated_fat_g: 0,
        sugar_g: 0,
      };
    }
    
    // Sum up all meals
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + (meal.calories || 0),
      carbs_g: acc.carbs_g + (meal.carbs || 0),
      protein_g: acc.protein_g + (meal.protein || 0),
      fat_g: acc.fat_g + (meal.fat || 0),
      sodium_mg: acc.sodium_mg + (meal.sodium || 0),
      saturated_fat_g: acc.saturated_fat_g, // TODO: Add to food_logs table
      sugar_g: acc.sugar_g + (meal.sugar || 0),
    }), {
      calories: 0,
      carbs_g: 0,
      protein_g: 0,
      fat_g: 0,
      sodium_mg: 0,
      saturated_fat_g: 0,
      sugar_g: 0,
    });
  } catch (error) {
    console.error('Error getting today intake:', error);
    return {
      calories: 0,
      carbs_g: 0,
      protein_g: 0,
      fat_g: 0,
      sodium_mg: 0,
      saturated_fat_g: 0,
      sugar_g: 0,
    };
  }
}

/**
 * Get latest vitals for user
 */
async function getLatestVitals(userId: string) {
  const supabase = getSupabaseClient();
  
  try {
    // Get latest glucose
    const { data: glucoseData } = await supabase
      .from('user_vitals')
      .select('reading_value, context_tag')
      .eq('user_id', userId)
      .eq('vital_type', 'glucose')
      .order('measured_at', { ascending: false })
      .limit(1)
      .single();
    
    // Get latest blood pressure
    const { data: bpData } = await supabase
      .from('user_vitals')
      .select('reading_value, reading_value_secondary')
      .eq('user_id', userId)
      .eq('vital_type', 'blood_pressure')
      .order('measured_at', { ascending: false })
      .limit(1)
      .single();
    
    // Get latest weight
    const { data: weightData } = await supabase
      .from('user_vitals')
      .select('reading_value')
      .eq('user_id', userId)
      .eq('vital_type', 'weight')
      .order('measured_at', { ascending: false })
      .limit(1)
      .single();
    
    return {
      glucose: glucoseData?.reading_value,
      glucose_context: glucoseData?.context_tag,
      blood_pressure_systolic: bpData?.reading_value,
      blood_pressure_diastolic: bpData?.reading_value_secondary,
      weight_kg: weightData?.reading_value,
    };
  } catch (error) {
    console.error('Error fetching vitals:', error);
    return undefined;
  }
}

/**
 * Check if user is currently fasting (Ramadan mode)
 */
async function checkIfCurrentlyFasting(userId: string): Promise<boolean> {
  // TODO: Implement based on prayer times and user's fasting schedule
  // For now, simple time-based check (assuming standard Malaysian hours)
  const hour = new Date().getHours();
  
  // Typical fasting hours: 5:30 AM to 7:15 PM
  return hour >= 5 && hour < 19;
}

/**
 * Default health profile when data is unavailable
 */
function getDefaultHealthProfile(userId: string): UserHealthProfile {
  return {
    id: userId,
    conditions: [],
    targets: {
      calories: 2000,
      carbs_g: 200,
      sugar_g: 25,
      sodium_mg: 2300,
      saturated_fat_g: 13,
      cholesterol_mg: 300,
      protein_g: 60,
    },
    todayIntake: {
      calories: 0,
      carbs_g: 0,
      protein_g: 0,
      fat_g: 0,
      sodium_mg: 0,
      saturated_fat_g: 0,
      sugar_g: 0,
    },
    ramadanMode: false,
    isFasting: false,
  };
}

/**
 * Get user's health conditions only (quick fetch)
 */
export async function getUserConditions(userId: string): Promise<HealthCondition[]> {
  const supabase = getSupabaseClient();
  
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('health_conditions')
      .eq('user_id', userId)
      .single();
    
    if (error || !data) {
      return [];
    }
    
    return (data.health_conditions || []) as HealthCondition[];
  } catch (error) {
    console.error('Error getting user conditions:', error);
    return [];
  }
}

/**
 * Update user's health conditions
 */
export async function updateUserConditions(userId: string, conditions: HealthCondition[]): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ health_conditions: conditions })
      .eq('user_id', userId);
    
    return !error;
  } catch (error) {
    console.error('Error updating user conditions:', error);
    return false;
  }
}

/**
 * Update user's nutrient targets
 */
export async function updateNutrientTargets(userId: string, targets: Record<string, number>): Promise<boolean> {
  const supabase = getSupabaseClient();
  
  try {
    const { error } = await supabase
      .from('user_profiles')
      .update({ daily_targets: targets })
      .eq('user_id', userId);
    
    return !error;
  } catch (error) {
    console.error('Error updating nutrient targets:', error);
    return false;
  }
}

