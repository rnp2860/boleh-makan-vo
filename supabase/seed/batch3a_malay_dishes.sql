-- 🇲🇾 Malaysian Food Database - Batch 3A: Malay Main Dishes (50 foods)
-- All values per standard Malaysian serving

-- ============================================
-- GULAI & KARI (Curries)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Gulai Ayam (Malay Chicken Curry)', 'Gulai Ayam', ARRAY['chicken curry malay', 'ayam gulai'], 'protein', 'gulai', ARRAY['malay', 'traditional', 'kenduri'], '1 ketul dengan kuah', '1 piece with gravy', 200, 320, 8, 3, 1, 35, 'low', 680, 380, 22, 12, 0, 95, 24, 220, 'safe', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Gulai Daging (Beef Curry)', 'Gulai Daging', ARRAY['beef curry malay', 'daging gulai'], 'protein', 'gulai', ARRAY['malay', 'traditional', 'kenduri'], '1 hidangan', '1 serving', 150, 350, 6, 2, 1, 30, 'low', 620, 400, 26, 14, 0, 85, 26, 240, 'safe', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Gulai Ikan (Fish Curry)', 'Gulai Ikan', ARRAY['fish curry malay', 'ikan gulai'], 'protein', 'gulai', ARRAY['malay', 'traditional', 'healthy'], '1 ketul dengan kuah', '1 piece with gravy', 180, 280, 7, 2, 1, 30, 'low', 580, 420, 18, 10, 0, 65, 22, 280, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Gulai Kawah (Big Pot Curry)', 'Gulai Kawah', ARRAY['kenduri curry', 'gulai kenduri'], 'protein', 'gulai', ARRAY['malay', 'kenduri', 'traditional'], '1 hidangan', '1 serving', 200, 380, 10, 4, 2, 38, 'low', 750, 350, 28, 15, 0, 90, 22, 200, 'safe', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Gulai Tempoyak (Durian Curry)', 'Gulai Tempoyak', ARRAY['durian curry', 'tempoyak ikan'], 'protein', 'gulai', ARRAY['pahang', 'traditional', 'unique'], '1 hidangan', '1 serving', 200, 320, 15, 8, 3, 45, 'low', 520, 450, 22, 12, 0, 55, 18, 180, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Gulai Nangka (Jackfruit Curry)', 'Gulai Nangka', ARRAY['jackfruit curry', 'nangka masak lemak'], 'vegetables', 'gulai', ARRAY['malay', 'vegetarian', 'traditional'], '1 hidangan', '1 serving', 150, 220, 18, 10, 3, 50, 'low', 480, 380, 14, 10, 0, 15, 4, 80, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Gulai Rebung (Bamboo Shoot Curry)', 'Gulai Rebung', ARRAY['bamboo shoot curry', 'rebung masak lemak'], 'vegetables', 'gulai', ARRAY['malay', 'traditional', 'fiber'], '1 hidangan', '1 serving', 150, 180, 12, 4, 4, 40, 'low', 450, 420, 12, 8, 0, 10, 5, 100, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Kari Kepala Ikan (Fish Head Curry)', 'Kari Kepala Ikan', ARRAY['fish head curry', 'curry fish head'], 'protein', 'kari', ARRAY['indian-malay', 'popular', 'sharing'], '1 hidangan', '1 serving', 250, 420, 12, 4, 2, 35, 'low', 980, 520, 28, 12, 0, 120, 32, 380, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Kari Kambing (Mutton Curry)', 'Kari Kambing', ARRAY['mutton curry', 'lamb curry'], 'protein', 'kari', ARRAY['malay', 'festive', 'rich'], '1 hidangan', '1 serving', 180, 420, 8, 3, 1, 30, 'low', 720, 380, 32, 16, 0, 95, 28, 280, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Kari Daging (Beef Curry)', 'Kari Daging', ARRAY['beef curry', 'daging kari'], 'protein', 'kari', ARRAY['malay', 'traditional'], '1 hidangan', '1 serving', 180, 380, 8, 3, 1, 30, 'low', 680, 400, 28, 14, 0, 80, 26, 260, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false);

