-- 🇲🇾 Malaysian Food Database - Batch 3D: Fast Food - Malaysian Menus (50 foods)
-- All values per standard serving

-- ============================================
-- McDONALD'S MALAYSIA
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('McD Big Mac', 'McD Big Mac', ARRAY['big mac', 'mcd burger'], 'fast_food', 'burger', ARRAY['mcd', 'burger', 'popular'], '1 burger', '1 burger', 215, 540, 45, 9, 3, 65, 'medium', 1010, 380, 28, 10, 1, 80, 25, 260, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('McD McChicken', 'McD McChicken', ARRAY['mcchicken', 'chicken burger mcd'], 'fast_food', 'burger', ARRAY['mcd', 'chicken', 'popular'], '1 burger', '1 burger', 170, 420, 39, 5, 2, 65, 'medium', 780, 280, 22, 4, 0.5, 45, 15, 200, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('McD Filet-O-Fish', 'McD Filet-O-Fish', ARRAY['fillet o fish', 'fish burger mcd'], 'fast_food', 'burger', ARRAY['mcd', 'fish', 'classic'], '1 burger', '1 burger', 140, 380, 38, 5, 2, 62, 'medium', 580, 220, 18, 4, 0, 40, 15, 180, 'caution', 'caution', 'safe', 'caution', 'ai_estimated', false),

('McD Spicy Chicken McDeluxe', 'McD Ayam McDeluxe Pedas', ARRAY['spicy mcdeluxe', 'ayam mcd pedas'], 'fast_food', 'burger', ARRAY['mcd', 'spicy', 'popular'], '1 burger', '1 burger', 220, 520, 42, 7, 3, 65, 'medium', 920, 320, 28, 6, 0.5, 65, 24, 240, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('McD Ayam Goreng (2 pieces)', 'McD Ayam Goreng', ARRAY['mcd fried chicken', 'ayam mcd'], 'fast_food', 'chicken', ARRAY['mcd', 'fried chicken', 'popular'], '2 ketul', '2 pieces', 200, 480, 18, 1, 1, 55, 'low', 980, 340, 28, 8, 0.5, 140, 38, 320, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('McD GCB', 'McD GCB', ARRAY['grilled chicken burger', 'gcb mcd'], 'fast_food', 'burger', ARRAY['mcd', 'grilled', 'healthier'], '1 burger', '1 burger', 200, 420, 38, 8, 2, 60, 'medium', 850, 320, 18, 4, 0, 70, 28, 260, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('McD Fries Medium', 'McD Fries Sederhana', ARRAY['medium fries', 'kentang mcd'], 'fast_food', 'sides', ARRAY['mcd', 'fries', 'popular'], '1 medium', '1 medium', 117, 340, 44, 0, 4, 75, 'high', 230, 550, 16, 2, 0, 0, 4, 100, 'limit', 'safe', 'safe', 'caution', 'ai_estimated', false),

('McD Fries Large', 'McD Fries Besar', ARRAY['large fries', 'kentang besar mcd'], 'fast_food', 'sides', ARRAY['mcd', 'fries', 'large'], '1 large', '1 large', 154, 450, 58, 0, 5, 75, 'high', 300, 720, 22, 3, 0, 0, 5, 130, 'limit', 'caution', 'safe', 'caution', 'ai_estimated', false),

('McD McFlurry', 'McD McFlurry', ARRAY['mcflurry', 'ice cream mcd'], 'fast_food', 'dessert', ARRAY['mcd', 'ice cream', 'dessert'], '1 cup', '1 cup', 200, 420, 62, 52, 1, 65, 'medium', 180, 280, 16, 10, 0, 45, 8, 180, 'limit', 'safe', 'caution', 'caution', 'ai_estimated', false),

('McD Sundae', 'McD Sundae', ARRAY['sundae mcd', 'ice cream sundae'], 'fast_food', 'dessert', ARRAY['mcd', 'ice cream', 'classic'], '1 cup', '1 cup', 150, 280, 48, 42, 0, 65, 'medium', 120, 200, 8, 5, 0, 25, 5, 140, 'limit', 'safe', 'safe', 'caution', 'ai_estimated', false),

('McD Bubur Ayam', 'McD Bubur Ayam', ARRAY['mcd porridge', 'porridge mcd'], 'fast_food', 'porridge', ARRAY['mcd', 'breakfast', 'porridge'], '1 mangkuk', '1 bowl', 350, 290, 44, 2, 1, 78, 'high', 820, 250, 7, 2, 0, 50, 15, 150, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('McD Nasi Lemak', 'McD Nasi Lemak', ARRAY['mcd nasi lemak', 'nasi lemak mcd'], 'fast_food', 'nasi', ARRAY['mcd', 'malaysian', 'seasonal'], '1 set', '1 set', 350, 580, 72, 6, 3, 72, 'high', 920, 280, 24, 8, 0, 95, 22, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('McD Prosperity Burger', 'McD Prosperity Burger', ARRAY['prosperity burger', 'cny burger'], 'fast_food', 'burger', ARRAY['mcd', 'seasonal', 'beef'], '1 burger', '1 burger', 230, 580, 48, 12, 3, 65, 'medium', 980, 400, 32, 12, 0.5, 85, 28, 280, 'caution', 'limit', 'limit', 'limit', 'ai_estimated', false);

-- ============================================
-- KFC MALAYSIA
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('KFC Original Recipe', 'KFC Original Recipe', ARRAY['kfc original', 'ayam kfc'], 'fast_food', 'chicken', ARRAY['kfc', 'fried chicken', 'classic'], '1 ketul', '1 piece', 100, 260, 9, 0, 0, 50, 'low', 620, 220, 16, 4, 0, 70, 20, 180, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('KFC Hot & Spicy', 'KFC Hot & Spicy', ARRAY['kfc spicy', 'ayam pedas kfc'], 'fast_food', 'chicken', ARRAY['kfc', 'spicy', 'popular'], '1 ketul', '1 piece', 100, 280, 12, 0, 0, 52, 'low', 680, 230, 18, 4.5, 0, 75, 18, 175, 'safe', 'limit', 'safe', 'caution', 'ai_estimated', false),

('KFC Zinger Burger', 'KFC Zinger', ARRAY['zinger', 'zinger burger'], 'fast_food', 'burger', ARRAY['kfc', 'spicy', 'popular'], '1 burger', '1 burger', 200, 480, 42, 6, 2, 62, 'medium', 1080, 320, 24, 5, 0.5, 55, 22, 240, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('KFC Colonel Burger', 'KFC Colonel Burger', ARRAY['colonel burger', 'classic burger kfc'], 'fast_food', 'burger', ARRAY['kfc', 'burger', 'classic'], '1 burger', '1 burger', 180, 420, 38, 5, 2, 62, 'medium', 920, 280, 22, 5, 0, 50, 18, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('KFC Cheesy Wedges', 'KFC Cheesy Wedges', ARRAY['wedges kfc', 'potato wedges'], 'fast_food', 'sides', ARRAY['kfc', 'sides', 'cheesy'], '1 regular', '1 regular', 120, 280, 32, 2, 3, 70, 'high', 480, 420, 14, 5, 0, 15, 6, 120, 'caution', 'caution', 'caution', 'caution', 'ai_estimated', false),

('KFC Coleslaw', 'KFC Coleslaw', ARRAY['coleslaw kfc', 'salad kfc'], 'fast_food', 'sides', ARRAY['kfc', 'salad', 'fresh'], '1 regular', '1 regular', 100, 120, 12, 8, 2, 45, 'low', 180, 150, 8, 1.5, 0, 5, 1, 30, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('KFC Whipped Potato', 'KFC Kentang Putar', ARRAY['mashed potato kfc', 'whipped potato'], 'fast_food', 'sides', ARRAY['kfc', 'sides', 'creamy'], '1 regular', '1 regular', 120, 180, 28, 2, 2, 80, 'high', 450, 280, 6, 2, 0, 5, 4, 80, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('KFC Nasi Lemak', 'KFC Nasi Lemak', ARRAY['nasi lemak kfc', 'nasi kfc'], 'fast_food', 'nasi', ARRAY['kfc', 'malaysian', 'seasonal'], '1 set', '1 set', 380, 620, 75, 5, 3, 72, 'high', 980, 300, 26, 8, 0, 90, 24, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('KFC Bandito Pocket', 'KFC Bandito Pocket', ARRAY['bandito kfc', 'wrap kfc'], 'fast_food', 'wrap', ARRAY['kfc', 'wrap', 'convenient'], '1 pocket', '1 pocket', 150, 380, 32, 4, 2, 58, 'medium', 780, 240, 22, 6, 0, 45, 16, 180, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false);

-- ============================================
-- TEXAS CHICKEN & MARRYBROWN
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Texas Spicy Chicken', 'Texas Ayam Pedas', ARRAY['texas chicken', 'ayam texas'], 'fast_food', 'chicken', ARRAY['texas', 'spicy', 'fried'], '1 ketul', '1 piece', 120, 320, 14, 1, 0, 52, 'low', 720, 250, 20, 5, 0, 85, 22, 200, 'safe', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Texas Chicken Burger', 'Texas Burger Ayam', ARRAY['texas burger', 'chicken burger texas'], 'fast_food', 'burger', ARRAY['texas', 'burger', 'spicy'], '1 burger', '1 burger', 200, 480, 40, 6, 2, 62, 'medium', 920, 300, 26, 6, 0.5, 60, 22, 220, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Texas Honey Butter Biscuit', 'Texas Honey Butter Biscuit', ARRAY['texas biscuit', 'honey biscuit'], 'fast_food', 'sides', ARRAY['texas', 'sweet', 'biscuit'], '1 biscuit', '1 biscuit', 80, 280, 35, 12, 1, 72, 'high', 480, 80, 14, 6, 0, 20, 4, 60, 'limit', 'caution', 'caution', 'safe', 'ai_estimated', false),

('Marrybrown Chicken', 'Marrybrown Ayam', ARRAY['mb chicken', 'ayam marrybrown'], 'fast_food', 'chicken', ARRAY['marrybrown', 'local', 'fried'], '1 ketul', '1 piece', 100, 250, 10, 0, 0, 50, 'low', 580, 220, 15, 4, 0, 65, 18, 170, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Marrybrown Nasi Lemak', 'Marrybrown Nasi Lemak', ARRAY['mb nasi lemak', 'nasi lemak mb'], 'fast_food', 'nasi', ARRAY['marrybrown', 'malaysian', 'local'], '1 set', '1 set', 350, 580, 70, 5, 3, 72, 'high', 850, 280, 26, 8, 0, 85, 20, 190, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Marrybrown Porridge', 'Marrybrown Bubur', ARRAY['mb porridge', 'bubur marrybrown'], 'fast_food', 'porridge', ARRAY['marrybrown', 'breakfast', 'comfort'], '1 mangkuk', '1 bowl', 350, 280, 42, 2, 1, 78, 'high', 780, 240, 6, 2, 0, 45, 14, 140, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- PIZZA
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Pizza Hut Personal Pan', 'Pizza Hut Personal', ARRAY['personal pizza', 'pizza kecil'], 'fast_food', 'pizza', ARRAY['pizza hut', 'personal', 'complete'], '1 pizza', '1 pizza', 200, 520, 58, 6, 3, 65, 'medium', 980, 280, 22, 10, 0, 45, 20, 260, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Pizza Hut Regular Slice', 'Pizza Hut Slice', ARRAY['pizza slice', 'potongan pizza'], 'fast_food', 'pizza', ARRAY['pizza hut', 'slice', 'sharing'], '1 slice', '1 slice', 100, 260, 28, 3, 1, 65, 'medium', 520, 140, 12, 5, 0, 25, 10, 140, 'caution', 'caution', 'caution', 'caution', 'ai_estimated', false),

('Dominos Personal Pizza', 'Dominos Personal', ARRAY['dominos small', 'pizza dominos'], 'fast_food', 'pizza', ARRAY['dominos', 'personal', 'thin'], '1 pizza', '1 pizza', 180, 480, 52, 5, 2, 65, 'medium', 920, 260, 20, 9, 0, 40, 18, 240, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Dominos Regular Slice', 'Dominos Slice', ARRAY['dominos slice', 'dominos potong'], 'fast_food', 'pizza', ARRAY['dominos', 'slice', 'sharing'], '1 slice', '1 slice', 90, 240, 26, 3, 1, 65, 'medium', 480, 130, 10, 4.5, 0, 22, 9, 130, 'caution', 'caution', 'caution', 'safe', 'ai_estimated', false);

-- ============================================
-- SUBWAY
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Subway 6-inch Chicken Teriyaki', 'Subway Teriyaki Ayam', ARRAY['teriyaki sub', 'subway chicken'], 'fast_food', 'sandwich', ARRAY['subway', 'healthy-ish', 'chicken'], '1 sub 6"', '1 6-inch', 280, 420, 52, 12, 4, 58, 'medium', 1020, 380, 12, 3, 0, 55, 26, 280, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false),

('Subway 6-inch Tuna', 'Subway Tuna', ARRAY['tuna sub', 'subway tuna'], 'fast_food', 'sandwich', ARRAY['subway', 'seafood', 'protein'], '1 sub 6"', '1 6-inch', 280, 480, 44, 6, 4, 55, 'low', 820, 320, 24, 5, 0, 45, 22, 260, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false),

('Subway 6-inch Veggie Delite', 'Subway Veggie', ARRAY['veggie sub', 'subway vegetarian'], 'fast_food', 'sandwich', ARRAY['subway', 'vegetarian', 'healthy'], '1 sub 6"', '1 6-inch', 220, 280, 46, 6, 5, 55, 'low', 480, 280, 4, 1, 0, 0, 10, 120, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Subway Salad', 'Subway Salad', ARRAY['subway salad', 'salad bowl'], 'fast_food', 'salad', ARRAY['subway', 'healthy', 'low carb'], '1 bowl', '1 bowl', 300, 180, 12, 4, 4, 30, 'low', 380, 380, 8, 2, 0, 25, 16, 200, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false);

-- ============================================
-- SUSHI KING & NANDO'S
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Sushi King Set Meal', 'Sushi King Set', ARRAY['sushi set', 'bento sushi king'], 'fast_food', 'japanese', ARRAY['sushi king', 'japanese', 'set meal'], '1 set', '1 set', 400, 580, 82, 12, 3, 68, 'medium', 1280, 380, 14, 3, 0, 55, 26, 300, 'limit', 'limit', 'safe', 'limit', 'ai_estimated', false),

('California Roll', 'California Roll', ARRAY['california maki', 'crab roll'], 'fast_food', 'sushi', ARRAY['japanese', 'sushi', 'popular'], '6 pieces', '6 pieces', 180, 280, 42, 6, 2, 65, 'medium', 580, 220, 8, 1.5, 0, 25, 10, 140, 'caution', 'caution', 'safe', 'caution', 'ai_estimated', false),

('Salmon Sashimi', 'Salmon Sashimi', ARRAY['raw salmon', 'salmon slice'], 'fast_food', 'sashimi', ARRAY['japanese', 'raw', 'healthy'], '5 slices', '5 slices', 100, 180, 0, 0, 0, 0, 'low', 280, 380, 10, 2, 0, 45, 22, 280, 'safe', 'safe', 'safe', 'limit', 'ai_estimated', false),

('Unagi Don', 'Unagi Don', ARRAY['eel rice bowl', 'unagi rice'], 'fast_food', 'japanese', ARRAY['japanese', 'premium', 'eel'], '1 bowl', '1 bowl', 380, 620, 85, 18, 2, 72, 'high', 980, 350, 18, 4, 0, 120, 28, 320, 'limit', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Nandos Quarter Chicken', 'Nandos 1/4 Ayam', ARRAY['nandos chicken', 'peri peri chicken'], 'fast_food', 'chicken', ARRAY['nandos', 'peri-peri', 'grilled'], '1/4 ekor', '1/4 chicken', 200, 280, 2, 1, 0, 30, 'low', 720, 380, 14, 4, 0, 110, 36, 300, 'safe', 'limit', 'safe', 'limit', 'ai_estimated', false),

('Nandos Half Chicken', 'Nandos 1/2 Ayam', ARRAY['nandos half', 'half peri peri'], 'fast_food', 'chicken', ARRAY['nandos', 'peri-peri', 'sharing'], '1/2 ekor', '1/2 chicken', 400, 560, 4, 2, 0, 30, 'low', 1440, 760, 28, 8, 0, 220, 72, 600, 'safe', 'limit', 'caution', 'limit', 'ai_estimated', false),

('Nandos Peri-Peri Rice', 'Nandos Nasi Peri-Peri', ARRAY['spiced rice nandos', 'peri rice'], 'fast_food', 'sides', ARRAY['nandos', 'rice', 'spicy'], '1 hidangan', '1 serving', 180, 280, 52, 2, 2, 68, 'medium', 480, 180, 5, 1, 0, 5, 6, 100, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false),

('Nandos Coleslaw', 'Nandos Coleslaw', ARRAY['nandos salad', 'coleslaw'], 'fast_food', 'sides', ARRAY['nandos', 'salad', 'fresh'], '1 hidangan', '1 serving', 100, 110, 10, 6, 2, 40, 'low', 180, 140, 8, 1, 0, 5, 1, 30, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Nandos Garlic Bread', 'Nandos Roti Bawang', ARRAY['garlic bread nandos', 'roti putih'], 'fast_food', 'sides', ARRAY['nandos', 'bread', 'garlic'], '1 hidangan', '1 serving', 80, 220, 28, 2, 1, 70, 'high', 420, 80, 10, 4, 0, 10, 5, 60, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- BUBBLE TEA
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Bubble Tea Original (Large)', 'Bubble Tea Original', ARRAY['boba tea', 'pearl milk tea'], 'drinks', 'bubble tea', ARRAY['trending', 'sweet', 'popular'], '1 large', '1 large', 500, 380, 68, 55, 0, 65, 'medium', 80, 180, 10, 6, 0, 20, 4, 100, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Bubble Tea Less Sugar', 'Bubble Tea Kurang Gula', ARRAY['boba less sweet', 'pearl tea 50%'], 'drinks', 'bubble tea', ARRAY['trending', 'less sugar'], '1 large', '1 large', 500, 280, 50, 38, 0, 60, 'medium', 80, 180, 8, 5, 0, 18, 4, 95, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Bubble Tea No Sugar', 'Bubble Tea Tanpa Gula', ARRAY['boba no sugar', 'unsweetened boba'], 'drinks', 'bubble tea', ARRAY['trending', 'healthy', 'no sugar'], '1 large', '1 large', 500, 180, 32, 18, 0, 50, 'low', 80, 180, 6, 4, 0, 15, 3, 90, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Tealive Signature', 'Tealive Signature', ARRAY['tealive', 'signature milk tea'], 'drinks', 'bubble tea', ARRAY['tealive', 'popular', 'local'], '1 large', '1 large', 500, 350, 62, 50, 0, 62, 'medium', 90, 170, 10, 6, 0, 20, 4, 95, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false),

('Gong Cha Milk Tea', 'Gong Cha', ARRAY['gong cha', 'taiwan milk tea'], 'drinks', 'bubble tea', ARRAY['gong cha', 'taiwan', 'premium'], '1 large', '1 large', 500, 360, 64, 52, 0, 63, 'medium', 85, 175, 10, 6, 0, 22, 4, 100, 'limit', 'safe', 'caution', 'safe', 'ai_estimated', false);

