-- ============================================
-- 🌙 RAMADAN MODE - Database Schema Migration
-- ============================================
-- Boleh Makan - Malaysian Food Tracking App for Diabetics
-- Ramadan 2026: ~Feb 28 - Mar 29 (approximate)

-- ============================================
-- 1. RAMADAN SETTINGS TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ramadan_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  year INTEGER NOT NULL DEFAULT EXTRACT(YEAR FROM NOW()),
  
  -- Feature Toggle
  enabled BOOLEAN DEFAULT false,
  
  -- Location for prayer times
  location_lat DECIMAL(10, 8),
  location_lng DECIMAL(11, 8),
  location_name TEXT DEFAULT 'Kuala Lumpur',
  location_zone TEXT DEFAULT 'WLY01', -- JAKIM zone code
  
  -- Prayer time offsets (minutes)
  imsak_offset_minutes INTEGER DEFAULT -10, -- Before Subuh
  iftar_reminder_minutes INTEGER DEFAULT 15, -- Before Maghrib
  sahur_reminder_minutes INTEGER DEFAULT 30, -- Before Imsak
  
  -- Glucose targets during Ramadan (mmol/L)
  glucose_target_fasting DECIMAL(4,2) DEFAULT 5.5,
  glucose_target_post_iftar DECIMAL(4,2) DEFAULT 7.8,
  glucose_alert_low DECIMAL(4,2) DEFAULT 3.9,
  glucose_alert_high DECIMAL(4,2) DEFAULT 10.0,
  
  -- Notification preferences
  notifications_enabled BOOLEAN DEFAULT true,
  sahur_notification BOOLEAN DEFAULT true,
  iftar_notification BOOLEAN DEFAULT true,
  hydration_reminders BOOLEAN DEFAULT true,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, year)
);

-- ============================================
-- 2. RAMADAN DAILY LOG TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ramadan_daily_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  date DATE NOT NULL,
  fasting_day INTEGER CHECK (fasting_day BETWEEN 1 AND 30),
  
  -- Prayer times for this day (cached)
  imsak_time TIME,
  subuh_time TIME,
  maghrib_time TIME,
  isyak_time TIME,
  
  -- Sahur (pre-dawn meal)
  sahur_logged BOOLEAN DEFAULT false,
  sahur_time TIMESTAMPTZ,
  sahur_calories INTEGER,
  sahur_carbs DECIMAL(6,2),
  sahur_protein DECIMAL(6,2),
  sahur_fat DECIMAL(6,2),
  sahur_notes TEXT,
  
  -- Iftar (sunset meal)
  iftar_logged BOOLEAN DEFAULT false,
  iftar_time TIMESTAMPTZ,
  iftar_calories INTEGER,
  iftar_carbs DECIMAL(6,2),
  iftar_protein DECIMAL(6,2),
  iftar_fat DECIMAL(6,2),
  iftar_notes TEXT,
  
  -- Additional meals (post-Tarawih, etc.)
  additional_calories INTEGER DEFAULT 0,
  
  -- Fasting status
  fasting_completed BOOLEAN DEFAULT false,
  fasting_broken BOOLEAN DEFAULT false,
  fasting_broken_reason TEXT, -- 'medical', 'travel', 'illness', 'menstruation', 'other'
  fasting_broken_time TIMESTAMPTZ,
  
  -- Glucose tracking
  glucose_sahur DECIMAL(4,2), -- Reading at sahur
  glucose_midday DECIMAL(4,2), -- Midday check
  glucose_pre_iftar DECIMAL(4,2), -- Before breaking fast
  glucose_post_iftar DECIMAL(4,2), -- 2hr after iftar
  
  -- Daily summary
  total_calories INTEGER,
  water_intake_liters DECIMAL(3,2),
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 5),
  
  -- Notes
  notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Constraints
  UNIQUE(user_id, date)
);

-- ============================================
-- 3. QADA (REPLACEMENT FASTING) TRACKER
-- ============================================

CREATE TABLE IF NOT EXISTS ramadan_qada_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  ramadan_year INTEGER NOT NULL,
  
  -- Missed days from Ramadan
  missed_date DATE NOT NULL, -- Original date missed
  missed_reason TEXT, -- Why fast was missed
  
  -- Qada completion
  qada_completed BOOLEAN DEFAULT false,
  qada_date DATE, -- Date when qada was performed
  qada_notes TEXT,
  
  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, missed_date)
);

-- ============================================
-- 4. RAMADAN DATES REFERENCE TABLE
-- ============================================

