// lib/white-label/constants.ts
// 🏷️ White-Label Constants - Default values and configuration

import { 
  TenantTheme, 
  TenantBranding, 
  WhiteLabelSettings,
  TenantContent,
  TenantAISettings,
  TenantAnalyticsSettings,
  TenantComplianceSettings,
  TenantPWASettings,
  WhiteLabelConfig 
} from './types';

// ============================================
// DEFAULT THEME (Boleh Makan Green)
// ============================================

export const DEFAULT_THEME: TenantTheme = {
  primary: '#10B981',
  primaryHover: '#059669',
  primaryLight: '#D1FAE5',
  secondary: '#6366F1',
  secondaryHover: '#4F46E5',
  accent: '#F59E0B',
  accentHover: '#D97706',
  background: '#FFFFFF',
  backgroundAlt: '#F9FAFB',
  foreground: '#111827',
  foregroundMuted: '#6B7280',
  muted: '#9CA3AF',
  border: '#E5E7EB',
  borderFocus: '#10B981',
  success: '#22C55E',
  successLight: '#DCFCE7',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  info: '#3B82F6',
  infoLight: '#DBEAFE',
  darkMode: {
    primary: '#34D399',
    primaryHover: '#10B981',
    background: '#111827',
    backgroundAlt: '#1F2937',
    foreground: '#F9FAFB',
    foregroundMuted: '#9CA3AF',
    border: '#374151',
    borderFocus: '#34D399',
  },
};

// ============================================
// DEFAULT BRANDING
// ============================================

export const DEFAULT_BRANDING: TenantBranding = {
  brandName: 'Boleh Makan',
  tagline: 'Malaysian Food Tracking for Diabetics',
  taglineMs: 'Penjejakan Makanan Malaysia untuk Pesakit Diabetes',
  logoLight: '/images/logo-light.svg',
  logoDark: '/images/logo-dark.svg',
  favicon: '/favicon.ico',
  ogImage: '/images/og-image.png',
  fontHeading: 'Inter',
  fontBody: 'Inter',
};

// ============================================
// DEFAULT WHITE-LABEL SETTINGS
// ============================================

export const DEFAULT_WHITE_LABEL_SETTINGS: WhiteLabelSettings = {
  hideAppBranding: false,
  hidePoweredBy: false,
  customTermsUrl: undefined,
  customPrivacyUrl: undefined,
  customSupportEmail: undefined,
  customSupportPhone: undefined,
  customHelpUrl: undefined,
  allowUserRegistration: true,
  requireInviteCode: false,
  inviteCodePrefix: undefined,
  ssoEnabled: false,
  ssoOnly: false,
  passwordAuthEnabled: true,
  magicLinkEnabled: true,
};

// ============================================
// DEFAULT CONTENT
// ============================================

export const DEFAULT_CONTENT: TenantContent = {
  welcomeTitle: 'Welcome to Boleh Makan!',
  welcomeTitleMs: 'Selamat Datang ke Boleh Makan!',
  welcomeMessage: 'Your personal food tracking companion for managing diabetes.',
  welcomeMessageMs: 'Teman penjejakan makanan peribadi anda untuk menguruskan diabetes.',
  onboardingTitle: 'Let\'s Get Started',
  onboardingTitleMs: 'Mari Mulakan',
  onboardingSubtitle: 'Set up your profile in just a few steps',
  onboardingSubtitleMs: 'Sediakan profil anda dalam beberapa langkah sahaja',
  loginTitle: 'Sign in to your account',
  loginTitleMs: 'Log masuk ke akaun anda',
  loginSubtitle: 'Track your meals and manage your health',
  loginSubtitleMs: 'Jejak makanan anda dan uruskan kesihatan',
};

// ============================================
// DEFAULT AI SETTINGS
// ============================================

