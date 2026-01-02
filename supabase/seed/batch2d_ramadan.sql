-- 🇲🇾 Malaysian Food Database - Batch 2D: Ramadan Specials (50 foods)
-- *** HIGHEST PRIORITY - Must be accurate ***
-- All values per standard Malaysian serving

-- ============================================
-- IFTAR STARTERS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Ajwa Dates (Premium)', 'Kurma Ajwa', ARRAY['ajwa dates', 'kurma ajwa', 'madinah dates'], 'fruits', 'dried', ARRAY['ramadan', 'iftar', 'premium', 'sunnah'], '3 biji', '3 pieces', 35, 95, 25, 22, 2, 42, 'low', 1, 200, 0, 0, 0, 0, 1, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Medjool Dates', 'Kurma Medjool', ARRAY['medjool', 'king dates', 'kurma besar'], 'fruits', 'dried', ARRAY['ramadan', 'iftar', 'premium'], '3 biji', '3 pieces', 70, 200, 54, 48, 5, 45, 'low', 2, 420, 0, 0, 0, 0, 2, 45, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Deglet Noor Dates', 'Kurma Deglet Noor', ARRAY['deglet noor', 'algeria dates'], 'fruits', 'dried', ARRAY['ramadan', 'iftar', 'common'], '3 biji', '3 pieces', 35, 85, 23, 20, 2, 42, 'low', 1, 180, 0, 0, 0, 0, 1, 22, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Bubur Kacang Hijau (Green Bean Porridge)', 'Bubur Kacang Hijau', ARRAY['green bean porridge', 'mung bean dessert'], 'desserts', 'bubur', ARRAY['ramadan', 'iftar', 'traditional', 'sweet'], '1 mangkuk', '1 bowl', 300, 280, 52, 28, 4, 55, 'low', 80, 280, 4, 2, 0, 10, 8, 120, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Bubur Pulut Hitam (Black Glutinous Rice)', 'Bubur Pulut Hitam', ARRAY['black rice porridge', 'pulut hitam'], 'desserts', 'bubur', ARRAY['ramadan', 'iftar', 'traditional', 'sweet'], '1 mangkuk', '1 bowl', 300, 320, 58, 30, 3, 58, 'medium', 60, 180, 8, 5, 0, 15, 6, 100, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Bubur Cha Cha', 'Bubur Cha Cha', ARRAY['cha cha', 'mixed dessert soup'], 'desserts', 'bubur', ARRAY['ramadan', 'nyonya', 'iftar', 'sweet'], '1 mangkuk', '1 bowl', 300, 350, 55, 35, 4, 58, 'medium', 70, 350, 12, 10, 0, 0, 4, 80, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kolak Pisang (Banana in Coconut Milk)', 'Kolak Pisang', ARRAY['banana kolak', 'pisang dalam santan'], 'desserts', 'bubur', ARRAY['ramadan', 'iftar', 'indonesian'], '1 mangkuk', '1 bowl', 250, 280, 45, 32, 3, 55, 'low', 50, 420, 10, 8, 0, 0, 3, 60, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Air Tebu (Sugarcane Juice)', 'Air Tebu', ARRAY['sugarcane juice', 'tebu'], 'drinks', 'natural', ARRAY['ramadan', 'iftar', 'bazaar', 'sweet'], '1 gelas', '1 glass', 350, 180, 45, 42, 0, 65, 'medium', 15, 180, 0, 0, 0, 0, 0, 10, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Air Soya (Soy Milk)', 'Air Soya', ARRAY['soy milk', 'susu soya'], 'drinks', 'milk', ARRAY['ramadan', 'iftar', 'healthy'], '1 gelas', '1 glass', 300, 120, 12, 8, 1, 35, 'low', 100, 300, 5, 0.8, 0, 0, 8, 120, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Air Jagung (Corn Drink)', 'Air Jagung', ARRAY['corn drink', 'sweet corn drink'], 'drinks', 'sweet', ARRAY['ramadan', 'iftar', 'bazaar', 'sweet'], '1 gelas', '1 glass', 300, 180, 38, 28, 2, 55, 'low', 80, 200, 3, 1, 0, 5, 4, 80, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- BAZAAR RAMADAN POPULAR ITEMS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Ayam Percik (Grilled Chicken with Sauce)', 'Ayam Percik', ARRAY['percik chicken', 'grilled chicken percik'], 'protein', 'chicken', ARRAY['ramadan', 'bazaar', 'iftar', 'grilled'], '1 ketul', '1 piece', 150, 280, 8, 5, 1, 40, 'low', 580, 320, 16, 5, 0, 95, 26, 220, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Satay Ayam (Chicken Satay)', 'Satay Ayam', ARRAY['chicken satay', 'sate ayam'], 'protein', 'chicken', ARRAY['ramadan', 'bazaar', 'popular', 'grilled'], '10 cucuk', '10 sticks', 150, 380, 12, 6, 1, 45, 'low', 720, 350, 22, 6, 0, 85, 32, 280, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Satay Daging (Beef Satay)', 'Satay Daging', ARRAY['beef satay', 'sate daging'], 'protein', 'beef', ARRAY['ramadan', 'bazaar', 'popular', 'grilled'], '10 cucuk', '10 sticks', 150, 420, 12, 6, 1, 45, 'low', 780, 380, 26, 10, 0, 75, 34, 300, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Kuah Kacang (Peanut Sauce)', 'Kuah Kacang', ARRAY['peanut sauce', 'satay sauce'], 'condiments', 'sauce', ARRAY['ramadan', 'satay', 'bazaar'], '1 mangkuk kecil', '1 small bowl', 80, 180, 14, 8, 2, 35, 'low', 380, 180, 12, 3, 0, 0, 6, 100, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Nasi Berlauk (Rice with Dishes)', 'Nasi Berlauk', ARRAY['packed rice', 'nasi bungkus'], 'rice_dishes', 'nasi', ARRAY['ramadan', 'bazaar', 'iftar', 'convenient'], '1 bungkus', '1 packet', 400, 650, 78, 5, 3, 70, 'high', 980, 350, 28, 9, 0, 85, 24, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Ayam Golek (Rotisserie Chicken)', 'Ayam Golek', ARRAY['rotisserie chicken', 'whole roasted chicken'], 'protein', 'chicken', ARRAY['ramadan', 'bazaar', 'sharing'], '1/4 ekor', '1/4 chicken', 180, 350, 4, 2, 0, 35, 'low', 680, 350, 22, 6, 0, 130, 34, 280, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Kambing Bakar (Grilled Lamb)', 'Kambing Bakar', ARRAY['grilled lamb', 'bbq lamb'], 'protein', 'lamb', ARRAY['ramadan', 'bazaar', 'premium'], '1 hidangan', '1 serving', 150, 380, 2, 1, 0, 30, 'low', 450, 320, 28, 12, 0, 95, 30, 250, 'safe', 'caution', 'limit', 'limit', 'ai_estimated', false),

