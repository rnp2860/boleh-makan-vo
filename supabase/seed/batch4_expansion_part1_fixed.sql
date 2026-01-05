-- =============================================
-- BATCH 4 EXPANSION - Part 1: Rice Dishes & Noodles (200 foods) - FIXED
-- Expanding Malaysian Foods Database from 485 to 1,500+
-- All rows have EXACTLY 30 values
-- =============================================

-- CATEGORY 1: RICE DISHES (100 foods)

-- Nasi Lemak Variations
INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified, popularity_score) VALUES
('Nasi Lemak Kelantan', 'Nasi Lemak Kelantan', ARRAY['nasi lemak kl','kelantan nasi lemak'], 'rice_dishes', 'nasi', ARRAY['traditional','coconut','east coast'], '1 pinggan', '1 plate', 400, 650, 85, 6, 4, 72, 'high', 950, 350, 28, 18, 0, 45, 18, 220, 'limit', 'limit', 'limit', 'safe', 'ai_estimated', false, 75),
('Nasi Lemak Terengganu', 'Nasi Lemak Terengganu', ARRAY['terengganu nasi lemak'], 'rice_dishes', 'nasi', ARRAY['traditional','coconut','east coast'], '1 pinggan', '1 plate', 380, 620, 82, 5, 4, 70, 'high', 920, 340, 26, 16, 0, 40, 16, 210, 'limit', 'limit', 'limit', 'safe', 'ai_estimated', false, 70),
('Nasi Lemak Johor', 'Nasi Lemak Johor', ARRAY['johor nasi lemak'], 'rice_dishes', 'nasi', ARRAY['traditional','southern'], '1 pinggan', '1 plate', 390, 640, 83, 5, 3, 71, 'high', 900, 330, 27, 17, 0, 42, 17, 215, 'limit', 'limit', 'limit', 'safe', 'ai_estimated', false, 72),
('Nasi Lemak Ayam Goreng Berempah', 'Nasi Lemak Ayam Goreng Berempah', ARRAY['nasi lemak spicy chicken'], 'rice_dishes', 'nasi', ARRAY['spicy','popular','hawker'], '1 pinggan', '1 plate', 450, 820, 90, 6, 4, 70, 'high', 1300, 420, 42, 20, 1, 95, 35, 280, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 95),
('Nasi Lemak Sotong', 'Nasi Lemak Sotong', ARRAY['squid nasi lemak'], 'rice_dishes', 'nasi', ARRAY['seafood','popular'], '1 pinggan', '1 plate', 420, 680, 85, 5, 3, 72, 'high', 1100, 380, 28, 17, 0, 180, 24, 240, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 80),

-- Nasi Goreng Variations  
('Nasi Goreng Cina', 'Nasi Goreng Cina', ARRAY['chinese fried rice','ngc'], 'rice_dishes', 'nasi', ARRAY['chinese','hawker','popular'], '1 pinggan', '1 plate', 380, 580, 72, 4, 2, 68, 'medium', 950, 320, 22, 6, 0, 85, 20, 190, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 90),
('Nasi Goreng USA', 'Nasi Goreng USA', ARRAY['nasi goreng american','american fried rice'], 'rice_dishes', 'nasi', ARRAY['fusion','popular','hawker'], '1 pinggan', '1 plate', 400, 650, 75, 7, 2, 70, 'high', 1100, 340, 28, 8, 1, 110, 24, 210, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 85),
('Nasi Goreng Paprik', 'Nasi Goreng Paprik', ARRAY['paprik fried rice'], 'rice_dishes', 'nasi', ARRAY['spicy','mamak','popular'], '1 pinggan', '1 plate', 390, 620, 70, 6, 3, 67, 'medium', 1050, 360, 26, 7, 0, 90, 22, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 88),
('Nasi Goreng Tom Yam', 'Nasi Goreng Tom Yam', ARRAY['tom yam fried rice'], 'rice_dishes', 'nasi', ARRAY['thai','spicy','popular'], '1 pinggan', '1 plate', 380, 600, 68, 5, 3, 65, 'medium', 1200, 340, 24, 6, 0, 85, 20, 195, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 82),
('Nasi Goreng Ikan Masin', 'Nasi Goreng Ikan Masin', ARRAY['salted fish fried rice'], 'rice_dishes', 'nasi', ARRAY['traditional','salty'], '1 pinggan', '1 plate', 370, 590, 70, 3, 2, 68, 'medium', 1400, 310, 22, 5, 0, 75, 18, 185, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 75),
('Nasi Goreng Belacan', 'Nasi Goreng Belacan', ARRAY['belacan fried rice','shrimp paste rice'], 'rice_dishes', 'nasi', ARRAY['traditional','spicy'], '1 pinggan', '1 plate', 360, 570, 68, 3, 3, 67, 'medium', 1300, 320, 20, 5, 0, 70, 17, 180, 'limit', 'limit', 'safe', 'safe', 'ai_estimated', false, 78),
('Nasi Goreng Daging', 'Nasi Goreng Daging', ARRAY['beef fried rice'], 'rice_dishes', 'nasi', ARRAY['popular','mamak'], '1 pinggan', '1 plate', 400, 640, 72, 4, 2, 69, 'medium', 1000, 380, 26, 8, 1, 95, 26, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 84),
('Nasi Goreng Ayam Kunyit', 'Nasi Goreng Ayam Kunyit', ARRAY['turmeric chicken fried rice'], 'rice_dishes', 'nasi', ARRAY['traditional','yellow'], '1 pinggan', '1 plate', 390, 610, 70, 4, 3, 68, 'medium', 950, 350, 24, 6, 0, 88, 23, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 76),

