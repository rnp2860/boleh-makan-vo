-- 🇲🇾 Malaysian Food Database - Batch 2C: Breads & Roti (30 foods)
-- All values per standard Malaysian serving

-- ============================================
-- ROTI CANAI VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Roti Bom (Thick Sweet Roti)', 'Roti Bom', ARRAY['roti bomb', 'thick roti'], 'breads', 'roti', ARRAY['mamak', 'sweet', 'breakfast'], '1 keping', '1 piece', 180, 520, 68, 18, 2, 72, 'high', 420, 100, 24, 10, 0.5, 25, 8, 80, 'limit', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Roti Planta (Margarine Roti)', 'Roti Planta', ARRAY['roti butter', 'planta roti'], 'breads', 'roti', ARRAY['mamak', 'breakfast', 'butter'], '1 keping', '1 piece', 120, 380, 45, 4, 1, 70, 'high', 450, 85, 20, 8, 0.5, 20, 6, 65, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Roti Sardin (Sardine Stuffed Roti)', 'Roti Sardin', ARRAY['sardine roti', 'roti ikan'], 'breads', 'roti', ARRAY['mamak', 'protein', 'filling'], '1 keping', '1 piece', 180, 450, 48, 3, 2, 68, 'medium', 680, 180, 22, 7, 0.5, 85, 16, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Roti Pisang (Banana Roti)', 'Roti Pisang', ARRAY['banana roti', 'roti dengan pisang'], 'breads', 'roti', ARRAY['mamak', 'sweet', 'dessert'], '1 keping', '1 piece', 150, 420, 58, 22, 2, 70, 'high', 380, 280, 18, 7, 0.5, 15, 7, 70, 'limit', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Roti Cheese', 'Roti Keju', ARRAY['cheese roti', 'roti dengan keju'], 'breads', 'roti', ARRAY['mamak', 'popular', 'cheesy'], '1 keping', '1 piece', 150, 480, 48, 3, 1, 68, 'medium', 650, 120, 26, 12, 0.5, 55, 14, 180, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Roti Telur Cheese', 'Roti Telur Keju', ARRAY['egg cheese roti', 'roti telur dengan keju'], 'breads', 'roti', ARRAY['mamak', 'popular', 'indulgent'], '1 keping', '1 piece', 180, 550, 50, 3, 1, 68, 'medium', 720, 150, 32, 14, 0.5, 240, 20, 250, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Roti Banjir (Flooded Roti)', 'Roti Banjir', ARRAY['flooded roti', 'roti with lots of curry'], 'breads', 'roti', ARRAY['mamak', 'indulgent', 'curry'], '1 keping', '1 piece', 250, 480, 52, 5, 2, 68, 'medium', 850, 280, 24, 10, 0.5, 45, 12, 140, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Roti Hawaii (Pineapple Cheese)', 'Roti Hawaii', ARRAY['hawaiian roti', 'pineapple cheese roti'], 'breads', 'roti', ARRAY['mamak', 'sweet', 'fusion'], '1 keping', '1 piece', 160, 480, 55, 18, 2, 70, 'high', 580, 150, 24, 11, 0.5, 45, 12, 160, 'limit', 'caution', 'limit', 'safe', 'ai_estimated', false);

