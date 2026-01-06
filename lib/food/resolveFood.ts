// 🎯 CANONICAL FOOD RESOLUTION MODULE
// This is the ONLY place where food identity is resolved across the entire app.
// All food logging paths MUST use this module to ensure consistency and eliminate regressions.

import { getSupabaseClient } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export type InputType = 'image' | 'text';
export type FoodSource = 'malaysian_db' | 'ai_estimate';
export type MatchStrategy = 'exact' | 'alias' | 'fuzzy' | 'partial' | 'ai_fallback';

export interface ResolveFoodInput {
  inputType: InputType;
  rawName?: string;           // For text input
  visionName?: string;        // For image input (AI suggested name)
  userConditions?: string[];  // User's health conditions
}

export interface MatchedFood {
  id: string;
  name_en: string;
  name_bm: string;
  category: string;
  serving_description: string;
  serving_grams: number;
  macros: {
    calories_kcal: number;
    protein_g: number;
    carbs_g: number;
    total_fat_g: number;
    sugar_g: number | null;
    sodium_mg: number | null;
    saturated_fat_g: number | null;
    fiber_g: number | null;
    cholesterol_mg: number | null;
    phosphorus_mg: number | null;
    potassium_mg: number | null;
  };
  ratings: {
    diabetes_rating: string | null;
    hypertension_rating: string | null;
    cholesterol_rating: string | null;
    ckd_rating: string | null;
  };
}

export interface ResolveFoodResult {
  source: FoodSource;
  matchedFood?: MatchedFood;
  confidence: number;
  debug: {
    strategy: MatchStrategy;
    searchTerm: string;
    fallbackReason?: string;
    candidatesFound?: number;
  };
}

// ============================================
// CONFIDENCE THRESHOLDS
// ============================================

const CONFIDENCE_THRESHOLDS = {
  EXACT_MATCH: 1.0,
  ALIAS_MATCH: 0.95,
  FUZZY_MATCH: 0.85,
  PARTIAL_MATCH: 0.70,
  AI_FALLBACK: 0.50,
};

const MIN_DB_CONFIDENCE = 0.65; // Minimum confidence to prefer DB over AI

// ============================================
// MAIN RESOLUTION FUNCTION
// ============================================

/**
 * CANONICAL FOOD RESOLUTION
 * 
 * Resolution order (STRICT):
 * 1. Exact DB match (name_en or name_bm)
 * 2. Alias match (ckt, bkt, etc.)
 * 3. Fuzzy match (all words present, order flexible)
 * 4. Partial token match (main keywords)
 * 5. AI fallback (ONLY if NO DB match passes threshold)
 * 
 * GUARANTEES:
 * - Malaysian DB is ALWAYS tried first
 * - AI can NEVER override a DB match
 * - If DB match exists with confidence >= MIN_DB_CONFIDENCE, return it
 * - Source is "malaysian_db" for ANY DB match above threshold
 */
export async function resolveFood(
  input: ResolveFoodInput
): Promise<ResolveFoodResult> {
  
  // Determine search term based on input type
  const searchTerm = input.inputType === 'text' 
    ? (input.rawName || '').trim()
    : (input.visionName || '').trim();
  
  if (!searchTerm) {
    return {
      source: 'ai_estimate',
      confidence: 0,
      debug: {
        strategy: 'ai_fallback',
        searchTerm: '',
        fallbackReason: 'Empty search term',
      },
    };
  }
  
  console.log(`🎯 [resolveFood] Starting resolution for: "${searchTerm}" (type: ${input.inputType})`);
  
  // STEP 1: Try Malaysian Database (ALWAYS FIRST)
  const dbResult = await searchMalaysianDB(searchTerm);
  
  if (dbResult.matched && dbResult.confidence >= MIN_DB_CONFIDENCE) {
    console.log(`✅ [resolveFood] DB match found with ${(dbResult.confidence * 100).toFixed(0)}% confidence`);
    console.log(`   Strategy: ${dbResult.strategy}, Food: ${dbResult.food!.name_en}`);
    
    return {
      source: 'malaysian_db',
      matchedFood: dbResult.food!,
      confidence: dbResult.confidence,
      debug: {
        strategy: dbResult.strategy,
        searchTerm,
        candidatesFound: dbResult.candidatesFound,
      },
    };
  }
  
  // STEP 2: No DB match passes threshold - fall back to AI estimate
  console.log(`⚠️  [resolveFood] No DB match above threshold (${MIN_DB_CONFIDENCE})`);
  console.log(`   Falling back to AI estimate for: "${searchTerm}"`);
  
  return {
    source: 'ai_estimate',
    confidence: CONFIDENCE_THRESHOLDS.AI_FALLBACK,
    debug: {
      strategy: 'ai_fallback',
      searchTerm,
      fallbackReason: dbResult.matched 
        ? `DB match confidence too low (${(dbResult.confidence * 100).toFixed(0)}%)`
        : 'No DB matches found',
      candidatesFound: dbResult.candidatesFound,
    },
  };
}

