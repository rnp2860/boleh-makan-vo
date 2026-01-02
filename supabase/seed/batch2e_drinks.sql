-- 🇲🇾 Malaysian Food Database - Batch 2E: Drinks Expanded (40 foods)
-- All values per standard Malaysian serving

-- ============================================
-- COFFEE VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Kopi Cham (Coffee Tea Mix)', 'Kopi Cham', ARRAY['cham', 'yuan yang', 'coffee tea'], 'drinks', 'coffee', ARRAY['mamak', 'kopitiam', 'unique'], '1 cawan', '1 cup', 250, 140, 20, 18, 0, 60, 'medium', 55, 180, 5, 3, 0, 12, 3, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kopi Halia (Ginger Coffee)', 'Kopi Halia', ARRAY['ginger coffee', 'kopi dengan halia'], 'drinks', 'coffee', ARRAY['mamak', 'warming', 'traditional'], '1 cawan', '1 cup', 200, 110, 16, 14, 0, 58, 'medium', 45, 200, 4, 2.5, 0, 10, 2, 65, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kopi Ais (Iced Coffee)', 'Kopi Ais', ARRAY['iced coffee', 'ice coffee'], 'drinks', 'coffee', ARRAY['mamak', 'kopitiam', 'popular'], '1 gelas', '1 glass', 300, 130, 18, 16, 0, 60, 'medium', 50, 200, 5, 3, 0, 12, 3, 75, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('White Coffee Ipoh', 'Kopi Putih Ipoh', ARRAY['ipoh white coffee', 'old town coffee'], 'drinks', 'coffee', ARRAY['ipoh', 'famous', 'kopitiam'], '1 cawan', '1 cup', 200, 120, 16, 14, 0, 58, 'medium', 40, 180, 5, 3, 0, 10, 3, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Espresso', 'Espreso', ARRAY['espresso', 'shot'], 'drinks', 'coffee', ARRAY['western', 'cafe', 'strong'], '1 shot', '1 shot', 30, 5, 0, 0, 0, 0, 'low', 5, 60, 0, 0, 0, 0, 0, 5, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Americano', 'Americano', ARRAY['americano', 'black coffee'], 'drinks', 'coffee', ARRAY['western', 'cafe', 'black'], '1 cawan', '1 cup', 240, 10, 0, 0, 0, 0, 'low', 10, 120, 0, 0, 0, 0, 0.5, 10, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Latte', 'Latte', ARRAY['caffe latte', 'milk coffee'], 'drinks', 'coffee', ARRAY['western', 'cafe', 'creamy'], '1 cawan', '1 cup', 300, 150, 15, 12, 0, 35, 'low', 120, 280, 6, 4, 0, 20, 8, 150, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Cappuccino', 'Cappuccino', ARRAY['cappuccino', 'cap'], 'drinks', 'coffee', ARRAY['western', 'cafe', 'frothy'], '1 cawan', '1 cup', 250, 120, 12, 10, 0, 35, 'low', 100, 250, 5, 3, 0, 18, 7, 130, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Mocha', 'Mocha', ARRAY['cafe mocha', 'chocolate coffee'], 'drinks', 'coffee', ARRAY['western', 'cafe', 'sweet'], '1 cawan', '1 cup', 300, 220, 32, 28, 1, 50, 'low', 140, 320, 8, 5, 0, 22, 8, 170, 'caution', 'safe', 'caution', 'caution', 'ai_estimated', false),

