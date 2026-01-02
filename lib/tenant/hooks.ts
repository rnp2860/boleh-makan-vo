// lib/tenant/hooks.ts
// 🏢 Tenant Hooks - Additional utility hooks for tenant functionality

import { useCallback, useMemo } from 'react';
import { useTenant, useTenantOptional } from './context';
import {
  Tenant,
  TenantFeatures,
  TenantBranding,
  TenantAdminRole,
  TenantAdminPermissions,
  TENANT_ADMIN_PERMISSIONS,
} from '@/lib/types/tenant';

// ============================================
// FEATURE HOOKS
// ============================================

/**
 * Check if AI features are available for the current tenant
 */
export function useAIEnabled(): boolean {
  const tenant = useTenantOptional();
  return tenant?.features.ai_enabled ?? true;
}

/**
 * Check if Ramadan mode is available for the current tenant
 */
export function useRamadanModeEnabled(): boolean {
  const tenant = useTenantOptional();
  return tenant?.features.ramadan_mode ?? true;
}

/**
 * Check if CGM integration is available
 */
export function useCGMEnabled(): boolean {
  const tenant = useTenantOptional();
  return tenant?.features.cgm_integration ?? false;
}

/**
 * Check if data export is allowed
 */
export function useExportEnabled(): boolean {
  const tenant = useTenantOptional();
  return tenant?.features.export_enabled ?? true;
}

/**
 * Check if voice logging is enabled
 */
export function useVoiceLoggingEnabled(): boolean {
  const tenant = useTenantOptional();
  return tenant?.features.voice_logging ?? true;
}

/**
 * Check if custom foods are allowed
 */
export function useCustomFoodsEnabled(): boolean {
  const tenant = useTenantOptional();
  return tenant?.features.custom_foods ?? true;
}

// ============================================
// BRANDING HOOKS
// ============================================

/**
 * Get CSS custom properties for tenant branding
 */
export function useTenantCSSVariables(): Record<string, string> {
  const tenant = useTenantOptional();
  
  return useMemo(() => {
    if (!tenant) {
      return {};
    }

    const { branding } = tenant;
    
    return {
      '--tenant-primary': branding.primary_color,
      '--tenant-secondary': branding.secondary_color,
      '--tenant-accent': branding.accent_color,
      '--tenant-background': branding.background_color,
      '--tenant-text': branding.text_color,
    };
  }, [tenant]);
}

/**
 * Get tenant logo URL (with dark mode support)
 */
export function useTenantLogo(isDarkMode: boolean = false): string | null {
  const tenant = useTenantOptional();
  
  if (!tenant) return null;
  
  if (isDarkMode && tenant.branding.logo_dark_url) {
    return tenant.branding.logo_dark_url;
  }
  
  return tenant.branding.logo_url;
}

/**
 * Get tenant favicon URL
 */
export function useTenantFavicon(): string | null {
  const tenant = useTenantOptional();
  return tenant?.branding.favicon_url ?? null;
}

// ============================================
// LIMIT HOOKS
// ============================================

/**
 * Get remaining AI queries for today
 */
export function useRemainingAIQueries(usedToday: number): number {
  const tenant = useTenantOptional();
  const limit = tenant?.limits.ai_queries_per_day ?? 50;
  return Math.max(0, limit - usedToday);
}

/**
 * Check if user limit is reached
 */
export function useUserLimitReached(currentUsers: number): boolean {
  const tenant = useTenantOptional();
  const maxUsers = tenant?.limits.max_users;
  
  if (maxUsers === null || maxUsers === undefined) {
    return false; // Unlimited
  }
  
  return currentUsers >= maxUsers;
}

// ============================================
// NAVIGATION HOOKS
// ============================================

/**
 * Get tenant-aware URL
 */