-- ============================================
-- MASAK LEMAK (Coconut Milk Dishes)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Masak Lemak Cili Api Ayam', 'Masak Lemak Cili Api Ayam', ARRAY['chicken in spicy coconut', 'ayam cili api'], 'protein', 'masak lemak', ARRAY['negeri sembilan', 'spicy', 'traditional'], '1 ketul dengan kuah', '1 piece with gravy', 200, 350, 6, 3, 1, 35, 'low', 580, 380, 26, 16, 0, 95, 26, 220, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Masak Lemak Cili Api Daging', 'Masak Lemak Cili Api Daging', ARRAY['beef in spicy coconut', 'daging cili api'], 'protein', 'masak lemak', ARRAY['negeri sembilan', 'spicy', 'traditional'], '1 hidangan', '1 serving', 180, 380, 5, 2, 1, 30, 'low', 620, 400, 30, 18, 0, 80, 26, 240, 'safe', 'limit', 'limit', 'caution', 'ai_estimated', false),

('Masak Lemak Cili Api Ikan', 'Masak Lemak Cili Api Ikan', ARRAY['fish in spicy coconut', 'ikan cili api'], 'protein', 'masak lemak', ARRAY['negeri sembilan', 'spicy', 'traditional'], '1 ketul dengan kuah', '1 piece with gravy', 180, 300, 5, 2, 1, 30, 'low', 520, 420, 20, 14, 0, 60, 24, 280, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Masak Lemak Cili Api Udang', 'Masak Lemak Cili Api Udang', ARRAY['prawns in spicy coconut', 'udang cili api'], 'protein', 'masak lemak', ARRAY['negeri sembilan', 'seafood', 'spicy'], '1 hidangan', '1 serving', 150, 280, 5, 2, 1, 30, 'low', 650, 350, 18, 12, 0, 180, 22, 300, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Masak Lemak Cili Padi Pucuk Ubi', 'Masak Lemak Pucuk Ubi', ARRAY['tapioca leaves in coconut', 'pucuk ubi masak lemak'], 'vegetables', 'masak lemak', ARRAY['malay', 'vegetable', 'traditional'], '1 hidangan', '1 serving', 120, 180, 10, 3, 4, 40, 'low', 380, 450, 14, 10, 0, 10, 4, 80, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Masak Lemak Telur Itik', 'Masak Lemak Telur Itik', ARRAY['duck egg in coconut', 'telur itik masak lemak'], 'protein', 'masak lemak', ARRAY['malay', 'traditional', 'rich'], '2 biji', '2 eggs', 140, 320, 4, 2, 0, 35, 'low', 480, 200, 26, 14, 0, 420, 16, 220, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Masak Lemak Rebung', 'Masak Lemak Rebung', ARRAY['bamboo shoot in coconut', 'rebung santan'], 'vegetables', 'masak lemak', ARRAY['malay', 'traditional', 'vegetable'], '1 hidangan', '1 serving', 150, 200, 14, 5, 4, 42, 'low', 420, 400, 14, 10, 0, 10, 5, 100, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- SAMBAL DISHES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Sambal Tumis (Basic Sambal)', 'Sambal Tumis', ARRAY['fried sambal', 'sambal masak'], 'condiments', 'sambal', ARRAY['malay', 'spicy', 'basic'], '2 sudu makan', '2 tablespoons', 30, 80, 6, 4, 1, 45, 'low', 320, 120, 6, 1, 0, 0, 1, 20, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Sambal Belacan', 'Sambal Belacan', ARRAY['shrimp paste sambal', 'belacan sambal'], 'condiments', 'sambal', ARRAY['malay', 'spicy', 'traditional'], '2 sudu makan', '2 tablespoons', 30, 50, 4, 2, 1, 35, 'low', 580, 100, 3, 0.5, 0, 15, 2, 40, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Sambal Ikan Bilis', 'Sambal Ikan Bilis', ARRAY['anchovy sambal', 'ikan bilis goreng sambal'], 'condiments', 'sambal', ARRAY['malay', 'nasi lemak', 'popular'], '2 sudu makan', '2 tablespoons', 40, 120, 8, 5, 1, 45, 'low', 480, 150, 8, 2, 0, 35, 6, 100, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Sambal Udang', 'Sambal Udang', ARRAY['prawn sambal', 'udang sambal tumis'], 'protein', 'sambal', ARRAY['malay', 'seafood', 'spicy'], '1 hidangan', '1 serving', 100, 180, 8, 5, 1, 40, 'low', 620, 280, 10, 2, 0, 150, 16, 220, 'safe', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Sambal Sotong', 'Sambal Sotong', ARRAY['squid sambal', 'sotong sambal tumis'], 'protein', 'sambal', ARRAY['malay', 'seafood', 'spicy'], '1 hidangan', '1 serving', 100, 160, 8, 5, 1, 40, 'low', 680, 300, 8, 2, 0, 180, 14, 200, 'safe', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Sambal Telur', 'Sambal Telur', ARRAY['egg sambal', 'telur sambal'], 'protein', 'sambal', ARRAY['malay', 'budget', 'popular'], '2 biji', '2 eggs', 100, 200, 8, 5, 1, 40, 'low', 520, 180, 14, 4, 0, 370, 12, 180, 'safe', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Sambal Petai Udang', 'Sambal Petai Udang', ARRAY['petai prawn sambal', 'petai sambal'], 'protein', 'sambal', ARRAY['malay', 'aromatic', 'spicy'], '1 hidangan', '1 serving', 120, 220, 12, 4, 4, 38, 'low', 580, 380, 14, 3, 0, 120, 14, 200, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Sambal Tempoyak', 'Sambal Tempoyak', ARRAY['fermented durian sambal', 'tempoyak sambal'], 'condiments', 'sambal', ARRAY['pahang', 'unique', 'traditional'], '2 sudu makan', '2 tablespoons', 40, 100, 10, 6, 2, 45, 'low', 420, 200, 6, 3, 0, 0, 2, 40, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- GORENG & BAKAR (Fried & Grilled)
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Ayam Goreng Berempah', 'Ayam Goreng Berempah', ARRAY['spiced fried chicken', 'malay fried chicken'], 'protein', 'goreng', ARRAY['malay', 'popular', 'crispy'], '1 ketul', '1 piece', 120, 280, 8, 1, 0, 45, 'low', 520, 280, 18, 5, 0, 90, 22, 200, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Ayam Bakar (Grilled Chicken)', 'Ayam Bakar', ARRAY['grilled chicken', 'bbq chicken malay'], 'protein', 'bakar', ARRAY['malay', 'healthy', 'grilled'], '1 ketul', '1 piece', 150, 250, 6, 4, 0, 40, 'low', 580, 320, 12, 4, 0, 95, 30, 240, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Ikan Goreng Berlada', 'Ikan Goreng Berlada', ARRAY['fried fish with chilli', 'ikan berlada'], 'protein', 'goreng', ARRAY['malay', 'spicy', 'popular'], '1 ekor', '1 fish', 150, 280, 10, 4, 1, 40, 'low', 620, 380, 16, 4, 0, 60, 24, 280, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Ikan Bakar Sambal', 'Ikan Bakar Sambal', ARRAY['grilled fish with sambal', 'bbq fish sambal'], 'protein', 'bakar', ARRAY['malay', 'hawker', 'popular'], '1 ekor sederhana', '1 medium fish', 200, 320, 8, 4, 1, 35, 'low', 680, 480, 16, 4, 0, 70, 36, 340, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Daging Bakar', 'Daging Bakar', ARRAY['grilled beef', 'bbq beef'], 'protein', 'bakar', ARRAY['malay', 'grilled', 'protein'], '1 hidangan', '1 serving', 150, 320, 4, 2, 0, 30, 'low', 520, 380, 20, 8, 0, 75, 32, 280, 'safe', 'caution', 'caution', 'limit', 'ai_estimated', false),

('Sotong Goreng Tepung', 'Sotong Goreng Tepung', ARRAY['fried calamari', 'battered squid'], 'protein', 'goreng', ARRAY['malay', 'snack', 'crispy'], '1 hidangan', '1 serving', 120, 280, 18, 2, 1, 55, 'low', 580, 280, 16, 3, 0, 200, 16, 220, 'caution', 'caution', 'limit', 'caution', 'ai_estimated', false),

('Udang Goreng Kunyit', 'Udang Goreng Kunyit', ARRAY['turmeric fried prawns', 'udang kunyit'], 'protein', 'goreng', ARRAY['malay', 'turmeric', 'crispy'], '1 hidangan', '1 serving', 100, 220, 10, 1, 0, 45, 'low', 520, 280, 14, 2, 0, 170, 18, 280, 'safe', 'caution', 'caution', 'limit', 'ai_estimated', false);

-- ============================================
-- KERABU & SALADS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kerabu Mangga', 'Kerabu Mangga', ARRAY['mango salad', 'mango kerabu'], 'vegetables', 'kerabu', ARRAY['malay', 'refreshing', 'healthy'], '1 hidangan', '1 serving', 120, 120, 18, 12, 3, 50, 'low', 380, 280, 5, 1, 0, 20, 4, 50, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Kerabu Kacang Botol', 'Kerabu Kacang Botol', ARRAY['winged bean salad', 'kacang botol kerabu'], 'vegetables', 'kerabu', ARRAY['malay', 'healthy', 'fiber'], '1 hidangan', '1 serving', 100, 100, 8, 3, 4, 35, 'low', 420, 320, 6, 2, 0, 25, 5, 80, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Kerabu Taugeh', 'Kerabu Taugeh', ARRAY['bean sprout salad', 'taugeh kerabu'], 'vegetables', 'kerabu', ARRAY['malay', 'simple', 'healthy'], '1 hidangan', '1 serving', 100, 80, 6, 2, 2, 30, 'low', 350, 200, 4, 1, 0, 15, 4, 60, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Kerabu Paku Pakis', 'Kerabu Paku Pakis', ARRAY['fern salad', 'paku pakis kerabu'], 'vegetables', 'kerabu', ARRAY['malay', 'traditional', 'fiber'], '1 hidangan', '1 serving', 100, 90, 6, 2, 4, 30, 'low', 380, 350, 5, 1, 0, 20, 4, 70, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Ulam Raja (Herb Salad)', 'Ulam Raja', ARRAY['cosmos salad', 'ulam raja'], 'vegetables', 'ulam', ARRAY['malay', 'healthy', 'traditional'], '1 hidangan', '1 serving', 50, 25, 4, 1, 2, 25, 'low', 120, 180, 0.5, 0, 0, 0, 2, 30, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Pegaga (Pennywort Salad)', 'Pegaga', ARRAY['pennywort', 'gotu kola'], 'vegetables', 'ulam', ARRAY['malay', 'healthy', 'medicinal'], '1 hidangan', '1 serving', 50, 20, 3, 1, 2, 25, 'low', 100, 200, 0.3, 0, 0, 0, 1, 25, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- SOUPS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Sup Ayam (Chicken Soup)', 'Sup Ayam', ARRAY['chicken soup', 'clear chicken soup'], 'soup', 'sup', ARRAY['malay', 'comfort', 'healthy'], '1 mangkuk', '1 bowl', 350, 180, 8, 2, 1, 35, 'low', 780, 380, 6, 2, 0, 55, 18, 180, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Sup Tulang (Bone Soup)', 'Sup Tulang', ARRAY['bone soup', 'tulang merah'], 'soup', 'sup', ARRAY['malay', 'mamak', 'popular'], '1 mangkuk', '1 bowl', 400, 380, 12, 4, 1, 40, 'low', 1100, 350, 22, 10, 0, 75, 28, 280, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Sup Ekor (Oxtail Soup)', 'Sup Ekor', ARRAY['oxtail soup', 'sup buntut'], 'soup', 'sup', ARRAY['malay', 'rich', 'traditional'], '1 mangkuk', '1 bowl', 400, 350, 10, 3, 1, 35, 'low', 950, 420, 20, 8, 0, 85, 30, 300, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Sup Kambing (Mutton Soup)', 'Sup Kambing', ARRAY['mutton soup', 'lamb soup'], 'soup', 'sup', ARRAY['malay', 'mamak', 'warming'], '1 mangkuk', '1 bowl', 400, 320, 10, 3, 1, 35, 'low', 920, 380, 18, 8, 0, 80, 26, 280, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Sup Gear Box (Bone Marrow Soup)', 'Sup Gear Box', ARRAY['bone marrow soup', 'sup gearbox'], 'soup', 'sup', ARRAY['mamak', 'popular', 'rich'], '1 mangkuk', '1 bowl', 400, 420, 10, 4, 1, 38, 'low', 1050, 350, 28, 12, 0, 90, 28, 300, 'safe', 'limit', 'limit', 'limit', 'ai_estimated', false),

('Soto Ayam', 'Soto Ayam', ARRAY['soto', 'javanese chicken soup'], 'soup', 'soto', ARRAY['malay', 'javanese', 'popular'], '1 mangkuk', '1 bowl', 400, 280, 22, 3, 2, 50, 'low', 850, 380, 12, 4, 0, 65, 20, 200, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false);

-- ============================================
-- OTHER MALAY DISHES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Asam Pedas Ikan', 'Asam Pedas Ikan', ARRAY['sour spicy fish', 'asam pedas'], 'protein', 'asam', ARRAY['malay', 'melaka', 'spicy'], '1 ketul dengan kuah', '1 piece with gravy', 200, 280, 10, 4, 2, 35, 'low', 720, 450, 14, 3, 0, 65, 28, 320, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Asam Pedas Daging', 'Asam Pedas Daging', ARRAY['sour spicy beef', 'daging asam pedas'], 'protein', 'asam', ARRAY['malay', 'spicy', 'sour'], '1 hidangan', '1 serving', 180, 320, 10, 4, 2, 35, 'low', 680, 420, 20, 8, 0, 70, 26, 260, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Pais Ikan (Fish in Banana Leaf)', 'Pais Ikan', ARRAY['fish in banana leaf', 'otak-otak ikan'], 'protein', 'bakar', ARRAY['malay', 'traditional', 'aromatic'], '1 bungkus', '1 packet', 100, 180, 6, 2, 1, 35, 'low', 480, 320, 12, 6, 0, 55, 14, 200, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Dendeng Daging (Beef Jerky)', 'Dendeng Daging', ARRAY['beef jerky', 'dried beef'], 'protein', 'dendeng', ARRAY['malay', 'snack', 'preserved'], '50g', '50g serving', 50, 180, 12, 8, 0, 45, 'low', 580, 280, 6, 3, 0, 40, 20, 180, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Serunding Daging (Beef Floss)', 'Serunding Daging', ARRAY['beef floss', 'meat floss'], 'protein', 'serunding', ARRAY['malay', 'raya', 'condiment'], '2 sudu makan', '2 tablespoons', 30, 120, 5, 3, 1, 40, 'low', 280, 180, 6, 3, 0, 25, 12, 120, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Perut Ikan (Fish Stomach Curry)', 'Perut Ikan', ARRAY['fish stomach', 'perut ikan masak'], 'protein', 'gulai', ARRAY['perak', 'traditional', 'unique'], '1 hidangan', '1 serving', 150, 220, 8, 3, 1, 35, 'low', 580, 280, 14, 8, 0, 120, 16, 200, 'safe', 'caution', 'caution', 'caution', 'ai_estimated', false);

