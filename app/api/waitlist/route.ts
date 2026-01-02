// 🇲🇾 Boleh Makan Waitlist API

import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Valid conditions
const VALID_CONDITIONS = ['diabetes', 'hypertension', 'cholesterol', 'ckd'];

interface WaitlistInput {
  email: string;
  name?: string;
  conditions?: string[];
  interestedInRamadan?: boolean;
  source?: string;
  referralCode?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: WaitlistInput = await request.json();
    
    // Validate email
    if (!body.email || !EMAIL_REGEX.test(body.email)) {
      return NextResponse.json(
        { error: 'Sila masukkan email yang sah / Please enter a valid email' },
        { status: 400 }
      );
    }
    
    // Normalize email
    const email = body.email.toLowerCase().trim();
    
    // Validate conditions if provided
    const conditions = body.conditions?.filter(c => VALID_CONDITIONS.includes(c)) || [];
    
    // Get client info
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    const supabase = getSupabaseClient();
    
    // Check if email already exists
    const { data: existing } = await supabase
      .from('waitlist')
      .select('id, status')
      .eq('email', email)
      .single();
    
    if (existing) {
      // Update existing entry if they're signing up again
      if (existing.status === 'unsubscribed') {
        await supabase
          .from('waitlist')
          .update({ 
            status: 'pending',
            conditions: conditions.length > 0 ? conditions : undefined,
            interested_in_ramadan: body.interestedInRamadan || false,
          })
          .eq('id', existing.id);
        
        return NextResponse.json({
          success: true,
          message: 'Selamat kembali! Anda telah didaftarkan semula / Welcome back! You have been re-registered',
          isReturning: true,
        });
      }
      
      return NextResponse.json({
        success: true,
        message: 'Email ini sudah didaftarkan / This email is already registered',
        alreadyRegistered: true,
      });
    }
    
    // Insert new waitlist entry
    const { error } = await supabase.from('waitlist').insert({
      email,
      name: body.name?.trim() || null,
      conditions: conditions.length > 0 ? conditions : [],
      interested_in_ramadan: body.interestedInRamadan || false,
      source: body.source || 'landing_page',
      referral_code: body.referralCode || null,
      utm_source: body.utmSource || null,
      utm_medium: body.utmMedium || null,
      utm_campaign: body.utmCampaign || null,
      ip_address: ip,
      user_agent: userAgent,
    });
    
    if (error) {
      console.error('Waitlist insert error:', error);
      
      // Handle unique constraint violation
      if (error.code === '23505') {
        return NextResponse.json({
          success: true,
          message: 'Email ini sudah didaftarkan / This email is already registered',
          alreadyRegistered: true,
        });
      }
      
      return NextResponse.json(
        { error: 'Pendaftaran gagal. Sila cuba lagi / Registration failed. Please try again' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      success: true,
      message: 'Terima kasih! Anda dalam senarai menunggu / Thank you! You are on the waitlist',
    });
    
  } catch (error) {
    console.error('Waitlist API error:', error);
    return NextResponse.json(
      { error: 'Ralat sistem. Sila cuba lagi / System error. Please try again' },
      { status: 500 }
    );
  }
}

// Get waitlist stats (for admin)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('key');
    
    // Simple admin key check (replace with proper auth in production)
    if (adminKey !== process.env.ADMIN_API_KEY) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const supabase = getSupabaseClient();
    
    // Get total count
    const { count: total } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true });
    
    // Get Ramadan interested count
    const { count: ramadanCount } = await supabase
      .from('waitlist')
      .select('*', { count: 'exact', head: true })
      .eq('interested_in_ramadan', true);
    
    // Get by source
    const { data: bySource } = await supabase
      .from('waitlist')
      .select('source');
    
    const sourceCounts: Record<string, number> = {};
    bySource?.forEach(row => {
      sourceCounts[row.source] = (sourceCounts[row.source] || 0) + 1;
    });
    
    return NextResponse.json({
      total: total || 0,
      ramadanInterested: ramadanCount || 0,
      bySource: sourceCounts,
    });
    
  } catch (error) {
    console.error('Waitlist stats error:', error);
    return NextResponse.json({ error: 'Failed to get stats' }, { status: 500 });
  }
}

