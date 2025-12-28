// src/app/api/analyze-food/route.ts
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { image, userProfile } = await req.json();

    // Construct a "Doctor's Note" based on conditions
    let conditionNote = "";
    if (userProfile?.healthConditions?.length > 0) {
      conditionNote = `The user has the following health concerns: ${userProfile.healthConditions.join(', ')}. 
      Please specifically highlight risks related to these (e.g., sugar for diabetes, sodium for blood pressure).`;
    }

    const prompt = `
      You are Dr. Reza, a Malaysian nutritionist expert. 
      Analyze this food image. 
      
      ${conditionNote}

      Return a JSON object with this EXACT structure:
      {
        "food_name": "Name of food (Malay/English)",
        "category": "rice_dish" | "noodle_dish" | "soup" | "western" | "bread" | "dessert" | "drink" | "other",
        "components": [
           { "name": "Rice", "calories": 200, "macros": { "p": 4, "c": 40, "f": 1 } },
           { "name": "Fried Chicken", "calories": 250, "macros": { "p": 20, "c": 5, "f": 15 } }
        ],
        "analysis_content": "A short, friendly advice paragraph (max 30 words). Mention the user's health conditions if relevant.",
        "risk_analysis": {
          "is_high_sugar": boolean,
          "is_high_sodium": boolean
        }
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // 👈 CHANGED TO MINI (Cheaper & Fast)
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: prompt },
            { type: "image_url", image_url: { url: image } },
          ],
        },
      ],
      max_tokens: 600,
    });

    const content = response.choices[0].message.content;
    // Clean up markdown code blocks if present (e.g. ```json ... ```)
    const cleanContent = content?.replace(/```json|```/g, '').trim();
    
    return NextResponse.json({ data: JSON.parse(cleanContent || '{}'), is_verified: false });

  } catch (error: any) {
    console.error("Analysis Error:", error);
    return NextResponse.json({ error: 'Dr. Reza is busy...' }, { status: 500 });
  }
}