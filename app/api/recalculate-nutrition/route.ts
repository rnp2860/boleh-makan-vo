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

    // Build context for the AI
    let conditionNote = "";
    if (user_profile?.healthConditions?.length > 0) {
      conditionNote = `The user has: ${user_profile.healthConditions.join(', ')}. Highlight relevant risks.`;
    }

    const prompt = `You are Dr. Reza, a Malaysian nutritionist expert.

The user is eating: "${food_name}"
${original_name ? `(They corrected it from: "${original_name}")` : ''}

${conditionNote}

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
  },
  "analysis_content": "Brief health tip (max 25 words)",
  "risk_analysis": {
    "is_high_sugar": boolean,
    "is_high_sodium": boolean
  },
  "meal_context": "hawker_stall" | "home_cooked" | "restaurant" | "fast_food" | "unknown",
  "preparation_style": "deep_fried" | "stir_fried" | "steamed" | "soup_boiled" | "gravy_curry" | "grilled" | "raw_fresh" | "unknown"
}

Use accurate Malaysian portion sizes. Be specific about preparation method impact on calories.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      max_tokens: 600,
      temperature: 0.3, // Lower temperature for more consistent nutrition data
    });

    const content = response.choices[0].message.content;
    const cleanContent = content?.replace(/```json|```/g, '').trim();
    
    try {
      const nutritionData = JSON.parse(cleanContent || '{}');
      
      console.log('✅ Recalculation complete:', {
        food_name: nutritionData.food_name,
        calories: nutritionData.macros?.calories,
      });

      return NextResponse.json({
        success: true,
        data: nutritionData,
        recalculated: true,
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