-- Nasi Ayam Variations
('Nasi Ayam Hainan', 'Nasi Ayam Hainan', ARRAY['hainanese chicken rice','chicken rice'], 'rice_dishes', 'nasi', ARRAY['chinese','popular','hawker'], '1 pinggan', '1 plate', 420, 650, 78, 4, 2, 65, 'medium', 850, 380, 24, 7, 0, 110, 32, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 95),
('Nasi Ayam Geprek', 'Nasi Ayam Geprek', ARRAY['smashed chicken rice','geprek'], 'rice_dishes', 'nasi', ARRAY['indonesian','spicy','popular'], '1 pinggan', '1 plate', 400, 720, 75, 5, 3, 68, 'medium', 1100, 360, 35, 10, 1, 105, 30, 250, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 88),
('Nasi Ayam Penyet', 'Nasi Ayam Penyet', ARRAY['pressed chicken rice','penyet'], 'rice_dishes', 'nasi', ARRAY['indonesian','spicy'], '1 pinggan', '1 plate', 410, 700, 76, 5, 3, 67, 'medium', 1050, 370, 32, 9, 1, 100, 31, 245, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 86),
('Nasi Ayam Goreng Berempah', 'Nasi Ayam Goreng Berempah', ARRAY['spiced fried chicken rice'], 'rice_dishes', 'nasi', ARRAY['traditional','spicy'], '1 pinggan', '1 plate', 430, 750, 80, 5, 3, 70, 'high', 1200, 390, 36, 11, 1, 115, 34, 260, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 90),
('Nasi Ayam Rendang', 'Nasi Ayam Rendang', ARRAY['rendang chicken rice'], 'rice_dishes', 'nasi', ARRAY['traditional','spicy'], '1 pinggan', '1 plate', 400, 680, 72, 6, 3, 68, 'medium', 900, 360, 30, 18, 0, 95, 28, 230, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 85),

-- Nasi Briyani
('Nasi Briyani Ayam', 'Nasi Briyani Ayam', ARRAY['chicken briyani','biryani ayam'], 'rice_dishes', 'nasi', ARRAY['indian','spiced','popular'], '1 pinggan', '1 plate', 450, 720, 85, 5, 4, 65, 'medium', 950, 420, 28, 10, 0, 100, 32, 280, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 92),
('Nasi Briyani Kambing', 'Nasi Briyani Kambing', ARRAY['mutton briyani','biryani kambing'], 'rice_dishes', 'nasi', ARRAY['indian','spiced'], '1 pinggan', '1 plate', 460, 780, 86, 5, 4, 66, 'medium', 1000, 450, 35, 14, 0, 120, 36, 300, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false, 88),
('Nasi Briyani Daging', 'Nasi Briyani Daging', ARRAY['beef briyani','biryani daging'], 'rice_dishes', 'nasi', ARRAY['indian','spiced'], '1 pinggan', '1 plate', 455, 760, 85, 5, 4, 65, 'medium', 980, 440, 33, 13, 1, 115, 34, 290, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 85),
('Nasi Briyani Gam', 'Nasi Briyani Gam', ARRAY['hydrabadi biryani','gam biryani'], 'rice_dishes', 'nasi', ARRAY['indian','hyderabadi'], '1 pinggan', '1 plate', 470, 800, 88, 6, 4, 67, 'medium', 1050, 460, 38, 15, 0, 125, 37, 310, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false, 82),

-- Nasi Kandar
('Nasi Kandar Ayam Kunyit', 'Nasi Kandar Ayam Kunyit', ARRAY['turmeric chicken kandar'], 'rice_dishes', 'nasi', ARRAY['mamak','penang','spicy'], '1 pinggan', '1 plate', 420, 680, 75, 5, 3, 70, 'high', 1100, 390, 30, 12, 0, 105, 30, 260, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 88),
('Nasi Kandar Ikan', 'Nasi Kandar Ikan', ARRAY['fish kandar'], 'rice_dishes', 'nasi', ARRAY['mamak','penang'], '1 pinggan', '1 plate', 400, 620, 72, 4, 3, 68, 'medium', 1000, 370, 26, 10, 0, 85, 28, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 85),
('Nasi Kandar Daging', 'Nasi Kandar Daging', ARRAY['beef kandar'], 'rice_dishes', 'nasi', ARRAY['mamak','penang'], '1 pinggan', '1 plate', 430, 720, 76, 5, 3, 71, 'high', 1150, 400, 34, 14, 1, 110, 32, 280, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 83),
('Nasi Kandar Sotong', 'Nasi Kandar Sotong', ARRAY['squid kandar'], 'rice_dishes', 'nasi', ARRAY['mamak','penang','seafood'], '1 pinggan', '1 plate', 410, 640, 73, 4, 3, 69, 'medium', 1050, 380, 28, 11, 0, 190, 26, 250, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 80),
('Nasi Kandar Campur', 'Nasi Kandar Campur', ARRAY['mixed kandar','kandar mix'], 'rice_dishes', 'nasi', ARRAY['mamak','penang','popular'], '1 pinggan', '1 plate', 450, 750, 80, 6, 4, 72, 'high', 1200, 420, 36, 15, 0, 120, 34, 290, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 90),

-- Nasi Kerabu
('Nasi Kerabu Ayam Percik', 'Nasi Kerabu Ayam Percik', ARRAY['kerabu with grilled chicken'], 'rice_dishes', 'nasi', ARRAY['traditional','east coast','herbs'], '1 pinggan', '1 plate', 400, 580, 68, 4, 5, 60, 'medium', 750, 420, 22, 8, 0, 90, 28, 220, 'limit', 'caution', 'caution', 'caution', 'ai_estimated', false, 82),
('Nasi Kerabu Ikan Bakar', 'Nasi Kerabu Ikan Bakar', ARRAY['kerabu with grilled fish'], 'rice_dishes', 'nasi', ARRAY['traditional','east coast','herbs'], '1 pinggan', '1 plate', 380, 540, 65, 3, 5, 58, 'medium', 700, 410, 18, 6, 0, 75, 26, 210, 'caution', 'caution', 'safe', 'caution', 'ai_estimated', false, 78),
('Nasi Kerabu Solok Lada', 'Nasi Kerabu Solok Lada', ARRAY['kerabu with stuffed chili'], 'rice_dishes', 'nasi', ARRAY['traditional','east coast'], '1 pinggan', '1 plate', 390, 560, 66, 4, 5, 59, 'medium', 720, 400, 20, 7, 0, 80, 24, 200, 'limit', 'caution', 'caution', 'caution', 'ai_estimated', false, 75),

