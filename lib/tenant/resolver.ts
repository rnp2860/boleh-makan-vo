// lib/tenant/resolver.ts
// 🏢 Tenant Resolution - Domain, Subdomain, Path, and Invite Code Resolution

import { getSupabaseServiceClient } from '@/lib/supabase';
import {
  Tenant,
  TenantResolutionResult,
  TenantResolutionMethod,
  DEFAULT_TENANT_ID,
  DEFAULT_TENANT_SLUG,
} from '@/lib/types/tenant';

// ============================================
// TENANT RESOLUTION
// ============================================

/**
 * Resolve tenant from various sources in priority order:
 * 1. Custom domain (wellness.ijm.com)
 * 2. Subdomain (ijm.bolehmakan.my)
 * 3. Path prefix (/t/ijm)
 * 4. User's stored tenant_id
 * 5. Default public tenant
 */
export async function resolveTenant(
  hostname: string,
  pathname: string,
  userId?: string
): Promise<TenantResolutionResult> {
  try {
    // 1. Try custom domain first
    const customDomainResult = await resolveTenantByCustomDomain(hostname);
    if (customDomainResult.isResolved) {
      return customDomainResult;
    }

    // 2. Try subdomain
    const subdomainResult = await resolveTenantBySubdomain(hostname);
    if (subdomainResult.isResolved) {
      return subdomainResult;
    }

    // 3. Try path prefix
    const pathResult = await resolveTenantByPath(pathname);
    if (pathResult.isResolved) {
      return pathResult;
    }

    // 4. Try user's stored tenant (if authenticated)
    if (userId) {
      const userTenantResult = await resolveTenantByUser(userId);
      if (userTenantResult.isResolved) {
        return userTenantResult;
      }
    }

    // 5. Return default tenant
    return await getDefaultTenant();
  } catch (error) {
    console.error('Tenant resolution error:', error);
    // Fallback to default tenant on any error
    return await getDefaultTenant();
  }
}

/**
 * Resolve tenant by custom domain
 * e.g., wellness.ijm.com
 */
export async function resolveTenantByCustomDomain(
  hostname: string
): Promise<TenantResolutionResult> {
  // Skip if it's the main domain or localhost
  if (isMainDomain(hostname) || isLocalhost(hostname)) {
    return { tenant: null, method: 'custom_domain', isResolved: false };
  }

  const supabase = getSupabaseServiceClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('custom_domain', hostname)
    .eq('status', 'active')
    .single();

  if (error || !tenant) {
    return { tenant: null, method: 'custom_domain', isResolved: false };
  }

  return {
    tenant: tenant as Tenant,
    method: 'custom_domain',
    isResolved: true,
  };
}

/**
 * Resolve tenant by subdomain
 * e.g., ijm.bolehmakan.my → tenant 'ijm'
 */
export async function resolveTenantBySubdomain(
  hostname: string
): Promise<TenantResolutionResult> {
  const subdomain = extractSubdomain(hostname);
  
  if (!subdomain) {
    return { tenant: null, method: 'subdomain', isResolved: false };
  }

  // Skip reserved subdomains
  const reservedSubdomains = ['www', 'app', 'api', 'admin', 'staging', 'dev'];
  if (reservedSubdomains.includes(subdomain.toLowerCase())) {
    return { tenant: null, method: 'subdomain', isResolved: false };
  }

  const supabase = getSupabaseServiceClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('subdomain', subdomain.toLowerCase())
    .eq('status', 'active')
    .single();

  if (error || !tenant) {
    return { tenant: null, method: 'subdomain', isResolved: false };
  }

  return {
    tenant: tenant as Tenant,
    method: 'subdomain',
    isResolved: true,
  };
}

/**
 * Resolve tenant by path prefix
 * e.g., /t/ijm/dashboard → tenant 'ijm'
 */