('Kopi Tongkat Ali', 'Kopi Tongkat Ali', ARRAY['tongkat ali coffee', 'power coffee'], 'drinks', 'coffee', ARRAY['traditional', 'herbal', 'energy'], '1 sachet', '1 sachet', 25, 90, 18, 15, 0, 55, 'low', 80, 100, 2, 1, 0, 0, 1, 40, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- TEA VARIATIONS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Teh Halia (Ginger Tea)', 'Teh Halia', ARRAY['ginger tea', 'tea with ginger'], 'drinks', 'tea', ARRAY['mamak', 'warming', 'traditional'], '1 cawan', '1 cup', 250, 100, 16, 14, 0, 58, 'medium', 40, 150, 3, 2, 0, 8, 2, 60, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh Masala (Masala Tea)', 'Teh Masala', ARRAY['masala chai', 'spiced tea'], 'drinks', 'tea', ARRAY['indian', 'spiced', 'warming'], '1 cawan', '1 cup', 250, 120, 18, 16, 0, 58, 'medium', 50, 180, 4, 2.5, 0, 10, 3, 70, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh Ais (Iced Milk Tea)', 'Teh Ais', ARRAY['iced tea', 'ice milk tea'], 'drinks', 'tea', ARRAY['mamak', 'popular', 'refreshing'], '1 gelas', '1 glass', 350, 150, 24, 22, 0, 62, 'medium', 55, 180, 4, 2.5, 0, 12, 3, 85, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh C (Tea with Evaporated Milk)', 'Teh C', ARRAY['teh c', 'evaporated milk tea'], 'drinks', 'tea', ARRAY['kopitiam', 'traditional'], '1 cawan', '1 cup', 250, 100, 14, 12, 0, 55, 'low', 60, 180, 4, 2, 0, 12, 3, 80, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh C Peng (Iced Teh C)', 'Teh C Peng', ARRAY['iced teh c', 'cold evaporated milk tea'], 'drinks', 'tea', ARRAY['kopitiam', 'refreshing'], '1 gelas', '1 glass', 350, 130, 18, 16, 0, 55, 'low', 70, 200, 5, 2.5, 0, 15, 4, 90, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Teh Cino (Frothy Tea)', 'Teh Cino', ARRAY['tea cino', 'frothy milk tea'], 'drinks', 'tea', ARRAY['mamak', 'creamy', 'modern'], '1 cawan', '1 cup', 250, 140, 20, 18, 0, 60, 'medium', 50, 180, 5, 3, 0, 12, 3, 80, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Green Tea (Unsweetened)', 'Teh Hijau', ARRAY['green tea', 'ocha'], 'drinks', 'tea', ARRAY['healthy', 'japanese', 'antioxidant'], '1 cawan', '1 cup', 250, 5, 0, 0, 0, 0, 'low', 5, 85, 0, 0, 0, 0, 0, 10, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Oolong Tea', 'Teh Oolong', ARRAY['oolong', 'chinese tea'], 'drinks', 'tea', ARRAY['chinese', 'traditional', 'healthy'], '1 cawan', '1 cup', 250, 5, 0, 0, 0, 0, 'low', 5, 90, 0, 0, 0, 0, 0, 10, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- FRESH JUICES
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Watermelon Juice', 'Jus Tembikai', ARRAY['watermelon juice', 'tembikai'], 'drinks', 'juice', ARRAY['fresh', 'healthy', 'refreshing'], '1 gelas', '1 glass', 300, 90, 22, 18, 1, 72, 'high', 5, 280, 0.5, 0, 0, 0, 2, 30, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Orange Juice (Fresh)', 'Jus Oren', ARRAY['orange juice', 'oren'], 'drinks', 'juice', ARRAY['fresh', 'vitamin c', 'popular'], '1 gelas', '1 glass', 250, 110, 26, 22, 0, 50, 'low', 5, 450, 0.5, 0, 0, 0, 2, 40, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Apple Juice (Fresh)', 'Jus Epal', ARRAY['apple juice', 'epal'], 'drinks', 'juice', ARRAY['fresh', 'popular'], '1 gelas', '1 glass', 250, 115, 28, 24, 0, 44, 'low', 10, 250, 0.3, 0, 0, 0, 0.5, 20, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Carrot Juice', 'Jus Lobak Merah', ARRAY['carrot juice', 'carrot'], 'drinks', 'juice', ARRAY['fresh', 'healthy', 'vitamin a'], '1 gelas', '1 glass', 250, 95, 22, 10, 2, 45, 'low', 70, 690, 0.4, 0, 0, 0, 2, 50, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Mango Juice', 'Jus Mangga', ARRAY['mango juice', 'mangga'], 'drinks', 'juice', ARRAY['fresh', 'tropical', 'popular'], '1 gelas', '1 glass', 250, 130, 32, 28, 2, 55, 'low', 5, 280, 0.5, 0, 0, 0, 1, 25, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Papaya Juice', 'Jus Betik', ARRAY['papaya juice', 'betik'], 'drinks', 'juice', ARRAY['fresh', 'tropical', 'digestive'], '1 gelas', '1 glass', 250, 85, 20, 16, 2, 55, 'low', 10, 380, 0.4, 0, 0, 0, 1, 20, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Mixed Juice', 'Jus Campuran', ARRAY['mixed fruit juice', 'rojak juice'], 'drinks', 'juice', ARRAY['fresh', 'popular', 'variety'], '1 gelas', '1 glass', 300, 120, 28, 24, 2, 52, 'low', 15, 350, 0.5, 0, 0, 0, 2, 35, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Tomato Juice', 'Jus Tomato', ARRAY['tomato juice', 'tomato'], 'drinks', 'juice', ARRAY['fresh', 'healthy', 'savory'], '1 gelas', '1 glass', 250, 40, 9, 6, 1, 35, 'low', 480, 530, 0.2, 0, 0, 0, 2, 45, 'safe', 'caution', 'safe', 'caution', 'ai_estimated', false);

