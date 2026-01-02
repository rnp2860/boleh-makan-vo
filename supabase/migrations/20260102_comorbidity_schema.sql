-- ============================================
-- 🏥 COMORBIDITY-AWARE SCHEMA - Database Migration
-- ============================================
-- Boleh Makan - Malaysian Food Tracking App for Diabetics
-- Foundation for supporting multiple health conditions (diabetes, hypertension, CKD, etc.)

-- ============================================
-- 1. CONDITION TYPES (System Reference Table)
-- ============================================

CREATE TABLE IF NOT EXISTS condition_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL, -- 'diabetes_t1', 'diabetes_t2', 'hypertension', 'ckd', etc.
  name TEXT NOT NULL,
  name_ms TEXT NOT NULL, -- Malay translation
  category TEXT CHECK (category IN ('metabolic', 'cardiovascular', 'renal', 'other')),
  description TEXT,
  description_ms TEXT,
  icon TEXT, -- lucide icon name
  color TEXT, -- hex color for UI badges
  is_active BOOLEAN DEFAULT true, -- feature flag for rollout
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed condition types
INSERT INTO condition_types (code, name, name_ms, category, description, description_ms, icon, color, display_order) VALUES
  ('diabetes_t1', 'Type 1 Diabetes', 'Diabetes Jenis 1', 'metabolic', 
   'Autoimmune condition where the pancreas produces little or no insulin',
   'Keadaan autoimun di mana pankreas menghasilkan sedikit atau tiada insulin',
   'droplet', '#EF4444', 1),
  ('diabetes_t2', 'Type 2 Diabetes', 'Diabetes Jenis 2', 'metabolic',
   'Condition where the body becomes resistant to insulin or doesn''t produce enough',
   'Keadaan di mana badan menjadi rintangan terhadap insulin atau tidak menghasilkan cukup',
   'droplet', '#F97316', 2),
  ('prediabetes', 'Prediabetes', 'Pradiabetes', 'metabolic',
   'Blood sugar levels higher than normal but not yet diabetes',
   'Paras gula darah lebih tinggi daripada normal tetapi belum diabetes',
   'alert-circle', '#FBBF24', 3),
  ('gestational_diabetes', 'Gestational Diabetes', 'Diabetes Semasa Mengandung', 'metabolic',
   'Diabetes that develops during pregnancy',
   'Diabetes yang berkembang semasa mengandung',
   'baby', '#EC4899', 4),
  ('hypertension', 'Hypertension', 'Darah Tinggi', 'cardiovascular',
   'High blood pressure that increases risk of heart disease and stroke',
   'Tekanan darah tinggi yang meningkatkan risiko penyakit jantung dan strok',
   'heart-pulse', '#8B5CF6', 5),
  ('dyslipidemia', 'High Cholesterol', 'Kolesterol Tinggi', 'cardiovascular',
   'Abnormal levels of lipids (fats) in the blood',
   'Paras lipid (lemak) yang tidak normal dalam darah',
   'activity', '#6366F1', 6),
  ('ckd_stage1', 'CKD Stage 1', 'CKD Peringkat 1', 'renal',
   'Kidney damage with normal kidney function (eGFR ≥90)',
   'Kerosakan buah pinggang dengan fungsi normal (eGFR ≥90)',
   'filter', '#14B8A6', 7),
  ('ckd_stage2', 'CKD Stage 2', 'CKD Peringkat 2', 'renal',
   'Mild loss of kidney function (eGFR 60-89)',
   'Kehilangan fungsi buah pinggang ringan (eGFR 60-89)',
   'filter', '#14B8A6', 8),
  ('ckd_stage3a', 'CKD Stage 3a', 'CKD Peringkat 3a', 'renal',
   'Mild to moderate loss of kidney function (eGFR 45-59)',
   'Kehilangan fungsi buah pinggang ringan hingga sederhana (eGFR 45-59)',
   'filter', '#F59E0B', 9),
  ('ckd_stage3b', 'CKD Stage 3b', 'CKD Peringkat 3b', 'renal',
   'Moderate to severe loss of kidney function (eGFR 30-44)',
   'Kehilangan fungsi buah pinggang sederhana hingga teruk (eGFR 30-44)',
   'filter', '#F59E0B', 10),
  ('ckd_stage4', 'CKD Stage 4', 'CKD Peringkat 4', 'renal',
   'Severe loss of kidney function (eGFR 15-29)',
   'Kehilangan fungsi buah pinggang yang teruk (eGFR 15-29)',
   'filter', '#EF4444', 11),
  ('ckd_stage5', 'CKD Stage 5 / Dialysis', 'CKD Peringkat 5 / Dialisis', 'renal',
   'Kidney failure requiring dialysis or transplant (eGFR <15)',
   'Kegagalan buah pinggang memerlukan dialisis atau pemindahan (eGFR <15)',
   'filter', '#DC2626', 12),
  ('obesity', 'Obesity', 'Obesiti', 'metabolic',
   'Excess body fat that increases health risks',
   'Lemak badan berlebihan yang meningkatkan risiko kesihatan',
   'scale', '#78716C', 13),
  ('nafld', 'Fatty Liver (NAFLD)', 'Hati Berlemak (NAFLD)', 'metabolic',
   'Fat buildup in the liver not caused by alcohol',
   'Pengumpulan lemak dalam hati bukan disebabkan oleh alkohol',
   'liver', '#A855F7', 14),
  ('gout', 'Gout', 'Gout', 'metabolic',
   'Painful arthritis caused by uric acid crystal buildup',
   'Artritis yang menyakitkan disebabkan oleh pengumpulan kristal asid urik',
   'bone', '#0EA5E9', 15),
  ('heart_disease', 'Heart Disease', 'Penyakit Jantung', 'cardiovascular',
   'Coronary artery disease or history of heart attack',
   'Penyakit arteri koronari atau sejarah serangan jantung',
   'heart', '#EF4444', 16),
  ('stroke_history', 'Stroke History', 'Sejarah Strok', 'cardiovascular',
   'Previous stroke or transient ischemic attack (TIA)',
   'Strok sebelumnya atau serangan iskemia sementara (TIA)',
   'brain', '#DC2626', 17)
