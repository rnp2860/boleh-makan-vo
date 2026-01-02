// lib/white-label/branding.ts
// 🏷️ Branding Utilities - Logo and asset resolution

import { TenantBranding, TenantAsset, AssetType, TenantContent } from './types';
import { DEFAULT_BRANDING, DEFAULT_CONTENT, TENANT_TYPE_DEFAULTS } from './constants';

// ============================================
// BRANDING RESOLUTION
// ============================================

/**
 * Merge partial branding with defaults
 */
export function mergeBranding(partial: Partial<TenantBranding> = {}): TenantBranding {
  return {
    ...DEFAULT_BRANDING,
    ...partial,
    brandName: partial.brandName || DEFAULT_BRANDING.brandName,
    fontHeading: partial.fontHeading || DEFAULT_BRANDING.fontHeading,
    fontBody: partial.fontBody || DEFAULT_BRANDING.fontBody,
  };
}

/**
 * Get logo URL based on color scheme
 */
export function getLogoUrl(
  branding: Partial<TenantBranding>,
  colorScheme: 'light' | 'dark' = 'light'
): string {
  if (colorScheme === 'dark') {
    return branding.logoLight || branding.logoDark || DEFAULT_BRANDING.logoLight!;
  }
  return branding.logoDark || branding.logoLight || DEFAULT_BRANDING.logoDark!;
}

/**
 * Get favicon URL
 */
export function getFaviconUrl(branding: Partial<TenantBranding>): string {
  return branding.favicon || DEFAULT_BRANDING.favicon!;
}

/**
 * Get OG image URL
 */
export function getOgImageUrl(branding: Partial<TenantBranding>): string {
  return branding.ogImage || DEFAULT_BRANDING.ogImage!;
}

// ============================================
// CONTENT RESOLUTION
// ============================================

/**
 * Merge partial content with defaults, considering tenant type
 */
export function mergeContent(
  partial: Partial<TenantContent> = {},
  tenantType?: string
): TenantContent {
  const typeDefaults = tenantType 
    ? TENANT_TYPE_DEFAULTS[tenantType]?.content || {}
    : {};
  
  return {
    ...DEFAULT_CONTENT,
    ...typeDefaults,
    ...partial,
  };
}

/**
 * Get content value with language fallback
 */
export function getContent(
  content: TenantContent,
  key: keyof TenantContent,
  language: 'en' | 'ms' = 'en'
): string {
  if (language === 'ms') {
    const msKey = `${key}Ms` as keyof TenantContent;
    const msValue = content[msKey];
    if (msValue) return msValue;
  }
  
  return content[key] || DEFAULT_CONTENT[key] || '';
}

/**
 * Get localized content object
 */
export function getLocalizedContent(
  content: TenantContent,
  language: 'en' | 'ms' = 'en'
): Record<string, string> {
  const keys: (keyof TenantContent)[] = [
    'welcomeTitle',
    'welcomeMessage',
    'onboardingTitle',
    'onboardingSubtitle',
    'dashboardBanner',
    'footerText',
    'loginTitle',
    'loginSubtitle',
  ];
  
  const result: Record<string, string> = {};
  
  for (const key of keys) {
    result[key] = getContent(content, key, language);
  }
  
  return result;
}

// ============================================
// ASSET RESOLUTION
// ============================================

/**
 * Get asset URL from assets array
 */
export function getAssetUrl(
  assets: TenantAsset[],
  assetType: AssetType
): string | undefined {
  const asset = assets.find(a => a.assetType === assetType);
  return asset?.fileUrl;
}

/**
 * Build assets map from array
 */
export function buildAssetsMap(assets: TenantAsset[]): Record<AssetType, string | undefined> {
  const map: Partial<Record<AssetType, string>> = {};
  
  for (const asset of assets) {
    map[asset.assetType] = asset.fileUrl;
  }
  
  return map as Record<AssetType, string | undefined>;
}

// ============================================
// BRAND NAME HELPERS
// ============================================

/**
 * Get display name (brand name or default)
 */
export function getBrandName(branding: Partial<TenantBranding>): string {
  return branding.brandName || DEFAULT_BRANDING.brandName;
}

/**
 * Get tagline with language support
 */
export function getTagline(
  branding: Partial<TenantBranding>,
  language: 'en' | 'ms' = 'en'
): string {
  if (language === 'ms' && branding.taglineMs) {
    return branding.taglineMs;
  }
  return branding.tagline || DEFAULT_BRANDING.tagline || '';
}

/**
 * Replace brand name placeholders in text
 */
export function replaceBrandPlaceholders(
  text: string,
  brandName: string
): string {
  return text
    .replace(/\{\{brandName\}\}/g, brandName)
    .replace(/\{\{brand_name\}\}/g, brandName)
    .replace(/Boleh Makan/g, brandName);
}

// ============================================
// PWA MANIFEST GENERATION
// ============================================

interface PWAManifest {
  name: string;
  short_name: string;
  description: string;
  theme_color: string;
  background_color: string;
  start_url: string;
  display: string;
  orientation: string;
  icons: Array<{
    src: string;
    sizes: string;
    type: string;
    purpose: string;
  }>;
}

/**
 * Generate PWA manifest from tenant config
 */
export function generatePWAManifest(
  branding: Partial<TenantBranding>,
  pwaSettings: Partial<{
    appName: string;
    shortName: string;
    description: string;
    themeColor: string;
    backgroundColor: string;
    startUrl: string;
    display: string;
    orientation: string;
  }>,
  assets: TenantAsset[] = []
): PWAManifest {
  const brandName = getBrandName(branding);
  
  return {
    name: pwaSettings.appName || brandName,
    short_name: pwaSettings.shortName || brandName,
    description: pwaSettings.description || getTagline(branding),
    theme_color: pwaSettings.themeColor || '#10B981',
    background_color: pwaSettings.backgroundColor || '#FFFFFF',
    start_url: pwaSettings.startUrl || '/',
    display: pwaSettings.display || 'standalone',
    orientation: pwaSettings.orientation || 'portrait',
    icons: [
      {
        src: getAssetUrl(assets, 'app_icon_192') || '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: getAssetUrl(assets, 'app_icon_512') || '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}

// ============================================
// META TAGS GENERATION
// ============================================

interface MetaTags {
  title: string;
  description: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  themeColor: string;
  favicon: string;
}

/**
 * Generate meta tags from tenant config
 */
export function generateMetaTags(
  branding: Partial<TenantBranding>,
  pageTitle?: string,
  pageDescription?: string
): MetaTags {
  const brandName = getBrandName(branding);
  const tagline = getTagline(branding);
  
  const title = pageTitle ? `${pageTitle} | ${brandName}` : brandName;
  const description = pageDescription || tagline;
  
  return {
    title,
    description,
    ogTitle: title,
    ogDescription: description,
    ogImage: getOgImageUrl(branding),
    themeColor: '#10B981', // Use from theme
    favicon: getFaviconUrl(branding),
  };
}


