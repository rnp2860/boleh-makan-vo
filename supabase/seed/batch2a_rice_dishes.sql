-- 🇲🇾 Malaysian Food Database - Batch 2A: Rice Dishes (40 foods)
-- All values per standard Malaysian serving

-- ============================================
-- NASI VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Nasi Kerabu (Kelantan Blue Rice)', 'Nasi Kerabu', ARRAY['nasi kerabu', 'blue rice', 'kelantan rice'], 'rice_dishes', 'nasi', ARRAY['kelantan', 'traditional', 'lunch'], '1 pinggan', '1 plate', 400, 580, 75, 4, 4, 68, 'medium', 850, 320, 22, 6, 0, 75, 24, 200, 'limit', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Nasi Dagang (Terengganu Fish Rice)', 'Nasi Dagang', ARRAY['nasi dagang', 'terengganu rice', 'fish rice'], 'rice_dishes', 'nasi', ARRAY['terengganu', 'traditional', 'breakfast'], '1 pinggan', '1 plate', 450, 620, 78, 3, 3, 65, 'medium', 780, 380, 24, 8, 0, 85, 28, 240, 'limit', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Nasi Ulam (Herb Rice)', 'Nasi Ulam', ARRAY['nasi ulam', 'herb rice', 'ulam rice'], 'rice_dishes', 'nasi', ARRAY['healthy', 'traditional', 'kelantan'], '1 pinggan', '1 plate', 350, 380, 58, 2, 5, 62, 'medium', 420, 280, 12, 3, 0, 45, 12, 140, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Nasi Tomato (Tomato Rice)', 'Nasi Tomato', ARRAY['nasi tomato', 'tomato rice'], 'rice_dishes', 'nasi', ARRAY['malay', 'wedding', 'festive'], '1 pinggan', '1 plate', 300, 420, 68, 4, 2, 72, 'high', 580, 240, 12, 4, 0, 20, 8, 120, 'limit', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Nasi Minyak (Ghee Rice)', 'Nasi Minyak', ARRAY['nasi minyak', 'ghee rice', 'butter rice'], 'rice_dishes', 'nasi', ARRAY['malay', 'wedding', 'festive'], '1 pinggan', '1 plate', 300, 480, 65, 2, 1, 73, 'high', 450, 180, 20, 10, 0, 35, 7, 100, 'limit', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Nasi Impit (Compressed Rice)', 'Nasi Impit', ARRAY['nasi impit', 'compressed rice', 'ketupat rice'], 'rice_dishes', 'nasi', ARRAY['raya', 'satay', 'traditional'], '2 ketul', '2 pieces', 120, 180, 40, 0, 1, 75, 'high', 10, 35, 0.3, 0.1, 0, 0, 4, 45, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Nasi Campur (Mixed Rice)', 'Nasi Campur', ARRAY['nasi campur', 'mixed rice', 'economy rice'], 'rice_dishes', 'nasi', ARRAY['lunch', 'dinner', 'popular'], '1 pinggan', '1 plate', 450, 720, 82, 5, 3, 70, 'high', 1100, 350, 28, 9, 0, 95, 28, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Kukus Ayam (Steamed Rice with Fried Chicken)', 'Nasi Kukus Ayam', ARRAY['nasi kukus', 'steamed rice chicken'], 'rice_dishes', 'nasi', ARRAY['lunch', 'popular', 'malay'], '1 set', '1 set', 400, 680, 78, 2, 2, 72, 'high', 920, 300, 28, 8, 0, 110, 30, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Paprik Ayam (Thai Paprik Chicken Rice)', 'Nasi Paprik', ARRAY['nasi paprik', 'paprik rice', 'thai rice'], 'rice_dishes', 'nasi', ARRAY['thai', 'lunch', 'spicy'], '1 pinggan', '1 plate', 420, 650, 75, 6, 2, 70, 'high', 1050, 340, 26, 7, 0, 85, 28, 210, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Ayam Geprek (Smashed Chicken Rice)', 'Nasi Ayam Geprek', ARRAY['ayam geprek', 'geprek rice', 'indonesian chicken'], 'rice_dishes', 'nasi', ARRAY['indonesian', 'spicy', 'trending'], '1 pinggan', '1 plate', 400, 720, 72, 4, 2, 70, 'high', 980, 320, 32, 9, 0, 120, 32, 250, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- NASI GORENG VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Nasi Goreng Ikan Masin (Salted Fish Fried Rice)', 'Nasi Goreng Ikan Masin', ARRAY['fried rice salted fish', 'nasi goreng ikan bilis'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'dinner', 'salty'], '1 pinggan', '1 plate', 350, 580, 68, 3, 2, 70, 'high', 1450, 280, 24, 6, 0, 65, 18, 180, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Goreng Cina (Chinese Fried Rice)', 'Nasi Goreng Cina', ARRAY['chinese fried rice', 'nasi goreng chinese'], 'rice_dishes', 'nasi goreng', ARRAY['chinese', 'dinner', 'hawker'], '1 pinggan', '1 plate', 350, 520, 65, 3, 2, 70, 'high', 980, 260, 20, 5, 0, 120, 16, 170, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Goreng Pattaya (Omelette Wrapped Fried Rice)', 'Nasi Goreng Pattaya', ARRAY['pattaya rice', 'omelette rice'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'dinner', 'popular'], '1 pinggan', '1 plate', 400, 680, 72, 5, 2, 70, 'high', 1150, 300, 30, 8, 0, 220, 22, 200, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Nasi Goreng Daging (Beef Fried Rice)', 'Nasi Goreng Daging', ARRAY['beef fried rice', 'nasi goreng beef'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'dinner', 'protein'], '1 pinggan', '1 plate', 380, 620, 68, 4, 2, 70, 'high', 1100, 340, 26, 8, 0, 75, 24, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Goreng Seafood', 'Nasi Goreng Seafood', ARRAY['seafood fried rice', 'nasi goreng laut'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'dinner', 'seafood'], '1 pinggan', '1 plate', 380, 580, 66, 4, 2, 70, 'high', 1200, 320, 22, 5, 0, 150, 22, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Nasi Goreng Telur (Egg Fried Rice)', 'Nasi Goreng Telur', ARRAY['egg fried rice', 'simple fried rice'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'simple', 'budget'], '1 pinggan', '1 plate', 320, 450, 62, 2, 2, 70, 'high', 850, 220, 16, 4, 0, 185, 12, 150, 'limit', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Nasi Goreng Sambal', 'Nasi Goreng Sambal', ARRAY['sambal fried rice', 'spicy fried rice'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'spicy', 'dinner'], '1 pinggan', '1 plate', 350, 520, 65, 5, 2, 70, 'high', 1050, 260, 20, 5, 0, 45, 14, 160, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false),

