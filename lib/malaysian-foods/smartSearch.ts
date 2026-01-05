// 🇲🇾 Smart Search Service for Malaysian Foods
// This service provides intelligent filtering with semantic understanding
// for low GI, diabetic-safe, and other health-conscious food searches.

import { getSupabaseClient } from '@/lib/supabase';
import { MalaysianFood, MalaysianFoodRow, GICategory, ConditionRating } from './types';
import { rowToMalaysianFood } from './utils';

// ============================================
// SMART SEARCH OPTIONS
// ============================================

export interface SmartSearchOptions {
  query: string;
  limit?: number;
  
  // Semantic filters
  lowGIOnly?: boolean;           // Only show low GI foods
  diabeticSafe?: boolean;        // Only show diabetes-safe foods
  hypertensionSafe?: boolean;    // Only show hypertension-safe foods
  cholesterolSafe?: boolean;     // Only show cholesterol-safe foods
  ckdSafe?: boolean;             // Only show CKD-safe foods
  
  // Nutritional constraints
  maxCalories?: number;          // Maximum calories per serving
  maxCarbs?: number;             // Maximum carbs per serving
  maxSodium?: number;            // Maximum sodium per serving
  
  // Category filter
  category?: string;
  tags?: string[];
}

export interface SmartSearchResult {
  results: MalaysianFood[];
  totalCount: number;
  appliedFilters: string[];
  searchTime: number;
}

// ============================================
// MAIN SMART SEARCH FUNCTION
// ============================================

/**
 * Smart search with semantic filtering for Malaysian foods.
 * Handles natural language queries like "low gi", "diabetic friendly", etc.
 * 
 * @param options - Search options with semantic filters
 * @returns Search results with applied filters metadata
 */
