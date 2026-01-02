-- ============================================
-- 📊 CGM WAITLIST - Database Schema Migration
-- ============================================
-- Boleh Makan - Malaysian Food Tracking App for Diabetics
-- CGM Integration waitlist to gauge demand and collect early adopters

-- ============================================
-- 1. CGM WAITLIST SIGNUPS
-- ============================================

CREATE TABLE IF NOT EXISTS cgm_waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT, -- Can be NULL for email-only signups
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  
  -- Contact info (for non-logged-in users)
  email TEXT NOT NULL,
  name TEXT,
  
  -- Device information
  current_device TEXT CHECK (current_device IN (
    'freestyle_libre_1',
    'freestyle_libre_2', 
    'freestyle_libre_3',
    'dexcom_g6',
    'dexcom_g7',
    'medtronic_guardian',
    'senseonics_eversense',
    'other',
    'none_planning_to_buy',
    'none_interested'
  )),
  other_device_name TEXT, -- if 'other' selected
  
  -- Usage patterns
  usage_frequency TEXT CHECK (usage_frequency IN (
    'daily_always',      -- wear CGM continuously
    'daily_sometimes',   -- wear during certain periods
    'weekly',            -- spot check usage
    'monthly',           -- occasional use
    'not_yet'            -- planning to start
  )),
  
  -- Purchase intent
  willing_to_pay BOOLEAN DEFAULT false,
  price_sensitivity TEXT CHECK (price_sensitivity IN (
    'any_price',         -- will pay for value
    'under_30_myr',      -- budget conscious
    'under_50_myr',
    'free_only'
  )),
  
  -- Integration preferences
  desired_features JSONB DEFAULT '[]'::jsonb,
  -- ['auto_sync', 'glucose_predictions', 'meal_correlation', 'alerts', 'sharing_with_doctor']
  
  -- Contact preferences
  email_updates BOOLEAN DEFAULT true,
  whatsapp_updates BOOLEAN DEFAULT false,
  phone_number TEXT, -- for WhatsApp, optional
  
  -- Referral tracking
  referral_source TEXT, -- 'in_app', 'social', 'doctor', 'friend', 'search', etc.
  referral_code TEXT UNIQUE, -- User's own referral code
  referred_by TEXT, -- Referral code used to sign up
  referral_count INTEGER DEFAULT 0, -- Number of successful referrals
  
  -- Queue position
  queue_position INTEGER,
  queue_boost INTEGER DEFAULT 0, -- Bonus from referrals, activity, etc.
  
  -- Status
  status TEXT DEFAULT 'waiting' CHECK (status IN (
    'waiting',
    'beta_invited',
    'beta_active',
    'converted',
    'unsubscribed'
  )),
  beta_invited_at TIMESTAMPTZ,
  beta_joined_at TIMESTAMPTZ,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(email),
  UNIQUE(user_id)
);

-- ============================================
-- 2. CGM WAITLIST EVENTS (Analytics)
-- ============================================

CREATE TABLE IF NOT EXISTS cgm_waitlist_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  waitlist_id UUID REFERENCES cgm_waitlist(id) ON DELETE CASCADE,
  
  -- Event details
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signed_up',
    'updated_preferences',
    'beta_invited',
    'beta_accepted',
    'clicked_email',
    'shared_referral',
    'referral_converted',
    'unsubscribed',
    'page_view',
    'step_completed'
  )),
  
  -- Additional data
  metadata JSONB DEFAULT '{}'::jsonb,
  -- e.g., { "step": 2, "source": "dashboard" } for step_completed
  
  -- Request info
  ip_address INET,
  user_agent TEXT,
  
  -- Timestamp
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. CGM CONNECTIONS (Future Integration)
-- ============================================

CREATE TABLE IF NOT EXISTS cgm_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  
  -- Provider info
  provider TEXT NOT NULL CHECK (provider IN (
    'libreview',
    'dexcom_clarity',
    'medtronic_carelink',
    'senseonics',
    'nightscout',
    'tidepool'
  )),
  provider_user_id TEXT, -- ID from the provider system
  
  -- OAuth tokens (encrypted)
  access_token_encrypted TEXT,
  refresh_token_encrypted TEXT,
  token_expires_at TIMESTAMPTZ,
  
  -- Sync status
  last_sync_at TIMESTAMPTZ,
  last_sync_status TEXT CHECK (last_sync_status IN ('success', 'failed', 'partial')),
  last_sync_error TEXT,
  readings_synced INTEGER DEFAULT 0,
  
  -- Connection status
  status TEXT DEFAULT 'pending' CHECK (status IN (
    'pending',
    'connected',
    'disconnected',
    'expired',
    'error'
  )),
  
  -- Settings
  auto_sync_enabled BOOLEAN DEFAULT true,
  sync_frequency_hours INTEGER DEFAULT 1,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, provider)
);

