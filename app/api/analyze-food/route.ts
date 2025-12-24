import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.OPENAI_BASE_URL,
});

export async function POST(req: Request) {
  try {
    const { image, userProfile, ingredients } = await req.json();

    // 1. CONFIGURATION: Use the Stable Text Model
    // (We are skipping Vision because Groq decommissioned the preview models today)
    const MODEL_NAME = "llama-3.3-70b-versatile"; 
    
    // 2. SYSTEM PROMPT
    const systemPrompt = `You are Dr. Reza, a metabolic health expert. 
    The user has sent a food request, but due to technical limits, you cannot see the image.
    ESTIMATE the nutrition based on the context provided.
    
    Return JSON only.
    Structure:
    {
      "main_dish_name": "String",
      "macros": { 
        "calories": {"value": Number}, 
        "protein": {"value": Number}, 
        "carbs": {"value": Number}, 
        "fat": {"value": Number} 
      },
      "ingredients": ["String"],
      "analysis_points": ["String"],
      "actionable_advice": ["String"]
    }`;

    // 3. CONSTRUCT USER PROMPT
    let userPrompt = `User Profile: ${JSON.stringify(userProfile || {})}`;

    if (ingredients && ingredients.length > 0) {
        userPrompt += `\nTHE USER IS EATING: ${ingredients.join(', ')}.`;
    } else {
        userPrompt += `\nNOTE: The user scanned a food image, but I cannot see it. Please provide a generic healthy estimation for a standard Malaysian meal (e.g., Nasi Campur) or ask the user to input ingredients manually in the analysis_points.`;
    }

    // 4. SEND TO GROQ (TEXT ONLY - NO IMAGE)
    // We strictly send text to prevent the "400" crash
    const response = await client.chat.completions.create({
      model: MODEL_NAME,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("No content returned");
    
    return NextResponse.json(JSON.parse(content));

  } catch (error: any) {
    console.error('Error analyzing food:', error);
    return NextResponse.json({ error: error.message || 'Failed' }, { status: 500 });
  }
}