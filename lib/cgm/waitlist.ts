// lib/cgm/waitlist.ts
// 📊 CGM Waitlist - Server-side operations

import { getSupabaseServiceClient } from '@/lib/supabase';
import { DEFAULT_TENANT_ID } from '@/lib/types/tenant';
import {
  CGMWaitlistEntry,
  WaitlistSignupRequest,
  WaitlistUpdateRequest,
  WaitlistStatusResponse,
  WaitlistStatsResponse,
  WaitlistEventType,
  CGMDeviceType,
  CGMFeatureCode,
} from './types';

// ============================================
// WAITLIST OPERATIONS
// ============================================

/**
 * Join the CGM waitlist
 */
export async function joinWaitlist(
  data: WaitlistSignupRequest
): Promise<{ success: boolean; entry?: CGMWaitlistEntry; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // Check if email already exists
  const { data: existing } = await supabase
    .from('cgm_waitlist')
    .select('id, email, status')
    .eq('email', data.email.toLowerCase())
    .single();
  
  if (existing) {
    if (existing.status === 'unsubscribed') {
      // Re-activate the entry
      const { data: updated, error } = await supabase
        .from('cgm_waitlist')
        .update({
          status: 'waiting',
          ...buildInsertData(data),
          updated_at: new Date().toISOString(),
        })
        .eq('id', existing.id)
        .select()
        .single();
      
      if (error) {
        return { success: false, error: 'Failed to rejoin waitlist' };
      }
      
      await logWaitlistEvent(updated.id, 'signed_up', { reactivated: true });
      return { success: true, entry: updated };
    }
    
    return { success: false, error: 'This email is already on the waitlist' };
  }
  
  // Insert new entry
  const insertData = {
    email: data.email.toLowerCase(),
    name: data.name || null,
    user_id: data.userId || null,
    tenant_id: data.tenantId || DEFAULT_TENANT_ID,
    current_device: data.currentDevice || null,
    other_device_name: data.otherDeviceName || null,
    usage_frequency: data.usageFrequency || null,
    willing_to_pay: data.willingToPay || false,
    price_sensitivity: data.priceSensitivity || null,
    desired_features: data.desiredFeatures || [],
    email_updates: data.emailUpdates ?? true,
    whatsapp_updates: data.whatsappUpdates || false,
    phone_number: data.phoneNumber || null,
    referral_source: data.referralSource || null,
    referred_by: data.referredBy?.toUpperCase() || null,
  };
  
  const { data: entry, error } = await supabase
    .from('cgm_waitlist')
    .insert(insertData)
    .select()
    .single();
  
  if (error) {
    console.error('Waitlist signup error:', error);
    return { success: false, error: 'Failed to join waitlist. Please try again.' };
  }
  
  // Log the signup event
  await logWaitlistEvent(entry.id, 'signed_up', {
    device: data.currentDevice,
    referredBy: data.referredBy,
  });
  
  // If referred, log referral conversion for the referrer
  if (data.referredBy) {
    const { data: referrer } = await supabase
      .from('cgm_waitlist')
      .select('id')
      .eq('referral_code', data.referredBy.toUpperCase())
      .single();
    
    if (referrer) {
      await logWaitlistEvent(referrer.id, 'referral_converted', {
        newSignupId: entry.id,
      });
    }
  }
  
  return { success: true, entry };
}

/**
 * Update waitlist preferences
 */
export async function updateWaitlistPreferences(
  entryId: string,
  data: WaitlistUpdateRequest
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const updateData: Record<string, any> = {};
  
  if (data.currentDevice !== undefined) updateData.current_device = data.currentDevice;
  if (data.otherDeviceName !== undefined) updateData.other_device_name = data.otherDeviceName;
  if (data.usageFrequency !== undefined) updateData.usage_frequency = data.usageFrequency;
  if (data.willingToPay !== undefined) updateData.willing_to_pay = data.willingToPay;
  if (data.priceSensitivity !== undefined) updateData.price_sensitivity = data.priceSensitivity;
  if (data.desiredFeatures !== undefined) updateData.desired_features = data.desiredFeatures;
  if (data.emailUpdates !== undefined) updateData.email_updates = data.emailUpdates;
  if (data.whatsappUpdates !== undefined) updateData.whatsapp_updates = data.whatsappUpdates;
  if (data.phoneNumber !== undefined) updateData.phone_number = data.phoneNumber;
  
  const { error } = await supabase
    .from('cgm_waitlist')
    .update(updateData)
    .eq('id', entryId);
  
  if (error) {
    console.error('Waitlist update error:', error);
    return { success: false, error: 'Failed to update preferences' };
  }
  
  await logWaitlistEvent(entryId, 'updated_preferences', updateData);
  
  return { success: true };
}