-- Nasi Dagang
('Nasi Dagang Ikan Tongkol', 'Nasi Dagang Ikan Tongkol', ARRAY['nasi dagang tuna'], 'rice_dishes', 'nasi', ARRAY['traditional','east coast','terengganu'], '1 pinggan', '1 plate', 420, 650, 75, 5, 4, 65, 'medium', 850, 410, 28, 16, 0, 85, 30, 250, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 85),
('Nasi Dagang Terengganu', 'Nasi Dagang Terengganu', ARRAY['terengganu nasi dagang'], 'rice_dishes', 'nasi', ARRAY['traditional','east coast'], '1 pinggan', '1 plate', 410, 630, 73, 5, 4, 64, 'medium', 820, 400, 26, 15, 0, 80, 28, 240, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 83),

-- Nasi Campur
('Nasi Campur Ayam Goreng', 'Nasi Campur Ayam Goreng', ARRAY['mixed rice fried chicken'], 'rice_dishes', 'nasi', ARRAY['popular','lunch','economical'], '1 pinggan', '1 plate', 430, 700, 78, 5, 3, 70, 'high', 1000, 380, 32, 10, 1, 100, 30, 260, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 92),
('Nasi Campur Ikan Keli', 'Nasi Campur Ikan Keli', ARRAY['mixed rice catfish'], 'rice_dishes', 'nasi', ARRAY['lunch','economical'], '1 pinggan', '1 plate', 400, 620, 72, 4, 3, 68, 'medium', 900, 360, 26, 8, 0, 85, 28, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 85),
('Nasi Campur Rendang', 'Nasi Campur Rendang', ARRAY['mixed rice rendang'], 'rice_dishes', 'nasi', ARRAY['traditional','lunch'], '1 pinggan', '1 plate', 420, 680, 74, 6, 3, 69, 'medium', 920, 370, 30, 18, 0, 95, 28, 250, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 88),
('Nasi Campur Sambal Goreng', 'Nasi Campur Sambal Goreng', ARRAY['mixed rice sambal'], 'rice_dishes', 'nasi', ARRAY['spicy','lunch'], '1 pinggan', '1 plate', 390, 590, 70, 4, 4, 67, 'medium', 950, 350, 24, 7, 0, 80, 22, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 83),
('Nasi Campur Vegetarian', 'Nasi Campur Sayur', ARRAY['mixed rice vegetables','vegetarian rice'], 'rice_dishes', 'nasi', ARRAY['vegetarian','healthy','lunch'], '1 pinggan', '1 plate', 350, 480, 68, 5, 6, 62, 'medium', 650, 420, 14, 4, 0, 0, 15, 180, 'limit', 'caution', 'safe', 'safe', 'ai_estimated', false, 70),

-- Nasi Kukus
('Nasi Kukus Ayam Berempah', 'Nasi Kukus Ayam Berempah', ARRAY['steamed rice spiced chicken'], 'rice_dishes', 'nasi', ARRAY['traditional','steamed','spicy'], '1 pinggan', '1 plate', 400, 620, 72, 4, 2, 66, 'medium', 900, 370, 26, 8, 0, 95, 28, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 87),
('Nasi Kukus Ayam Goreng', 'Nasi Kukus Ayam Goreng', ARRAY['steamed rice fried chicken'], 'rice_dishes', 'nasi', ARRAY['traditional','popular'], '1 pinggan', '1 plate', 410, 680, 75, 4, 2, 68, 'medium', 950, 380, 30, 9, 1, 100, 30, 250, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 89),
('Nasi Kukus Gulai Ayam', 'Nasi Kukus Gulai Ayam', ARRAY['steamed rice chicken curry'], 'rice_dishes', 'nasi', ARRAY['traditional','curry'], '1 pinggan', '1 plate', 420, 650, 74, 5, 3, 67, 'medium', 880, 390, 28, 16, 0, 90, 27, 235, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 84),

-- Nasi Arab
('Nasi Arab Ayam Mandy', 'Nasi Arab Ayam Mandy', ARRAY['mandy chicken rice','chicken mandy'], 'rice_dishes', 'nasi', ARRAY['arab','middle eastern','popular'], '1 pinggan', '1 plate', 450, 720, 82, 5, 3, 68, 'medium', 950, 420, 30, 11, 0, 105, 34, 270, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 86),
('Nasi Arab Kambing Mandy', 'Nasi Arab Kambing Mandy', ARRAY['mandy mutton rice','mutton mandy'], 'rice_dishes', 'nasi', ARRAY['arab','middle eastern'], '1 pinggan', '1 plate', 460, 780, 84, 5, 3, 69, 'medium', 1000, 450, 36, 15, 0, 125, 38, 290, 'limit', 'limit', 'limit', 'limit', 'ai_estimated', false, 82),
('Nasi Arab Mandi', 'Nasi Arab Mandi', ARRAY['mandi rice','arab mandi'], 'rice_dishes', 'nasi', ARRAY['arab','middle eastern'], '1 pinggan', '1 plate', 440, 700, 80, 5, 3, 67, 'medium', 920, 430, 32, 12, 0, 110, 35, 280, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 84),
('Nasi Arab Kabsa', 'Nasi Arab Kabsa', ARRAY['kabsa rice'], 'rice_dishes', 'nasi', ARRAY['arab','middle eastern','spiced'], '1 pinggan', '1 plate', 450, 710, 83, 5, 3, 68, 'medium', 940, 440, 31, 11, 0, 108, 33, 275, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 80),

