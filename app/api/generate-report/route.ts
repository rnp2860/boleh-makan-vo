import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  try {
    const { weeklyData, userProfile, dailyBudget, avgCalories, avgProtein, avgCarbs, avgFat } = await req.json();

    // Calculate tracking consistency
    const daysTracked = weeklyData.filter((d: any) => d.calories > 0).length;
    const calorieAdherence = Math.round((avgCalories / dailyBudget) * 100);
    
    // Identify patterns
    const overBudgetDays = weeklyData.filter((d: any) => d.calories > dailyBudget).length;
    const underBudgetDays = weeklyData.filter((d: any) => d.calories > 0 && d.calories < dailyBudget * 0.7).length;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are Dr. Reza, a friendly Malaysian dietitian writing a weekly summary for a patient.

Style: Warm, encouraging, uses light Manglish. Professional but approachable.
Length: 2-3 sentences max.

Consider:
- Patient's goal: ${userProfile.goal === 'lose_weight' ? 'Weight Loss' : userProfile.goal === 'build_muscle' ? 'Muscle Building' : 'Maintenance'}
- Health conditions: ${userProfile.healthConditions.join(', ') || 'None'}
- Tracking consistency: ${daysTracked}/7 days
- Calorie adherence: ${calorieAdherence}% of ${dailyBudget} target
- Days over budget: ${overBudgetDays}
- Days severely under: ${underBudgetDays}

Give personalized, actionable feedback. If they have diabetes, mention blood sugar. If losing weight, encourage deficit. Be supportive!`
        },
        {
          role: "user",
          content: `Weekly stats:
- Avg Calories: ${avgCalories}/day (target: ${dailyBudget})
- Avg Protein: ${avgProtein}g
- Avg Carbs: ${avgCarbs}g
- Avg Fat: ${avgFat}g

Write a brief weekly summary for this patient.`
        }
      ],
      max_tokens: 150,
    });

    const summary = response.choices[0].message.content?.trim() || 
      "You're doing well! Keep tracking consistently and focus on balanced meals. See you next week! 💪";

    return NextResponse.json({ success: true, summary });

  } catch (err: any) {
    console.error("Report generation error:", err);
    return NextResponse.json({ 
      success: false,
      summary: "Great effort this week! Keep tracking your meals consistently and stay mindful of portions. You've got this! 💪"
    });
  }
}