/**
 * Get waitlist entry by email
 */
export async function getWaitlistByEmail(
  email: string
): Promise<CGMWaitlistEntry | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('cgm_waitlist')
    .select('*')
    .eq('email', email.toLowerCase())
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as CGMWaitlistEntry;
}

/**
 * Get waitlist entry by user ID
 */
export async function getWaitlistByUserId(
  userId: string
): Promise<CGMWaitlistEntry | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('cgm_waitlist')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as CGMWaitlistEntry;
}

/**
 * Get waitlist entry by referral code
 */
export async function getWaitlistByReferralCode(
  code: string
): Promise<CGMWaitlistEntry | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('cgm_waitlist')
    .select('*')
    .eq('referral_code', code.toUpperCase())
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data as CGMWaitlistEntry;
}

/**
 * Get full waitlist status for a user
 */
export async function getWaitlistStatus(
  entryId: string
): Promise<WaitlistStatusResponse | null> {
  const supabase = getSupabaseServiceClient();
  
  // Get entry
  const { data: entry, error } = await supabase
    .from('cgm_waitlist')
    .select('*')
    .eq('id', entryId)
    .single();
  
  if (error || !entry) {
    return null;
  }
  
  // Get total waiting count
  const { count: totalWaiting } = await supabase
    .from('cgm_waitlist')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'waiting')
    .eq('tenant_id', entry.tenant_id);
  
  // Calculate effective position
  const effectivePosition = Math.max(1, entry.queue_position - entry.queue_boost);
  
  // Estimate wait time (rough: ~50 invites per week)
  const estimatedWaitWeeks = Math.ceil(effectivePosition / 50);
  
  // Build referral URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bolehmakan.my';
  const referralUrl = `${baseUrl}/cgm?ref=${entry.referral_code}`;
  
  return {
    entry: entry as CGMWaitlistEntry,
    effectivePosition,
    totalWaiting: totalWaiting || 0,
    estimatedWaitWeeks,
    referralUrl,
  };
}

/**
 * Unsubscribe from waitlist
 */
export async function unsubscribeFromWaitlist(
  entryId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('cgm_waitlist')
    .update({
      status: 'unsubscribed',
      email_updates: false,
      whatsapp_updates: false,
    })
    .eq('id', entryId);
  
  if (error) {
    return { success: false, error: 'Failed to unsubscribe' };
  }
  
  await logWaitlistEvent(entryId, 'unsubscribed', {});
  
  return { success: true };
}

/**
 * Get waitlist count (for display)
 */
export async function getWaitlistCount(
  tenantId?: string
): Promise<number> {
  const supabase = getSupabaseServiceClient();
  
  let query = supabase
    .from('cgm_waitlist')
    .select('*', { count: 'exact', head: true })
    .neq('status', 'unsubscribed');
  
  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }
  
  const { count } = await query;
  
  return count || 0;
}

/**
 * Validate referral code
 */
export async function validateReferralCode(
  code: string
): Promise<{ valid: boolean; referrerName?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { data } = await supabase
    .from('cgm_waitlist')
    .select('name, status')
    .eq('referral_code', code.toUpperCase())
    .single();
  
  if (!data || data.status === 'unsubscribed') {
    return { valid: false };
  }
  
  return {
    valid: true,
    referrerName: data.name || undefined,
  };
}

// ============================================
// ADMIN OPERATIONS
// ============================================

/**
 * Get waitlist statistics for admin dashboard
 */