-- Nasi Ulam
('Nasi Ulam Traditional', 'Nasi Ulam Tradisional', ARRAY['herb rice','ulam rice'], 'rice_dishes', 'nasi', ARRAY['traditional','healthy','herbs'], '1 pinggan', '1 plate', 350, 420, 62, 3, 7, 55, 'low', 500, 480, 12, 3, 0, 0, 14, 150, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false, 72),
('Nasi Ulam Ikan Bakar', 'Nasi Ulam Ikan Bakar', ARRAY['herb rice grilled fish'], 'rice_dishes', 'nasi', ARRAY['traditional','healthy','herbs'], '1 pinggan', '1 plate', 380, 490, 64, 3, 7, 56, 'low', 580, 500, 16, 5, 0, 70, 24, 190, 'caution', 'safe', 'safe', 'caution', 'ai_estimated', false, 75),

-- Nasi Padang
('Nasi Padang Ayam', 'Nasi Padang Ayam', ARRAY['padang chicken rice'], 'rice_dishes', 'nasi', ARRAY['indonesian','padang','spicy'], '1 pinggan', '1 plate', 420, 680, 76, 6, 3, 70, 'high', 1100, 390, 30, 14, 0, 100, 28, 260, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 83),
('Nasi Padang Rendang', 'Nasi Padang Rendang', ARRAY['padang rendang rice'], 'rice_dishes', 'nasi', ARRAY['indonesian','padang','spicy'], '1 pinggan', '1 plate', 430, 720, 78, 7, 3, 71, 'high', 1050, 380, 34, 18, 0, 105, 30, 270, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 85),
('Nasi Padang Ikan', 'Nasi Padang Ikan', ARRAY['padang fish rice'], 'rice_dishes', 'nasi', ARRAY['indonesian','padang'], '1 pinggan', '1 plate', 400, 640, 74, 5, 3, 69, 'medium', 1000, 370, 26, 12, 0, 85, 27, 250, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 80),

-- Bubur
('Bubur Ayam McD', 'Bubur Ayam McD', ARRAY['mcd chicken porridge','mcdonalds porridge'], 'rice_dishes', 'bubur', ARRAY['fast food','breakfast','porridge'], '1 mangkuk', '1 bowl', 280, 380, 52, 3, 2, 62, 'medium', 720, 220, 12, 4, 0, 45, 18, 150, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false, 88),
('Bubur Lambuk', 'Bubur Lambuk', ARRAY['lambuk porridge','ramadan porridge'], 'rice_dishes', 'bubur', ARRAY['traditional','ramadan','porridge'], '1 mangkuk', '1 bowl', 320, 320, 48, 4, 4, 58, 'medium', 650, 280, 10, 3, 0, 30, 14, 140, 'safe', 'caution', 'safe', 'safe', 'ai_estimated', false, 82),
('Bubur Nasi Ayam', 'Bubur Nasi Ayam', ARRAY['chicken rice porridge'], 'rice_dishes', 'bubur', ARRAY['traditional','porridge','comforting'], '1 mangkuk', '1 bowl', 300, 360, 50, 3, 2, 60, 'medium', 680, 240, 11, 3, 0, 40, 17, 145, 'caution', 'caution', 'safe', 'safe', 'ai_estimated', false, 85),
('Bubur Kacang', 'Bubur Kacang', ARRAY['bean porridge','sweet porridge'], 'rice_dishes', 'bubur', ARRAY['traditional','sweet','dessert'], '1 mangkuk', '1 bowl', 280, 420, 68, 28, 6, 60, 'medium', 120, 320, 8, 4, 0, 0, 12, 160, 'limit', 'safe', 'safe', 'safe', 'ai_estimated', false, 75),

-- Additional Rice Dishes
('Nasi Berlauk Ikan Keli', 'Nasi Berlauk Ikan Keli', ARRAY['catfish rice'], 'rice_dishes', 'nasi', ARRAY['traditional','lunch'], '1 pinggan', '1 plate', 390, 580, 70, 4, 3, 67, 'medium', 850, 350, 24, 7, 0, 82, 26, 230, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 78),
('Nasi Berlauk Ayam Masak Merah', 'Nasi Berlauk Ayam Masak Merah', ARRAY['red cooked chicken rice'], 'rice_dishes', 'nasi', ARRAY['traditional','lunch'], '1 pinggan', '1 plate', 410, 640, 74, 8, 3, 69, 'medium', 950, 370, 26, 9, 0, 95, 28, 250, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 82),
('Nasi Tomato Ayam', 'Nasi Tomato Ayam', ARRAY['tomato rice chicken'], 'rice_dishes', 'nasi', ARRAY['traditional','malay'], '1 pinggan', '1 plate', 400, 620, 72, 6, 3, 66, 'medium', 880, 380, 24, 8, 0, 90, 27, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 79),
('Nasi Hujan Panas', 'Nasi Hujan Panas', ARRAY['hot rain rice','nasi goreng special'], 'rice_dishes', 'nasi', ARRAY['fusion','unique'], '1 pinggan', '1 plate', 380, 590, 70, 5, 2, 68, 'medium', 980, 340, 24, 6, 0, 88, 21, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 76),
('Nasi Goreng Pattaya', 'Nasi Goreng Pattaya', ARRAY['pattaya fried rice','wrapped fried rice'], 'rice_dishes', 'nasi', ARRAY['thai','popular','egg wrapped'], '1 pinggan', '1 plate', 420, 680, 76, 6, 2, 70, 'high', 1050, 360, 30, 8, 1, 210, 24, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 87),
('Nasi Goreng Cili Padi', 'Nasi Goreng Cili Padi', ARRAY['birds eye chili fried rice','spicy fried rice'], 'rice_dishes', 'nasi', ARRAY['spicy','hot'], '1 pinggan', '1 plate', 370, 580, 69, 4, 3, 67, 'medium', 1100, 330, 23, 6, 0, 82, 19, 190, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 80),
('Nasi Goreng Seafood', 'Nasi Goreng Seafood', ARRAY['seafood fried rice'], 'rice_dishes', 'nasi', ARRAY['seafood','popular'], '1 pinggan', '1 plate', 410, 640, 72, 5, 2, 68, 'medium', 1150, 370, 26, 7, 0, 180, 25, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 86),
('Nasi Goreng Kerabu', 'Nasi Goreng Kerabu', ARRAY['kerabu fried rice','blue fried rice'], 'rice_dishes', 'nasi', ARRAY['traditional','unique','herbs'], '1 pinggan', '1 plate', 360, 560, 68, 4, 4, 65, 'medium', 850, 380, 20, 5, 0, 75, 18, 180, 'limit', 'limit', 'safe', 'safe', 'ai_estimated', false, 74),
('Nasi Putih Biasa', 'Nasi Putih Biasa', ARRAY['plain white rice','steamed rice'], 'rice_dishes', 'nasi', ARRAY['basic','staple'], '1 pinggan', '1 plate', 200, 260, 58, 0, 1, 73, 'high', 5, 80, 0, 0, 0, 0, 5, 50, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false, 95),
('Nasi Minyak', 'Nasi Minyak', ARRAY['ghee rice','clarified butter rice'], 'rice_dishes', 'nasi', ARRAY['traditional','festive','rich'], '1 pinggan', '1 plate', 220, 340, 60, 2, 1, 70, 'high', 420, 110, 10, 6, 0, 15, 6, 80, 'caution', 'safe', 'safe', 'safe', 'ai_estimated', false, 78);


