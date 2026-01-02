-- 🇲🇾 Malaysian Food Database - Batch 2B: Noodles (50 foods)
-- All values per standard Malaysian serving

-- ============================================
-- MEE GORENG VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Mee Goreng Basah (Wet Fried Noodles)', 'Mee Goreng Basah', ARRAY['wet fried noodles', 'mee basah'], 'noodles', 'mee goreng', ARRAY['mamak', 'hawker', 'popular'], '1 pinggan', '1 plate', 380, 580, 68, 6, 3, 60, 'medium', 1250, 290, 26, 7, 0, 85, 18, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Mee Goreng Udang (Prawn Fried Noodles)', 'Mee Goreng Udang', ARRAY['prawn fried noodles', 'mee udang'], 'noodles', 'mee goreng', ARRAY['seafood', 'hawker'], '1 pinggan', '1 plate', 380, 600, 66, 5, 3, 60, 'medium', 1180, 320, 28, 6, 0, 150, 22, 220, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Maggi Goreng (Fried Instant Noodles)', 'Maggi Goreng', ARRAY['maggi goreng', 'fried maggi', 'instant noodles fried'], 'noodles', 'mee goreng', ARRAY['mamak', 'popular', 'late night'], '1 pinggan', '1 plate', 350, 650, 75, 6, 2, 65, 'medium', 1450, 250, 32, 10, 0.5, 45, 14, 160, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false),

