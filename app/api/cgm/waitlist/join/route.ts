// app/api/cgm/waitlist/join/route.ts
// 📊 CGM Waitlist Join API - Handle new signups

import { NextRequest, NextResponse } from 'next/server';
import { joinWaitlist } from '@/lib/cgm/waitlist';
import { WaitlistSignupRequest } from '@/lib/cgm/types';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as WaitlistSignupRequest;
    
    // Validate required fields
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Join waitlist
    const result = await joinWaitlist(body);
    
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({
      success: true,
      entry: result.entry,
    }, { status: 201 });
  } catch (error) {
    console.error('Waitlist join error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