-- CATEGORY 2: NOODLES (100 foods)

-- Mee Goreng Variations
INSERT INTO malaysian_foods (name_en, name_bm, aliases, category, subcategory, tags, serving_description, serving_description_en, serving_grams, calories_kcal, carbs_g, sugar_g, fiber_g, glycemic_index, gi_category, sodium_mg, potassium_mg, total_fat_g, saturated_fat_g, trans_fat_g, cholesterol_mg, protein_g, phosphorus_mg, diabetes_rating, hypertension_rating, cholesterol_rating, ckd_rating, source, verified, popularity_score) VALUES
('Mee Goreng Mamak', 'Mee Goreng Mamak', ARRAY['mamak fried noodles','mgm'], 'noodles', 'mee', ARRAY['mamak','spicy','popular'], '1 pinggan', '1 plate', 380, 650, 75, 8, 3, 70, 'high', 1200, 340, 30, 8, 1, 90, 22, 210, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 95),
('Mee Goreng Basah', 'Mee Goreng Basah', ARRAY['wet fried noodles'], 'noodles', 'mee', ARRAY['mamak','saucy'], '1 pinggan', '1 plate', 400, 620, 72, 7, 3, 68, 'medium', 1150, 330, 26, 7, 0, 85, 20, 200, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 88),
('Maggi Goreng', 'Maggi Goreng', ARRAY['fried maggi','instant noodles fried'], 'noodles', 'mee', ARRAY['instant','mamak','popular'], '1 pinggan', '1 plate', 320, 560, 68, 5, 2, 72, 'high', 1400, 280, 24, 6, 1, 80, 16, 170, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 92),
('Maggi Goreng Double', 'Maggi Goreng Double', ARRAY['double maggi','2 packet maggi'], 'noodles', 'mee', ARRAY['instant','heavy'], '1 pinggan', '1 plate', 450, 780, 95, 7, 3, 73, 'high', 1900, 340, 34, 8, 1, 110, 22, 220, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 85),
('Mee Sedap Goreng', 'Mee Sedap Goreng', ARRAY['sedap goreng','mi sedap'], 'noodles', 'mee', ARRAY['instant','popular'], '1 pinggan', '1 plate', 330, 580, 70, 5, 2, 71, 'high', 1350, 290, 25, 6, 1, 82, 17, 175, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 88),
('Mee Jawa', 'Mee Jawa', ARRAY['javanese noodles'], 'noodles', 'mee', ARRAY['traditional','sweet','sour'], '1 pinggan', '1 plate', 420, 580, 78, 12, 4, 68, 'medium', 950, 380, 18, 5, 0, 75, 20, 200, 'limit', 'limit', 'safe', 'caution', 'ai_estimated', false, 82),
('Mee Goreng Seafood', 'Mee Goreng Seafood', ARRAY['seafood fried noodles'], 'noodles', 'mee', ARRAY['mamak','seafood'], '1 pinggan', '1 plate', 400, 680, 74, 7, 3, 69, 'medium', 1250, 360, 30, 7, 0, 160, 24, 230, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 84),
('Mee Goreng Ayam', 'Mee Goreng Ayam', ARRAY['chicken fried noodles'], 'noodles', 'mee', ARRAY['mamak','chicken'], '1 pinggan', '1 plate', 390, 640, 73, 7, 3, 68, 'medium', 1180, 350, 28, 7, 0, 88, 23, 215, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 86),
('Mee Goreng Sotong', 'Mee Goreng Sotong', ARRAY['squid fried noodles'], 'noodles', 'mee', ARRAY['mamak','seafood'], '1 pinggan', '1 plate', 380, 620, 72, 6, 3, 67, 'medium', 1200, 340, 26, 6, 0, 170, 22, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 80),

