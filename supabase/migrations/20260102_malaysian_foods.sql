-- 🇲🇾 Malaysian Food Database - Phase 1
-- Migration: Create malaysian_foods table with full nutrient profiles

-- Malaysian food library
CREATE TABLE IF NOT EXISTS malaysian_foods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identity
  name_en TEXT NOT NULL,
  name_bm TEXT NOT NULL,
  aliases TEXT[], -- ["nasi lemak", "nasik lemak", "coconut rice"]
  
  -- Categorization
  category TEXT NOT NULL, -- 'rice_dishes', 'noodles', 'kuih', 'drinks', etc.
  subcategory TEXT,
  tags TEXT[], -- ['mamak', 'ramadan', 'breakfast', 'hawker']
  
  -- Serving Info (Malaysian portions)
  serving_description TEXT NOT NULL, -- "1 bungkus", "1 pinggan", "1 cawan"
  serving_description_en TEXT, -- "1 packet", "1 plate", "1 cup"
  serving_grams DECIMAL(10,2) NOT NULL,
  
  -- Basic Nutrition
  calories_kcal DECIMAL(10,2) NOT NULL,
  
  -- Diabetes-relevant (CRITICAL)
  carbs_g DECIMAL(10,2) NOT NULL,
  sugar_g DECIMAL(10,2),
  fiber_g DECIMAL(10,2),
  glycemic_index INTEGER, -- 0-100, NULL if unknown
  gi_category TEXT CHECK (gi_category IN ('low', 'medium', 'high')), -- <55, 56-69, 70+
  
  -- Hypertension-relevant (CRITICAL)
  sodium_mg DECIMAL(10,2),
  potassium_mg DECIMAL(10,2),
  
  -- Cholesterol-relevant (CRITICAL)
  total_fat_g DECIMAL(10,2),
  saturated_fat_g DECIMAL(10,2),
  trans_fat_g DECIMAL(10,2),
  cholesterol_mg DECIMAL(10,2),
  
  -- CKD-relevant (CRITICAL)
  protein_g DECIMAL(10,2),
  phosphorus_mg DECIMAL(10,2),
  
  -- Pre-computed Condition Warnings
  diabetes_rating TEXT CHECK (diabetes_rating IN ('safe', 'caution', 'limit')),
  hypertension_rating TEXT CHECK (hypertension_rating IN ('safe', 'caution', 'limit')),
  cholesterol_rating TEXT CHECK (cholesterol_rating IN ('safe', 'caution', 'limit')),
  ckd_rating TEXT CHECK (ckd_rating IN ('safe', 'caution', 'limit')),
  
  -- Metadata
  image_url TEXT,
  source TEXT DEFAULT 'manual', -- 'myfcd', 'hpb', 'ai_estimated', 'user_submitted'
  verified BOOLEAN DEFAULT false,
  popularity_score INTEGER DEFAULT 0, -- track search/log frequency
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast search
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_name_en ON malaysian_foods USING gin(to_tsvector('english', name_en));
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_name_bm ON malaysian_foods USING gin(to_tsvector('simple', name_bm));
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_aliases ON malaysian_foods USING gin(aliases);
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_category ON malaysian_foods(category);
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_tags ON malaysian_foods USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_popularity ON malaysian_foods(popularity_score DESC);

-- Function to search foods with ranking
CREATE OR REPLACE FUNCTION search_malaysian_foods(search_term TEXT, limit_count INTEGER DEFAULT 20)
RETURNS SETOF malaysian_foods AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM malaysian_foods
  WHERE 
    name_en ILIKE '%' || search_term || '%'
    OR name_bm ILIKE '%' || search_term || '%'
    OR search_term = ANY(aliases)
    OR to_tsvector('english', name_en) @@ plainto_tsquery('english', search_term)
    OR to_tsvector('simple', name_bm) @@ plainto_tsquery('simple', search_term)
  ORDER BY 
    CASE 
      WHEN name_en ILIKE search_term || '%' THEN 1
      WHEN name_bm ILIKE search_term || '%' THEN 1
      WHEN name_en ILIKE '%' || search_term || '%' THEN 2
      WHEN name_bm ILIKE '%' || search_term || '%' THEN 2
      ELSE 3
    END,
    popularity_score DESC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Function to increment popularity score when food is logged
CREATE OR REPLACE FUNCTION increment_food_popularity(food_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE malaysian_foods 
  SET popularity_score = popularity_score + 1,
      updated_at = NOW()
  WHERE id = food_id;
END;
$$ LANGUAGE plpgsql;

-- RLS Policies (foods are public read, admin write)
ALTER TABLE malaysian_foods ENABLE ROW LEVEL SECURITY;

-- Everyone can read foods
CREATE POLICY "Foods are viewable by everyone" ON malaysian_foods
  FOR SELECT USING (true);

-- Only service role can modify (for admin/seeding)
CREATE POLICY "Service role can modify foods" ON malaysian_foods
  FOR ALL USING (auth.role() = 'service_role');

