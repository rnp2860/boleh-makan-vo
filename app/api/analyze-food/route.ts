// src/app/api/analyze/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { SYSTEM_PROMPT } from '@/lib/systemPrompt';
import { findFoodAnchor } from '@/utils/foodSearch';

// Initialize OpenAI (Make sure OPENAI_API_KEY is in your .env.local file)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { image } = await request.json(); // Expecting base64 string

    if (!image) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    }

    // 1. Ask Dr. Reza (OpenAI) to identify the food
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Cost-effective & fast
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this Malaysian meal." },
            {
              type: "image_url",
              image_url: {
                url: image, // Base64 data URL
              },
            },
          ],
        },
      ],
      max_tokens: 500,
      response_format: { type: "json_object" }, // Enforce JSON
    });

    // 2. Parse the AI's "Guess"
    const aiContent = response.choices[0].message.content;
    const aiData = JSON.parse(aiContent || "{}");

    // 3. THE INTERCEPT: Check our "Anchor File" (Truth Database)
    // We search using the AI's identified name (e.g., "Mee Goreng")
    const verifiedAnchor = findFoodAnchor(aiData.food_name);

    let finalResult = { ...aiData };
    let isVerified = false;

    if (verifiedAnchor) {
      // 4. THE OVERRIDE: We found a match! Use the verified data.
      console.log(`✅ Anchor Match Found: ${verifiedAnchor.name}`);
      
      finalResult = {
        ...aiData, // Keep AI's text description/confidence
        food_name: verifiedAnchor.name, // Use the official name
        macros: {
          calories: verifiedAnchor.calories,
          protein_g: verifiedAnchor.protein_g,
          carbs_g: verifiedAnchor.carbs_g,
          fat_g: verifiedAnchor.fat_g,
          sodium_mg: verifiedAnchor.sodium_mg, // THE RENAL SAVER
          sugar_g: aiData.macros.sugar_g, // Keep AI guess (Anchors often miss sugar)
          fiber_g: verifiedAnchor.fiber_g,
        },
        risk_analysis: {
          ...aiData.risk_analysis,
          // Re-calculate risks based on Verified Data
          is_high_sodium: verifiedAnchor.risk_flags?.includes('high_sodium') || verifiedAnchor.sodium_mg > 800,
          is_high_sugar: verifiedAnchor.risk_flags?.includes('high_sugar') || false,
        }
      };
      isVerified = true;
    } else {
      console.log(`⚠️ No Anchor Match. Using AI Estimate for: ${aiData.food_name}`);
    }

    // 5. Return the "Bulletproof" Result
    return NextResponse.json({ 
      success: true, 
      data: finalResult,
      is_verified: isVerified,
      source: isVerified ? verifiedAnchor?.source : 'AI_Estimate'
    });

  } catch (error) {
    console.error('Error analyzing food:', error);
    return NextResponse.json({ error: 'Failed to analyze food' }, { status: 500 });
  }
}