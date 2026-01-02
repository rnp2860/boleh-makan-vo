-- 🇲🇾 Malaysian Food Database - Batch 3C: Indian Dishes (40 foods)
-- All values per standard Malaysian serving

-- ============================================
-- BANANA LEAF ITEMS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Banana Leaf Rice (Full Meal)', 'Nasi Daun Pisang', ARRAY['banana leaf', 'nasi kandar daun'], 'rice_dishes', 'nasi', ARRAY['indian', 'lunch', 'complete'], '1 set lengkap', '1 full set', 600, 950, 120, 8, 6, 70, 'high', 1450, 680, 35, 12, 0, 85, 32, 380, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Rasam', 'Rasam', ARRAY['rasam soup', 'pepper soup'], 'soup', 'indian', ARRAY['indian', 'healthy', 'digestive'], '1 mangkuk', '1 bowl', 200, 60, 10, 2, 2, 35, 'low', 580, 280, 2, 0.5, 0, 0, 2, 60, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Sambar', 'Sambar', ARRAY['sambar dal', 'lentil vegetable curry'], 'curry', 'indian', ARRAY['indian', 'vegetarian', 'healthy'], '1 mangkuk', '1 bowl', 200, 150, 22, 4, 5, 45, 'low', 650, 450, 4, 1, 0, 0, 8, 140, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Dhal (Lentil Curry)', 'Dhal', ARRAY['dal', 'lentil curry', 'paruppu'], 'curry', 'indian', ARRAY['indian', 'vegetarian', 'protein'], '1 mangkuk', '1 bowl', 200, 180, 26, 3, 6, 42, 'low', 520, 480, 4, 1, 0, 0, 12, 180, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Papadom', 'Papadom', ARRAY['papad', 'lentil crackers'], '2 keping', '2 pieces', 20, 80, 10, 0, 1, 55, 'low', 380, 80, 3, 0.5, 0, 0, 3, 50, 'safe', 'caution', 'safe', 'safe', 'snacks', 'indian', ARRAY['indian', 'crispy', 'side'], 'ai_estimated', false),