ON CONFLICT (code) DO UPDATE SET
  name = EXCLUDED.name,
  name_ms = EXCLUDED.name_ms,
  category = EXCLUDED.category,
  description = EXCLUDED.description,
  description_ms = EXCLUDED.description_ms,
  icon = EXCLUDED.icon,
  color = EXCLUDED.color,
  display_order = EXCLUDED.display_order;

-- ============================================
-- 2. USER CONDITIONS (Many-to-Many)
-- ============================================

CREATE TABLE IF NOT EXISTS user_conditions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  condition_code TEXT REFERENCES condition_types(code) ON DELETE CASCADE,
  
  -- Condition-specific metadata
  diagnosed_date DATE,
  severity TEXT CHECK (severity IN ('mild', 'moderate', 'severe', 'controlled', 'uncontrolled')),
  on_medication BOOLEAN DEFAULT false,
  medication_names TEXT[], -- Array of medication names
  medication_notes TEXT,
  managing_doctor TEXT,
  hospital_clinic TEXT,
  
  -- Status
  is_primary BOOLEAN DEFAULT false, -- primary condition for AI focus
  is_active BOOLEAN DEFAULT true, -- can mark as resolved/managed
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, condition_code)
);

-- ============================================
-- 3. CONDITION NUTRIENT TARGETS (System Reference)
-- ============================================

CREATE TABLE IF NOT EXISTS condition_nutrient_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  condition_code TEXT REFERENCES condition_types(code) ON DELETE CASCADE,
  nutrient_code TEXT NOT NULL, -- 'sodium', 'potassium', 'phosphorus', 'protein', etc.
  
  -- Target values (daily)
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  unit TEXT NOT NULL, -- 'mg', 'g', 'mmol', 'g/kg'
  
  -- For weight-based calculations
  is_per_kg_body_weight BOOLEAN DEFAULT false, -- if true, max_value is per kg
  
  -- Priority for this condition
  priority TEXT CHECK (priority IN ('critical', 'important', 'moderate', 'minor')) DEFAULT 'moderate',
  
  -- Guidance text
  guidance TEXT,
  guidance_ms TEXT,
  
  -- Source reference
  source_reference TEXT, -- e.g., "Malaysian Dietary Guidelines 2020"
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(condition_code, nutrient_code)
);

