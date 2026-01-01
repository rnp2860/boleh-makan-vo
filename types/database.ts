// types/database.ts
// Database types for Supabase tables

// ============================================
// FOOD LOGS TABLE
// ============================================

export type MealContext = 
  | 'home_cooked' 
  | 'hawker_stall' 
  | 'restaurant' 
  | 'fast_food' 
  | 'office_canteen' 
  | 'unknown';

export type PreparationStyle = 
  | 'deep_fried' 
  | 'stir_fried' 
  | 'steamed' 
  | 'soup_boiled' 
  | 'gravy_curry' 
  | 'raw_fresh' 
  | 'grilled' 
  | 'unknown';

export interface FoodLog {
  id: string;
  user_id: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number | null;
  sugar: number | null;
  portion_size: number;
  image_url: string | null;
  components: string[] | null;
  analysis_data: string | null;
  meal_type: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Other';
  created_at: string;
  
  // New Enterprise columns
  meal_context: MealContext;
  preparation_style: PreparationStyle;
  sugar_source_detected: boolean;
  is_ramadan_log: boolean;
  
  // 🔄 RLHF columns - Human Feedback for AI improvement
  ai_suggested_name: string | null;  // Original name AI suggested
  was_user_corrected: boolean;       // Did user edit the name?
}

export interface FoodLogInsert {
  user_id?: string;
  meal_name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium?: number;
  sugar?: number;
  portion_size?: number;
  image_url?: string;
  components?: string[];
  analysis_data?: string;
  meal_type?: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack' | 'Other';
  
  // New Enterprise columns
  meal_context?: MealContext;
  preparation_style?: PreparationStyle;
  sugar_source_detected?: boolean;
  is_ramadan_log?: boolean;
  
  // 🔄 RLHF columns - Human Feedback for AI improvement
  ai_suggested_name?: string;
  was_user_corrected?: boolean;
}

// ============================================
// USER VITALS TABLE
// ============================================

export type VitalType = 
  | 'glucose' 
  | 'bp_systolic' 
  | 'bp_diastolic' 
  | 'weight' 
  | 'waist_circumference';

export type VitalContextTag = 
  | 'fasting' 
  | 'pre_meal' 
  | 'post_meal_2hr' 
  | 'general';

export interface UserVital {
  id: string;
  user_id: string;
  vital_type: VitalType;
  reading_value: number;
  unit: string;
  context_tag: VitalContextTag;
  measured_at: string;
  created_at?: string;
}

export interface UserVitalInsert {
  user_id: string;
  vital_type: VitalType;
  reading_value: number;
  unit: string;
  context_tag: VitalContextTag;
  measured_at?: string;
}

// ============================================
// HELPER CONSTANTS
// ============================================

export const MEAL_CONTEXT_OPTIONS: { value: MealContext; label: string; emoji: string }[] = [
  { value: 'hawker_stall', label: 'Hawker Stall', emoji: '🍜' },
  { value: 'home_cooked', label: 'Home Cooked', emoji: '🏠' },
  { value: 'restaurant', label: 'Restaurant', emoji: '🍽️' },
  { value: 'fast_food', label: 'Fast Food', emoji: '🍔' },
  { value: 'office_canteen', label: 'Office Canteen', emoji: '🏢' },
  { value: 'unknown', label: 'Other', emoji: '❓' },
];

export const PREPARATION_STYLE_OPTIONS: { value: PreparationStyle; label: string; emoji: string }[] = [
  { value: 'stir_fried', label: 'Stir Fried', emoji: '🥡' },
  { value: 'deep_fried', label: 'Deep Fried', emoji: '🍗' },
  { value: 'steamed', label: 'Steamed', emoji: '🥟' },
  { value: 'grilled', label: 'Grilled', emoji: '🔥' },
  { value: 'soup_boiled', label: 'Soup / Boiled', emoji: '🍲' },
  { value: 'gravy_curry', label: 'Gravy / Curry', emoji: '🍛' },
  { value: 'raw_fresh', label: 'Raw / Fresh', emoji: '🥗' },
  { value: 'unknown', label: 'Unknown', emoji: '❓' },
];

export const VITAL_TYPE_CONFIG: Record<VitalType, { label: string; emoji: string; unit: string; min: number; max: number }> = {
  glucose: { label: 'Blood Glucose', emoji: '🩸', unit: 'mmol/L', min: 1, max: 30 },
  bp_systolic: { label: 'BP (Systolic)', emoji: '❤️', unit: 'mmHg', min: 60, max: 250 },
  bp_diastolic: { label: 'BP (Diastolic)', emoji: '💙', unit: 'mmHg', min: 40, max: 150 },
  weight: { label: 'Weight', emoji: '⚖️', unit: 'kg', min: 20, max: 300 },
  waist_circumference: { label: 'Waist', emoji: '📏', unit: 'cm', min: 40, max: 200 },
};

export const VITAL_CONTEXT_OPTIONS: { value: VitalContextTag; label: string }[] = [
  { value: 'fasting', label: 'Fasting (Before Eating)' },
  { value: 'pre_meal', label: 'Pre-Meal' },
  { value: 'post_meal_2hr', label: '2 Hours After Meal' },
  { value: 'general', label: 'General / Other' },
];

