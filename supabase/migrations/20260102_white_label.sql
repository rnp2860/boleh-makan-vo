-- ============================================
-- 🏷️ WHITE-LABEL FOUNDATION - Database Migration
-- ============================================
-- Boleh Makan - Malaysian Food Tracking App for Diabetics
-- Complete white-label/multi-tenant customization system

-- ============================================
-- 1. EXTEND TENANTS TABLE
-- ============================================

-- Branding columns
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS brand_name TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS tagline TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS tagline_ms TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS logo_light_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS logo_dark_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS favicon_url TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS og_image_url TEXT;

-- Typography
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS font_heading TEXT DEFAULT 'Inter';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS font_body TEXT DEFAULT 'Inter';

-- Theme (color scheme)
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS theme JSONB DEFAULT '{
  "primary": "#10B981",
  "primaryHover": "#059669",
  "primaryLight": "#D1FAE5",
  "secondary": "#6366F1",
  "secondaryHover": "#4F46E5",
  "accent": "#F59E0B",
  "accentHover": "#D97706",
  "background": "#FFFFFF",
  "backgroundAlt": "#F9FAFB",
  "foreground": "#111827",
  "foregroundMuted": "#6B7280",
  "muted": "#9CA3AF",
  "border": "#E5E7EB",
  "borderFocus": "#10B981",
  "success": "#22C55E",
  "successLight": "#DCFCE7",
  "warning": "#F59E0B",
  "warningLight": "#FEF3C7",
  "danger": "#EF4444",
  "dangerLight": "#FEE2E2",
  "info": "#3B82F6",
  "infoLight": "#DBEAFE",
  "darkMode": {
    "primary": "#34D399",
    "primaryHover": "#10B981",
    "background": "#111827",
    "backgroundAlt": "#1F2937",
    "foreground": "#F9FAFB",
    "foregroundMuted": "#9CA3AF",
    "border": "#374151",
    "borderFocus": "#34D399"
  }
}'::jsonb;

-- Custom domains
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS custom_domains TEXT[] DEFAULT '{}';
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS primary_domain TEXT;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS ssl_provisioned BOOLEAN DEFAULT false;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS domain_verified BOOLEAN DEFAULT false;
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS domain_verification_token TEXT;

-- White-label settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS white_label_settings JSONB DEFAULT '{
  "hideAppBranding": false,
  "hidePoweredBy": false,
  "customTermsUrl": null,
  "customPrivacyUrl": null,
  "customSupportEmail": null,
  "customSupportPhone": null,
  "customHelpUrl": null,
  "allowUserRegistration": true,
  "requireInviteCode": false,
  "inviteCodePrefix": null,
  "ssoEnabled": false,
  "ssoOnly": false,
  "passwordAuthEnabled": true,
  "magicLinkEnabled": true
}'::jsonb;

-- Custom content
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS custom_content JSONB DEFAULT '{
  "welcomeTitle": null,
  "welcomeTitleMs": null,
  "welcomeMessage": null,
  "welcomeMessageMs": null,
  "onboardingTitle": null,
  "onboardingTitleMs": null,
  "onboardingSubtitle": null,
  "onboardingSubtitleMs": null,
  "dashboardBanner": null,
  "dashboardBannerMs": null,
  "footerText": null,
  "footerTextMs": null,
  "loginTitle": null,
  "loginTitleMs": null,
  "loginSubtitle": null,
  "loginSubtitleMs": null
}'::jsonb;

-- AI settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS ai_settings JSONB DEFAULT '{
  "enabled": true,
  "assistantName": "Dr. Reza",
  "assistantNameMs": "Dr. Reza",
  "assistantAvatar": null,
  "assistantTitle": "AI Nutrition Advisor",
  "assistantTitleMs": "Penasihat Pemakanan AI",
  "systemPromptAdditions": null,
  "maxQueriesPerDay": 50,
  "disabledFeatures": [],
  "customGreeting": null,
  "customGreetingMs": null
}'::jsonb;

