// src/app/api/analyze-food/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import { findFoodAnchor } from '@/utils/foodSearch';

export async function POST(request: Request) {
  try {
    // 1. Initialize OpenAI INSIDE the function (Safety First)
    // This prevents the "Build Error" on Vercel
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const { image } = await request.json();

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // 2. Ask Dr. Reza (OpenAI) to identify the food
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this Malaysian meal." },
            {
              type: "image_url",
              image_url: {
                url: image,
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" },
    });

    // 3. Parse the AI's "Guess"
    const aiContent = response.choices[0].message.content;
    const aiData = JSON.parse(aiContent || "{}");

    // 4. THE INTERCEPT: Check our "Anchor File"
    const verifiedAnchor = findFoodAnchor(aiData.food_name);

    let finalResult = { ...aiData };
    let isVerified = false;

    if (verifiedAnchor) {
      console.log(`✅ Anchor Match Found: ${verifiedAnchor.name}`);
      finalResult = {
        ...aiData,
        food_name: verifiedAnchor.name,
        macros: {
          calories: verifiedAnchor.calories,
          protein_g: verifiedAnchor.protein_g,
          carbs_g: verifiedAnchor.carbs_g,
          fat_g: verifiedAnchor.fat_g,
          sodium_mg: verifiedAnchor.sodium_mg,
          sugar_g: aiData.macros.sugar_g,
          fiber_g: verifiedAnchor.fiber_g,
        },
        risk_analysis: {
          ...aiData.risk_analysis,
          is_high_sodium: verifiedAnchor.risk_flags?.includes('high_sodium') || verifiedAnchor.sodium_mg > 800,
          is_high_sugar: verifiedAnchor.risk_flags?.includes('high_sugar') || false,
        }
      };
      isVerified = true;
    } else {
      console.log(`⚠️ No Anchor Match. Using AI Estimate for: ${aiData.food_name}`);
    }

    return NextResponse.json({ 
      success: true, 
      data: finalResult,
      is_verified: isVerified,
      source: isVerified ? verifiedAnchor?.source : 'AI_Estimate'
    });

  } catch (error: any) {
    console.error('Error analyzing food:', error);
    const errorMessage = error.message || 'Failed to analyze food';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}