-- ============================================
-- SMOOTHIES & BLENDED
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Mango Smoothie', 'Smoothie Mangga', ARRAY['mango shake', 'mango blend'], 'drinks', 'smoothie', ARRAY['cafe', 'refreshing', 'creamy'], '1 gelas', '1 glass', 350, 220, 45, 38, 3, 52, 'low', 80, 380, 5, 3, 0, 15, 5, 100, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Banana Smoothie', 'Smoothie Pisang', ARRAY['banana shake', 'banana blend'], 'drinks', 'smoothie', ARRAY['cafe', 'energy', 'creamy'], '1 gelas', '1 glass', 350, 250, 48, 35, 4, 48, 'low', 100, 580, 6, 3, 0, 18, 7, 150, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Avocado Smoothie (Local Style)', 'Smoothie Avokado', ARRAY['avocado shake', 'avocado chocolate'], 'drinks', 'smoothie', ARRAY['local', 'creamy', 'indulgent'], '1 gelas', '1 glass', 350, 320, 42, 32, 5, 35, 'low', 90, 680, 16, 4, 0, 20, 5, 100, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false),

('Mixed Berry Smoothie', 'Smoothie Beri Campuran', ARRAY['berry shake', 'berry blend'], 'drinks', 'smoothie', ARRAY['cafe', 'antioxidant', 'healthy'], '1 gelas', '1 glass', 350, 180, 38, 28, 5, 40, 'low', 70, 320, 3, 1, 0, 10, 4, 80, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false);

-- ============================================
-- PACKAGED DRINKS
-- ============================================

INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified) VALUES
('Milo Kotak (Packet Milo)', 'Milo Kotak', ARRAY['packet milo', 'milo tetra pak'], 'drinks', 'chocolate', ARRAY['convenient', 'popular', 'kids'], '1 kotak', '1 packet', 200, 160, 26, 22, 1, 55, 'low', 80, 220, 4, 2.5, 0, 5, 4, 100, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Nescafe Can', 'Nescafe Tin', ARRAY['canned coffee', 'nescafe can'], 'drinks', 'coffee', ARRAY['convenient', 'popular'], '1 tin', '1 can', 240, 90, 16, 14, 0, 55, 'low', 80, 120, 2, 1, 0, 5, 2, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('100 Plus (Isotonic)', '100 Plus', ARRAY['100 plus', 'isotonic drink'], 'drinks', 'isotonic', ARRAY['sports', 'hydration', 'popular'], '1 tin', '1 can', 325, 75, 18, 16, 0, 60, 'medium', 130, 35, 0, 0, 0, 0, 0, 5, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Coca Cola', 'Coca Cola', ARRAY['coke', 'cola'], 'drinks', 'soda', ARRAY['popular', 'sweet'], '1 tin', '1 can', 330, 140, 39, 39, 0, 63, 'medium', 45, 10, 0, 0, 0, 0, 0, 40, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Sprite', 'Sprite', ARRAY['sprite', 'lemon lime soda'], 'drinks', 'soda', ARRAY['popular', 'sweet'], '1 tin', '1 can', 330, 130, 33, 33, 0, 63, 'medium', 65, 5, 0, 0, 0, 0, 0, 5, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('F&N Orange', 'F&N Oren', ARRAY['f&n orange', 'orange soda'], 'drinks', 'soda', ARRAY['popular', 'sweet', 'local'], '1 tin', '1 can', 325, 150, 38, 38, 0, 65, 'medium', 50, 20, 0, 0, 0, 0, 0, 10, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Kickapoo', 'Kickapoo', ARRAY['kickapoo', 'lemon soda'], 'drinks', 'soda', ARRAY['popular', 'sweet', 'local'], '1 tin', '1 can', 325, 140, 35, 35, 0, 63, 'medium', 40, 15, 0, 0, 0, 0, 0, 8, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Chrysanthemum Tea (Packet)', 'Teh Kekwa Kotak', ARRAY['chrysanthemum tea', 'yeo''s chrysanthemum'], 'drinks', 'tea', ARRAY['convenient', 'cooling', 'traditional'], '1 kotak', '1 packet', 250, 80, 20, 18, 0, 55, 'low', 20, 50, 0, 0, 0, 0, 0, 10, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Yeo''s Soya (Packet)', 'Soya Yeo''s', ARRAY['soya packet', 'yeo''s soya'], 'drinks', 'milk', ARRAY['convenient', 'healthy', 'popular'], '1 kotak', '1 packet', 250, 110, 14, 10, 0, 35, 'low', 90, 250, 4, 0.5, 0, 0, 6, 100, 'safe', 'safe', 'safe', 'safe', 'ai_estimated', false),

('Dutch Lady Milk (Packet)', 'Susu Dutch Lady', ARRAY['dutch lady', 'packet milk'], 'drinks', 'milk', ARRAY['convenient', 'calcium', 'kids'], '1 kotak', '1 packet', 200, 130, 14, 12, 0, 30, 'low', 100, 280, 5, 3, 0, 18, 6, 180, 'safe', 'safe', 'safe', 'caution', 'ai_estimated', false);

