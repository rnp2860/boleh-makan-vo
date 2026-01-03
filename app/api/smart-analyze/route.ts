import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getSupabaseClient } from '@/lib/supabase';
import { 
  DR_REZA_ADVISOR_PROMPT,
  DR_REZA_SIMPLE_PROMPT,
  buildDrRezaPromptWithContext,
  parseDrRezaResponse,
  formatDrRezaAdvice,
  getDefaultDailyContext,
  MealData,
  DailyContext,
  DrRezaResponse
} from '@/lib/advisorPrompts';
import { getDailyContext, getQuickDailyContext, predictGlucoseImpact } from '@/lib/dailyContextHelper';
import { 
  MALAYSIAN_FOOD_VISION_PROMPT, 
  TEXT_INPUT_VALIDATION_PROMPT,
  buildVisionPromptWithCorrections,
  CorrectionEntry 
} from '@/lib/visionPrompts';
import {
  searchFoodDatabase,
  mapTagToCategory,
  checkPorkIndicators,
  detectProteinFromName,
  generateQuickAdvice,
  FoodMatch
} from '@/lib/foodDatabaseLookup';
import {
  searchMalaysianFoodDatabase,
  getMalaysianFoodComponents,
  generateMalaysianFoodAdvice
} from '@/lib/malaysianFoodDatabaseLookup';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// 🔄 RLHF: Fetch recent user corrections for prompt injection
async function fetchRecentCorrections(): Promise<CorrectionEntry[]> {
  try {
    const supabase = getSupabaseClient();
    const { data: corrections, error } = await supabase
      .from('food_logs')
      .select('ai_suggested_name, meal_name')
      .eq('was_user_corrected', true)
      .not('ai_suggested_name', 'is', null)
      .order('created_at', { ascending: false })
      .limit(200);

    if (error || !corrections) {
      console.log('📋 No corrections found or error:', error?.message);
      return [];
    }

    // Group and count corrections
    const correctionMap = new Map<string, { correctedName: string; count: number }>();

    for (const entry of corrections) {
      const aiName = entry.ai_suggested_name?.toLowerCase().trim();
      const userCorrectedName = entry.meal_name?.trim();

      if (!aiName || !userCorrectedName) continue;
      if (aiName === userCorrectedName.toLowerCase()) continue;

      const existing = correctionMap.get(aiName);
      if (existing) {
        if (existing.correctedName.toLowerCase() === userCorrectedName.toLowerCase()) {
          existing.count++;
        }
      } else {
        correctionMap.set(aiName, { correctedName: userCorrectedName, count: 1 });
      }
    }

    const sorted = Array.from(correctionMap.entries())
      .map(([aiName, { correctedName, count }]) => ({
        ai_suggested_name: aiName,
        food_name: correctedName,
        correction_count: count,
      }))
      .sort((a, b) => b.correction_count - a.correction_count)
      .slice(0, 50);

    console.log(`🧠 RLHF: Loaded ${sorted.length} corrections for prompt injection`);
    return sorted;

  } catch (err) {
    console.error('Error fetching corrections:', err);
    return [];
  }
}

// 🐷 HALAL SAFETY
const PORK_KEYWORDS = ['babi', 'pork', 'bacon', 'ham', 'lard', 'gelatin', 'char siu', 'siew yuk', 'lap cheong'];
const NON_HALAL_INGREDIENTS = ['pork', 'babi', 'bacon', 'ham', 'lard', 'wine', 'beer', 'alcohol', 'mirin', 'char siu', 'lap cheong', 'chinese sausage'];

