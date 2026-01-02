// lib/white-label/index.ts
// 🏷️ White-Label Module - Barrel Export

// Types
export type {
  TenantTheme,
  TenantDarkModeTheme,
  TenantBranding,
  WhiteLabelSettings,
  TenantContent,
  TenantAISettings,
  TenantAnalyticsSettings,
  TenantComplianceSettings,
  TenantPWASettings,
  WhiteLabelConfig,
  AssetType,
  TenantAsset,
  EmailTemplateCode,
  TenantEmailTemplate,
  SSOProvider,
  SSOAttributeMapping,
  TenantSSOConfig,
  DomainType,
  VerificationMethod,
  SSLStatus,
  TenantCustomDomain,
  TenantInviteCode,
  TenantContext,
  DomainResolutionResult,
} from './types';

// Constants
export {
  DEFAULT_THEME,
  DEFAULT_BRANDING,
  DEFAULT_WHITE_LABEL_SETTINGS,
  DEFAULT_CONTENT,
  DEFAULT_AI_SETTINGS,
  DEFAULT_ANALYTICS_SETTINGS,
  DEFAULT_COMPLIANCE_SETTINGS,
  DEFAULT_PWA_SETTINGS,
  DEFAULT_TENANT_ID,
  DEFAULT_TENANT_SLUG,
  GOOGLE_FONTS,
  PRESET_THEMES,
  TENANT_TYPE_DEFAULTS,
  EMAIL_TEMPLATE_VARIABLES,
  SSO_PROVIDER_CONFIGS,
} from './constants';

// Theme utilities
export {
  generateThemeCSSVariables,
  generateFontCSS,
  generateGoogleFontsUrl,
  generateTenantStyles,
  mergeTheme,
  applyPresetTheme,
  isLightColor,
  adjustColorBrightness,
  generateColorVariations,
  hexToRgb,
  rgbToHex,
  getContrastRatio,
  meetsContrastAA,
  getTextColorForBackground,
} from './theme';

// Branding utilities
export {
  mergeBranding,
  getLogoUrl,
  getFaviconUrl,
  getOgImageUrl,
  mergeContent,
  getContent,
  getLocalizedContent,
  getAssetUrl,
  buildAssetsMap,
  getBrandName,
  getTagline,
  replaceBrandPlaceholders,
  generatePWAManifest,
  generateMetaTags,
} from './branding';

// Domain resolver
export {
  resolveTenantFromDomain,
  invalidateDomainCache,
  invalidateTenantDomainCache,
  isDomainAllowed,
  extractEmailDomain,
  generateVerificationRecord,
  buildTenantUrl,
} from './domain-resolver';


