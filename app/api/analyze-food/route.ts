import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { getSupabaseServer } from '@/lib/supabaseClient';

// User Profile Interface
interface UserProfile {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // in cm
  weight: number; // in kg
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
  goal: 'weight_loss' | 'weight_gain' | 'maintenance' | 'diabetes' | 'muscle_gain';
}

function calculateTDEE(profile: UserProfile): number {
  let bmr: number;
  if (profile.gender === 'male') {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age + 5;
  } else {
    bmr = 10 * profile.weight + 6.25 * profile.height - 5 * profile.age - 161;
  }
  const activityMultipliers = {
    sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9
  };
  return Math.round(bmr * (activityMultipliers[profile.activityLevel] || 1.2));
}

function calculateStatusBadges(carbs: number, protein: number, calories: number, userProfile?: UserProfile) {
  const carbsThreshold = userProfile?.goal === 'diabetes' ? 40 : 50;
  const carbsStatus = carbs > carbsThreshold ? 'High' : carbs > 30 ? 'Moderate' : 'Good';
  const proteinStatus = protein > 20 ? 'Good' : protein > 10 ? 'Moderate' : 'Moderate';
  let caloriesStatus: 'High' | 'Moderate' | 'Good';
  
  if (userProfile) {
    const tdee = calculateTDEE(userProfile);
    const percentage = (calories / tdee) * 100;
    if (userProfile.goal === 'weight_loss') {
      caloriesStatus = percentage > 40 ? 'High' : percentage > 25 ? 'Moderate' : 'Good';
    } else {
      caloriesStatus = percentage > 50 ? 'High' : percentage > 30 ? 'Moderate' : 'Good';
    }
  } else {
    caloriesStatus = calories > 600 ? 'High' : calories > 400 ? 'Moderate' : 'Good';
  }
  return { carbs: carbsStatus, protein: proteinStatus, calories: caloriesStatus };
}

