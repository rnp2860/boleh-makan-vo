// app/api/cgm/waitlist/validate-referral/route.ts
// 📊 CGM Waitlist Validate Referral API - Check if a referral code is valid

import { NextRequest, NextResponse } from 'next/server';
import { validateReferralCode } from '@/lib/cgm/waitlist';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    
    if (!code) {
      return NextResponse.json(
        { success: false, error: 'Code is required' },
        { status: 400 }
      );
    }
    
    const result = await validateReferralCode(code);
    
    return NextResponse.json({
      success: true,
      valid: result.valid,
      referrerName: result.referrerName,
    });
  } catch (error) {
    console.error('Validate referral error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}


