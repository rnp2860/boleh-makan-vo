-- ============================================
-- 🏢 MULTI-TENANT SCHEMA - Database Migration
-- ============================================
-- Boleh Makan - Malaysian Food Tracking App for Diabetics
-- White-label support for hospitals, corporate wellness, insurance partners
-- Ensures backward compatibility with existing data

-- ============================================
-- 1. TENANTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL, -- 'ijm-wellness', 'kpj-healthcare', 'boleh-makan-public'
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('public', 'corporate', 'healthcare', 'insurance', 'government')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'trial', 'churned')),
  
  -- Branding
  logo_url TEXT,
  logo_dark_url TEXT, -- For dark mode
  favicon_url TEXT,
  primary_color TEXT DEFAULT '#10B981', -- Emerald green
  secondary_color TEXT DEFAULT '#059669',
  accent_color TEXT DEFAULT '#F59E0B', -- Amber for highlights
  background_color TEXT DEFAULT '#FFFFFF',
  text_color TEXT DEFAULT '#1F2937',
  custom_css TEXT, -- Additional CSS overrides
  
  -- Domain configuration
  custom_domain TEXT UNIQUE, -- 'wellness.ijm.com'
  subdomain TEXT UNIQUE, -- 'ijm' for ijm.bolehmakan.my
  
  -- Configuration
  settings JSONB DEFAULT '{
    "features": {
      "ai_enabled": true,
      "ramadan_mode": true,
      "cgm_integration": false,
      "export_enabled": true,
      "voice_logging": true,
      "custom_foods": true,
      "reports": true,
      "vitals_tracking": true
    },
    "limits": {
      "max_users": null,
      "ai_queries_per_day": 50,
      "storage_gb": 10,
      "data_retention_days": 365
    },
    "onboarding": {
      "required_fields": ["age", "diabetes_type", "weight"],
      "skip_allowed": false,
      "custom_welcome_message": null
    },
    "notifications": {
      "email_enabled": true,
      "push_enabled": true,
      "sms_enabled": false
    },
    "privacy": {
      "anonymized_analytics": false,
      "data_sharing_allowed": true
    }
  }'::jsonb,
  
  -- Localization
  default_language TEXT DEFAULT 'en',
  supported_languages TEXT[] DEFAULT ARRAY['en', 'ms'],
  timezone TEXT DEFAULT 'Asia/Kuala_Lumpur',
  
  -- Contact information
  contact_email TEXT,
  contact_phone TEXT,
  support_email TEXT,
  
  -- Billing
  billing_email TEXT,
  billing_address JSONB DEFAULT '{}',
  plan TEXT DEFAULT 'trial' CHECK (plan IN ('trial', 'starter', 'professional', 'enterprise', 'custom')),
  trial_ends_at TIMESTAMPTZ,
  subscription_started_at TIMESTAMPTZ,
  subscription_ends_at TIMESTAMPTZ,
  
  -- Usage metrics (updated periodically)
  user_count INTEGER DEFAULT 0,
  monthly_ai_queries INTEGER DEFAULT 0,
  storage_used_mb INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CREATE DEFAULT TENANT (for existing users)
-- ============================================

INSERT INTO tenants (
  id, 
  slug, 
  name, 
  type, 
  status, 
  plan,
  primary_color,
  secondary_color,
  settings
)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'boleh-makan-public',
  'Boleh Makan',
  'public',
  'active',
  'professional',
  '#10B981',
  '#059669',
  '{
    "features": {
      "ai_enabled": true,
      "ramadan_mode": true,
      "cgm_integration": true,
      "export_enabled": true,
      "voice_logging": true,
      "custom_foods": true,
      "reports": true,
      "vitals_tracking": true
    },
    "limits": {
      "max_users": null,
      "ai_queries_per_day": 100,
      "storage_gb": 100,
      "data_retention_days": null
    },
    "onboarding": {
      "required_fields": ["age", "diabetes_type"],
      "skip_allowed": true,
      "custom_welcome_message": null
    },
    "notifications": {
      "email_enabled": true,
      "push_enabled": true,
      "sms_enabled": false
    },
    "privacy": {
      "anonymized_analytics": false,
      "data_sharing_allowed": true
    }
  }'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- 3. TENANT ADMINISTRATORS
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL, -- References user_id in app
  email TEXT NOT NULL,
  display_name TEXT,
  
  -- Role within tenant
  role TEXT NOT NULL CHECK (role IN ('owner', 'admin', 'manager', 'viewer')),
  
  -- Invitation tracking
  invited_by TEXT,
  invited_at TIMESTAMPTZ DEFAULT NOW(),
  accepted_at TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  
  -- Permissions override (null = use role defaults)
  permissions_override JSONB,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, user_id),
  UNIQUE(tenant_id, email)
);

