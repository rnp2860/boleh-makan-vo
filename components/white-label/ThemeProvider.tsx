'use client';

// components/white-label/ThemeProvider.tsx
// 🏷️ Theme Provider - Injects tenant-specific CSS variables and fonts

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  TenantTheme,
  TenantBranding,
  WhiteLabelConfig,
  TenantContent,
  TenantAISettings,
} from '@/lib/white-label/types';
import {
  DEFAULT_THEME,
  DEFAULT_BRANDING,
  DEFAULT_CONTENT,
  DEFAULT_AI_SETTINGS,
  DEFAULT_TENANT_ID,
  DEFAULT_TENANT_SLUG,
} from '@/lib/white-label/constants';
import {
  generateTenantStyles,
  generateGoogleFontsUrl,
  mergeTheme,
  mergeBranding,
  mergeContent,
} from '@/lib/white-label';

// ============================================
// CONTEXT TYPES
// ============================================

interface TenantContextValue {
  tenantId: string;
  tenantSlug: string;
  isDefault: boolean;
  isLoading: boolean;
  
  // Config
  theme: TenantTheme;
  branding: TenantBranding;
  content: TenantContent;
  ai: TenantAISettings;
  
  // Helpers
  getBrandName: () => string;
  getAssistantName: (language?: 'en' | 'ms') => string;
  getContent: (key: keyof TenantContent, language?: 'en' | 'ms') => string;
  
  // Color scheme
  colorScheme: 'light' | 'dark';
  setColorScheme: (scheme: 'light' | 'dark') => void;
}

const TenantContext = createContext<TenantContextValue | null>(null);

// ============================================
// PROVIDER PROPS
// ============================================

interface ThemeProviderProps {
  children: React.ReactNode;
  
  // Tenant config (can be server-loaded or fetched client-side)
  tenantId?: string;
  tenantSlug?: string;
  theme?: Partial<TenantTheme>;
  branding?: Partial<TenantBranding>;
  content?: Partial<TenantContent>;
  ai?: Partial<TenantAISettings>;
  
  // Initial color scheme
  defaultColorScheme?: 'light' | 'dark';
  
  // For preview mode
  previewMode?: boolean;
}

// ============================================
// THEME PROVIDER COMPONENT
// ============================================

export function ThemeProvider({
  children,
  tenantId = DEFAULT_TENANT_ID,
  tenantSlug = DEFAULT_TENANT_SLUG,
  theme: themeProp,
  branding: brandingProp,
  content: contentProp,
  ai: aiProp,
  defaultColorScheme = 'light',
  previewMode = false,
}: ThemeProviderProps) {
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>(defaultColorScheme);
  const [isLoading, setIsLoading] = useState(false);
  
  // Merge configs with defaults
  const theme = useMemo(() => mergeTheme(themeProp), [themeProp]);
  const branding = useMemo(() => mergeBranding(brandingProp), [brandingProp]);
  const content = useMemo(() => mergeContent(contentProp), [contentProp]);
  const ai = useMemo(() => ({ ...DEFAULT_AI_SETTINGS, ...aiProp }), [aiProp]);
  
  const isDefault = tenantId === DEFAULT_TENANT_ID;
  
  // Generate CSS styles
  const cssStyles = useMemo(() => {
    return generateTenantStyles(theme, branding);
  }, [theme, branding]);
  
  // Google Fonts URL
  const fontsUrl = useMemo(() => {
    return generateGoogleFontsUrl(branding);
  }, [branding]);
  
  // Inject styles
  useEffect(() => {
    // Create or update style element
    const styleId = previewMode ? 'tenant-theme-preview' : 'tenant-theme';
    let styleEl = document.getElementById(styleId) as HTMLStyleElement;
    
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }
    
    styleEl.textContent = cssStyles;
    
    // Clean up on unmount
    return () => {
      if (previewMode && styleEl.parentNode) {
        styleEl.parentNode.removeChild(styleEl);
      }
    };
  }, [cssStyles, previewMode]);
  
  // Load fonts
  useEffect(() => {
    const linkId = previewMode ? 'tenant-fonts-preview' : 'tenant-fonts';
    let linkEl = document.getElementById(linkId) as HTMLLinkElement;
    
    if (!linkEl) {
      linkEl = document.createElement('link');
      linkEl.id = linkId;
      linkEl.rel = 'stylesheet';
      document.head.appendChild(linkEl);
    }
    
    linkEl.href = fontsUrl;
    
    return () => {
      if (previewMode && linkEl.parentNode) {
        linkEl.parentNode.removeChild(linkEl);
      }
    };
  }, [fontsUrl, previewMode]);
  
  // Handle color scheme changes
  useEffect(() => {
    if (colorScheme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [colorScheme]);
  
  // Detect system preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't explicitly chosen
      const stored = localStorage.getItem('color-scheme');
      if (!stored) {
        setColorScheme(e.matches ? 'dark' : 'light');
      }
    };
    
    // Check initial preference
    const stored = localStorage.getItem('color-scheme');
    if (stored === 'dark' || stored === 'light') {
      setColorScheme(stored);
    } else if (mediaQuery.matches) {
      setColorScheme('dark');
    }
    
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);
  
  // Helper functions
  const getBrandName = () => branding.brandName;
  
  const getAssistantName = (language: 'en' | 'ms' = 'en') => {
    return language === 'ms' ? ai.assistantNameMs : ai.assistantName;
  };
  
  const getContentValue = (key: keyof TenantContent, language: 'en' | 'ms' = 'en') => {
    if (language === 'ms') {
      const msKey = `${key}Ms` as keyof TenantContent;
      const msValue = content[msKey];
      if (msValue) return msValue;
    }
    return content[key] || '';
  };
  
  const handleSetColorScheme = (scheme: 'light' | 'dark') => {
    setColorScheme(scheme);
    localStorage.setItem('color-scheme', scheme);
  };
  
  const contextValue: TenantContextValue = {
    tenantId,
    tenantSlug,
    isDefault,
    isLoading,
    theme,
    branding,
    content,
    ai,
    getBrandName,
    getAssistantName,
    getContent: getContentValue,
    colorScheme,
    setColorScheme: handleSetColorScheme,
  };
  
  return (
    <TenantContext.Provider value={contextValue}>
      {children}
    </TenantContext.Provider>
  );
}

// ============================================
// HOOK
// ============================================

export function useTenant(): TenantContextValue {
  const context = useContext(TenantContext);
  
  if (!context) {
    throw new Error('useTenant must be used within a ThemeProvider');
  }
  
  return context;
}

// ============================================
// STYLE INJECTOR (Server Component Compatible)
// ============================================

interface TenantStyleInjectorProps {
  theme?: Partial<TenantTheme>;
  branding?: Partial<TenantBranding>;
}

export function TenantStyleInjector({ theme, branding }: TenantStyleInjectorProps) {
  const mergedTheme = mergeTheme(theme);
  const mergedBranding = mergeBranding(branding);
  
  const cssStyles = generateTenantStyles(mergedTheme, mergedBranding);
  const fontsUrl = generateGoogleFontsUrl(mergedBranding);
  
  return (
    <>
      <link
        rel="preconnect"
        href="https://fonts.googleapis.com"
      />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        href={fontsUrl}
        rel="stylesheet"
      />
      <style
        id="tenant-theme-ssr"
        dangerouslySetInnerHTML={{ __html: cssStyles }}
      />
    </>
  );
}


