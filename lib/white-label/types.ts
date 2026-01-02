// lib/white-label/types.ts
// 🏷️ White-Label Types - TypeScript definitions for multi-tenant customization

// ============================================
// THEME TYPES
// ============================================

export interface TenantTheme {
  primary: string;
  primaryHover: string;
  primaryLight: string;
  secondary: string;
  secondaryHover: string;
  accent: string;
  accentHover: string;
  background: string;
  backgroundAlt: string;
  foreground: string;
  foregroundMuted: string;
  muted: string;
  border: string;
  borderFocus: string;
  success: string;
  successLight: string;
  warning: string;
  warningLight: string;
  danger: string;
  dangerLight: string;
  info: string;
  infoLight: string;
  darkMode: TenantDarkModeTheme;
}

export interface TenantDarkModeTheme {
  primary: string;
  primaryHover: string;
  background: string;
  backgroundAlt: string;
  foreground: string;
  foregroundMuted: string;
  border: string;
  borderFocus: string;
}

// ============================================
// BRANDING TYPES
// ============================================

export interface TenantBranding {
  brandName: string;
  tagline?: string;
  taglineMs?: string;
  logoLight?: string;
  logoDark?: string;
  favicon?: string;
  ogImage?: string;
  fontHeading: string;
  fontBody: string;
}

// ============================================
// WHITE-LABEL SETTINGS
// ============================================

export interface WhiteLabelSettings {
  hideAppBranding: boolean;
  hidePoweredBy: boolean;
  customTermsUrl?: string;
  customPrivacyUrl?: string;
  customSupportEmail?: string;
  customSupportPhone?: string;
  customHelpUrl?: string;
  allowUserRegistration: boolean;
  requireInviteCode: boolean;
  inviteCodePrefix?: string;
  ssoEnabled: boolean;
  ssoOnly: boolean;
  passwordAuthEnabled: boolean;
  magicLinkEnabled: boolean;
}

// ============================================
// CUSTOM CONTENT
// ============================================

export interface TenantContent {
  welcomeTitle?: string;
  welcomeTitleMs?: string;
  welcomeMessage?: string;
  welcomeMessageMs?: string;
  onboardingTitle?: string;
  onboardingTitleMs?: string;
  onboardingSubtitle?: string;
  onboardingSubtitleMs?: string;
  dashboardBanner?: string;
  dashboardBannerMs?: string;
  footerText?: string;
  footerTextMs?: string;
  loginTitle?: string;
  loginTitleMs?: string;
  loginSubtitle?: string;
  loginSubtitleMs?: string;
}

// ============================================
// AI SETTINGS
// ============================================

export interface TenantAISettings {
  enabled: boolean;
  assistantName: string;
  assistantNameMs: string;
  assistantAvatar?: string;
  assistantTitle: string;
  assistantTitleMs: string;
  systemPromptAdditions?: string;
  maxQueriesPerDay: number;
  disabledFeatures: string[];
  customGreeting?: string;
  customGreetingMs?: string;
}

// ============================================
// ANALYTICS SETTINGS
// ============================================

export interface TenantAnalyticsSettings {
  googleAnalyticsId?: string;
  googleTagManagerId?: string;
  mixpanelToken?: string;
  posthogKey?: string;
  customEventsWebhook?: string;
  reportingEmail?: string;
  weeklyReportEnabled: boolean;
  monthlyReportEnabled: boolean;
}

// ============================================
// COMPLIANCE SETTINGS
// ============================================

export interface TenantComplianceSettings {
  dataResidency: 'malaysia' | 'singapore' | 'global';
  retentionDays: number;
  auditLogEnabled: boolean;
  hipaaMode: boolean;
  pdpaCompliant: boolean;
  consentVersion: string;
  requireTermsAcceptance: boolean;
  dataExportEnabled: boolean;
  accountDeletionEnabled: boolean;
}

// ============================================
// PWA SETTINGS
// ============================================

export interface TenantPWASettings {
  appName?: string;
  shortName?: string;
  description?: string;
  themeColor?: string;
  backgroundColor?: string;
  startUrl: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'portrait' | 'landscape' | 'any';
}

// ============================================
// COMBINED CONFIG
// ============================================

export interface WhiteLabelConfig {
  tenantId: string;
  tenantSlug: string;
  branding: TenantBranding;
  theme: TenantTheme;
  whiteLabel: WhiteLabelSettings;
  content: TenantContent;
  ai: TenantAISettings;
  analytics: TenantAnalyticsSettings;
  compliance: TenantComplianceSettings;
  pwa: TenantPWASettings;
}

