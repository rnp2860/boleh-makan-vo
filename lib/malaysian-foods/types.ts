// 🇲🇾 Malaysian Food Database Types

export type FoodCategory = 
  | 'rice_dishes'
  | 'noodles'
  | 'breads'
  | 'kuih'
  | 'drinks'
  | 'protein'
  | 'vegetables'
  | 'fruits'
  | 'porridge'
  | 'soups'
  | 'desserts'
  | 'snacks';

export type GICategory = 'low' | 'medium' | 'high';

export type ConditionRating = 'safe' | 'caution' | 'limit';

export type FoodSource = 'myfcd' | 'hpb' | 'ai_estimated' | 'user_submitted' | 'manual';

export interface MalaysianFood {
  id: string;
  
  // Identity
  nameEn: string;
  nameBm: string;
  aliases: string[];
  
  // Categorization
  category: FoodCategory;
  subcategory?: string;
  tags: string[];
  
  // Serving Info (Malaysian portions)
  servingDescription: string; // "1 bungkus", "1 pinggan"
  servingDescriptionEn?: string; // "1 packet", "1 plate"
  servingGrams: number;
  
  // Basic Nutrition
  caloriesKcal: number;
  
  // Diabetes-relevant
  carbsG: number;
  sugarG?: number;
  fiberG?: number;
  glycemicIndex?: number;
  giCategory?: GICategory;
  
  // Hypertension-relevant
  sodiumMg?: number;
  potassiumMg?: number;
  
  // Cholesterol-relevant
  totalFatG?: number;
  saturatedFatG?: number;
  transFatG?: number;
  cholesterolMg?: number;
  
  // CKD-relevant
  proteinG?: number;
  phosphorusMg?: number;
  
  // Pre-computed Condition Warnings
  diabetesRating?: ConditionRating;
  hypertensionRating?: ConditionRating;
  cholesterolRating?: ConditionRating;
  ckdRating?: ConditionRating;
  
  // Metadata
  imageUrl?: string;
  source: FoodSource;
  verified: boolean;
  popularityScore: number;
  
  createdAt: string;
  updatedAt: string;
}

// Database row format (snake_case)
export interface MalaysianFoodRow {
  id: string;
  name_en: string;
  name_bm: string;
  aliases: string[] | null;
  category: string;
  subcategory: string | null;
  tags: string[] | null;
  serving_description: string;
  serving_description_en: string | null;
  serving_grams: number;
  calories_kcal: number;
  carbs_g: number;
  sugar_g: number | null;
  fiber_g: number | null;
  glycemic_index: number | null;
  gi_category: string | null;
  sodium_mg: number | null;
  potassium_mg: number | null;
  total_fat_g: number | null;
  saturated_fat_g: number | null;
  trans_fat_g: number | null;
  cholesterol_mg: number | null;
  protein_g: number | null;
  phosphorus_mg: number | null;
  diabetes_rating: string | null;
  hypertension_rating: string | null;
  cholesterol_rating: string | null;
  ckd_rating: string | null;
  image_url: string | null;
  source: string;
  verified: boolean;
  popularity_score: number;
  created_at: string;
  updated_at: string;
}

// Search result with match highlights
export interface FoodSearchResult extends MalaysianFood {
  matchType: 'exact' | 'prefix' | 'contains' | 'alias';
  matchedText?: string;
}

// Portion multiplier for logging
export interface FoodPortion {
  food: MalaysianFood;
  multiplier: number; // 0.5, 1, 1.5, 2, or custom
  adjustedNutrients: AdjustedNutrients;
}

export interface AdjustedNutrients {
  servingGrams: number;
  caloriesKcal: number;
  carbsG: number;
  sugarG?: number;
  fiberG?: number;
  sodiumMg?: number;
  totalFatG?: number;
  saturatedFatG?: number;
  proteinG?: number;
  cholesterolMg?: number;
  phosphorusMg?: number;
  potassiumMg?: number;
}

// Condition warning for display
export interface ConditionWarning {
  condition: 'diabetes' | 'hypertension' | 'cholesterol' | 'ckd';
  rating: ConditionRating;
  message: string;
  detail?: string;
}

// Food log entry with Malaysian food reference
export interface MalaysianFoodLogEntry {
  id: string;
  userId: string;
  malaysianFoodId: string;
  food: MalaysianFood;
  multiplier: number;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'sahur' | 'iftar';
  loggedAt: string;
  notes?: string;
}

// Category metadata for UI
export interface FoodCategoryInfo {
  id: FoodCategory;
  labelEn: string;
  labelBm: string;
  icon: string;
  description?: string;
}

// Food categories with localized labels
export const FOOD_CATEGORIES: FoodCategoryInfo[] = [
  { id: 'rice_dishes', labelEn: 'Rice Dishes', labelBm: 'Hidangan Nasi', icon: '🍚' },
  { id: 'noodles', labelEn: 'Noodles', labelBm: 'Mi & Bihun', icon: '🍜' },
  { id: 'breads', labelEn: 'Breads', labelBm: 'Roti', icon: '🫓' },
  { id: 'kuih', labelEn: 'Kuih', labelBm: 'Kuih-Muih', icon: '🍡' },
  { id: 'drinks', labelEn: 'Drinks', labelBm: 'Minuman', icon: '🥤' },
  { id: 'protein', labelEn: 'Protein', labelBm: 'Protein', icon: '🍗' },
  { id: 'vegetables', labelEn: 'Vegetables', labelBm: 'Sayuran', icon: '🥬' },
  { id: 'fruits', labelEn: 'Fruits', labelBm: 'Buah-Buahan', icon: '🍌' },
  { id: 'porridge', labelEn: 'Porridge', labelBm: 'Bubur', icon: '🥣' },
  { id: 'soups', labelEn: 'Soups', labelBm: 'Sup', icon: '🍲' },
  { id: 'desserts', labelEn: 'Desserts', labelBm: 'Pencuci Mulut', icon: '🍨' },
  { id: 'snacks', labelEn: 'Snacks', labelBm: 'Snek', icon: '🥠' },
];

// Daily limits for reference
export const DAILY_LIMITS = {
  sodium: 2000, // mg (WHO recommendation)
  sugar: 25, // g (WHO recommendation for added sugars)
  saturatedFat: 22, // g (based on 2000kcal diet)
  cholesterol: 300, // mg
  protein: {
    normal: 50, // g
    ckd: 40, // g (reduced for CKD patients)
  },
  carbs: 260, // g (based on 2000kcal diet)
  phosphorus: {
    normal: 1000, // mg
    ckd: 800, // mg (reduced for CKD patients)
  },
  potassium: {
    normal: 4700, // mg
    ckd: 2000, // mg (reduced for CKD patients)
  },
};

