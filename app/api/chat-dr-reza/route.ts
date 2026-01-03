// src/app/api/chat-dr-reza/route.ts
// 🩺 Enhanced Dr. Reza - Multi-Condition AI Health Advisor

import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getDailyContext } from '@/lib/dailyContextHelper';
import { DailyContext } from '@/lib/advisorPrompts';
import { getDrRezaSystemPrompt, buildMealAnalysisMessage, type MealContext } from '@/lib/ai/dr-reza-prompt';
import { getUserHealthProfile, getTodayIntake } from '@/lib/user/health-profile';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { 
      message, 
      conversationHistory, 
      userProfile, 
      recentMeals, 
      userId,
      mealContext, // NEW: Meal context for analysis
      useEnhancedPrompt = true // NEW: Flag to use enhanced multi-condition prompt
    } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Use enhanced prompt system if requested and userId available
    let systemPrompt: string;
    
    if (useEnhancedPrompt && userId) {
      try {
        // Fetch comprehensive health profile
        const healthProfile = await getUserHealthProfile(userId);
        
        // Get today's intake
        const todayIntake = await getTodayIntake(userId);
        healthProfile.todayIntake = todayIntake;
        
        // Generate condition-aware system prompt
        systemPrompt = getDrRezaSystemPrompt(healthProfile);
        
      } catch (err) {
        console.warn('Could not load enhanced profile, falling back to legacy:', err);
        useEnhancedPrompt = false;
      }
    }
    
    // Fallback to legacy prompt system if enhanced not available
    let dailyContext: DailyContext | null = null;
    
    if (!useEnhancedPrompt) {
      // Fetch daily context if userId is provided
      if (userId) {
        try {
          dailyContext = await getDailyContext(userId);
        } catch (err) {
          console.warn('Could not fetch daily context:', err);
        }
      }

      // Build context about the user
      const userContext = userProfile ? `
USER PROFILE:
- Name: ${userProfile.name || 'Friend'}
- Age: ${userProfile.details?.age || 'Not specified'}
- Gender: ${userProfile.details?.gender || 'Not specified'}
- Height: ${userProfile.details?.height || 'Not specified'} cm
- Weight: ${userProfile.details?.weight || 'Not specified'} kg
- Activity Level: ${userProfile.details?.activity || 'Not specified'}
- Health Goal: ${userProfile.goal === 'lose_weight' ? 'Weight Loss' : userProfile.goal === 'build_muscle' ? 'Muscle Building' : 'Maintenance'}
- Health Conditions: ${userProfile.healthConditions?.length > 0 ? userProfile.healthConditions.join(', ') : 'None reported'}
- Daily Calorie Target: ${userProfile.manualOverride || 'Auto-calculated'} kcal
` : '';

      // Build daily nutrition context
      const dailyNutritionContext = dailyContext ? `
═══════════════════════════════════════════════════════════════
TODAY'S NUTRITION SUMMARY (${new Date().toLocaleDateString('en-MY')})
═══════════════════════════════════════════════════════════════
- Meals logged today: ${dailyContext.meals_today}
- Calories consumed: ${dailyContext.daily_calories_before} / ${dailyContext.daily_target} kcal (${Math.round((dailyContext.daily_calories_before / dailyContext.daily_target) * 100)}%)
- Carbs: ${dailyContext.daily_carbs_before}g
- Protein: ${dailyContext.daily_protein_before}g
- Fat: ${dailyContext.daily_fat_before}g
- Sugar: ${dailyContext.daily_sugar_before}g / ${dailyContext.sugar_limit}g limit
- Sodium: ${dailyContext.daily_sodium_before}mg / ${dailyContext.sodium_limit}mg limit

HEALTH CONDITIONS: ${dailyContext.health_conditions.length > 0 ? dailyContext.health_conditions.join(', ') : 'None reported'}

${dailyContext.last_glucose !== null ? `LATEST GLUCOSE: ${dailyContext.last_glucose} mmol/L (${dailyContext.glucose_context || 'General'})` : ''}
${dailyContext.avg_glucose !== null ? `WEEKLY GLUCOSE AVG: ${dailyContext.avg_glucose} mmol/L` : ''}
═══════════════════════════════════════════════════════════════
` : '';

      // Build recent meals context
      const mealsContext = recentMeals && recentMeals.length > 0 ? `
RECENT MEALS (Last 3 days):
${recentMeals.slice(0, 10).map((meal: any) => 
  `- ${meal.name}: ${meal.calories} kcal, P:${meal.protein}g, C:${meal.carbs}g, F:${meal.fat}g (${new Date(meal.timestamp).toLocaleDateString()})`
).join('\n')}
` : '';

      systemPrompt = `You are Dr. Reza, a senior Malaysian clinical dietitian and nutritionist with 20+ years of experience. You work at a prestigious hospital in Kuala Lumpur and are known for your warm, caring approach.

PERSONALITY:
- Warm, kind, and empathetic - like a caring family doctor
- Use a mix of professional English with occasional Malay/Manglish phrases to build rapport (e.g., "Ah, nasi lemak for breakfast ya?", "Bagus!", "Jangan risau...")
- Inquisitive - ask follow-up questions to understand the patient better
- Encouraging but honest - celebrate progress while gently addressing concerns
- Culturally aware - understand Malaysian food, habits, and lifestyle
- Never judgmental about food choices

${dailyNutritionContext}

GUIDELINES:
1. Always address the user by name if known
2. Reference their health conditions and goals when giving advice
3. REFERENCE TODAY'S NUTRITION DATA when discussing meals or giving recommendations
4. If they're approaching their daily limits (calories, sugar, sodium), warn them gently
5. If they have diabetes, be extra careful about sugar and carb recommendations - predict glucose impact
6. If they have high blood pressure, watch sodium intake
7. If they have high cholesterol, advise on fat quality
8. If they have kidney issues, monitor protein and sodium
9. Suggest Malaysian-friendly alternatives when possible
10. Keep responses concise but warm (2-3 paragraphs max)
11. End with a question or actionable tip when appropriate
12. If asked about specific meals, reference their logged meals if available
13. When discussing budget/remaining calories, be specific with numbers

IMPORTANT:
- You are NOT a replacement for real medical advice
- For serious concerns, recommend consulting their doctor
- Be supportive of their journey, not critical
- USE THE DAILY NUTRITION DATA to give specific, personalized advice

${userContext}
${mealsContext}

Remember: You are having a friendly consultation, not lecturing. Be like a wise friend who happens to be a nutrition expert.`;
    }
    // Close the if (!useEnhancedPrompt) block

    // Build user message with meal context if analyzing food
    let userMessage = message;
    if (mealContext) {
      userMessage = buildMealAnalysisMessage(mealContext as MealContext, message);
    }

    // Build messages array with conversation history
    const messages: OpenAI.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemPrompt },
    ];

    // Add conversation history (last 10 messages to keep context manageable)
    if (conversationHistory && Array.isArray(conversationHistory)) {
      conversationHistory.slice(-10).forEach((msg: any) => {
        messages.push({
          role: msg.role as 'user' | 'assistant',
          content: msg.content,
        });
      });
    }

    // Add current message (with meal context if analyzing food)
    messages.push({ role: 'user', content: userMessage });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.8, // Slightly higher for more natural conversation
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Could you try again?";

    // Include daily context in response for frontend use
    return NextResponse.json({ 
      reply,
      dailyContext: dailyContext ? {
        caloriesConsumed: dailyContext.daily_calories_before,
        calorieTarget: dailyContext.daily_target,
        mealsToday: dailyContext.meals_today,
        sugarConsumed: dailyContext.daily_sugar_before,
        sugarLimit: dailyContext.sugar_limit,
        sodiumConsumed: dailyContext.daily_sodium_before,
        sodiumLimit: dailyContext.sodium_limit,
        lastGlucose: dailyContext.last_glucose,
        glucoseContext: dailyContext.glucose_context
      } : null
    });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Dr. Reza' },
      { status: 500 }
    );
  }
}