('Acar (Indian Pickle)', 'Acar India', ARRAY['achar', 'vegetable pickle'], 'condiments', 'pickle', ARRAY['indian', 'spicy', 'tangy'], '2 sudu makan', '2 tablespoons', 40, 50, 8, 4, 1, 40, 'low', 480, 120, 2, 0.3, 0, 0, 1, 20, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Fried Bitter Gourd', 'Peria Goreng', ARRAY['bitter gourd fry', 'karela fry'], 'vegetables', 'indian', ARRAY['indian', 'bitter', 'healthy'], '1 hidangan', '1 serving', 80, 90, 6, 2, 3, 30, 'low', 380, 280, 6, 1, 0, 0, 3, 50, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Cabbage Poriyal', 'Kobis Poriyal', ARRAY['cabbage stir fry', 'cabbage indian'], 'vegetables', 'indian', ARRAY['indian', 'healthy', 'vegetarian'], '1 hidangan', '1 serving', 100, 80, 8, 3, 3, 30, 'low', 350, 220, 4, 1, 0, 0, 3, 40, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- CURRIES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Chicken Curry (Indian Style)', 'Kari Ayam India', ARRAY['indian chicken curry', 'kozhi curry'], 'protein', 'kari', ARRAY['indian', 'spicy', 'popular'], '1 ketul dengan kuah', '1 piece with gravy', 200, 350, 10, 3, 2, 38, 'low', 720, 380, 24, 8, 0, 95, 26, 240, 'safe', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Mutton Curry (Indian Style)', 'Kari Kambing India', ARRAY['indian mutton curry', 'aatu curry'], 'protein', 'kari', ARRAY['indian', 'rich', 'traditional'], '1 hidangan', '1 serving', 180, 420, 8, 3, 2, 35, 'low', 780, 400, 32, 14, 0, 90, 28, 280, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Fish Curry (Indian Style)', 'Kari Ikan India', ARRAY['indian fish curry', 'meen curry'], 'protein', 'kari', ARRAY['indian', 'spicy', 'south indian'], '1 ketul dengan kuah', '1 piece with gravy', 180, 280, 8, 3, 2, 35, 'low', 680, 450, 16, 4, 0, 65, 26, 300, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Prawn Curry', 'Kari Udang', ARRAY['prawn masala', 'eral curry'], 'protein', 'kari', ARRAY['indian', 'seafood', 'spicy'], '1 hidangan', '1 serving', 150, 280, 8, 3, 2, 35, 'low', 720, 350, 18, 6, 0, 180, 22, 320, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Egg Curry', 'Kari Telur', ARRAY['muttai curry', 'egg masala'], 'protein', 'kari', ARRAY['indian', 'budget', 'protein'], '2 biji', '2 eggs', 160, 280, 10, 4, 2, 38, 'low', 620, 220, 18, 6, 0, 380, 14, 200, 'safe', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Vegetable Kurma', 'Korma Sayur', ARRAY['veg kurma', 'mixed vegetable kurma'], 'curry', 'indian', ARRAY['indian', 'vegetarian', 'creamy'], '1 mangkuk', '1 bowl', 200, 220, 18, 5, 4, 45, 'low', 580, 420, 14, 8, 0, 15, 6, 120, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Chicken Korma', 'Korma Ayam', ARRAY['chicken kurma', 'ayam korma'], 'protein', 'kari', ARRAY['indian', 'mild', 'creamy'], '1 ketul dengan kuah', '1 piece with gravy', 200, 380, 12, 4, 2, 40, 'low', 650, 350, 26, 12, 0, 90, 24, 220, 'safe', 'limit', 'limit', 'caution', 'ai_estimated', false);

-- ============================================
-- TANDOORI & GRILLED
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Tandoori Chicken (Quarter)', 'Ayam Tandoori', ARRAY['tandoori', 'clay oven chicken'], 'protein', 'tandoori', ARRAY['indian', 'grilled', 'spicy'], '1/4 ekor', '1/4 chicken', 200, 320, 6, 2, 0, 35, 'low', 680, 380, 16, 4, 0, 110, 38, 300, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Tandoori Fish', 'Ikan Tandoori', ARRAY['grilled fish indian', 'tandoori machli'], 'protein', 'tandoori', ARRAY['indian', 'grilled', 'healthy'], '1 fillet', '1 fillet', 180, 250, 6, 2, 0, 35, 'low', 620, 420, 12, 3, 0, 70, 32, 320, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Chicken Tikka', 'Tikka Ayam', ARRAY['chicken tikka', 'boneless tandoori'], 'protein', 'tandoori', ARRAY['indian', 'appetizer', 'spicy'], '5 ketul', '5 pieces', 150, 280, 6, 2, 0, 35, 'low', 580, 320, 14, 4, 0, 85, 32, 260, 'safe', 'caution', 'safe', 'limit', 'ai_estimated', false),

('Seekh Kebab', 'Kebab Seekh', ARRAY['minced meat kebab', 'seekh kabab'], 'protein', 'kebab', ARRAY['indian', 'grilled', 'minced'], '2 batang', '2 skewers', 100, 240, 4, 1, 0, 30, 'low', 520, 300, 16, 6, 0, 65, 20, 200, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Lamb Chop', 'Lamb Chop', ARRAY['grilled lamb chop', 'kambing chop'], 'protein', 'grill', ARRAY['western-indian', 'premium', 'protein'], '2 ketul', '2 pieces', 200, 480, 4, 2, 0, 30, 'low', 580, 400, 36, 16, 0, 110, 36, 320, 'safe', 'caution', 'limit', 'limit', 'ai_estimated', false);

-- ============================================
-- RICE DISHES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Briyani Kambing', 'Briyani Kambing', ARRAY['mutton briyani', 'lamb biryani'], 'rice_dishes', 'briyani', ARRAY['indian', 'festive', 'rich'], '1 pinggan', '1 plate', 500, 880, 95, 5, 4, 70, 'high', 1150, 450, 35, 14, 0, 95, 35, 320, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Briyani Ikan', 'Briyani Ikan', ARRAY['fish briyani', 'machli biryani'], 'rice_dishes', 'briyani', ARRAY['indian', 'fish', 'aromatic'], '1 pinggan', '1 plate', 450, 720, 90, 4, 3, 68, 'medium', 980, 420, 26, 8, 0, 70, 30, 320, 'limit', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Nasi Goreng Mamak', 'Nasi Goreng Mamak', ARRAY['mamak fried rice', 'indian fried rice'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'popular', 'spicy'], '1 pinggan', '1 plate', 380, 620, 72, 5, 3, 70, 'high', 1280, 320, 28, 8, 0, 95, 20, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Kandar Campur', 'Nasi Kandar Campur', ARRAY['mixed nasi kandar', 'penang nasi kandar'], 'rice_dishes', 'nasi', ARRAY['mamak', 'penang', 'popular'], '1 pinggan', '1 plate', 500, 920, 95, 6, 4, 72, 'high', 1520, 420, 42, 14, 0, 120, 35, 300, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Tomato Rice', 'Nasi Tomato', ARRAY['tomato rice', 'thakkali sadam'], 'rice_dishes', 'nasi', ARRAY['indian', 'festive', 'aromatic'], '1 pinggan', '1 plate', 300, 420, 72, 5, 2, 72, 'high', 580, 280, 10, 3, 0, 15, 8, 120, 'limit', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Jeera Rice', 'Nasi Jeera', ARRAY['cumin rice', 'zeera rice'], 'rice_dishes', 'nasi', ARRAY['indian', 'aromatic', 'simple'], '1 pinggan', '1 plate', 250, 350, 62, 1, 2, 70, 'high', 320, 150, 8, 3, 0, 10, 6, 100, 'limit', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- BREADS (Additional)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Roti Boom', 'Roti Boom', ARRAY['thick roti', 'roti bom'], 'breads', 'roti', ARRAY['mamak', 'thick', 'filling'], '1 keping', '1 piece', 200, 580, 75, 20, 2, 72, 'high', 480, 120, 28, 12, 0.5, 30, 10, 100, 'limit', 'caution', 'limit', 'safe', 'ai_estimated', false),

('Murtabak Daging', 'Murtabak Daging', ARRAY['beef murtabak', 'meat murtabak'], 'breads', 'murtabak', ARRAY['mamak', 'filling', 'popular'], '1/2 murtabak', '1/2 portion', 200, 520, 48, 4, 2, 65, 'medium', 850, 280, 28, 10, 0.5, 120, 22, 200, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Murtabak Kambing', 'Murtabak Kambing', ARRAY['mutton murtabak', 'lamb murtabak'], 'breads', 'murtabak', ARRAY['mamak', 'premium', 'filling'], '1/2 murtabak', '1/2 portion', 200, 550, 48, 4, 2, 65, 'medium', 880, 300, 32, 14, 0.5, 95, 24, 220, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Roti John', 'Roti John', ARRAY['roti john', 'meat bread'], 'breads', 'roti', ARRAY['mamak', 'fusion', 'popular'], '1 potong', '1 piece', 150, 380, 35, 5, 2, 68, 'medium', 720, 200, 20, 6, 0, 120, 16, 160, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Puri with Curry', 'Puri dengan Kari', ARRAY['puri set', 'poori with curry'], 'breads', 'indian', ARRAY['indian', 'breakfast', 'fried'], '2 keping dengan kari', '2 pieces with curry', 150, 380, 42, 4, 3, 65, 'medium', 620, 280, 20, 5, 0, 25, 10, 120, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false);

-- ============================================
-- SNACKS & SIDES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Samosa', 'Samosa', ARRAY['samosa', 'curry puff indian'], 'snacks', 'fried', ARRAY['indian', 'snack', 'fried'], '2 biji', '2 pieces', 80, 220, 24, 2, 2, 55, 'low', 380, 180, 12, 3, 0, 10, 5, 60, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Pakora', 'Pakora', ARRAY['pakoda', 'vegetable fritters'], 'snacks', 'fried', ARRAY['indian', 'snack', 'fried'], '5 biji', '5 pieces', 80, 200, 18, 2, 2, 50, 'low', 420, 200, 12, 2, 0, 5, 5, 70, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Onion Bhaji', 'Bhaji Bawang', ARRAY['onion pakora', 'bawang goreng india'], 'snacks', 'fried', ARRAY['indian', 'appetizer', 'fried'], '3 biji', '3 pieces', 60, 150, 14, 3, 1, 50, 'low', 350, 150, 9, 1.5, 0, 5, 3, 50, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Murukku', 'Murukku', ARRAY['chakli', 'rice crackers indian'], 'snacks', 'indian', ARRAY['indian', 'deepavali', 'crispy'], '1 genggam', '1 handful', 30, 150, 18, 1, 1, 55, 'low', 280, 60, 8, 2, 0, 0, 3, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Ladoo', 'Ladoo', ARRAY['laddu', 'indian sweet ball'], 'desserts', 'indian', ARRAY['indian', 'festive', 'sweet'], '2 biji', '2 pieces', 60, 280, 38, 28, 1, 65, 'medium', 80, 120, 14, 6, 0, 20, 4, 60, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false);

-- ============================================
-- DRINKS (Indian)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Lassi Sweet', 'Lassi Manis', ARRAY['sweet lassi', 'yogurt drink sweet'], 'drinks', 'lassi', ARRAY['indian', 'yogurt', 'sweet'], '1 gelas', '1 glass', 300, 220, 32, 28, 0, 45, 'low', 120, 450, 6, 4, 0, 20, 8, 200, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Lassi Salted', 'Lassi Masin', ARRAY['salted lassi', 'chaas'], 'drinks', 'lassi', ARRAY['indian', 'yogurt', 'savory'], '1 gelas', '1 glass', 300, 120, 10, 6, 0, 35, 'low', 380, 420, 4, 2.5, 0, 15, 6, 180, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Masala Tea', 'Teh Masala', ARRAY['masala chai', 'spiced tea'], 'drinks', 'tea', ARRAY['indian', 'spiced', 'warming'], '1 cawan', '1 cup', 200, 120, 18, 16, 0, 55, 'low', 50, 180, 4, 2.5, 0, 10, 3, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh Halia Tarik', 'Teh Halia Tarik', ARRAY['pulled ginger tea', 'ginger milk tea'], 'drinks', 'tea', ARRAY['mamak', 'ginger', 'warming'], '1 cawan', '1 cup', 250, 130, 20, 18, 0, 58, 'medium', 55, 200, 4, 2.5, 0, 12, 3, 75, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

