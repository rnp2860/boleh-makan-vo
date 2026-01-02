-- 🇲🇾 Malaysian Food Database - Batch 3B: Chinese Dishes (50 foods)
-- All values per standard Malaysian serving

-- ============================================
-- STIR FRY
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kangkung Belacan (Chinese Style)', 'Kangkung Belacan Cina', ARRAY['water spinach stir fry', 'kangkung goreng'], 'vegetables', 'goreng', ARRAY['chinese', 'healthy', 'popular'], '1 hidangan', '1 serving', 150, 120, 6, 2, 3, 30, 'low', 680, 450, 8, 1, 0, 10, 5, 80, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Kailan Ikan Masin', 'Kailan Ikan Masin', ARRAY['kailan with salted fish', 'chinese broccoli'], 'vegetables', 'goreng', ARRAY['chinese', 'hawker', 'popular'], '1 hidangan', '1 serving', 150, 140, 6, 2, 3, 30, 'low', 850, 380, 10, 2, 0, 25, 8, 100, 'safe', 'limit', 'safe', 'safe', 'ai_estimated', false),

('Sayur Campur Goreng', 'Sayur Campur Goreng', ARRAY['mixed vegetable stir fry', 'chap choy'], 'vegetables', 'goreng', ARRAY['chinese', 'healthy', 'mixed'], '1 hidangan', '1 serving', 150, 100, 10, 4, 4, 35, 'low', 580, 380, 5, 1, 0, 5, 4, 80, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Taugeh Goreng', 'Taugeh Goreng', ARRAY['fried bean sprouts', 'bean sprouts stir fry'], 'vegetables', 'goreng', ARRAY['chinese', 'simple', 'healthy'], '1 hidangan', '1 serving', 120, 80, 6, 2, 2, 30, 'low', 420, 220, 4, 1, 0, 0, 4, 50, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Bayam Goreng Bawang Putih', 'Bayam Goreng Bawang Putih', ARRAY['garlic spinach', 'spinach stir fry'], 'vegetables', 'goreng', ARRAY['chinese', 'healthy', 'garlic'], '1 hidangan', '1 serving', 120, 70, 5, 1, 3, 25, 'low', 380, 520, 4, 0.5, 0, 0, 4, 60, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Brokoli Goreng Sos Tiram', 'Brokoli Sos Tiram', ARRAY['broccoli oyster sauce', 'broccoli stir fry'], 'vegetables', 'goreng', ARRAY['chinese', 'healthy', 'popular'], '1 hidangan', '1 serving', 150, 100, 8, 3, 4, 30, 'low', 620, 450, 5, 1, 0, 5, 5, 90, 'safe', 'limit', 'safe', 'safe', 'ai_estimated', false),

('Sawi Goreng', 'Sawi Goreng', ARRAY['mustard greens stir fry', 'fried choy sum'], 'vegetables', 'goreng', ARRAY['chinese', 'simple', 'healthy'], '1 hidangan', '1 serving', 120, 80, 5, 2, 3, 28, 'low', 480, 380, 4, 0.5, 0, 0, 3, 55, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Pak Choy Goreng', 'Pak Choy Goreng', ARRAY['bok choy stir fry', 'pak choy'], 'vegetables', 'goreng', ARRAY['chinese', 'healthy', 'simple'], '1 hidangan', '1 serving', 120, 70, 4, 2, 2, 25, 'low', 420, 320, 4, 0.5, 0, 0, 3, 50, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- STEAMED DISHES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Ikan Stim (Steamed Fish)', 'Ikan Stim', ARRAY['steamed fish', 'chinese steamed fish'], 'protein', 'stim', ARRAY['chinese', 'healthy', 'traditional'], '1 hidangan', '1 serving', 200, 220, 4, 2, 0, 30, 'low', 680, 480, 10, 2, 0, 65, 32, 340, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Ayam Stim (Steamed Chicken)', 'Ayam Stim', ARRAY['steamed chicken', 'chinese steamed chicken'], 'protein', 'stim', ARRAY['chinese', 'healthy', 'simple'], '1 ketul', '1 piece', 150, 200, 2, 1, 0, 30, 'low', 520, 320, 10, 3, 0, 85, 26, 220, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Siakap Stim Limau', 'Siakap Stim Limau', ARRAY['steamed seabass lime', 'thai style fish'], 'protein', 'stim', ARRAY['chinese', 'thai', 'healthy'], '1 hidangan', '1 serving', 200, 240, 6, 3, 0, 30, 'low', 720, 500, 12, 2, 0, 70, 34, 360, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Tofu Stim', 'Tofu Stim', ARRAY['steamed tofu', 'tofu kukus'], 'protein', 'stim', ARRAY['chinese', 'vegetarian', 'healthy'], '1 hidangan', '1 serving', 150, 120, 4, 1, 1, 25, 'low', 380, 280, 7, 1, 0, 0, 12, 150, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false);

-- ============================================
-- ROASTED & BBQ
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Char Siu (BBQ Pork)', 'Char Siu', ARRAY['bbq pork', 'chinese bbq pork'], 'protein', 'roasted', ARRAY['chinese', 'cantonese', 'popular'], '1 hidangan', '1 serving', 100, 280, 12, 10, 0, 50, 'low', 680, 320, 16, 6, 0, 75, 22, 200, 'safe', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Siu Yuk (Roast Pork Belly)', 'Siu Yuk', ARRAY['roast pork belly', 'crispy pork'], 'protein', 'roasted', ARRAY['chinese', 'cantonese', 'crispy'], '1 hidangan', '1 serving', 100, 380, 2, 1, 0, 30, 'low', 580, 280, 32, 12, 0, 85, 20, 180, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Roast Duck', 'Itik Panggang', ARRAY['roasted duck', 'peking duck'], 'protein', 'roasted', ARRAY['chinese', 'cantonese', 'premium'], '1/4 ekor', '1/4 duck', 180, 420, 4, 2, 0, 30, 'low', 720, 350, 32, 10, 0, 120, 28, 280, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Hainan Chicken (Meat Only)', 'Ayam Hainan', ARRAY['hainanese chicken', 'white chicken'], 'protein', 'roasted', ARRAY['chinese', 'hainanese', 'popular'], '1 hidangan', '1 serving', 150, 280, 0, 0, 0, 0, 'low', 520, 320, 18, 5, 0, 90, 28, 240, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Roast Pork Rice', 'Nasi Babi Panggang', ARRAY['char siu rice', 'siew yuk rice'], 'rice_dishes', 'nasi', ARRAY['chinese', 'popular', 'complete'], '1 pinggan', '1 plate', 400, 680, 75, 8, 2, 70, 'high', 880, 380, 28, 10, 0, 85, 28, 260, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- CLAYPOT & HOTPOT
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Claypot Tofu', 'Tofu Claypot', ARRAY['claypot tofu', 'tofu periuk tanah'], 'protein', 'claypot', ARRAY['chinese', 'tofu', 'comfort'], '1 periuk', '1 claypot', 300, 280, 12, 4, 2, 40, 'low', 780, 350, 18, 4, 0, 45, 18, 200, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Claypot Seafood', 'Claypot Makanan Laut', ARRAY['seafood claypot', 'mixed seafood claypot'], 'protein', 'claypot', ARRAY['chinese', 'seafood', 'premium'], '1 periuk', '1 claypot', 350, 380, 15, 5, 2, 45, 'low', 980, 450, 20, 5, 0, 180, 32, 380, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Bak Kut Teh', 'Bak Kut Teh', ARRAY['pork bone tea', 'herbal pork soup'], 'soup', 'herbal', ARRAY['chinese', 'hokkien', 'herbal'], '1 mangkuk', '1 bowl', 400, 320, 8, 2, 1, 35, 'low', 850, 450, 18, 6, 0, 75, 28, 300, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Steamboat', 'Steamboat', ARRAY['hotpot', 'chinese fondue'], 'protein', 'steamboat', ARRAY['chinese', 'sharing', 'social'], '1 hidangan', '1 portion', 400, 450, 25, 5, 4, 50, 'low', 1200, 500, 22, 6, 0, 150, 35, 380, 'caution', 'limit', 'caution', 'limit', 'ai_estimated', false);

-- ============================================
-- DIM SUM ITEMS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Siew Mai', 'Siew Mai', ARRAY['siu mai', 'pork dumpling'], 'dim_sum', 'dumpling', ARRAY['chinese', 'dim sum', 'popular'], '3 biji', '3 pieces', 75, 180, 12, 2, 1, 55, 'low', 520, 180, 10, 4, 0, 55, 10, 120, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Har Gow', 'Har Gow', ARRAY['prawn dumpling', 'shrimp dumpling'], 'dim_sum', 'dumpling', ARRAY['chinese', 'dim sum', 'premium'], '3 biji', '3 pieces', 75, 150, 15, 1, 0, 55, 'low', 420, 150, 5, 1, 0, 80, 10, 140, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Char Siu Bao', 'Pau Char Siu', ARRAY['bbq pork bun', 'char siu bao'], 'dim_sum', 'bao', ARRAY['chinese', 'dim sum', 'popular'], '1 biji', '1 piece', 80, 220, 32, 8, 1, 65, 'medium', 380, 120, 6, 2, 0, 25, 8, 80, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Lo Mai Gai', 'Lo Mai Gai', ARRAY['glutinous rice chicken', 'sticky rice lotus leaf'], 'dim_sum', 'rice', ARRAY['chinese', 'dim sum', 'filling'], '1 biji', '1 piece', 200, 380, 48, 3, 2, 68, 'medium', 680, 280, 14, 5, 0, 65, 16, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Cheong Fun', 'Cheong Fun', ARRAY['rice noodle roll', 'steamed rice roll'], 'dim_sum', 'noodle', ARRAY['chinese', 'dim sum', 'light'], '1 gulung', '1 roll', 100, 120, 22, 4, 0, 60, 'medium', 380, 80, 2, 0.5, 0, 10, 3, 40, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Custard Bun', 'Pau Kastard', ARRAY['liu sha bao', 'salted egg bun'], 'dim_sum', 'bao', ARRAY['chinese', 'dim sum', 'sweet'], '1 biji', '1 piece', 70, 200, 28, 14, 0, 65, 'medium', 220, 80, 8, 4, 0, 80, 5, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Egg Tart', 'Egg Tart', ARRAY['dan tat', 'portuguese egg tart'], 'dim_sum', 'pastry', ARRAY['chinese', 'dessert', 'popular'], '1 biji', '1 piece', 65, 220, 22, 12, 0, 60, 'medium', 180, 80, 12, 6, 0, 120, 5, 70, 'caution', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Fried Carrot Cake', 'Chai Tow Kway', ARRAY['carrot cake', 'radish cake'], 'dim_sum', 'fried', ARRAY['chinese', 'teochew', 'hawker'], '1 hidangan', '1 serving', 150, 280, 28, 3, 1, 62, 'medium', 680, 200, 16, 4, 0, 85, 8, 100, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false),

