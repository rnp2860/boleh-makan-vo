import { NextRequest, NextResponse } from 'next/server';
import { Groq } from 'groq-sdk';

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `Convert this text string into nutritional data: "${query}"

Return ONLY a valid JSON object (no markdown code blocks, no explanations, no conversational text, no filler text like "Here is your data") with this exact structure:
{
  "name": "Food Name",
  "calories": 123,
  "protein": 10,
  "carbs": 20,
  "fat": 5
}

Rules:
- All numeric values should be per 100g serving size
- Correct minor typos (e.g., "chlecken" -> "Chicken", "nasie lemak" -> "Nasi Lemak")
- Return nutrition data for ANY food item mentioned
- Only return null (as JSON: {"name": null}) if the text is pure gibberish with no recognizable food meaning (e.g., "xyz123", "sdflkj")
- Trust the user's input - if they type a dish name, return nutrition for that dish`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a raw data API. You do not judge if the food is present. You only convert the text string into nutritional data. Output ONLY valid JSON. No markdown blocks (```json). No conversational filler. Just the raw object: {"name": "...", "calories": ..., "protein": ..., "carbs": ..., "fat": ...}.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.2,
      max_tokens: 200,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return NextResponse.json({ data: null });
    }

    // Parse the response - handle strict JSON only
    let parsed;
    try {
      // First, try to parse directly
      parsed = JSON.parse(responseContent);
    } catch (e) {
      // If that fails, try to extract JSON from markdown code blocks or remove any surrounding text
      let cleaned = responseContent.trim();
      
      // Remove markdown code fences if present
      cleaned = cleaned.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Try to find JSON object in the string (in case there's extra text)
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }
      
      try {
        parsed = JSON.parse(cleaned);
      } catch (e2) {
        console.error('Failed to parse JSON response:', responseContent);
        return NextResponse.json({ data: null });
      }
    }

    // Check if the response indicates null (either parsed === null or parsed.name === null)
    if (parsed === null || (typeof parsed === 'object' && parsed.name === null)) {
      return NextResponse.json({ data: null });
    }

    // Validate the structure - ensure all required fields are present and valid
    if (
      parsed &&
      typeof parsed === 'object' &&
      parsed.name &&
      typeof parsed.name === 'string' &&
      parsed.name.trim() !== '' &&
      typeof parsed.calories === 'number' &&
      typeof parsed.protein === 'number' &&
      typeof parsed.carbs === 'number' &&
      typeof parsed.fat === 'number' &&
      parsed.calories >= 0 &&
      parsed.protein >= 0 &&
      parsed.carbs >= 0 &&
      parsed.fat >= 0
    ) {
      return NextResponse.json({
        data: {
          name: parsed.name.trim(),
          calories: Math.round(parsed.calories),
          protein: Math.round(parsed.protein),
          carbs: Math.round(parsed.carbs),
          fat: Math.round(parsed.fat),
        },
      });
    }

    // If structure is invalid, return null
    console.error('Invalid response structure:', parsed);
    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('Error in lookup-nutrition:', error);
    return NextResponse.json(
      { error: 'Failed to lookup nutrition data' },
      { status: 500 }
    );
  }
}

