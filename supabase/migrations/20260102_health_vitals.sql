-- ============================================
-- 💓 HEALTH VITALS LOGGING - Database Migration
-- ============================================
-- Boleh Makan - Malaysian Food Tracking App for Diabetics
-- Simple vitals tracking for BP, weight, glucose, and lab results

-- ============================================
-- 1. VITALS LOG TABLE (Unified)
-- ============================================

CREATE TABLE IF NOT EXISTS vitals_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Blood Pressure
  systolic_bp INTEGER CHECK (systolic_bp IS NULL OR systolic_bp BETWEEN 60 AND 250),
  diastolic_bp INTEGER CHECK (diastolic_bp IS NULL OR diastolic_bp BETWEEN 40 AND 150),
  pulse INTEGER CHECK (pulse IS NULL OR pulse BETWEEN 30 AND 220),
  bp_arm TEXT CHECK (bp_arm IS NULL OR bp_arm IN ('left', 'right')),
  bp_position TEXT CHECK (bp_position IS NULL OR bp_position IN ('sitting', 'standing', 'lying')),
  
  -- Weight & Body Composition
  weight_kg DECIMAL(5,2) CHECK (weight_kg IS NULL OR weight_kg BETWEEN 20 AND 300),
  body_fat_percent DECIMAL(4,1) CHECK (body_fat_percent IS NULL OR body_fat_percent BETWEEN 1 AND 60),
  waist_cm DECIMAL(5,1) CHECK (waist_cm IS NULL OR waist_cm BETWEEN 40 AND 200),
  
  -- Blood Glucose (manual entry for non-CGM users)
  glucose_mmol DECIMAL(4,1) CHECK (glucose_mmol IS NULL OR glucose_mmol BETWEEN 1 AND 35),
  glucose_timing TEXT CHECK (glucose_timing IS NULL OR glucose_timing IN ('fasting', 'before_meal', 'after_meal', 'bedtime', 'random')),
  
  -- Lab Results (from clinic visits)
  hba1c_percent DECIMAL(3,1) CHECK (hba1c_percent IS NULL OR hba1c_percent BETWEEN 3 AND 18),
  total_cholesterol_mmol DECIMAL(4,2) CHECK (total_cholesterol_mmol IS NULL OR total_cholesterol_mmol BETWEEN 1 AND 15),
  ldl_mmol DECIMAL(4,2) CHECK (ldl_mmol IS NULL OR ldl_mmol BETWEEN 0.5 AND 10),
  hdl_mmol DECIMAL(4,2) CHECK (hdl_mmol IS NULL OR hdl_mmol BETWEEN 0.3 AND 5),
  triglycerides_mmol DECIMAL(4,2) CHECK (triglycerides_mmol IS NULL OR triglycerides_mmol BETWEEN 0.3 AND 15),
  egfr DECIMAL(5,1) CHECK (egfr IS NULL OR egfr BETWEEN 5 AND 150),
  uric_acid_umol INTEGER CHECK (uric_acid_umol IS NULL OR uric_acid_umol BETWEEN 100 AND 900),
  creatinine_umol INTEGER CHECK (creatinine_umol IS NULL OR creatinine_umol BETWEEN 20 AND 1500),
  
  -- Metadata
  source TEXT DEFAULT 'manual' CHECK (source IN ('manual', 'device_sync', 'lab_import', 'cgm')),
  notes TEXT,
  lab_date DATE,
  lab_provider TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. USER VITAL TARGETS
-- ============================================

CREATE TABLE IF NOT EXISTS user_vital_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  
  -- BP targets
  target_systolic_max INTEGER DEFAULT 130,
  target_diastolic_max INTEGER DEFAULT 80,
  
  -- Glucose targets (mmol/L)
  target_fasting_glucose_min DECIMAL(4,1) DEFAULT 4.0,
  target_fasting_glucose_max DECIMAL(4,1) DEFAULT 7.0,
  target_postmeal_glucose_max DECIMAL(4,1) DEFAULT 10.0,
  target_hba1c_max DECIMAL(3,1) DEFAULT 7.0,
  
  -- Lipid targets (mmol/L)
  target_total_cholesterol_max DECIMAL(4,2) DEFAULT 5.2,
  target_ldl_max DECIMAL(4,2) DEFAULT 2.6,
  target_hdl_min DECIMAL(4,2) DEFAULT 1.0,
  target_triglycerides_max DECIMAL(4,2) DEFAULT 1.7,
  
  -- Weight targets
  target_weight_kg DECIMAL(5,2),
  target_bmi_max DECIMAL(3,1) DEFAULT 25.0,
  
  -- Kidney targets
  target_egfr_min DECIMAL(5,1) DEFAULT 60,
  target_uric_acid_max INTEGER DEFAULT 420, -- umol/L (men), adjust for women
  
  -- Metadata
  set_by TEXT DEFAULT 'self' CHECK (set_by IN ('self', 'doctor', 'system')),
  doctor_name TEXT,
  notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id)
);