-- Analytics settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS analytics_settings JSONB DEFAULT '{
  "googleAnalyticsId": null,
  "googleTagManagerId": null,
  "mixpanelToken": null,
  "posthogKey": null,
  "customEventsWebhook": null,
  "reportingEmail": null,
  "weeklyReportEnabled": false,
  "monthlyReportEnabled": false
}'::jsonb;

-- Compliance settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS compliance_settings JSONB DEFAULT '{
  "dataResidency": "malaysia",
  "retentionDays": 365,
  "auditLogEnabled": true,
  "hipaaMode": false,
  "pdpaCompliant": true,
  "consentVersion": "1.0",
  "requireTermsAcceptance": true,
  "dataExportEnabled": true,
  "accountDeletionEnabled": true
}'::jsonb;

-- App store / PWA settings
ALTER TABLE tenants ADD COLUMN IF NOT EXISTS pwa_settings JSONB DEFAULT '{
  "appName": null,
  "shortName": null,
  "description": null,
  "themeColor": null,
  "backgroundColor": null,
  "startUrl": "/",
  "display": "standalone",
  "orientation": "portrait"
}'::jsonb;

-- ============================================
-- 2. TENANT ASSETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  asset_type TEXT NOT NULL CHECK (asset_type IN (
    'logo_light',
    'logo_dark', 
    'favicon',
    'og_image',
    'background_pattern',
    'onboarding_image_1',
    'onboarding_image_2',
    'onboarding_image_3',
    'email_header',
    'email_footer',
    'app_icon_192',
    'app_icon_512',
    'splash_screen',
    'login_background',
    'avatar_placeholder',
    'custom'
  )),
  asset_name TEXT, -- for 'custom' type
  file_url TEXT NOT NULL,
  file_path TEXT, -- storage path
  file_size_bytes INTEGER,
  mime_type TEXT,
  width INTEGER,
  height INTEGER,
  alt_text TEXT,
  alt_text_ms TEXT,
  uploaded_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, asset_type) -- only one per type, except custom
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_tenant_assets_tenant ON tenant_assets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_assets_type ON tenant_assets(asset_type);

-- ============================================
-- 3. TENANT EMAIL TEMPLATES
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_email_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  template_code TEXT NOT NULL CHECK (template_code IN (
    'welcome',
    'password_reset',
    'magic_link',
    'invite',
    'weekly_report',
    'monthly_report',
    'goal_achieved',
    'streak_reminder',
    'account_suspended',
    'account_deleted',
    'data_export_ready',
    'custom'
  )),
  template_name TEXT, -- for 'custom' type
  subject TEXT NOT NULL,
  subject_ms TEXT,
  preview_text TEXT,
  preview_text_ms TEXT,
  body_html TEXT NOT NULL,
  body_html_ms TEXT,
  body_text TEXT, -- plain text fallback
  body_text_ms TEXT,
  variables JSONB DEFAULT '[]'::jsonb, -- available variables for this template
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, template_code)
);

