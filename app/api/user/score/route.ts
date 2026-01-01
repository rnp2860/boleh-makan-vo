// app/api/user/score/route.ts
// 🎯 BOLEH SCORE API ENDPOINT
// Returns the user's daily health score with insights

import { NextResponse } from 'next/server';
import { 
  calculateDailyScore, 
  getScoreGrade, 
  getWeeklyScores,
  ScoreResult 
} from '@/lib/calculateBolehScore';

export async function GET(req: Request) {
  try {
    // Parse query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('user_id');
    const dateParam = searchParams.get('date'); // Optional: YYYY-MM-DD format
    const includeWeekly = searchParams.get('weekly') === 'true';

    // Validate user_id
    if (!userId) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'user_id is required',
          hint: 'Pass user_id as query parameter: /api/user/score?user_id=xxx'
        },
        { status: 400 }
      );
    }

    // Parse date or use today
    let targetDate = new Date();
    if (dateParam) {
      const parsed = new Date(dateParam);
      if (!isNaN(parsed.getTime())) {
        targetDate = parsed;
      }
    }

    // Calculate today's score
    const result: ScoreResult = await calculateDailyScore(userId, targetDate);
    const grade = getScoreGrade(result.score);

    // Build primary insight (first meaningful one)
    const primaryInsight = result.insights.length > 1 
      ? result.insights[1] // Skip the emoji summary, get the first detail
      : result.insights[0] || 'Track more data to get personalized insights.';

    // Build response
    const response: any = {
      success: true,
      data: {
        score: result.score,
        grade: grade.grade,
        label: grade.label,
        emoji: grade.emoji,
        color: grade.color,
        date: result.date,
        
        // Quick summary
        insight: primaryInsight,
        
        // Detailed breakdown
        breakdown: {
          base: result.breakdown.baseScore,
          bonuses: {
            consistency: result.breakdown.consistencyBonus,
            healthy_prep: result.breakdown.healthyBonus,
            good_glucose: result.breakdown.medicalBonus,
          },
          penalties: {
            unhealthy_context: result.breakdown.contextPenalty,
            deep_fried: result.breakdown.prepPenalty,
            sugar_detected: result.breakdown.sugarPenalty,
            high_vitals: result.breakdown.medicalPenalty,
          },
        },
        
        // All insights
        insights: result.insights,
        
        // Tracking stats
        stats: {
          meals_logged: result.mealCount,
          vitals_logged: result.vitalsCount,
        },
      },
    };

    // Optionally include weekly trend
    if (includeWeekly) {
      try {
        const weeklyScores = await getWeeklyScores(userId);
        response.data.weekly = weeklyScores;
        
        // Calculate trend
        const recentAvg = weeklyScores.slice(-3).reduce((sum, d) => sum + d.score, 0) / 3;
        const earlierAvg = weeklyScores.slice(0, 3).reduce((sum, d) => sum + d.score, 0) / 3;
        const trend = recentAvg - earlierAvg;
        
        response.data.trend = {
          direction: trend > 2 ? 'up' : trend < -2 ? 'down' : 'stable',
          change: Math.round(trend),
          message: trend > 2 
            ? 'Your score is improving! 📈' 
            : trend < -2 
              ? 'Score declining. Review your habits. 📉'
              : 'Score is stable. 📊',
        };
      } catch (weeklyError) {
        console.error('Error fetching weekly scores:', weeklyError);
        response.data.weekly = null;
      }
    }

    return NextResponse.json(response);

  } catch (error: any) {
    console.error('Score API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to calculate score',
        // Return a default score on error so UI doesn't break
        data: {
          score: 70,
          grade: 'B',
          label: 'Good',
          emoji: '👍',
          color: 'teal',
          insight: 'Unable to calculate score. Please try again.',
          insights: ['Error calculating score'],
          stats: { meals_logged: 0, vitals_logged: 0 },
        },
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST: Calculate score for specific date range
// ============================================

export async function POST(req: Request) {
  try {
    const { user_id, start_date, end_date } = await req.json();

    if (!user_id) {
      return NextResponse.json(
        { success: false, error: 'user_id is required' },
        { status: 400 }
      );
    }

    // Calculate scores for date range
    const scores: any[] = [];
    const start = new Date(start_date || new Date());
    const end = new Date(end_date || new Date());
    
    // Limit to 30 days max
    const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const daysToFetch = Math.min(Math.max(daysDiff, 1), 30);

    for (let i = 0; i < daysToFetch; i++) {
      const date = new Date(start);
      date.setDate(date.getDate() + i);
      
      const result = await calculateDailyScore(user_id, date);
      const grade = getScoreGrade(result.score);
      
      scores.push({
        date: result.date,
        score: result.score,
        grade: grade.grade,
        meals: result.mealCount,
        vitals: result.vitalsCount,
      });
    }

    // Calculate average
    const avgScore = scores.length > 0
      ? Math.round(scores.reduce((sum, s) => sum + s.score, 0) / scores.length)
      : 70;

    return NextResponse.json({
      success: true,
      data: {
        scores,
        summary: {
          average_score: avgScore,
          days_analyzed: scores.length,
          best_day: scores.reduce((best, s) => s.score > best.score ? s : best, scores[0]),
          worst_day: scores.reduce((worst, s) => s.score < worst.score ? s : worst, scores[0]),
        },
      },
    });

  } catch (error: any) {
    console.error('Score range API error:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

