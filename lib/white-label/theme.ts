// lib/white-label/theme.ts
// 🏷️ Theme Utilities - CSS variable injection and theme management

import { TenantTheme, TenantBranding } from './types';
import { DEFAULT_THEME, DEFAULT_BRANDING, PRESET_THEMES } from './constants';

// ============================================
// CSS VARIABLE GENERATION
// ============================================

/**
 * Generate CSS custom properties from tenant theme
 */
export function generateThemeCSSVariables(theme: Partial<TenantTheme> = {}): string {
  const mergedTheme = mergeTheme(theme);
  
  const lightVars = `
    --color-primary: ${mergedTheme.primary};
    --color-primary-hover: ${mergedTheme.primaryHover};
    --color-primary-light: ${mergedTheme.primaryLight};
    --color-secondary: ${mergedTheme.secondary};
    --color-secondary-hover: ${mergedTheme.secondaryHover};
    --color-accent: ${mergedTheme.accent};
    --color-accent-hover: ${mergedTheme.accentHover};
    --color-background: ${mergedTheme.background};
    --color-background-alt: ${mergedTheme.backgroundAlt};
    --color-foreground: ${mergedTheme.foreground};
    --color-foreground-muted: ${mergedTheme.foregroundMuted};
    --color-muted: ${mergedTheme.muted};
    --color-border: ${mergedTheme.border};
    --color-border-focus: ${mergedTheme.borderFocus};
    --color-success: ${mergedTheme.success};
    --color-success-light: ${mergedTheme.successLight};
    --color-warning: ${mergedTheme.warning};
    --color-warning-light: ${mergedTheme.warningLight};
    --color-danger: ${mergedTheme.danger};
    --color-danger-light: ${mergedTheme.dangerLight};
    --color-info: ${mergedTheme.info};
    --color-info-light: ${mergedTheme.infoLight};
  `;
  
  const darkVars = mergedTheme.darkMode ? `
    --color-primary: ${mergedTheme.darkMode.primary};
    --color-primary-hover: ${mergedTheme.darkMode.primaryHover};
    --color-background: ${mergedTheme.darkMode.background};
    --color-background-alt: ${mergedTheme.darkMode.backgroundAlt};
    --color-foreground: ${mergedTheme.darkMode.foreground};
    --color-foreground-muted: ${mergedTheme.darkMode.foregroundMuted};
    --color-border: ${mergedTheme.darkMode.border};
    --color-border-focus: ${mergedTheme.darkMode.borderFocus};
  ` : '';
  
  return `
:root {
  ${lightVars.trim()}
}

.dark, [data-theme="dark"] {
  ${darkVars.trim()}
}
`.trim();
}

/**
 * Generate font CSS from branding
 */
export function generateFontCSS(branding: Partial<TenantBranding> = {}): string {
  const fontHeading = branding.fontHeading || DEFAULT_BRANDING.fontHeading;
  const fontBody = branding.fontBody || DEFAULT_BRANDING.fontBody;
  
  return `
:root {
  --font-heading: '${fontHeading}', ui-sans-serif, system-ui, sans-serif;
  --font-body: '${fontBody}', ui-sans-serif, system-ui, sans-serif;
}
`.trim();
}

/**
 * Generate Google Fonts import URL
 */
export function generateGoogleFontsUrl(branding: Partial<TenantBranding> = {}): string {
  const fonts = new Set<string>();
  
  const fontHeading = branding.fontHeading || DEFAULT_BRANDING.fontHeading;
  const fontBody = branding.fontBody || DEFAULT_BRANDING.fontBody;
  
  fonts.add(fontHeading);
  fonts.add(fontBody);
  
  const fontParams = Array.from(fonts).map(font => {
    const encodedFont = encodeURIComponent(font);
    return `family=${encodedFont}:wght@400;500;600;700`;
  }).join('&');
  
  return `https://fonts.googleapis.com/css2?${fontParams}&display=swap`;
}

/**
 * Generate complete style injection content
 */
export function generateTenantStyles(
  theme: Partial<TenantTheme> = {},
  branding: Partial<TenantBranding> = {}
): string {
  const themeCSS = generateThemeCSSVariables(theme);
  const fontCSS = generateFontCSS(branding);
  
  return `${themeCSS}\n\n${fontCSS}`;
}

// ============================================
// THEME MERGING
// ============================================

/**
 * Merge partial theme with defaults
 */
export function mergeTheme(partial: Partial<TenantTheme> = {}): TenantTheme {
  return {
    ...DEFAULT_THEME,
    ...partial,
    darkMode: {
      ...DEFAULT_THEME.darkMode,
      ...(partial.darkMode || {}),
    },
  };
}

/**
 * Apply a preset theme
 */
export function applyPresetTheme(presetName: string, customizations: Partial<TenantTheme> = {}): TenantTheme {
  const preset = PRESET_THEMES[presetName] || {};
  return mergeTheme({ ...preset, ...customizations });
}

// ============================================
// COLOR UTILITIES
// ============================================

/**
 * Check if a color is light or dark
 */
export function isLightColor(hex: string): boolean {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}

/**
 * Generate a lighter/darker shade of a color
 */
export function adjustColorBrightness(hex: string, percent: number): string {
  const color = hex.replace('#', '');
  const r = parseInt(color.substring(0, 2), 16);
  const g = parseInt(color.substring(2, 4), 16);
  const b = parseInt(color.substring(4, 6), 16);
  
  const adjust = (value: number) => {
    const adjusted = Math.round(value + (255 * percent / 100));
    return Math.min(255, Math.max(0, adjusted));
  };
  
  const newR = adjust(r).toString(16).padStart(2, '0');
  const newG = adjust(g).toString(16).padStart(2, '0');
  const newB = adjust(b).toString(16).padStart(2, '0');
  
  return `#${newR}${newG}${newB}`;
}

/**
 * Generate color variations from primary color
 */
export function generateColorVariations(primaryColor: string): {
  primary: string;
  primaryHover: string;
  primaryLight: string;
} {
  return {
    primary: primaryColor,
    primaryHover: adjustColorBrightness(primaryColor, -10),
    primaryLight: adjustColorBrightness(primaryColor, 80),
  };
}

/**
 * Convert hex to RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * Convert RGB to hex
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b]
    .map(x => Math.max(0, Math.min(255, x)).toString(16).padStart(2, '0'))
    .join('');
}

// ============================================
// CONTRAST CHECKING
// ============================================

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const getLuminance = (rgb: { r: number; g: number; b: number }) => {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };
  
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard
 */
export function meetsContrastAA(foreground: string, background: string, isLargeText = false): boolean {
  const ratio = getContrastRatio(foreground, background);
  return isLargeText ? ratio >= 3 : ratio >= 4.5;
}

/**
 * Get recommended text color for a background
 */
export function getTextColorForBackground(backgroundColor: string): string {
  return isLightColor(backgroundColor) ? '#111827' : '#F9FAFB';
}