export const DEFAULT_AI_SETTINGS: TenantAISettings = {
  enabled: true,
  assistantName: 'Dr. Reza',
  assistantNameMs: 'Dr. Reza',
  assistantAvatar: undefined,
  assistantTitle: 'AI Nutrition Advisor',
  assistantTitleMs: 'Penasihat Pemakanan AI',
  systemPromptAdditions: undefined,
  maxQueriesPerDay: 50,
  disabledFeatures: [],
  customGreeting: 'Hi! I\'m Dr. Reza, your AI nutrition advisor. How can I help you manage your health today?',
  customGreetingMs: 'Hai! Saya Dr. Reza, penasihat pemakanan AI anda. Bagaimana saya boleh membantu anda menguruskan kesihatan hari ini?',
};

// ============================================
// DEFAULT ANALYTICS SETTINGS
// ============================================

export const DEFAULT_ANALYTICS_SETTINGS: TenantAnalyticsSettings = {
  googleAnalyticsId: undefined,
  googleTagManagerId: undefined,
  mixpanelToken: undefined,
  posthogKey: undefined,
  customEventsWebhook: undefined,
  reportingEmail: undefined,
  weeklyReportEnabled: false,
  monthlyReportEnabled: false,
};

// ============================================
// DEFAULT COMPLIANCE SETTINGS
// ============================================

export const DEFAULT_COMPLIANCE_SETTINGS: TenantComplianceSettings = {
  dataResidency: 'malaysia',
  retentionDays: 365,
  auditLogEnabled: true,
  hipaaMode: false,
  pdpaCompliant: true,
  consentVersion: '1.0',
  requireTermsAcceptance: true,
  dataExportEnabled: true,
  accountDeletionEnabled: true,
};

// ============================================
// DEFAULT PWA SETTINGS
// ============================================

export const DEFAULT_PWA_SETTINGS: TenantPWASettings = {
  appName: 'Boleh Makan',
  shortName: 'Boleh Makan',
  description: 'Malaysian Food Tracking for Diabetics',
  themeColor: '#10B981',
  backgroundColor: '#FFFFFF',
  startUrl: '/',
  display: 'standalone',
  orientation: 'portrait',
};

// ============================================
// DEFAULT TENANT ID
// ============================================

export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
export const DEFAULT_TENANT_SLUG = 'boleh-makan';

// ============================================
// GOOGLE FONTS LIST
// ============================================

export const GOOGLE_FONTS = [
  'Inter',
  'Roboto',
  'Open Sans',
  'Lato',
  'Poppins',
  'Montserrat',
  'Source Sans Pro',
  'Nunito',
  'Raleway',
  'Ubuntu',
  'Rubik',
  'Work Sans',
  'DM Sans',
  'Plus Jakarta Sans',
  'Space Grotesk',
  'Outfit',
  'Manrope',
  'Lexend',
  'Sora',
  'Figtree',
] as const;

// ============================================
// PRESET THEMES
// ============================================

export const PRESET_THEMES: Record<string, Partial<TenantTheme>> = {
  emerald: {
    primary: '#10B981',
    primaryHover: '#059669',
    primaryLight: '#D1FAE5',
  },
  blue: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryLight: '#DBEAFE',
  },
  purple: {
    primary: '#8B5CF6',
    primaryHover: '#7C3AED',
    primaryLight: '#EDE9FE',
  },
  rose: {
    primary: '#F43F5E',
    primaryHover: '#E11D48',
    primaryLight: '#FFE4E6',
  },
  amber: {
    primary: '#F59E0B',
    primaryHover: '#D97706',
    primaryLight: '#FEF3C7',
  },
  teal: {
    primary: '#14B8A6',
    primaryHover: '#0D9488',
    primaryLight: '#CCFBF1',
  },
  indigo: {
    primary: '#6366F1',
    primaryHover: '#4F46E5',
    primaryLight: '#E0E7FF',
  },
  cyan: {
    primary: '#06B6D4',
    primaryHover: '#0891B2',
    primaryLight: '#CFFAFE',
  },
};

// ============================================
// TENANT TYPE DEFAULTS
// ============================================

