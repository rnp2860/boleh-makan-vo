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

    const prompt = `Identify the food item from this text: "${query}". Correct any typos (e.g., "chlecken" -> "Chicken"). Return ONLY a JSON object with keys: name, calories, protein, carbs, fat. All values should be numbers except name (string). If the text is gibberish or not a food item, return null.`;

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-70b-versatile',
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      response_format: { type: 'json_object' },
      temperature: 0.3,
      max_tokens: 200,
    });

    const responseContent = completion.choices[0]?.message?.content;
    
    if (!responseContent) {
      return NextResponse.json({ data: null });
    }

    // Parse the response
    let parsed;
    try {
      parsed = JSON.parse(responseContent);
    } catch (e) {
      // If parsing fails, try to extract JSON from markdown code blocks
      const cleaned = responseContent.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      try {
        parsed = JSON.parse(cleaned);
      } catch (e2) {
        return NextResponse.json({ data: null });
      }
    }

    // Check if the response is null or invalid
    if (parsed === null || typeof parsed !== 'object') {
      return NextResponse.json({ data: null });
    }

    // Validate the structure
    if (
      parsed.name &&
      typeof parsed.calories === 'number' &&
      typeof parsed.protein === 'number' &&
      typeof parsed.carbs === 'number' &&
      typeof parsed.fat === 'number'
    ) {
      return NextResponse.json({
        data: {
          name: parsed.name,
          calories: Math.round(parsed.calories),
          protein: Math.round(parsed.protein),
          carbs: Math.round(parsed.carbs),
          fat: Math.round(parsed.fat),
        },
      });
    }

    // If structure is invalid, return null
    return NextResponse.json({ data: null });
  } catch (error) {
    console.error('Error in lookup-nutrition:', error);
    return NextResponse.json(
      { error: 'Failed to lookup nutrition data' },
      { status: 500 }
    );
  }
}

