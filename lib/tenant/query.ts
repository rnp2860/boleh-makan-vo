// lib/tenant/query.ts
// 🏢 Tenant Query Helpers - Utilities for tenant-scoped database queries
// 
// NOTE: For server-only functions that use next/headers, see ./server.ts

import { getSupabaseServiceClient } from '@/lib/supabase';
import { DEFAULT_TENANT_ID } from '@/lib/types/tenant';

// ============================================
// QUERY BUILDERS
// ============================================

/**
 * Creates a Supabase query with tenant filter already applied
 * Use this for all tenant-scoped data access
 */
export function createTenantQuery<T = any>(
  table: string,
  tenantId: string = DEFAULT_TENANT_ID
) {
  const supabase = getSupabaseServiceClient();
  
  return {
    /**
     * Select with tenant filter
     */
    select: (columns = '*') => {
      return supabase
        .from(table)
        .select(columns)
        .eq('tenant_id', tenantId);
    },
    
    /**
     * Insert with tenant ID
     */
    insert: (data: Partial<T> | Partial<T>[]) => {
      const records = Array.isArray(data) ? data : [data];
      const recordsWithTenant = records.map(record => ({
        ...record,
        tenant_id: tenantId,
      }));
      
      return supabase.from(table).insert(recordsWithTenant);
    },
    
    /**
     * Update with tenant filter
     */
    update: (data: Partial<T>) => {
      return supabase
        .from(table)
        .update(data)
        .eq('tenant_id', tenantId);
    },
    
    /**
     * Delete with tenant filter
     */
    delete: () => {
      return supabase
        .from(table)
        .delete()
        .eq('tenant_id', tenantId);
    },
    
    /**
     * Upsert with tenant ID
     */
    upsert: (data: Partial<T> | Partial<T>[], options?: { onConflict?: string }) => {
      const records = Array.isArray(data) ? data : [data];
      const recordsWithTenant = records.map(record => ({
        ...record,
        tenant_id: tenantId,
      }));
      
      return supabase.from(table).upsert(recordsWithTenant, options);
    },
  };
}

// ============================================
// CONVENIENCE FUNCTIONS
// ============================================

/**
 * Fetch user weekly goals for a tenant
 */
export async function getUserGoals(userId: string, tenantId: string = DEFAULT_TENANT_ID) {
  const query = createTenantQuery('user_weekly_goals', tenantId);
  
  const { data, error } = await query
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false })
    .limit(1)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching user goals:', error);
  }
  
  return data;
}

/**
 * Fetch ramadan settings for a user in a tenant
 */
export async function getRamadanSettings(userId: string, year: number, tenantId: string = DEFAULT_TENANT_ID) {
  const query = createTenantQuery('ramadan_settings', tenantId);
  
  const { data, error } = await query
    .select('*')
    .eq('user_id', userId)
    .eq('year', year)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Error fetching ramadan settings:', error);
  }
  
  return data;
}

/**
 * Fetch tenant-specific foods
 */
export async function getTenantFoods(tenantId: string, search?: string) {
  const supabase = getSupabaseServiceClient();
  
  let query = supabase
    .from('tenant_foods')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('is_approved', true)
    .order('name');
  
  if (search) {
    query = query.or(`name.ilike.%${search}%,name_ms.ilike.%${search}%`);
  }
  
  const { data, error } = await query;
  
  if (error) {
    console.error('Error fetching tenant foods:', error);
    return [];
  }
  
  return data;
}

/**
 * Log an action with tenant context
 */
export async function logTenantAction(
  action: string,
  tenantId: string,
  userId: string,
  details?: Record<string, any>
) {
  const supabase = getSupabaseServiceClient();
  
  await supabase.from('admin_audit_log').insert({
    action,
    tenant_id: tenantId,
    target_type: 'tenant',
    target_id: tenantId,
    metadata: {
      user_id: userId,
      ...details,
    },
    created_at: new Date().toISOString(),
  });
}

// ============================================
// TENANT VALIDATION
// ============================================

/**
 * Check if a user belongs to a specific tenant
 */
export async function validateUserTenant(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('user_weekly_goals')
    .select('tenant_id')
    .eq('user_id', userId)
    .limit(1)
    .single();
  
  if (error || !data) {
    return false;
  }
  
  return data.tenant_id === tenantId;
}

/**
 * Check if a user is a tenant admin
 */
export async function isTenantAdmin(
  userId: string,
  tenantId: string
): Promise<boolean> {
  const supabase = getSupabaseServiceClient();
  
  const { data } = await supabase
    .from('tenant_admins')
    .select('id')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .single();
  
  return !!data;
}

/**
 * Get user's tenant admin role
 */
export async function getTenantAdminRole(
  userId: string,
  tenantId: string
): Promise<string | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('tenant_admins')
    .select('role')
    .eq('user_id', userId)
    .eq('tenant_id', tenantId)
    .eq('is_active', true)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return data.role;
}

// ============================================
// TENANT LIMITS
// ============================================

/**
 * Check if tenant has reached user limit
 */
export async function checkTenantUserLimit(tenantId: string): Promise<{
  allowed: boolean;
  currentUsers: number;
  maxUsers: number | null;
}> {
  const supabase = getSupabaseServiceClient();
  
  // Get tenant settings
  const { data: tenant } = await supabase
    .from('tenants')
    .select('user_count, settings')
    .eq('id', tenantId)
    .single();
  
  if (!tenant) {
    return { allowed: false, currentUsers: 0, maxUsers: null };
  }
  
  const maxUsers = tenant.settings?.limits?.max_users;
  
  if (maxUsers === null || maxUsers === undefined) {
    return { allowed: true, currentUsers: tenant.user_count, maxUsers: null };
  }
  
  return {
    allowed: tenant.user_count < maxUsers,
    currentUsers: tenant.user_count,
    maxUsers,
  };
}

/**
 * Increment tenant user count
 */
export async function incrementTenantUserCount(tenantId: string) {
  const supabase = getSupabaseServiceClient();
  
  await supabase.rpc('increment_tenant_user_count', { tenant_uuid: tenantId });
}

/**
 * Decrement tenant user count
 */
export async function decrementTenantUserCount(tenantId: string) {
  const supabase = getSupabaseServiceClient();
  
  await supabase.rpc('decrement_tenant_user_count', { tenant_uuid: tenantId });
}