export async function resolveTenantByPath(
  pathname: string
): Promise<TenantResolutionResult> {
  const tenantSlug = extractTenantFromPath(pathname);
  
  if (!tenantSlug) {
    return { tenant: null, method: 'path_prefix', isResolved: false };
  }

  const supabase = getSupabaseServiceClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', tenantSlug.toLowerCase())
    .eq('status', 'active')
    .single();

  if (error || !tenant) {
    return { tenant: null, method: 'path_prefix', isResolved: false };
  }

  return {
    tenant: tenant as Tenant,
    method: 'path_prefix',
    isResolved: true,
  };
}

/**
 * Resolve tenant from invite code
 */
export async function resolveTenantByInviteCode(
  inviteCode: string
): Promise<TenantResolutionResult> {
  const supabase = getSupabaseServiceClient();
  
  const { data: inviteData, error: inviteError } = await supabase
    .from('tenant_invite_codes')
    .select(`
      tenant_id,
      tenants (*)
    `)
    .eq('code', inviteCode.toUpperCase())
    .eq('is_active', true)
    .single();

  if (inviteError || !inviteData || !inviteData.tenants) {
    return { 
      tenant: null, 
      method: 'invite_code', 
      isResolved: false,
      error: 'Invalid or expired invite code',
    };
  }

  // Check if code is expired
  const codeData = inviteData as any;
  if (codeData.expires_at && new Date(codeData.expires_at) < new Date()) {
    return {
      tenant: null,
      method: 'invite_code',
      isResolved: false,
      error: 'Invite code has expired',
    };
  }

  // Check usage limits
  if (codeData.max_uses && codeData.current_uses >= codeData.max_uses) {
    return {
      tenant: null,
      method: 'invite_code',
      isResolved: false,
      error: 'Invite code has reached maximum uses',
    };
  }

  return {
    tenant: codeData.tenants as Tenant,
    method: 'invite_code',
    isResolved: true,
  };
}

/**
 * Resolve tenant from user's stored tenant_id
 */
export async function resolveTenantByUser(
  userId: string
): Promise<TenantResolutionResult> {
  const supabase = getSupabaseServiceClient();
  
  // This would query the user's profile/settings table to get their tenant_id
  // For now, we assume users table has tenant_id column
  const { data: userData, error: userError } = await supabase
    .from('user_weekly_goals')
    .select('tenant_id')
    .eq('user_id', userId)
    .limit(1)
    .single();

  if (userError || !userData?.tenant_id) {
    return { tenant: null, method: 'user_stored', isResolved: false };
  }

  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', userData.tenant_id)
    .eq('status', 'active')
    .single();

  if (error || !tenant) {
    return { tenant: null, method: 'user_stored', isResolved: false };
  }

  return {
    tenant: tenant as Tenant,
    method: 'user_stored',
    isResolved: true,
  };
}

/**
 * Get default public tenant
 */
export async function getDefaultTenant(): Promise<TenantResolutionResult> {
  const supabase = getSupabaseServiceClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', DEFAULT_TENANT_ID)
    .single();

  if (error || !tenant) {
    // If default tenant doesn't exist, create a minimal fallback
    console.error('Default tenant not found:', error);
    return {
      tenant: createFallbackTenant(),
      method: 'default',
      isResolved: true,
    };
  }

  return {
    tenant: tenant as Tenant,
    method: 'default',
    isResolved: true,
  };
}

/**
 * Get tenant by ID
 */
export async function getTenantById(tenantId: string): Promise<Tenant | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('id', tenantId)
    .single();

  if (error || !tenant) {
    return null;
  }

  return tenant as Tenant;
}

/**
 * Get tenant by slug
 */
export async function getTenantBySlug(slug: string): Promise<Tenant | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data: tenant, error } = await supabase
    .from('tenants')
    .select('*')
    .eq('slug', slug.toLowerCase())
    .single();

  if (error || !tenant) {
    return null;
  }

  return tenant as Tenant;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Check if hostname is the main domain
 */
function isMainDomain(hostname: string): boolean {
  const mainDomains = [
    'bolehmakan.my',
    'www.bolehmakan.my',
    'app.bolehmakan.my',
  ];
  return mainDomains.includes(hostname.toLowerCase());
}

/**
 * Check if hostname is localhost
 */
function isLocalhost(hostname: string): boolean {
  return (
    hostname === 'localhost' ||
    hostname.startsWith('localhost:') ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('127.0.0.1:')
  );
}

