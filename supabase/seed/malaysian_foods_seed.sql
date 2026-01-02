-- 🇲🇾 Malaysian Food Database - Phase 1 Seed Data
-- 50 Essential Malaysian Foods with Complete Nutrient Profiles

-- ============================================
-- CATEGORY: NASI (Rice Dishes)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source) VALUES

('Nasi Lemak with Sambal, Egg, Anchovies', 'Nasi Lemak Biasa', 
 ARRAY['nasi lemak', 'nasik lemak', 'coconut rice'],
 'rice_dishes', 'nasi', ARRAY['mamak', 'breakfast', 'popular'],
 '1 bungkus', '1 packet', 350,
 650, 85, 8, 3, 72, 'high',
 820, 290, 28, 12, 0, 85, 18, 180,
 'limit', 'caution', 'caution', 'caution', 'ai_estimated'),

('Nasi Lemak Rendang Ayam', 'Nasi Lemak Rendang Ayam',
 ARRAY['nasi lemak rendang', 'nasi lemak ayam'],
 'rice_dishes', 'nasi', ARRAY['mamak', 'lunch', 'popular'],
 '1 bungkus', '1 packet', 450,
 850, 95, 10, 4, 72, 'high',
 950, 380, 38, 15, 0, 120, 28, 220,
 'limit', 'limit', 'limit', 'caution', 'ai_estimated'),

('Chicken Rice (Hainanese)', 'Nasi Ayam Hainan',
 ARRAY['chicken rice', 'nasi ayam', 'hainanese chicken rice'],
 'rice_dishes', 'nasi', ARRAY['chinese', 'lunch', 'popular'],
 '1 pinggan', '1 plate', 400,
 700, 80, 2, 1, 73, 'high',
 1100, 320, 25, 8, 0, 95, 35, 250,
 'limit', 'limit', 'caution', 'caution', 'ai_estimated'),

('Nasi Goreng Kampung', 'Nasi Goreng Kampung',
 ARRAY['fried rice kampung', 'village fried rice'],
 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'dinner', 'popular'],
 '1 pinggan', '1 plate', 350,
 550, 70, 4, 2, 70, 'high',
 1200, 280, 22, 6, 0, 45, 15, 160,
 'limit', 'limit', 'caution', 'safe', 'ai_estimated'),

('Nasi Goreng USA', 'Nasi Goreng USA',
 ARRAY['american fried rice', 'nasi goreng amerika'],
 'rice_dishes', 'nasi goreng', ARRAY['mamak', 'dinner'],
 '1 pinggan', '1 plate', 400,
 720, 75, 8, 2, 70, 'high',
 1350, 320, 32, 10, 0, 180, 25, 200,
 'limit', 'limit', 'limit', 'caution', 'ai_estimated'),

('Nasi Kandar (with 2 lauk)', 'Nasi Kandar',
 ARRAY['nasi kandar', 'penang nasi kandar'],
 'rice_dishes', 'nasi', ARRAY['mamak', 'lunch', 'penang'],
 '1 pinggan', '1 plate', 500,
 900, 90, 6, 3, 72, 'high',
 1500, 400, 42, 14, 0, 130, 35, 280,
 'limit', 'limit', 'limit', 'limit', 'ai_estimated'),

('Nasi Briyani Ayam', 'Nasi Briyani Ayam',
 ARRAY['chicken briyani', 'biryani', 'beriani'],
 'rice_dishes', 'nasi', ARRAY['indian', 'lunch', 'ramadan'],
 '1 pinggan', '1 plate', 450,
 780, 88, 4, 3, 68, 'medium',
 1100, 380, 30, 10, 0, 110, 32, 260,
 'limit', 'limit', 'caution', 'caution', 'ai_estimated'),

('White Rice (plain)', 'Nasi Putih',
 ARRAY['white rice', 'steamed rice', 'nasi'],
 'rice_dishes', 'nasi', ARRAY['basic', 'staple'],
 '1 cawan', '1 cup', 200,
 260, 56, 0, 1, 73, 'high',
 5, 55, 0.5, 0.1, 0, 0, 5, 68,
 'caution', 'safe', 'safe', 'safe', 'myfcd'),

('Brown Rice', 'Nasi Perang',
 ARRAY['brown rice', 'nasi beras perang'],
 'rice_dishes', 'nasi', ARRAY['healthy', 'staple'],
 '1 cawan', '1 cup', 200,
 220, 45, 0, 4, 50, 'low',
 10, 150, 1.8, 0.4, 0, 0, 5, 150,
 'safe', 'safe', 'safe', 'caution', 'myfcd'),