export async function POST(request: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  
  try {
    // 1. Parse Request
    let imageBase64: string | null = null;
    let mimeType: string = 'image/jpeg';
    let userProfile: UserProfile | undefined = undefined;
    let manualIngredients: string[] | undefined = undefined;
    
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      const body = await request.json();
      imageBase64 = body.image;
      userProfile = body.userProfile;
      manualIngredients = body.ingredients; 
    }

    if (!imageBase64) return NextResponse.json({ error: 'No image provided' }, { status: 400 });
    if (!apiKey) return NextResponse.json({ error: 'API Key missing' }, { status: 500 });

    const groq = new Groq({ apiKey });

    // 2. Build Prompt Context
    let tdeeContext = '';
    if (userProfile) {
      const tdee = calculateTDEE(userProfile);
      tdeeContext = `\nUSER PROFILE: Goal: ${userProfile.goal}, TDEE: ${tdee} kcal.`;
    }

    // MANUAL OVERRIDE LOGIC (Intelligent Blindfold)
    const isManualMode = manualIngredients && manualIngredients.length > 0;
    let systemPrompt = '';

    if (isManualMode) {
        // INTELLIGENT TEXT MODE
        systemPrompt = `You are Dr. Reza, a clinical dietitian.
        CRITICAL INSTRUCTION: The user has provided a raw list of items: ${JSON.stringify(manualIngredients)}.
        
        TASK:
        1. CLEAN THE LIST: 
           - Fix typos (e.g. "chiken" -> "Chicken").
           - Remove non-food items (e.g. "plate", "table", "nonsense", "asdf").
           - If the list becomes empty, return 0 for all macros and warn the user.
        2. Calculate nutrition (Calories, Carbs, Protein, Fat) based ONLY on the CLEANED list.
        
        Return valid JSON:
        {
          "ingredients": ["Cleaned", "List", "Here"], 
          "macros": { 
             "carbs": { "value": "0g", "status": "Good" }, 
             "protein": { "value": "0g", "status": "Good" }, 
             "fat": { "value": "0g", "status": "Good" }, 
             "calories": { "value": "0", "status": "Good" } 
          },
          "glycemic_index": "Medium",
          "health_score": 0,
          "analysis_title": "Dr. Reza's Updated Verdict",
          "analysis_content": ["Comment on the edited meal."],
          "actionable_advice": ["Updated advice."]
        }
        ${tdeeContext}`;
    } else {
        // VISION MODE
        systemPrompt = `You are Dr. Reza, a Malaysian clinical dietitian. Analyze the food image.
        Return JSON:
        {
          "ingredients": ["List", "detected"],
          "macros": { 
             "carbs": { "value": "0g", "status": "Good" }, 
             "protein": { "value": "0g", "status": "Good" }, 
             "fat": { "value": "0g", "status": "Good" }, 
             "calories": { "value": "0", "status": "Good" } 
          },
          "glycemic_index": "High",
          "health_score": 0,
          "analysis_title": "Dr. Reza's Verdict",
          "analysis_content": ["Medical observation mixed with cultural context."],
          "actionable_advice": ["Actionable hack."]
        }
        RULES: Carbs > 50g = High. Protein > 20g = Good. Use Refined Manglish.
        ${tdeeContext}`;
    }

    // 3. Call AI - Llama 4
    const messages: any[] = [{
        role: 'user',
        content: isManualMode 
            ? [{ type: 'text', text: systemPrompt }] 
            : [
                { type: 'text', text: systemPrompt },
                { type: 'image_url', image_url: { url: `data:${mimeType};base64,${imageBase64}` } }
              ]
    }];

    const completion = await groq.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct', 
      messages: messages,
      response_format: { type: 'json_object' },
      max_tokens: 1000,
    });

    const responseContent = completion.choices[0]?.message?.content;
    if (!responseContent) throw new Error('No response from AI');

    let cleanedContent = responseContent.trim();
    if (cleanedContent.startsWith('```json')) cleanedContent = cleanedContent.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    else if (cleanedContent.startsWith('```')) cleanedContent = cleanedContent.replace(/^```\s*/, '').replace(/\s*```$/, '');

    const analysisResult = JSON.parse(cleanedContent);

    // 5. Post-Process Badges
    const calculatedStatuses = calculateStatusBadges(
      parseInt(analysisResult.macros.carbs.value) || 0,
      parseInt(analysisResult.macros.protein.value) || 0,
      parseInt(analysisResult.macros.calories.value) || 0,
      userProfile
    );
    analysisResult.macros.carbs.status = calculatedStatuses.carbs;
    analysisResult.macros.protein.status = calculatedStatuses.protein;
    analysisResult.macros.calories.status = calculatedStatuses.calories;

    // 6. Save to Supabase
    const finalResult = { ...analysisResult, analysis_points: analysisResult.analysis_content };
    const supabase = getSupabaseServer();
    let imageUrl: string | null = null;
    
    try {
        const fileExtension = mimeType.split('/')[1] || 'jpg';
        const fileName = `scan_${Date.now()}.${fileExtension}`;
        const imageBuffer = Buffer.from(imageBase64, 'base64');
        const { error } = await supabase.storage.from('food-images').upload(fileName, imageBuffer, { contentType: mimeType, upsert: false });
        if (!error) {
            const { data } = supabase.storage.from('food-images').getPublicUrl(fileName);
            imageUrl = data.publicUrl;
        }
    } catch (e) { console.error('Upload failed', e); }

    await supabase.from('scans').insert([{
        ingredients: finalResult.ingredients,
        macros: finalResult.macros,
        glycemic_index: finalResult.glycemic_index,
        health_score: finalResult.health_score,
        analysis_points: finalResult.analysis_content,
        actionable_advice: finalResult.actionable_advice,
        analysis_content: finalResult.analysis_content,
        image_url: imageUrl,
        created_at: new Date().toISOString(),
    }]);

    return NextResponse.json(finalResult);

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed' }, { status: 500 });
  }
}