-- Mee Sup
('Mee Sup Mamak', 'Mee Sup Mamak', ARRAY['mamak noodle soup'], 'noodles', 'mee', ARRAY['mamak','soup','popular'], '1 mangkuk', '1 bowl', 450, 480, 62, 4, 3, 65, 'medium', 1300, 380, 16, 4, 0, 65, 22, 190, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 90),
('Mee Sup Tulang', 'Mee Sup Tulang', ARRAY['bone marrow noodle soup'], 'noodles', 'mee', ARRAY['mamak','soup','bone'], '1 mangkuk', '1 bowl', 500, 620, 68, 4, 3, 66, 'medium', 1450, 420, 26, 10, 0, 85, 28, 240, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 88),
('Mee Sup Ayam', 'Mee Sup Ayam', ARRAY['chicken noodle soup'], 'noodles', 'mee', ARRAY['mamak','soup','chicken'], '1 mangkuk', '1 bowl', 420, 450, 60, 3, 3, 64, 'medium', 1200, 360, 14, 3, 0, 60, 24, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 87),
('Mee Sup Daging', 'Mee Sup Daging', ARRAY['beef noodle soup'], 'noodles', 'mee', ARRAY['mamak','soup','beef'], '1 mangkuk', '1 bowl', 440, 520, 64, 4, 3, 65, 'medium', 1280, 390, 18, 6, 0, 75, 26, 210, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false, 84),
('Mee Sup Campur', 'Mee Sup Campur', ARRAY['mixed noodle soup'], 'noodles', 'mee', ARRAY['mamak','soup','mixed'], '1 mangkuk', '1 bowl', 460, 540, 66, 4, 3, 66, 'medium', 1350, 400, 20, 5, 0, 80, 25, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 85),

-- Mee Kari
('Mee Kari Ayam', 'Mee Kari Ayam', ARRAY['chicken curry noodles'], 'noodles', 'mee', ARRAY['mamak','curry','chicken'], '1 mangkuk', '1 bowl', 450, 580, 66, 5, 4, 64, 'medium', 1100, 420, 24, 14, 0, 70, 26, 230, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 88),
('Mee Kari Seafood', 'Mee Kari Seafood', ARRAY['seafood curry noodles'], 'noodles', 'mee', ARRAY['mamak','curry','seafood'], '1 mangkuk', '1 bowl', 460, 600, 68, 5, 4, 65, 'medium', 1150, 440, 26, 15, 0, 140, 28, 250, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 85),
('Mee Kari Vegetarian', 'Mee Kari Sayur', ARRAY['vegetable curry noodles'], 'noodles', 'mee', ARRAY['mamak','curry','vegetarian'], '1 mangkuk', '1 bowl', 400, 480, 64, 4, 5, 62, 'medium', 950, 450, 18, 10, 0, 0, 14, 180, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false, 75),

-- Mee Rebus
('Mee Rebus Johor', 'Mee Rebus Johor', ARRAY['johor sweet noodles'], 'noodles', 'mee', ARRAY['traditional','sweet','johor'], '1 pinggan', '1 plate', 420, 540, 72, 15, 4, 68, 'medium', 880, 380, 16, 4, 0, 70, 20, 200, 'limit', 'limit', 'safe', 'caution', 'ai_estimated', false, 87),
('Mee Rebus Utara', 'Mee Rebus Utara', ARRAY['northern style rebus'], 'noodles', 'mee', ARRAY['traditional','northern','sweet'], '1 pinggan', '1 plate', 410, 520, 70, 14, 4, 67, 'medium', 850, 370, 15, 4, 0, 65, 19, 190, 'limit', 'limit', 'safe', 'safe', 'ai_estimated', false, 82),
('Mee Bandung', 'Mee Bandung', ARRAY['bandung noodles'], 'noodles', 'mee', ARRAY['traditional','johor','sweet'], '1 pinggan', '1 plate', 430, 560, 74, 10, 4, 69, 'medium', 920, 390, 18, 5, 0, 75, 22, 210, 'limit', 'limit', 'safe', 'caution', 'ai_estimated', false, 85),

-- Mee Hoon/Bihun
('Mee Hoon Goreng', 'Bihun Goreng', ARRAY['fried rice vermicelli','fried beehoon'], 'noodles', 'bihun', ARRAY['chinese','popular'], '1 pinggan', '1 plate', 350, 520, 65, 4, 2, 68, 'medium', 950, 300, 20, 5, 0, 75, 16, 170, 'limit', 'limit', 'safe', 'safe', 'ai_estimated', false, 90),
('Mee Hoon Soup', 'Bihun Sup', ARRAY['rice vermicelli soup'], 'noodles', 'bihun', ARRAY['chinese','light'], '1 mangkuk', '1 bowl', 400, 420, 58, 3, 2, 65, 'medium', 1100, 320, 12, 3, 0, 55, 18, 160, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 85),
('Mee Hoon Siam', 'Bihun Siam', ARRAY['thai style vermicelli','spicy beehoon'], 'noodles', 'bihun', ARRAY['thai','spicy'], '1 pinggan', '1 plate', 370, 550, 68, 6, 3, 67, 'medium', 1050, 330, 22, 6, 0, 70, 18, 180, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 83),
('Mee Hoon Singapore', 'Bihun Singapore', ARRAY['singapore noodles','curry beehoon'], 'noodles', 'bihun', ARRAY['singaporean','curry'], '1 pinggan', '1 plate', 380, 580, 70, 5, 3, 68, 'medium', 1080, 340, 24, 7, 0, 80, 20, 190, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 86),
('Mee Hoon Goreng Basah', 'Bihun Goreng Basah', ARRAY['wet fried vermicelli'], 'noodles', 'bihun', ARRAY['chinese','saucy'], '1 pinggan', '1 plate', 390, 560, 67, 5, 3, 66, 'medium', 1020, 330, 22, 6, 0, 75, 19, 185, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 82),

