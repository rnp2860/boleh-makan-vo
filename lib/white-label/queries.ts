// lib/white-label/queries.ts
// 🏷️ White-Label Queries - Database operations for tenant configuration

import { getSupabaseServiceClient } from '@/lib/supabase';
import {
  WhiteLabelConfig,
  TenantTheme,
  TenantBranding,
  WhiteLabelSettings,
  TenantContent,
  TenantAISettings,
  TenantAnalyticsSettings,
  TenantComplianceSettings,
  TenantPWASettings,
  TenantAsset,
  TenantEmailTemplate,
  TenantSSOConfig,
  TenantCustomDomain,
  TenantInviteCode,
} from './types';
import {
  DEFAULT_THEME,
  DEFAULT_BRANDING,
  DEFAULT_WHITE_LABEL_SETTINGS,
  DEFAULT_CONTENT,
  DEFAULT_AI_SETTINGS,
  DEFAULT_ANALYTICS_SETTINGS,
  DEFAULT_COMPLIANCE_SETTINGS,
  DEFAULT_PWA_SETTINGS,
  DEFAULT_TENANT_ID,
} from './constants';

// ============================================
// TENANT CONFIG
// ============================================

/**
 * Get complete white-label config for a tenant
 */
export async function getTenantConfig(tenantId: string): Promise<WhiteLabelConfig | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      id,
      slug,
      name,
      brand_name,
      tagline,
      tagline_ms,
      logo_light_url,
      logo_dark_url,
      favicon_url,
      og_image_url,
      font_heading,
      font_body,
      theme,
      white_label_settings,
      custom_content,
      ai_settings,
      analytics_settings,
      compliance_settings,
      pwa_settings
    `)
    .eq('id', tenantId)
    .single();
  
  if (error || !data) {
    console.error('Error fetching tenant config:', error);
    return null;
  }
  
  return mapTenantConfig(data);
}

/**
 * Get tenant config by slug
 */
export async function getTenantConfigBySlug(slug: string): Promise<WhiteLabelConfig | null> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('tenants')
    .select(`
      id,
      slug,
      name,
      brand_name,
      tagline,
      tagline_ms,
      logo_light_url,
      logo_dark_url,
      favicon_url,
      og_image_url,
      font_heading,
      font_body,
      theme,
      white_label_settings,
      custom_content,
      ai_settings,
      analytics_settings,
      compliance_settings,
      pwa_settings
    `)
    .eq('slug', slug)
    .single();
  
  if (error || !data) {
    return null;
  }
  
  return mapTenantConfig(data);
}

/**
 * Update tenant branding
 */
export async function updateTenantBranding(
  tenantId: string,
  branding: Partial<TenantBranding>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('tenants')
    .update({
      brand_name: branding.brandName,
      tagline: branding.tagline,
      tagline_ms: branding.taglineMs,
      logo_light_url: branding.logoLight,
      logo_dark_url: branding.logoDark,
      favicon_url: branding.favicon,
      og_image_url: branding.ogImage,
      font_heading: branding.fontHeading,
      font_body: branding.fontBody,
    })
    .eq('id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Update tenant theme
 */
export async function updateTenantTheme(
  tenantId: string,
  theme: Partial<TenantTheme>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // First get current theme to merge
  const { data: current } = await supabase
    .from('tenants')
    .select('theme')
    .eq('id', tenantId)
    .single();
  
  const mergedTheme = {
    ...(current?.theme || DEFAULT_THEME),
    ...theme,
    darkMode: {
      ...(current?.theme?.darkMode || DEFAULT_THEME.darkMode),
      ...(theme.darkMode || {}),
    },
  };
  
  const { error } = await supabase
    .from('tenants')
    .update({ theme: mergedTheme })
    .eq('id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Update tenant content
 */
export async function updateTenantContent(
  tenantId: string,
  content: Partial<TenantContent>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { data: current } = await supabase
    .from('tenants')
    .select('custom_content')
    .eq('id', tenantId)
    .single();
  
  const mergedContent = {
    ...(current?.custom_content || {}),
    ...content,
  };
  
  const { error } = await supabase
    .from('tenants')
    .update({ custom_content: mergedContent })
    .eq('id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Update tenant AI settings
 */
export async function updateTenantAISettings(
  tenantId: string,
  settings: Partial<TenantAISettings>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { data: current } = await supabase
    .from('tenants')
    .select('ai_settings')
    .eq('id', tenantId)
    .single();
  
  const mergedSettings = {
    ...(current?.ai_settings || DEFAULT_AI_SETTINGS),
    ...settings,
  };
  
  const { error } = await supabase
    .from('tenants')
    .update({ ai_settings: mergedSettings })
    .eq('id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

/**
 * Update white-label settings
 */
export async function updateWhiteLabelSettings(
  tenantId: string,
  settings: Partial<WhiteLabelSettings>
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { data: current } = await supabase
    .from('tenants')
    .select('white_label_settings')
    .eq('id', tenantId)
    .single();
  
  const mergedSettings = {
    ...(current?.white_label_settings || DEFAULT_WHITE_LABEL_SETTINGS),
    ...settings,
  };
  
  const { error } = await supabase
    .from('tenants')
    .update({ white_label_settings: mergedSettings })
    .eq('id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================
// TENANT ASSETS
// ============================================

/**
 * Get all assets for a tenant
 */
export async function getTenantAssets(tenantId: string): Promise<TenantAsset[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('tenant_assets')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('asset_type');
  
  if (error) {
    console.error('Error fetching tenant assets:', error);
    return [];
  }
  
  return (data || []).map(mapTenantAsset);
}

/**
 * Upload tenant asset
 */
export async function uploadTenantAsset(
  tenantId: string,
  assetType: TenantAsset['assetType'],
  file: File,
  uploadedBy?: string
): Promise<{ success: boolean; asset?: TenantAsset; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // Upload to storage
  const filePath = `tenants/${tenantId}/assets/${assetType}-${Date.now()}.${file.name.split('.').pop()}`;
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('tenant-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });
  
  if (uploadError) {
    return { success: false, error: uploadError.message };
  }
  
  // Get public URL
  const { data: urlData } = supabase.storage
    .from('tenant-assets')
    .getPublicUrl(filePath);
  
  const fileUrl = urlData.publicUrl;
  
  // Upsert asset record
  const { data, error } = await supabase
    .from('tenant_assets')
    .upsert({
      tenant_id: tenantId,
      asset_type: assetType,
      file_url: fileUrl,
      file_path: filePath,
      file_size_bytes: file.size,
      mime_type: file.type,
      uploaded_by: uploadedBy,
    }, {
      onConflict: 'tenant_id,asset_type',
    })
    .select()
    .single();
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  // Update tenant table with URL
  if (assetType === 'logo_light') {
    await supabase.from('tenants').update({ logo_light_url: fileUrl }).eq('id', tenantId);
  } else if (assetType === 'logo_dark') {
    await supabase.from('tenants').update({ logo_dark_url: fileUrl }).eq('id', tenantId);
  } else if (assetType === 'favicon') {
    await supabase.from('tenants').update({ favicon_url: fileUrl }).eq('id', tenantId);
  } else if (assetType === 'og_image') {
    await supabase.from('tenants').update({ og_image_url: fileUrl }).eq('id', tenantId);
  }
  
  return { success: true, asset: mapTenantAsset(data) };
}

/**
 * Delete tenant asset
 */
export async function deleteTenantAsset(
  tenantId: string,
  assetId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // Get asset to delete file
  const { data: asset } = await supabase
    .from('tenant_assets')
    .select('file_path, asset_type')
    .eq('id', assetId)
    .eq('tenant_id', tenantId)
    .single();
  
  if (asset?.file_path) {
    await supabase.storage.from('tenant-assets').remove([asset.file_path]);
  }
  
  const { error } = await supabase
    .from('tenant_assets')
    .delete()
    .eq('id', assetId)
    .eq('tenant_id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================
// CUSTOM DOMAINS
// ============================================

/**
 * Get all custom domains for a tenant
 */
export async function getTenantDomains(tenantId: string): Promise<TenantCustomDomain[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('tenant_custom_domains')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('is_primary', { ascending: false });
  
  if (error) {
    console.error('Error fetching tenant domains:', error);
    return [];
  }
  
  return (data || []).map(mapTenantDomain);
}

/**
 * Add custom domain
 */
export async function addTenantDomain(
  tenantId: string,
  domain: string,
  domainType: 'custom' | 'subdomain' = 'custom'
): Promise<{ success: boolean; domain?: TenantCustomDomain; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // Generate verification token
  const verificationToken = generateToken(32);
  const verificationRecord = `boleh-makan-verify=${verificationToken}`;
  
  const { data, error } = await supabase
    .from('tenant_custom_domains')
    .insert({
      tenant_id: tenantId,
      domain: domain.toLowerCase(),
      domain_type: domainType,
      verification_method: 'dns_cname',
      verification_token: verificationToken,
      verification_record: verificationRecord,
    })
    .select()
    .single();
  
  if (error) {
    if (error.code === '23505') {
      return { success: false, error: 'Domain already exists' };
    }
    return { success: false, error: error.message };
  }
  
  return { success: true, domain: mapTenantDomain(data) };
}

/**
 * Verify domain
 */
export async function verifyTenantDomain(
  tenantId: string,
  domainId: string
): Promise<{ success: boolean; verified: boolean; error?: string }> {
  // In production, this would verify DNS records
  // For now, we'll simulate verification
  
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('tenant_custom_domains')
    .update({
      is_verified: true,
      verified_at: new Date().toISOString(),
      is_active: true,
      ssl_status: 'active',
      ssl_provisioned_at: new Date().toISOString(),
    })
    .eq('id', domainId)
    .eq('tenant_id', tenantId);
  
  if (error) {
    return { success: false, verified: false, error: error.message };
  }
  
  return { success: true, verified: true };
}

/**
 * Delete custom domain
 */
export async function deleteTenantDomain(
  tenantId: string,
  domainId: string
): Promise<{ success: boolean; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const { error } = await supabase
    .from('tenant_custom_domains')
    .delete()
    .eq('id', domainId)
    .eq('tenant_id', tenantId);
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true };
}

// ============================================
// INVITE CODES
// ============================================

/**
 * Get invite codes for a tenant
 */
export async function getTenantInviteCodes(tenantId: string): Promise<TenantInviteCode[]> {
  const supabase = getSupabaseServiceClient();
  
  const { data, error } = await supabase
    .from('tenant_invite_codes')
    .select('*')
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });
  
  if (error) {
    return [];
  }
  
  return (data || []).map(mapTenantInviteCode);
}

/**
 * Create invite code
 */
export async function createTenantInviteCode(
  tenantId: string,
  options: {
    maxUses?: number;
    expiresAt?: string;
    allowedDomains?: string[];
    defaultRole?: string;
    note?: string;
    createdBy?: string;
  } = {}
): Promise<{ success: boolean; code?: TenantInviteCode; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  const code = generateToken(8).toUpperCase();
  
  const { data, error } = await supabase
    .from('tenant_invite_codes')
    .insert({
      tenant_id: tenantId,
      code,
      max_uses: options.maxUses,
      expires_at: options.expiresAt,
      allowed_domains: options.allowedDomains,
      default_role: options.defaultRole || 'member',
      note: options.note,
      created_by: options.createdBy,
    })
    .select()
    .single();
  
  if (error) {
    return { success: false, error: error.message };
  }
  
  return { success: true, code: mapTenantInviteCode(data) };
}

/**
 * Validate and use invite code
 */
export async function useInviteCode(
  code: string,
  email: string
): Promise<{ success: boolean; tenantId?: string; role?: string; error?: string }> {
  const supabase = getSupabaseServiceClient();
  
  // Find code
  const { data: inviteCode, error: findError } = await supabase
    .from('tenant_invite_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single();
  
  if (findError || !inviteCode) {
    return { success: false, error: 'Invalid invite code' };
  }
  
  // Check expiry
  if (inviteCode.expires_at && new Date(inviteCode.expires_at) < new Date()) {
    return { success: false, error: 'Invite code has expired' };
  }
  
  // Check uses
  if (inviteCode.max_uses && inviteCode.current_uses >= inviteCode.max_uses) {
    return { success: false, error: 'Invite code has reached maximum uses' };
  }
  
  // Check allowed domains
  if (inviteCode.allowed_domains?.length > 0) {
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (!inviteCode.allowed_domains.includes(emailDomain)) {
      return { success: false, error: 'Email domain not allowed' };
    }
  }
  
  // Increment use count
  await supabase
    .from('tenant_invite_codes')
    .update({ current_uses: inviteCode.current_uses + 1 })
    .eq('id', inviteCode.id);
  
  return {
    success: true,
    tenantId: inviteCode.tenant_id,
    role: inviteCode.default_role,
  };
}

// ============================================
// HELPERS
// ============================================

function generateToken(length: number): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function mapTenantConfig(row: any): WhiteLabelConfig {
  return {
    tenantId: row.id,
    tenantSlug: row.slug,
    branding: {
      brandName: row.brand_name || row.name,
      tagline: row.tagline,
      taglineMs: row.tagline_ms,
      logoLight: row.logo_light_url,
      logoDark: row.logo_dark_url,
      favicon: row.favicon_url,
      ogImage: row.og_image_url,
      fontHeading: row.font_heading || DEFAULT_BRANDING.fontHeading,
      fontBody: row.font_body || DEFAULT_BRANDING.fontBody,
    },
    theme: { ...DEFAULT_THEME, ...(row.theme || {}) },
    whiteLabel: { ...DEFAULT_WHITE_LABEL_SETTINGS, ...(row.white_label_settings || {}) },
    content: { ...DEFAULT_CONTENT, ...(row.custom_content || {}) },
    ai: { ...DEFAULT_AI_SETTINGS, ...(row.ai_settings || {}) },
    analytics: { ...DEFAULT_ANALYTICS_SETTINGS, ...(row.analytics_settings || {}) },
    compliance: { ...DEFAULT_COMPLIANCE_SETTINGS, ...(row.compliance_settings || {}) },
    pwa: { ...DEFAULT_PWA_SETTINGS, ...(row.pwa_settings || {}) },
  };
}

function mapTenantAsset(row: any): TenantAsset {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    assetType: row.asset_type,
    assetName: row.asset_name,
    fileUrl: row.file_url,
    filePath: row.file_path,
    fileSizeBytes: row.file_size_bytes,
    mimeType: row.mime_type,
    width: row.width,
    height: row.height,
    altText: row.alt_text,
    altTextMs: row.alt_text_ms,
    uploadedBy: row.uploaded_by,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTenantDomain(row: any): TenantCustomDomain {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    domain: row.domain,
    domainType: row.domain_type,
    verificationMethod: row.verification_method,
    verificationToken: row.verification_token,
    verificationRecord: row.verification_record,
    verifiedAt: row.verified_at,
    isVerified: row.is_verified,
    sslStatus: row.ssl_status,
    sslProvisionedAt: row.ssl_provisioned_at,
    sslExpiresAt: row.ssl_expires_at,
    isPrimary: row.is_primary,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTenantInviteCode(row: any): TenantInviteCode {
  return {
    id: row.id,
    tenantId: row.tenant_id,
    code: row.code,
    maxUses: row.max_uses,
    currentUses: row.current_uses,
    expiresAt: row.expires_at,
    allowedDomains: row.allowed_domains,
    defaultRole: row.default_role,
    createdBy: row.created_by,
    note: row.note,
    isActive: row.is_active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}