-- ============================================
-- CATEGORY: MEE (Noodles)
-- ============================================

('Char Kuey Teow', 'Char Kuey Teow',
 ARRAY['char kway teow', 'fried flat noodles', 'ckt'],
 'noodles', 'kuey teow', ARRAY['chinese', 'hawker', 'penang', 'popular'],
 '1 pinggan', '1 plate', 350,
 750, 65, 5, 2, 65, 'medium',
 1400, 280, 42, 12, 1, 180, 22, 200,
 'caution', 'limit', 'limit', 'caution', 'ai_estimated'),

('Laksa Penang (Asam Laksa)', 'Laksa Penang',
 ARRAY['asam laksa', 'penang laksa', 'sour laksa'],
 'noodles', 'laksa', ARRAY['penang', 'hawker', 'popular'],
 '1 mangkuk', '1 bowl', 500,
 450, 70, 8, 3, 55, 'low',
 1800, 350, 12, 3, 0, 40, 18, 180,
 'caution', 'limit', 'safe', 'caution', 'ai_estimated'),

('Laksa Lemak (Curry Laksa)', 'Laksa Lemak',
 ARRAY['curry laksa', 'laksa kari', 'nyonya laksa'],
 'noodles', 'laksa', ARRAY['nyonya', 'hawker', 'popular'],
 '1 mangkuk', '1 bowl', 550,
 680, 65, 6, 3, 58, 'medium',
 1500, 400, 38, 18, 0, 85, 25, 220,
 'caution', 'limit', 'limit', 'caution', 'ai_estimated'),

('Mee Goreng Mamak', 'Mee Goreng Mamak',
 ARRAY['mamak fried noodles', 'indian mee goreng'],
 'noodles', 'mee goreng', ARRAY['mamak', 'popular', 'hawker'],
 '1 pinggan', '1 plate', 350,
 620, 72, 8, 3, 62, 'medium',
 1300, 300, 28, 8, 0, 95, 18, 180,
 'caution', 'limit', 'caution', 'caution', 'ai_estimated'),

('Wantan Mee (Dry)', 'Wantan Mee',
 ARRAY['wonton noodles', 'wan tan mee', 'wanton mee'],
 'noodles', 'mee', ARRAY['chinese', 'hawker', 'popular'],
 '1 pinggan', '1 plate', 350,
 520, 55, 4, 2, 60, 'medium',
 1100, 250, 22, 7, 0, 75, 22, 190,
 'caution', 'limit', 'caution', 'caution', 'ai_estimated'),

('Pan Mee (Soup)', 'Pan Mee Sup',
 ARRAY['pan mee', 'handmade noodles', 'mee hoon kueh'],
 'noodles', 'mee', ARRAY['chinese', 'hawker'],
 '1 mangkuk', '1 bowl', 450,
 450, 58, 3, 2, 55, 'low',
 900, 280, 15, 4, 0, 60, 20, 170,
 'caution', 'caution', 'safe', 'caution', 'ai_estimated'),

('Hokkien Mee (KL Style)', 'Hokkien Mee KL',
 ARRAY['hokkien mee', 'kl hokkien mee', 'dark soy noodles'],
 'noodles', 'mee', ARRAY['chinese', 'hawker', 'kl'],
 '1 pinggan', '1 plate', 350,
 580, 60, 6, 2, 62, 'medium',
 1400, 300, 28, 9, 0, 120, 25, 200,
 'caution', 'limit', 'caution', 'caution', 'ai_estimated'),

('Mee Hoon Goreng', 'Mee Hoon Goreng',
 ARRAY['fried vermicelli', 'bihun goreng'],
 'noodles', 'mee hoon', ARRAY['mamak', 'hawker', 'popular'],
 '1 pinggan', '1 plate', 300,
 450, 68, 4, 2, 58, 'medium',
 980, 220, 15, 4, 0, 50, 12, 140,
 'caution', 'caution', 'safe', 'safe', 'ai_estimated'),

-- ============================================
-- CATEGORY: ROTI (Breads)
-- ============================================

('Roti Canai (Plain)', 'Roti Canai Kosong',
 ARRAY['roti canai', 'roti chanai', 'prata'],
 'breads', 'roti', ARRAY['mamak', 'breakfast', 'popular'],
 '1 keping', '1 piece', 100,
 300, 42, 2, 1, 70, 'high',
 380, 80, 12, 5, 0.5, 15, 6, 60,
 'caution', 'caution', 'caution', 'safe', 'ai_estimated'),

