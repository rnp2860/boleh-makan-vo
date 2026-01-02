// app/api/cgm/waitlist/status/route.ts
// 📊 CGM Waitlist Status API - Get user's waitlist status

import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getWaitlistByEmail, getWaitlistByUserId, getWaitlistStatus } from '@/lib/cgm/waitlist';

export async function GET(request: NextRequest) {
  try {
    // Try to get user info from various sources
    // In a real app, you'd get this from your auth system
    const { searchParams } = new URL(request.url);
    const email = searchParams.get('email');
    const userId = searchParams.get('userId');
    
    // For now, check by email or userId if provided
    let entry = null;
    
    if (email) {
      entry = await getWaitlistByEmail(email);
    } else if (userId) {
      entry = await getWaitlistByUserId(userId);
    }
    
    // If no entry found, return empty status
    if (!entry) {
      return NextResponse.json({
        success: true,
        status: null,
      });
    }
    
    // Get full status
    const status = await getWaitlistStatus(entry.id);
    
    return NextResponse.json({
      success: true,
      status,
    });
  } catch (error) {
    console.error('Waitlist status error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