// ============================================
// MALAYSIAN DB SEARCH
// ============================================

interface DBSearchResult {
  matched: boolean;
  confidence: number;
  strategy: MatchStrategy;
  food?: MatchedFood;
  candidatesFound: number;
}

const DESCRIPTOR_PHRASES = [
  'ayam merah',
  'ayam goreng',
  'ikan goreng',
  'darah tinggi',
  'buah pinggang',
  'kuah banjir',
  'kuah campur',
  'kuah kacang',
  'tambah kuah',
  'tambah',
  'tambahan',
  'special',
  'banjir',
];

const CROSS_CUISINE_TERMS = new Set([
  'chips',
  'fries',
  'burger',
  'sandwich',
  'wrap',
  'taco',
  'pizza',
  'pasta',
  'and',
  '&'
]);

const STOPWORDS = new Set([
  'ayam',
  'ikan',
  'goreng',
  'merah',
  'kuah',
  'banjir',
  'special',
  'tambah',
  'tambahan',
  'kacang',
  'telur',
  'sotong',
  'udang',
  'darah',
  'tinggi',
]);

async function searchMalaysianDB(query: string): Promise<DBSearchResult> {
  try {
    const supabase = getSupabaseClient();
    const normalizedInput = normalizeText(query);
    const descriptorStripped = stripDescriptors(normalizedInput);
    const normalizedQuery = descriptorStripped || normalizedInput;
    
    // Split into words for flexible matching
    const words = normalizedQuery.split(/\s+/).filter(w => w.length > 0);
    const meaningfulTokens = getMeaningfulTokens(words);
    
    console.log(`🔍 [Malaysian DB] Searching for: "${query}"`);
    console.log(
      `   Normalized: "${normalizedInput}", Stripped: "${normalizedQuery}", Words: [${words.join(', ')}], Meaningful: [${meaningfulTokens.join(', ')}]`
    );
    
    // STRATEGY 1: EXACT MATCH (highest priority)
    const { data: exactMatches, error: exactError } = await supabase
      .from('malaysian_foods')
      .select('*')
      .or(`name_en.ilike.${normalizedQuery},name_bm.ilike.${normalizedQuery}`)
      .limit(1);
    
    if (!exactError && exactMatches && exactMatches.length > 0) {
      console.log(`   ✓ Exact match: ${exactMatches[0].name_en}`);
      return {
        matched: true,
        confidence: CONFIDENCE_THRESHOLDS.EXACT_MATCH,
        strategy: 'exact',
        food: mapDBRowToMatchedFood(exactMatches[0]),
        candidatesFound: 1,
      };
    }
    
    // STRATEGY 2: ALIAS MATCH (common abbreviations)
    const { data: aliasMatches, error: aliasError } = await supabase
      .from('malaysian_foods')
      .select('*')
      .contains('aliases', [normalizedQuery])
      .limit(5);
    
    if (!aliasError && aliasMatches && aliasMatches.length > 0) {
      console.log(`   ✓ Alias match: ${aliasMatches[0].name_en}`);
      return {
        matched: true,
        confidence: CONFIDENCE_THRESHOLDS.ALIAS_MATCH,
        strategy: 'alias',
        food: mapDBRowToMatchedFood(aliasMatches[0]),
        candidatesFound: aliasMatches.length,
      };
    }
    
    // STRATEGY 3: FUZZY MATCH (using database function)
    if (words.length >= 2) {
      const { data: fuzzyMatches, error: fuzzyError } = await supabase
        .rpc('search_malaysian_foods', {
          search_term: normalizedQuery,
          limit_count: 10
        });
      
      if (!fuzzyError && fuzzyMatches && fuzzyMatches.length > 0) {
        const topMatch = fuzzyMatches[0];
        const matchName = `${topMatch.name_en} ${topMatch.name_bm}`.toLowerCase();
        
        // Check if ALL query words are present in the match
        const allWordsPresent = words.every(word => matchName.includes(word));
        
        if (allWordsPresent) {
          console.log(`   ✓ Fuzzy match (all words): ${topMatch.name_en}`);
          return {
            matched: true,
            confidence: CONFIDENCE_THRESHOLDS.FUZZY_MATCH,
            strategy: 'fuzzy',
            food: mapDBRowToMatchedFood(topMatch),
            candidatesFound: fuzzyMatches.length,
          };
        }
        
        // Partial match - some words present
        if (shouldRejectPartialMatch(words, meaningfulTokens, matchName)) {
          console.log(`   ✗ Rejected partial fuzzy match due to low overlap: ${topMatch.name_en}`);
          return { matched: false, confidence: 0, strategy: 'ai_fallback', candidatesFound: fuzzyMatches.length };
        }
        console.log(`   ~ Fuzzy match (partial): ${topMatch.name_en}`);
        return {
          matched: true,
          confidence: CONFIDENCE_THRESHOLDS.PARTIAL_MATCH,
          strategy: 'fuzzy',
          food: mapDBRowToMatchedFood(topMatch),
          candidatesFound: fuzzyMatches.length,
        };
      }
    }
    
    // STRATEGY 4: PARTIAL TOKEN MATCH (top meaningful tokens with AND)
    const partialTokens = (meaningfulTokens.length > 0 ? meaningfulTokens : words).slice(0, 2);
    if (partialTokens.length === 2) {
      const andFilter = buildTokenAndFilter(partialTokens[0], partialTokens[1]);
      const { data: partialMatches, error: partialError } = await supabase
        .from('malaysian_foods')
        .select('*')
        .or(andFilter)
        .limit(5);
      
      if (!partialError && partialMatches && partialMatches.length > 0) {
        console.log(`   ~ Partial match (AND tokens): ${partialMatches[0].name_en}`);
        const matchName = `${partialMatches[0].name_en} ${partialMatches[0].name_bm}`.toLowerCase();
        if (shouldRejectPartialMatch(words, meaningfulTokens, matchName)) {
          console.log(`   ✗ Rejected partial AND match due to low overlap: ${partialMatches[0].name_en}`);
          return { matched: false, confidence: 0, strategy: 'ai_fallback', candidatesFound: partialMatches.length };
        }
        return {
          matched: true,
          confidence: CONFIDENCE_THRESHOLDS.PARTIAL_MATCH,
          strategy: 'partial',
          food: mapDBRowToMatchedFood(partialMatches[0]),
          candidatesFound: partialMatches.length,
        };
      }
    }

    const fallbackPartialToken = (meaningfulTokens[0] || words[0] || '').trim();
    if (fallbackPartialToken.length >= 3) {
      const { data: partialMatches, error: partialError } = await supabase
        .from('malaysian_foods')
        .select('*')
        .or(`name_en.ilike.%${fallbackPartialToken}%,name_bm.ilike.%${fallbackPartialToken}%`)
        .limit(5);
      
      if (!partialError && partialMatches && partialMatches.length > 0) {
        console.log(`   ~ Partial match: ${partialMatches[0].name_en}`);
        const matchName = `${partialMatches[0].name_en} ${partialMatches[0].name_bm}`.toLowerCase();
        if (shouldRejectPartialMatch(words, meaningfulTokens, matchName)) {
          console.log(`   ✗ Rejected fallback partial due to low overlap: ${partialMatches[0].name_en}`);
          return { matched: false, confidence: 0, strategy: 'ai_fallback', candidatesFound: partialMatches.length };
        }
        return {
          matched: true,
          confidence: CONFIDENCE_THRESHOLDS.PARTIAL_MATCH,
          strategy: 'partial',
          food: mapDBRowToMatchedFood(partialMatches[0]),
          candidatesFound: partialMatches.length,
        };
      }
    }
    
    // NO MATCH FOUND
    console.log(`   ✗ No DB matches found`);
    return {
      matched: false,
      confidence: 0,
      strategy: 'ai_fallback',
      candidatesFound: 0,
    };
    
  } catch (error) {
    console.error('[Malaysian DB] Search error:', error);
    return {
      matched: false,
      confidence: 0,
      strategy: 'ai_fallback',
      candidatesFound: 0,
    };
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function normalizeText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
}

function stripDescriptors(value: string): string {
  let cleaned = value;
  for (const phrase of DESCRIPTOR_PHRASES) {
    const regex = new RegExp(`\\b${escapeRegExp(phrase)}\\b`, 'g');
    cleaned = cleaned.replace(regex, ' ');
  }
  return normalizeText(cleaned);
}

function getMeaningfulTokens(words: string[]): string[] {
  return words.filter((word) => word && !STOPWORDS.has(word));
}

function countMeaningfulOverlap(queryTokens: string[], matchName: string): number {
  const matchTokens = new Set(matchName.split(/\s+/).filter(Boolean));
  return queryTokens.reduce((count, token) => count + (matchTokens.has(token) ? 1 : 0), 0);
}

function shouldRejectPartialMatch(queryWords: string[], meaningfulTokens: string[], matchName: string): boolean {
  const hasCrossCuisine = queryWords.some((w) => CROSS_CUISINE_TERMS.has(w));
  const overlap = countMeaningfulOverlap(meaningfulTokens, matchName);
  if (hasCrossCuisine && overlap < 2) return true;
  if (queryWords.length >= 2 && overlap === 0) return true;
  return false;
}

function buildTokenAndFilter(first: string, second: string): string {
  const filters = [
    `and(name_en.ilike.%${first}%,name_en.ilike.%${second}%)`,
    `and(name_bm.ilike.%${first}%,name_bm.ilike.%${second}%)`,
    `and(name_en.ilike.%${first}%,name_bm.ilike.%${second}%)`,
    `and(name_en.ilike.%${second}%,name_bm.ilike.%${first}%)`,
  ];
  return filters.join(',');
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function mapDBRowToMatchedFood(row: any): MatchedFood {
  return {
    id: row.id,
    name_en: row.name_en,
    name_bm: row.name_bm,
    category: row.category,
    serving_description: row.serving_description || `${row.serving_grams}g`,
    serving_grams: row.serving_grams,
    macros: {
      calories_kcal: row.calories_kcal,
      protein_g: row.protein_g || 0,
      carbs_g: row.carbs_g || 0,
      total_fat_g: row.total_fat_g || 0,
      sugar_g: row.sugar_g ?? null,
      sodium_mg: row.sodium_mg ?? null,
      saturated_fat_g: row.saturated_fat_g ?? null,
      fiber_g: row.fiber_g ?? null,
      cholesterol_mg: row.cholesterol_mg ?? null,
      phosphorus_mg: row.phosphorus_mg ?? null,
      potassium_mg: row.potassium_mg ?? null,
    },
    ratings: {
      diabetes_rating: row.diabetes_rating ?? null,
      hypertension_rating: row.hypertension_rating ?? null,
      cholesterol_rating: row.cholesterol_rating ?? null,
      ckd_rating: row.ckd_rating ?? null,
    },
  };
}

// ============================================
// EXPORT FOR TESTING
// ============================================

export const _testing = {
  searchMalaysianDB,
  CONFIDENCE_THRESHOLDS,
  MIN_DB_CONFIDENCE,
};

