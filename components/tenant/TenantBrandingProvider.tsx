'use client';

// components/tenant/TenantBrandingProvider.tsx
// 🎨 Tenant Branding Provider - Injects CSS variables and custom styles

import React, { useEffect, ReactNode } from 'react';
import { useTenantBranding, useTenantOptional } from '@/lib/tenant';
import { TenantBranding } from '@/lib/types/tenant';

// ============================================
// TYPES
// ============================================

interface TenantBrandingProviderProps {
  children: ReactNode;
  /** Optional fallback branding if no tenant context */
  fallbackBranding?: Partial<TenantBranding>;
}

// ============================================
// COMPONENT
// ============================================

export function TenantBrandingProvider({
  children,
  fallbackBranding,
}: TenantBrandingProviderProps) {
  const tenant = useTenantOptional();
  const branding = tenant?.branding;

  useEffect(() => {
    const root = document.documentElement;
    
    // Get branding or fallback
    const colors = branding || fallbackBranding;
    
    if (colors) {
      // Set CSS custom properties
      root.style.setProperty('--tenant-primary', colors.primary_color || '#10B981');
      root.style.setProperty('--tenant-secondary', colors.secondary_color || '#059669');
      root.style.setProperty('--tenant-accent', colors.accent_color || '#F59E0B');
      root.style.setProperty('--tenant-background', colors.background_color || '#FFFFFF');
      root.style.setProperty('--tenant-text', colors.text_color || '#1F2937');
      
      // Generate color variants for hover, disabled, etc.
      root.style.setProperty('--tenant-primary-hover', adjustColor(colors.primary_color || '#10B981', -10));
      root.style.setProperty('--tenant-primary-light', adjustColor(colors.primary_color || '#10B981', 40));
      root.style.setProperty('--tenant-secondary-hover', adjustColor(colors.secondary_color || '#059669', -10));
      
      // Set favicon if available
      if (colors.favicon_url) {
        updateFavicon(colors.favicon_url);
      }
    }

    // Cleanup
    return () => {
      // Reset to defaults on unmount (optional)
    };
  }, [branding, fallbackBranding]);

  // Inject custom CSS if provided
  useEffect(() => {
    if (branding?.custom_css) {
      const styleId = 'tenant-custom-css';
      let styleEl = document.getElementById(styleId) as HTMLStyleElement | null;
      
      if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = styleId;
        document.head.appendChild(styleEl);
      }
      
      styleEl.textContent = branding.custom_css;
      
      return () => {
        if (styleEl) {
          styleEl.remove();
        }
      };
    }
  }, [branding?.custom_css]);

  return <>{children}</>;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Adjust color lightness
 * @param hex - Hex color string
 * @param percent - Positive = lighter, Negative = darker
 */
function adjustColor(hex: string, percent: number): string {
  // Remove # if present
  const cleanHex = hex.replace('#', '');
  
  // Parse RGB
  const r = parseInt(cleanHex.substring(0, 2), 16);
  const g = parseInt(cleanHex.substring(2, 4), 16);
  const b = parseInt(cleanHex.substring(4, 6), 16);
  
  // Adjust
  const adjust = (value: number) => {
    const newValue = value + Math.round((255 * percent) / 100);
    return Math.min(255, Math.max(0, newValue));
  };
  
  // Convert back to hex
  const toHex = (value: number) => value.toString(16).padStart(2, '0');
  
  return `#${toHex(adjust(r))}${toHex(adjust(g))}${toHex(adjust(b))}`;
}

/**
 * Update page favicon
 */
function updateFavicon(url: string): void {
  // Find existing favicon link
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement | null;
  
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  
  link.href = url;
}

// ============================================
// TENANT LOGO COMPONENT
// ============================================

interface TenantLogoProps {
  /** Use dark mode logo if available */
  darkMode?: boolean;
  /** Alt text for the logo */
  alt?: string;
  /** CSS class for the image */
  className?: string;
  /** Fallback if no tenant logo */
  fallback?: ReactNode;
  /** Max height in pixels */
  maxHeight?: number;
}

export function TenantLogo({
  darkMode = false,
  alt = 'Logo',
  className = '',
  fallback,
  maxHeight = 40,
}: TenantLogoProps) {
  const tenant = useTenantOptional();
  
  if (!tenant) {
    return fallback || null;
  }
  
  const { branding, tenantName } = tenant;
  const logoUrl = darkMode && branding.logo_dark_url 
    ? branding.logo_dark_url 
    : branding.logo_url;
  
  if (!logoUrl) {
    // Return text logo if no image
    return (
      <span 
        className={`font-bold text-xl ${className}`}
        style={{ color: branding.primary_color }}
      >
        {tenantName}
      </span>
    );
  }
  
  return (
    <img
      src={logoUrl}
      alt={alt || tenantName}
      className={className}
      style={{ maxHeight, objectFit: 'contain' }}
    />
  );
}

// ============================================
// TENANT THEME WRAPPER
// ============================================

interface TenantThemeWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that applies tenant colors as inline styles
 * Useful for isolated components or email templates
 */
export function TenantThemeWrapper({
  children,
  className = '',
}: TenantThemeWrapperProps) {
  const tenant = useTenantOptional();
  
  const style = tenant
    ? {
        '--primary': tenant.branding.primary_color,
        '--secondary': tenant.branding.secondary_color,
        '--accent': tenant.branding.accent_color,
        '--background': tenant.branding.background_color,
        '--foreground': tenant.branding.text_color,
      } as React.CSSProperties
    : {};
  
  return (
    <div className={className} style={style}>
      {children}
    </div>
  );
}

// ============================================
// CSS VARIABLES REFERENCE
// ============================================

/*
 * These CSS variables are set by TenantBrandingProvider:
 * 
 * --tenant-primary: Primary brand color
 * --tenant-primary-hover: Darker shade for hover states
 * --tenant-primary-light: Lighter shade for backgrounds
 * --tenant-secondary: Secondary brand color
 * --tenant-secondary-hover: Darker shade for hover states
 * --tenant-accent: Accent color for highlights
 * --tenant-background: Background color
 * --tenant-text: Text color
 * 
 * Usage in CSS:
 * 
 * .button-primary {
 *   background-color: var(--tenant-primary);
 * }
 * 
 * .button-primary:hover {
 *   background-color: var(--tenant-primary-hover);
 * }
 */