// ============================================
// TENANT ASSETS
// ============================================

export type AssetType =
  | 'logo_light'
  | 'logo_dark'
  | 'favicon'
  | 'og_image'
  | 'background_pattern'
  | 'onboarding_image_1'
  | 'onboarding_image_2'
  | 'onboarding_image_3'
  | 'email_header'
  | 'email_footer'
  | 'app_icon_192'
  | 'app_icon_512'
  | 'splash_screen'
  | 'login_background'
  | 'avatar_placeholder'
  | 'custom';

export interface TenantAsset {
  id: string;
  tenantId: string;
  assetType: AssetType;
  assetName?: string;
  fileUrl: string;
  filePath?: string;
  fileSizeBytes?: number;
  mimeType?: string;
  width?: number;
  height?: number;
  altText?: string;
  altTextMs?: string;
  uploadedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// EMAIL TEMPLATES
// ============================================

export type EmailTemplateCode =
  | 'welcome'
  | 'password_reset'
  | 'magic_link'
  | 'invite'
  | 'weekly_report'
  | 'monthly_report'
  | 'goal_achieved'
  | 'streak_reminder'
  | 'account_suspended'
  | 'account_deleted'
  | 'data_export_ready'
  | 'custom';

export interface TenantEmailTemplate {
  id: string;
  tenantId: string;
  templateCode: EmailTemplateCode;
  templateName?: string;
  subject: string;
  subjectMs?: string;
  previewText?: string;
  previewTextMs?: string;
  bodyHtml: string;
  bodyHtmlMs?: string;
  bodyText?: string;
  bodyTextMs?: string;
  variables: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// SSO CONFIGURATION
// ============================================

export type SSOProvider =
  | 'oidc'
  | 'saml'
  | 'azure_ad'
  | 'google_workspace'
  | 'okta'
  | 'onelogin'
  | 'auth0'
  | 'keycloak';

export interface SSOAttributeMapping {
  email: string;
  name: string;
  firstName?: string;
  lastName?: string;
  employeeId?: string;
  department?: string;
  avatar?: string;
}

export interface TenantSSOConfig {
  id: string;
  tenantId: string;
  provider: SSOProvider;
  displayName?: string;
  
  // OIDC
  clientId?: string;
  clientSecretEncrypted?: string;
  issuerUrl?: string;
  authorizationUrl?: string;
  tokenUrl?: string;
  userinfoUrl?: string;
  jwksUrl?: string;
  scopes: string[];
  
  // SAML
  samlEntityId?: string;
  samlSsoUrl?: string;
  samlCertificate?: string;
  samlSignRequest: boolean;
  
  // Mapping
  attributeMapping: SSOAttributeMapping;
  
  // Auto-provisioning
  autoCreateUsers: boolean;
  autoUpdateProfile: boolean;
  defaultRole: string;
  
  // Restrictions
  allowedDomains?: string[];
  allowedGroups?: string[];
  
  // Status
  isActive: boolean;
  isTested: boolean;
  lastTestAt?: string;
  lastTestResult?: Record<string, any>;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CUSTOM DOMAINS
// ============================================

export type DomainType = 'custom' | 'subdomain';
export type VerificationMethod = 'dns_txt' | 'dns_cname' | 'file';
export type SSLStatus = 'pending' | 'provisioning' | 'active' | 'failed';

export interface TenantCustomDomain {
  id: string;
  tenantId: string;
  domain: string;
  domainType: DomainType;
  
  // Verification
  verificationMethod: VerificationMethod;
  verificationToken?: string;
  verificationRecord?: string;
  verifiedAt?: string;
  isVerified: boolean;
  
  // SSL
  sslStatus: SSLStatus;
  sslProvisionedAt?: string;
  sslExpiresAt?: string;
  
  // Status
  isPrimary: boolean;
  isActive: boolean;
  
  createdAt: string;
  updatedAt: string;
}

// ============================================
// INVITE CODES
// ============================================

export interface TenantInviteCode {
  id: string;
  tenantId: string;
  code: string;
  maxUses?: number;
  currentUses: number;
  expiresAt?: string;
  allowedDomains?: string[];
  defaultRole: string;
  createdBy?: string;
  note?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================
// CONTEXT TYPES
// ============================================

export interface TenantContext {
  id: string;
  slug: string;
  name: string;
  config: WhiteLabelConfig;
  isDefault: boolean;
}

export interface DomainResolutionResult {
  tenantId: string;
  tenantSlug: string;
  tenantName: string;
  isCustomDomain: boolean;
  isSubdomain: boolean;
}


