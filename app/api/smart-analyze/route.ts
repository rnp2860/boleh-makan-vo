import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { createClient } from '@supabase/supabase-js';
import { DR_REZA_ADVISOR_PROMPT, FOOD_IDENTIFICATION_PROMPT, AI_ANALYSIS_PROMPT } from '@/lib/advisorPrompts';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const dynamic = 'force-dynamic';
export const maxDuration = 30;

// 🐷 HALAL SAFETY
const PORK_KEYWORDS = ['babi', 'pork', 'bacon', 'ham', 'lard', 'gelatin', 'char siu', 'siew yuk', 'lap cheong'];
const NON_HALAL_INGREDIENTS = ['pork', 'babi', 'bacon', 'ham', 'lard', 'wine', 'beer', 'alcohol', 'mirin', 'char siu', 'lap cheong', 'chinese sausage'];

function cleanFoodName(rawName: string): string {
  const removePatterns = [/asian home gourmet/gi, /spice mix for/gi, /singapore/gi, /coconut rice,?\s*/gi, /instant/gi, /ready to eat/gi, /frozen/gi, /brand.*$/gi];
  let cleaned = rawName;
  removePatterns.forEach(pattern => { cleaned = cleaned.replace(pattern, ''); });
  cleaned = cleaned.replace(/,+/g, ',').replace(/\s+/g, ' ').trim().replace(/^,\s*/, '').replace(/,\s*$/, '');
  
  if (cleaned.length < 3) {
    const knownDishes = ['nasi lemak', 'char kuey teow', 'roti canai', 'nasi goreng', 'mee goreng', 'laksa', 'rendang', 'satay', 'mee hoon', 'kuey teow'];
    const lower = rawName.toLowerCase();
    for (const dish of knownDishes) {
      if (lower.includes(dish)) return dish.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
  }
  return cleaned.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}

function checkHalalStatus(foodName: string, components: any[]): { status: 'halal' | 'non_halal' | 'unknown', reason?: string } {
  const allText = (foodName + ' ' + components.map(c => c.name).join(' ')).toLowerCase();
  for (const keyword of NON_HALAL_INGREDIENTS) {
    if (allText.includes(keyword.toLowerCase())) return { status: 'non_halal', reason: `Contains ${keyword}` };
  }
  return { status: 'unknown' };
}

// 🥗 TYPICAL COMPONENTS with sugar & sodium estimates
function getTypicalComponents(foodName: string, baseMacros: any): any[] {
  const lower = foodName.toLowerCase();
  
  const componentMap: Record<string, any[]> = {
    'nasi lemak': [
      { name: 'Nasi Santan', calories: 200, macros: { p: 4, c: 40, f: 5, sugar: 1, sodium: 150 } },
      { name: 'Sambal', calories: 50, macros: { p: 1, c: 5, f: 3, sugar: 3, sodium: 400 } },
      { name: 'Ikan Bilis', calories: 40, macros: { p: 5, c: 0, f: 2, sugar: 0, sodium: 300 } },
      { name: 'Kacang Tanah', calories: 50, macros: { p: 2, c: 2, f: 4, sugar: 0, sodium: 50 } },
      { name: 'Timun', calories: 5, macros: { p: 0, c: 1, f: 0, sugar: 1, sodium: 2 } },
      { name: 'Telur Rebus', calories: 70, macros: { p: 6, c: 0, f: 5, sugar: 0, sodium: 70 } },
    ],
    'char kuey teow': [
      { name: 'Flat Rice Noodles', calories: 220, macros: { p: 4, c: 45, f: 2, sugar: 1, sodium: 200 } },
      { name: 'Prawns', calories: 60, macros: { p: 12, c: 0, f: 1, sugar: 0, sodium: 150 } },
      { name: 'Cockles', calories: 30, macros: { p: 5, c: 1, f: 1, sugar: 0, sodium: 200 } },
      { name: 'Bean Sprouts', calories: 15, macros: { p: 1, c: 2, f: 0, sugar: 1, sodium: 5 } },
      { name: 'Egg', calories: 70, macros: { p: 6, c: 0, f: 5, sugar: 0, sodium: 70 } },
      { name: 'Dark Soy Sauce', calories: 15, macros: { p: 1, c: 2, f: 0, sugar: 2, sodium: 600 } },
    ],
    'roti canai': [
      { name: 'Roti Canai', calories: 250, macros: { p: 6, c: 35, f: 10, sugar: 2, sodium: 400 } },
      { name: 'Dhal Curry', calories: 80, macros: { p: 5, c: 12, f: 2, sugar: 2, sodium: 350 } },
    ],
    'teh tarik': [
      { name: 'Teh Tarik', calories: 120, macros: { p: 2, c: 20, f: 4, sugar: 18, sodium: 50 } },
    ],
    'milo': [
      { name: 'Milo', calories: 150, macros: { p: 3, c: 25, f: 4, sugar: 22, sodium: 80 } },
    ],
  };

  for (const [dish, components] of Object.entries(componentMap)) {
    if (lower.includes(dish)) return components;
  }
  
  return [{
    name: foodName,
    calories: baseMacros.calories || 300,
    macros: { p: baseMacros.protein_g || 10, c: baseMacros.carbs_g || 40, f: baseMacros.fat_g || 10, sugar: 5, sodium: 400 }
  }];
}

export async function POST(req: Request) {
  try {
    const { type, data, healthConditions } = await req.json();
    let foodName = '';

    // 🧠 STEP 1: IDENTIFY THE FOOD
    if (type === 'image') {
      const idResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: FOOD_IDENTIFICATION_PROMPT
          },
          {
            role: "user",
            content: [
              { type: "text", text: "Identify this Malaysian food." },
              { type: "image_url", image_url: { url: data, detail: "low" } }
            ]
          }
        ],
        max_tokens: 50,
      });
      foodName = idResponse.choices[0].message.content?.trim() || "Unknown Food";
      
      for (const keyword of PORK_KEYWORDS) {
        if (foodName.toLowerCase().includes(keyword)) {
          foodName = foodName.toLowerCase().includes('kuey teow') ? 'Kuey Teow Goreng' :
                     foodName.toLowerCase().includes('mee') ? 'Mee Goreng' :
                     foodName.toLowerCase().includes('nasi') ? 'Nasi Goreng' : 'Stir Fry Dish';
          break;
        }
      }
    } else {
      const validationResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: `Validate if text is food/drink. Return JSON: { "is_food": boolean, "cleaned_name": "name or null" }` },
          { role: "user", content: `Is this food? "${data}"` }
        ],
        response_format: { type: "json_object" },
        max_tokens: 100,
      });
      
      const validation = JSON.parse(validationResponse.choices[0].message.content || '{}');
      if (!validation.is_food) {
        return NextResponse.json({ success: false, error: "Please enter a valid food or drink name", suggestion: "Try 'Nasi Lemak', 'Roti Canai', or 'Teh Tarik'" }, { status: 400 });
      }
      foodName = validation.cleaned_name || data;
    }

    console.log("Identified food:", foodName);

    // 🏦 STEP 2: CHECK SUPABASE DATABASE (including new columns: sodium_mg, sugar_g, health_tags)
    const { data: dbMatch } = await supabase
      .from('food_library')
      .select('*, sodium_mg, sugar_g, health_tags')
      .ilike('name', `%${foodName}%`)
      .limit(1)
      .maybeSingle();

    // Build health conditions context for Dr. Reza
    const conditions = healthConditions || [];
    const conditionContext = conditions.length > 0 
      ? `Patient has: ${conditions.join(', ')}. Focus your advice on these conditions.` 
      : '';

    if (dbMatch) {
      const cleanName = cleanFoodName(dbMatch.name);
      const components = getTypicalComponents(cleanName, {
        calories: dbMatch.calories, protein_g: dbMatch.protein, carbs_g: dbMatch.carbs, fat_g: dbMatch.fat
      });
      
      const halalCheck = checkHalalStatus(cleanName, components);
      
      // Calculate totals from components (including sugar & sodium)
      const totalFromComponents = components.reduce((acc, comp) => ({
        sugar: acc.sugar + (comp.macros?.sugar || 0),
        sodium: acc.sodium + (comp.macros?.sodium || 0),
      }), { sugar: 0, sodium: 0 });

      // 🆕 Use new DB columns if available, otherwise use component totals
      const finalSodiumForAdvice = dbMatch.sodium_mg ?? dbMatch.sodium ?? totalFromComponents.sodium ?? 400;
      const finalSugarForAdvice = dbMatch.sugar_g ?? dbMatch.sugar ?? totalFromComponents.sugar ?? 5;
      const healthTagsForAdvice = dbMatch.health_tags || [];
      const categoryForAdvice = dbMatch.category || 'Malay';

      // 🩺 DR. REZA - Using new comprehensive advisor prompt
      const drRezaResponse = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: DR_REZA_ADVISOR_PROMPT
          },
          {
            role: "user",
            content: `Analyze this meal:
- Food Name: ${cleanName}
- Category: ${categoryForAdvice}
- Nutrition: Calories ${dbMatch.calories}kcal, Protein ${dbMatch.protein}g, Carbs ${dbMatch.carbs}g, Fat ${dbMatch.fat}g, Sodium ${finalSodiumForAdvice}mg, Sugar ${finalSugarForAdvice}g
- Tags: ${healthTagsForAdvice.length > 0 ? healthTagsForAdvice.join(', ') : 'none'}
- Patient Conditions: ${conditions.length > 0 ? conditions.join(', ') : 'none'}

Give culturally relevant advice in MAX 40 words.`
          }
        ],
        max_tokens: 100,
      });
      
      const drRezaTip = drRezaResponse.choices[0].message.content?.trim() || 
        `${cleanName} sedap! Balance with veggies and watch your portion ya.`;

      // Get lauk suggestions
      let enrichedLauk: any[] = [];
      if (dbMatch.valid_lauk && Array.isArray(dbMatch.valid_lauk)) {
        const { data: laukData } = await supabase.from('food_library').select('name, calories, protein, carbs, fat').in('name', dbMatch.valid_lauk);
        enrichedLauk = dbMatch.valid_lauk.map((name: string) => {
          const found = laukData?.find((l) => l.name === name);
          return { name: cleanFoodName(name), calories: found?.calories || 80, protein: found?.protein || 5, carbs: found?.carbs || 5, fat: found?.fat || 3 };
        });
      }
      if (enrichedLauk.length === 0) {
        enrichedLauk = [
          { name: "Telur Mata", calories: 70, protein: 6, carbs: 0, fat: 5 },
          { name: "Telur Rebus", calories: 60, protein: 6, carbs: 0, fat: 4 },
          { name: "Ayam Goreng", calories: 250, protein: 20, carbs: 5, fat: 15 }
        ];
      }

      // Determine health warnings from tags or thresholds (reuse values from above)
      const isHighSodium = healthTagsForAdvice.includes('high_sodium') || finalSodiumForAdvice > 800;
      const isHighSugar = healthTagsForAdvice.includes('high_sugar') || finalSugarForAdvice > 15;
      const isHighProtein = healthTagsForAdvice.includes('high_protein') || (dbMatch.protein || 0) > 25;

      return NextResponse.json({
        success: true,
        source: 'database',
        verified: true,
        data: {
          food_name: cleanName,
          category: categoryForAdvice,
          components: components,
          macros: {
            calories: dbMatch.calories || 0,
            protein_g: dbMatch.protein || 0,
            carbs_g: dbMatch.carbs || 0,
            fat_g: dbMatch.fat || 0,
            sugar_g: finalSugarForAdvice,
            sodium_mg: finalSodiumForAdvice,
          },
          valid_lauk: enrichedLauk,
          analysis_content: drRezaTip,
          halal_status: halalCheck,
          health_tags: healthTagsForAdvice,
          risk_analysis: { 
            is_high_sodium: isHighSodium, 
            is_high_sugar: isHighSugar,
            is_high_protein: isHighProtein
          }
        }
      });
    }

    // 🤖 STEP 3: AI FALLBACK
    console.log("Not in database, using AI estimate");
    
    // Build the AI analysis prompt with patient conditions
    const aiPromptWithConditions = AI_ANALYSIS_PROMPT + (conditionContext ? `\n\nPATIENT INFO: ${conditionContext}` : '');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: aiPromptWithConditions
        },
        {
          role: "user",
          content: type === 'image' 
            ? [
                { type: "text", text: `Analyze ${foodName}. Include sugar and sodium estimates. Patient conditions: ${conditions.length > 0 ? conditions.join(', ') : 'none'}.` },
                { type: "image_url", image_url: { url: data, detail: "low" } }
              ]
            : `Analyze ${foodName}. Include sugar and sodium estimates. Patient conditions: ${conditions.length > 0 ? conditions.join(', ') : 'none'}.`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 700,
    });

    const aiData = JSON.parse(response.choices[0].message.content || '{}');
    const halalCheck = checkHalalStatus(aiData.food_name || foodName, aiData.components || []);
    
    let safeFoodName = cleanFoodName(aiData.food_name || foodName);
    for (const keyword of PORK_KEYWORDS) {
      if (safeFoodName.toLowerCase().includes(keyword)) {
        safeFoodName = safeFoodName.toLowerCase().includes('kuey teow') ? 'Kuey Teow Goreng' :
                       safeFoodName.toLowerCase().includes('mee') ? 'Mee Goreng' : 'Stir Fry Dish';
        break;
      }
    }
    
    const totalMacros = (aiData.components || []).reduce((acc: any, comp: any) => ({
      calories: acc.calories + (comp.calories || 0),
      protein_g: acc.protein_g + (comp.macros?.p || 0),
      carbs_g: acc.carbs_g + (comp.macros?.c || 0),
      fat_g: acc.fat_g + (comp.macros?.f || 0),
      sugar_g: acc.sugar_g + (comp.macros?.sugar || 0),
      sodium_mg: acc.sodium_mg + (comp.macros?.sodium || 0),
    }), { calories: 0, protein_g: 0, carbs_g: 0, fat_g: 0, sugar_g: 0, sodium_mg: 0 });

    const defaultLauk = [
      { name: "Telur Mata", calories: 70, protein: 6, carbs: 0, fat: 5 },
      { name: "Telur Rebus", calories: 60, protein: 6, carbs: 0, fat: 4 },
      { name: "Ayam Goreng", calories: 250, protein: 20, carbs: 5, fat: 15 },
    ];

    // Build health_tags from AI analysis
    const aiHealthTags: string[] = [];
    const finalMacros = totalMacros.calories > 0 ? totalMacros : { calories: 350, protein_g: 12, carbs_g: 45, fat_g: 12, sugar_g: 5, sodium_mg: 400 };
    
    if (finalMacros.sodium_mg > 800) aiHealthTags.push('high_sodium');
    if (finalMacros.sugar_g > 15) aiHealthTags.push('high_sugar');
    if (finalMacros.protein_g > 25) aiHealthTags.push('high_protein');

    return NextResponse.json({
      success: true,
      source: 'ai_estimate',
      verified: false,
      data: {
        food_name: safeFoodName,
        category: aiData.category || 'other',
        components: aiData.components || getTypicalComponents(safeFoodName, totalMacros),
        macros: finalMacros,
        valid_lauk: defaultLauk,
        analysis_content: aiData.analysis_content || "Enjoy your meal! Balance is key. 🍽️",
        halal_status: halalCheck,
        health_tags: aiHealthTags,
        risk_analysis: { 
          is_high_sodium: finalMacros.sodium_mg > 800, 
          is_high_sugar: finalMacros.sugar_g > 15,
          is_high_protein: finalMacros.protein_g > 25
        }
      }
    });

  } catch (err: any) {
    console.error("Smart-analyze error:", err);
    return NextResponse.json({ success: false, error: err.message || "Analysis failed" }, { status: 500 });
  }
}
