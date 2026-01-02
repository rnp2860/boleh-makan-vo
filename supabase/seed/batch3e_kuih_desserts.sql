-- 🇲🇾 Malaysian Food Database - Batch 3E: Kuih & Desserts (50 foods)
-- All values per standard Malaysian serving

-- ============================================
-- TRADITIONAL KUIH
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kuih Sagu', 'Kuih Sagu', ARRAY['sago kuih', 'sagu gula melaka'], 'kuih', 'traditional', ARRAY['malay', 'traditional', 'sweet'], '3 biji', '3 pieces', 60, 140, 32, 18, 0, 65, 'medium', 20, 40, 2, 1.5, 0, 0, 0, 15, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Bangkit', 'Kuih Bangkit', ARRAY['tapioca cookies', 'coconut cookies'], 'kuih', 'raya', ARRAY['malay', 'raya', 'crispy'], '5 biji', '5 pieces', 30, 120, 20, 8, 0, 70, 'high', 15, 20, 4, 3, 0, 5, 1, 15, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Kapit', 'Kuih Kapit', ARRAY['love letters', 'egg roll cookies'], 'kuih', 'raya', ARRAY['chinese', 'raya', 'crispy'], '5 keping', '5 pieces', 25, 130, 18, 8, 0, 68, 'medium', 25, 30, 6, 2, 0, 35, 2, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Bahulu', 'Kuih Bahulu', ARRAY['mini sponge cake', 'bahulu'], 'kuih', 'traditional', ARRAY['malay', 'raya', 'sponge'], '3 biji', '3 pieces', 30, 100, 18, 10, 0, 70, 'high', 40, 30, 2, 0.5, 0, 45, 2, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Lidah', 'Kuih Lidah', ARRAY['tongue biscuit', 'lidah kucing'], 'kuih', 'raya', ARRAY['malay', 'raya', 'buttery'], '1 keping', '1 piece', 10, 50, 6, 3, 0, 68, 'medium', 25, 10, 3, 2, 0, 10, 0.5, 10, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Kochi', 'Kuih Koci', ARRAY['glutinous rice cake', 'koci'], 'kuih', 'traditional', ARRAY['malay', 'pandan', 'sweet'], '2 biji', '2 pieces', 80, 180, 35, 18, 1, 65, 'medium', 30, 80, 4, 3, 0, 0, 2, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Dadar', 'Kuih Dadar', ARRAY['pandan crepe coconut', 'dadar gulung'], 'kuih', 'traditional', ARRAY['malay', 'pandan', 'coconut'], '2 batang', '2 rolls', 80, 200, 35, 22, 2, 60, 'medium', 35, 100, 6, 5, 0, 15, 3, 45, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kuih Putu Piring', 'Kuih Putu Piring', ARRAY['steamed rice cake', 'putu piring'], 'kuih', 'traditional', ARRAY['malay', 'steamed', 'gula melaka'], '3 biji', '3 pieces', 90, 180, 38, 20, 1, 62, 'medium', 20, 60, 2, 1.5, 0, 0, 2, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Putu Bambu', 'Kuih Putu Bambu', ARRAY['bamboo tube cake', 'putu mayam'], 'kuih', 'traditional', ARRAY['indian', 'steamed', 'sweet'], '2 batang', '2 tubes', 80, 160, 35, 18, 1, 60, 'medium', 25, 50, 1, 0.5, 0, 0, 2, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Tepung Pelita', 'Kuih Tepung Pelita', ARRAY['coconut custard', 'pelita'], 'kuih', 'traditional', ARRAY['malay', 'coconut', 'two-layer'], '2 biji', '2 pieces', 80, 160, 24, 16, 0, 58, 'medium', 40, 70, 7, 5, 0, 10, 2, 35, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kuih Lompang', 'Kuih Lompang', ARRAY['well cake', 'kuih serabai'], 'kuih', 'traditional', ARRAY['malay', 'steamed', 'pandan'], '3 biji', '3 pieces', 60, 120, 25, 14, 0, 62, 'medium', 20, 40, 2, 1.5, 0, 0, 1, 20, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Ketayap', 'Kuih Ketayap', ARRAY['pandan crepe', 'kuih dadar'], 'kuih', 'traditional', ARRAY['malay', 'pandan', 'coconut'], '2 batang', '2 pieces', 80, 200, 35, 22, 2, 60, 'medium', 35, 100, 6, 5, 0, 15, 3, 45, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kuih Kaswi', 'Kuih Kaswi', ARRAY['steamed brown sugar cake', 'kaswi'], 'kuih', 'traditional', ARRAY['malay', 'brown sugar', 'steamed'], '2 potong', '2 pieces', 60, 150, 32, 20, 0, 65, 'medium', 25, 80, 2, 1.5, 0, 0, 1, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Serimuka', 'Kuih Seri Muka', ARRAY['glutinous rice custard', 'seri muka'], 'kuih', 'traditional', ARRAY['malay', 'pandan', 'popular'], '1 potong', '1 piece', 80, 180, 28, 14, 1, 65, 'medium', 40, 60, 6, 4, 0, 25, 3, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Bingka Labu', 'Kuih Bingka Labu', ARRAY['baked pumpkin cake', 'pumpkin kuih'], 'kuih', 'traditional', ARRAY['malay', 'pumpkin', 'baked'], '1 potong', '1 piece', 80, 160, 28, 18, 2, 58, 'medium', 50, 150, 5, 3, 0, 20, 2, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- NYONYA KUIH
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kuih Talam Pandan', 'Kuih Talam Pandan', ARRAY['pandan talam', 'two layer kuih'], 'kuih', 'nyonya', ARRAY['nyonya', 'pandan', 'coconut'], '1 potong', '1 piece', 60, 120, 22, 12, 0, 62, 'medium', 25, 50, 3, 2, 0, 0, 1, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Talam Keladi', 'Kuih Talam Keladi', ARRAY['yam talam', 'taro layer kuih'], 'kuih', 'nyonya', ARRAY['nyonya', 'yam', 'coconut'], '1 potong', '1 piece', 60, 130, 24, 13, 1, 60, 'medium', 30, 80, 3, 2, 0, 0, 1, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Lapis Pelangi', 'Kuih Lapis', ARRAY['rainbow layer cake', 'steamed layer cake'], 'kuih', 'nyonya', ARRAY['nyonya', 'colorful', 'festive'], '1 potong', '1 piece', 50, 140, 22, 14, 0, 65, 'medium', 30, 40, 5, 4, 0, 20, 2, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Onde-Onde Pandan', 'Onde-Onde', ARRAY['ondeh ondeh', 'pandan glutinous balls'], 'kuih', 'nyonya', ARRAY['nyonya', 'gula melaka', 'pandan'], '3 biji', '3 pieces', 60, 150, 30, 18, 1, 62, 'medium', 20, 80, 3, 2, 0, 0, 2, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Pie Tee', 'Kuih Pie Tee', ARRAY['top hats', 'nyonya cups'], 'kuih', 'nyonya', ARRAY['nyonya', 'savory', 'crispy'], '5 biji', '5 pieces', 75, 180, 22, 4, 2, 55, 'low', 380, 180, 8, 2, 0, 15, 5, 60, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Kuih Angku', 'Kuih Angku', ARRAY['red tortoise cake', 'ang ku kueh'], 'kuih', 'nyonya', ARRAY['chinese', 'festive', 'mung bean'], '1 biji', '1 piece', 50, 120, 24, 12, 1, 58, 'medium', 25, 80, 2, 0.5, 0, 0, 3, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- CAKES & PASTRIES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kek Lapis Sarawak', 'Kek Lapis Sarawak', ARRAY['sarawak layer cake', 'thousand layer cake'], 'desserts', 'cake', ARRAY['sarawak', 'festive', 'premium'], '1 slice', '1 slice', 50, 220, 24, 18, 0, 65, 'medium', 80, 60, 12, 6, 0, 85, 4, 70, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kek Batik', 'Kek Batik', ARRAY['chocolate biscuit cake', 'batik cake'], 'desserts', 'cake', ARRAY['malay', 'no-bake', 'chocolate'], '1 slice', '1 slice', 60, 280, 32, 22, 1, 60, 'medium', 120, 120, 16, 10, 0, 45, 4, 80, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kek Marble', 'Kek Marble', ARRAY['marble cake', 'butter cake'], 'desserts', 'cake', ARRAY['western', 'classic', 'buttery'], '1 slice', '1 slice', 80, 320, 38, 22, 1, 65, 'medium', 180, 80, 18, 10, 0, 90, 5, 90, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kek Pandan', 'Kek Pandan', ARRAY['pandan cake', 'pandan chiffon'], 'desserts', 'cake', ARRAY['local', 'pandan', 'light'], '1 slice', '1 slice', 70, 220, 30, 18, 0, 60, 'medium', 120, 60, 10, 4, 0, 80, 4, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Swiss Roll', 'Swiss Roll', ARRAY['jam roll', 'cream roll'], 'desserts', 'cake', ARRAY['western', 'cream', 'classic'], '1 slice', '1 slice', 60, 180, 28, 18, 0, 62, 'medium', 100, 50, 6, 3, 0, 55, 3, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cream Puff', 'Krim Puf', ARRAY['choux pastry', 'profiterole'], 'desserts', 'pastry', ARRAY['western', 'cream', 'light'], '1 biji', '1 piece', 60, 180, 18, 10, 0, 55, 'low', 80, 50, 10, 6, 0, 65, 3, 60, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Donut (Glazed)', 'Donat Glaze', ARRAY['glazed donut', 'donut biasa'], 'desserts', 'pastry', ARRAY['western', 'sweet', 'fried'], '1 biji', '1 piece', 60, 250, 32, 16, 1, 72, 'high', 200, 50, 12, 5, 0.5, 15, 3, 40, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Churros', 'Churros', ARRAY['spanish donut', 'fried dough'], 'desserts', 'pastry', ARRAY['western', 'fried', 'cinnamon'], '3 batang', '3 pieces', 80, 280, 35, 15, 1, 68, 'medium', 180, 60, 14, 4, 0.5, 20, 4, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- COLD DESSERTS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('ABC (Ais Batu Campur)', 'ABC', ARRAY['shaved ice', 'ice kacang'], 'desserts', 'ais', ARRAY['local', 'refreshing', 'colorful'], '1 mangkuk', '1 bowl', 350, 280, 58, 48, 3, 60, 'medium', 80, 200, 5, 4, 0, 10, 4, 80, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cendol', 'Cendol', ARRAY['pandan jelly drink', 'chendol'], 'desserts', 'ais', ARRAY['local', 'gula melaka', 'coconut'], '1 mangkuk', '1 bowl', 300, 320, 55, 42, 2, 58, 'medium', 70, 180, 12, 10, 0, 0, 3, 50, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Ais Kacang', 'Ais Kacang', ARRAY['red bean shaved ice', 'ice beans'], 'desserts', 'ais', ARRAY['local', 'beans', 'refreshing'], '1 mangkuk', '1 bowl', 350, 300, 60, 45, 4, 58, 'medium', 85, 250, 5, 3, 0, 10, 6, 100, 'limit', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Bubur Cha Cha (Cold)', 'Bubur Cha Cha Sejuk', ARRAY['chilled cha cha', 'cold coconut dessert'], 'desserts', 'bubur', ARRAY['nyonya', 'coconut', 'cold'], '1 mangkuk', '1 bowl', 300, 320, 50, 35, 4, 55, 'low', 65, 350, 12, 10, 0, 0, 4, 80, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Ice Cream', 'Aiskrim', ARRAY['ice cream', 'gelato'], 'desserts', 'ice cream', ARRAY['western', 'cold', 'creamy'], '1 scoop', '1 scoop', 70, 140, 16, 14, 0, 55, 'low', 50, 100, 7, 4.5, 0, 30, 2, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Frozen Yogurt', 'Yogurt Beku', ARRAY['froyo', 'frozen yoghurt'], 'desserts', 'ice cream', ARRAY['western', 'healthy-ish', 'tangy'], '1 cup', '1 cup', 150, 180, 32, 28, 0, 50, 'low', 100, 220, 4, 2.5, 0, 15, 6, 150, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Durian Ice Cream', 'Aiskrim Durian', ARRAY['durian gelato', 'king of fruits ice cream'], 'desserts', 'ice cream', ARRAY['local', 'durian', 'creamy'], '1 scoop', '1 scoop', 70, 180, 18, 15, 1, 55, 'low', 40, 150, 10, 6, 0, 25, 2, 60, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false);