export function useTenantUrl(): (path: string) => string {
  const tenant = useTenantOptional();
  
  return useCallback((path: string) => {
    if (!tenant || tenant.isDefault) {
      return path;
    }
    
    // If tenant uses custom domain or subdomain, no path prefix needed
    if (tenant.resolutionMethod === 'custom_domain' || 
        tenant.resolutionMethod === 'subdomain') {
      return path;
    }
    
    // Add tenant path prefix for path-based resolution
    const cleanPath = path.startsWith('/') ? path : `/${path}`;
    return `/t/${tenant.tenantSlug}${cleanPath}`;
  }, [tenant]);
}

/**
 * Get API endpoint with tenant context
 */
export function useTenantApiUrl(): (endpoint: string) => string {
  const tenant = useTenantOptional();
  
  return useCallback((endpoint: string) => {
    const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    
    if (!tenant) {
      return `/api${cleanEndpoint}`;
    }
    
    // For tenant-scoped API, use /api/t/[tenantSlug]/...
    if (!tenant.isDefault) {
      return `/api/t/${tenant.tenantSlug}${cleanEndpoint}`;
    }
    
    return `/api${cleanEndpoint}`;
  }, [tenant]);
}

// ============================================
// ADMIN HOOKS
// ============================================

/**
 * Get tenant admin permissions based on role
 */
export function useTenantAdminPermissions(
  role: TenantAdminRole | null
): TenantAdminPermissions | null {
  return useMemo(() => {
    if (!role) return null;
    return TENANT_ADMIN_PERMISSIONS[role];
  }, [role]);
}

/**
 * Check if user has specific tenant admin permission
 */
export function useTenantAdminPermission(
  role: TenantAdminRole | null,
  permission: keyof TenantAdminPermissions
): boolean {
  const permissions = useTenantAdminPermissions(role);
  return permissions?.[permission] ?? false;
}

// ============================================
// LOCALIZATION HOOKS
// ============================================

/**
 * Get tenant's supported languages
 */
export function useTenantLanguages(): string[] {
  const tenant = useTenantOptional();
  return tenant?.tenant.supported_languages ?? ['en', 'ms'];
}

/**
 * Get tenant's default language
 */
export function useTenantDefaultLanguage(): string {
  const tenant = useTenantOptional();
  return tenant?.tenant.default_language ?? 'en';
}

/**
 * Get tenant's timezone
 */
export function useTenantTimezone(): string {
  const tenant = useTenantOptional();
  return tenant?.tenant.timezone ?? 'Asia/Kuala_Lumpur';
}

// ============================================
// UTILITY HOOKS
// ============================================

/**
 * Check if current tenant is the default/public tenant
 */
export function useIsDefaultTenant(): boolean {
  const tenant = useTenantOptional();
  return tenant?.isDefault ?? true;
}

/**
 * Get tenant type for conditional rendering
 */
export function useTenantType(): string {
  const tenant = useTenantOptional();
  return tenant?.tenant.type ?? 'public';
}

/**
 * Get tenant plan for feature gating
 */
export function useTenantPlan(): string {
  const tenant = useTenantOptional();
  return tenant?.tenant.plan ?? 'trial';
}

/**
 * Check if tenant is on trial
 */
export function useIsTenantTrial(): boolean {
  const tenant = useTenantOptional();
  return tenant?.tenant.plan === 'trial';
}

/**
 * Check if tenant trial is ending soon (within 7 days)
 */
export function useTenantTrialEndingSoon(): boolean {
  const tenant = useTenantOptional();
  
  if (!tenant || tenant.tenant.plan !== 'trial' || !tenant.tenant.trial_ends_at) {
    return false;
  }
  
  const trialEnd = new Date(tenant.tenant.trial_ends_at);
  const now = new Date();
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return daysRemaining > 0 && daysRemaining <= 7;
}

/**
 * Get remaining trial days
 */
export function useTenantTrialDaysRemaining(): number | null {
  const tenant = useTenantOptional();
  
  if (!tenant || tenant.tenant.plan !== 'trial' || !tenant.tenant.trial_ends_at) {
    return null;
  }
  
  const trialEnd = new Date(tenant.tenant.trial_ends_at);
  const now = new Date();
  const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  
  return Math.max(0, daysRemaining);
}