('Nasi Goreng Belacan (Shrimp Paste Fried Rice)', 'Nasi Goreng Belacan', ARRAY['belacan fried rice', 'shrimp paste rice'], 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'spicy', 'aromatic'], '1 pinggan', '1 plate', 350, 540, 66, 4, 2, 70, 'high', 1300, 270, 22, 5, 0, 55, 15, 170, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false);

-- ============================================
-- PORRIDGE
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Bubur Ayam (Chicken Porridge)', 'Bubur Ayam', ARRAY['chicken porridge', 'congee chicken'], 'porridge', 'bubur', ARRAY['breakfast', 'comfort', 'sick food'], '1 mangkuk', '1 bowl', 400, 320, 45, 2, 1, 78, 'high', 750, 280, 8, 2, 0, 55, 18, 160, 'caution', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Bubur Nasi (Plain Rice Porridge)', 'Bubur Nasi', ARRAY['plain porridge', 'rice congee'], 'porridge', 'bubur', ARRAY['breakfast', 'simple', 'sick food'], '1 mangkuk', '1 bowl', 350, 180, 38, 0, 1, 80, 'high', 120, 80, 0.5, 0.1, 0, 0, 4, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Bubur Ikan (Fish Porridge)', 'Bubur Ikan', ARRAY['fish porridge', 'congee fish'], 'porridge', 'bubur', ARRAY['breakfast', 'healthy', 'cantonese'], '1 mangkuk', '1 bowl', 400, 280, 42, 1, 1, 78, 'high', 680, 320, 6, 1.5, 0, 45, 16, 180, 'caution', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Bubur McD (McDonald''s Porridge)', 'Bubur McD', ARRAY['mcd porridge', 'mcdonalds bubur'], 'porridge', 'bubur', ARRAY['breakfast', 'fast food'], '1 mangkuk', '1 bowl', 350, 290, 44, 2, 1, 78, 'high', 820, 250, 7, 2, 0, 50, 15, 150, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- OTHER RICE DISHES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Claypot Chicken Rice', 'Nasi Ayam Claypot', ARRAY['claypot rice', 'clay pot chicken'], 'rice_dishes', 'nasi', ARRAY['chinese', 'dinner', 'popular'], '1 periuk', '1 claypot', 450, 720, 82, 6, 2, 72, 'high', 1250, 380, 26, 7, 0, 95, 32, 260, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Lontong (Rice Cake in Gravy)', 'Lontong', ARRAY['lontong sayur', 'rice cake gravy'], 'rice_dishes', 'nasi', ARRAY['malay', 'breakfast', 'traditional'], '1 mangkuk', '1 bowl', 400, 450, 58, 4, 3, 68, 'medium', 780, 320, 18, 10, 0, 35, 12, 140, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Ketupat (Rice Dumpling)', 'Ketupat', ARRAY['ketupat', 'rice cake', 'kupat'], 'rice_dishes', 'nasi', ARRAY['raya', 'traditional', 'festive'], '2 biji', '2 pieces', 160, 220, 48, 0, 1, 75, 'high', 15, 45, 0.4, 0.1, 0, 0, 5, 55, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Lemang (Bamboo Rice)', 'Lemang', ARRAY['lemang', 'bamboo glutinous rice'], 'rice_dishes', 'nasi', ARRAY['raya', 'traditional', 'festive'], '1 batang', '1 piece', 150, 320, 52, 2, 2, 72, 'high', 180, 120, 10, 8, 0, 0, 5, 80, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Pulut Kuning (Yellow Glutinous Rice)', 'Pulut Kuning', ARRAY['yellow glutinous rice', 'pulut kunyit'], 'rice_dishes', 'pulut', ARRAY['festive', 'traditional', 'kenduri'], '1 hidangan', '1 serving', 150, 280, 55, 3, 1, 70, 'high', 120, 80, 6, 4, 0, 15, 5, 70, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Pulut Panggang (Grilled Glutinous Rice)', 'Pulut Panggang', ARRAY['grilled glutinous rice', 'pulut bakar'], 'rice_dishes', 'pulut', ARRAY['snack', 'traditional', 'kelantan'], '2 batang', '2 pieces', 120, 280, 42, 4, 1, 68, 'medium', 350, 140, 10, 6, 0, 25, 8, 100, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Nasi Ambeng (Javanese Rice Platter)', 'Nasi Ambeng', ARRAY['nasi ambeng', 'javanese rice', 'nasi ambang'], 'rice_dishes', 'nasi', ARRAY['javanese', 'sharing', 'festive'], '1 hidangan', '1 serving', 500, 850, 95, 6, 4, 70, 'high', 1350, 420, 35, 12, 0, 110, 32, 280, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Nasi Arab (Arab Rice with Lamb)', 'Nasi Arab', ARRAY['nasi arab', 'arab rice', 'mandhi rice'], 'rice_dishes', 'nasi', ARRAY['arab', 'lamb', 'festive'], '1 pinggan', '1 plate', 450, 780, 75, 3, 2, 68, 'medium', 980, 420, 35, 12, 0, 95, 38, 300, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false);