-- ============================================
-- 4. TENANT-SPECIFIC FOODS
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Base food reference (null if tenant-created)
  base_food_id UUID, -- Would reference foods table if it exists
  
  -- Food details
  name TEXT NOT NULL,
  name_ms TEXT, -- Bahasa Malaysia name
  description TEXT,
  category TEXT,
  
  -- Nutritional info (per serving)
  serving_size TEXT DEFAULT '100g',
  serving_unit TEXT DEFAULT 'g',
  serving_weight_g DECIMAL(10,2) DEFAULT 100,
  
  calories DECIMAL(10,2),
  carbs DECIMAL(10,2),
  protein DECIMAL(10,2),
  fat DECIMAL(10,2),
  fiber DECIMAL(10,2),
  sugar DECIMAL(10,2),
  sodium DECIMAL(10,2),
  
  -- Glycemic info
  gi_index INTEGER CHECK (gi_index >= 0 AND gi_index <= 100),
  gl_load DECIMAL(10,2),
  
  -- Metadata
  image_url TEXT,
  barcode TEXT,
  source TEXT, -- 'cafeteria', 'vending', 'external'
  tags TEXT[] DEFAULT '{}',
  
  -- Status
  is_approved BOOLEAN DEFAULT false,
  approved_by TEXT,
  approved_at TIMESTAMPTZ,
  
  -- Audit
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, name)
);

-- ============================================
-- 5. TENANT INVITE CODES
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_invite_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Code details
  code TEXT NOT NULL UNIQUE, -- 'IJM2026', 'KPJSTAFF'
  description TEXT,
  
  -- Usage limits
  max_uses INTEGER, -- null = unlimited
  current_uses INTEGER DEFAULT 0,
  
  -- Validity
  is_active BOOLEAN DEFAULT true,
  expires_at TIMESTAMPTZ,
  
  -- User assignment
  assigned_role TEXT, -- For corporate: assign specific role on join
  metadata JSONB DEFAULT '{}', -- Additional data to assign to users
  
  -- Audit
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. TENANT USAGE LOGS (for billing)
-- ============================================

CREATE TABLE IF NOT EXISTS tenant_usage_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  
  -- Period
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  
  -- Metrics
  active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  meals_logged INTEGER DEFAULT 0,
  ai_queries INTEGER DEFAULT 0,
  ai_tokens_used INTEGER DEFAULT 0,
  storage_used_mb DECIMAL(12,2) DEFAULT 0,
  
  -- Costs (in cents)
  ai_cost_cents INTEGER DEFAULT 0,
  storage_cost_cents INTEGER DEFAULT 0,
  total_cost_cents INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(tenant_id, period_start, period_end)
);

-- ============================================
-- 7. ADD TENANT_ID TO EXISTING TABLES
-- ============================================

-- User weekly goals
ALTER TABLE user_weekly_goals 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID;

-- Ramadan settings
ALTER TABLE ramadan_settings 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID;

-- Ramadan daily log
ALTER TABLE ramadan_daily_log 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID;

-- Ramadan qada log
ALTER TABLE ramadan_qada_log 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID;

-- Admin audit log (for cross-tenant auditing)
ALTER TABLE admin_audit_log 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- Support tickets
ALTER TABLE support_tickets 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID;

-- Feature flags (can be tenant-specific)
ALTER TABLE feature_flags 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- Announcements (can be tenant-specific)
ALTER TABLE announcements 
  ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES tenants(id);

-- ============================================
-- 8. INDEXES
-- ============================================

-- Tenants
CREATE INDEX IF NOT EXISTS idx_tenants_slug ON tenants(slug);
CREATE INDEX IF NOT EXISTS idx_tenants_custom_domain ON tenants(custom_domain) WHERE custom_domain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_subdomain ON tenants(subdomain) WHERE subdomain IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_tenants_status ON tenants(status);
CREATE INDEX IF NOT EXISTS idx_tenants_plan ON tenants(plan);

