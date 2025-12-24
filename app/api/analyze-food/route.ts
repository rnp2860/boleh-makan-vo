// src/app/api/analyze-food/route.ts
import { NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';
import { MALAYSIAN_FOOD_DB } from '@/data/food-db';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Helper: Normalize text for matching
const normalize = (str: string) => str.toLowerCase().trim();

export async function POST(req: Request) {
  try {
    const { image, userProfile, ingredients } = await req.json();

    // 1. CONSTRUCT THE "DETECTIVE" PROMPT
    const systemPrompt = `
      You are Dr. Reza, a top Malaysian nutritionist.
      Analyze this food image.

      CRITICAL DETECTION INSTRUCTION:
      1. Identify the Main Dish (e.g., Nasi Lemak, Roti Canai).
      2. **LOOK FOR THE LAUK (SIDE DISH):** - Is there Fried Chicken (Ayam Goreng)? 
         - Is there Beef Rendang? 
         - Is there Sambal Sotong?
         - Is there an extra Egg (Telur)?
      3. Combine them into the specific Malaysian name. 
         - Example: Do NOT just say "Nasi Lemak". Say "**Nasi Lemak Ayam Goreng**".
         - Example: Do NOT just say "Roti Canai". Say "**Roti Canai Telur**".

      INGREDIENT BREAKDOWN RULE:
      - Do NOT list the dish name (e.g., "Nasi Lemak") as an ingredient.
      - List the VISIBLE components separately (e.g., "Coconut Rice", "Fried Anchovies", "Peanuts", "Cucumber", "Sambal", "Fried Chicken").
      
      USER PROFILE:
      - Gender: ${userProfile?.gender || 'Not specified'}
      - Goal: ${userProfile?.goal || 'Maintenance'}
      
      ${ingredients ? `USER EDITS (Trust these ingredients): ${ingredients.join(', ')}` : ''}

      RETURN JSON FORMAT ONLY:
      {
        "main_dish_name": "string (The specific combo name)",
        "ingredients": ["list", "of", "detected", "items"],
        "macros": {
          "calories": { "value": number, "unit": "kcal", "status": "Good/High/Low" },
          "protein": { "value": number, "unit": "g" },
          "carbs": { "value": number, "unit": "g" },
          "fat": { "value": number, "unit": "g" }
        },
        "analysis_points": ["3 short bullet points. Mention the side dish if present."],
        "actionable_advice": ["2 short tips"]
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
      model: "meta-llama/llama-4-scout-17b-16e-instruct", 
      temperature: 0.1,
      max_tokens: 1024,
      response_format: { type: "json_object" },
    });

    const rawContent = chatCompletion.choices[0].message.content;
    let result = JSON.parse(rawContent || "{}");

    // 3. THE "ACCURACY ENGINE" (DB OVERRIDE)
    if (result.main_dish_name) {
      const detectedName = normalize(result.main_dish_name);
      let dbMatch = null;

      // A. Try Exact Match (Highest Priority)
      if (MALAYSIAN_FOOD_DB[detectedName]) {
        dbMatch = MALAYSIAN_FOOD_DB[detectedName];
      } 
      // B. Try Fuzzy Match (Find specific combos first!)
      else {
        const dbKeys = Object.keys(MALAYSIAN_FOOD_DB);
        // Sort keys by length (longest first) so "nasi lemak ayam goreng" matches before "nasi lemak"
        const sortedKeys = dbKeys.sort((a, b) => b.length - a.length);
        
        const foundKey = sortedKeys.find(key => detectedName.includes(key));
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