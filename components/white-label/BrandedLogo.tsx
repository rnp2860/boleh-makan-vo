'use client';

// components/white-label/BrandedLogo.tsx
// 🏷️ Branded Logo - Auto-selects light/dark based on context

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useTenant } from './ThemeProvider';
import { getLogoUrl } from '@/lib/white-label/branding';

// ============================================
// TYPES
// ============================================

interface BrandedLogoProps {
  /**
   * Force a specific variant regardless of theme
   */
  variant?: 'light' | 'dark' | 'auto';
  
  /**
   * Size preset or custom dimensions
   */
  size?: 'sm' | 'md' | 'lg' | 'xl' | { width: number; height: number };
  
  /**
   * Whether to link to home
   */
  linkToHome?: boolean;
  
  /**
   * Additional CSS classes
   */
  className?: string;
  
  /**
   * Show brand name text alongside logo
   */
  showText?: boolean;
  
  /**
   * Only show text, no logo image
   */
  textOnly?: boolean;
  
  /**
   * Alt text override
   */
  alt?: string;
}

// ============================================
// SIZE PRESETS
// ============================================

const SIZE_PRESETS = {
  sm: { width: 80, height: 24 },
  md: { width: 120, height: 36 },
  lg: { width: 160, height: 48 },
  xl: { width: 200, height: 60 },
};

// ============================================
// COMPONENT
// ============================================

export function BrandedLogo({
  variant = 'auto',
  size = 'md',
  linkToHome = true,
  className = '',
  showText = false,
  textOnly = false,
  alt,
}: BrandedLogoProps) {
  const { branding, colorScheme, getBrandName } = useTenant();
  
  // Determine variant
  const actualVariant = variant === 'auto' ? colorScheme : variant;
  
  // Get logo URL
  const logoUrl = getLogoUrl(branding, actualVariant);
  
  // Get dimensions
  const dimensions = typeof size === 'string' ? SIZE_PRESETS[size] : size;
  
  // Brand name
  const brandName = getBrandName();
  const altText = alt || brandName;
  
  // Content
  const content = (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      {!textOnly && logoUrl && (
        <Image
          src={logoUrl}
          alt={altText}
          width={dimensions.width}
          height={dimensions.height}
          className="object-contain"
          priority
        />
      )}
      
      {(showText || textOnly) && (
        <span 
          className="font-heading font-bold text-foreground"
          style={{ 
            fontSize: textOnly ? dimensions.height * 0.6 : dimensions.height * 0.4,
            fontFamily: 'var(--font-heading)',
          }}
        >
          {brandName}
        </span>
      )}
    </div>
  );
  
  if (linkToHome) {
    return (
      <Link href="/" className="focus:outline-none focus:ring-2 focus:ring-primary rounded-md">
        {content}
      </Link>
    );
  }
  
  return content;
}

// ============================================
// LOGO ICON ONLY
// ============================================

interface BrandedLogoIconProps {
  size?: number;
  className?: string;
}

export function BrandedLogoIcon({ size = 32, className = '' }: BrandedLogoIconProps) {
  const { branding, colorScheme } = useTenant();
  
  const logoUrl = getLogoUrl(branding, colorScheme);
  
  if (!logoUrl) {
    // Fallback to first letter of brand name
    const initial = branding.brandName.charAt(0).toUpperCase();
    return (
      <div 
        className={`flex items-center justify-center rounded-lg bg-primary text-white font-bold ${className}`}
        style={{ width: size, height: size, fontSize: size * 0.5 }}
      >
        {initial}
      </div>
    );
  }
  
  return (
    <Image
      src={logoUrl}
      alt=""
      width={size}
      height={size}
      className={`object-contain ${className}`}
    />
  );
}

// ============================================
// POWERED BY BADGE
// ============================================

interface PoweredByBadgeProps {
  className?: string;
  variant?: 'default' | 'minimal' | 'hidden';
}

export function PoweredByBadge({ className = '', variant = 'default' }: PoweredByBadgeProps) {
  const { isDefault } = useTenant();
  
  // Don't show on default tenant or if hidden
  if (isDefault || variant === 'hidden') {
    return null;
  }
  
  if (variant === 'minimal') {
    return (
      <a
        href="https://bolehmakan.my"
        target="_blank"
        rel="noopener noreferrer"
        className={`text-xs text-muted hover:text-foreground-muted transition-colors ${className}`}
      >
        Powered by Boleh Makan
      </a>
    );
  }
  
  return (
    <a
      href="https://bolehmakan.my"
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-background-alt border border-border text-xs text-foreground-muted hover:text-foreground hover:border-primary transition-all ${className}`}
    >
      <span>Powered by</span>
      <span className="font-semibold text-primary">Boleh Makan</span>
    </a>
  );
}