-- ============================================
-- 4. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_user ON cgm_waitlist(user_id);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_email ON cgm_waitlist(email);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_status ON cgm_waitlist(status);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_device ON cgm_waitlist(current_device);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_referral_code ON cgm_waitlist(referral_code);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_referred_by ON cgm_waitlist(referred_by);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_tenant ON cgm_waitlist(tenant_id);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_queue ON cgm_waitlist(queue_position, queue_boost);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_created ON cgm_waitlist(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_events_waitlist ON cgm_waitlist_events(waitlist_id);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_events_type ON cgm_waitlist_events(event_type);
CREATE INDEX IF NOT EXISTS idx_cgm_waitlist_events_created ON cgm_waitlist_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_cgm_connections_user ON cgm_connections(user_id);
CREATE INDEX IF NOT EXISTS idx_cgm_connections_provider ON cgm_connections(provider);
CREATE INDEX IF NOT EXISTS idx_cgm_connections_status ON cgm_connections(status);

-- ============================================
-- 5. HELPER FUNCTIONS
-- ============================================

-- Generate unique referral code
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INTEGER;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::INTEGER, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Assign queue position on insert
CREATE OR REPLACE FUNCTION assign_queue_position()
RETURNS TRIGGER AS $$
BEGIN
  -- Get the next queue position
  SELECT COALESCE(MAX(queue_position), 0) + 1 INTO NEW.queue_position
  FROM cgm_waitlist
  WHERE tenant_id = NEW.tenant_id;
  
  -- Generate referral code if not provided
  IF NEW.referral_code IS NULL THEN
    LOOP
      NEW.referral_code := generate_referral_code();
      -- Check uniqueness
      EXIT WHEN NOT EXISTS (SELECT 1 FROM cgm_waitlist WHERE referral_code = NEW.referral_code);
    END LOOP;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cgm_waitlist_assign_position ON cgm_waitlist;
CREATE TRIGGER cgm_waitlist_assign_position
  BEFORE INSERT ON cgm_waitlist
  FOR EACH ROW EXECUTE FUNCTION assign_queue_position();

-- Increment referral count when someone uses a referral code
CREATE OR REPLACE FUNCTION process_referral()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referred_by IS NOT NULL THEN
    UPDATE cgm_waitlist
    SET 
      referral_count = referral_count + 1,
      queue_boost = queue_boost + 5, -- Boost by 5 positions per referral
      updated_at = NOW()
    WHERE referral_code = NEW.referred_by;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cgm_waitlist_process_referral ON cgm_waitlist;
CREATE TRIGGER cgm_waitlist_process_referral
  AFTER INSERT ON cgm_waitlist
  FOR EACH ROW EXECUTE FUNCTION process_referral();

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_cgm_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS cgm_waitlist_updated ON cgm_waitlist;
CREATE TRIGGER cgm_waitlist_updated
  BEFORE UPDATE ON cgm_waitlist
  FOR EACH ROW EXECUTE FUNCTION update_cgm_timestamp();

DROP TRIGGER IF EXISTS cgm_connections_updated ON cgm_connections;
CREATE TRIGGER cgm_connections_updated
  BEFORE UPDATE ON cgm_connections
  FOR EACH ROW EXECUTE FUNCTION update_cgm_timestamp();

-- Get effective queue position (base position minus boosts)
CREATE OR REPLACE FUNCTION get_effective_queue_position(waitlist_row cgm_waitlist)
RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, waitlist_row.queue_position - waitlist_row.queue_boost);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE cgm_waitlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE cgm_waitlist_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE cgm_connections ENABLE ROW LEVEL SECURITY;

-- CGM Waitlist - Service role can do everything
CREATE POLICY "Service role full access to cgm_waitlist"
  ON cgm_waitlist FOR ALL
  TO service_role
  USING (true);

-- Users can view their own waitlist entry
CREATE POLICY "Users can view own waitlist entry"
  ON cgm_waitlist FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

-- CGM Waitlist Events - Service role only
CREATE POLICY "Service role full access to cgm_waitlist_events"
  ON cgm_waitlist_events FOR ALL
  TO service_role
  USING (true);

-- CGM Connections - Service role manages
CREATE POLICY "Service role full access to cgm_connections"
  ON cgm_connections FOR ALL
  TO service_role
  USING (true);

-- Users can view their own connections
CREATE POLICY "Users can view own cgm connections"
  ON cgm_connections FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

-- ============================================
-- 7. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON cgm_waitlist TO service_role;
GRANT ALL ON cgm_waitlist_events TO service_role;
GRANT ALL ON cgm_connections TO service_role;

GRANT EXECUTE ON FUNCTION generate_referral_code TO service_role;
GRANT EXECUTE ON FUNCTION get_effective_queue_position TO service_role;

-- ============================================
-- 8. COMMENTS
-- ============================================

COMMENT ON TABLE cgm_waitlist IS 'CGM integration waitlist signups with device preferences and referral tracking';
COMMENT ON TABLE cgm_waitlist_events IS 'Analytics events for CGM waitlist (signups, clicks, conversions)';
COMMENT ON TABLE cgm_connections IS 'OAuth connections to CGM providers (FreeStyle LibreView, Dexcom Clarity, etc.)';

COMMENT ON COLUMN cgm_waitlist.queue_boost IS 'Bonus positions from referrals and activity. Effective position = queue_position - queue_boost';
COMMENT ON COLUMN cgm_waitlist.referral_code IS 'Unique code this user can share to refer others';
COMMENT ON COLUMN cgm_waitlist.referred_by IS 'Referral code used when signing up';


