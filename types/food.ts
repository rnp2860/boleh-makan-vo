// 🇲🇾 Malaysian Food Types

export type ConditionRating = 'safe' | 'caution' | 'limit';
export type GICategory = 'low' | 'medium' | 'high';
export type FoodSource = 'myfcd' | 'hpb' | 'usda' | 'ai_estimated' | 'user_submitted';

export interface MalaysianFood {
  id: string;
  name_en: string;
  name_bm: string;
  aliases: string[];
  category: string;
  subcategory: string | null;
  tags: string[];
  
  serving_description: string;
  serving_description_en: string | null;
  serving_grams: number;
  
  // Basic Nutrition
  calories_kcal: number;
  carbs_g: number;
  sugar_g: number | null;
  fiber_g: number | null;
  glycemic_index: number | null;
  gi_category: GICategory | null;
  
  // Hypertension-relevant
  sodium_mg: number | null;
  potassium_mg: number | null;
  
  // Cholesterol-relevant
  total_fat_g: number | null;
  saturated_fat_g: number | null;
  trans_fat_g: number | null;
  cholesterol_mg: number | null;
  
  // CKD-relevant
  protein_g: number | null;
  phosphorus_mg: number | null;
  
  // Condition Ratings
  diabetes_rating: ConditionRating;
  hypertension_rating: ConditionRating;
  cholesterol_rating: ConditionRating;
  ckd_rating: ConditionRating;
  
  // Metadata
  image_url: string | null;
  source: FoodSource;
  verified: boolean;
  popularity_score: number;
  
  created_at?: string;
  updated_at?: string;
}

export interface FoodSearchResult {
  id: string;
  name_en: string;
  name_bm: string;
  category: string;
  serving_description: string;
  serving_grams: number;
  calories_kcal: number;
  carbs_g: number;
  protein_g: number | null;
  
  // Condition ratings for quick display
  diabetes_rating: ConditionRating;
  hypertension_rating: ConditionRating;
  cholesterol_rating: ConditionRating;
  ckd_rating: ConditionRating;
  
  // For highlighting in search results
  popularity_score: number;
}

export interface FoodLogEntry {
  id: string;
  user_id: string;
  malaysian_food_id?: string; // Reference to malaysian_foods table
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  
  // Food details (denormalized for quick access)
  food_name: string;
  serving_description: string;
  serving_multiplier: number; // e.g., 1.5 for 1.5x serving
  
  // Calculated nutrition (serving * multiplier)
  calories: number;
  carbs: number;
  protein: number | null;
  fat: number | null;
  sugar: number | null;
  fiber: number | null;
  sodium: number | null;
  
  notes?: string;
  logged_at: string;
  created_at: string;
}

export interface ServingAdjustment {
  multiplier: number;
  label: string; // "Half", "Normal", "1.5x", "Double"
}

export const SERVING_PRESETS: ServingAdjustment[] = [
  { multiplier: 0.5, label: 'Half' },
  { multiplier: 1.0, label: 'Normal' },
  { multiplier: 1.5, label: '1.5x' },
  { multiplier: 2.0, label: 'Double' },
];

