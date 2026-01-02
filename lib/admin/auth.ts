// lib/admin/auth.ts
// 🔐 Admin Authentication Utilities

import { cookies } from 'next/headers';
import { getSupabaseServiceClient } from '@/lib/supabase';
import { AdminUser } from '@/lib/types/admin';
import { logAuthEvent } from './audit';
import { AUDIT_ACTIONS } from '@/lib/types/admin';

const ADMIN_SESSION_KEY = 'boleh_makan_admin_session';
const SESSION_TIMEOUT_MINUTES = 30;

/**
 * Verify if current user is an admin
 */
export async function verifyAdmin(userId: string): Promise<AdminUser | null> {
  try {
    const supabase = getSupabaseServiceClient();

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', userId)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return null;
    }

    // Update last activity
    await supabase
      .from('admin_users')
      .update({ last_activity_at: new Date().toISOString() })
      .eq('id', data.id);

    return data as AdminUser;
  } catch (err) {
    console.error('Error verifying admin:', err);
    return null;
  }
}

/**
 * Get admin user from session/cookies
 */
export async function getAdminFromSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get(ADMIN_SESSION_KEY);
    
    if (!sessionCookie?.value) {
      return null;
    }

    // Parse session data
    const sessionData = JSON.parse(sessionCookie.value);
    
    // Check session expiry
    if (new Date(sessionData.expires_at) < new Date()) {
      return null;
    }

    // Verify admin still exists and is active
    return await verifyAdmin(sessionData.user_id);
  } catch (err) {
    console.error('Error getting admin from session:', err);
    return null;
  }
}

/**
 * Create admin session
 */
export async function createAdminSession(admin: AdminUser): Promise<void> {
  try {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + SESSION_TIMEOUT_MINUTES);

    const sessionData = {
      user_id: admin.user_id,
      admin_id: admin.id,
      role: admin.role,
      expires_at: expiresAt.toISOString(),
    };

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_SESSION_KEY, JSON.stringify(sessionData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/admin',
    });

    // Update last login
    const supabase = getSupabaseServiceClient();
    await supabase
      .from('admin_users')
      .update({ last_login_at: new Date().toISOString() })
      .eq('id', admin.id);

    // Log auth event
    await logAuthEvent(admin, AUDIT_ACTIONS.ADMIN_LOGIN);
  } catch (err) {
    console.error('Error creating admin session:', err);
    throw err;
  }
}

/**
 * Destroy admin session
 */
export async function destroyAdminSession(admin?: AdminUser): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(ADMIN_SESSION_KEY);

    if (admin) {
      await logAuthEvent(admin, AUDIT_ACTIONS.ADMIN_LOGOUT);
    }
  } catch (err) {
    console.error('Error destroying admin session:', err);
  }
}

/**
 * Refresh admin session (extend expiry)
 */
export async function refreshAdminSession(admin: AdminUser): Promise<void> {
  await createAdminSession(admin);
}

/**
 * Check if user email is in allowed admin domains
 */
export function isAllowedAdminEmail(email: string): boolean {
  const allowedDomains = [
    'bolehmakan.my',
    'boleh-makan.com',
    // Add your admin email domains here
  ];

  const domain = email.split('@')[1]?.toLowerCase();
  return allowedDomains.includes(domain);
}

/**
 * Create a new admin user
 */
export async function createAdminUser(
  creatorAdmin: AdminUser,
  userData: {
    user_id: string;
    email: string;
    display_name: string;
    role: 'admin' | 'support' | 'viewer';
  }
): Promise<AdminUser | null> {
  try {
    // Only super_admin can create admins
    if (creatorAdmin.role !== 'super_admin') {
      throw new Error('Only super admins can create admin users');
    }

    const supabase = getSupabaseServiceClient();

    const { data, error } = await supabase
      .from('admin_users')
      .insert({
        user_id: userData.user_id,
        email: userData.email,
        display_name: userData.display_name,
        role: userData.role,
        created_by: creatorAdmin.user_id,
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    // Log the action
    await logAuthEvent(creatorAdmin, AUDIT_ACTIONS.ADMIN_CREATED);

    return data as AdminUser;
  } catch (err) {
    console.error('Error creating admin user:', err);
    return null;
  }
}

/**
 * Update admin user
 */
export async function updateAdminUser(
  updaterAdmin: AdminUser,
  adminId: string,
  updates: Partial<{
    role: string;
    permissions: any;
    is_active: boolean;
    display_name: string;
  }>
): Promise<boolean> {
  try {
    // Only super_admin can modify admin users
    if (updaterAdmin.role !== 'super_admin') {
      throw new Error('Only super admins can modify admin users');
    }

    const supabase = getSupabaseServiceClient();

    const { error } = await supabase
      .from('admin_users')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', adminId);

    if (error) {
      throw error;
    }

    await logAuthEvent(updaterAdmin, AUDIT_ACTIONS.ADMIN_UPDATED);
    return true;
  } catch (err) {
    console.error('Error updating admin user:', err);
    return false;
  }
}

/**
 * Get all admin users
 */
export async function getAdminUsers(): Promise<AdminUser[]> {
  try {
    const supabase = getSupabaseServiceClient();

    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return (data || []) as AdminUser[];
  } catch (err) {
    console.error('Error fetching admin users:', err);
    return [];
  }
}

