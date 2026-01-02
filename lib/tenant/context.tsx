'use client';

// lib/tenant/context.tsx
// 🏢 Tenant Context Provider - React Context for tenant data

import React, { createContext, useContext, useMemo, ReactNode } from 'react';
import {
  Tenant,
  TenantContext as TenantContextType,
  TenantFeatures,
  TenantBranding,
  TenantLimits,
  TenantResolutionMethod,
  DEFAULT_FEATURES,
  DEFAULT_BRANDING,
  DEFAULT_LIMITS,
  DEFAULT_TENANT_ID,
} from '@/lib/types/tenant';

// ============================================
// CONTEXT TYPES
// ============================================

interface TenantProviderProps {
  tenant: Tenant;
  method: TenantResolutionMethod;
  children: ReactNode;
}

interface TenantContextValue {
  // Core tenant data
  tenant: Tenant;
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  
  // Resolution info
  resolutionMethod: TenantResolutionMethod;
  isCustomDomain: boolean;
  isSubdomain: boolean;
  isPathBased: boolean;
  isDefault: boolean;
  
  // Extracted settings
  features: TenantFeatures;
  branding: TenantBranding;
  limits: TenantLimits;
  
  // Helper functions
  hasFeature: (feature: keyof TenantFeatures) => boolean;
  isWithinLimit: (limit: keyof TenantLimits, currentValue: number) => boolean;
  getFeature: <K extends keyof TenantFeatures>(feature: K) => TenantFeatures[K];
}

// ============================================
// CONTEXT
// ============================================

const TenantContext = createContext<TenantContextValue | null>(null);

// ============================================
// PROVIDER COMPONENT
// ============================================

export function TenantProvider({
  tenant,
  method,
  children,
}: TenantProviderProps) {
  const value = useMemo<TenantContextValue>(() => {
    // Extract features with fallback
    const features: TenantFeatures = {
      ...DEFAULT_FEATURES,
      ...(tenant.settings?.features || {}),
    };

    // Extract branding with fallback
    const branding: TenantBranding = {
      logo_url: tenant.logo_url,
      logo_dark_url: tenant.logo_dark_url,
      favicon_url: tenant.favicon_url,
      primary_color: tenant.primary_color || DEFAULT_BRANDING.primary_color,
      secondary_color: tenant.secondary_color || DEFAULT_BRANDING.secondary_color,
      accent_color: tenant.accent_color || DEFAULT_BRANDING.accent_color,
      background_color: tenant.background_color || DEFAULT_BRANDING.background_color,
      text_color: tenant.text_color || DEFAULT_BRANDING.text_color,
      custom_css: tenant.custom_css,
    };

    // Extract limits with fallback
    const limits: TenantLimits = {
      ...DEFAULT_LIMITS,
      ...(tenant.settings?.limits || {}),
    };

    return {
      // Core tenant data
      tenant,
      tenantId: tenant.id,
      tenantSlug: tenant.slug,
      tenantName: tenant.name,
      
      // Resolution info
      resolutionMethod: method,
      isCustomDomain: method === 'custom_domain',
      isSubdomain: method === 'subdomain',
      isPathBased: method === 'path_prefix',
      isDefault: tenant.id === DEFAULT_TENANT_ID,
      
      // Extracted settings
      features,
      branding,
      limits,
      
      // Helper functions
      hasFeature: (feature: keyof TenantFeatures) => {
        return features[feature] === true;
      },
      
      isWithinLimit: (limit: keyof TenantLimits, currentValue: number) => {
        const limitValue = limits[limit];
        if (limitValue === null) return true; // null = unlimited
        return currentValue < (limitValue as number);
      },
      
      getFeature: <K extends keyof TenantFeatures>(feature: K) => {
        return features[feature];
      },
    };
  }, [tenant, method]);

  return (
    <TenantContext.Provider value={value}>
      {children}
    </TenantContext.Provider>
  );
}

// ============================================
// HOOKS
// ============================================

/**
 * Access tenant context - throws if not within TenantProvider
 */
export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant must be used within a TenantProvider');
  }
  
  return context;
}

/**
 * Access tenant context - returns null if not within TenantProvider
 */
export function useTenantOptional(): TenantContextValue | null {
  return useContext(TenantContext);
}

/**
 * Access tenant features only
 */
export function useTenantFeatures(): TenantFeatures {
  const { features } = useTenant();
  return features;
}

/**
 * Access tenant branding only
 */
export function useTenantBranding(): TenantBranding {
  const { branding } = useTenant();
  return branding;
}

/**
 * Access tenant limits only
 */
export function useTenantLimits(): TenantLimits {
  const { limits } = useTenant();
  return limits;
}

/**
 * Check if a specific feature is enabled
 */
export function useFeatureEnabled(feature: keyof TenantFeatures): boolean {
  const { hasFeature } = useTenant();
  return hasFeature(feature);
}

/**
 * Check if user is within a specific limit
 */
export function useWithinLimit(
  limit: keyof TenantLimits,
  currentValue: number
): boolean {
  const { isWithinLimit } = useTenant();
  return isWithinLimit(limit, currentValue);
}

// ============================================
// EXPORTS
// ============================================

export { TenantContext };
export type { TenantContextValue, TenantProviderProps };