-- ============================================
-- ECONOMY RICE ADD-ONS (Lauk Pauk)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Sayur Campur (Mixed Vegetables)', 'Sayur Campur', ARRAY['mixed vegetables', 'sayur campuran'], 'vegetables', 'lauk', ARRAY['healthy', 'nasi campur', 'vegetarian'], '1 senduk', '1 scoop', 80, 45, 6, 2, 3, 35, 'low', 280, 180, 2, 0.5, 0, 0, 2, 40, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kangkung Belacan (Water Spinach with Shrimp Paste)', 'Kangkung Belacan', ARRAY['kangkung', 'water spinach', 'morning glory'], 'vegetables', 'lauk', ARRAY['healthy', 'nasi campur', 'spicy'], '1 senduk', '1 scoop', 100, 80, 4, 1, 2, 25, 'low', 520, 320, 5, 1, 0, 15, 3, 50, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Sambal Sotong (Sambal Squid)', 'Sambal Sotong', ARRAY['squid sambal', 'sotong pedas'], 'protein', 'lauk', ARRAY['seafood', 'nasi campur', 'spicy'], '1 hidangan', '1 serving', 100, 180, 8, 4, 1, 40, 'low', 680, 280, 10, 2, 0, 180, 14, 200, 'safe', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Ayam Masak Merah (Red Chicken Curry)', 'Ayam Masak Merah', ARRAY['red chicken', 'ayam merah'], 'protein', 'lauk', ARRAY['malay', 'nasi campur', 'wedding'], '1 ketul', '1 piece', 120, 220, 8, 5, 1, 45, 'low', 580, 250, 12, 4, 0, 85, 18, 170, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Rendang Ayam (Dry Chicken Curry)', 'Rendang Ayam', ARRAY['chicken rendang', 'dry chicken curry'], 'protein', 'lauk', ARRAY['malay', 'festive', 'raya'], '1 ketul', '1 piece', 100, 200, 5, 2, 1, 35, 'low', 420, 280, 14, 8, 0, 75, 16, 160, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Rendang Daging (Beef Rendang)', 'Rendang Daging', ARRAY['beef rendang', 'dry beef curry'], 'protein', 'lauk', ARRAY['malay', 'festive', 'raya'], '1 hidangan', '1 serving', 100, 250, 4, 2, 1, 30, 'low', 480, 320, 18, 10, 0, 65, 18, 180, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Sambal Telur (Egg in Sambal)', 'Sambal Telur', ARRAY['egg sambal', 'telur masak sambal'], 'protein', 'lauk', ARRAY['malay', 'nasi campur', 'budget'], '1 biji', '1 egg', 70, 120, 4, 2, 0, 40, 'low', 380, 90, 8, 2.5, 0, 186, 7, 100, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Ikan Kicap (Fish in Soy Sauce)', 'Ikan Kicap', ARRAY['soy sauce fish', 'ikan masak kicap'], 'protein', 'lauk', ARRAY['chinese', 'nasi campur', 'simple'], '1 ketul', '1 piece', 100, 150, 6, 3, 0, 35, 'low', 720, 280, 6, 1.5, 0, 55, 18, 200, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Paru Goreng (Fried Beef Lung)', 'Paru Goreng', ARRAY['fried lung', 'beef lung'], 'protein', 'lauk', ARRAY['malay', 'nasi campur', 'offal'], '1 hidangan', '1 serving', 80, 180, 8, 1, 0, 40, 'low', 420, 180, 12, 4, 0, 120, 12, 180, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Kerang Bakar (Grilled Cockles)', 'Kerang Bakar', ARRAY['grilled cockles', 'kerang panggang'], 'protein', 'lauk', ARRAY['seafood', 'hawker', 'grilled'], '10 biji', '10 pieces', 100, 120, 5, 1, 0, 30, 'low', 580, 320, 4, 1, 0, 120, 16, 280, 'safe', 'caution', 'caution', 'limit', 'ai_estimated', false);

