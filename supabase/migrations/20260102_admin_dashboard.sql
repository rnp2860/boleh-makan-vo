-- ============================================
-- 🔐 ADMIN DASHBOARD - Database Schema
-- ============================================
-- Boleh Makan - Admin operational dashboard
-- Includes role-based access control, audit logging, and announcements

-- ============================================
-- 1. ADMIN USERS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  
  -- Role and permissions
  role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'support', 'viewer')),
  permissions JSONB DEFAULT '{
    "users": {"read": true, "write": false, "delete": false},
    "analytics": {"read": true, "export": false},
    "content": {"read": true, "write": false, "delete": false},
    "system": {"read": false, "write": false},
    "audit": {"read": false}
  }'::jsonb,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  last_activity_at TIMESTAMPTZ,
  
  -- 2FA
  two_factor_enabled BOOLEAN DEFAULT false,
  two_factor_secret TEXT,
  
  -- Metadata
  created_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. ADMIN AUDIT LOG
-- ============================================

CREATE TABLE IF NOT EXISTS admin_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID REFERENCES admin_users(id) ON DELETE SET NULL,
  admin_email TEXT,
  
  -- Action details
  action TEXT NOT NULL,
  action_category TEXT CHECK (action_category IN (
    'user_management',
    'content_management',
    'system_config',
    'data_export',
    'authentication',
    'other'
  )),
  
  -- Target
  target_type TEXT,
  target_id TEXT,
  target_name TEXT,
  
  -- Details
  metadata JSONB DEFAULT '{}',
  changes JSONB DEFAULT '{}',
  
  -- Request info
  ip_address INET,
  user_agent TEXT,
  request_path TEXT,
  
  -- Result
  status TEXT CHECK (status IN ('success', 'failure', 'pending')),
  error_message TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. ANNOUNCEMENTS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Content
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  action_url TEXT,
  action_label TEXT,
  
  -- Type and styling
  type TEXT CHECK (type IN ('info', 'warning', 'maintenance', 'feature', 'promotion')),
  priority INTEGER DEFAULT 0,
  dismissible BOOLEAN DEFAULT true,
  
  -- Targeting
  target_audience TEXT DEFAULT 'all',
  target_conditions JSONB DEFAULT '{}',
  
  -- Scheduling
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  dismiss_count INTEGER DEFAULT 0,
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. FEATURE FLAGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS feature_flags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Flag details
  flag_key TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT,
  
  -- State
  is_enabled BOOLEAN DEFAULT false,
  rollout_percentage INTEGER DEFAULT 0 CHECK (rollout_percentage >= 0 AND rollout_percentage <= 100),
  
  -- Targeting
  target_users TEXT[] DEFAULT '{}',
  target_conditions JSONB DEFAULT '{}',
  
  -- Metadata
  created_by UUID REFERENCES admin_users(id),
  updated_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 5. SUPPORT TICKETS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number TEXT NOT NULL UNIQUE,
  
  -- User
  user_id TEXT NOT NULL,
  user_email TEXT,
  
  -- Ticket details
  subject TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT CHECK (category IN ('bug', 'feature_request', 'account', 'billing', 'other')),
  priority TEXT CHECK (priority IN ('low', 'medium', 'high', 'urgent')) DEFAULT 'medium',
  
  -- Status
  status TEXT CHECK (status IN ('open', 'in_progress', 'waiting_user', 'resolved', 'closed')) DEFAULT 'open',
  
  -- Assignment
  assigned_to UUID REFERENCES admin_users(id),
  
  -- Resolution
  resolution_notes TEXT,
  resolved_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. ADMIN DASHBOARD METRICS CACHE
-- ============================================

CREATE TABLE IF NOT EXISTS admin_metrics_cache (
  id TEXT PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value JSONB NOT NULL,
  computed_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ
);