-- ============================================
-- INDIAN BREADS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Naan Plain', 'Naan Kosong', ARRAY['plain naan', 'naan bread'], 'breads', 'indian', ARRAY['indian', 'dinner', 'popular'], '1 keping', '1 piece', 90, 260, 45, 3, 2, 70, 'high', 480, 80, 5, 1.5, 0, 5, 8, 90, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Naan Garlic', 'Naan Bawang Putih', ARRAY['garlic naan', 'naan garlic'], 'breads', 'indian', ARRAY['indian', 'dinner', 'popular'], '1 keping', '1 piece', 100, 300, 48, 3, 2, 70, 'high', 520, 100, 8, 3, 0, 10, 8, 95, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Naan Cheese', 'Naan Keju', ARRAY['cheese naan', 'stuffed naan'], 'breads', 'indian', ARRAY['indian', 'dinner', 'indulgent'], '1 keping', '1 piece', 120, 380, 48, 3, 2, 68, 'medium', 620, 120, 16, 8, 0, 40, 12, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Puri (Fried Bread)', 'Puri', ARRAY['poori', 'deep fried bread'], 'breads', 'indian', ARRAY['indian', 'breakfast', 'fried'], '2 keping', '2 pieces', 60, 200, 26, 1, 1, 72, 'high', 280, 60, 10, 2, 0, 0, 4, 50, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Paratha', 'Paratha', ARRAY['paratha', 'layered bread'], 'breads', 'indian', ARRAY['indian', 'breakfast', 'flaky'], '1 keping', '1 piece', 80, 260, 32, 1, 2, 68, 'medium', 350, 70, 12, 5, 0, 10, 5, 60, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Idli', 'Idli', ARRAY['idly', 'rice cake', 'steamed cake'], 'breads', 'indian', ARRAY['indian', 'breakfast', 'healthy'], '2 biji', '2 pieces', 100, 140, 28, 1, 2, 55, 'low', 320, 90, 1, 0.2, 0, 0, 4, 60, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Vadai', 'Vadai', ARRAY['vada', 'medu vada', 'fried lentil'], 'breads', 'indian', ARRAY['indian', 'breakfast', 'fried'], '2 biji', '2 pieces', 80, 220, 22, 2, 3, 55, 'low', 380, 180, 12, 2, 0, 0, 8, 100, 'safe', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Appam (Hoppers)', 'Appam', ARRAY['hoppers', 'appa', 'string hoppers'], 'breads', 'indian', ARRAY['indian', 'breakfast', 'fermented'], '2 keping', '2 pieces', 120, 180, 35, 3, 1, 60, 'medium', 220, 80, 3, 2, 0, 5, 4, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- LOCAL BREADS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Roti Kahwin (Kaya Butter Toast)', 'Roti Kahwin', ARRAY['kaya toast', 'married toast', 'roti bakar kaya'], 'breads', 'roti', ARRAY['kopitiam', 'breakfast', 'traditional'], '2 keping', '2 slices', 100, 320, 45, 18, 1, 72, 'high', 380, 80, 14, 8, 0, 25, 5, 60, 'limit', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Roti Bakar (Toasted Bread)', 'Roti Bakar', ARRAY['toast', 'grilled bread'], 'breads', 'roti', ARRAY['kopitiam', 'breakfast', 'simple'], '2 keping', '2 slices', 80, 250, 38, 12, 1, 72, 'high', 320, 60, 10, 5, 0, 15, 4, 50, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Roti Gardenia (Plain White Bread)', 'Roti Putih Gardenia', ARRAY['white bread', 'sliced bread'], 'breads', 'roti', ARRAY['basic', 'staple'], '2 keping', '2 slices', 60, 150, 28, 3, 1, 75, 'high', 280, 50, 2, 0.5, 0, 0, 5, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Wholemeal Bread', 'Roti Wholemeal', ARRAY['brown bread', 'whole grain bread'], 'breads', 'roti', ARRAY['healthy', 'staple'], '2 keping', '2 slices', 60, 140, 24, 2, 4, 55, 'low', 260, 120, 2, 0.4, 0, 0, 6, 100, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Plain Bun', 'Roti Bun', ARRAY['bun', 'bread roll'], 'breads', 'roti', ARRAY['basic', 'snack'], '1 biji', '1 bun', 50, 150, 28, 5, 1, 70, 'high', 200, 40, 3, 1, 0, 5, 4, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Chicken Bun', 'Roti Bun Ayam', ARRAY['chicken bread', 'savory bun'], 'breads', 'roti', ARRAY['snack', 'convenient'], '1 biji', '1 bun', 80, 220, 30, 4, 1, 68, 'medium', 380, 100, 8, 2, 0, 25, 8, 80, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Kaya Bun', 'Roti Bun Kaya', ARRAY['kaya bread', 'coconut jam bun'], 'breads', 'roti', ARRAY['snack', 'sweet', 'traditional'], '1 biji', '1 bun', 70, 200, 35, 15, 1, 72, 'high', 180, 50, 6, 3, 0, 15, 4, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cream Bun', 'Roti Bun Krim', ARRAY['cream bread', 'custard bun'], 'breads', 'roti', ARRAY['snack', 'sweet'], '1 biji', '1 bun', 80, 250, 38, 18, 1, 72, 'high', 200, 60, 10, 5, 0, 30, 5, 60, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Curry Bun (Japanese Style)', 'Roti Kari Jepun', ARRAY['curry bread', 'kare pan'], 'breads', 'roti', ARRAY['snack', 'japanese', 'fried'], '1 biji', '1 bun', 100, 280, 35, 4, 2, 65, 'medium', 420, 150, 12, 4, 0, 20, 8, 90, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- BREAKFAST ITEMS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('French Toast (Roti Telur Goyang)', 'Roti Telur Goyang', ARRAY['french toast', 'eggy bread'], 'breads', 'roti', ARRAY['breakfast', 'western', 'sweet'], '2 keping', '2 slices', 120, 320, 35, 12, 1, 68, 'medium', 420, 120, 16, 5, 0, 180, 10, 120, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Tuna Sandwich', 'Sandwic Tuna', ARRAY['tuna sandwich', 'tuna bread'], 'breads', 'sandwich', ARRAY['lunch', 'protein', 'convenient'], '1 sandwich', '1 sandwich', 150, 320, 32, 4, 2, 60, 'medium', 650, 220, 14, 3, 0, 35, 18, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Egg Mayo Sandwich', 'Sandwic Telur Mayo', ARRAY['egg sandwich', 'egg salad sandwich'], 'breads', 'sandwich', ARRAY['lunch', 'simple', 'convenient'], '1 sandwich', '1 sandwich', 140, 350, 30, 4, 1, 60, 'medium', 580, 140, 20, 5, 0, 220, 12, 150, 'caution', 'caution', 'limit', 'safe', 'ai_estimated', false),

('Chicken Sandwich', 'Sandwic Ayam', ARRAY['chicken sandwich', 'ayam sandwich'], 'breads', 'sandwich', ARRAY['lunch', 'protein', 'convenient'], '1 sandwich', '1 sandwich', 160, 380, 32, 4, 2, 60, 'medium', 720, 200, 18, 4, 0, 55, 22, 200, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Croissant Plain', 'Croissant', ARRAY['croissant', 'french pastry'], 'breads', 'pastry', ARRAY['breakfast', 'western', 'flaky'], '1 biji', '1 piece', 60, 230, 26, 5, 1, 68, 'medium', 320, 60, 12, 7, 0.5, 40, 5, 50, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false);