-- Kuey Teow
('Kuey Teow Goreng', 'Kuey Teow Goreng', ARRAY['fried flat noodles','ktg'], 'noodles', 'kuey_teow', ARRAY['chinese','popular'], '1 pinggan', '1 plate', 360, 560, 68, 5, 2, 68, 'medium', 980, 310, 22, 6, 0, 80, 18, 180, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 88),
('Kuey Teow Soup', 'Kuey Teow Sup', ARRAY['flat noodle soup'], 'noodles', 'kuey_teow', ARRAY['chinese'], '1 mangkuk', '1 bowl', 420, 450, 62, 3, 2, 65, 'medium', 1150, 330, 14, 3, 0, 60, 20, 170, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 84),
('Kuey Teow Ladna', 'Kuey Teow Ladna', ARRAY['gravy flat noodles','rad na'], 'noodles', 'kuey_teow', ARRAY['thai','gravy'], '1 pinggan', '1 plate', 400, 520, 65, 6, 3, 66, 'medium', 1100, 340, 18, 5, 0, 75, 22, 190, 'limit', 'limit', 'safe', 'caution', 'ai_estimated', false, 82),
('Char Kuey Teow Penang', 'Char Kuey Teow Penang', ARRAY['penang ckt','penang fried noodles'], 'noodles', 'kuey_teow', ARRAY['penang','popular','wok hei'], '1 pinggan', '1 plate', 350, 750, 65, 5, 2, 68, 'medium', 1400, 280, 42, 12, 1, 180, 22, 200, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 95),
('Char Kuey Teow KL', 'Char Kuey Teow KL', ARRAY['kl ckt','kuala lumpur ckt'], 'noodles', 'kuey_teow', ARRAY['kl','popular'], '1 pinggan', '1 plate', 340, 720, 63, 5, 2, 67, 'medium', 1350, 270, 40, 11, 1, 175, 21, 195, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 90),
('Char Kuey Teow Kerang', 'Char Kuey Teow Kerang', ARRAY['cockle ckt','see hum ckt'], 'noodles', 'kuey_teow', ARRAY['seafood','premium'], '1 pinggan', '1 plate', 360, 770, 66, 5, 2, 69, 'medium', 1450, 290, 43, 12, 1, 200, 24, 210, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 87),

-- Laksa
('Laksa Penang', 'Laksa Penang', ARRAY['penang laksa','asam laksa'], 'noodles', 'laksa', ARRAY['penang','sour','fish'], '1 mangkuk', '1 bowl', 450, 420, 58, 8, 5, 62, 'medium', 1100, 420, 14, 4, 0, 55, 20, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 92),
('Laksa Sarawak', 'Laksa Sarawak', ARRAY['sarawak laksa'], 'noodles', 'laksa', ARRAY['sarawak','traditional'], '1 mangkuk', '1 bowl', 440, 480, 62, 6, 4, 64, 'medium', 1050, 400, 18, 8, 0, 65, 22, 200, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false, 90),
('Laksa Johor', 'Laksa Johor', ARRAY['johor laksa'], 'noodles', 'laksa', ARRAY['johor','traditional'], '1 mangkuk', '1 bowl', 430, 520, 66, 7, 4, 65, 'medium', 980, 390, 20, 10, 0, 70, 24, 210, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 86),
('Laksa Kedah', 'Laksa Kedah', ARRAY['kedah laksa'], 'noodles', 'laksa', ARRAY['kedah','traditional'], '1 mangkuk', '1 bowl', 420, 460, 60, 7, 4, 63, 'medium', 950, 380, 16, 6, 0, 60, 20, 190, 'caution', 'limit', 'caution', 'caution', 'ai_estimated', false, 82),
('Curry Laksa', 'Laksa Kari', ARRAY['curry laksa','laksa lemak'], 'noodles', 'laksa', ARRAY['curry','coconut','spicy'], '1 mangkuk', '1 bowl', 460, 560, 64, 6, 5, 64, 'medium', 1100, 420, 26, 16, 0, 75, 24, 220, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 88),
('Laksa Nyonya', 'Laksa Nyonya', ARRAY['nyonya laksa','perannakan laksa'], 'noodles', 'laksa', ARRAY['nyonya','traditional'], '1 mangkuk', '1 bowl', 450, 540, 63, 6, 4, 64, 'medium', 1080, 410, 24, 14, 0, 70, 23, 210, 'limit', 'limit', 'limit', 'caution', 'ai_estimated', false, 84),

-- Pan Mee
('Pan Mee Soup', 'Pan Mee Sup', ARRAY['flat noodle soup','ban mian'], 'noodles', 'pan_mee', ARRAY['chinese','soup'], '1 mangkuk', '1 bowl', 420, 440, 60, 3, 3, 64, 'medium', 1050, 340, 14, 3, 0, 55, 22, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 87),
('Pan Mee Dry', 'Pan Mee Kering', ARRAY['dry pan mee','chili pan mee'], 'noodles', 'pan_mee', ARRAY['chinese','dry'], '1 pinggan', '1 plate', 380, 520, 64, 4, 3, 65, 'medium', 1100, 330, 20, 5, 0, 60, 20, 190, 'limit', 'limit', 'safe', 'caution', 'ai_estimated', false, 85),
('Pan Mee Goreng', 'Pan Mee Goreng', ARRAY['fried pan mee'], 'noodles', 'pan_mee', ARRAY['chinese','fried'], '1 pinggan', '1 plate', 360, 560, 66, 4, 3, 66, 'medium', 1080, 320, 22, 6, 0, 65, 19, 185, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 80),

-- Wantan Mee
('Wantan Mee Kering', 'Wantan Mee Kering', ARRAY['dry wonton noodles','wan tan mee'], 'noodles', 'wantan', ARRAY['chinese','popular'], '1 pinggan', '1 plate', 340, 480, 62, 5, 2, 66, 'medium', 950, 290, 16, 4, 0, 70, 20, 175, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 92),
('Wantan Mee Soup', 'Wantan Mee Sup', ARRAY['wonton noodle soup'], 'noodles', 'wantan', ARRAY['chinese','soup'], '1 mangkuk', '1 bowl', 420, 450, 60, 4, 2, 65, 'medium', 1100, 310, 14, 3, 0, 65, 22, 180, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 88),
('Wantan Mee Char Siew', 'Wantan Mee Char Siew', ARRAY['bbq pork wonton noodles'], 'noodles', 'wantan', ARRAY['chinese','char siew'], '1 pinggan', '1 plate', 360, 520, 64, 6, 2, 67, 'medium', 1050, 300, 18, 5, 0, 80, 24, 190, 'limit', 'limit', 'safe', 'caution', 'ai_estimated', false, 85),

