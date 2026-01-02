// lib/types/tenant.ts
// 🏢 Multi-Tenant System - TypeScript Types

// ============================================
// TENANT TYPES
// ============================================

export type TenantType = 'public' | 'corporate' | 'healthcare' | 'insurance' | 'government';
export type TenantStatus = 'active' | 'suspended' | 'trial' | 'churned';
export type TenantPlan = 'trial' | 'starter' | 'professional' | 'enterprise' | 'custom';
export type TenantAdminRole = 'owner' | 'admin' | 'manager' | 'viewer';

// ============================================
// TENANT FEATURES & SETTINGS
// ============================================

export interface TenantFeatures {
  ai_enabled: boolean;
  ramadan_mode: boolean;
  cgm_integration: boolean;
  export_enabled: boolean;
  voice_logging: boolean;
  custom_foods: boolean;
  reports: boolean;
  vitals_tracking: boolean;
}

export interface TenantLimits {
  max_users: number | null;
  ai_queries_per_day: number;
  storage_gb: number;
  data_retention_days: number | null;
}

export interface TenantOnboarding {
  required_fields: string[];
  skip_allowed: boolean;
  custom_welcome_message: string | null;
}

export interface TenantNotifications {
  email_enabled: boolean;
  push_enabled: boolean;
  sms_enabled: boolean;
}

export interface TenantPrivacy {
  anonymized_analytics: boolean;
  data_sharing_allowed: boolean;
}

export interface TenantSettings {
  features: TenantFeatures;
  limits: TenantLimits;
  onboarding: TenantOnboarding;
  notifications: TenantNotifications;
  privacy: TenantPrivacy;
}

// ============================================
// TENANT BRANDING
// ============================================

export interface TenantBranding {
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  custom_css: string | null;
}

// ============================================
// TENANT DATABASE TYPES
// ============================================

export interface Tenant {
  id: string;
  slug: string;
  name: string;
  type: TenantType;
  status: TenantStatus;
  
  // Branding
  logo_url: string | null;
  logo_dark_url: string | null;
  favicon_url: string | null;
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  custom_css: string | null;
  
  // Domain
  custom_domain: string | null;
  subdomain: string | null;
  
  // Configuration
  settings: TenantSettings;
  
  // Localization
  default_language: string;
  supported_languages: string[];
  timezone: string;
  
  // Contact
  contact_email: string | null;
  contact_phone: string | null;
  support_email: string | null;
  
  // Billing
  billing_email: string | null;
  billing_address: Record<string, any>;
  plan: TenantPlan;
  trial_ends_at: string | null;
  subscription_started_at: string | null;
  subscription_ends_at: string | null;
  
  // Usage
  user_count: number;
  monthly_ai_queries: number;
  storage_used_mb: number;
  
  // Metadata
  created_at: string;
  updated_at: string;
}