-- ============================================
-- 3. INDEXES
-- ============================================

-- Main queries: user's vitals by date
CREATE INDEX IF NOT EXISTS idx_vitals_user_date ON vitals_log(user_id, recorded_at DESC);

-- BP entries
CREATE INDEX IF NOT EXISTS idx_vitals_user_bp ON vitals_log(user_id, recorded_at DESC) 
  WHERE systolic_bp IS NOT NULL;

-- Weight entries
CREATE INDEX IF NOT EXISTS idx_vitals_user_weight ON vitals_log(user_id, recorded_at DESC)
  WHERE weight_kg IS NOT NULL;

-- Glucose entries
CREATE INDEX IF NOT EXISTS idx_vitals_user_glucose ON vitals_log(user_id, recorded_at DESC)
  WHERE glucose_mmol IS NOT NULL;

-- Lab entries (HbA1c)
CREATE INDEX IF NOT EXISTS idx_vitals_user_hba1c ON vitals_log(user_id, recorded_at DESC)
  WHERE hba1c_percent IS NOT NULL;

-- Tenant filter
CREATE INDEX IF NOT EXISTS idx_vitals_tenant ON vitals_log(tenant_id);
CREATE INDEX IF NOT EXISTS idx_vital_targets_user ON user_vital_targets(user_id);

-- ============================================
-- 4. HELPER FUNCTIONS
-- ============================================