-- Index for lookups
CREATE INDEX IF NOT EXISTS idx_tenant_email_templates_tenant ON tenant_email_templates(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_email_templates_code ON tenant_email_templates(template_code);

-- ============================================
-- 4. TENANT SSO CONFIGURATIONS
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_sso_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Provider info
  provider TEXT NOT NULL CHECK (provider IN (
    'oidc',
    'saml',
    'azure_ad',
    'google_workspace',
    'okta',
    'onelogin',
    'auth0',
    'keycloak'
  )),
  display_name TEXT, -- "Sign in with KPJ"
  
  -- OAuth/OIDC settings
  client_id TEXT,
  client_secret_encrypted TEXT, -- encrypted at rest
  issuer_url TEXT,
  authorization_url TEXT,
  token_url TEXT,
  userinfo_url TEXT,
  jwks_url TEXT,
  scopes TEXT[] DEFAULT '{openid, email, profile}',
  
  -- SAML settings
  saml_entity_id TEXT,
  saml_sso_url TEXT,
  saml_certificate TEXT,
  saml_sign_request BOOLEAN DEFAULT false,
  
  -- Attribute mapping
  attribute_mapping JSONB DEFAULT '{
    "email": "email",
    "name": "name",
    "firstName": "given_name",
    "lastName": "family_name",
    "employeeId": "employee_id",
    "department": "department",
    "avatar": "picture"
  }'::jsonb,
  
  -- Auto-provisioning
  auto_create_users BOOLEAN DEFAULT true,
  auto_update_profile BOOLEAN DEFAULT true,
  default_role TEXT DEFAULT 'member',
  
  -- Restrictions
  allowed_domains TEXT[], -- restrict to specific email domains
  allowed_groups TEXT[], -- restrict to specific IdP groups
  
  -- Status
  is_active BOOLEAN DEFAULT false,
  is_tested BOOLEAN DEFAULT false,
  last_test_at TIMESTAMPTZ,
  last_test_result JSONB,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id)
);

-- ============================================
-- 5. TENANT CUSTOM DOMAINS
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_custom_domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  domain_type TEXT CHECK (domain_type IN ('custom', 'subdomain')) DEFAULT 'custom',
  
  -- Verification
  verification_method TEXT CHECK (verification_method IN ('dns_txt', 'dns_cname', 'file')) DEFAULT 'dns_cname',
  verification_token TEXT,
  verification_record TEXT, -- e.g., "boleh-makan-verify=abc123"
  verified_at TIMESTAMPTZ,
  is_verified BOOLEAN DEFAULT false,
  
  -- SSL
  ssl_status TEXT CHECK (ssl_status IN ('pending', 'provisioning', 'active', 'failed')) DEFAULT 'pending',
  ssl_provisioned_at TIMESTAMPTZ,
  ssl_expires_at TIMESTAMPTZ,
  
  -- Status
  is_primary BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(domain)
);

-- Index for domain lookups
CREATE INDEX IF NOT EXISTS idx_tenant_custom_domains_domain ON tenant_custom_domains(domain);
CREATE INDEX IF NOT EXISTS idx_tenant_custom_domains_tenant ON tenant_custom_domains(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_custom_domains_active ON tenant_custom_domains(domain) WHERE is_active = true AND is_verified = true;

-- ============================================
-- 6. TENANT INVITE CODES
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  
  -- Limits
  max_uses INTEGER, -- null = unlimited
  current_uses INTEGER DEFAULT 0,
  expires_at TIMESTAMPTZ,
  
  -- Restrictions
  allowed_domains TEXT[], -- restrict to specific email domains
  default_role TEXT DEFAULT 'member',
  
  -- Metadata
  created_by TEXT,
  note TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, code)
);

-- Index for code lookups
CREATE INDEX IF NOT EXISTS idx_tenant_invite_codes_code ON tenant_invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_tenant_invite_codes_tenant ON tenant_invite_codes(tenant_id);

-- ============================================
-- 7. DOMAIN RESOLUTION CACHE
-- ============================================

CREATE TABLE IF NOT EXISTS domain_tenant_cache (
  domain TEXT PRIMARY KEY,
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  tenant_slug TEXT NOT NULL,
  cached_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '5 minutes')
);

-- Index for cleanup
CREATE INDEX IF NOT EXISTS idx_domain_tenant_cache_expires ON domain_tenant_cache(expires_at);

-- ============================================
-- 8. HELPER FUNCTIONS
-- ============================================