('Yam Basket', 'Bakul Keladi', ARRAY['yam ring', 'crispy yam basket'], 'dim_sum', 'fried', ARRAY['chinese', 'cantonese', 'premium'], '1 bakul', '1 basket', 200, 380, 35, 5, 3, 58, 'medium', 580, 420, 22, 5, 0, 85, 16, 180, 'caution', 'caution', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- PORRIDGE & RICE
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Teochew Porridge (Plain)', 'Bubur Teochew', ARRAY['teochew congee', 'plain porridge'], 'porridge', 'bubur', ARRAY['chinese', 'teochew', 'simple'], '1 mangkuk', '1 bowl', 300, 150, 32, 0, 1, 78, 'high', 80, 60, 0.5, 0.1, 0, 0, 3, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Fish Porridge (Chinese)', 'Bubur Ikan Cina', ARRAY['sliced fish porridge', 'yu pian congee'], 'porridge', 'bubur', ARRAY['chinese', 'healthy', 'comfort'], '1 mangkuk', '1 bowl', 400, 280, 38, 1, 1, 78, 'high', 720, 350, 6, 1.5, 0, 50, 18, 200, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Century Egg Porridge', 'Bubur Telur Pidan', ARRAY['pidan porridge', 'preserved egg congee'], 'porridge', 'bubur', ARRAY['chinese', 'cantonese', 'traditional'], '1 mangkuk', '1 bowl', 400, 320, 38, 1, 1, 78, 'high', 850, 280, 12, 4, 0, 280, 16, 200, 'caution', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Fried Rice (Chinese)', 'Nasi Goreng Cina', ARRAY['chinese fried rice', 'yang chow'], 'rice_dishes', 'nasi goreng', ARRAY['chinese', 'hawker', 'popular'], '1 pinggan', '1 plate', 350, 520, 65, 3, 2, 70, 'high', 980, 260, 20, 5, 0, 120, 16, 170, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Yeung Chow Fried Rice', 'Nasi Goreng Yang Chow', ARRAY['yeung chow', 'yangzhou fried rice'], 'rice_dishes', 'nasi goreng', ARRAY['chinese', 'cantonese', 'premium'], '1 pinggan', '1 plate', 380, 580, 68, 4, 2, 70, 'high', 1050, 320, 24, 6, 0, 150, 22, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Salted Fish Fried Rice', 'Nasi Goreng Ikan Masin', ARRAY['ham yu fried rice', 'salted fish rice'], 'rice_dishes', 'nasi goreng', ARRAY['chinese', 'hawker', 'salty'], '1 pinggan', '1 plate', 350, 550, 65, 3, 2, 70, 'high', 1280, 280, 22, 5, 0, 75, 18, 180, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- NOODLES (Additional)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Beef Noodles (Soup)', 'Mee Sup Daging', ARRAY['beef noodle soup', 'niu rou mian'], 'noodles', 'mee sup', ARRAY['chinese', 'taiwanese', 'hearty'], '1 mangkuk', '1 bowl', 450, 480, 55, 4, 2, 58, 'medium', 1100, 420, 18, 6, 0, 65, 28, 260, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Duck Noodles', 'Mee Itik', ARRAY['duck noodle soup', 'itik mee'], 'noodles', 'mee sup', ARRAY['chinese', 'teochew', 'herbal'], '1 mangkuk', '1 bowl', 450, 520, 52, 4, 2, 58, 'medium', 1050, 380, 24, 8, 0, 95, 30, 280, 'caution', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Fishball Noodles (Dry)', 'Mee Bebola Ikan Kering', ARRAY['dry fishball noodles', 'yu wan mee dry'], 'noodles', 'mee', ARRAY['chinese', 'hawker', 'simple'], '1 pinggan', '1 plate', 350, 420, 52, 4, 2, 58, 'medium', 920, 280, 16, 4, 0, 55, 18, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Pork Noodles (KL Style)', 'Mee Babi KL', ARRAY['pork noodles', 'zhu rou mian'], 'noodles', 'mee sup', ARRAY['chinese', 'kl', 'popular'], '1 mangkuk', '1 bowl', 450, 480, 52, 4, 2, 58, 'medium', 1080, 350, 20, 6, 0, 75, 26, 240, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Hakka Mee', 'Mee Hakka', ARRAY['hakka noodles', 'yam mee'], 'noodles', 'mee', ARRAY['chinese', 'hakka', 'dark sauce'], '1 pinggan', '1 plate', 350, 520, 58, 6, 2, 60, 'medium', 1150, 300, 22, 6, 0, 85, 22, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- SEAFOOD
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Butter Prawns', 'Udang Mentega', ARRAY['creamy butter prawns', 'nestle prawns'], 'protein', 'seafood', ARRAY['chinese', 'popular', 'rich'], '1 hidangan', '1 serving', 150, 380, 12, 4, 0, 45, 'low', 680, 320, 28, 14, 0, 220, 22, 320, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Salted Egg Crab', 'Ketam Telur Masin', ARRAY['salted egg yolk crab', 'kam dan crab'], 'protein', 'seafood', ARRAY['chinese', 'trending', 'premium'], '1/2 ekor', '1/2 crab', 300, 480, 18, 5, 0, 45, 'low', 1280, 450, 32, 12, 0, 280, 28, 420, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Chilli Crab', 'Ketam Cili', ARRAY['singapore chilli crab', 'crab in chilli sauce'], 'protein', 'seafood', ARRAY['chinese', 'singapore', 'premium'], '1 hidangan', '1 portion', 250, 380, 15, 8, 1, 45, 'low', 1150, 420, 22, 5, 0, 180, 26, 380, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Sweet Sour Fish', 'Ikan Masam Manis', ARRAY['sweet and sour fish', 'gu lou yue'], 'protein', 'seafood', ARRAY['chinese', 'cantonese', 'popular'], '1 hidangan', '1 serving', 200, 320, 22, 15, 1, 55, 'low', 720, 380, 14, 3, 0, 60, 24, 280, 'caution', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Kam Heong Clams', 'Lala Kam Heong', ARRAY['aromatic clams', 'kam heong lala'], 'protein', 'seafood', ARRAY['chinese', 'spicy', 'aromatic'], '1 hidangan', '1 serving', 200, 280, 12, 4, 2, 40, 'low', 980, 480, 16, 4, 0, 120, 22, 350, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Steamed Prawns', 'Udang Stim', ARRAY['steamed prawns garlic', 'garlic steamed prawns'], 'protein', 'seafood', ARRAY['chinese', 'healthy', 'simple'], '1 hidangan', '1 serving', 150, 180, 4, 1, 0, 30, 'low', 520, 350, 6, 1, 0, 190, 28, 320, 'safe', 'caution', 'caution', 'limit', 'ai_estimated', false);

-- ============================================
-- TOFU & EGGS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Mapo Tofu', 'Mapo Tofu', ARRAY['szechuan tofu', 'spicy tofu'], 'protein', 'tofu', ARRAY['chinese', 'szechuan', 'spicy'], '1 hidangan', '1 serving', 200, 280, 10, 3, 2, 40, 'low', 850, 380, 18, 4, 0, 35, 18, 220, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Tofu Goreng', 'Tofu Goreng', ARRAY['fried tofu', 'tauhu goreng'], 'protein', 'tofu', ARRAY['chinese', 'simple', 'vegetarian'], '4 potong', '4 pieces', 120, 220, 8, 1, 1, 35, 'low', 380, 220, 16, 2, 0, 0, 14, 180, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Telur Dadar Cina', 'Telur Dadar Cina', ARRAY['chinese omelette', 'egg omelette'], 'protein', 'egg', ARRAY['chinese', 'simple', 'quick'], '1 biji besar', '1 large', 100, 180, 2, 1, 0, 30, 'low', 420, 140, 14, 4, 0, 370, 12, 180, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false);