-- ============================================
-- 7. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_admin_users_user_id ON admin_users(user_id);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON admin_users(role);
CREATE INDEX IF NOT EXISTS idx_admin_users_active ON admin_users(is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_admin_audit_log_admin ON admin_audit_log(admin_user_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_target ON admin_audit_log(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON admin_audit_log(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active, starts_at, ends_at);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target_audience);

CREATE INDEX IF NOT EXISTS idx_feature_flags_key ON feature_flags(flag_key);
CREATE INDEX IF NOT EXISTS idx_feature_flags_enabled ON feature_flags(is_enabled);

CREATE INDEX IF NOT EXISTS idx_support_tickets_user ON support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned ON support_tickets(assigned_to);

-- ============================================
-- 8. TRIGGERS
-- ============================================

CREATE OR REPLACE FUNCTION update_admin_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS admin_users_updated ON admin_users;
CREATE TRIGGER admin_users_updated
  BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_admin_timestamp();

DROP TRIGGER IF EXISTS announcements_updated ON announcements;
CREATE TRIGGER announcements_updated
  BEFORE UPDATE ON announcements
  FOR EACH ROW EXECUTE FUNCTION update_admin_timestamp();

DROP TRIGGER IF EXISTS feature_flags_updated ON feature_flags;
CREATE TRIGGER feature_flags_updated
  BEFORE UPDATE ON feature_flags
  FOR EACH ROW EXECUTE FUNCTION update_admin_timestamp();

DROP TRIGGER IF EXISTS support_tickets_updated ON support_tickets;
CREATE TRIGGER support_tickets_updated
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION update_admin_timestamp();

-- ============================================
-- 9. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_metrics_cache ENABLE ROW LEVEL SECURITY;

-- Admin Users - Only super_admin can manage
CREATE POLICY "Service role full access to admin_users"
  ON admin_users FOR ALL
  TO service_role
  USING (true);

-- Audit Log - Service role only
CREATE POLICY "Service role full access to audit_log"
  ON admin_audit_log FOR ALL
  TO service_role
  USING (true);

-- Announcements - Admins can manage, everyone can read active
CREATE POLICY "Service role full access to announcements"
  ON announcements FOR ALL
  TO service_role
  USING (true);

CREATE POLICY "Public can read active announcements"
  ON announcements FOR SELECT
  USING (
    is_active = true 
    AND starts_at <= NOW() 
    AND (ends_at IS NULL OR ends_at > NOW())
  );

-- Feature Flags - Service role only
CREATE POLICY "Service role full access to feature_flags"
  ON feature_flags FOR ALL
  TO service_role
  USING (true);

-- Support Tickets - Service role manages
CREATE POLICY "Service role full access to support_tickets"
  ON support_tickets FOR ALL
  TO service_role
  USING (true);

-- Metrics Cache - Service role only
CREATE POLICY "Service role full access to metrics_cache"
  ON admin_metrics_cache FOR ALL
  TO service_role
  USING (true);

-- ============================================
-- 10. HELPER FUNCTIONS
-- ============================================

-- Generate ticket number
CREATE OR REPLACE FUNCTION generate_ticket_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.ticket_number = 'TKT-' || EXTRACT(YEAR FROM NOW())::TEXT || '-' || 
    LPAD(NEXTVAL('support_ticket_seq')::TEXT, 6, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS support_ticket_seq START 1;

DROP TRIGGER IF EXISTS set_ticket_number ON support_tickets;
CREATE TRIGGER set_ticket_number
  BEFORE INSERT ON support_tickets
  FOR EACH ROW EXECUTE FUNCTION generate_ticket_number();

-- ============================================
-- 11. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON admin_users TO service_role;
GRANT ALL ON admin_audit_log TO service_role;
GRANT ALL ON announcements TO service_role;
GRANT ALL ON feature_flags TO service_role;
GRANT ALL ON support_tickets TO service_role;
GRANT ALL ON admin_metrics_cache TO service_role;
GRANT USAGE, SELECT ON SEQUENCE support_ticket_seq TO service_role;

-- ============================================
-- 12. SEED INITIAL ADMIN (optional)
-- ============================================

-- Uncomment and modify to create your first admin:
-- INSERT INTO admin_users (user_id, email, display_name, role)
-- VALUES ('your_user_id', 'admin@bolehmakan.my', 'Admin', 'super_admin')
-- ON CONFLICT (user_id) DO NOTHING;

-- ============================================
-- 13. COMMENTS
-- ============================================

COMMENT ON TABLE admin_users IS 'Admin users with role-based access control';
COMMENT ON TABLE admin_audit_log IS 'Audit trail for all admin actions';
COMMENT ON TABLE announcements IS 'System announcements for users';
COMMENT ON TABLE feature_flags IS 'Feature flag management for gradual rollouts';
COMMENT ON TABLE support_tickets IS 'User support ticket tracking';
COMMENT ON TABLE admin_metrics_cache IS 'Cached dashboard metrics for performance';