-- Seed nutrient targets
INSERT INTO condition_nutrient_targets (condition_code, nutrient_code, min_value, max_value, unit, priority, guidance, guidance_ms, source_reference) VALUES
  -- Type 2 Diabetes targets
  ('diabetes_t2', 'carbs', NULL, 200, 'g', 'critical', 
   'Limit carbohydrates to help manage blood glucose levels',
   'Hadkan karbohidrat untuk membantu mengawal paras glukosa darah',
   'ADA Standards of Care 2024'),
  ('diabetes_t2', 'sugar', NULL, 25, 'g', 'critical',
   'Minimize added sugars to prevent glucose spikes',
   'Kurangkan gula tambahan untuk mencegah lonjakan glukosa',
   'WHO Guidelines'),
  ('diabetes_t2', 'fiber', 25, NULL, 'g', 'important',
   'High fiber helps stabilize blood glucose',
   'Serat tinggi membantu menstabilkan glukosa darah',
   'ADA Standards of Care 2024'),
  ('diabetes_t2', 'saturated_fat', NULL, 20, 'g', 'moderate',
   'Limit saturated fat to reduce cardiovascular risk',
   'Hadkan lemak tepu untuk mengurangkan risiko kardiovaskular',
   'ADA Standards of Care 2024'),
   
  -- Type 1 Diabetes targets
  ('diabetes_t1', 'carbs', NULL, 250, 'g', 'critical',
   'Count carbohydrates accurately for insulin dosing',
   'Kira karbohidrat dengan tepat untuk dos insulin',
   'ADA Standards of Care 2024'),
  ('diabetes_t1', 'sugar', NULL, 25, 'g', 'critical',
   'Minimize added sugars to prevent glucose spikes',
   'Kurangkan gula tambahan untuk mencegah lonjakan glukosa',
   'WHO Guidelines'),
  ('diabetes_t1', 'fiber', 25, NULL, 'g', 'important',
   'Fiber helps slow glucose absorption',
   'Serat membantu melambatkan penyerapan glukosa',
   'ADA Standards of Care 2024'),
   
  -- Prediabetes targets
  ('prediabetes', 'carbs', NULL, 180, 'g', 'important',
   'Moderate carbohydrate intake to prevent progression to diabetes',
   'Pengambilan karbohidrat sederhana untuk mencegah perkembangan ke diabetes',
   'ADA Standards of Care 2024'),
  ('prediabetes', 'sugar', NULL, 25, 'g', 'critical',
   'Minimize added sugars',
   'Kurangkan gula tambahan',
   'WHO Guidelines'),
  ('prediabetes', 'fiber', 25, NULL, 'g', 'important',
   'Increase fiber intake to improve insulin sensitivity',
   'Tingkatkan pengambilan serat untuk meningkatkan sensitiviti insulin',
   'ADA Standards of Care 2024'),
   
  -- Hypertension targets
  ('hypertension', 'sodium', NULL, 2000, 'mg', 'critical',
   'Limit sodium intake to help lower blood pressure',
   'Hadkan pengambilan natrium untuk membantu menurunkan tekanan darah',
   'Malaysian CPG HTN 2018'),
  ('hypertension', 'potassium', 3500, 4700, 'mg', 'important',
   'Adequate potassium helps counteract sodium and lower BP',
   'Kalium yang mencukupi membantu menentang natrium dan menurunkan BP',
   'DASH Diet Guidelines'),
  ('hypertension', 'saturated_fat', NULL, 15, 'g', 'moderate',
   'Limit saturated fat for overall heart health',
   'Hadkan lemak tepu untuk kesihatan jantung keseluruhan',
   'Malaysian CPG HTN 2018'),
   
  -- Dyslipidemia (High Cholesterol) targets
  ('dyslipidemia', 'saturated_fat', NULL, 13, 'g', 'critical',
   'Limit saturated fat to help lower LDL cholesterol',
   'Hadkan lemak tepu untuk membantu menurunkan kolesterol LDL',
   'Malaysian CPG Dyslipidemia 2017'),
  ('dyslipidemia', 'trans_fat', NULL, 0, 'g', 'critical',
   'Avoid trans fats completely - they raise LDL and lower HDL',
   'Elakkan lemak trans sepenuhnya - ia meningkatkan LDL dan menurunkan HDL',
   'WHO Guidelines'),
  ('dyslipidemia', 'cholesterol', NULL, 300, 'mg', 'important',
   'Limit dietary cholesterol intake',
   'Hadkan pengambilan kolesterol dari makanan',
   'Malaysian CPG Dyslipidemia 2017'),
  ('dyslipidemia', 'fiber', 25, NULL, 'g', 'important',
   'Soluble fiber helps lower LDL cholesterol',
   'Serat larut membantu menurunkan kolesterol LDL',
   'Malaysian CPG Dyslipidemia 2017'),
   
  -- CKD Stage 3a targets
  ('ckd_stage3a', 'protein', NULL, 0.8, 'g/kg', 'important',
   'Moderate protein to reduce kidney workload',
   'Protein sederhana untuk mengurangkan beban buah pinggang',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage3a', 'sodium', NULL, 2300, 'mg', 'important',
   'Limit sodium to help control blood pressure and fluid',
   'Hadkan natrium untuk membantu mengawal tekanan darah dan cecair',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage3a', 'potassium', NULL, 3000, 'mg', 'moderate',
   'Monitor potassium - kidneys may have difficulty excreting excess',
   'Pantau kalium - buah pinggang mungkin sukar mengeluarkan lebihan',
   'KDIGO CKD Guidelines 2024'),
   
  -- CKD Stage 3b targets
  ('ckd_stage3b', 'protein', NULL, 0.8, 'g/kg', 'critical',
   'Limit protein to slow kidney disease progression',
   'Hadkan protein untuk melambatkan perkembangan penyakit buah pinggang',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage3b', 'sodium', NULL, 2000, 'mg', 'critical',
   'Strict sodium control for fluid and BP management',
   'Kawalan natrium yang ketat untuk pengurusan cecair dan BP',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage3b', 'potassium', NULL, 2700, 'mg', 'important',
   'Limit potassium to prevent hyperkalemia',
   'Hadkan kalium untuk mencegah hiperkalemia',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage3b', 'phosphorus', NULL, 1000, 'mg', 'important',
   'Limit phosphorus to protect bone health',
   'Hadkan fosforus untuk melindungi kesihatan tulang',
   'KDIGO CKD Guidelines 2024'),
   
  -- CKD Stage 4 targets
  ('ckd_stage4', 'protein', NULL, 0.6, 'g/kg', 'critical',
   'Strict protein restriction to preserve remaining kidney function',
   'Sekatan protein yang ketat untuk memelihara fungsi buah pinggang yang tinggal',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage4', 'sodium', NULL, 1500, 'mg', 'critical',
   'Strict sodium restriction essential',
   'Sekatan natrium yang ketat adalah penting',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage4', 'potassium', NULL, 2000, 'mg', 'critical',
   'Strict potassium limit - high risk of hyperkalemia',
   'Had kalium yang ketat - risiko tinggi hiperkalemia',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage4', 'phosphorus', NULL, 800, 'mg', 'critical',
   'Strict phosphorus restriction to prevent bone disease',
   'Sekatan fosforus yang ketat untuk mencegah penyakit tulang',
   'KDIGO CKD Guidelines 2024'),
   
  -- CKD Stage 5 / Dialysis targets (varies by dialysis type)
  ('ckd_stage5', 'protein', 1.0, 1.2, 'g/kg', 'critical',
   'Higher protein on dialysis to compensate for losses',
   'Protein lebih tinggi pada dialisis untuk mengimbangi kehilangan',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage5', 'sodium', NULL, 2000, 'mg', 'critical',
   'Sodium restriction to control fluid between treatments',
   'Sekatan natrium untuk mengawal cecair antara rawatan',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage5', 'potassium', NULL, 2000, 'mg', 'critical',
   'Strict potassium control - life-threatening if too high',
   'Kawalan kalium yang ketat - mengancam nyawa jika terlalu tinggi',
   'KDIGO CKD Guidelines 2024'),
  ('ckd_stage5', 'phosphorus', NULL, 800, 'mg', 'critical',
   'Phosphorus binders usually needed with diet restriction',
   'Pengikat fosforus biasanya diperlukan dengan sekatan diet',
   'KDIGO CKD Guidelines 2024'),
   
  -- Gout targets
  ('gout', 'purine', NULL, 400, 'mg', 'critical',
   'Limit high-purine foods to reduce uric acid',
   'Hadkan makanan tinggi purin untuk mengurangkan asid urik',
   'ACR Gout Guidelines 2020'),
  ('gout', 'fructose', NULL, 25, 'g', 'important',
   'Limit fructose which increases uric acid production',
   'Hadkan fruktosa yang meningkatkan pengeluaran asid urik',
   'ACR Gout Guidelines 2020'),
  ('gout', 'alcohol', NULL, 0, 'g', 'important',
   'Avoid alcohol, especially beer which is high in purines',
   'Elakkan alkohol, terutamanya bir yang tinggi purin',
   'ACR Gout Guidelines 2020'),
   
  -- Obesity targets
  ('obesity', 'calories', NULL, NULL, 'kcal', 'critical',
   'Caloric deficit needed for weight loss - consult dietitian',
   'Defisit kalori diperlukan untuk penurunan berat - rujuk pakar diet',
   'Malaysian CPG Obesity 2023'),
  ('obesity', 'fiber', 25, 35, 'g', 'important',
   'High fiber promotes satiety and helps with weight management',
   'Serat tinggi meningkatkan rasa kenyang dan membantu pengurusan berat',
   'Malaysian CPG Obesity 2023'),
  ('obesity', 'sugar', NULL, 25, 'g', 'important',
   'Limit added sugars to reduce caloric intake',
   'Hadkan gula tambahan untuk mengurangkan pengambilan kalori',
   'WHO Guidelines'),
   
  -- NAFLD (Fatty Liver) targets
  ('nafld', 'saturated_fat', NULL, 15, 'g', 'critical',
   'Limit saturated fat to reduce liver fat accumulation',
   'Hadkan lemak tepu untuk mengurangkan pengumpulan lemak hati',
   'AASLD NAFLD Guidelines 2023'),
  ('nafld', 'sugar', NULL, 25, 'g', 'critical',
   'Avoid added sugars, especially fructose',
   'Elakkan gula tambahan, terutamanya fruktosa',
   'AASLD NAFLD Guidelines 2023'),
  ('nafld', 'fiber', 25, NULL, 'g', 'important',
   'Increase fiber for metabolic health',
   'Tingkatkan serat untuk kesihatan metabolik',
   'AASLD NAFLD Guidelines 2023')