('Roti Telur', 'Roti Telur',
 ARRAY['roti telur', 'egg roti', 'egg prata'],
 'breads', 'roti', ARRAY['mamak', 'breakfast', 'popular'],
 '1 keping', '1 piece', 150,
 420, 45, 2, 1, 68, 'medium',
 480, 120, 20, 7, 0.5, 195, 14, 130,
 'caution', 'caution', 'caution', 'caution', 'ai_estimated'),

('Roti Tissue', 'Roti Tisu',
 ARRAY['roti tissue', 'tissue prata', 'crispy roti'],
 'breads', 'roti', ARRAY['mamak', 'dessert'],
 '1 keping', '1 piece', 80,
 350, 55, 15, 1, 75, 'high',
 300, 60, 14, 6, 0.5, 10, 4, 50,
 'limit', 'caution', 'caution', 'safe', 'ai_estimated'),

('Tosai (Plain)', 'Tosai Kosong',
 ARRAY['thosai', 'dosa', 'dosai'],
 'breads', 'roti', ARRAY['indian', 'breakfast'],
 '1 keping', '1 piece', 120,
 150, 28, 1, 2, 50, 'low',
 250, 100, 3, 1, 0, 0, 4, 70,
 'safe', 'caution', 'safe', 'safe', 'ai_estimated'),

('Chapati', 'Capati',
 ARRAY['chapati', 'roti chapati'],
 'breads', 'roti', ARRAY['indian', 'healthy'],
 '1 keping', '1 piece', 60,
 120, 22, 1, 3, 52, 'low',
 180, 80, 2, 0.5, 0, 0, 4, 60,
 'safe', 'caution', 'safe', 'safe', 'ai_estimated'),

-- ============================================
-- CATEGORY: DRINKS
-- ============================================

