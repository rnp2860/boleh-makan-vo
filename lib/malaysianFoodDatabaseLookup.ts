// lib/malaysianFoodDatabaseLookup.ts
// 🇲🇾 Malaysian Food Database Lookup
// Priority search system for Malaysian foods with fallback to generic database

import { getSupabaseClient } from '@/lib/supabase';

export interface MalaysianFoodMatch {
  id: string;
  name_en: string;
  name_bm: string;
  category: string;
  serving_description: string;
  serving_grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar_g: number;
  sodium_mg: number;
  saturated_fat_g: number | null;
  cholesterol_mg: number | null;
  phosphorus_mg: number | null;
  potassium_mg: number | null;
  fiber_g: number | null;
  diabetes_rating: 'safe' | 'caution' | 'limit';
  hypertension_rating: 'safe' | 'caution' | 'limit';
  cholesterol_rating: 'safe' | 'caution' | 'limit';
  ckd_rating: 'safe' | 'caution' | 'limit';
  source: 'malaysian_database';
  match_confidence: number;
  match_type: 'exact' | 'fuzzy' | 'alias';
}

/**
 * Search Malaysian food database with intelligent matching
 * Priority: Exact name > Starts with > All words present > Partial match > Alias
 */
export async function searchMalaysianFoodDatabase(query: string): Promise<MalaysianFoodMatch | null> {
  try {
    const supabase = getSupabaseClient();
    const normalizedQuery = query.toLowerCase().trim();
    
    console.log('🇲🇾 Searching Malaysian database for:', query);
    
    // Split query into words for flexible matching
    const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
    
    // 1. Try exact match first (highest priority)
    const { data: exactMatch, error: exactError } = await supabase
      .from('malaysian_foods')
      .select('*')
      .or(`name_en.ilike.${normalizedQuery},name_bm.ilike.${normalizedQuery}`)
      .limit(1)
      .maybeSingle();
    
    if (!exactError && exactMatch) {
      console.log('✅ Malaysian DB: Exact match found -', exactMatch.name_en);
      return mapToMalaysianFoodMatch(exactMatch, 1.0, 'exact');
    }
    
    // 2. Try alias match (common abbreviations like "ckt", "bkt")
    const { data: aliasMatches, error: aliasError } = await supabase
      .from('malaysian_foods')
      .select('*')
      .contains('aliases', [normalizedQuery])
      .limit(5);
    
    if (!aliasError && aliasMatches && aliasMatches.length > 0) {
      console.log('✅ Malaysian DB: Alias match found -', aliasMatches[0].name_en);
      return mapToMalaysianFoodMatch(aliasMatches[0], 0.95, 'alias');
    }
    
    // 3. Try flexible word-order matching (for compound dishes)
    if (words.length >= 2) {
      const { data: compoundMatches, error: compoundError } = await supabase
        .rpc('search_malaysian_foods', {
          search_term: normalizedQuery,
          limit_count: 10
        });
      
      if (!compoundError && compoundMatches && compoundMatches.length > 0) {
        // Check if all words are present in the top result
        const topMatch = compoundMatches[0];
        const matchName = `${topMatch.name_en} ${topMatch.name_bm}`.toLowerCase();
        const allWordsPresent = words.every(word => matchName.includes(word));
        
        if (allWordsPresent) {
          console.log('✅ Malaysian DB: Compound match found -', topMatch.name_en);
          return mapToMalaysianFoodMatch(topMatch, 0.9, 'fuzzy');
        }
        
        // Otherwise return top result with lower confidence
        console.log('🔍 Malaysian DB: Fuzzy match found -', topMatch.name_en);
        return mapToMalaysianFoodMatch(topMatch, 0.75, 'fuzzy');
      }
    }
    
    // 4. Try single word match (fallback for partial queries)
    const mainWord = words[0] || normalizedQuery;
    if (mainWord.length >= 3) {
      const { data: partialMatches, error: partialError } = await supabase
        .from('malaysian_foods')
        .select('*')
        .or(`name_en.ilike.%${mainWord}%,name_bm.ilike.%${mainWord}%`)
        .order('popularity_score', { ascending: false })
        .limit(1)
        .maybeSingle();
      
      if (!partialError && partialMatches) {
        console.log('🔍 Malaysian DB: Partial match found -', partialMatches.name_en);
        return mapToMalaysianFoodMatch(partialMatches, 0.7, 'fuzzy');
      }
    }
    
    console.log('❌ Malaysian DB: No match found for:', query);
    return null;
    
  } catch (error) {
    console.error('Error searching Malaysian food database:', error);
    return null;
  }
}