ON CONFLICT (condition_code, nutrient_code) DO UPDATE SET
  min_value = EXCLUDED.min_value,
  max_value = EXCLUDED.max_value,
  unit = EXCLUDED.unit,
  priority = EXCLUDED.priority,
  guidance = EXCLUDED.guidance,
  guidance_ms = EXCLUDED.guidance_ms,
  source_reference = EXCLUDED.source_reference;

-- ============================================
-- 4. USER NUTRIENT TARGETS (Personal Overrides)
-- ============================================

CREATE TABLE IF NOT EXISTS user_nutrient_targets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  nutrient_code TEXT NOT NULL,
  
  -- Custom targets (from doctor/dietitian)
  min_value DECIMAL(10,2),
  max_value DECIMAL(10,2),
  unit TEXT NOT NULL,
  
  -- For weight-based calculations
  is_per_kg_body_weight BOOLEAN DEFAULT false,
  
  -- Source of recommendation
  source TEXT CHECK (source IN ('system_default', 'doctor', 'dietitian', 'self')) DEFAULT 'self',
  source_name TEXT, -- "Dr. Lim, KPJ Damansara"
  source_date DATE, -- Date recommendation was given
  source_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, nutrient_code)
);

-- ============================================
-- 5. DAILY NUTRIENT SUMMARY
-- ============================================