('Maggi Goreng Special', 'Maggi Goreng Special', ARRAY['maggi special', 'maggi goreng telur'], 'noodles', 'mee goreng', ARRAY['mamak', 'popular', 'late night'], '1 pinggan', '1 plate', 400, 750, 78, 7, 3, 65, 'medium', 1550, 300, 38, 12, 0.5, 220, 22, 200, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Indomie Goreng (Indonesian Style)', 'Indomie Goreng', ARRAY['indomie', 'indo mee goreng'], 'noodles', 'mee goreng', ARRAY['indonesian', 'popular', 'instant'], '1 bungkus', '1 packet', 85, 380, 52, 4, 2, 65, 'medium', 1100, 120, 16, 7, 0, 0, 8, 80, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false),

('Mee Goreng Sotong (Squid Fried Noodles)', 'Mee Goreng Sotong', ARRAY['squid fried noodles'], 'noodles', 'mee goreng', ARRAY['seafood', 'hawker'], '1 pinggan', '1 plate', 380, 590, 65, 5, 3, 60, 'medium', 1220, 310, 27, 6, 0, 170, 20, 210, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- MEE SOUP VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Mee Sup (Simple Noodle Soup)', 'Mee Sup', ARRAY['noodle soup', 'mee sup ayam'], 'noodles', 'mee sup', ARRAY['comfort', 'simple', 'sick food'], '1 mangkuk', '1 bowl', 450, 380, 52, 3, 2, 55, 'low', 950, 280, 12, 3, 0, 55, 18, 170, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Mee Rebus (Noodles in Gravy)', 'Mee Rebus', ARRAY['mee rebus', 'gravy noodles'], 'noodles', 'mee rebus', ARRAY['malay', 'breakfast', 'popular'], '1 mangkuk', '1 bowl', 450, 520, 68, 8, 3, 62, 'medium', 1100, 350, 18, 5, 0, 120, 20, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Mee Jawa (Javanese Noodles)', 'Mee Jawa', ARRAY['javanese noodles', 'mee jawa'], 'noodles', 'mee rebus', ARRAY['javanese', 'hawker'], '1 mangkuk', '1 bowl', 450, 480, 62, 7, 3, 60, 'medium', 980, 320, 18, 5, 0, 85, 18, 190, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Mee Bandung (Bandung Noodles)', 'Mee Bandung', ARRAY['bandung noodles', 'mee bandung muar'], 'noodles', 'mee sup', ARRAY['johor', 'muar', 'popular'], '1 mangkuk', '1 bowl', 480, 520, 58, 5, 2, 58, 'medium', 1150, 340, 22, 6, 0, 95, 22, 210, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Mee Kari (Curry Noodles)', 'Mee Kari', ARRAY['curry noodles', 'curry mee'], 'noodles', 'mee kari', ARRAY['indian', 'spicy', 'popular'], '1 mangkuk', '1 bowl', 500, 620, 58, 4, 3, 58, 'medium', 1280, 380, 35, 16, 0, 75, 22, 220, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Mee Soto (Soto Noodles)', 'Mee Soto', ARRAY['soto noodles', 'soto mee'], 'noodles', 'mee sup', ARRAY['malay', 'javanese', 'breakfast'], '1 mangkuk', '1 bowl', 450, 420, 52, 3, 2, 55, 'low', 980, 320, 16, 4, 0, 65, 20, 190, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Mee Celup (Dipping Noodles)', 'Mee Celup', ARRAY['dipping noodles', 'steamboat noodles'], 'noodles', 'mee sup', ARRAY['melaka', 'steamboat'], '1 hidangan', '1 serving', 400, 480, 55, 4, 2, 55, 'low', 1350, 350, 20, 6, 0, 120, 22, 240, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- KUEY TEOW VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kuey Teow Goreng (Fried Flat Noodles)', 'Kuey Teow Goreng', ARRAY['fried kuey teow', 'kway teow goreng'], 'noodles', 'kuey teow', ARRAY['chinese', 'hawker', 'popular'], '1 pinggan', '1 plate', 350, 650, 62, 4, 2, 62, 'medium', 1280, 280, 35, 10, 0.5, 160, 20, 190, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Kuey Teow Sup (Flat Noodle Soup)', 'Kuey Teow Sup', ARRAY['kuey teow soup', 'flat noodle soup'], 'noodles', 'kuey teow', ARRAY['chinese', 'simple', 'comfort'], '1 mangkuk', '1 bowl', 450, 380, 52, 2, 2, 55, 'low', 920, 280, 12, 3, 0, 60, 18, 170, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Kuey Teow Kerang (Cockles Flat Noodles)', 'Kuey Teow Kerang', ARRAY['cockle kuey teow', 'kerang kuey teow'], 'noodles', 'kuey teow', ARRAY['hawker', 'seafood', 'penang'], '1 pinggan', '1 plate', 350, 680, 60, 4, 2, 62, 'medium', 1350, 320, 38, 11, 0.5, 200, 24, 250, 'caution', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Wat Tan Hor (Egg Gravy Flat Noodles)', 'Wat Tan Hor', ARRAY['egg gravy hor fun', 'wat tan hor fun'], 'noodles', 'kuey teow', ARRAY['cantonese', 'hawker', 'popular'], '1 pinggan', '1 plate', 400, 580, 55, 3, 2, 58, 'medium', 1150, 300, 28, 8, 0, 180, 22, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Ipoh Hor Fun', 'Kuey Teow Ipoh', ARRAY['ipoh hor fun', 'ipoh flat noodles', 'nga choy kai'], 'noodles', 'kuey teow', ARRAY['ipoh', 'chinese', 'popular'], '1 mangkuk', '1 bowl', 400, 450, 52, 2, 2, 55, 'low', 980, 300, 18, 5, 0, 75, 22, 190, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Kuey Teow Ladna (Gravy Flat Noodles)', 'Kuey Teow Ladna', ARRAY['ladna', 'gravy flat noodles'], 'noodles', 'kuey teow', ARRAY['thai', 'hawker'], '1 pinggan', '1 plate', 400, 550, 58, 4, 2, 58, 'medium', 1200, 310, 25, 7, 0, 120, 20, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- BIHUN/MIHUN (Rice Vermicelli)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Bihun Goreng (Fried Rice Vermicelli)', 'Bihun Goreng', ARRAY['fried bihun', 'fried vermicelli'], 'noodles', 'bihun', ARRAY['mamak', 'hawker', 'popular'], '1 pinggan', '1 plate', 300, 420, 62, 3, 2, 58, 'medium', 950, 220, 14, 4, 0, 50, 12, 140, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false),

('Bihun Sup (Rice Vermicelli Soup)', 'Bihun Sup', ARRAY['bihun soup', 'vermicelli soup'], 'noodles', 'bihun', ARRAY['simple', 'comfort', 'sick food'], '1 mangkuk', '1 bowl', 400, 320, 52, 2, 2, 55, 'low', 850, 250, 8, 2, 0, 45, 14, 150, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Bihun Tomyam', 'Bihun Tomyam', ARRAY['tomyam bihun', 'spicy vermicelli'], 'noodles', 'bihun', ARRAY['thai', 'spicy', 'popular'], '1 mangkuk', '1 bowl', 400, 380, 55, 4, 2, 55, 'low', 1250, 320, 12, 3, 0, 85, 16, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Mee Hoon Soto', 'Bihun Soto', ARRAY['soto bihun', 'soto vermicelli'], 'noodles', 'bihun', ARRAY['malay', 'breakfast', 'javanese'], '1 mangkuk', '1 bowl', 400, 350, 52, 3, 2, 55, 'low', 920, 290, 10, 3, 0, 55, 16, 160, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Mee Hoon Kari', 'Bihun Kari', ARRAY['curry bihun', 'curry vermicelli'], 'noodles', 'bihun', ARRAY['indian', 'spicy'], '1 mangkuk', '1 bowl', 450, 520, 55, 4, 3, 55, 'low', 1150, 350, 28, 14, 0, 65, 18, 200, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false);

-- ============================================
-- LAKSA VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Laksa Johor (Spaghetti Laksa)', 'Laksa Johor', ARRAY['johor laksa', 'spaghetti laksa'], 'noodles', 'laksa', ARRAY['johor', 'traditional', 'royal'], '1 mangkuk', '1 bowl', 500, 580, 72, 6, 3, 60, 'medium', 1350, 380, 22, 8, 0, 70, 22, 220, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Laksa Sarawak', 'Laksa Sarawak', ARRAY['sarawak laksa', 'kuching laksa'], 'noodles', 'laksa', ARRAY['sarawak', 'popular', 'unique'], '1 mangkuk', '1 bowl', 500, 520, 65, 5, 3, 58, 'medium', 1280, 360, 20, 6, 0, 85, 20, 210, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Laksa Kedah', 'Laksa Kedah', ARRAY['kedah laksa', 'laksa utara'], 'noodles', 'laksa', ARRAY['kedah', 'northern', 'fish'], '1 mangkuk', '1 bowl', 500, 480, 68, 6, 3, 55, 'low', 1450, 350, 16, 4, 0, 50, 18, 190, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Laksam (Kelantan)', 'Laksam', ARRAY['laksam', 'kelantan laksa', 'laksa kelantan'], 'noodles', 'laksa', ARRAY['kelantan', 'traditional', 'fish'], '1 mangkuk', '1 bowl', 500, 450, 62, 5, 3, 55, 'low', 1380, 340, 14, 4, 0, 45, 18, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Mee Siam (Spicy Vermicelli)', 'Mee Siam', ARRAY['mee siam', 'spicy vermicelli', 'nyonya mee'], 'noodles', 'bihun', ARRAY['nyonya', 'spicy', 'popular'], '1 mangkuk', '1 bowl', 400, 420, 58, 8, 2, 55, 'low', 1100, 280, 16, 4, 0, 75, 14, 160, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- CHINESE NOODLES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Yee Mee Goreng (Fried Egg Noodles)', 'Yee Mee Goreng', ARRAY['fried yee mee', 'ee mee goreng'], 'noodles', 'mee', ARRAY['chinese', 'hawker'], '1 pinggan', '1 plate', 350, 520, 58, 4, 2, 60, 'medium', 1150, 260, 24, 7, 0, 85, 18, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Yee Mee Soup', 'Yee Mee Sup', ARRAY['yee mee soup', 'ee mee sup'], 'noodles', 'mee', ARRAY['chinese', 'comfort'], '1 mangkuk', '1 bowl', 400, 380, 48, 3, 2, 55, 'low', 980, 280, 14, 4, 0, 65, 18, 170, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Sang Har Mee (Prawn Noodles)', 'Sang Har Mee', ARRAY['prawn noodles', 'big prawn noodles'], 'noodles', 'mee', ARRAY['cantonese', 'premium', 'seafood'], '1 pinggan', '1 plate', 400, 580, 52, 3, 2, 58, 'medium', 1280, 350, 28, 8, 0, 220, 28, 280, 'caution', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Cantonese Fried Noodles', 'Mee Cantonese', ARRAY['cantonese noodles', 'crispy noodles'], 'noodles', 'mee', ARRAY['cantonese', 'hawker'], '1 pinggan', '1 plate', 400, 620, 58, 5, 2, 60, 'medium', 1350, 320, 32, 9, 0, 120, 22, 220, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Kon Lo Mee (Dry Noodles with Sauce)', 'Kon Lo Mee', ARRAY['dry noodles', 'kon lo meen'], 'noodles', 'mee', ARRAY['cantonese', 'hawker', 'simple'], '1 pinggan', '1 plate', 300, 450, 52, 4, 2, 58, 'medium', 850, 220, 20, 6, 0, 65, 16, 160, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Sui Kow Noodles (Dumpling Noodles)', 'Mee Sui Kow', ARRAY['dumpling noodles', 'sui gow mee'], 'noodles', 'mee', ARRAY['cantonese', 'hawker'], '1 mangkuk', '1 bowl', 400, 480, 55, 3, 2, 55, 'low', 1100, 280, 18, 5, 0, 85, 22, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Fish Ball Noodles', 'Mee Bebola Ikan', ARRAY['fish ball mee', 'yu wan mee'], 'noodles', 'mee', ARRAY['chinese', 'hawker', 'popular'], '1 mangkuk', '1 bowl', 400, 420, 52, 3, 2, 55, 'low', 1050, 280, 14, 4, 0, 55, 20, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Prawn Mee Penang', 'Mee Udang Penang', ARRAY['penang prawn mee', 'hokkien mee penang'], 'noodles', 'mee', ARRAY['penang', 'hawker', 'famous'], '1 mangkuk', '1 bowl', 450, 480, 55, 4, 2, 55, 'low', 1380, 350, 18, 5, 0, 120, 24, 230, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Prawn Mee KL (Dark Soup)', 'Mee Udang KL', ARRAY['kl prawn mee', 'hae mee'], 'noodles', 'mee', ARRAY['kl', 'hawker', 'dark soup'], '1 mangkuk', '1 bowl', 450, 520, 58, 5, 2, 58, 'medium', 1450, 360, 22, 6, 0, 130, 26, 240, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Curry Mee Dry', 'Mee Kari Kering', ARRAY['dry curry mee', 'curry mee goreng'], 'noodles', 'mee kari', ARRAY['nyonya', 'spicy', 'hawker'], '1 pinggan', '1 plate', 400, 580, 55, 4, 3, 58, 'medium', 1200, 340, 32, 14, 0, 85, 20, 210, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Chee Cheong Fun (Rice Rolls)', 'Chee Cheong Fun', ARRAY['rice rolls', 'cheong fun', 'pig intestine noodles'], 'noodles', 'kuey teow', ARRAY['cantonese', 'dim sum', 'breakfast'], '1 hidangan', '1 serving', 200, 220, 38, 6, 1, 60, 'medium', 580, 120, 5, 1, 0, 10, 4, 60, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- OTHER NOODLES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Spaghetti Bolognese (Local)', 'Spaghetti Bolognese', ARRAY['spag bol', 'bolognese'], 'noodles', 'pasta', ARRAY['western', 'mamak', 'popular'], '1 pinggan', '1 plate', 350, 520, 62, 6, 3, 55, 'low', 780, 420, 18, 6, 0, 55, 22, 200, 'caution', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Carbonara (Mamak Style)', 'Carbonara', ARRAY['carbonara', 'cream pasta'], 'noodles', 'pasta', ARRAY['western', 'mamak', 'creamy'], '1 pinggan', '1 plate', 350, 620, 58, 4, 2, 55, 'low', 850, 280, 32, 14, 0, 120, 20, 220, 'caution', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Aglio Olio (Local)', 'Aglio Olio', ARRAY['aglio olio', 'garlic oil pasta'], 'noodles', 'pasta', ARRAY['western', 'mamak', 'simple'], '1 pinggan', '1 plate', 300, 450, 55, 2, 2, 55, 'low', 580, 180, 20, 4, 0, 25, 12, 140, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Tomyam Seafood Noodles', 'Mee Tomyam Seafood', ARRAY['tomyam noodles', 'spicy seafood noodles'], 'noodles', 'mee sup', ARRAY['thai', 'spicy', 'seafood'], '1 mangkuk', '1 bowl', 450, 480, 55, 5, 2, 55, 'low', 1380, 380, 18, 4, 0, 150, 24, 250, 'caution', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Korean Ramyeon (Local)', 'Ramyeon Korea', ARRAY['korean noodles', 'ramyun', 'ramen'], 'noodles', 'mee sup', ARRAY['korean', 'spicy', 'trending'], '1 mangkuk', '1 bowl', 400, 520, 68, 6, 2, 65, 'medium', 1650, 280, 18, 6, 0, 45, 14, 160, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false),

('Udon Soup', 'Udon Sup', ARRAY['udon', 'japanese noodles'], 'noodles', 'mee sup', ARRAY['japanese', 'comfort'], '1 mangkuk', '1 bowl', 450, 380, 62, 4, 2, 55, 'low', 1100, 250, 8, 2, 0, 35, 14, 150, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false),

('Yong Tau Foo Soup', 'Yong Tau Foo Sup', ARRAY['ytf soup', 'stuffed tofu soup'], 'noodles', 'mee sup', ARRAY['hakka', 'healthy', 'customizable'], '1 mangkuk', '1 bowl', 500, 350, 42, 4, 4, 45, 'low', 1050, 380, 12, 3, 0, 45, 18, 200, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Yong Tau Foo Dry', 'Yong Tau Foo Kering', ARRAY['ytf dry', 'stuffed tofu dry'], 'noodles', 'mee', ARRAY['hakka', 'healthy', 'customizable'], '1 pinggan', '1 plate', 450, 420, 48, 8, 4, 50, 'low', 1150, 360, 16, 4, 0, 50, 18, 210, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Lor Mee (Braised Noodles)', 'Lor Mee', ARRAY['braised noodles', 'starchy noodles'], 'noodles', 'mee', ARRAY['hokkien', 'hawker', 'thick gravy'], '1 mangkuk', '1 bowl', 450, 520, 62, 5, 2, 60, 'medium', 1250, 300, 20, 6, 0, 95, 22, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Mee Pok (Flat Egg Noodles Dry)', 'Mee Pok', ARRAY['flat noodles', 'bak chor mee'], 'noodles', 'mee', ARRAY['teochew', 'hawker', 'singapore'], '1 pinggan', '1 plate', 350, 480, 55, 4, 2, 58, 'medium', 980, 280, 20, 6, 0, 75, 20, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false);

