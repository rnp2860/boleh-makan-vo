// app/api/recalculate-nutrition/route.ts
// 🔄 API endpoint for recalculating nutrition when user corrects food name

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { resolveFood } from '@/lib/food/resolveFood';
import { 
  getMalaysianFoodComponents,
  generateMalaysianFoodAdvice
} from '@/lib/malaysianFoodDatabaseLookup';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { food_name, original_name, user_profile } = await req.json();

    if (!food_name) {
      return NextResponse.json(
        { success: false, error: 'food_name is required' },
        { status: 400 }
      );
    }

    console.log('🔄 Recalculating nutrition:', { food_name, original_name });
    
    // 🎯 STEP 1: Try canonical food resolution FIRST
    // This ensures user edits NEVER downgrade a DB match to an estimate
    const resolution = await resolveFood({
      inputType: 'text',
      rawName: food_name,
      userConditions: user_profile?.healthConditions || []
    });
    
    console.log(`🎯 Resolution: source=${resolution.source}, confidence=${(resolution.confidence * 100).toFixed(0)}%, strategy=${resolution.debug.strategy}`);
    
    // If we have a Malaysian DB match, return it immediately (NEVER downgrade to AI)
    if (resolution.source === 'malaysian_db' && resolution.matchedFood) {
      const matched = resolution.matchedFood;
      const conditions = user_profile?.healthConditions || [];
      
      console.log(`✅ DB match found: "${matched.name_en}" - returning verified data (NOT AI estimate)`);
      
      const drRezaTip = generateMalaysianFoodAdvice({
        id: matched.id,
        name_en: matched.name_en,
        name_bm: matched.name_bm,
        category: matched.category,
        serving_description: matched.serving_description,
        serving_grams: matched.serving_grams,
        calories: matched.macros.calories_kcal,
        protein: matched.macros.protein_g,
        carbs: matched.macros.carbs_g,
        fat: matched.macros.total_fat_g,
        sugar_g: matched.macros.sugar_g || 0,
        sodium_mg: matched.macros.sodium_mg || 0,
        saturated_fat_g: matched.macros.saturated_fat_g,
        cholesterol_mg: matched.macros.cholesterol_mg,
        phosphorus_mg: matched.macros.phosphorus_mg,
        potassium_mg: matched.macros.potassium_mg,
        fiber_g: matched.macros.fiber_g,
        diabetes_rating: matched.ratings.diabetes_rating as any,
        hypertension_rating: matched.ratings.hypertension_rating as any,
        cholesterol_rating: matched.ratings.cholesterol_rating as any,
        ckd_rating: matched.ratings.ckd_rating as any,
        source: 'malaysian_database',
        match_confidence: resolution.confidence,
        match_type: resolution.debug.strategy as any
      }, conditions);
      
      const components = getMalaysianFoodComponents({
        id: matched.id,
        name_en: matched.name_en,
        name_bm: matched.name_bm,
        category: matched.category,
        serving_description: matched.serving_description,
        serving_grams: matched.serving_grams,
        calories: matched.macros.calories_kcal,
        protein: matched.macros.protein_g,
        carbs: matched.macros.carbs_g,
        fat: matched.macros.total_fat_g,
        sugar_g: matched.macros.sugar_g || 0,
        sodium_mg: matched.macros.sodium_mg || 0,
        saturated_fat_g: matched.macros.saturated_fat_g,
        cholesterol_mg: matched.macros.cholesterol_mg,
        phosphorus_mg: matched.macros.phosphorus_mg,
        potassium_mg: matched.macros.potassium_mg,
        fiber_g: matched.macros.fiber_g,
        diabetes_rating: matched.ratings.diabetes_rating as any,
        hypertension_rating: matched.ratings.hypertension_rating as any,
        cholesterol_rating: matched.ratings.cholesterol_rating as any,
        ckd_rating: matched.ratings.ckd_rating as any,
        source: 'malaysian_database',
        match_confidence: resolution.confidence,
        match_type: resolution.debug.strategy as any
      });
      
      return NextResponse.json({
        success: true,
        source: 'malaysian_database',
        verified: true,
        confidence: resolution.confidence,
        data: {
          food_name: matched.name_en,
          food_name_bm: matched.name_bm,
          malaysian_food_id: matched.id,
          category: matched.category,
          components: components,
          macros: {
            calories: matched.macros.calories_kcal,
            protein_g: matched.macros.protein_g,
            carbs_g: matched.macros.carbs_g,
            fat_g: matched.macros.total_fat_g,
            sugar_g: matched.macros.sugar_g,
            sodium_mg: matched.macros.sodium_mg,
            saturated_fat_g: matched.macros.saturated_fat_g,
            cholesterol_mg: matched.macros.cholesterol_mg,
            phosphorus_mg: matched.macros.phosphorus_mg,
            potassium_mg: matched.macros.potassium_mg,
            fiber_g: matched.macros.fiber_g
          },
          serving_size: matched.serving_description,
          serving_grams: matched.serving_grams,
          diabetes_rating: matched.ratings.diabetes_rating,
          hypertension_rating: matched.ratings.hypertension_rating,
          cholesterol_rating: matched.ratings.cholesterol_rating,
          ckd_rating: matched.ratings.ckd_rating,
          analysis_content: drRezaTip,
          risk_analysis: {
            is_high_sugar: (matched.macros.sugar_g || 0) > 15,
            is_high_sodium: (matched.macros.sodium_mg || 0) > 800
          },
          meal_context: 'unknown',
          preparation_style: 'unknown'
        },
        recalculated: true,
        was_edited: true,
      });
    }
    
    // No DB match - fall back to AI estimation
    console.log(`⚠️ No DB match found - falling back to AI estimation for: "${food_name}"`);

    // Build detailed condition-specific analysis requirements
    let conditionNote = "";
    let conditionAnalysisFormat = "";
    
    if (user_profile?.healthConditions?.length > 0) {
      const conditions = user_profile.healthConditions;
      conditionNote = `The user has: ${conditions.join(', ')}. You MUST analyze each condition separately.`;
      
      // Build the required format for multi-condition analysis
      conditionAnalysisFormat = `\n\n"analysis_content": "Brief overall comment (1 sentence)"\n\n"dr_reza_analysis": {\n  "overall_rating": "🟢 Selamat" | "🟡 Berhati-hati" | "🔴 Hadkan",\n  "conditions": [\n`;
      
      if (conditions.some((c: string) => c.includes('diabetes') || c === 'prediabetes')) {
        conditionAnalysisFormat += `    {\n      "condition": "Diabetes",\n      "emoji": "🩸",\n      "rating": "🟢" | "🟡" | "🔴",\n      "impact": "Carbs XXg - [brief impact in Manglish]"\n    },\n`;
      }
      if (conditions.includes('hypertension')) {
        conditionAnalysisFormat += `    {\n      "condition": "Darah Tinggi",\n      "emoji": "❤️",\n      "rating": "🟢" | "🟡" | "🔴",\n      "impact": "Sodium XXXmg - [brief impact in Manglish]"\n    },\n`;
      }
      if (conditions.some((c: string) => c.includes('cholesterol') || c.includes('dyslipidemia'))) {
        conditionAnalysisFormat += `    {\n      "condition": "Kolesterol",\n      "emoji": "🫀",\n      "rating": "🟢" | "🟡" | "🔴",\n      "impact": "Sat Fat XXg - [brief impact in Manglish]"\n    },\n`;
      }
      if (conditions.some((c: string) => c.includes('ckd'))) {
        conditionAnalysisFormat += `    {\n      "condition": "Buah Pinggang",\n      "emoji": "🫘",\n      "rating": "🟢" | "🟡" | "🔴",\n      "impact": "Protein XXg, Potassium XXXmg - [brief impact in Manglish]"\n    },\n`;
      }
      
      conditionAnalysisFormat += `  ],\n  "tip": "Actionable Malaysian food alternative suggestion"\n}`;
    }

    const prompt = `You are Dr. Reza, a warm Malaysian nutritionist expert.

The user CORRECTED their food name to: "${food_name}"
${original_name ? `(They corrected it from: "${original_name}")` : ''}

${conditionNote}

IMPORTANT: This is an EDITED meal. The user corrected the AI's initial guess. Provide FULL DETAILED analysis, NOT a short generic response.

Provide accurate Malaysian nutrition data. Return ONLY valid JSON with this exact structure:
{
  "food_name": "${food_name}",
  "category": "rice_dish" | "noodle_dish" | "soup" | "western" | "bread" | "dessert" | "drink" | "roti" | "other",
  "components": [
    { "name": "Component 1", "calories": number, "macros": { "p": protein_g, "c": carbs_g, "f": fat_g } }
  ],
  "macros": {
    "calories": total_calories,
    "protein_g": total_protein,
    "carbs_g": total_carbs,
    "fat_g": total_fat,
    "sodium_mg": estimated_sodium,
    "sugar_g": estimated_sugar
  },${conditionAnalysisFormat || '\n  "analysis_content": "Detailed health analysis (2-3 sentences with specific numbers)"'}
  "risk_analysis": {
    "is_high_sugar": boolean,
    "is_high_sodium": boolean
  },
  "meal_context": "hawker_stall" | "home_cooked" | "restaurant" | "fast_food" | "unknown",
  "preparation_style": "deep_fried" | "stir_fried" | "steamed" | "soup_boiled" | "gravy_curry" | "grilled" | "raw_fresh" | "unknown"
}

CRITICAL FORMATTING REQUIREMENTS:
- Each condition in dr_reza_analysis.conditions MUST be a separate object
- Include actual numbers (Carbs 65g, Sodium 800mg, etc.)
- Rating must be 🟢 (safe), 🟡 (caution), or 🔴 (limit)
- Impact text should be brief Manglish explanation
- Tip should suggest a Malaysian alternative food

Use accurate Malaysian portion sizes. Be specific about preparation method impact on calories.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 800, // Increased for full analysis
      temperature: 0.3,
    });

    const content = response.choices[0].message.content;
    const cleanContent = content?.replace(/```json|```/g, '').trim();
    
    try {
      const nutritionData = JSON.parse(cleanContent || '{}');
      
      console.log('✅ Recalculation complete:', {
        food_name: nutritionData.food_name,
        calories: nutritionData.macros?.calories,
        has_dr_reza_analysis: !!nutritionData.dr_reza_analysis,
      });

      return NextResponse.json({
        success: true,
        data: nutritionData,
        recalculated: true,
        was_edited: true,
      });
    } catch (parseError) {
      console.error('❌ JSON parse error:', parseError);
      console.error('Raw content:', cleanContent);
      
      return NextResponse.json(
        { success: false, error: 'Failed to parse nutrition data' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('❌ Recalculation error:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to recalculate nutrition' },
      { status: 500 }
    );
  }
}

