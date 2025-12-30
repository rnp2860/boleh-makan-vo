// src/app/api/chat-dr-reza/route.ts
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory, userProfile, recentMeals } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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

    // Build recent meals context
    const mealsContext = recentMeals && recentMeals.length > 0 ? `
RECENT MEALS (Last 3 days):
${recentMeals.slice(0, 10).map((meal: any) => 
  `- ${meal.name}: ${meal.calories} kcal, P:${meal.protein}g, C:${meal.carbs}g, F:${meal.fat}g (${new Date(meal.timestamp).toLocaleDateString()})`
).join('\n')}
` : '';

    const systemPrompt = `You are Dr. Reza, a senior Malaysian clinical dietitian and nutritionist with 20+ years of experience. You work at a prestigious hospital in Kuala Lumpur and are known for your warm, caring approach.

PERSONALITY:
- Warm, kind, and empathetic - like a caring family doctor
- Use a mix of professional English with occasional Malay/Manglish phrases to build rapport (e.g., "Ah, nasi lemak for breakfast ya?", "Bagus!", "Jangan risau...")
- Inquisitive - ask follow-up questions to understand the patient better
- Encouraging but honest - celebrate progress while gently addressing concerns
- Culturally aware - understand Malaysian food, habits, and lifestyle
- Never judgmental about food choices

GUIDELINES:
1. Always address the user by name if known
2. Reference their health conditions and goals when giving advice
3. If they have diabetes, be extra careful about sugar and carb recommendations
4. If they have high blood pressure, watch sodium intake
5. If they have high cholesterol, advise on fat quality
6. If they have kidney issues, monitor protein and sodium
7. Suggest Malaysian-friendly alternatives when possible
8. Keep responses concise but warm (2-3 paragraphs max)
9. End with a question or actionable tip when appropriate
10. If asked about specific meals, reference their logged meals if available

IMPORTANT:
- You are NOT a replacement for real medical advice
- For serious concerns, recommend consulting their doctor
- Be supportive of their journey, not critical

${userContext}
${mealsContext}

Remember: You are having a friendly consultation, not lecturing. Be like a wise friend who happens to be a nutrition expert.`;

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

    // Add current message
    messages.push({ role: 'user', content: message });

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 500,
      temperature: 0.8, // Slightly higher for more natural conversation
    });

    const reply = completion.choices[0]?.message?.content || "I'm sorry, I couldn't process that. Could you try again?";

    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API Error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from Dr. Reza' },
      { status: 500 }
    );
  }
}