CREATE TABLE IF NOT EXISTS daily_nutrient_summary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  tenant_id UUID REFERENCES tenants(id) DEFAULT '00000000-0000-0000-0000-000000000001'::UUID,
  date DATE NOT NULL,
  
  -- Core nutrients
  calories DECIMAL(10,2) DEFAULT 0,
  carbs_g DECIMAL(10,2) DEFAULT 0,
  protein_g DECIMAL(10,2) DEFAULT 0,
  fat_g DECIMAL(10,2) DEFAULT 0,
  
  -- Extended nutrients for comorbidities
  sodium_mg DECIMAL(10,2) DEFAULT 0,
  potassium_mg DECIMAL(10,2) DEFAULT 0,
  phosphorus_mg DECIMAL(10,2) DEFAULT 0,
  cholesterol_mg DECIMAL(10,2) DEFAULT 0,
  saturated_fat_g DECIMAL(10,2) DEFAULT 0,
  trans_fat_g DECIMAL(10,2) DEFAULT 0,
  fiber_g DECIMAL(10,2) DEFAULT 0,
  sugar_g DECIMAL(10,2) DEFAULT 0,
  purine_mg DECIMAL(10,2) DEFAULT 0,
  fructose_g DECIMAL(10,2) DEFAULT 0,
  alcohol_g DECIMAL(10,2) DEFAULT 0,
  
  -- Meal tracking
  meals_logged INTEGER DEFAULT 0,
  snacks_logged INTEGER DEFAULT 0,
  
  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  UNIQUE(user_id, date)
);

-- ============================================
-- 6. EXPAND EXISTING TABLES
-- ============================================