export const TENANT_TYPE_DEFAULTS: Record<string, Partial<WhiteLabelConfig>> = {
  healthcare: {
    branding: {
      ...DEFAULT_BRANDING,
      tagline: 'Patient Health Management',
      taglineMs: 'Pengurusan Kesihatan Pesakit',
    },
    ai: {
      ...DEFAULT_AI_SETTINGS,
      assistantTitle: 'Your Health Assistant',
      assistantTitleMs: 'Pembantu Kesihatan Anda',
    },
    compliance: {
      ...DEFAULT_COMPLIANCE_SETTINGS,
      hipaaMode: true,
      auditLogEnabled: true,
    },
  },
  corporate: {
    branding: {
      ...DEFAULT_BRANDING,
      tagline: 'Employee Wellness Program',
      taglineMs: 'Program Kesejahteraan Pekerja',
    },
    whiteLabel: {
      ...DEFAULT_WHITE_LABEL_SETTINGS,
      requireInviteCode: true,
      ssoEnabled: true,
    },
  },
  insurance: {
    branding: {
      ...DEFAULT_BRANDING,
      tagline: 'Policyholder Health Tracking',
      taglineMs: 'Penjejakan Kesihatan Pemegang Polisi',
    },
    compliance: {
      ...DEFAULT_COMPLIANCE_SETTINGS,
      dataExportEnabled: true,
      retentionDays: 730, // 2 years
    },
  },
  government: {
    branding: {
      ...DEFAULT_BRANDING,
      tagline: 'Public Health Initiative',
      taglineMs: 'Inisiatif Kesihatan Awam',
    },
    whiteLabel: {
      ...DEFAULT_WHITE_LABEL_SETTINGS,
      allowUserRegistration: true,
    },
    compliance: {
      ...DEFAULT_COMPLIANCE_SETTINGS,
      pdpaCompliant: true,
      auditLogEnabled: true,
    },
  },
};

// ============================================
// EMAIL TEMPLATE VARIABLES
// ============================================

export const EMAIL_TEMPLATE_VARIABLES: Record<string, string[]> = {
  common: [
    '{{user.name}}',
    '{{user.email}}',
    '{{tenant.brandName}}',
    '{{tenant.supportEmail}}',
    '{{currentYear}}',
  ],
  welcome: [
    '{{verifyLink}}',
    '{{loginLink}}',
  ],
  password_reset: [
    '{{resetLink}}',
    '{{expiryTime}}',
  ],
  magic_link: [
    '{{magicLink}}',
    '{{expiryTime}}',
  ],
  invite: [
    '{{inviteLink}}',
    '{{inviterName}}',
    '{{expiryTime}}',
  ],
  weekly_report: [
    '{{mealsLogged}}',
    '{{avgGlucose}}',
    '{{goalProgress}}',
    '{{topFoods}}',
    '{{weekRange}}',
  ],
  goal_achieved: [
    '{{goalName}}',
    '{{achievedDate}}',
    '{{streak}}',
  ],
};

// ============================================
// SSO PROVIDER CONFIGS
// ============================================

export const SSO_PROVIDER_CONFIGS: Record<string, { name: string; icon: string; defaultScopes: string[] }> = {
  azure_ad: {
    name: 'Microsoft Azure AD',
    icon: 'microsoft',
    defaultScopes: ['openid', 'email', 'profile', 'User.Read'],
  },
  google_workspace: {
    name: 'Google Workspace',
    icon: 'google',
    defaultScopes: ['openid', 'email', 'profile'],
  },
  okta: {
    name: 'Okta',
    icon: 'okta',
    defaultScopes: ['openid', 'email', 'profile'],
  },
  onelogin: {
    name: 'OneLogin',
    icon: 'onelogin',
    defaultScopes: ['openid', 'email', 'profile'],
  },
  auth0: {
    name: 'Auth0',
    icon: 'auth0',
    defaultScopes: ['openid', 'email', 'profile'],
  },
  keycloak: {
    name: 'Keycloak',
    icon: 'keycloak',
    defaultScopes: ['openid', 'email', 'profile'],
  },
  oidc: {
    name: 'Generic OIDC',
    icon: 'key',
    defaultScopes: ['openid', 'email', 'profile'],
  },
  saml: {
    name: 'SAML 2.0',
    icon: 'shield',
    defaultScopes: [],
  },
};