CREATE TABLE IF NOT EXISTS ramadan_dates (
  id SERIAL PRIMARY KEY,
  year INTEGER NOT NULL UNIQUE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  eid_date DATE NOT NULL,
  source TEXT DEFAULT 'estimated',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert Ramadan dates for 2025-2027
INSERT INTO ramadan_dates (year, start_date, end_date, eid_date, source)
VALUES 
  (2025, '2025-03-01', '2025-03-30', '2025-03-31', 'estimated'),
  (2026, '2026-02-18', '2026-03-19', '2026-03-20', 'estimated'),
  (2027, '2027-02-07', '2027-03-08', '2027-03-09', 'estimated')
ON CONFLICT (year) DO UPDATE SET
  start_date = EXCLUDED.start_date,
  end_date = EXCLUDED.end_date,
  eid_date = EXCLUDED.eid_date;

-- ============================================
-- 5. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_ramadan_settings_user_year 
  ON ramadan_settings(user_id, year);

CREATE INDEX IF NOT EXISTS idx_ramadan_settings_enabled 
  ON ramadan_settings(enabled) WHERE enabled = true;

CREATE INDEX IF NOT EXISTS idx_ramadan_daily_log_user_date 
  ON ramadan_daily_log(user_id, date);

CREATE INDEX IF NOT EXISTS idx_ramadan_daily_log_date 
  ON ramadan_daily_log(date);

CREATE INDEX IF NOT EXISTS idx_ramadan_qada_user_year 
  ON ramadan_qada_log(user_id, ramadan_year);

-- ============================================
-- 6. UPDATED_AT TRIGGER
-- ============================================

CREATE OR REPLACE FUNCTION update_ramadan_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS ramadan_settings_updated ON ramadan_settings;
CREATE TRIGGER ramadan_settings_updated
  BEFORE UPDATE ON ramadan_settings
  FOR EACH ROW EXECUTE FUNCTION update_ramadan_timestamp();

DROP TRIGGER IF EXISTS ramadan_daily_log_updated ON ramadan_daily_log;
CREATE TRIGGER ramadan_daily_log_updated
  BEFORE UPDATE ON ramadan_daily_log
  FOR EACH ROW EXECUTE FUNCTION update_ramadan_timestamp();

-- ============================================
-- 7. ROW LEVEL SECURITY (RLS)
-- ============================================

ALTER TABLE ramadan_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_daily_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_qada_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ramadan_dates ENABLE ROW LEVEL SECURITY;

-- Ramadan Settings Policies
CREATE POLICY "Users can view own ramadan settings"
  ON ramadan_settings FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own ramadan settings"
  ON ramadan_settings FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own ramadan settings"
  ON ramadan_settings FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own ramadan settings"
  ON ramadan_settings FOR DELETE
  USING (user_id = current_setting('app.current_user_id', true));

-- Daily Log Policies
CREATE POLICY "Users can view own daily logs"
  ON ramadan_daily_log FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own daily logs"
  ON ramadan_daily_log FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own daily logs"
  ON ramadan_daily_log FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own daily logs"
  ON ramadan_daily_log FOR DELETE
  USING (user_id = current_setting('app.current_user_id', true));

-- Qada Log Policies
CREATE POLICY "Users can view own qada logs"
  ON ramadan_qada_log FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can manage own qada logs"
  ON ramadan_qada_log FOR ALL
  USING (user_id = current_setting('app.current_user_id', true));

-- Ramadan Dates - Public read
CREATE POLICY "Anyone can view ramadan dates"
  ON ramadan_dates FOR SELECT USING (true);

-- ============================================
-- 8. GRANT PERMISSIONS
-- ============================================

GRANT ALL ON ramadan_settings TO service_role;
GRANT ALL ON ramadan_daily_log TO service_role;
GRANT ALL ON ramadan_qada_log TO service_role;
GRANT SELECT ON ramadan_dates TO service_role;
GRANT USAGE, SELECT ON SEQUENCE ramadan_dates_id_seq TO service_role;

-- ============================================
-- 9. COMMENTS
-- ============================================

COMMENT ON TABLE ramadan_settings IS 'User preferences for Ramadan mode including location, notification settings, and glucose targets';
COMMENT ON TABLE ramadan_daily_log IS 'Daily fasting log tracking sahur, iftar meals, glucose readings, and fasting status';
COMMENT ON TABLE ramadan_qada_log IS 'Tracker for qada (replacement) fasting for days missed during Ramadan';
COMMENT ON TABLE ramadan_dates IS 'Reference table for Ramadan start/end dates by year';