export interface TenantAdmin {
  id: string;
  tenant_id: string;
  user_id: string;
  email: string;
  display_name: string | null;
  role: TenantAdminRole;
  invited_by: string | null;
  invited_at: string;
  accepted_at: string | null;
  is_active: boolean;
  last_login_at: string | null;
  permissions_override: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface TenantFood {
  id: string;
  tenant_id: string;
  base_food_id: string | null;
  name: string;
  name_ms: string | null;
  description: string | null;
  category: string | null;
  serving_size: string;
  serving_unit: string;
  serving_weight_g: number;
  calories: number | null;
  carbs: number | null;
  protein: number | null;
  fat: number | null;
  fiber: number | null;
  sugar: number | null;
  sodium: number | null;
  gi_index: number | null;
  gl_load: number | null;
  image_url: string | null;
  barcode: string | null;
  source: string | null;
  tags: string[];
  is_approved: boolean;
  approved_by: string | null;
  approved_at: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TenantInviteCode {
  id: string;
  tenant_id: string;
  code: string;
  description: string | null;
  max_uses: number | null;
  current_uses: number;
  is_active: boolean;
  expires_at: string | null;
  assigned_role: string | null;
  metadata: Record<string, any>;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface TenantUsageLog {
  id: string;
  tenant_id: string;
  period_start: string;
  period_end: string;
  active_users: number;
  new_users: number;
  meals_logged: number;
  ai_queries: number;
  ai_tokens_used: number;
  storage_used_mb: number;
  ai_cost_cents: number;
  storage_cost_cents: number;
  total_cost_cents: number;
  created_at: string;
}

// ============================================
// TENANT CONTEXT TYPES
// ============================================

export interface TenantContextData {
  tenant: Tenant;
  isCustomDomain: boolean;
  isSubdomain: boolean;
  isPathBased: boolean;
  isDefault: boolean;
  features: TenantFeatures;
  branding: TenantBranding;
  limits: TenantLimits;
}

/** @deprecated Use TenantContextData instead */
export type TenantContext = TenantContextData;

export interface TenantAdminContext extends TenantContextData {
  adminRole: TenantAdminRole;
  adminPermissions: TenantAdminPermissions;
}

export interface TenantAdminPermissions {
  can_view_users: boolean;
  can_manage_users: boolean;
  can_view_analytics: boolean;
  can_export_data: boolean;
  can_manage_branding: boolean;
  can_manage_foods: boolean;
  can_manage_invite_codes: boolean;
  can_view_billing: boolean;
  can_manage_billing: boolean;
  can_manage_admins: boolean;
}

// ============================================
// DEFAULT VALUES
// ============================================

export const DEFAULT_TENANT_ID = '00000000-0000-0000-0000-000000000001';
export const DEFAULT_TENANT_SLUG = 'boleh-makan-public';

export const DEFAULT_FEATURES: TenantFeatures = {
  ai_enabled: true,
  ramadan_mode: true,
  cgm_integration: false,
  export_enabled: true,
  voice_logging: true,
  custom_foods: true,
  reports: true,
  vitals_tracking: true,
};

export const DEFAULT_LIMITS: TenantLimits = {
  max_users: null,
  ai_queries_per_day: 50,
  storage_gb: 10,
  data_retention_days: 365,
};

export const DEFAULT_BRANDING: TenantBranding = {
  logo_url: null,
  logo_dark_url: null,
  favicon_url: null,
  primary_color: '#10B981',
  secondary_color: '#059669',
  accent_color: '#F59E0B',
  background_color: '#FFFFFF',
  text_color: '#1F2937',
  custom_css: null,
};

// ============================================
// TENANT ADMIN ROLE PERMISSIONS
// ============================================

export const TENANT_ADMIN_PERMISSIONS: Record<TenantAdminRole, TenantAdminPermissions> = {
  owner: {
    can_view_users: true,
    can_manage_users: true,
    can_view_analytics: true,
    can_export_data: true,
    can_manage_branding: true,
    can_manage_foods: true,
    can_manage_invite_codes: true,
    can_view_billing: true,
    can_manage_billing: true,
    can_manage_admins: true,
  },
  admin: {
    can_view_users: true,
    can_manage_users: true,
    can_view_analytics: true,
    can_export_data: true,
    can_manage_branding: true,
    can_manage_foods: true,
    can_manage_invite_codes: true,
    can_view_billing: true,
    can_manage_billing: false,
    can_manage_admins: false,
  },
  manager: {
    can_view_users: true,
    can_manage_users: false,
    can_view_analytics: true,
    can_export_data: false,
    can_manage_branding: false,
    can_manage_foods: true,
    can_manage_invite_codes: false,
    can_view_billing: false,
    can_manage_billing: false,
    can_manage_admins: false,
  },
  viewer: {
    can_view_users: true,
    can_manage_users: false,
    can_view_analytics: true,
    can_export_data: false,
    can_manage_branding: false,
    can_manage_foods: false,
    can_manage_invite_codes: false,
    can_view_billing: false,
    can_manage_billing: false,
    can_manage_admins: false,
  },
};

// ============================================
// API TYPES
// ============================================

export interface TenantCreateRequest {
  slug: string;
  name: string;
  type: TenantType;
  plan?: TenantPlan;
  contact_email: string;
  settings?: Partial<TenantSettings>;
}

export interface TenantUpdateRequest {
  name?: string;
  type?: TenantType;
  status?: TenantStatus;
  logo_url?: string | null;
  primary_color?: string;
  secondary_color?: string;
  custom_domain?: string | null;
  subdomain?: string | null;
  settings?: Partial<TenantSettings>;
  contact_email?: string;
  billing_email?: string;
  plan?: TenantPlan;
}

export interface InviteCodeCreateRequest {
  code: string;
  description?: string;
  max_uses?: number;
  expires_at?: string;
  assigned_role?: string;
  metadata?: Record<string, any>;
}

export interface TenantFoodCreateRequest {
  name: string;
  name_ms?: string;
  description?: string;
  category?: string;
  serving_size?: string;
  serving_unit?: string;
  serving_weight_g?: number;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  gi_index?: number;
  source?: string;
  tags?: string[];
}

export interface TenantApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

// ============================================
// RESOLUTION TYPES
// ============================================

export type TenantResolutionMethod = 
  | 'custom_domain'
  | 'subdomain'
  | 'path_prefix'
  | 'invite_code'
  | 'user_stored'
  | 'default';

export interface TenantResolutionResult {
  tenant: Tenant | null;
  method: TenantResolutionMethod;
  isResolved: boolean;
  error?: string;
}