function cleanFoodName(rawName: string): string {
  const removePatterns = [/asian home gourmet/gi, /spice mix for/gi, /singapore/gi, /coconut rice,?\s*/gi, /instant/gi, /ready to eat/gi, /frozen/gi, /brand.*$/gi];
  let cleaned = rawName;
  removePatterns.forEach(pattern => { cleaned = cleaned.replace(pattern, ''); });
  cleaned = cleaned.replace(/,+/g, ',').replace(/\s+/g, ' ').trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
  
  if (cleaned.length < 3) {
    const knownDishes = ['nasi lemak', 'char kuey teow', 'roti canai', 'nasi goreng', 'mee goreng', 'laksa', 'rendang', 'satay', 'mee hoon', 'kuey teow'];
    const lower = rawName.toLowerCase();
    for (const dish of knownDishes) {
      if (lower.includes(dish)) return dish.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function buildHealthTags(food: any): string[] {
  const tags: string[] = [];
  
  // Check sodium
  if (food.sodium_mg > 600) {
    tags.push('high_sodium');
  }
  
  // Check sugar
  if (food.sugar_g > 15) {
    tags.push('high_sugar');
  }
  
  // Check saturated fat
  if (food.saturated_fat_g && food.saturated_fat_g > 5) {
    tags.push('high_saturated_fat');
  }
  
  // Check protein
  if (food.protein > 20) {
    tags.push('high_protein');
  }
  
  return tags;
}

function checkHalalStatus(foodName: string, components: any[]): { status: 'halal' | 'non_halal' | 'unknown', reason?: string } {
  const allText = (foodName + ' ' + components.map(c => c.name).join(' ')).toLowerCase();
  for (const keyword of NON_HALAL_INGREDIENTS) {
    if (allText.includes(keyword.toLowerCase())) return { status: 'non_halal', reason: `Contains ${keyword}` };
  }
  return { status: 'unknown' };
}

// 🥗 TYPICAL COMPONENTS with sugar & sodium estimates
function getTypicalComponents(foodName: string, baseMacros: any): any[] {
  const lower = foodName.toLowerCase();
  
  const componentMap: Record<string, any[]> = {
    'nasi lemak': [
      { name: 'Nasi Santan', calories: 200, macros: { p: 4, c: 40, f: 5, sugar: 1, sodium: 150 } },
      { name: 'Sambal', calories: 50, macros: { p: 1, c: 5, f: 3, sugar: 3, sodium: 400 } },
      { name: 'Ikan Bilis', calories: 40, macros: { p: 5, c: 0, f: 2, sugar: 0, sodium: 300 } },
      { name: 'Kacang Tanah', calories: 50, macros: { p: 2, c: 2, f: 4, sugar: 0, sodium: 50 } },
      { name: 'Timun', calories: 5, macros: { p: 0, c: 1, f: 0, sugar: 1, sodium: 2 } },
      { name: 'Telur Rebus', calories: 70, macros: { p: 6, c: 0, f: 5, sugar: 0, sodium: 70 } },
    ],
    'char kuey teow': [
      { name: 'Flat Rice Noodles', calories: 220, macros: { p: 4, c: 45, f: 2, sugar: 1, sodium: 200 } },
      { name: 'Prawns', calories: 60, macros: { p: 12, c: 0, f: 1, sugar: 0, sodium: 150 } },
      { name: 'Cockles', calories: 30, macros: { p: 5, c: 1, f: 1, sugar: 0, sodium: 200 } },
      { name: 'Bean Sprouts', calories: 15, macros: { p: 1, c: 2, f: 0, sugar: 1, sodium: 5 } },
      { name: 'Egg', calories: 70, macros: { p: 6, c: 0, f: 5, sugar: 0, sodium: 70 } },
      { name: 'Dark Soy Sauce', calories: 15, macros: { p: 1, c: 2, f: 0, sugar: 2, sodium: 600 } },
    ],
    'roti canai': [
      { name: 'Roti Canai', calories: 250, macros: { p: 6, c: 35, f: 10, sugar: 2, sodium: 400 } },
      { name: 'Dhal Curry', calories: 80, macros: { p: 5, c: 12, f: 2, sugar: 2, sodium: 350 } },
    ],
    'teh tarik': [
      { name: 'Teh Tarik', calories: 120, macros: { p: 2, c: 20, f: 4, sugar: 18, sodium: 50 } },
    ],
    'milo': [
      { name: 'Milo', calories: 150, macros: { p: 3, c: 25, f: 4, sugar: 22, sodium: 80 } },
    ],
  };

  for (const [dish, components] of Object.entries(componentMap)) {
    if (lower.includes(dish)) return components;
  }
  
  return [{
    name: foodName,
    calories: baseMacros.calories || 300,
    macros: { p: baseMacros.protein_g || 10, c: baseMacros.carbs_g || 40, f: baseMacros.fat_g || 10, sugar: 5, sodium: 400 }
  }];
}

export async function POST(req: Request) {
  try {
    const { type, data, healthConditions, userId } = await req.json();
    let foodName = '';
    let visionCategory = 'Other'; // Category from vision analysis
    let visionNutrition: any = null; // Nutrition estimates from vision
    let visionConfidence = 0;
    
    // 🗓️ Fetch daily context for personalized Dr. Reza advice
    let dailyContext: DailyContext = getDefaultDailyContext();
    if (userId) {
      try {
        dailyContext = await getQuickDailyContext(userId);
        console.log(`📊 Daily context loaded: ${dailyContext.daily_calories_before}/${dailyContext.daily_target} cal, ${dailyContext.meals_today} meals`);
      } catch (err) {
        console.warn('Could not fetch daily context, using defaults:', err);
      }
    }
    
    // Set health conditions from context if not provided
    const conditions = healthConditions && healthConditions.length > 0 
      ? healthConditions 
      : dailyContext.health_conditions;
    let isPotentiallyPork = false;
    let detectedComponents: string[] = [];
    let detectedProtein = 'none'; // NEW: Track detected protein type
    
    // 📏 Portion estimation variables
    let portionEstimation = {
      size_category: 'regular' as 'small' | 'regular' | 'large' | 'extra_large' | 'sharing',
      multiplier: 1.0,
      visual_reasoning: 'Default portion assumption'
    };
    let baseNutrition: any = null;

    // 🧠 STEP 1: IDENTIFY THE FOOD (Using comprehensive vision analysis)
    if (type === 'image') {
      console.log("🔍 Starting vision analysis...");
      
      // 🔄 RLHF: Fetch user corrections and inject into prompt
      const corrections = await fetchRecentCorrections();
      const enhancedPrompt = corrections.length > 0 
        ? buildVisionPromptWithCorrections(corrections)
        : MALAYSIAN_FOOD_VISION_PROMPT;
      
      console.log(`🧠 RLHF: Using prompt with ${corrections.length} corrections`);
      
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: enhancedPrompt
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Analyze this Malaysian food image and return the required JSON." },
              { type: "image_url", image_url: { url: data, detail: "low" } }
            ]
          }
        ],
        response_format: { type: "json_object" },
        max_tokens: 500,
      });
      
      // Parse the comprehensive vision response
      const visionResult = JSON.parse(visionResponse.choices[0].message.content || '{}');
      console.log("🔍 Vision result:", visionResult);
      
      foodName = visionResult.food_name || "Unknown Food";
      visionCategory = visionResult.category || 'Other';
      visionConfidence = visionResult.confidence_score || 0.5;
      isPotentiallyPork = visionResult.is_potentially_pork || false;
      
      // 📏 Use ADJUSTED nutrition (with portion multiplier) if available, otherwise fall back
      visionNutrition = visionResult.adjusted_nutrition || visionResult.base_nutrition || visionResult.nutrition || null;
      
      // Store portion estimation for response
      if (visionResult.portion_estimation) {
        portionEstimation = {
          size_category: visionResult.portion_estimation.size_category || 'regular',
          multiplier: visionResult.portion_estimation.multiplier || 1.0,
          visual_reasoning: visionResult.portion_estimation.visual_reasoning || 'Default portion assumption'
        };
      }
      
      // Store base nutrition for reference
      baseNutrition = visionResult.base_nutrition || visionResult.nutrition || null;
      
      console.log(`📏 Portion: ${portionEstimation.size_category} (${portionEstimation.multiplier}x) - ${portionEstimation.visual_reasoning}`);
      
      detectedComponents = visionResult.detected_components || [];
      detectedProtein = visionResult.detected_protein || 'none';
      
      // 🐷 AGGRESSIVE PORK FLAGGING based on detected_protein
      // If model detected pork or ambiguous red meat, ALWAYS flag as potentially pork
      if (detectedProtein === 'pork' || detectedProtein === 'ambiguous_red_meat') {
        console.log(`⚠️ Detected protein: ${detectedProtein} - forcing pork flag`);
        isPotentiallyPork = true;
      }
      
      // 🚨 CATCH GENERIC LABELS - If model returned a banned generic label with meat
      const genericLabels = ['stir fry', 'fried rice', 'noodle dish', 'rice dish', 'mixed rice', 'economy rice', 'meat dish', 'asian dish', 'chinese dish'];
      const foodNameLower = foodName.toLowerCase();
      const hasGenericLabel = genericLabels.some(label => foodNameLower.includes(label) || foodNameLower === label);
      
      if (hasGenericLabel && detectedProtein !== 'none' && detectedProtein !== 'chicken' && detectedProtein !== 'seafood' && detectedProtein !== 'egg' && detectedProtein !== 'tofu') {
        // Model used a generic label despite having a non-chicken protein - this is suspicious
        console.log(`⚠️ Generic label "${foodName}" with protein "${detectedProtein}" - flagging as potentially pork`);
        isPotentiallyPork = true;
      }
      
      // 🐷 HALAL SAFETY: If potentially pork, keep original name but flag it for user confirmation
      // Don't auto-rename anymore - let the halal modal handle it
      if (isPotentiallyPork) {
        console.log("⚠️ Potentially non-halal detected - will trigger halal confirmation modal");
        // Keep the original food name so user can see what was detected
        // The frontend halal modal will handle confirmation
      }
      
      // Additional pork keyword check - flag but don't rename
      for (const keyword of PORK_KEYWORDS) {
        if (foodName.toLowerCase().includes(keyword)) {
          console.log(`⚠️ Pork keyword "${keyword}" found in "${foodName}" - flagging`);
          isPotentiallyPork = true;
          break;
        }
      }
    } else {
      // 📝 TEXT INPUT: Check MALAYSIAN database FIRST, then generic database
      console.log("📝 Text input received:", data);
      
      // 🇲🇾 PRIORITY 1: Search Malaysian food database (485 Malaysian dishes)
      const malaysianMatch = await searchMalaysianFoodDatabase(data);
      
      if (malaysianMatch && malaysianMatch.match_confidence > 0.7) {
        // 🎯 Malaysian database hit! Use verified Malaysian data
        console.log(`✅ Malaysian DB hit for "${data}" → "${malaysianMatch.name_en}" (${(malaysianMatch.match_confidence * 100).toFixed(0)}% confidence)`);
        
        const conditions = healthConditions || [];
        const drRezaTip = generateMalaysianFoodAdvice(malaysianMatch, conditions);
        
        // Build components from Malaysian food
        const components = getMalaysianFoodComponents(malaysianMatch);
        
        return NextResponse.json({
          success: true,
          source: 'malaysian_database',
          verified: true,
          confidence: malaysianMatch.match_confidence,
          data: {
            food_name: malaysianMatch.name_en,
            food_name_bm: malaysianMatch.name_bm,
            category: malaysianMatch.category,
            components: components,
            macros: {
              calories: malaysianMatch.calories,
              protein_g: malaysianMatch.protein,
              carbs_g: malaysianMatch.carbs,
              fat_g: malaysianMatch.fat,
              sugar_g: malaysianMatch.sugar_g,
              sodium_mg: malaysianMatch.sodium_mg,
              saturated_fat_g: malaysianMatch.saturated_fat_g,
              cholesterol_mg: malaysianMatch.cholesterol_mg,
              phosphorus_mg: malaysianMatch.phosphorus_mg,
              potassium_mg: malaysianMatch.potassium_mg,
              fiber_g: malaysianMatch.fiber_g
            },
            serving_size: malaysianMatch.serving_description,
            serving_grams: malaysianMatch.serving_grams,
            // Include condition ratings for multi-condition analysis
            diabetes_rating: malaysianMatch.diabetes_rating,
            hypertension_rating: malaysianMatch.hypertension_rating,
            cholesterol_rating: malaysianMatch.cholesterol_rating,
            ckd_rating: malaysianMatch.ckd_rating,
            valid_lauk: [], // Not applicable for database matches
            analysis_content: drRezaTip,
            is_potentially_pork: false,
            matched_protein: null,
            visual_notes: `From Malaysian food database: ${malaysianMatch.name_bm}`,
            health_tags: buildHealthTags(malaysianMatch)
          }
        });
      }
      
      // 🏦 PRIORITY 2: Try generic database (116k foods) as fallback
      const dbMatch = await searchFoodDatabase(data);
      
      if (dbMatch && dbMatch.match_confidence > 0.8) {
        // 🎯 Generic database hit (likely USDA/international food)
        console.log(`✅ Generic DB hit for "${data}" → "${dbMatch.name}" (${(dbMatch.match_confidence * 100).toFixed(0)}% confidence)`);
        
        const conditions = healthConditions || [];
        const drRezaTip = generateQuickAdvice(dbMatch, conditions);
        const isPork = checkPorkIndicators(dbMatch.name, dbMatch.tags);
        const protein = detectProteinFromName(dbMatch.name);
        
        // Build components
        const components = getTypicalComponents(dbMatch.name, {
          calories: dbMatch.calories,
          protein_g: dbMatch.protein,
          carbs_g: dbMatch.carbs,
          fat_g: dbMatch.fat
        });
        
        return NextResponse.json({
          success: true,
          source: 'database',
          verified: true,
          confidence: dbMatch.match_confidence,
          data: {
            food_name: dbMatch.name,
            category: mapTagToCategory(dbMatch.tags) || dbMatch.category || 'Other',
            components: components,
            macros: {
              calories: dbMatch.calories,
              protein_g: dbMatch.protein,
              carbs_g: dbMatch.carbs,
              fat_g: dbMatch.fat,
              sugar_g: dbMatch.sugar_g,
              sodium_mg: dbMatch.sodium_mg
            },
            serving_size: dbMatch.serving_size,
            valid_lauk: [
              { name: "Telur Mata", calories: 70, protein: 6, carbs: 0, fat: 5 },
              { name: "Telur Rebus", calories: 60, protein: 6, carbs: 0, fat: 4 },
              { name: "Ayam Goreng", calories: 250, protein: 20, carbs: 5, fat: 15 }
            ],
            analysis_content: drRezaTip,
            data_source: `${dbMatch.source} (verified)`,
            halal_status: { status: isPork ? 'non_halal' : 'unknown', reason: isPork ? 'May contain pork' : undefined },
            health_tags: [],
            risk_analysis: {
              is_high_sodium: (dbMatch.sodium_mg || 0) > 800,
              is_high_sugar: (dbMatch.sugar_g || 0) > 15,
              is_high_protein: (dbMatch.protein || 0) > 25
            },
            is_potentially_pork: isPork,
            detected_protein: protein
          }
        });
      }
      
      // 🤖 No good database match - use AI validation
      console.log("📝 No database match, using AI validation for:", data);
      const validationResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: TEXT_INPUT_VALIDATION_PROMPT },
          { role: "user", content: `Validate this food input: "${data}"` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 150,
      });
      
      const validation = JSON.parse(validationResponse.choices[0].message.content || '{}');
      if (!validation.is_food) {
        return NextResponse.json({ 
          success: false, 
          error: "Please enter a valid food or drink name", 
          suggestion: "Try 'Nasi Lemak', 'Roti Canai', or 'Teh Tarik'" 
        }, { status: 400 });
      }
      
      foodName = validation.cleaned_name || data;
      visionCategory = validation.category || 'Other';
      visionConfidence = validation.confidence_score || 0.8;
    }

    console.log(`✅ Identified: "${foodName}" | Category: ${visionCategory} | Confidence: ${visionConfidence}`);

    // 🏦 STEP 2: Cross-reference AI result with database for verified nutrition
    // This improves accuracy by using verified nutrition data when available
    const dbMatch = await searchFoodDatabase(foodName);
    
    // Also try a direct database lookup as fallback
    let directDbMatch: any = null;
    if (!dbMatch) {
      const supabase = getSupabaseClient();
      const { data: directMatch } = await supabase
        .from('food_library')
        .select('*, sodium_mg, sugar_g, health_tags')
        .ilike('name', `%${foodName}%`)
        .limit(1)
        .maybeSingle();
      directDbMatch = directMatch;
    }
    
    // Use either the fuzzy match or direct match
    const finalDbMatch = dbMatch || (directDbMatch ? {
      name: directDbMatch.name,
      category: directDbMatch.category,
      calories: directDbMatch.calories,
      protein: directDbMatch.protein,
      carbs: directDbMatch.carbs,
      fat: directDbMatch.fat,
      sugar_g: directDbMatch.sugar_g || directDbMatch.sugar,
      sodium_mg: directDbMatch.sodium_mg || directDbMatch.sodium,
      serving_size: directDbMatch.serving_size,
      tags: directDbMatch.tags || directDbMatch.category,
      source: directDbMatch.source || 'food_library',
      match_confidence: 0.85,
      match_type: 'direct' as const,
      health_tags: directDbMatch.health_tags,
      valid_lauk: directDbMatch.valid_lauk
    } : null);

    if (finalDbMatch) {
      // 🎯 Database match found - use verified nutrition data
      const matchSource = dbMatch ? 'database_verified' : 'database';
      console.log(`✅ Using ${matchSource} data for "${finalDbMatch.name}" (${((finalDbMatch.match_confidence || 0.85) * 100).toFixed(0)}% confidence)`);
      
      const cleanName = cleanFoodName(finalDbMatch.name);
      const components = getTypicalComponents(cleanName, {
        calories: finalDbMatch.calories, protein_g: finalDbMatch.protein, carbs_g: finalDbMatch.carbs, fat_g: finalDbMatch.fat
      });
      
      const halalCheck = checkHalalStatus(cleanName, components);
      
      // Calculate totals from components (including sugar & sodium)
      const totalFromComponents = components.reduce((acc, comp) => ({
        sugar: acc.sugar + (comp.macros?.sugar || 0),
        sodium: acc.sodium + (comp.macros?.sodium || 0),
      }), { sugar: 0, sodium: 0 });

      // 🆕 Use database values if available, otherwise use component totals or vision estimates
      const finalSodiumForAdvice = finalDbMatch.sodium_mg ?? visionNutrition?.sodium_mg ?? totalFromComponents.sodium ?? 400;
      const finalSugarForAdvice = finalDbMatch.sugar_g ?? visionNutrition?.sugar_g ?? totalFromComponents.sugar ?? 5;
      const healthTagsForAdvice = (finalDbMatch as any).health_tags || [];
      // Use DB category, then mapped tag, then vision category
      const categoryForAdvice = finalDbMatch.category || mapTagToCategory(finalDbMatch.tags) || visionCategory || 'Malay';

      // 🩺 DR. REZA - Using ENHANCED advisor prompt with daily context
      const mealData: MealData = {
        food_name: cleanName,
        category: categoryForAdvice,
        calories: finalDbMatch.calories || 0,
        protein: finalDbMatch.protein || 0,
        carbs: finalDbMatch.carbs || 0,
        fat: finalDbMatch.fat || 0,
        sugar: finalSugarForAdvice,
        sodium: finalSodiumForAdvice
      };
      
      // Build the enhanced prompt with daily context
      const enhancedPrompt = buildDrRezaPromptWithContext(mealData, dailyContext);
      
      // Get glucose prediction
      const glucosePrediction = predictGlucoseImpact(cleanName, mealData.carbs, mealData.sugar, categoryForAdvice);
      
      const drRezaResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: enhancedPrompt
          },
          {
            role: "user",
            content: `Analyze this meal and provide your advice as JSON. Remember to reference their daily totals and predict glucose impact if they have diabetes.`
          }
        ],
        max_tokens: 400,
        response_format: { type: "json_object" },
      });
      
      // Parse Dr. Reza's structured response
      const drRezaContent = drRezaResponse.choices[0].message.content?.trim() || '{}';
      const drRezaParsed = parseDrRezaResponse(drRezaContent);
      
      // Format the advice for display (falls back to simple text if JSON parsing fails)
      const drRezaTip = drRezaParsed 
        ? formatDrRezaAdvice(drRezaParsed, `${cleanName} sedap! Balance with veggies and watch your portion ya.`)
        : drRezaContent;

      // Get lauk suggestions
      let enrichedLauk: any[] = [];
      const validLauk = (finalDbMatch as any).valid_lauk;
      if (validLauk && Array.isArray(validLauk)) {
        const supabase = getSupabaseClient();
        const { data: laukData } = await supabase.from('food_library').select('name, calories, protein, carbs, fat').in('name', validLauk);
        enrichedLauk = validLauk.map((name: string) => {
          const found = laukData?.find((l) => l.name === name);
          return { name: cleanFoodName(name), calories: found?.calories || 80, protein: found?.protein || 5, carbs: found?.carbs || 5, fat: found?.fat || 3 };
        });
      }
      if (enrichedLauk.length === 0) {
        enrichedLauk = [
          { name: "Telur Mata", calories: 70, protein: 6, carbs: 0, fat: 5 },
          { name: "Telur Rebus", calories: 60, protein: 6, carbs: 0, fat: 4 },
          { name: "Ayam Goreng", calories: 250, protein: 20, carbs: 5, fat: 15 }
        ];
      }

      // Determine health warnings from tags or thresholds (reuse values from above)
      const isHighSodium = healthTagsForAdvice.includes('high_sodium') || finalSodiumForAdvice > 800;
      const isHighSugar = healthTagsForAdvice.includes('high_sugar') || finalSugarForAdvice > 15;
      const isHighProtein = healthTagsForAdvice.includes('high_protein') || (finalDbMatch.protein || 0) > 25;

      // Determine source based on match type
      const dataSource = dbMatch 
        ? (type === 'image' ? 'database_verified' : 'database')
        : 'database';

      // 📏 Apply portion multiplier to database nutrition if it's an image with portion estimation
      const portionMultiplier = type === 'image' ? portionEstimation.multiplier : 1.0;
      const adjustedCalories = Math.round((finalDbMatch.calories || 0) * portionMultiplier);
      const adjustedProtein = Math.round((finalDbMatch.protein || 0) * portionMultiplier);
      const adjustedCarbs = Math.round((finalDbMatch.carbs || 0) * portionMultiplier);
      const adjustedFat = Math.round((finalDbMatch.fat || 0) * portionMultiplier);
      const adjustedSugar = Math.round(finalSugarForAdvice * portionMultiplier);
      const adjustedSodium = Math.round(finalSodiumForAdvice * portionMultiplier);

      return NextResponse.json({
        success: true,
        source: dataSource,
        verified: true,
        confidence: finalDbMatch.match_confidence || visionConfidence || 0.9,
        data: {
          food_name: cleanName,
          category: categoryForAdvice,
          components: components,
          macros: {
            calories: adjustedCalories,
            protein_g: adjustedProtein,
            carbs_g: adjustedCarbs,
            fat_g: adjustedFat,
            sugar_g: adjustedSugar,
            sodium_mg: adjustedSodium,
          },
          // 📏 Include base nutrition and portion estimation
          base_nutrition: {
            calories: finalDbMatch.calories || 0,
            protein_g: finalDbMatch.protein || 0,
            carbs_g: finalDbMatch.carbs || 0,
            fat_g: finalDbMatch.fat || 0,
            sugar_g: finalSugarForAdvice,
            sodium_mg: finalSodiumForAdvice,
          },
          portion_estimation: type === 'image' ? portionEstimation : {
            size_category: 'regular',
            multiplier: 1.0,
            visual_reasoning: 'Text input - using standard serving'
          },
          serving_size: finalDbMatch.serving_size || '1 serving',
          valid_lauk: enrichedLauk,
          analysis_content: drRezaTip,
          // Include structured Dr. Reza response for advanced UI features
          dr_reza_analysis: drRezaParsed || null,
          glucose_prediction: glucosePrediction,
          halal_status: halalCheck,
          health_tags: healthTagsForAdvice,
          risk_analysis: { 
            is_high_sodium: isHighSodium, 
            is_high_sugar: isHighSugar,
            is_high_protein: isHighProtein
          },
          is_potentially_pork: isPotentiallyPork || checkPorkIndicators(cleanName, finalDbMatch.tags),
          detected_protein: detectedProtein || detectProteinFromName(cleanName),
          data_source: `${finalDbMatch.source} (verified)`
        }
      });
    }

    // 🤖 STEP 3: AI FALLBACK (Using vision data + Dr. Reza advice)
    console.log("Not in database, using vision data + AI advice");
    
    // Use vision nutrition if available, otherwise get typical components
    const safeFoodName = cleanFoodName(foodName);
    const halalCheck = checkHalalStatus(safeFoodName, []);
    
    // Build macros from vision data or typical components
    let finalMacros: any;
    let components: any[];
    
    if (visionNutrition && visionNutrition.calories > 0) {
      // Use vision-estimated nutrition
      finalMacros = {
        calories: visionNutrition.calories || 350,
        protein_g: visionNutrition.protein_g || 12,
        carbs_g: visionNutrition.carbs_g || 45,
        fat_g: visionNutrition.fat_g || 12,
        sugar_g: visionNutrition.sugar_g || 5,
        sodium_mg: visionNutrition.sodium_mg || 400,
      };
      // Build components from detected items
      components = detectedComponents.length > 0 
        ? detectedComponents.map(name => ({
            name,
            calories: Math.round(finalMacros.calories / detectedComponents.length),
            macros: { 
              p: Math.round(finalMacros.protein_g / detectedComponents.length), 
              c: Math.round(finalMacros.carbs_g / detectedComponents.length), 
              f: Math.round(finalMacros.fat_g / detectedComponents.length),
              sugar: Math.round(finalMacros.sugar_g / detectedComponents.length),
              sodium: Math.round(finalMacros.sodium_mg / detectedComponents.length)
            }
          }))
        : getTypicalComponents(safeFoodName, finalMacros);
    } else {
      // Fallback to typical components
      components = getTypicalComponents(safeFoodName, { calories: 350, protein_g: 12, carbs_g: 45, fat_g: 12 });
      finalMacros = components.reduce((acc: any, comp: any) => ({
        calories: acc.calories + (comp.calories || 0),
        protein_g: acc.protein_g + (comp.macros?.p || 0),
        carbs_g: acc.carbs_g + (comp.macros?.c || 0),
        fat_g: acc.fat_g + (comp.macros?.f || 0),
        sugar_g: acc.sugar_g + (comp.macros?.sugar || 0),
        sodium_mg: acc.sodium_mg + (comp.macros?.sodium || 0),
      }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sugar_g: 0, sodium_mg: 0 });
      
      // Ensure minimums
      if (finalMacros.calories === 0) {
        finalMacros = { calories: 350, protein_g: 12, carbs_g: 45, fat_g: 12, sugar_g: 5, sodium_mg: 400 };
      }
    }

    // Build health_tags from final macros
    const aiHealthTags: string[] = [];
    if (finalMacros.sodium_mg > 800) aiHealthTags.push('high_sodium');
    if (finalMacros.sugar_g > 15) aiHealthTags.push('high_sugar');
    if (finalMacros.protein_g > 25) aiHealthTags.push('high_protein');
    if (finalMacros.fat_g > 30) aiHealthTags.push('high_fat');

    // 🩺 Get Dr. Reza advice using ENHANCED prompt with daily context
    const fallbackMealData: MealData = {
      food_name: safeFoodName,
      category: visionCategory,
      calories: finalMacros.calories,
      protein: finalMacros.protein_g,
      carbs: finalMacros.carbs_g,
      fat: finalMacros.fat_g,
      sugar: finalMacros.sugar_g,
      sodium: finalMacros.sodium_mg
    };
    
    const fallbackEnhancedPrompt = buildDrRezaPromptWithContext(fallbackMealData, dailyContext);
    const fallbackGlucosePrediction = predictGlucoseImpact(safeFoodName, finalMacros.carbs_g, finalMacros.sugar_g, visionCategory);
    
    const drRezaResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: fallbackEnhancedPrompt
        },
        {
          role: "user",
          content: `Analyze this meal and provide your advice as JSON. Remember to reference their daily totals and predict glucose impact if they have diabetes.`
        }
      ],
      max_tokens: 400,
      response_format: { type: "json_object" },
    });
    
    // Parse structured response
    const fallbackDrRezaContent = drRezaResponse.choices[0].message.content?.trim() || '{}';
    const fallbackDrRezaParsed = parseDrRezaResponse(fallbackDrRezaContent);
    const drRezaTip = fallbackDrRezaParsed 
      ? formatDrRezaAdvice(fallbackDrRezaParsed, `${safeFoodName} looks good! Enjoy in moderation ya. 🍽️`)
      : fallbackDrRezaContent;

    const defaultLauk = [
      { name: "Telur Mata", calories: 70, protein: 6, carbs: 0, fat: 5 },
      { name: "Telur Rebus", calories: 60, protein: 6, carbs: 0, fat: 4 },
      { name: "Ayam Goreng", calories: 250, protein: 20, carbs: 5, fat: 15 },
    ];

    return NextResponse.json({
      success: true,
      source: 'vision_estimate',
      verified: false,
      confidence: visionConfidence,
      data: {
        food_name: safeFoodName,
        category: visionCategory,
        components: components,
        macros: finalMacros,
        // 📏 Include base nutrition and portion estimation for vision fallback
        base_nutrition: baseNutrition || finalMacros,
        portion_estimation: portionEstimation,
        valid_lauk: defaultLauk,
        // Include structured Dr. Reza response for advanced UI features
        dr_reza_analysis: fallbackDrRezaParsed || null,
        glucose_prediction: fallbackGlucosePrediction,
        analysis_content: drRezaTip,
        halal_status: halalCheck,
        health_tags: aiHealthTags,
        risk_analysis: { 
          is_high_sodium: finalMacros.sodium_mg > 800, 
          is_high_sugar: finalMacros.sugar_g > 15,
          is_high_protein: finalMacros.protein_g > 25
        },
        is_potentially_pork: isPotentiallyPork,
        detected_protein: detectedProtein
      }
    });

  } catch (err: any) {
    console.error("Smart-analyze error:", err);
    return NextResponse.json({ success: false, error: err.message || "Analysis failed" }, { status: 500 });
  }
}