-- Resolve tenant from domain
CREATE OR REPLACE FUNCTION resolve_tenant_from_domain(p_domain TEXT)
RETURNS TABLE (
  tenant_id UUID,
  tenant_slug TEXT,
  tenant_name TEXT
) AS $$
BEGIN
  -- First check custom domains table
  RETURN QUERY
  SELECT t.id, t.slug, t.name
  FROM tenants t
  JOIN tenant_custom_domains tcd ON tcd.tenant_id = t.id
  WHERE tcd.domain = p_domain
    AND tcd.is_active = true
    AND tcd.is_verified = true
  LIMIT 1;
  
  IF NOT FOUND THEN
    -- Check tenants.custom_domains array
    RETURN QUERY
    SELECT t.id, t.slug, t.name
    FROM tenants t
    WHERE p_domain = ANY(t.custom_domains)
      AND t.is_active = true
    LIMIT 1;
  END IF;
  
  IF NOT FOUND THEN
    -- Check subdomain pattern (xxx.bolehmakan.my)
    IF p_domain LIKE '%.bolehmakan.my' THEN
      RETURN QUERY
      SELECT t.id, t.slug, t.name
      FROM tenants t
      WHERE t.slug = split_part(p_domain, '.', 1)
        AND t.is_active = true
      LIMIT 1;
    END IF;
  END IF;
  
  -- Default: return null (will use public tenant)
  RETURN;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get tenant branding
CREATE OR REPLACE FUNCTION get_tenant_branding(p_tenant_id UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  SELECT jsonb_build_object(
    'brandName', COALESCE(t.brand_name, t.name, 'Boleh Makan'),
    'tagline', t.tagline,
    'taglineMs', t.tagline_ms,
    'logoLight', t.logo_light_url,
    'logoDark', t.logo_dark_url,
    'favicon', t.favicon_url,
    'ogImage', t.og_image_url,
    'fontHeading', COALESCE(t.font_heading, 'Inter'),
    'fontBody', COALESCE(t.font_body, 'Inter'),
    'theme', t.theme,
    'whiteLabel', t.white_label_settings,
    'content', t.custom_content,
    'ai', t.ai_settings
  ) INTO result
  FROM tenants t
  WHERE t.id = p_tenant_id;
  
  RETURN COALESCE(result, '{}'::jsonb);
END;
$$ LANGUAGE plpgsql STABLE;

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_white_label_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers
DROP TRIGGER IF EXISTS tenant_assets_updated ON tenant_assets;
CREATE TRIGGER tenant_assets_updated
  BEFORE UPDATE ON tenant_assets
  FOR EACH ROW EXECUTE FUNCTION update_white_label_timestamp();

DROP TRIGGER IF EXISTS tenant_email_templates_updated ON tenant_email_templates;
CREATE TRIGGER tenant_email_templates_updated
  BEFORE UPDATE ON tenant_email_templates
  FOR EACH ROW EXECUTE FUNCTION update_white_label_timestamp();

DROP TRIGGER IF EXISTS tenant_sso_configs_updated ON tenant_sso_configs;
CREATE TRIGGER tenant_sso_configs_updated
  BEFORE UPDATE ON tenant_sso_configs
  FOR EACH ROW EXECUTE FUNCTION update_white_label_timestamp();

DROP TRIGGER IF EXISTS tenant_custom_domains_updated ON tenant_custom_domains;
CREATE TRIGGER tenant_custom_domains_updated
  BEFORE UPDATE ON tenant_custom_domains
  FOR EACH ROW EXECUTE FUNCTION update_white_label_timestamp();

-- ============================================
-- 9. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE tenant_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_email_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_sso_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_custom_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE domain_tenant_cache ENABLE ROW LEVEL SECURITY;

-- Service role access
CREATE POLICY "Service role full access to tenant_assets"
  ON tenant_assets FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access to tenant_email_templates"
  ON tenant_email_templates FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access to tenant_sso_configs"
  ON tenant_sso_configs FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access to tenant_custom_domains"
  ON tenant_custom_domains FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access to tenant_invite_codes"
  ON tenant_invite_codes FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access to domain_tenant_cache"
  ON domain_tenant_cache FOR ALL TO service_role USING (true);

-- Public read for domain resolution
CREATE POLICY "Public read for domain cache"
  ON domain_tenant_cache FOR SELECT USING (true);

-- ============================================
-- 10. SEED DEFAULT TENANT BRANDING
-- ============================================

-- Update default tenant with Boleh Makan branding
UPDATE tenants
SET
  brand_name = 'Boleh Makan',
  tagline = 'Malaysian Food Tracking for Diabetics',
  tagline_ms = 'Penjejakan Makanan Malaysia untuk Pesakit Diabetes',
  theme = '{
    "primary": "#10B981",
    "primaryHover": "#059669",
    "primaryLight": "#D1FAE5",
    "secondary": "#6366F1",
    "secondaryHover": "#4F46E5",
    "accent": "#F59E0B",
    "accentHover": "#D97706",
    "background": "#FFFFFF",
    "backgroundAlt": "#F9FAFB",
    "foreground": "#111827",
    "foregroundMuted": "#6B7280",
    "muted": "#9CA3AF",
    "border": "#E5E7EB",
    "borderFocus": "#10B981",
    "success": "#22C55E",
    "successLight": "#DCFCE7",
    "warning": "#F59E0B",
    "warningLight": "#FEF3C7",
    "danger": "#EF4444",
    "dangerLight": "#FEE2E2",
    "info": "#3B82F6",
    "infoLight": "#DBEAFE",
    "darkMode": {
      "primary": "#34D399",
      "primaryHover": "#10B981",
      "background": "#111827",
      "backgroundAlt": "#1F2937",
      "foreground": "#F9FAFB",
      "foregroundMuted": "#9CA3AF",
      "border": "#374151",
      "borderFocus": "#34D399"
    }
  }'::jsonb,
  ai_settings = '{
    "enabled": true,
    "assistantName": "Dr. Reza",
    "assistantNameMs": "Dr. Reza",
    "assistantAvatar": null,
    "assistantTitle": "AI Nutrition Advisor",
    "assistantTitleMs": "Penasihat Pemakanan AI",
    "systemPromptAdditions": null,
    "maxQueriesPerDay": 50,
    "disabledFeatures": [],
    "customGreeting": "Hi! I'\''m Dr. Reza, your AI nutrition advisor. How can I help you manage your health today?",
    "customGreetingMs": "Hai! Saya Dr. Reza, penasihat pemakanan AI anda. Bagaimana saya boleh membantu anda menguruskan kesihatan hari ini?"
  }'::jsonb
