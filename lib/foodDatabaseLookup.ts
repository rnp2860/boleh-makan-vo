// lib/foodDatabaseLookup.ts
// 🍽️ Database-First Food Lookup System
// Uses 116,000+ food database including 1,300+ Malaysian dishes with verified nutrition

import { getSupabaseClient } from '@/lib/supabase';

// ============================================
// TYPES
// ============================================

export interface FoodMatch {
  name: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sugar_g: number;
  sodium_mg: number;
  serving_size: string;
  tags: string;
  source: string;
  match_confidence: number;
  match_type: 'exact' | 'fuzzy' | 'none';
}

export interface DatabaseLookupResult {
  found: boolean;
  match: FoodMatch | null;
  suggestions: FoodMatch[];
}

// ============================================
// MAIN LOOKUP FUNCTION
// ============================================

/**
 * Search food database with fuzzy matching
 * Priority: Exact match > Fuzzy match > No match (use AI)
 */
export async function searchFoodDatabase(foodName: string): Promise<FoodMatch | null> {
  try {
    const supabase = getSupabaseClient();
    const normalizedName = foodName.toLowerCase().trim();
    
    // 1. Try exact match first
    const { data: exactMatch, error: exactError } = await supabase
      .from('food_library')
      .select('*')
      .ilike('name', normalizedName)
      .limit(1)
      .maybeSingle();
    
    if (!exactError && exactMatch) {
      console.log('🎯 Database: Exact match found -', exactMatch.name);
      return {
        name: exactMatch.name,
        category: exactMatch.category || 'Other',
        calories: exactMatch.calories || 0,
        protein: exactMatch.protein || 0,
        carbs: exactMatch.carbs || 0,
        fat: exactMatch.fat || 0,
        sugar_g: exactMatch.sugar_g || 0,
        sodium_mg: exactMatch.sodium_mg || 0,
        serving_size: exactMatch.serving_size || '1 serving',
        tags: exactMatch.tags || '',
        source: exactMatch.source || 'food_library',
        match_confidence: 1.0,
        match_type: 'exact'
      };
    }
    
    // 2. Try fuzzy match with common variations
    const fuzzyPatterns = generateFuzzyPatterns(normalizedName);
    
    for (const pattern of fuzzyPatterns) {
      if (pattern.length < 3) continue; // Skip very short patterns
      
      const { data: fuzzyMatches, error: fuzzyError } = await supabase
        .from('food_library')
        .select('*')
        .ilike('name', `%${pattern}%`)
        .limit(10);
      
      if (!fuzzyError && fuzzyMatches && fuzzyMatches.length > 0) {
        // Score and return best match
        const bestMatch = scoreFuzzyMatches(normalizedName, fuzzyMatches);
        if (bestMatch && bestMatch.match_confidence > 0.7) {
          console.log('🔍 Database: Fuzzy match found -', bestMatch.name, `(${(bestMatch.match_confidence * 100).toFixed(0)}% confidence)`);
          return bestMatch;
        }
      }
    }
    
    // 3. Try word-by-word search for compound names
    const words = normalizedName.split(' ').filter(w => w.length > 2);
    if (words.length >= 2) {
      // Search for first significant word
      const { data: wordMatches, error: wordError } = await supabase
        .from('food_library')
        .select('*')
        .or(words.slice(0, 3).map(w => `name.ilike.%${w}%`).join(','))
        .limit(20);
      
      if (!wordError && wordMatches && wordMatches.length > 0) {
        const bestMatch = scoreFuzzyMatches(normalizedName, wordMatches);
        if (bestMatch && bestMatch.match_confidence > 0.6) {
          console.log('📚 Database: Word match found -', bestMatch.name, `(${(bestMatch.match_confidence * 100).toFixed(0)}% confidence)`);
          return bestMatch;
        }
      }
    }
    
    // 4. No good match found
    console.log('❌ Database: No match found for', foodName);
    return null;
    
  } catch (error) {
    console.error('Database lookup error:', error);
    return null;
  }
}