-- ============================================
-- HOT DESSERTS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Pengat Pisang', 'Pengat Pisang', ARRAY['banana in coconut', 'pisang pengat'], 'desserts', 'bubur', ARRAY['malay', 'banana', 'coconut'], '1 mangkuk', '1 bowl', 250, 280, 48, 35, 3, 55, 'low', 50, 450, 10, 8, 0, 0, 3, 60, 'caution', 'safe', 'caution', 'caution', 'ai_estimated', false),

('Bubur Kacang Hijau', 'Bubur Kacang Hijau', ARRAY['mung bean porridge', 'green bean dessert'], 'desserts', 'bubur', ARRAY['malay', 'mung bean', 'warm'], '1 mangkuk', '1 bowl', 300, 280, 52, 28, 4, 55, 'low', 80, 280, 4, 2, 0, 10, 8, 120, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Bubur Pulut Hitam', 'Bubur Pulut Hitam', ARRAY['black rice porridge', 'black glutinous rice'], 'desserts', 'bubur', ARRAY['malay', 'black rice', 'warm'], '1 mangkuk', '1 bowl', 300, 320, 58, 30, 3, 58, 'medium', 60, 180, 8, 5, 0, 15, 6, 100, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Sago Gula Melaka', 'Sago Gula Melaka', ARRAY['sago palm sugar', 'sago pudding'], 'desserts', 'bubur', ARRAY['malay', 'gula melaka', 'coconut'], '1 mangkuk', '1 bowl', 200, 250, 48, 32, 0, 60, 'medium', 40, 100, 6, 5, 0, 10, 1, 30, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Pisang Goreng', 'Pisang Goreng', ARRAY['fried banana', 'banana fritters'], 'desserts', 'goreng', ARRAY['local', 'snack', 'popular'], '3 biji', '3 pieces', 120, 280, 42, 20, 3, 58, 'medium', 80, 350, 12, 3, 0, 0, 3, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cekodok', 'Cekodok', ARRAY['banana balls', 'fried banana dough'], 'desserts', 'goreng', ARRAY['malay', 'banana', 'snack'], '3 biji', '3 pieces', 60, 180, 28, 12, 2, 60, 'medium', 120, 180, 6, 1.5, 0, 10, 3, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Jemput-Jemput Pisang', 'Jemput-Jemput Pisang', ARRAY['banana fritters malay', 'cucur pisang'], 'desserts', 'goreng', ARRAY['malay', 'banana', 'tea time'], '3 biji', '3 pieces', 60, 170, 26, 12, 2, 58, 'medium', 100, 200, 6, 1.5, 0, 10, 2, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- RAYA & FESTIVE
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kuih Raya Assorted', 'Kuih Raya Campuran', ARRAY['raya cookies', 'festive cookies'], 'kuih', 'raya', ARRAY['raya', 'festive', 'assorted'], '5 biji', '5 pieces', 50, 250, 30, 16, 1, 65, 'medium', 80, 60, 14, 6, 0, 40, 3, 50, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Dodol', 'Dodol', ARRAY['sticky sweet', 'glutinous rice candy'], 'kuih', 'festive', ARRAY['malay', 'raya', 'sticky'], '2 potong', '2 pieces', 40, 160, 32, 24, 0, 65, 'medium', 20, 60, 4, 3, 0, 5, 1, 20, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Wajik', 'Wajik', ARRAY['sticky rice diamond', 'glutinous rice cake'], 'kuih', 'festive', ARRAY['malay', 'gula melaka', 'raya'], '2 potong', '2 pieces', 60, 180, 35, 20, 1, 62, 'medium', 25, 50, 4, 3, 0, 0, 2, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Lepat Pisang', 'Lepat Pisang', ARRAY['steamed banana cake', 'banana leaf cake'], 'kuih', 'traditional', ARRAY['malay', 'banana', 'steamed'], '2 biji', '2 pieces', 80, 180, 35, 20, 2, 55, 'low', 30, 280, 4, 3, 0, 0, 2, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Tapai Ubi', 'Tapai Ubi', ARRAY['fermented tapioca', 'tapai singkong'], 'kuih', 'traditional', ARRAY['malay', 'fermented', 'traditional'], '100g', '100g serving', 100, 160, 38, 15, 2, 58, 'medium', 20, 180, 0.5, 0, 0, 0, 1, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Tapai Pulut', 'Tapai Pulut', ARRAY['fermented glutinous rice', 'rice wine starter'], 'kuih', 'traditional', ARRAY['malay', 'fermented', 'alcoholic'], '100g', '100g serving', 100, 200, 42, 18, 1, 65, 'medium', 15, 60, 0.5, 0, 0, 0, 3, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Serawa Durian', 'Serawa Durian', ARRAY['durian cream', 'coconut durian sauce'], 'desserts', 'serawa', ARRAY['malay', 'durian', 'rich'], '1 mangkuk', '1 bowl', 150, 320, 35, 28, 3, 55, 'low', 40, 380, 20, 15, 0, 10, 3, 60, 'caution', 'safe', 'limit', 'safe', 'ai_estimated', false);