WHERE slug = 'boleh-makan' OR id = '00000000-0000-0000-0000-000000000001';

-- ============================================
-- 11. GRANTS
-- ============================================

GRANT ALL ON tenant_assets TO service_role;
GRANT ALL ON tenant_email_templates TO service_role;
GRANT ALL ON tenant_sso_configs TO service_role;
GRANT ALL ON tenant_custom_domains TO service_role;
GRANT ALL ON tenant_invite_codes TO service_role;
GRANT ALL ON domain_tenant_cache TO service_role;

GRANT EXECUTE ON FUNCTION resolve_tenant_from_domain TO service_role, authenticated, anon;
GRANT EXECUTE ON FUNCTION get_tenant_branding TO service_role, authenticated, anon;

-- ============================================
-- 12. COMMENTS
-- ============================================

COMMENT ON TABLE tenant_assets IS 'Uploaded brand assets (logos, images) per tenant';
COMMENT ON TABLE tenant_email_templates IS 'Customized email templates per tenant';
COMMENT ON TABLE tenant_sso_configs IS 'SSO/SAML/OIDC configurations per tenant';
COMMENT ON TABLE tenant_custom_domains IS 'Custom domain configurations with SSL status';
COMMENT ON TABLE tenant_invite_codes IS 'Invite codes for gated tenant registration';
COMMENT ON TABLE domain_tenant_cache IS 'Cache for domain to tenant resolution';

COMMENT ON FUNCTION resolve_tenant_from_domain IS 'Resolve tenant from domain (custom domain, subdomain, or default)';
COMMENT ON FUNCTION get_tenant_branding IS 'Get complete branding config for a tenant';


