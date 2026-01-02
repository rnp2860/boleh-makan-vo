// lib/white-label/domain-resolver.ts
// 🏷️ Domain Resolver - Custom domain to tenant mapping

import { getSupabaseServiceClient } from '@/lib/supabase';
import { DomainResolutionResult } from './types';
import { DEFAULT_TENANT_ID, DEFAULT_TENANT_SLUG } from './constants';

// ============================================
// DOMAIN RESOLUTION
// ============================================

/**
 * Resolve tenant from hostname
 * Priority: custom domains table → tenants.custom_domains array → subdomain pattern → default
 */
export async function resolveTenantFromDomain(
  hostname: string
): Promise<DomainResolutionResult | null> {
  // Normalize hostname
  const domain = hostname.toLowerCase().replace(/^www\./, '');
  
  // Check cache first
  const cached = await getCachedResolution(domain);
  if (cached) {
    return cached;
  }
  
  const supabase = getSupabaseServiceClient();
  
  // 1. Check custom domains table
  const { data: customDomainResult } = await supabase
    .from('tenant_custom_domains')
    .select(`
      tenant_id,
      domain,
      tenants!inner(id, slug, name)
    `)
    .eq('domain', domain)
    .eq('is_active', true)
    .eq('is_verified', true)
    .single();
  
  if (customDomainResult) {
    const result: DomainResolutionResult = {
      tenantId: customDomainResult.tenant_id,
      tenantSlug: (customDomainResult.tenants as any).slug,
      tenantName: (customDomainResult.tenants as any).name,
      isCustomDomain: true,
      isSubdomain: false,
    };
    
    await cacheResolution(domain, result);
    return result;
  }
  
  // 2. Check tenants.custom_domains array
  const { data: tenantArrayResult } = await supabase
    .from('tenants')
    .select('id, slug, name')
    .contains('custom_domains', [domain])
    .eq('is_active', true)
    .single();
  
  if (tenantArrayResult) {
    const result: DomainResolutionResult = {
      tenantId: tenantArrayResult.id,
      tenantSlug: tenantArrayResult.slug,
      tenantName: tenantArrayResult.name,
      isCustomDomain: true,
      isSubdomain: false,
    };
    
    await cacheResolution(domain, result);
    return result;
  }
  
  // 3. Check subdomain pattern (xxx.bolehmakan.my)
  const subdomainMatch = domain.match(/^([a-z0-9-]+)\.bolehmakan\.my$/);
  if (subdomainMatch) {
    const slug = subdomainMatch[1];
    
    const { data: subdomainResult } = await supabase
      .from('tenants')
      .select('id, slug, name')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (subdomainResult) {
      const result: DomainResolutionResult = {
        tenantId: subdomainResult.id,
        tenantSlug: subdomainResult.slug,
        tenantName: subdomainResult.name,
        isCustomDomain: false,
        isSubdomain: true,
      };
      
      await cacheResolution(domain, result);
      return result;
    }
  }
  
  // 4. Default tenant (bolehmakan.my, localhost, etc.)
  return {
    tenantId: DEFAULT_TENANT_ID,
    tenantSlug: DEFAULT_TENANT_SLUG,
    tenantName: 'Boleh Makan',
    isCustomDomain: false,
    isSubdomain: false,
  };
}

// ============================================
// CACHING
// ============================================

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
const memoryCache = new Map<string, { result: DomainResolutionResult; expiresAt: number }>();

/**
 * Get cached resolution
 */
async function getCachedResolution(domain: string): Promise<DomainResolutionResult | null> {
  // Check memory cache first
  const cached = memoryCache.get(domain);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.result;
  }
  
  // Check database cache
  try {
    const supabase = getSupabaseServiceClient();
    const { data } = await supabase
      .from('domain_tenant_cache')
      .select('tenant_id, tenant_slug')
      .eq('domain', domain)
      .gt('expires_at', new Date().toISOString())
      .single();
    
    if (data) {
      // We don't have all fields in cache, so return partial for now
      return null;
    }
  } catch {
    // Cache miss
  }
  
  return null;
}

/**
 * Cache resolution result
 */
async function cacheResolution(domain: string, result: DomainResolutionResult): Promise<void> {
  // Memory cache
  memoryCache.set(domain, {
    result,
    expiresAt: Date.now() + CACHE_TTL_MS,
  });
  
  // Database cache (fire and forget)
  try {
    const supabase = getSupabaseServiceClient();
    await supabase
      .from('domain_tenant_cache')
      .upsert({
        domain,
        tenant_id: result.tenantId,
        tenant_slug: result.tenantSlug,
        cached_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + CACHE_TTL_MS).toISOString(),
      }, {
        onConflict: 'domain',
      });
  } catch {
    // Ignore cache write errors
  }
}

/**
 * Invalidate cache for a domain
 */
export async function invalidateDomainCache(domain: string): Promise<void> {
  memoryCache.delete(domain);
  
  try {
    const supabase = getSupabaseServiceClient();
    await supabase
      .from('domain_tenant_cache')
      .delete()
      .eq('domain', domain);
  } catch {
    // Ignore
  }
}

/**
 * Invalidate all caches for a tenant
 */
export async function invalidateTenantDomainCache(tenantId: string): Promise<void> {
  // Clear memory cache entries for this tenant
  for (const [domain, cached] of memoryCache.entries()) {
    if (cached.result.tenantId === tenantId) {
      memoryCache.delete(domain);
    }
  }
  
  // Clear database cache
  try {
    const supabase = getSupabaseServiceClient();
    await supabase
      .from('domain_tenant_cache')
      .delete()
      .eq('tenant_id', tenantId);
  } catch {
    // Ignore
  }
}

// ============================================
// DOMAIN UTILITIES
// ============================================

/**
 * Check if a domain is allowed for a tenant
 */
export function isDomainAllowed(domain: string, allowedDomains: string[]): boolean {
  if (allowedDomains.length === 0) return true;
  
  const normalizedDomain = domain.toLowerCase();
  
  for (const allowed of allowedDomains) {
    // Exact match
    if (normalizedDomain === allowed.toLowerCase()) return true;
    
    // Wildcard match (*.example.com)
    if (allowed.startsWith('*.')) {
      const suffix = allowed.slice(1).toLowerCase();
      if (normalizedDomain.endsWith(suffix)) return true;
    }
  }
  
  return false;
}

/**
 * Extract email domain
 */
export function extractEmailDomain(email: string): string | null {
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : null;
}

/**
 * Generate DNS verification record
 */
export function generateVerificationRecord(tenantSlug: string): string {
  const token = generateRandomToken(32);
  return `boleh-makan-verify=${tenantSlug}-${token}`;
}

/**
 * Generate random token
 */
function generateRandomToken(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Build tenant URL
 */
export function buildTenantUrl(
  tenantSlug: string,
  customDomain?: string,
  path: string = '/'
): string {
  if (customDomain) {
    return `https://${customDomain}${path}`;
  }
  
  // Use subdomain pattern
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://bolehmakan.my';
  
  if (tenantSlug === DEFAULT_TENANT_SLUG) {
    return `${baseUrl}${path}`;
  }
  
  // Replace base domain with subdomain
  const url = new URL(baseUrl);
  return `https://${tenantSlug}.${url.host}${path}`;
}