/**
 * Map database result to MalaysianFoodMatch interface
 */
function mapToMalaysianFoodMatch(
  dbFood: any, 
  confidence: number, 
  matchType: 'exact' | 'fuzzy' | 'alias'
): MalaysianFoodMatch {
  return {
    id: dbFood.id,
    name_en: dbFood.name_en,
    name_bm: dbFood.name_bm,
    category: dbFood.category,
    serving_description: dbFood.serving_description,
    serving_grams: dbFood.serving_grams,
    calories: dbFood.calories_kcal,
    protein: dbFood.protein_g,
    carbs: dbFood.carbs_g,
    fat: dbFood.total_fat_g,
    sugar_g: dbFood.sugar_g || 0,
    sodium_mg: dbFood.sodium_mg || 0,
    saturated_fat_g: dbFood.saturated_fat_g,
    cholesterol_mg: dbFood.cholesterol_mg,
    phosphorus_mg: dbFood.phosphorus_mg,
    potassium_mg: dbFood.potassium_mg,
    fiber_g: dbFood.fiber_g,
    diabetes_rating: dbFood.diabetes_rating,
    hypertension_rating: dbFood.hypertension_rating,
    cholesterol_rating: dbFood.cholesterol_rating,
    ckd_rating: dbFood.ckd_rating,
    source: 'malaysian_database',
    match_confidence: confidence,
    match_type: matchType,
  };
}

/**
 * Get food components for display
 */
export function getMalaysianFoodComponents(food: MalaysianFoodMatch): any[] {
  // For now, return single component
  // Can be expanded to break down dishes into components
  return [{
    name: food.name_en,
    calories: food.calories,
    macros: {
      p: food.protein,
      c: food.carbs,
      f: food.fat,
      sugar: food.sugar_g,
      sodium: food.sodium_mg
    }
  }];
}

/**
 * Generate quick Dr. Reza advice based on Malaysian food and user conditions
 */
export function generateMalaysianFoodAdvice(
  food: MalaysianFoodMatch, 
  conditions: string[]
): string {
  const tips: string[] = [];
  
  // Check each condition
  if (conditions.some(c => c.includes('diabetes'))) {
    if (food.diabetes_rating === 'limit') {
      tips.push(`⚠️ DIABETES: High carbs (${food.carbs}g) - glucose will spike`);
    } else if (food.diabetes_rating === 'caution') {
      tips.push(`🟡 DIABETES: Moderate carbs (${food.carbs}g) - watch portions`);
    }
  }
  
  if (conditions.includes('hypertension')) {
    if (food.hypertension_rating === 'limit') {
      tips.push(`⚠️ DARAH TINGGI: High sodium (${food.sodium_mg}mg) - blood pressure concern`);
    } else if (food.hypertension_rating === 'caution') {
      tips.push(`🟡 DARAH TINGGI: Moderate sodium (${food.sodium_mg}mg) - limit intake`);
    }
  }
  
  if (conditions.some(c => c.includes('cholesterol') || c.includes('dyslipidemia'))) {
    if (food.cholesterol_rating === 'limit') {
      tips.push(`⚠️ KOLESTEROL: High saturated fat - watch cholesterol levels`);
    }
  }
  
  if (conditions.some(c => c.includes('ckd'))) {
    if (food.ckd_rating === 'limit') {
      tips.push(`⚠️ BUAH PINGGANG: Monitor protein/phosphorus/potassium intake`);
    }
  }
  
  if (tips.length === 0) {
    return `${food.name_bm} (${food.name_en}) - ${food.calories} kcal. Good choice!`;
  }
  
  return `${food.name_bm} - ${tips.join(' | ')}`;
}