-- Tenant admins
CREATE INDEX IF NOT EXISTS idx_tenant_admins_tenant ON tenant_admins(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_admins_user ON tenant_admins(user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_admins_email ON tenant_admins(email);
CREATE INDEX IF NOT EXISTS idx_tenant_admins_active ON tenant_admins(tenant_id, is_active) WHERE is_active = true;

-- Tenant foods
CREATE INDEX IF NOT EXISTS idx_tenant_foods_tenant ON tenant_foods(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_foods_name ON tenant_foods(tenant_id, name);
CREATE INDEX IF NOT EXISTS idx_tenant_foods_category ON tenant_foods(tenant_id, category);
CREATE INDEX IF NOT EXISTS idx_tenant_foods_approved ON tenant_foods(tenant_id, is_approved) WHERE is_approved = true;

-- Tenant invite codes
CREATE INDEX IF NOT EXISTS idx_tenant_invite_codes_code ON tenant_invite_codes(code);
CREATE INDEX IF NOT EXISTS idx_tenant_invite_codes_tenant ON tenant_invite_codes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_invite_codes_active ON tenant_invite_codes(is_active, expires_at);

-- Tenant usage logs
CREATE INDEX IF NOT EXISTS idx_tenant_usage_logs_tenant ON tenant_usage_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_usage_logs_period ON tenant_usage_logs(period_start, period_end);

-- Tenant columns on existing tables
CREATE INDEX IF NOT EXISTS idx_user_weekly_goals_tenant ON user_weekly_goals(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ramadan_settings_tenant ON ramadan_settings(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ramadan_daily_log_tenant ON ramadan_daily_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_tenant ON support_tickets(tenant_id);

-- ============================================
-- 9. HELPER FUNCTIONS
-- ============================================

-- Get tenant ID from domain
CREATE OR REPLACE FUNCTION get_tenant_by_domain(domain_name TEXT)
RETURNS UUID AS $$
  SELECT id FROM tenants 
  WHERE custom_domain = domain_name 
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get tenant ID from subdomain
CREATE OR REPLACE FUNCTION get_tenant_by_subdomain(subdomain_name TEXT)
RETURNS UUID AS $$
  SELECT id FROM tenants 
  WHERE subdomain = subdomain_name 
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get tenant ID from slug
CREATE OR REPLACE FUNCTION get_tenant_by_slug(tenant_slug TEXT)
RETURNS UUID AS $$
  SELECT id FROM tenants 
  WHERE slug = tenant_slug 
    AND status = 'active'
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get tenant ID from invite code
CREATE OR REPLACE FUNCTION get_tenant_by_invite_code(invite_code TEXT)
RETURNS UUID AS $$
  SELECT tenant_id FROM tenant_invite_codes
  WHERE code = UPPER(invite_code)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses)
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Increment invite code usage
CREATE OR REPLACE FUNCTION use_invite_code(invite_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  code_record RECORD;
BEGIN
  SELECT * INTO code_record
  FROM tenant_invite_codes
  WHERE code = UPPER(invite_code)
    AND is_active = true
    AND (expires_at IS NULL OR expires_at > NOW())
    AND (max_uses IS NULL OR current_uses < max_uses)
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  UPDATE tenant_invite_codes
  SET current_uses = current_uses + 1,
      updated_at = NOW()
  WHERE id = code_record.id;
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get default tenant ID
CREATE OR REPLACE FUNCTION get_default_tenant_id()
RETURNS UUID AS $$
  SELECT '00000000-0000-0000-0000-000000000001'::UUID;
$$ LANGUAGE SQL IMMUTABLE;

-- Check if user is tenant admin
CREATE OR REPLACE FUNCTION is_tenant_admin(p_tenant_id UUID, p_user_id TEXT)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM tenant_admins
    WHERE tenant_id = p_tenant_id
      AND user_id = p_user_id
      AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Get user's tenant admin role
CREATE OR REPLACE FUNCTION get_tenant_admin_role(p_tenant_id UUID, p_user_id TEXT)
RETURNS TEXT AS $$
  SELECT role FROM tenant_admins
  WHERE tenant_id = p_tenant_id
    AND user_id = p_user_id
    AND is_active = true
  LIMIT 1;
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- ============================================
-- 10. UPDATED_AT TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_tenant_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tenants_updated ON tenants;
CREATE TRIGGER tenants_updated
  BEFORE UPDATE ON tenants
  FOR EACH ROW EXECUTE FUNCTION update_tenant_timestamp();

DROP TRIGGER IF EXISTS tenant_admins_updated ON tenant_admins;
CREATE TRIGGER tenant_admins_updated
  BEFORE UPDATE ON tenant_admins
  FOR EACH ROW EXECUTE FUNCTION update_tenant_timestamp();

DROP TRIGGER IF EXISTS tenant_foods_updated ON tenant_foods;
CREATE TRIGGER tenant_foods_updated
  BEFORE UPDATE ON tenant_foods
  FOR EACH ROW EXECUTE FUNCTION update_tenant_timestamp();

DROP TRIGGER IF EXISTS tenant_invite_codes_updated ON tenant_invite_codes;
CREATE TRIGGER tenant_invite_codes_updated
  BEFORE UPDATE ON tenant_invite_codes
  FOR EACH ROW EXECUTE FUNCTION update_tenant_timestamp();

-- ============================================
-- 11. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_foods ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_invite_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_usage_logs ENABLE ROW LEVEL SECURITY;

-- Tenants - Service role and super admins can manage
CREATE POLICY "Service role full access to tenants"
  ON tenants FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Public can read active tenant basic info"
  ON tenants FOR SELECT
  USING (status = 'active');

-- Tenant Admins - Only accessible via service role or by tenant members
CREATE POLICY "Service role full access to tenant_admins"
  ON tenant_admins FOR ALL
  TO service_role
  USING (true);

-- Tenant Foods - Service role manages, tenant users can read approved
CREATE POLICY "Service role full access to tenant_foods"
  ON tenant_foods FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Users can read approved tenant foods"
  ON tenant_foods FOR SELECT
  USING (is_approved = true);

-- Tenant Invite Codes - Service role only (sensitive)
CREATE POLICY "Service role full access to tenant_invite_codes"
  ON tenant_invite_codes FOR ALL
  TO service_role
  USING (true);

-- Tenant Usage Logs - Service role only (billing data)
CREATE POLICY "Service role full access to tenant_usage_logs"
  ON tenant_usage_logs FOR ALL
  TO service_role
  USING (true);

-- ============================================
-- 12. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON tenants TO service_role;
GRANT ALL ON tenant_admins TO service_role;
GRANT ALL ON tenant_foods TO service_role;
GRANT ALL ON tenant_invite_codes TO service_role;
GRANT ALL ON tenant_usage_logs TO service_role;

GRANT EXECUTE ON FUNCTION get_tenant_by_domain TO service_role;
GRANT EXECUTE ON FUNCTION get_tenant_by_subdomain TO service_role;
GRANT EXECUTE ON FUNCTION get_tenant_by_slug TO service_role;
GRANT EXECUTE ON FUNCTION get_tenant_by_invite_code TO service_role;
GRANT EXECUTE ON FUNCTION use_invite_code TO service_role;
GRANT EXECUTE ON FUNCTION get_default_tenant_id TO service_role;
GRANT EXECUTE ON FUNCTION is_tenant_admin TO service_role;
GRANT EXECUTE ON FUNCTION get_tenant_admin_role TO service_role;

-- ============================================
-- 13. COMMENTS
-- ============================================

COMMENT ON TABLE tenants IS 'Multi-tenant registry for white-label deployments';
COMMENT ON TABLE tenant_admins IS 'Administrators for each tenant with role-based access';
COMMENT ON TABLE tenant_foods IS 'Tenant-specific food items (e.g., cafeteria menu)';
COMMENT ON TABLE tenant_invite_codes IS 'Invite codes for user signup to specific tenants';
COMMENT ON TABLE tenant_usage_logs IS 'Usage metrics for billing and analytics per tenant';

COMMENT ON COLUMN tenants.slug IS 'URL-safe unique identifier (e.g., ijm-wellness)';
COMMENT ON COLUMN tenants.custom_domain IS 'Custom domain for tenant (e.g., wellness.ijm.com)';
COMMENT ON COLUMN tenants.subdomain IS 'Subdomain on main domain (e.g., ijm for ijm.bolehmakan.my)';
COMMENT ON COLUMN tenants.settings IS 'Feature flags, limits, and configuration per tenant';