('Ikan Bakar (Grilled Fish)', 'Ikan Bakar', ARRAY['grilled fish', 'bbq fish'], 'protein', 'fish', ARRAY['ramadan', 'bazaar', 'healthy'], '1 ekor sederhana', '1 medium fish', 200, 280, 4, 2, 0, 30, 'low', 520, 480, 12, 3, 0, 80, 38, 340, 'safe', 'caution', 'safe', 'limit', 'ai_estimated', false),

('Sotong Bakar (Grilled Squid)', 'Sotong Bakar', ARRAY['grilled squid', 'bbq squid'], 'protein', 'seafood', ARRAY['ramadan', 'bazaar', 'popular'], '1 hidangan', '1 serving', 120, 180, 6, 3, 0, 35, 'low', 580, 350, 8, 2, 0, 200, 20, 280, 'safe', 'caution', 'limit', 'limit', 'ai_estimated', false),

('Keropok Lekor (Fish Crackers)', 'Keropok Lekor', ARRAY['fish crackers', 'lekor', 'terengganu snack'], 'snacks', 'keropok', ARRAY['ramadan', 'bazaar', 'terengganu'], '5 batang', '5 pieces', 100, 220, 32, 2, 1, 65, 'medium', 680, 180, 8, 2, 0, 35, 8, 120, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- KUIH BAZAAR RAMADAN
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kuih Seri Muka (Glutinous Rice Custard)', 'Kuih Seri Muka', ARRAY['seri muka', 'pandan custard rice'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional', 'popular'], '1 potong', '1 piece', 80, 180, 28, 14, 1, 65, 'medium', 40, 60, 6, 4, 0, 25, 3, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Talam', 'Kuih Talam', ARRAY['talam cake', 'two layer kuih'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional'], '1 potong', '1 piece', 60, 120, 22, 12, 0, 62, 'medium', 25, 50, 3, 2, 0, 0, 1, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Ketayap (Pandan Crepe)', 'Kuih Ketayap', ARRAY['ketayap', 'pandan crepe', 'dadar gulung'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional'], '2 batang', '2 pieces', 80, 200, 35, 22, 2, 60, 'medium', 35, 100, 6, 5, 0, 15, 3, 45, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Kuih Kosui', 'Kuih Kosui', ARRAY['kosui', 'palm sugar kuih'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional'], '3 biji', '3 pieces', 60, 140, 30, 18, 1, 65, 'medium', 20, 40, 2, 1.5, 0, 0, 1, 20, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Cara (Mini Pancakes)', 'Kuih Cara', ARRAY['cara berlauk', 'mini pancakes'], 'kuih', 'kuih masin', ARRAY['ramadan', 'bazaar', 'traditional'], '5 biji', '5 pieces', 75, 180, 22, 8, 1, 60, 'medium', 280, 80, 8, 3, 0, 45, 5, 60, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Bakar', 'Kuih Bakar', ARRAY['baked kuih', 'grilled kuih'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional'], '1 potong', '1 piece', 80, 200, 35, 20, 1, 68, 'medium', 60, 90, 6, 4, 0, 25, 3, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Bingka Ubi (Baked Tapioca)', 'Kuih Bingka Ubi', ARRAY['baked tapioca', 'tapioca cake'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional'], '1 potong', '1 piece', 80, 180, 32, 18, 1, 70, 'high', 50, 120, 5, 4, 0, 20, 2, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kuih Keria (Sweet Potato Doughnut)', 'Kuih Keria', ARRAY['keria', 'sweet potato donut'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'traditional'], '2 biji', '2 pieces', 80, 220, 42, 22, 2, 65, 'medium', 80, 280, 5, 2, 0, 0, 2, 45, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cek Mek Molek (Sweet Potato Fritters)', 'Cek Mek Molek', ARRAY['sweet potato fritters', 'fried sweet potato'], 'kuih', 'kuih manis', ARRAY['ramadan', 'bazaar', 'kelantan'], '3 biji', '3 pieces', 90, 250, 45, 20, 2, 62, 'medium', 60, 320, 7, 2, 0, 0, 3, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cucur Udang (Prawn Fritters)', 'Cucur Udang', ARRAY['prawn fritters', 'jemput udang'], 'kuih', 'kuih masin', ARRAY['ramadan', 'bazaar', 'popular'], '5 biji', '5 pieces', 100, 280, 28, 3, 1, 60, 'medium', 580, 180, 16, 3, 0, 55, 10, 120, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- RAMADAN DRINKS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Bandung Soda', 'Bandung Soda', ARRAY['rose soda', 'pink soda'], 'drinks', 'sweet', ARRAY['ramadan', 'bazaar', 'popular'], '1 gelas', '1 glass', 350, 200, 42, 40, 0, 68, 'medium', 100, 180, 4, 2.5, 0, 10, 3, 80, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Air Laici (Lychee Drink)', 'Air Laici', ARRAY['lychee drink', 'lychee juice'], 'drinks', 'sweet', ARRAY['ramadan', 'bazaar', 'sweet'], '1 gelas', '1 glass', 300, 150, 38, 35, 0, 60, 'medium', 20, 150, 0, 0, 0, 0, 0, 20, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Air Longan', 'Air Longan', ARRAY['longan drink', 'longan juice'], 'drinks', 'sweet', ARRAY['ramadan', 'bazaar', 'sweet'], '1 gelas', '1 glass', 300, 140, 35, 32, 1, 58, 'medium', 15, 180, 0, 0, 0, 0, 1, 25, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Air Cincau (Grass Jelly Drink)', 'Air Cincau', ARRAY['grass jelly drink', 'cincau'], 'drinks', 'sweet', ARRAY['ramadan', 'bazaar', 'cooling'], '1 gelas', '1 glass', 350, 120, 28, 25, 1, 55, 'low', 30, 80, 1, 0.5, 0, 5, 1, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Air Asam Boi (Sour Plum Drink)', 'Air Asam Boi', ARRAY['sour plum drink', 'asam boi'], 'drinks', 'sweet', ARRAY['ramadan', 'bazaar', 'refreshing'], '1 gelas', '1 glass', 300, 100, 25, 22, 0, 50, 'low', 450, 120, 0, 0, 0, 0, 0, 15, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Air Limau Nipis (Lime Juice)', 'Air Limau Nipis', ARRAY['lime juice', 'lemon juice'], 'drinks', 'natural', ARRAY['ramadan', 'bazaar', 'refreshing'], '1 gelas', '1 glass', 300, 80, 20, 18, 0, 45, 'low', 10, 120, 0, 0, 0, 0, 0, 15, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh Bunga (Flower Tea)', 'Teh Bunga', ARRAY['flower tea', 'chrysanthemum tea'], 'drinks', 'tea', ARRAY['ramadan', 'cooling', 'chinese'], '1 gelas', '1 glass', 300, 80, 20, 18, 0, 50, 'low', 15, 80, 0, 0, 0, 0, 0, 10, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Sirap Selasih (Rose Basil Seed)', 'Sirap Selasih', ARRAY['rose basil seed', 'selasih drink'], 'drinks', 'sweet', ARRAY['ramadan', 'bazaar', 'traditional'], '1 gelas', '1 glass', 350, 160, 38, 35, 3, 55, 'low', 60, 100, 1, 0.5, 0, 5, 2, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('ABC (Ais Batu Campur)', 'ABC', ARRAY['ais batu campur', 'shaved ice', 'ice kacang'], 'desserts', 'ais', ARRAY['ramadan', 'bazaar', 'popular', 'sweet'], '1 mangkuk', '1 bowl', 350, 280, 58, 48, 3, 60, 'medium', 80, 200, 5, 4, 0, 10, 4, 80, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Cendol', 'Cendol', ARRAY['chendol', 'pandan jelly dessert'], 'desserts', 'ais', ARRAY['ramadan', 'bazaar', 'popular', 'traditional'], '1 mangkuk', '1 bowl', 300, 320, 55, 42, 2, 58, 'medium', 70, 180, 12, 10, 0, 0, 3, 50, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false);

-- ============================================
-- SAHUR RECOMMENDATIONS (Slower Digesting)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Oatmeal with Dates', 'Oat dengan Kurma', ARRAY['oatmeal kurma', 'oat breakfast'], 'porridge', 'oat', ARRAY['ramadan', 'sahur', 'healthy', 'slow release'], '1 mangkuk', '1 bowl', 250, 280, 48, 22, 6, 45, 'low', 120, 350, 6, 1, 0, 0, 8, 180, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Half Boiled Eggs', 'Telur Separuh Masak', ARRAY['soft boiled eggs', 'runny eggs'], 'protein', 'egg', ARRAY['ramadan', 'sahur', 'kopitiam', 'protein'], '2 biji', '2 eggs', 100, 150, 1, 0, 0, 0, 'low', 140, 130, 10, 3, 0, 370, 12, 170, 'safe', 'safe', 'limit', 'caution', 'ai_estimated', false),

('Bread with Egg and Vegetables', 'Roti dengan Telur dan Sayur', ARRAY['egg sandwich healthy', 'veggie egg toast'], 'breads', 'sandwich', ARRAY['ramadan', 'sahur', 'balanced'], '1 hidangan', '1 serving', 180, 320, 32, 4, 4, 55, 'low', 480, 280, 14, 4, 0, 185, 14, 180, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Rice with Fish and Vegetables', 'Nasi dengan Ikan dan Sayur', ARRAY['balanced meal', 'healthy nasi'], 'rice_dishes', 'nasi', ARRAY['ramadan', 'sahur', 'balanced', 'healthy'], '1 pinggan', '1 plate', 350, 450, 55, 3, 4, 58, 'medium', 580, 420, 14, 3, 0, 55, 24, 280, 'caution', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Muesli with Milk', 'Muesli dengan Susu', ARRAY['muesli breakfast', 'cereal milk'], 'porridge', 'cereal', ARRAY['ramadan', 'sahur', 'western', 'fiber'], '1 mangkuk', '1 bowl', 200, 320, 52, 18, 6, 50, 'low', 180, 420, 8, 2, 0, 10, 10, 250, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Yogurt with Fruits', 'Yogurt dengan Buah', ARRAY['fruit yogurt', 'yogurt buah'], 'dairy', 'yogurt', ARRAY['ramadan', 'sahur', 'healthy', 'probiotic'], '1 cawan', '1 cup', 200, 180, 28, 22, 2, 35, 'low', 100, 350, 4, 2, 0, 15, 8, 200, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Banana (Medium)', 'Pisang', ARRAY['banana', 'pisang berangan'], 'fruits', 'fresh', ARRAY['ramadan', 'sahur', 'healthy', 'potassium'], '1 biji', '1 medium', 120, 105, 27, 14, 3, 52, 'low', 1, 420, 0.4, 0.1, 0, 0, 1, 25, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Apple (Medium)', 'Epal', ARRAY['apple', 'epal merah'], 'fruits', 'fresh', ARRAY['ramadan', 'sahur', 'healthy', 'fiber'], '1 biji', '1 medium', 180, 95, 25, 19, 4, 38, 'low', 2, 195, 0.3, 0.1, 0, 0, 0.5, 20, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Almonds', 'Kacang Badam', ARRAY['almonds', 'badam'], 'snacks', 'nuts', ARRAY['ramadan', 'sahur', 'healthy', 'protein'], '1 genggam', '1 handful (30g)', 30, 170, 6, 1, 3, 15, 'low', 1, 200, 15, 1, 0, 0, 6, 140, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Full Cream Milk', 'Susu Full Krim', ARRAY['full cream milk', 'whole milk'], 'drinks', 'milk', ARRAY['ramadan', 'sahur', 'calcium'], '1 gelas', '1 glass', 250, 150, 12, 12, 0, 30, 'low', 120, 350, 8, 5, 0, 25, 8, 220, 'safe', 'safe', 'caution', 'caution', 'ai_estimated', false);