-- Add extended vitals to health_profiles (if not exists)
DO $$ 
BEGIN
  -- Blood pressure
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'systolic_bp') THEN
    ALTER TABLE health_profiles ADD COLUMN systolic_bp INTEGER;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'diastolic_bp') THEN
    ALTER TABLE health_profiles ADD COLUMN diastolic_bp INTEGER;
  END IF;
  
  -- Lipid panel (mmol/L - Malaysian standard)
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'total_cholesterol') THEN
    ALTER TABLE health_profiles ADD COLUMN total_cholesterol DECIMAL(5,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'ldl_cholesterol') THEN
    ALTER TABLE health_profiles ADD COLUMN ldl_cholesterol DECIMAL(5,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'hdl_cholesterol') THEN
    ALTER TABLE health_profiles ADD COLUMN hdl_cholesterol DECIMAL(5,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'triglycerides') THEN
    ALTER TABLE health_profiles ADD COLUMN triglycerides DECIMAL(5,2);
  END IF;
  
  -- Kidney function
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'egfr') THEN
    ALTER TABLE health_profiles ADD COLUMN egfr DECIMAL(6,2);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'creatinine') THEN
    ALTER TABLE health_profiles ADD COLUMN creatinine DECIMAL(5,2);
  END IF;
  
  -- Gout
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'uric_acid') THEN
    ALTER TABLE health_profiles ADD COLUMN uric_acid DECIMAL(5,2);
  END IF;
  
  -- Lab info
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'last_lab_date') THEN
    ALTER TABLE health_profiles ADD COLUMN last_lab_date DATE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'health_profiles' AND column_name = 'lab_notes') THEN
    ALTER TABLE health_profiles ADD COLUMN lab_notes TEXT;
  END IF;
END $$;

-- Add extended nutrients to foods table (if exists)
DO $$ 
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'foods') THEN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'sodium_mg') THEN
      ALTER TABLE foods ADD COLUMN sodium_mg DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'potassium_mg') THEN
      ALTER TABLE foods ADD COLUMN potassium_mg DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'phosphorus_mg') THEN
      ALTER TABLE foods ADD COLUMN phosphorus_mg DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'cholesterol_mg') THEN
      ALTER TABLE foods ADD COLUMN cholesterol_mg DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'saturated_fat_g') THEN
      ALTER TABLE foods ADD COLUMN saturated_fat_g DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'trans_fat_g') THEN
      ALTER TABLE foods ADD COLUMN trans_fat_g DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'fiber_g') THEN
      ALTER TABLE foods ADD COLUMN fiber_g DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'sugar_g') THEN
      ALTER TABLE foods ADD COLUMN sugar_g DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'purine_mg') THEN
      ALTER TABLE foods ADD COLUMN purine_mg DECIMAL(10,2);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'foods' AND column_name = 'fructose_g') THEN
      ALTER TABLE foods ADD COLUMN fructose_g DECIMAL(10,2);
    END IF;
  END IF;
END $$;

-- ============================================
-- 7. INDEXES
-- ============================================

CREATE INDEX IF NOT EXISTS idx_user_conditions_user ON user_conditions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_conditions_code ON user_conditions(condition_code);
CREATE INDEX IF NOT EXISTS idx_user_conditions_primary ON user_conditions(user_id, is_primary) WHERE is_primary = true;
CREATE INDEX IF NOT EXISTS idx_user_conditions_active ON user_conditions(user_id, is_active) WHERE is_active = true;

CREATE INDEX IF NOT EXISTS idx_condition_nutrient_targets_code ON condition_nutrient_targets(condition_code);
CREATE INDEX IF NOT EXISTS idx_condition_nutrient_targets_nutrient ON condition_nutrient_targets(nutrient_code);
CREATE INDEX IF NOT EXISTS idx_condition_nutrient_targets_priority ON condition_nutrient_targets(priority);

CREATE INDEX IF NOT EXISTS idx_user_nutrient_targets_user ON user_nutrient_targets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_nutrient_targets_nutrient ON user_nutrient_targets(nutrient_code);

CREATE INDEX IF NOT EXISTS idx_daily_nutrient_summary_user_date ON daily_nutrient_summary(user_id, date);
CREATE INDEX IF NOT EXISTS idx_daily_nutrient_summary_date ON daily_nutrient_summary(date);

-- ============================================
-- 8. UTILITY FUNCTIONS
-- ============================================

