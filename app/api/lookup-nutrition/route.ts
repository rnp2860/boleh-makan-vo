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

    const prompt = `You are a Global Nutrition Expert familiar with Asian and Malaysian cuisine, including dishes like Beef Rendang, Nasi Goreng, Teh Tarik, Roti Canai, Nasi Lemak, Char Kway Teow, Laksa, and other regional foods.

Identify the food item from this text: "${query}". Correct any typos (e.g., "chlecken" -> "Chicken", "nasie lemak" -> "Nasi Lemak").

Return ONLY a valid JSON object (no markdown code blocks, no explanations, no conversational text) with this exact structure:
{
  "name": "Food Name",
  "calories": 123,
  "protein": 10,
  "carbs": 20,
  "fat": 5
}

All numeric values should be per 100g serving size. The name should be the corrected, properly spelled food name.

Only return null (as JSON: {"name": null}) if the input is completely unrecognizable as food (like "sdflkj" or "table" or "abc123"). Malaysian and Asian dishes should always be recognized and returned with appropriate nutrition estimates.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a Global Nutrition Expert. Always respond with valid JSON only, no markdown code blocks, no explanations, no conversational text. Only output the raw JSON object.',
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