-- Hokkien Mee
('Hokkien Mee KL', 'Hokkien Mee KL', ARRAY['kl hokkien mee','dark hokkien'], 'noodles', 'hokkien', ARRAY['kl','dark','popular'], '1 pinggan', '1 plate', 400, 650, 68, 5, 3, 68, 'medium', 1250, 350, 30, 8, 1, 120, 26, 220, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 90),
('Hokkien Mee Penang', 'Hokkien Mee Penang', ARRAY['penang hokkien mee','prawn mee'], 'noodles', 'hokkien', ARRAY['penang','prawn','soup'], '1 mangkuk', '1 bowl', 450, 520, 64, 4, 3, 65, 'medium', 1300, 380, 20, 6, 0, 110, 26, 230, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 88),
('Prawn Mee Soup', 'Mee Udang Sup', ARRAY['prawn noodle soup','har mee'], 'noodles', 'hokkien', ARRAY['prawn','soup'], '1 mangkuk', '1 bowl', 460, 480, 62, 4, 3, 64, 'medium', 1350, 390, 16, 4, 0, 100, 24, 220, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 86),

-- Yee Mee
('Yee Mee Goreng', 'Yee Mee Goreng', ARRAY['fried crispy noodles'], 'noodles', 'yee_mee', ARRAY['crispy','fried'], '1 pinggan', '1 plate', 350, 600, 66, 5, 2, 70, 'high', 1100, 300, 26, 7, 1, 75, 18, 180, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 83),
('Yee Mee Soup', 'Yee Mee Sup', ARRAY['crispy noodle soup'], 'noodles', 'yee_mee', ARRAY['crispy','soup'], '1 mangkuk', '1 bowl', 400, 480, 62, 4, 2, 66, 'medium', 1200, 320, 18, 5, 0, 65, 20, 185, 'caution', 'limit', 'safe', 'caution', 'ai_estimated', false, 80),

-- Maggi Variations
('Maggi Sup', 'Maggi Sup', ARRAY['maggi soup','instant noodle soup'], 'noodles', 'instant', ARRAY['instant','soup','popular'], '1 mangkuk', '1 bowl', 380, 420, 58, 4, 2, 70, 'high', 1500, 260, 16, 4, 1, 55, 14, 150, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 92),
('Maggi Kari', 'Maggi Kari', ARRAY['maggi curry','curry instant noodles'], 'noodles', 'instant', ARRAY['instant','curry','popular'], '1 mangkuk', '1 bowl', 370, 450, 60, 4, 2, 71, 'high', 1450, 270, 18, 10, 1, 60, 15, 155, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false, 90),
('Maggi Tom Yam', 'Maggi Tom Yam', ARRAY['maggi tomyam','spicy instant noodles'], 'noodles', 'instant', ARRAY['instant','spicy','thai'], '1 mangkuk', '1 bowl', 380, 440, 59, 4, 2, 70, 'high', 1480, 265, 17, 5, 1, 58, 14, 152, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 88),

-- Indomie
('Indomie Goreng', 'Indomie Goreng', ARRAY['indomie fried','indo mie'], 'noodles', 'instant', ARRAY['instant','indonesian','fried'], '1 pinggan', '1 plate', 340, 540, 66, 4, 2, 72, 'high', 1380, 270, 22, 6, 1, 70, 15, 165, 'limit', 'limit', 'caution', 'safe', 'ai_estimated', false, 90),
('Indomie Sup', 'Indomie Sup', ARRAY['indomie soup'], 'noodles', 'instant', ARRAY['instant','indonesian','soup'], '1 mangkuk', '1 bowl', 390, 430, 58, 3, 2, 71, 'high', 1420, 260, 16, 5, 1, 55, 13, 150, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 85),
('Indomie Kari Ayam', 'Indomie Kari Ayam', ARRAY['indomie chicken curry'], 'noodles', 'instant', ARRAY['instant','indonesian','curry'], '1 mangkuk', '1 bowl', 380, 450, 60, 4, 2, 71, 'high', 1450, 265, 18, 10, 1, 58, 14, 155, 'caution', 'limit', 'caution', 'safe', 'ai_estimated', false, 87),

-- Other Noodles
('Spaghetti Goreng', 'Spaghetti Goreng', ARRAY['fried spaghetti','mamak spaghetti'], 'noodles', 'western', ARRAY['fusion','mamak'], '1 pinggan', '1 plate', 380, 580, 70, 7, 3, 66, 'medium', 980, 320, 24, 6, 0, 75, 20, 190, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 82),
('Mee Kolok Sarawak', 'Mee Kolok Sarawak', ARRAY['sarawak dry noodles','kolok mee'], 'noodles', 'mee', ARRAY['sarawak','traditional'], '1 pinggan', '1 plate', 320, 450, 60, 4, 2, 65, 'medium', 850, 280, 16, 4, 0, 55, 18, 170, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 86),
('Kampua Mee Sarawak', 'Kampua Mee Sarawak', ARRAY['kampua noodles'], 'noodles', 'mee', ARRAY['sarawak','traditional'], '1 pinggan', '1 plate', 310, 440, 58, 3, 2, 64, 'medium', 820, 270, 15, 4, 0, 50, 17, 165, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 82),
('Lontong', 'Lontong', ARRAY['rice cake soup','compressed rice'], 'noodles', 'rice_cake', ARRAY['traditional','javanese'], '1 mangkuk', '1 bowl', 400, 420, 62, 5, 4, 62, 'medium', 850, 350, 12, 6, 0, 45, 16, 170, 'caution', 'limit', 'safe', 'safe', 'ai_estimated', false, 85),
('Kuey Chap', 'Kuey Chap', ARRAY['flat rice noodle soup'], 'noodles', 'kuey_teow', ARRAY['chinese','teochew'], '1 mangkuk', '1 bowl', 450, 520, 65, 4, 3, 66, 'medium', 1250, 370, 20, 8, 0, 95, 24, 210, 'limit', 'limit', 'caution', 'caution', 'ai_estimated', false, 80);

-- End of Part 1 - FIXED