-- Get all nutrient targets for a user (combining conditions + personal overrides)
CREATE OR REPLACE FUNCTION get_user_nutrient_targets(p_user_id TEXT)
RETURNS TABLE (
  nutrient_code TEXT,
  min_value DECIMAL,
  max_value DECIMAL,
  unit TEXT,
  is_per_kg_body_weight BOOLEAN,
  priority TEXT,
  source TEXT,
  guidance TEXT,
  guidance_ms TEXT
) AS $$
BEGIN
  RETURN QUERY
  WITH condition_targets AS (
    -- Get targets from all user's active conditions
    -- Use most restrictive target when multiple conditions have same nutrient
    SELECT DISTINCT ON (cnt.nutrient_code)
      cnt.nutrient_code,
      cnt.min_value,
      cnt.max_value,
      cnt.unit,
      cnt.is_per_kg_body_weight,
      cnt.priority,
      'condition'::TEXT as source,
      cnt.guidance,
      cnt.guidance_ms
    FROM user_conditions uc
    JOIN condition_nutrient_targets cnt ON cnt.condition_code = uc.condition_code
    WHERE uc.user_id = p_user_id AND uc.is_active = true
    ORDER BY cnt.nutrient_code, 
             CASE cnt.priority 
               WHEN 'critical' THEN 1 
               WHEN 'important' THEN 2 
               WHEN 'moderate' THEN 3 
               ELSE 4 
             END,
             cnt.max_value ASC NULLS LAST -- Most restrictive (lowest max) first
  ),
  user_overrides AS (
    -- Get user's personal overrides
    SELECT
      unt.nutrient_code,
      unt.min_value,
      unt.max_value,
      unt.unit,
      unt.is_per_kg_body_weight,
      'critical'::TEXT as priority, -- user-set is always priority
      unt.source::TEXT,
      NULL::TEXT as guidance,
      NULL::TEXT as guidance_ms
    FROM user_nutrient_targets unt
    WHERE unt.user_id = p_user_id
  )
  -- Combine with user overrides taking precedence
  SELECT 
    COALESCE(uo.nutrient_code, ct.nutrient_code),
    COALESCE(uo.min_value, ct.min_value),
    COALESCE(uo.max_value, ct.max_value),
    COALESCE(uo.unit, ct.unit),
    COALESCE(uo.is_per_kg_body_weight, ct.is_per_kg_body_weight),
    COALESCE(uo.priority, ct.priority),
    COALESCE(uo.source, ct.source),
    ct.guidance,
    ct.guidance_ms
  FROM condition_targets ct
  FULL OUTER JOIN user_overrides uo ON uo.nutrient_code = ct.nutrient_code;
END;
$$ LANGUAGE plpgsql STABLE;

-- Get or create daily nutrient summary
CREATE OR REPLACE FUNCTION get_or_create_daily_summary(p_user_id TEXT, p_date DATE)
RETURNS UUID AS $$
DECLARE
  summary_id UUID;
BEGIN
  SELECT id INTO summary_id
  FROM daily_nutrient_summary
  WHERE user_id = p_user_id AND date = p_date;
  
  IF summary_id IS NULL THEN
    INSERT INTO daily_nutrient_summary (user_id, date)
    VALUES (p_user_id, p_date)
    RETURNING id INTO summary_id;
  END IF;
  
  RETURN summary_id;
END;
$$ LANGUAGE plpgsql;

-- Update daily summary (called after food log insert/update/delete)
CREATE OR REPLACE FUNCTION update_daily_nutrient_summary(p_user_id TEXT, p_date DATE)
RETURNS VOID AS $$
BEGIN
  -- Ensure row exists
  PERFORM get_or_create_daily_summary(p_user_id, p_date);
  
  -- Update with aggregated values from food_logs
  -- This is a placeholder - actual implementation depends on your food_logs schema
  UPDATE daily_nutrient_summary dns
  SET 
    updated_at = NOW(),
    meals_logged = (
      SELECT COUNT(DISTINCT meal_type) 
      FROM food_logs 
      WHERE user_id = p_user_id 
        AND DATE(created_at) = p_date
    )
  WHERE dns.user_id = p_user_id AND dns.date = p_date;
END;
$$ LANGUAGE plpgsql;

-- Check if a user has a specific condition
CREATE OR REPLACE FUNCTION user_has_condition(p_user_id TEXT, p_condition_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_conditions
    WHERE user_id = p_user_id
      AND condition_code = p_condition_code
      AND is_active = true
  );
END;
$$ LANGUAGE plpgsql STABLE;

-- Get user's primary condition
CREATE OR REPLACE FUNCTION get_user_primary_condition(p_user_id TEXT)
RETURNS TEXT AS $$
DECLARE
  condition TEXT;
BEGIN
  SELECT condition_code INTO condition
  FROM user_conditions
  WHERE user_id = p_user_id
    AND is_primary = true
    AND is_active = true
  LIMIT 1;
  
  -- Default to diabetes_t2 if no primary set
  RETURN COALESCE(condition, 'diabetes_t2');
END;
$$ LANGUAGE plpgsql STABLE;

-- ============================================
-- 9. TRIGGERS
-- ============================================

-- Update timestamp trigger
CREATE OR REPLACE FUNCTION update_condition_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS user_conditions_updated ON user_conditions;
CREATE TRIGGER user_conditions_updated
  BEFORE UPDATE ON user_conditions
  FOR EACH ROW EXECUTE FUNCTION update_condition_timestamp();