// ============================================
// FUZZY PATTERN GENERATION
// ============================================

/**
 * Generate fuzzy search patterns for Malaysian food names
 */
function generateFuzzyPatterns(name: string): string[] {
  const patterns = [name];
  
  // Common Malaysian food name variations (bidirectional)
  const replacements: [string, string][] = [
    // Rice dishes
    ['nasi', 'rice'],
    ['nasi lemak', 'coconut rice'],
    ['nasi goreng', 'fried rice'],
    ['nasi ayam', 'chicken rice'],
    ['nasi kandar', 'kandar rice'],
    
    // Proteins
    ['ayam', 'chicken'],
    ['ikan', 'fish'],
    ['udang', 'prawn'],
    ['udang', 'shrimp'],
    ['daging', 'beef'],
    ['kambing', 'mutton'],
    ['sotong', 'squid'],
    ['telur', 'egg'],
    ['tauhu', 'tofu'],
    ['tempe', 'tempeh'],
    
    // Cooking methods
    ['goreng', 'fried'],
    ['rebus', 'boiled'],
    ['bakar', 'grilled'],
    ['kukus', 'steamed'],
    ['panggang', 'roasted'],
    
    // Noodles
    ['kuey teow', 'kway teow'],
    ['kuey teow', 'kuetiau'],
    ['kuey teow', 'kwetiau'],
    ['char kuey teow', 'ckt'],
    ['mee goreng', 'fried noodles'],
    ['mee', 'noodles'],
    ['mihun', 'vermicelli'],
    ['bihun', 'vermicelli'],
    ['laksa', 'laksa'],
    
    // Drinks
    ['teh tarik', 'pulled tea'],
    ['teh', 'tea'],
    ['kopi', 'coffee'],
    ['air', 'water'],
    ['sirap', 'syrup'],
    
    // Breads
    ['roti canai', 'roti chanai'],
    ['roti', 'bread'],
    ['tosai', 'thosai'],
    ['chapati', 'capati'],
    
    // Other common terms
    ['rendang', 'beef rendang'],
    ['lemak', 'coconut'],
    ['sambal', 'chili'],
    ['kari', 'curry'],
    ['curry', 'kari'],
    ['sup', 'soup'],
    ['satay', 'sate'],
    ['sate', 'satay'],
  ];
  
  for (const [from, to] of replacements) {
    if (name.includes(from)) {
      patterns.push(name.replace(from, to));
    }
    if (name.includes(to)) {
      patterns.push(name.replace(to, from));
    }
  }
  
  // Extract key words (remove common stop words)
  const stopWords = ['with', 'and', 'the', 'a', 'an', 'in', 'on', 'special', 'extra', 'set', 'combo', 'menu'];
  const keywords = name.split(' ').filter(w => !stopWords.includes(w) && w.length > 2);
  
  if (keywords.length >= 2) {
    // Add combinations of first 2-3 keywords
    patterns.push(keywords.slice(0, 2).join(' '));
    if (keywords.length >= 3) {
      patterns.push(keywords.slice(0, 3).join(' '));
    }
  }
  
  // Add individual significant keywords
  for (const keyword of keywords) {
    if (keyword.length >= 4) {
      patterns.push(keyword);
    }
  }
  
  return [...new Set(patterns)]; // Remove duplicates
}

// ============================================
// SCORING FUNCTIONS
// ============================================

/**
 * Score fuzzy matches by similarity
 */
function scoreFuzzyMatches(searchTerm: string, matches: any[]): FoodMatch | null {
  let bestMatch: FoodMatch | null = null;
  let highestScore = 0;
  
  for (const match of matches) {
    const matchName = (match.name || '').toLowerCase();
    const score = calculateSimilarity(searchTerm, matchName);
    
    if (score > highestScore) {
      highestScore = score;
      bestMatch = {
        name: match.name,
        category: match.category || 'Other',
        calories: match.calories || 0,
        protein: match.protein || 0,
        carbs: match.carbs || 0,
        fat: match.fat || 0,
        sugar_g: match.sugar_g || 0,
        sodium_mg: match.sodium_mg || 0,
        serving_size: match.serving_size || '1 serving',
        tags: match.tags || '',
        source: match.source || 'food_library',
        match_confidence: score,
        match_type: 'fuzzy' as const
      };
    }
  }
  
  return bestMatch;
}

