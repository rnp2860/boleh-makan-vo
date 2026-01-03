-- 🇲🇾 Add Common Aliases for Better Search Matching
-- Helps users find foods with common misspellings, abbreviations, and variations

-- Helper function to safely append aliases without duplicates
CREATE OR REPLACE FUNCTION append_aliases(existing_aliases TEXT[], new_aliases TEXT[])
RETURNS TEXT[] AS $$
BEGIN
  RETURN ARRAY(
    SELECT DISTINCT unnest(COALESCE(existing_aliases, ARRAY[]::TEXT[]) || new_aliases)
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- ==============================================================================
-- POPULAR DISHES - Add common abbreviations and variations
-- ==============================================================================

-- Char Kuey Teow (CKT)
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['ckt', 'char koay teow', 'fried flat noodles', 'kuey teow goreng'])
WHERE LOWER(name_en) LIKE '%char kuey teow%' OR LOWER(name_en) LIKE '%char kway teow%';

-- Nasi Lemak variations
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasik lemak', 'nasi lemak biasa', 'nasi lemak with sambal'])
WHERE LOWER(name_en) = 'nasi lemak with sambal, egg, anchovies' 
   OR (LOWER(name_en) LIKE '%nasi lemak%' AND LOWER(name_en) NOT LIKE '%rendang%' AND LOWER(name_en) NOT LIKE '%ayam%');

-- Nasi Lemak with Rendang
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasi lemak rendang', 'nasik lemak rendang', 'nasi lemak ayam rendang'])
WHERE LOWER(name_en) LIKE '%nasi lemak%' AND LOWER(name_en) LIKE '%rendang%';

-- Nasi Lemak with Fried Chicken
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasi lemak ayam goreng', 'nasik lemak ayam goreng', 'nasi lemak with fried chicken'])
WHERE LOWER(name_en) LIKE '%nasi lemak%' AND (LOWER(name_en) LIKE '%fried chicken%' OR LOWER(name_en) LIKE '%ayam goreng%');

-- Roti Canai (common misspellings)
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['roti chanai', 'roti chennai', 'roti kosong', 'prata', 'paratha'])
WHERE LOWER(name_en) LIKE '%roti canai%' AND LOWER(name_en) LIKE '%plain%';

-- Roti Canai Telur
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['roti chanai telur', 'roti telur', 'egg prata'])
WHERE LOWER(name_en) LIKE '%roti canai%' AND LOWER(name_en) LIKE '%egg%';

-- Teh Tarik
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['teh tarek', 'pulled tea', 'teh susu', 'milk tea'])
WHERE LOWER(name_en) LIKE '%teh tarik%';

-- Milo drinks
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['ice milo', 'milo sejuk', 'iced milo'])
WHERE LOWER(name_en) LIKE '%milo%' AND LOWER(name_en) LIKE '%ais%';

UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['hot milo', 'milo panas', 'milo suam'])
WHERE LOWER(name_en) LIKE '%milo%' AND LOWER(name_en) NOT LIKE '%ais%';

-- Teh drinks
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['teh ais', 'iced tea', 'ice tea'])
WHERE LOWER(name_en) LIKE '%teh%' AND LOWER(name_en) LIKE '%ais%';

UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['teh o', 'tea without milk', 'black tea'])
WHERE LOWER(name_en) LIKE '%teh o%';

-- Kopi drinks
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['kopi o', 'black coffee', 'coffee without milk'])
WHERE LOWER(name_en) LIKE '%kopi o%';

UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['kopi ais', 'iced coffee', 'ice coffee'])
WHERE LOWER(name_en) LIKE '%kopi%' AND LOWER(name_en) LIKE '%ais%';

-- ==============================================================================
-- NOODLES
-- ==============================================================================

-- Maggi Goreng
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['maggi goreng mamak', 'maggie goreng', 'instant noodles fried'])
WHERE LOWER(name_en) LIKE '%maggi goreng%';

-- Mee Goreng
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['mee goreng india', 'mee goreng mamak', 'indian fried noodles', 'mamak fried noodles'])
WHERE LOWER(name_en) LIKE '%mee goreng%' AND LOWER(name_en) LIKE '%mamak%';

-- Wantan Mee
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['wan tan mee', 'wonton mee', 'wantan mee kering', 'dry wonton noodles'])
WHERE LOWER(name_en) LIKE '%wantan mee%';

-- Bak Kut Teh
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['bkt', 'bah kut teh', 'pork rib soup', 'herbal pork soup'])
WHERE LOWER(name_en) LIKE '%bak kut teh%';

-- Yong Tau Foo
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['yong tau fu', 'yong taufu', 'ytf', 'stuffed tofu'])
WHERE LOWER(name_en) LIKE '%yong tau foo%';

-- Char Siew (Char Siu)
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['char siu', 'cha siew', 'bbq pork', 'roasted pork'])
WHERE LOWER(name_en) LIKE '%char siew%' OR LOWER(name_en) LIKE '%char siu%';