DROP TRIGGER IF EXISTS user_nutrient_targets_updated ON user_nutrient_targets;
CREATE TRIGGER user_nutrient_targets_updated
  BEFORE UPDATE ON user_nutrient_targets
  FOR EACH ROW EXECUTE FUNCTION update_condition_timestamp();

DROP TRIGGER IF EXISTS daily_nutrient_summary_updated ON daily_nutrient_summary;
CREATE TRIGGER daily_nutrient_summary_updated
  BEFORE UPDATE ON daily_nutrient_summary
  FOR EACH ROW EXECUTE FUNCTION update_condition_timestamp();

-- Ensure only one primary condition per user
CREATE OR REPLACE FUNCTION ensure_single_primary_condition()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_primary = true THEN
    UPDATE user_conditions
    SET is_primary = false
    WHERE user_id = NEW.user_id
      AND id != NEW.id
      AND is_primary = true;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS single_primary_condition ON user_conditions;
CREATE TRIGGER single_primary_condition
  BEFORE INSERT OR UPDATE ON user_conditions
  FOR EACH ROW
  WHEN (NEW.is_primary = true)
  EXECUTE FUNCTION ensure_single_primary_condition();

-- ============================================
-- 10. ROW LEVEL SECURITY
-- ============================================

ALTER TABLE condition_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE condition_nutrient_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_nutrient_targets ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_nutrient_summary ENABLE ROW LEVEL SECURITY;

-- condition_types - public read
CREATE POLICY "Anyone can read active condition types"
  ON condition_types FOR SELECT
  USING (is_active = true);

CREATE POLICY "Service role full access to condition_types"
  ON condition_types FOR ALL
  TO service_role
  USING (true);

-- condition_nutrient_targets - public read
CREATE POLICY "Anyone can read condition nutrient targets"
  ON condition_nutrient_targets FOR SELECT
  USING (true);

CREATE POLICY "Service role full access to condition_nutrient_targets"
  ON condition_nutrient_targets FOR ALL
  TO service_role
  USING (true);

-- user_conditions - user owns their data
CREATE POLICY "Users can view own conditions"
  ON user_conditions FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Service role full access to user_conditions"
  ON user_conditions FOR ALL
  TO service_role
  USING (true);

-- user_nutrient_targets - user owns their data
CREATE POLICY "Users can view own nutrient targets"
  ON user_nutrient_targets FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Service role full access to user_nutrient_targets"
  ON user_nutrient_targets FOR ALL
  TO service_role
  USING (true);

-- daily_nutrient_summary - user owns their data
CREATE POLICY "Users can view own daily summary"
  ON daily_nutrient_summary FOR SELECT
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Service role full access to daily_nutrient_summary"
  ON daily_nutrient_summary FOR ALL
  TO service_role
  USING (true);

-- ============================================
-- 11. GRANTS
-- ============================================

GRANT SELECT ON condition_types TO authenticated;
GRANT SELECT ON condition_nutrient_targets TO authenticated;
GRANT ALL ON user_conditions TO service_role;
GRANT ALL ON user_nutrient_targets TO service_role;
GRANT ALL ON daily_nutrient_summary TO service_role;

GRANT EXECUTE ON FUNCTION get_user_nutrient_targets TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION get_or_create_daily_summary TO service_role;
GRANT EXECUTE ON FUNCTION update_daily_nutrient_summary TO service_role;
GRANT EXECUTE ON FUNCTION user_has_condition TO service_role, authenticated;
GRANT EXECUTE ON FUNCTION get_user_primary_condition TO service_role, authenticated;

-- ============================================
-- 12. COMMENTS
-- ============================================

COMMENT ON TABLE condition_types IS 'System reference table for supported health conditions';
COMMENT ON TABLE user_conditions IS 'User health conditions with metadata (many-to-many)';
COMMENT ON TABLE condition_nutrient_targets IS 'Default nutrient targets per condition (from clinical guidelines)';
COMMENT ON TABLE user_nutrient_targets IS 'User-specific nutrient target overrides (from doctor/dietitian)';
COMMENT ON TABLE daily_nutrient_summary IS 'Aggregated daily nutrient totals for quick dashboard access';

COMMENT ON FUNCTION get_user_nutrient_targets IS 'Returns combined nutrient targets from user conditions and personal overrides';
COMMENT ON FUNCTION user_has_condition IS 'Check if user has a specific active condition';
COMMENT ON FUNCTION get_user_primary_condition IS 'Get user primary condition code (defaults to diabetes_t2)';


