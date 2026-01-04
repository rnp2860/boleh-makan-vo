// app/api/recalculate-nutrition/route.ts
// 🔄 API endpoint for recalculating nutrition when user corrects food name

import { NextResponse } from 'next/server';
import OpenAI from 'openai';

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