-- ==============================================================================
-- RICE DISHES
-- ==============================================================================

-- Nasi Goreng
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasi goreng biasa', 'nasik goreng', 'fried rice', 'malay fried rice'])
WHERE LOWER(name_en) LIKE '%nasi goreng kampung%';

UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasi goreng ayam', 'nasik goreng ayam', 'chicken fried rice'])
WHERE LOWER(name_en) LIKE '%nasi goreng%' AND LOWER(name_en) LIKE '%chicken%';

-- Nasi Ayam (Chicken Rice)
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasik ayam', 'chicken rice', 'hainanese chicken rice'])
WHERE LOWER(name_en) LIKE '%nasi ayam%' OR LOWER(name_en) LIKE '%chicken rice%';

-- Nasi Briyani
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasi biryani', 'nasi beriani', 'biryani', 'briani'])
WHERE LOWER(name_en) LIKE '%briyani%' OR LOWER(name_en) LIKE '%biryani%';

-- Nasi Campur
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['nasik campur', 'mixed rice', 'economy rice', 'chap fan'])
WHERE LOWER(name_en) LIKE '%nasi campur%' OR LOWER(name_en) LIKE '%mixed rice%';

-- ==============================================================================
-- PROTEIN / MEAT DISHES
-- ==============================================================================

-- Ayam Goreng (Fried Chicken)
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['ayam goreng berempah', 'fried chicken malay style', 'malay fried chicken'])
WHERE LOWER(name_en) LIKE '%ayam goreng%';

-- Rendang
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['beef rendang', 'rendang daging', 'chicken rendang', 'rendang ayam'])
WHERE LOWER(name_en) LIKE '%rendang%';

-- Satay
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['sate', 'satay ayam', 'satay daging', 'chicken satay', 'beef satay'])
WHERE LOWER(name_en) LIKE '%satay%';

-- ==============================================================================
-- BREADS & SNACKS
-- ==============================================================================

-- Roti John
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['roti jon', 'french loaf omelette'])
WHERE LOWER(name_en) LIKE '%roti john%';

-- Roti Planta
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['roti butter', 'butter prata'])
WHERE LOWER(name_en) LIKE '%roti%' AND LOWER(name_en) LIKE '%planta%';

-- Pisang Goreng
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['fried banana', 'goreng pisang', 'banana fritters'])
WHERE LOWER(name_en) LIKE '%pisang goreng%';

-- ==============================================================================
-- SOUPS & LAKSA
-- ==============================================================================

-- Laksa
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['laksa penang', 'laksa johor', 'curry laksa', 'asam laksa'])
WHERE LOWER(name_en) LIKE '%laksa%';

-- Sup Tulang
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['sup tulang lembu', 'bone soup', 'beef bone soup'])
WHERE LOWER(name_en) LIKE '%sup tulang%';

-- ==============================================================================
-- DESSERTS & KUIH
-- ==============================================================================

-- Cendol
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['chendol', 'ice cendol', 'ais cendol'])
WHERE LOWER(name_en) LIKE '%cendol%';

-- Kuih
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['kueh', 'kue', 'malay cake'])
WHERE LOWER(name_en) LIKE '%kuih%' AND category = 'kuih';

-- Onde-Onde
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['ondeh ondeh', 'buah melaka', 'glutinous rice balls'])
WHERE LOWER(name_en) LIKE '%onde%';

-- ==============================================================================
-- COMMON WORD VARIATIONS
-- ==============================================================================

-- Add "goreng" variations for all fried dishes
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['fried', 'goreng'])
WHERE LOWER(name_en) LIKE '%goreng%' OR LOWER(name_en) LIKE '%fried%';

-- Add "ayam" variations for all chicken dishes
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['chicken', 'ayam'])
WHERE LOWER(name_en) LIKE '%chicken%' OR LOWER(name_bm) LIKE '%ayam%';

-- Add "ikan" variations for all fish dishes
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['fish', 'ikan'])
WHERE LOWER(name_en) LIKE '%fish%' OR LOWER(name_bm) LIKE '%ikan%';

-- Add "daging" variations for all beef dishes
UPDATE malaysian_foods 
SET aliases = append_aliases(aliases, ARRAY['beef', 'daging'])
WHERE LOWER(name_en) LIKE '%beef%' OR LOWER(name_bm) LIKE '%daging%';

COMMENT ON FUNCTION append_aliases IS 'Helper function to safely append new aliases without creating duplicates';

-- Show summary of updates
DO $$
DECLARE
  total_with_aliases INTEGER;
  total_foods INTEGER;
BEGIN
  SELECT COUNT(*) INTO total_foods FROM malaysian_foods;
  SELECT COUNT(*) INTO total_with_aliases FROM malaysian_foods WHERE aliases IS NOT NULL AND array_length(aliases, 1) > 0;
  
  RAISE NOTICE 'Alias update complete: % of % foods now have aliases', total_with_aliases, total_foods;
END $$;

