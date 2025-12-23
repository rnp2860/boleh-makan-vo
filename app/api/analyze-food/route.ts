import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { MALAYSIAN_FOOD_DB } from '@/data/food-db'; 

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: Normalize text for matching (e.g., "Nasi Lemak Ayam" -> "nasi lemak ayam")
const normalize = (str: string) => str.toLowerCase().trim();

export async function POST(req: Request) {
  try {
    const { image, userProfile, ingredients } = await req.json();

    // 1. CONSTRUCT THE PROMPT
    const systemPrompt = `
      You are Dr. Reza, a top Malaysian nutritionist. 
      Analyze this food image.
      
      CRITICAL INSTRUCTION:
      1. First, identify the exact Malaysian dish name (e.g., "Nasi Lemak", "Roti Canai", "Teh Tarik").
      2. If the dish is common, use standard Malaysian portion sizes.
      3. Return a clean JSON object.
      
      USER PROFILE:
      - Gender: ${userProfile?.gender || 'Not specified'}
      - Goal: ${userProfile?.goal || 'Maintenance'}
      - Medical Conditions: ${['diabetes', 'hypertension', 'cholesterol'].includes(userProfile?.goal) ? userProfile.goal : 'None'}

      ${ingredients ? `USER EDITS (Trust these ingredients): ${ingredients.join(', ')}` : ''}

      RETURN JSON FORMAT ONLY:
      {
        "main_dish_name": "string (The most likely Malaysian name of the dish)",
        "ingredients": ["list", "of", "detected", "items"],
        "macros": {
          "calories": { "value": number, "unit": "kcal", "status": "Good/High/Low" },
          "protein": { "value": number, "unit": "g" },
          "carbs": { "value": number, "unit": "g" },
          "fat": { "value": number, "unit": "g" }
        },
        "analysis_points": ["3 short bullet points in professional but friendly tone"],
        "actionable_advice": ["2 short tips relevant to their health goal"]
      }
    `;

    // 2. CALL AI MODEL
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: systemPrompt },
            { type: "image_url", image_url: { url: `data:image/jpeg;base64,${image}` } },
          ],
        },
      ],
      // 👇 THE CORRECT MODEL ID (Llama 4 Scout)
      model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      
      temperature: 0.1, 
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const rawContent = chatCompletion.choices[0].message.content;
    let result = JSON.parse(rawContent || "{}");

    // 3. THE "ACCURACY ENGINE" LOGIC (DB OVERRIDE)
    if (result.main_dish_name) {
      const detectedName = normalize(result.main_dish_name);
      let dbMatch = null;

      // Try exact match first
      if (MALAYSIAN_FOOD_DB[detectedName]) {
        dbMatch = MALAYSIAN_FOOD_DB[detectedName];
      } 
      // Try fuzzy match
      else {
        const dbKeys = Object.keys(MALAYSIAN_FOOD_DB);
        const foundKey = dbKeys.find(key => detectedName.includes(key));
        if (foundKey) dbMatch = MALAYSIAN_FOOD_DB[foundKey];
      }

      // 4. OVERWRITE WITH GOLDEN DATA IF FOUND
      if (dbMatch) {
        console.log(`✅ MATCH FOUND: Overwriting AI guess for ${result.main_dish_name} with DB data for ${dbMatch.name}`);
        
        result.macros.calories.value = dbMatch.calories;
        result.macros.protein.value = dbMatch.protein;
        result.macros.carbs.value = dbMatch.carbs;
        result.macros.fat.value = dbMatch.fat;
        
        result.analysis_points.unshift(`✅ Verified Database: Matches "${dbMatch.name}" (${dbMatch.servingSize}).`);
        result.main_dish_name = dbMatch.name; 
      }
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error("AI Error:", error);
    return NextResponse.json({ error: "Failed to process image" }, { status: 500 });
  }
}