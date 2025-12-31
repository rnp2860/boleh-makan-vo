import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { summaryStats, mealBreakdown, sodiumSugarWatch, period } = await req.json();

    if (!summaryStats) {
      return NextResponse.json({ success: false, error: 'Missing summary stats' }, { status: 400 });
    }

    // Build context for Dr. Reza
    const context = `
Nutrition Report Analysis (${period?.start_date} to ${period?.end_date}):
- Total Meals Logged: ${summaryStats.total_meals} over ${summaryStats.total_days} days
- Average Daily Calories: ${summaryStats.avg_daily_calories} kcal
- Average Daily Sodium: ${summaryStats.avg_daily_sodium}mg (limit: 2000mg) - Status: ${sodiumSugarWatch?.sodium?.status || 'Unknown'}
- Average Daily Sugar: ${summaryStats.avg_daily_sugar}g (limit: 25g) - Status: ${sodiumSugarWatch?.sugar?.status || 'Unknown'}
- Meal Distribution: Breakfast ${mealBreakdown?.Breakfast?.percentage || 0}%, Lunch ${mealBreakdown?.Lunch?.percentage || 0}%, Dinner ${mealBreakdown?.Dinner?.percentage || 0}%, Snack ${mealBreakdown?.Snack?.percentage || 0}%
- Top Calorie Meal Type: ${Object.entries(mealBreakdown || {}).sort((a: any, b: any) => b[1].calories - a[1].calories)[0]?.[0] || 'Unknown'}
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Dr. Reza, a friendly Malaysian nutritionist. Analyze the user's nutrition report and provide a personalized 2-sentence insight.

Rules:
- Be specific and actionable (mention actual numbers and meal types)
- Use friendly Malaysian-English tone (can use words like "lah", "ya")
- If sodium/sugar is high, suggest specific Malaysian food swaps
- Keep it under 50 words total
- Start with a positive observation, then give one specific suggestion

Example: "Wah, you've been consistent with ${summaryStats.total_meals} meals logged! Your dinners are quite heavy though - try swapping that late-night Maggi for some clear soup or fruits ya."`
        },
        {
          role: "user",
          content: context
        }
      ],
      max_tokens: 150,
    });

    const insight = response.choices[0].message.content?.trim() || 
      "Good job tracking your meals! Keep monitoring your sodium and sugar intake for better health.";

    return NextResponse.json({ success: true, insight });

  } catch (err: any) {
    console.error('Insight generation error:', err);
    return NextResponse.json({ 
      success: false, 
      error: err.message,
      insight: "Keep up the great work tracking your meals! Every log helps you understand your eating patterns better."
    }, { status: 200 }); // Return 200 with fallback insight
  }
}

