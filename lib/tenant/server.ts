// lib/tenant/server.ts
// 🏢 Tenant Server Utilities - Server-only functions using next/headers
// ⚠️ ONLY import this file in Server Components or API routes

import { DEFAULT_TENANT_ID } from '@/lib/types/tenant';
import { headers } from 'next/headers';

// ============================================
// GET TENANT ID FROM HEADERS (Server Only)
// ============================================

/**
 * Get tenant ID from request headers (set by middleware)
 * Falls back to default tenant if not found
 * 
 * ⚠️ This function uses next/headers and can ONLY be used in:
 * - Server Components
 * - API Routes
 * - Middleware
 */
export async function getTenantIdFromHeaders(): Promise<string> {
  const headersList = await headers();
  const tenantId = headersList.get('x-tenant-id');
  
  if (!tenantId) {
    return DEFAULT_TENANT_ID;
  }
  
  return tenantId;
}

/**
 * Get tenant context from request headers
 * 
 * ⚠️ This function uses next/headers and can ONLY be used in:
 * - Server Components
 * - API Routes
 * - Middleware
 */
export async function getTenantContextFromHeaders() {
  const headersList = await headers();
  
  return {
    tenantId: headersList.get('x-tenant-id') || DEFAULT_TENANT_ID,
    tenantSlug: headersList.get('x-tenant-slug') || null,
    resolutionMethod: headersList.get('x-tenant-resolution') || 'default',
    isDefault: !headersList.get('x-tenant-slug'),
  };
}


