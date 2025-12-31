import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// 🩺 DR. REZA'S GOAL PRESCRIPTION PROMPT
const GOAL_PRESCRIPTION_PROMPT = `You are Dr. Reza, a friendly Malaysian nutritionist who creates personalized weekly "Micro-Goals" for users.

=== YOUR TASK ===
Analyze the user's nutrition report from the last 7 days. Identify the ONE biggest problem area and generate a specific, culturally relevant goal for next week.

=== PROBLEM PRIORITY (check in this order) ===
1. DANGER ZONE: Any metric in "Danger" status (over limit)
2. WARNING ZONE: Any metric in "Warning" status (approaching limit)
3. IMBALANCE: Unusual meal patterns (skipping breakfast, late dinners)
4. LOW NUTRIENTS: Below recommended protein, fiber, etc.

=== GOAL REQUIREMENTS ===
❌ BAD GOALS (too vague):
- "Eat healthier"
- "Reduce sugar intake"
- "Exercise more"
- "Drink more water"

✅ GOOD GOALS (specific + actionable + Malaysian context):
- "Your sugar was high (28g/day) from daily Teh Tarik. Goal: Swap Teh Tarik for Teh 'O' Kosong for 4 days next week."
- "Sodium exceeded limits from Mamak dinners. Goal: Choose Roti Canai + Dhal instead of Maggi Goreng for 3 dinners."
- "Breakfast was skipped 5 days. Goal: Have a quick breakfast (roti + kopi or oats) at least 4 days."
- "Protein was low (45g avg). Goal: Add an egg (telur rebus/mata) to 4 meals this week."
- "Late night snacks added 400 extra calories. Goal: No food after 9pm for 5 days."

=== MALAYSIAN FOOD SWAPS ===
High Sugar → Teh Tarik → Teh 'O' Kosong, Milo → Milo Kosong, Sirap → Air Kosong
High Sodium → Maggi Goreng → Kuey Teow Soup, Nasi Lemak Extra Sambal → Standard portion
Low Protein → Add telur, ayam, ikan bilis, tauhu
High Calories → Nasi + Lauk → Half rice portion, Goreng → Rebus/Panggang

=== OUTPUT FORMAT ===
Return ONLY a valid JSON object:
{
  "problem_identified": "Brief description of the main issue found",
  "suggested_goal_text": "Your specific, actionable goal with Malaysian food context (max 50 words)",
  "target_metric": {
    "metric_name": "max_sugar" | "max_sodium" | "min_protein" | "max_calories" | "min_breakfast" | null,
    "target_value": number or null,
    "unit": "g" | "mg" | "kcal" | "days" | null
  },
  "motivation": "A short encouraging message in Malaysian English (max 20 words)"
}`;

export async function POST(req: Request) {
  try {
    const { user_id, report_summary } = await req.json();

    if (!report_summary) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing report_summary data' 
      }, { status: 400 });
    }

    // Build context from report summary
    const stats = report_summary.summary_stats || {};
    const sodiumWatch = report_summary.sodium_sugar_watch?.sodium || {};
    const sugarWatch = report_summary.sodium_sugar_watch?.sugar || {};
    const mealBreakdown = report_summary.meal_breakdown || {};
    
    const reportContext = `
=== USER'S 7-DAY NUTRITION REPORT ===

📊 SUMMARY STATS:
- Total Meals Logged: ${stats.total_meals || 0} over ${stats.total_days || 0} days
- Average Daily Calories: ${stats.avg_daily_calories || 0} kcal
- Total Protein: ${stats.total_protein || 0}g (${Math.round((stats.total_protein || 0) / (stats.total_days || 1))}g/day avg)
- Total Carbs: ${stats.total_carbs || 0}g
- Total Fat: ${stats.total_fat || 0}g

⚠️ SODIUM WATCH:
- Average Daily: ${sodiumWatch.avg_daily || 0}mg (Limit: 2000mg)
- Status: ${sodiumWatch.status || 'Unknown'}
- Percentage of Limit: ${sodiumWatch.percentage_of_limit || 0}%

🍬 SUGAR WATCH:
- Average Daily: ${sugarWatch.avg_daily || 0}g (Limit: 25g)
- Status: ${sugarWatch.status || 'Unknown'}
- Percentage of Limit: ${sugarWatch.percentage_of_limit || 0}%

🍽️ MEAL BREAKDOWN:
- Breakfast: ${mealBreakdown.Breakfast?.count || 0} meals (${mealBreakdown.Breakfast?.percentage || 0}% of calories)
- Lunch: ${mealBreakdown.Lunch?.count || 0} meals (${mealBreakdown.Lunch?.percentage || 0}% of calories)
- Dinner: ${mealBreakdown.Dinner?.count || 0} meals (${mealBreakdown.Dinner?.percentage || 0}% of calories)
- Snack: ${mealBreakdown.Snack?.count || 0} meals (${mealBreakdown.Snack?.percentage || 0}% of calories)

📅 PERIOD: ${report_summary.period?.start_date || 'Unknown'} to ${report_summary.period?.end_date || 'Unknown'}
`;

    // Call OpenAI to generate the goal prescription
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: GOAL_PRESCRIPTION_PROMPT
        },
        {
          role: "user",
          content: `Please analyze this nutrition report and generate a specific weekly Micro-Goal:\n\n${reportContext}`
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 300,
    });

    const goalPrescription = JSON.parse(response.choices[0].message.content || '{}');
    
    // Validate the response has required fields
    if (!goalPrescription.suggested_goal_text) {
      throw new Error('AI did not generate a valid goal');
    }

    return NextResponse.json({
      success: true,
      data: {
        problem_identified: goalPrescription.problem_identified || 'General nutrition improvement needed',
        suggested_goal_text: goalPrescription.suggested_goal_text,
        target_metric: goalPrescription.target_metric || null,
        motivation: goalPrescription.motivation || 'You got this! Small steps, big changes! 💪',
        generated_at: new Date().toISOString(),
        based_on_period: {
          start_date: report_summary.period?.start_date,
          end_date: report_summary.period?.end_date
        }
      }
    });

  } catch (err: any) {
    console.error('Goal prescription error:', err);
    
    // Return a fallback goal if AI fails
    return NextResponse.json({
      success: true,
      data: {
        problem_identified: 'Unable to analyze report fully',
        suggested_goal_text: 'Log all your meals for 7 days straight - this helps Dr. Reza give you better advice!',
        target_metric: {
          metric_name: 'min_meals_logged',
          target_value: 21,
          unit: 'meals'
        },
        motivation: 'Every meal logged is a step towards better health! 📝',
        generated_at: new Date().toISOString(),
        is_fallback: true
      }
    });
  }
}