/**
 * Extract subdomain from hostname
 * e.g., ijm.bolehmakan.my → 'ijm'
 */
function extractSubdomain(hostname: string): string | null {
  // Handle localhost
  if (isLocalhost(hostname)) {
    return null;
  }

  const parts = hostname.toLowerCase().split('.');
  
  // Need at least 3 parts for a subdomain (sub.domain.tld)
  if (parts.length < 3) {
    return null;
  }

  // Check for Malaysian domain pattern (e.g., subdomain.bolehmakan.my)
  if (parts.length === 3 && parts[2] === 'my') {
    return parts[0];
  }

  // Generic pattern (e.g., subdomain.domain.com)
  if (parts.length === 3) {
    return parts[0];
  }

  // Longer patterns (e.g., subdomain.domain.co.uk)
  if (parts.length >= 4) {
    return parts[0];
  }

  return null;
}

/**
 * Extract tenant slug from path prefix
 * e.g., /t/ijm/dashboard → 'ijm'
 */
function extractTenantFromPath(pathname: string): string | null {
  const match = pathname.match(/^\/t\/([a-zA-Z0-9-]+)/);
  return match ? match[1] : null;
}

/**
 * Create a minimal fallback tenant if database is unavailable
 */
function createFallbackTenant(): Tenant {
  return {
    id: DEFAULT_TENANT_ID,
    slug: DEFAULT_TENANT_SLUG,
    name: 'Boleh Makan',
    type: 'public',
    status: 'active',
    logo_url: null,
    logo_dark_url: null,
    favicon_url: null,
    primary_color: '#10B981',
    secondary_color: '#059669',
    accent_color: '#F59E0B',
    background_color: '#FFFFFF',
    text_color: '#1F2937',
    custom_css: null,
    custom_domain: null,
    subdomain: null,
    settings: {
      features: {
        ai_enabled: true,
        ramadan_mode: true,
        cgm_integration: false,
        export_enabled: true,
        voice_logging: true,
        custom_foods: true,
        reports: true,
        vitals_tracking: true,
      },
      limits: {
        max_users: null,
        ai_queries_per_day: 50,
        storage_gb: 10,
        data_retention_days: 365,
      },
      onboarding: {
        required_fields: ['age', 'diabetes_type'],
        skip_allowed: true,
        custom_welcome_message: null,
      },
      notifications: {
        email_enabled: true,
        push_enabled: true,
        sms_enabled: false,
      },
      privacy: {
        anonymized_analytics: false,
        data_sharing_allowed: true,
      },
    },
    default_language: 'en',
    supported_languages: ['en', 'ms'],
    timezone: 'Asia/Kuala_Lumpur',
    contact_email: null,
    contact_phone: null,
    support_email: null,
    billing_email: null,
    billing_address: {},
    plan: 'professional',
    trial_ends_at: null,
    subscription_started_at: null,
    subscription_ends_at: null,
    user_count: 0,
    monthly_ai_queries: 0,
    storage_used_mb: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

// ============================================
// PATH UTILITIES
// ============================================

/**
 * Strip tenant prefix from path
 * e.g., /t/ijm/dashboard → /dashboard
 */
export function stripTenantFromPath(pathname: string): string {
  return pathname.replace(/^\/t\/[a-zA-Z0-9-]+/, '') || '/';
}

/**
 * Add tenant prefix to path
 * e.g., /dashboard + 'ijm' → /t/ijm/dashboard
 */
export function addTenantToPath(pathname: string, tenantSlug: string): string {
  const cleanPath = pathname.startsWith('/') ? pathname : `/${pathname}`;
  return `/t/${tenantSlug}${cleanPath}`;
}

/**
 * Check if path needs tenant prefix
 */
export function pathNeedsTenantPrefix(pathname: string): boolean {
  // Exclude static files, API routes, and admin routes
  const excludedPaths = [
    '/_next',
    '/api',
    '/admin',
    '/favicon',
    '/robots',
    '/sitemap',
    '/manifest',
  ];
  
  return !excludedPaths.some(prefix => pathname.startsWith(prefix));
}