/**
 * Calculate similarity between two strings (0-1)
 * Uses word overlap + substring matching
 */
function calculateSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  
  // Exact match after normalization
  if (aLower === bLower) return 1;
  
  // Check if one contains the other
  if (bLower.includes(aLower)) return 0.95;
  if (aLower.includes(bLower)) return 0.9;
  
  // Word-based similarity
  const aWords = new Set(aLower.split(/\s+/).filter(w => w.length > 2));
  const bWords = new Set(bLower.split(/\s+/).filter(w => w.length > 2));
  
  let matches = 0;
  let partialMatches = 0;
  
  for (const word of aWords) {
    if (bWords.has(word)) {
      matches++;
    } else {
      // Check for partial matches
      for (const bWord of bWords) {
        if (bWord.includes(word) || word.includes(bWord)) {
          partialMatches += 0.5;
          break;
        }
      }
    }
  }
  
  const totalWords = Math.max(aWords.size, bWords.size);
  if (totalWords === 0) return 0;
  
  const wordScore = (matches + partialMatches) / totalWords;
  
  // Bonus for matching key Malaysian food terms
  const keyTerms = ['nasi', 'mee', 'kuey', 'roti', 'ayam', 'ikan', 'goreng', 'lemak'];
  let keyTermBonus = 0;
  for (const term of keyTerms) {
    if (aLower.includes(term) && bLower.includes(term)) {
      keyTermBonus += 0.1;
    }
  }
  
  return Math.min(1, wordScore + keyTermBonus);
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get multiple similar foods for suggestions
 */
export async function getSimilarFoods(foodName: string, limit = 5): Promise<FoodMatch[]> {
  try {
    const supabase = getSupabaseClient();
    const firstWord = foodName.split(' ')[0];
    
    if (firstWord.length < 2) return [];
    
    const { data, error } = await supabase
      .from('food_library')
      .select('*')
      .ilike('name', `%${firstWord}%`)
      .limit(limit);
    
    if (error || !data) return [];
    
    return data.map(item => ({
      name: item.name,
      category: item.category || 'Other',
      calories: item.calories || 0,
      protein: item.protein || 0,
      carbs: item.carbs || 0,
      fat: item.fat || 0,
      sugar_g: item.sugar_g || 0,
      sodium_mg: item.sodium_mg || 0,
      serving_size: item.serving_size || '1 serving',
      tags: item.tags || '',
      source: item.source || 'food_library',
      match_confidence: 0.5,
      match_type: 'fuzzy' as const
    }));
  } catch (error) {
    console.error('getSimilarFoods error:', error);
    return [];
  }
}

/**
 * Map database tags to category
 */
export function mapTagToCategory(tag: string): string {
  const mapping: Record<string, string> = {
    'chinese_noodles': 'Chinese',
    'chinese_rice': 'Chinese',
    'chinese_dimsum': 'Chinese',
    'chinese_sides': 'Chinese',
    'malay_rice': 'Malay',
    'malay_noodles': 'Malay',
    'malay_sides': 'Malay',
    'malay_desserts': 'Dessert',
    'indian_rice': 'Indian',
    'indian_breads': 'Indian',
    'mamak_snacks': 'Mamak',
    'mamak': 'Mamak',
    'beverages_cold': 'Beverage',
    'beverages_hot': 'Beverage',
    'drinks': 'Beverage',
    'western_breakfast': 'Western',
    'western_mains': 'Western',
    'snacks_fried': 'Snack',
    'snacks': 'Snack',
    'bakery': 'Bakery',
    'dessert': 'Dessert',
    'vegetarian': 'Vegetarian',
    'healthy_options': 'Healthy',
    'seafood': 'Seafood',
    'rice': 'Rice',
    'noodles': 'Noodles',
  };
  
  const lowerTag = (tag || '').toLowerCase();
  return mapping[lowerTag] || 'Other';
}

