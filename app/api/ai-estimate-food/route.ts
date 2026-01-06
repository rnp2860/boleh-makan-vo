import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { food_name, user_conditions } = await req.json();
    
    if (!food_name) {
      return NextResponse.json({
        success: false,
        error: 'Food name is required'
      }, { status: 400 });
    }

    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const prompt = `You are Dr. Reza, a Malaysian nutritionist AI. Estimate nutrition for "${food_name}".

User's health conditions: ${user_conditions?.length > 0 ? user_conditions.join(', ') : 'None specified'}

CRITICAL REQUIREMENTS:
1. Be accurate with Malaysian portion sizes (hawker portions are typically 400-600g for mains)
2. Consider local cooking methods (high oil/sodium is common)
3. Provide detailed health analysis for user's conditions
4. Flag halal concerns for any pork/alcohol ingredients
5. Use Malaysian context and terminology

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "food_name": "exact name",
  "nameEn": "English name", 
  "nameBm": "Bahasa Malaysia name if applicable",
  "category": "western|chinese|malay|indian|japanese|korean|thai|other",
  "calories": number,
  "protein_g": number,
  "carbs_g": number,
  "fat_g": number,
  "sodium_mg": number,
  "sugar_g": number,
  "fiber_g": number,
  "serving_size": "description with weight",
  "dr_reza_analysis": {
    "overall_rating": "safe|caution|limit",
    "condition_impacts": [
      {
        "condition": "condition name",
        "emoji": "relevant emoji",
        "rating": "safe|caution|limit",
        "rating_emoji": "🟢|🟡|🔴",
        "warning": "Main concern in 1 sentence",
        "details": "Actionable tip"
      }
    ],
    "tips": "General advice"
  },
  "analysis_content": "Dr. Reza's commentary (conversational, Malaysian)",
  "halal_status": {
    "status": "halal|non_halal|unknown",
    "reason": "explanation if needed"
  },
  "health_tags": ["array of tags"],
  "is_potentially_pork": false,
  "risk_analysis": {
    "is_high_sodium": boolean,
    "is_high_sugar": boolean,
    "is_high_protein": boolean
  }
}

Examples of good analysis_content:
- "Nice choice! Fish and chips packs protein but watch the deep-frying - oil adds up quickly. For your BP, the 800mg sodium is borderline. Consider sharing this portion or skipping the tartar sauce. 🐟"
- "Nasi Lemak for breakfast is classic, but 60g carbs can spike glucose. Try the 'Tanpa Nasi' version with extra lauk, or eat half portion with more vegetables. Your diabetes needs careful carb timing. 🍚"`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 2048,
      temperature: 0.3,
      messages: [{
        role: 'user',
        content: prompt
      }]
    });

    const content = message.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type');
    }

    let jsonText = content.text.trim();
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No valid JSON in response');
    }
    
    const foodData = JSON.parse(jsonMatch[0]);
    
    const enrichedData = {
      ...foodData,
      source: 'ai_estimate',
      confidence: 0.7,
      id: `ai_${Date.now()}`,
      malaysian_food_id: null,
      food_id: null,
      popularity_score: 0
    };

    return NextResponse.json({
      success: true,
      food: enrichedData
    });

  } catch (error: any) {
    console.error('AI estimation error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Failed to estimate nutrition',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

