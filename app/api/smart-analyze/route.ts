import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { type, data } = await req.json();
    let foodName = '';

    // 🕵️‍♂️ PHASE 1: IDENTIFY
    if (type === 'image') {
      const response = await openai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a Malaysian Food Expert. Identify the main dish. Return ONLY the specific Malaysian name. Do not mention countries."
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Identify this food." },
              { type: "image_url", image_url: { url: data } }
            ]
          }
        ],
        max_tokens: 50,
      });
      foodName = response.choices[0].message.content?.trim() || "Unknown Food";
    } else {
      foodName = data;
    }

    // 🏦 PHASE 2: DATABASE CHECK
    const { data: dbMatch } = await supabase
      .from('food_library')
      .select('*')
      .textSearch('name', `'${foodName}'`, { config: 'english', type: 'websearch' })
      .limit(1)
      .maybeSingle();

    if (dbMatch) {
      // 🧠 SMART ADD-ON LOOKUP (NEW LOGIC)
      // We look up the calories for the suggested sides so the buttons actually work
      let enrichedLauk = [];
      if (dbMatch.valid_lauk && Array.isArray(dbMatch.valid_lauk)) {
        const laukNames = dbMatch.valid_lauk.map((l: string) => l);
        
        // Find these items in the DB to get their real calories
        const { data: laukData } = await supabase
          .from('food_library')
          .select('name, calories')
          .in('name', laukNames);

        // Map them back. If not found in DB, estimate ~100kcal per add-on
        enrichedLauk = dbMatch.valid_lauk.map((name: string) => {
          const found = laukData?.find((l) => l.name === name);
          return {
            name: name,
            calories: found ? found.calories : 80 // Default fallback
          };
        });
      }

      return NextResponse.json({
        success: true,
        source: 'database',
        verified: true,
        data: {
          food_name: dbMatch.name,
          macros: {
            calories: dbMatch.calories,
            protein_g: dbMatch.protein,
            carbs_g: dbMatch.carbs,
            fat_g: dbMatch.fat,
          },
          valid_lauk: enrichedLauk, // Now sends objects: {name: "Telur", calories: 70}
          analysis_content: `Verified by ${dbMatch.source}. Base serving size.`
        }
      });
    }

    // 🤖 AI FALLBACK
    const aiResponse = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a Malaysian Nutritionist. User ate: "${foodName}". 
          Estimate nutrition. Return JSON: { "calories": number, "protein_g": number, "carbs_g": number, "fat_g": number, "analysis_content": "Brief tip" }`
        }
      ],
      response_format: { type: "json_object" }
    });
    const aiData = JSON.parse(aiResponse.choices[0].message.content!);

    return NextResponse.json({
      success: true,
      source: 'ai_estimate',
      verified: false,
      data: {
        food_name: foodName,
        macros: aiData,
        valid_lauk: [],
        analysis_content: aiData.analysis_content
      }
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}