('Teh Tarik', 'Teh Tarik',
 ARRAY['pulled tea', 'malaysian milk tea'],
 'drinks', 'tea', ARRAY['mamak', 'popular', 'anytime'],
 '1 cawan', '1 cup', 250,
 120, 18, 16, 0, 65, 'medium',
 45, 150, 4, 2.5, 0, 10, 3, 80,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

('Teh O (No Sugar)', 'Teh O Kosong',
 ARRAY['black tea no sugar', 'teh o kosong'],
 'drinks', 'tea', ARRAY['mamak', 'healthy'],
 '1 cawan', '1 cup', 250,
 5, 0, 0, 0, 0, 'low',
 5, 90, 0, 0, 0, 0, 0, 15,
 'safe', 'safe', 'safe', 'safe', 'ai_estimated'),

('Teh O Ais Limau', 'Teh O Ais Limau',
 ARRAY['iced lemon tea', 'teh o limau'],
 'drinks', 'tea', ARRAY['mamak', 'popular'],
 '1 gelas', '1 glass', 300,
 80, 20, 18, 0, 60, 'medium',
 10, 100, 0, 0, 0, 0, 0, 20,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

('Kopi O (No Sugar)', 'Kopi O Kosong',
 ARRAY['black coffee no sugar', 'kopi o kosong'],
 'drinks', 'coffee', ARRAY['mamak', 'kopitiam', 'healthy'],
 '1 cawan', '1 cup', 200,
 5, 0, 0, 0, 0, 'low',
 5, 120, 0, 0, 0, 0, 0, 10,
 'safe', 'safe', 'safe', 'safe', 'ai_estimated'),

('Kopi Tarik', 'Kopi Tarik',
 ARRAY['pulled coffee', 'kopi tarik'],
 'drinks', 'coffee', ARRAY['mamak', 'kopitiam'],
 '1 cawan', '1 cup', 200,
 100, 14, 12, 0, 60, 'medium',
 40, 180, 4, 2.5, 0, 10, 2, 60,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

('Milo Ais', 'Milo Ais',
 ARRAY['iced milo', 'milo ice'],
 'drinks', 'chocolate', ARRAY['mamak', 'kopitiam', 'popular'],
 '1 gelas', '1 glass', 350,
 200, 32, 28, 1, 55, 'low',
 100, 280, 5, 3, 0, 5, 5, 120,
 'caution', 'safe', 'safe', 'caution', 'ai_estimated'),

('Sirap Bandung', 'Sirap Bandung',
 ARRAY['rose milk', 'bandung', 'air bandung'],
 'drinks', 'milk', ARRAY['mamak', 'ramadan'],
 '1 gelas', '1 glass', 300,
 180, 35, 32, 0, 65, 'medium',
 80, 200, 4, 2.5, 0, 10, 4, 90,
 'limit', 'safe', 'safe', 'safe', 'ai_estimated'),

('Air Kelapa (Fresh)', 'Air Kelapa Segar',
 ARRAY['coconut water', 'fresh coconut'],
 'drinks', 'natural', ARRAY['healthy', 'ramadan'],
 '1 biji', '1 coconut', 300,
 60, 12, 8, 0, 35, 'low',
 30, 400, 0.5, 0.4, 0, 0, 1, 30,
 'safe', 'safe', 'safe', 'caution', 'ai_estimated'),

-- ============================================
-- CATEGORY: KUIH (Traditional Snacks)
-- ============================================

('Kuih Lapis', 'Kuih Lapis',
 ARRAY['layer cake', 'kue lapis'],
 'kuih', 'kuih manis', ARRAY['traditional', 'tea_time'],
 '1 potong', '1 piece', 50,
 150, 25, 15, 0, 70, 'high',
 30, 40, 5, 3, 0, 20, 2, 30,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

('Onde-Onde', 'Onde-Onde',
 ARRAY['ondeh ondeh', 'klepon'],
 'kuih', 'kuih manis', ARRAY['traditional', 'tea_time'],
 '3 biji', '3 pieces', 60,
 180, 32, 18, 1, 65, 'medium',
 40, 80, 5, 4, 0, 0, 2, 40,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

('Curry Puff', 'Karipap',
 ARRAY['curry puff', 'karipap', 'epok-epok'],
 'kuih', 'kuih masin', ARRAY['traditional', 'snack', 'popular'],
 '1 biji', '1 piece', 80,
 220, 22, 2, 1, 60, 'medium',
 280, 120, 13, 4, 0.5, 15, 5, 60,
 'caution', 'caution', 'caution', 'safe', 'ai_estimated'),

('Popiah (Fresh)', 'Popiah Basah',
 ARRAY['fresh spring roll', 'poh piah'],
 'kuih', 'kuih masin', ARRAY['chinese', 'healthy'],
 '1 batang', '1 roll', 150,
 180, 28, 4, 3, 45, 'low',
 350, 200, 5, 1, 0, 10, 6, 80,
 'safe', 'caution', 'safe', 'safe', 'ai_estimated'),

('Kuih Talam', 'Kuih Talam',
 ARRAY['talam cake', 'kuih talam pandan'],
 'kuih', 'kuih manis', ARRAY['traditional', 'tea_time'],
 '1 potong', '1 piece', 60,
 120, 22, 12, 0, 62, 'medium',
 25, 50, 3, 2, 0, 0, 1, 25,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

-- ============================================
-- CATEGORY: RAMADAN SPECIALS
-- ============================================

('Bubur Lambuk', 'Bubur Lambuk',
 ARRAY['ramadan porridge', 'rice porridge ramadan'],
 'porridge', 'bubur', ARRAY['ramadan', 'iftar', 'malay'],
 '1 mangkuk', '1 bowl', 400,
 350, 50, 3, 2, 65, 'medium',
 800, 350, 10, 4, 0, 40, 15, 150,
 'caution', 'caution', 'safe', 'caution', 'ai_estimated'),

('Kurma (Dates)', 'Kurma',
 ARRAY['dates', 'tamar', 'buah kurma'],
 'fruits', 'dried', ARRAY['ramadan', 'iftar', 'healthy'],
 '3 biji', '3 pieces', 45,
 120, 32, 28, 3, 42, 'low',
 2, 280, 0, 0, 0, 0, 1, 35,
 'caution', 'safe', 'safe', 'caution', 'ai_estimated'),

('Murtabak Ayam', 'Murtabak Ayam',
 ARRAY['chicken murtabak', 'martabak'],
 'breads', 'roti', ARRAY['mamak', 'ramadan', 'iftar'],
 '1 keping', '1 piece', 250,
 550, 48, 4, 2, 62, 'medium',
 950, 280, 30, 10, 0.5, 140, 25, 200,
 'caution', 'limit', 'caution', 'caution', 'ai_estimated'),

('Air Katira', 'Air Katira',
 ARRAY['rose syrup drink', 'basil seed drink'],
 'drinks', 'sweet', ARRAY['ramadan', 'iftar'],
 '1 gelas', '1 glass', 350,
 200, 45, 40, 2, 60, 'medium',
 50, 100, 0, 0, 0, 0, 1, 30,
 'limit', 'safe', 'safe', 'safe', 'ai_estimated'),

('Kuih Bakar', 'Kuih Bakar',
 ARRAY['baked tapioca cake', 'grilled cake'],
 'kuih', 'kuih manis', ARRAY['ramadan', 'traditional'],
 '1 potong', '1 piece', 80,
 200, 35, 20, 1, 68, 'medium',
 60, 90, 6, 4, 0, 25, 3, 50,
 'caution', 'safe', 'safe', 'safe', 'ai_estimated'),

-- ============================================
-- CATEGORY: BASIC PROTEINS
-- ============================================

('Ayam Goreng (1 piece)', 'Ayam Goreng',
 ARRAY['fried chicken', 'ayam goreng berempah'],
 'protein', 'chicken', ARRAY['basic', 'popular'],
 '1 ketul', '1 piece', 120,
 280, 8, 0, 0, 0, 'low',
 450, 220, 18, 5, 0, 95, 22, 180,
 'safe', 'caution', 'caution', 'caution', 'ai_estimated'),

('Telur Rebus', 'Telur Rebus',
 ARRAY['boiled egg', 'hard boiled egg'],
 'protein', 'egg', ARRAY['basic', 'healthy'],
 '1 biji', '1 egg', 50,
 78, 0.5, 0, 0, 0, 'low',
 62, 63, 5, 1.6, 0, 186, 6, 86,
 'safe', 'safe', 'caution', 'caution', 'myfcd'),

('Telur Goreng', 'Telur Goreng',
 ARRAY['fried egg', 'telur mata'],
 'protein', 'egg', ARRAY['basic'],
 '1 biji', '1 egg', 60,
 120, 0.5, 0, 0, 0, 'low',
 180, 70, 10, 3, 0, 186, 6, 90,
 'safe', 'caution', 'caution', 'caution', 'ai_estimated'),

('Ikan Kembung Goreng', 'Ikan Kembung Goreng',
 ARRAY['fried mackerel', 'ikan goreng'],
 'protein', 'fish', ARRAY['basic', 'malay'],
 '1 ekor', '1 fish', 100,
 200, 2, 0, 0, 0, 'low',
 380, 350, 12, 3, 0, 70, 20, 200,
 'safe', 'caution', 'safe', 'caution', 'ai_estimated'),

('Tempe Goreng', 'Tempe Goreng',
 ARRAY['fried tempeh', 'tempe'],
 'protein', 'vegetarian', ARRAY['healthy', 'vegetarian'],
 '3 keping', '3 pieces', 60,
 150, 8, 0, 3, 35, 'low',
 200, 280, 9, 2, 0, 0, 10, 150,
 'safe', 'caution', 'safe', 'caution', 'ai_estimated'),

('Tauhu Goreng', 'Tauhu Goreng',
 ARRAY['fried tofu', 'tofu goreng'],
 'protein', 'vegetarian', ARRAY['healthy', 'vegetarian'],
 '3 keping', '3 pieces', 80,
 180, 4, 0, 1, 15, 'low',
 180, 150, 14, 2, 0, 0, 12, 120,
 'safe', 'caution', 'safe', 'caution', 'ai_estimated'),

('Ayam Panggang', 'Ayam Panggang',
 ARRAY['grilled chicken', 'roasted chicken'],
 'protein', 'chicken', ARRAY['healthy', 'basic'],
 '1 ketul', '1 piece', 120,
 200, 0, 0, 0, 0, 'low',
 380, 250, 8, 2, 0, 90, 28, 200,
 'safe', 'caution', 'safe', 'caution', 'ai_estimated'),

('Ikan Bakar', 'Ikan Bakar',
 ARRAY['grilled fish', 'bbq fish'],
 'protein', 'fish', ARRAY['healthy', 'malay'],
 '1 ekor', '1 fish', 150,
 180, 2, 0, 0, 0, 'low',
 450, 400, 6, 1.5, 0, 65, 32, 280,
 'safe', 'caution', 'safe', 'limit', 'ai_estimated');

-- Set initial popularity scores for common foods
UPDATE malaysian_foods SET popularity_score = 100 WHERE name_bm = 'Nasi Lemak Biasa';
UPDATE malaysian_foods SET popularity_score = 90 WHERE name_bm = 'Nasi Ayam Hainan';
UPDATE malaysian_foods SET popularity_score = 85 WHERE name_bm = 'Char Kuey Teow';
UPDATE malaysian_foods SET popularity_score = 80 WHERE name_bm = 'Teh Tarik';
UPDATE malaysian_foods SET popularity_score = 75 WHERE name_bm = 'Roti Canai Kosong';
UPDATE malaysian_foods SET popularity_score = 70 WHERE name_bm = 'Mee Goreng Mamak';
UPDATE malaysian_foods SET popularity_score = 65 WHERE name_bm = 'Nasi Goreng Kampung';
UPDATE malaysian_foods SET popularity_score = 60 WHERE name_bm = 'Laksa Lemak';