-- Get latest BP reading for user
CREATE OR REPLACE FUNCTION get_latest_bp(p_user_id TEXT)
RETURNS TABLE (
  systolic INTEGER,
  diastolic INTEGER,
  pulse INTEGER,
  recorded_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT v.systolic_bp, v.diastolic_bp, v.pulse, v.recorded_at
  FROM vitals_log v
  WHERE v.user_id = p_user_id 
    AND v.systolic_bp IS NOT NULL
  ORDER BY v.recorded_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get latest weight for user
CREATE OR REPLACE FUNCTION get_latest_weight(p_user_id TEXT)
RETURNS TABLE (
  weight_kg DECIMAL(5,2),
  body_fat_percent DECIMAL(4,1),
  waist_cm DECIMAL(5,1),
  recorded_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT v.weight_kg, v.body_fat_percent, v.waist_cm, v.recorded_at
  FROM vitals_log v
  WHERE v.user_id = p_user_id 
    AND v.weight_kg IS NOT NULL
  ORDER BY v.recorded_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get latest glucose for user
CREATE OR REPLACE FUNCTION get_latest_glucose(p_user_id TEXT)
RETURNS TABLE (
  glucose_mmol DECIMAL(4,1),
  glucose_timing TEXT,
  recorded_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT v.glucose_mmol, v.glucose_timing, v.recorded_at
  FROM vitals_log v
  WHERE v.user_id = p_user_id 
    AND v.glucose_mmol IS NOT NULL
  ORDER BY v.recorded_at DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get latest labs for user
CREATE OR REPLACE FUNCTION get_latest_labs(p_user_id TEXT)
RETURNS TABLE (
  hba1c_percent DECIMAL(3,1),
  total_cholesterol_mmol DECIMAL(4,2),
  ldl_mmol DECIMAL(4,2),
  hdl_mmol DECIMAL(4,2),
  triglycerides_mmol DECIMAL(4,2),
  egfr DECIMAL(5,1),
  uric_acid_umol INTEGER,
  creatinine_umol INTEGER,
  lab_date DATE,
  lab_provider TEXT,
  recorded_at TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    v.hba1c_percent, v.total_cholesterol_mmol, v.ldl_mmol, v.hdl_mmol,
    v.triglycerides_mmol, v.egfr, v.uric_acid_umol, v.creatinine_umol,
    v.lab_date, v.lab_provider, v.recorded_at
  FROM vitals_log v
  WHERE v.user_id = p_user_id 
    AND (v.hba1c_percent IS NOT NULL OR v.ldl_mmol IS NOT NULL OR v.egfr IS NOT NULL)
  ORDER BY COALESCE(v.lab_date, v.recorded_at::DATE) DESC
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get all latest vitals summary
CREATE OR REPLACE FUNCTION get_user_vitals_summary(p_user_id TEXT)
RETURNS JSONB AS $$
DECLARE
  result JSONB := '{}'::jsonb;
  bp_row RECORD;
  weight_row RECORD;
  glucose_row RECORD;
  labs_row RECORD;
BEGIN
  -- Get latest BP
  SELECT * INTO bp_row FROM get_latest_bp(p_user_id);
  IF FOUND THEN
    result := result || jsonb_build_object(
      'bp', jsonb_build_object(
        'systolic', bp_row.systolic,
        'diastolic', bp_row.diastolic,
        'pulse', bp_row.pulse,
        'recordedAt', bp_row.recorded_at
      )
    );
  END IF;
  
  -- Get latest weight
  SELECT * INTO weight_row FROM get_latest_weight(p_user_id);
  IF FOUND THEN
    result := result || jsonb_build_object(
      'weight', jsonb_build_object(
        'weightKg', weight_row.weight_kg,
        'bodyFatPercent', weight_row.body_fat_percent,
        'waistCm', weight_row.waist_cm,
        'recordedAt', weight_row.recorded_at
      )
    );
  END IF;
  
  -- Get latest glucose
  SELECT * INTO glucose_row FROM get_latest_glucose(p_user_id);
  IF FOUND THEN
    result := result || jsonb_build_object(
      'glucose', jsonb_build_object(
        'glucoseMmol', glucose_row.glucose_mmol,
        'timing', glucose_row.glucose_timing,
        'recordedAt', glucose_row.recorded_at
      )
    );
  END IF;
  
  -- Get latest labs
  SELECT * INTO labs_row FROM get_latest_labs(p_user_id);
  IF FOUND THEN
    result := result || jsonb_build_object(
      'labs', jsonb_build_object(
        'hba1cPercent', labs_row.hba1c_percent,
        'ldlMmol', labs_row.ldl_mmol,
        'hdlMmol', labs_row.hdl_mmol,
        'triglyceridesMmol', labs_row.triglycerides_mmol,
        'egfr', labs_row.egfr,
        'labDate', labs_row.lab_date,
        'labProvider', labs_row.lab_provider,
        'recordedAt', labs_row.recorded_at
      )
    );
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 5. TRIGGERS
-- ============================================

-- Update timestamp
CREATE OR REPLACE FUNCTION update_vitals_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS vitals_log_updated ON vitals_log;
CREATE TRIGGER vitals_log_updated
  BEFORE UPDATE ON vitals_log
  FOR EACH ROW EXECUTE FUNCTION update_vitals_timestamp();

DROP TRIGGER IF EXISTS user_vital_targets_updated ON user_vital_targets;
CREATE TRIGGER user_vital_targets_updated
  BEFORE UPDATE ON user_vital_targets
  FOR EACH ROW EXECUTE FUNCTION update_vitals_timestamp();

-- ============================================
-- 6. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE vitals_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_vital_targets ENABLE ROW LEVEL SECURITY;

-- Service role access
CREATE POLICY "Service role full access to vitals_log"
  ON vitals_log FOR ALL TO service_role USING (true);

CREATE POLICY "Service role full access to user_vital_targets"
  ON user_vital_targets FOR ALL TO service_role USING (true);

-- Users can manage their own vitals
CREATE POLICY "Users can view own vitals"
  ON vitals_log FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert own vitals"
  ON vitals_log FOR INSERT
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update own vitals"
  ON vitals_log FOR UPDATE
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete own vitals"
  ON vitals_log FOR DELETE
  USING (user_id = current_setting('app.current_user_id', true));

-- Users can manage their own targets
CREATE POLICY "Users can view own vital targets"
  ON user_vital_targets FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can manage own vital targets"
  ON user_vital_targets FOR ALL
  USING (user_id = current_setting('app.current_user_id', true));

-- ============================================
-- 7. GRANTS
-- ============================================

GRANT ALL ON vitals_log TO service_role;
GRANT ALL ON user_vital_targets TO service_role;

GRANT EXECUTE ON FUNCTION get_latest_bp TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION get_latest_weight TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION get_latest_glucose TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION get_latest_labs TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION get_user_vitals_summary TO service_role, authenticated;

-- ============================================
-- 8. COMMENTS
-- ============================================

COMMENT ON TABLE vitals_log IS 'Unified vitals logging table for BP, weight, glucose, and lab results';
COMMENT ON TABLE user_vital_targets IS 'Personal or doctor-set targets for various health metrics';

COMMENT ON FUNCTION get_latest_bp IS 'Get most recent blood pressure reading for a user';
COMMENT ON FUNCTION get_latest_weight IS 'Get most recent weight measurement for a user';
COMMENT ON FUNCTION get_latest_glucose IS 'Get most recent glucose reading for a user';
COMMENT ON FUNCTION get_latest_labs IS 'Get most recent lab results for a user';
COMMENT ON FUNCTION get_user_vitals_summary IS 'Get complete latest vitals summary as JSON';


