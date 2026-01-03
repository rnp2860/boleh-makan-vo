// lib/food/matcher.ts
// 🎯 3-Tier Food Matching System with Malaysian Keyword Detection

import { searchMalaysianFoodDatabase } from '@/lib/malaysianFoodDatabaseLookup';
import { searchFoodDatabase } from '@/lib/foodDatabaseLookup';

export interface MatchResult {
  matched: boolean;
  source: 'malaysian_db' | 'international_db' | 'ai_estimated';
  food: any | null;
  aiEstimate: any | null;
  confidence: number;
  requiresVerification: boolean;
  matchReason?: string;
}

// 🇲🇾 Malaysian food keywords - used to determine if we should try Malaysian DB
const MALAYSIAN_KEYWORDS = [
  // Malay words
  'nasi', 'mee', 'mi', 'roti', 'kuih', 'kueh', 'sambal', 'rendang', 'laksa', 'satay', 'goreng', 'lemak',
  'ayam', 'ikan', 'teh', 'kopi', 'sotong', 'udang', 'daging', 'kambing', 'itik', 'bebek',
  'sayur', 'sayuran', 'ulam', 'kerabu', 'acar', 'paceri', 'pajeri',
  'rebus', 'bakar', 'panggang', 'kukus', 'celup', 'goreng', 'tumis',
  'kuah', 'masak', 'gulai', 'curry', 'kari', 'asam', 'pedas', 'manis', 'masam',
  // Specific dish names
  'lemak', 'dagang', 'kerabu', 'ulam', 'lauk', 'rojak', 'cendol', 'ais kacang', 'abc',
  'pau', 'popiah', 'apam', 'kuih lapis', 'ondeh', 'sago', 'pengat',
  'ketupat', 'lontong', 'bubur', 'porridge',
  // Chinese-Malaysian
  'char kuey teow', 'wan tan', 'wantan', 'hokkien', 'bak kut teh', 'economy rice', 'chap fan',
  'chicken rice', 'duck rice', 'yong tau foo', 'lok lok', 'dim sum',
  // Indian-Malaysian
  'roti canai', 'roti prata', 'chapati', 'naan', 'thosai', 'tosai', 'dosa', 'briyani', 'biryani',
  'murtabak', 'martabak', 'vadai', 'vadeh', 'banana leaf rice', 'teh tarik', 'teh halia',
  // Drinks
  'teh', 'kopi', 'milo', 'sirap', 'bandung', 'cincau', 'limau', 'laici', 'susu', 'air',
  'ais', 'panas', 'tarik', 'halia', 'o', 'c', 'kosong',
];

// 🔍 Check if food name likely refers to Malaysian cuisine
export function isMalaysianFood(foodName: string): boolean {
  const lowerName = foodName.toLowerCase();
  return MALAYSIAN_KEYWORDS.some(keyword => lowerName.includes(keyword));
}

// 🔍 Calculate match confidence between two strings (simple word overlap)
function calculateStringConfidence(str1: string, str2: string): number {
  const words1 = str1.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  const words2 = str2.toLowerCase().split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0) return 0;
  
  const matchCount = words1.filter(w => words2.some(w2 => w2.includes(w) || w.includes(w2))).length;
  return matchCount / words1.length;
}

// 🎯 Main matching function with 3-tier logic
export async function matchFoodToDatabase(
  visionResult: {
    food_name: string;
    confidence_score?: number;
    nutrition?: any;
    category?: string;
  }
): Promise<MatchResult> {
  const foodName = visionResult.food_name.toLowerCase();
  const aiConfidence = visionResult.confidence_score || 0.5;
  
  console.log(`🔍 Starting 3-tier food matching for: "${visionResult.food_name}"`);
  
  // TIER 1: Try Malaysian DB (only if likely Malaysian food)
  const mightBeMalaysian = isMalaysianFood(foodName);
  
  if (mightBeMalaysian) {
    console.log('  ✅ Malaysian keywords detected, searching Malaysian DB...');
    
    try {
      const malaysianMatch = await searchMalaysianFoodDatabase(visionResult.food_name);
      
      if (malaysianMatch && malaysianMatch.match_confidence > 0.7) {
        console.log(`  ✅ Malaysian DB match: "${malaysianMatch.name_en}" (${(malaysianMatch.match_confidence * 100).toFixed(0)}% confidence)`);
        
        return {
          matched: true,
          source: 'malaysian_db',
          food: malaysianMatch,
          aiEstimate: null,
          confidence: malaysianMatch.match_confidence,
          requiresVerification: malaysianMatch.match_confidence < 0.9,
          matchReason: `Matched to Malaysian database: ${malaysianMatch.name_bm}`
        };
      } else {
        console.log('  ⚠️ Malaysian DB search returned low confidence, continuing to next tier...');
      }
    } catch (error) {
      console.error('  ❌ Malaysian DB search error:', error);
    }
  } else {
    console.log('  ℹ️ No Malaysian keywords detected, skipping Malaysian DB...');
  }
  
  // TIER 2: Try International DB (generic food database)
  console.log('  🌍 Searching international food database...');
  
  try {
    const internationalMatch = await searchFoodDatabase(visionResult.food_name);
    
    if (internationalMatch && internationalMatch.match_confidence > 0.7) {
      console.log(`  ✅ International DB match: "${internationalMatch.name}" (${(internationalMatch.match_confidence * 100).toFixed(0)}% confidence)`);
      
      return {
        matched: true,
        source: 'international_db',
        food: internationalMatch,
        aiEstimate: null,
        confidence: internationalMatch.match_confidence,
        requiresVerification: internationalMatch.match_confidence < 0.85,
        matchReason: `Matched to international database`
      };
    } else {
      console.log('  ⚠️ International DB search returned low confidence...');
    }
  } catch (error) {
    console.error('  ❌ International DB search error:', error);
  }
  
  // TIER 3: AI Estimation Fallback
  console.log('  🤖 No database match found, using AI estimate');
  
  return {
    matched: false,
    source: 'ai_estimated',
    food: null,
    aiEstimate: {
      food_name: visionResult.food_name, // Keep AI's original name
      nutrition: visionResult.nutrition,
      category: visionResult.category,
    },
    confidence: aiConfidence,
    requiresVerification: true, // Always verify AI estimates
    matchReason: `AI vision estimate (no database match found)`
  };
}

// 🔍 Search Malaysian DB with scoring
async function searchMalaysianDB(query: string): Promise<{ food: any; confidence: number } | null> {
  try {
    const match = await searchMalaysianFoodDatabase(query);
    
    if (!match) {
      return null;
    }
    
    // Calculate additional confidence based on name similarity
    const nameConfidence = Math.max(
      calculateStringConfidence(query, match.name_en),
      calculateStringConfidence(query, match.name_bm || '')
    );
    
    // Combine database confidence with name similarity
    const combinedConfidence = (match.match_confidence + nameConfidence) / 2;
    
    // Only return if confidence is reasonable
    if (combinedConfidence >= 0.5) {
      return { food: match, confidence: combinedConfidence };
    }
    
    return null;
  } catch (error) {
    console.error('searchMalaysianDB error:', error);
    return null;
  }
}