/**
 * Check for pork indicators in food name/tags
 */
export function checkPorkIndicators(name: string, tags: string = ''): boolean {
  const porkKeywords = [
    'pork', 'bak', 'char siu', 'char siew', 'siu yuk', 'siew yoke',
    'lap cheong', 'bacon', 'ham', 'lard', 'pig', 'babi', 'lap mei',
    'cha siu', 'charsiu', 'roast pork', 'pork belly'
  ];
  const combined = `${name} ${tags}`.toLowerCase();
  return porkKeywords.some(kw => combined.includes(kw));
}

/**
 * Detect protein type from food name
 */
export function detectProteinFromName(name: string): string {
  const lowerName = name.toLowerCase();
  
  // Check in order of specificity
  if (lowerName.includes('pork') || lowerName.includes('bak kut') || lowerName.includes('char siu') || lowerName.includes('babi')) return 'pork';
  if (lowerName.includes('chicken') || lowerName.includes('ayam')) return 'chicken';
  if (lowerName.includes('beef') || lowerName.includes('daging lembu')) return 'beef';
  if (lowerName.includes('mutton') || lowerName.includes('kambing')) return 'mutton';
  if (lowerName.includes('duck') || lowerName.includes('itik')) return 'duck';
  if (lowerName.includes('fish') || lowerName.includes('ikan')) return 'fish';
  if (lowerName.includes('prawn') || lowerName.includes('udang') || lowerName.includes('shrimp')) return 'prawn';
  if (lowerName.includes('squid') || lowerName.includes('sotong')) return 'squid';
  if (lowerName.includes('seafood') || lowerName.includes('laut')) return 'seafood';
  if (lowerName.includes('egg') || lowerName.includes('telur')) return 'egg';
  if (lowerName.includes('tofu') || lowerName.includes('tauhu') || lowerName.includes('tahu')) return 'tofu';
  if (lowerName.includes('tempeh') || lowerName.includes('tempe')) return 'tempeh';
  
  return 'unknown';
}

/**
 * Generate quick health advice based on food and conditions
 */
export function generateQuickAdvice(food: FoodMatch, conditions: string[] = []): string {
  const warnings: string[] = [];
  const tips: string[] = [];
  
  // Sodium warnings
  if (food.sodium_mg > 1000) {
    if (conditions.includes('hypertension') || conditions.includes('High Blood Pressure')) {
      warnings.push(`⚠️ High sodium (${food.sodium_mg}mg) - jaga BP ya!`);
    } else {
      tips.push(`Sodium: ${food.sodium_mg}mg (high)`);
    }
  }
  
  // Sugar warnings
  if (food.sugar_g > 15) {
    if (conditions.includes('diabetes') || conditions.includes('Diabetes')) {
      warnings.push(`⚠️ Sugar content ${food.sugar_g}g - monitor your glucose.`);
    } else {
      tips.push(`Sugar: ${food.sugar_g}g`);
    }
  }
  
  // Calorie info
  if (food.calories > 700) {
    warnings.push(`🔥 ${food.calories} kcal - quite a filling meal!`);
  } else if (food.calories > 500) {
    tips.push(`${food.calories} kcal - decent portion.`);
  }
  
  // Fat content
  if (food.fat > 30) {
    if (conditions.includes('cholesterol') || conditions.includes('High Cholesterol')) {
      warnings.push(`⚠️ High fat (${food.fat}g) - watch your cholesterol.`);
    }
  }
  
  // Build response
  if (warnings.length > 0) {
    return warnings.join(' ');
  }
  
  if (tips.length > 0) {
    return `${food.name} - ${tips.join(', ')}. Enjoy!`;
  }
  
  return `${food.name} - ${food.calories} kcal. Enjoy in moderation! 😊`;
}