export async function searchFoods(
  options: SmartSearchOptions
): Promise<SmartSearchResult> {
  const startTime = Date.now();
  const appliedFilters: string[] = [];
  
  try {
    const supabase = getSupabaseClient();
    const limit = options.limit || 20;
    
    // Parse semantic keywords from query
    const queryLower = options.query.toLowerCase().trim();
    const semanticKeywords = extractSemanticKeywords(queryLower);
    
    // Auto-detect semantic filters from query
    const autoLowGI = options.lowGIOnly || semanticKeywords.lowGI;
    const autoDiabeticSafe = options.diabeticSafe || semanticKeywords.diabeticSafe;
    const autoHypertensionSafe = options.hypertensionSafe || semanticKeywords.hypertensionSafe;
    const autoCholesterolSafe = options.cholesterolSafe || semanticKeywords.cholesterolSafe;
    const autoCkdSafe = options.ckdSafe || semanticKeywords.ckdSafe;
    
    // Clean query (remove semantic keywords for actual food search)
    const cleanQuery = cleanSemanticKeywords(queryLower);
    
    // Build base query
    let query = supabase
      .from('malaysian_foods')
      .select('*', { count: 'exact' });
    
    // Apply text search if query is not empty after cleaning
    if (cleanQuery) {
      query = query.or(`name_en.ilike.%${cleanQuery}%,name_bm.ilike.%${cleanQuery}%`);
    }
    
    // Apply semantic filters
    if (autoLowGI) {
      query = query.eq('gi_category', 'low');
      appliedFilters.push('Low GI');
    }
    
    if (autoDiabeticSafe) {
      query = query.eq('diabetes_rating', 'safe');
      appliedFilters.push('Diabetic Safe');
    }
    
    if (autoHypertensionSafe) {
      query = query.eq('hypertension_rating', 'safe');
      appliedFilters.push('Hypertension Safe');
    }
    
    if (autoCholesterolSafe) {
      query = query.eq('cholesterol_rating', 'safe');
      appliedFilters.push('Cholesterol Safe');
    }
    
    if (autoCkdSafe) {
      query = query.eq('ckd_rating', 'safe');
      appliedFilters.push('CKD Safe');
    }
    
    // Apply nutritional constraints
    if (options.maxCalories !== undefined) {
      query = query.lte('calories_kcal', options.maxCalories);
      appliedFilters.push(`Max ${options.maxCalories} kcal`);
    }
    
    if (options.maxCarbs !== undefined) {
      query = query.lte('carbs_g', options.maxCarbs);
      appliedFilters.push(`Max ${options.maxCarbs}g carbs`);
    }
    
    if (options.maxSodium !== undefined) {
      query = query.lte('sodium_mg', options.maxSodium);
      appliedFilters.push(`Max ${options.maxSodium}mg sodium`);
    }
    
    // Apply category filter
    if (options.category) {
      query = query.eq('category', options.category);
      appliedFilters.push(`Category: ${options.category}`);
    }
    
    // Apply tags filter
    if (options.tags && options.tags.length > 0) {
      for (const tag of options.tags) {
        query = query.contains('tags', [tag]);
        appliedFilters.push(`Tag: ${tag}`);
      }
    }
    
    // Order by relevance and popularity
    query = query.order('popularity_score', { ascending: false });
    query = query.limit(limit);
    
    // Execute query
    const { data, error, count } = await query;
    
    if (error) {
      console.error('[Smart Search] Query error:', error);
      return {
        results: [],
        totalCount: 0,
        appliedFilters: [],
        searchTime: Date.now() - startTime,
      };
    }
    
    // Transform results
    const results = (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
    
    const searchTime = Date.now() - startTime;
    
    console.log('[Smart Search] Results:', {
      query: options.query,
      cleanQuery,
      resultsCount: results.length,
      totalCount: count || 0,
      appliedFilters,
      searchTime: `${searchTime}ms`,
    });
    
    return {
      results,
      totalCount: count || 0,
      appliedFilters,
      searchTime,
    };
    
  } catch (error) {
    console.error('[Smart Search] Fatal error:', error);
    
    // Return empty result on failure (as per requirement)
    return {
      results: [],
      totalCount: 0,
      appliedFilters: [],
      searchTime: Date.now() - startTime,
    };
  }
}

// ============================================
// SEMANTIC KEYWORD DETECTION
// ============================================

interface SemanticKeywords {
  lowGI: boolean;
  diabeticSafe: boolean;
  hypertensionSafe: boolean;
  cholesterolSafe: boolean;
  ckdSafe: boolean;
}

/**
 * Extract semantic keywords from query string.
 * Detects phrases like "low gi", "diabetic friendly", "safe for diabetes", etc.
 */
function extractSemanticKeywords(query: string): SemanticKeywords {
  const keywords: SemanticKeywords = {
    lowGI: false,
    diabeticSafe: false,
    hypertensionSafe: false,
    cholesterolSafe: false,
    ckdSafe: false,
  };
  
  // Low GI keywords
  const lowGIPatterns = [
    'low gi',
    'low glycemic',
    'rendah gi',
    'indeks glikemik rendah',
  ];
  keywords.lowGI = lowGIPatterns.some(pattern => query.includes(pattern));
  
  // Diabetic-safe keywords
  const diabeticPatterns = [
    'diabetic',
    'diabetes',
    'diabetic safe',
    'diabetic friendly',
    'safe for diabetes',
    'kencing manis',
    'selamat untuk diabetes',
  ];
  keywords.diabeticSafe = diabeticPatterns.some(pattern => query.includes(pattern));
  
  // Hypertension-safe keywords
  const hypertensionPatterns = [
    'hypertension',
    'high blood pressure',
    'low sodium',
    'darah tinggi',
    'rendah sodium',
    'hipertensi',
  ];
  keywords.hypertensionSafe = hypertensionPatterns.some(pattern => query.includes(pattern));
  
  // Cholesterol-safe keywords
  const cholesterolPatterns = [
    'cholesterol',
    'low cholesterol',
    'heart healthy',
    'kolesterol',
    'rendah kolesterol',
  ];
  keywords.cholesterolSafe = cholesterolPatterns.some(pattern => query.includes(pattern));
  
  // CKD-safe keywords
  const ckdPatterns = [
    'ckd',
    'kidney',
    'renal',
    'buah pinggang',
  ];
  keywords.ckdSafe = ckdPatterns.some(pattern => query.includes(pattern));
  
  return keywords;
}

/**
 * Remove semantic keywords from query to get clean food search term.
 * "low gi nasi" -> "nasi"
 * "diabetic friendly kuih" -> "kuih"
 */
function cleanSemanticKeywords(query: string): string {
  const semanticPhrases = [
    // GI related
    'low gi',
    'low glycemic',
    'rendah gi',
    'indeks glikemik rendah',
    
    // Diabetes related
    'diabetic safe',
    'diabetic friendly',
    'safe for diabetes',
    'diabetic',
    'diabetes',
    'kencing manis',
    'selamat untuk diabetes',
    
    // Hypertension related
    'hypertension safe',
    'safe for hypertension',
    'high blood pressure',
    'low sodium',
    'hypertension',
    'darah tinggi',
    'rendah sodium',
    'hipertensi',
    
    // Cholesterol related
    'cholesterol safe',
    'low cholesterol',
    'heart healthy',
    'cholesterol',
    'kolesterol',
    'rendah kolesterol',
    
    // CKD related
    'ckd safe',
    'kidney safe',
    'renal safe',
    'ckd',
    'kidney',
    'renal',
    'buah pinggang',
    
    // Generic safe/healthy
    'safe',
    'healthy',
    'selamat',
    'sihat',
  ];
  
  let cleaned = query;
  
  // Remove each semantic phrase
  for (const phrase of semanticPhrases) {
    cleaned = cleaned.replace(new RegExp(`\\b${phrase}\\b`, 'gi'), '');
  }
  
  // Clean up extra spaces
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Quick search for low GI foods only.
 */
export async function searchLowGIFoods(
  query: string,
  limit: number = 20
): Promise<MalaysianFood[]> {
  const result = await searchFoods({
    query,
    limit,
    lowGIOnly: true,
  });
  
  return result.results;
}

/**
 * Quick search for diabetic-safe foods only.
 */
export async function searchDiabeticSafeFoods(
  query: string,
  limit: number = 20
): Promise<MalaysianFood[]> {
  const result = await searchFoods({
    query,
    limit,
    diabeticSafe: true,
  });
  
  return result.results;
}

/**
 * Quick search for foods safe for multiple conditions.
 */
export async function searchConditionSafeFoods(
  query: string,
  conditions: Array<'diabetes' | 'hypertension' | 'cholesterol' | 'ckd'>,
  limit: number = 20
): Promise<MalaysianFood[]> {
  const options: SmartSearchOptions = {
    query,
    limit,
  };
  
  if (conditions.includes('diabetes')) {
    options.diabeticSafe = true;
  }
  if (conditions.includes('hypertension')) {
    options.hypertensionSafe = true;
  }
  if (conditions.includes('cholesterol')) {
    options.cholesterolSafe = true;
  }
  if (conditions.includes('ckd')) {
    options.ckdSafe = true;
  }
  
  const result = await searchFoods(options);
  return result.results;
}

/**
 * Get recommended foods for a user based on their conditions.
 * This returns popular foods that are safe for all specified conditions.
 */
export async function getRecommendedFoods(
  conditions: Array<'diabetes' | 'hypertension' | 'cholesterol' | 'ckd'>,
  limit: number = 10
): Promise<MalaysianFood[]> {
  try {
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from('malaysian_foods')
      .select('*');
    
    // Apply all condition filters
    if (conditions.includes('diabetes')) {
      query = query.eq('diabetes_rating', 'safe');
    }
    if (conditions.includes('hypertension')) {
      query = query.eq('hypertension_rating', 'safe');
    }
    if (conditions.includes('cholesterol')) {
      query = query.eq('cholesterol_rating', 'safe');
    }
    if (conditions.includes('ckd')) {
      query = query.eq('ckd_rating', 'safe');
    }
    
    // Order by popularity and limit
    query = query
      .order('popularity_score', { ascending: false })
      .limit(limit);
    
    const { data, error } = await query;
    
    if (error) {
      console.error('[Smart Search] Recommended foods error:', error);
      return [];
    }
    
    return (data as MalaysianFoodRow[]).map(rowToMalaysianFood);
    
  } catch (error) {
    console.error('[Smart Search] Recommended foods fatal error:', error);
    return [];
  }
}