export async function getWaitlistStats(
  tenantId?: string
): Promise<WaitlistStatsResponse> {
  const supabase = getSupabaseServiceClient();
  
  // Base query filter
  const baseFilter = tenantId ? { tenant_id: tenantId } : {};
  
  // Get total counts by status
  const { data: entries } = await supabase
    .from('cgm_waitlist')
    .select('status, current_device, desired_features, referral_code, referral_count, name, created_at')
    .match(baseFilter);
  
  const allEntries = entries || [];
  
  const stats: WaitlistStatsResponse = {
    totalSignups: allEntries.length,
    waitingCount: allEntries.filter(e => e.status === 'waiting').length,
    betaInvitedCount: allEntries.filter(e => e.status === 'beta_invited').length,
    betaActiveCount: allEntries.filter(e => e.status === 'beta_active').length,
    convertedCount: allEntries.filter(e => e.status === 'converted').length,
    deviceBreakdown: {} as Record<CGMDeviceType, number>,
    featureBreakdown: {} as Record<CGMFeatureCode, number>,
    signupsByDay: [],
    topReferrers: [],
  };
  
  // Device breakdown
  for (const entry of allEntries) {
    if (entry.current_device) {
      stats.deviceBreakdown[entry.current_device as CGMDeviceType] = 
        (stats.deviceBreakdown[entry.current_device as CGMDeviceType] || 0) + 1;
    }
    
    // Feature breakdown
    const features = entry.desired_features as CGMFeatureCode[] || [];
    for (const feature of features) {
      stats.featureBreakdown[feature] = (stats.featureBreakdown[feature] || 0) + 1;
    }
  }
  
  // Signups by day (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const signupsByDay: Record<string, number> = {};
  for (const entry of allEntries) {
    const date = new Date(entry.created_at).toISOString().split('T')[0];
    signupsByDay[date] = (signupsByDay[date] || 0) + 1;
  }
  stats.signupsByDay = Object.entries(signupsByDay)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-30);
  
  // Top referrers
  stats.topReferrers = allEntries
    .filter(e => e.referral_count > 0)
    .sort((a, b) => b.referral_count - a.referral_count)
    .slice(0, 10)
    .map(e => ({
      referralCode: e.referral_code,
      count: e.referral_count,
      name: e.name,
    }));
  
  return stats;
}

/**
 * Invite users to beta (admin)
 */
export async function inviteToBeta(
  entryIds: string[]
): Promise<{ success: boolean; invitedCount: number; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('cgm_waitlist')
    .update({
      status: 'beta_invited',
      beta_invited_at: new Date().toISOString(),
    })
    .in('id', entryIds)
    .eq('status', 'waiting');
  
  if (error) {
    return { success: false, invitedCount: 0, error: 'Failed to invite users' };
  }
  
  // Log events
  for (const id of entryIds) {
    await logWaitlistEvent(id, 'beta_invited', {});
  }
  
  return { success: true, invitedCount: entryIds.length };
}

/**
 * Export waitlist as CSV data
 */
export async function exportWaitlistCSV(
  tenantId?: string
): Promise<string> {
  const supabase = getSupabaseServiceClient();
  
  let query = supabase
    .from('cgm_waitlist')
    .select('*')
    .order('created_at', { ascending: true });
  
  if (tenantId) {
    query = query.eq('tenant_id', tenantId);
  }
  
  const { data } = await query;
  
  if (!data || data.length === 0) {
    return 'email,name,device,status,created_at\n';
  }
  
  const headers = ['email', 'name', 'current_device', 'usage_frequency', 'willing_to_pay', 'status', 'referral_code', 'referral_count', 'queue_position', 'created_at'];
  const rows = data.map(entry => 
    headers.map(h => JSON.stringify((entry as any)[h] ?? '')).join(',')
  );
  
  return [headers.join(','), ...rows].join('\n');
}

// ============================================
// EVENT LOGGING
// ============================================

/**
 * Log a waitlist event
 */
export async function logWaitlistEvent(
  waitlistId: string,
  eventType: WaitlistEventType,
  metadata: Record<string, any> = {}
): Promise<void> {
  const supabase = getSupabaseServiceClient();
  
  await supabase.from('cgm_waitlist_events').insert({
    waitlist_id: waitlistId,
    event_type: eventType,
    metadata,
  });
}

// ============================================
// HELPERS
// ============================================

function buildInsertData(data: WaitlistSignupRequest): Record<string, any> {
  return {
    name: data.name || null,
    user_id: data.userId || null,
    current_device: data.currentDevice || null,
    other_device_name: data.otherDeviceName || null,
    usage_frequency: data.usageFrequency || null,
    willing_to_pay: data.willingToPay || false,
    price_sensitivity: data.priceSensitivity || null,
    desired_features: data.desiredFeatures || [],
    email_updates: data.emailUpdates ?? true,
    whatsapp_updates: data.whatsappUpdates || false,
    phone_number: data.phoneNumber || null,
    referral_source: data.referralSource || null,
  };
}


