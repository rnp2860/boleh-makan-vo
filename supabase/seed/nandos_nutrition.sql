-- Nando's Malaysia Nutrition Data
-- Source: Nando's Malaysia Nutrition PDF (September 2025)
-- Generated: January 2026

-- Insert Nando's menu items into malaysian_foods table

-- BASTE SAUCES
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Extra Hot Baste', 'Nandos Extra Hot Baste', '1 serving', 57, 90, 0, 9, 9, 0, 760, 'Nandos', 'Fast Food', true),
  ('Nandos Hot Baste', 'Nandos Hot Baste', '1 serving', 28, 45, 0, 4.5, 9, 0, 380, 'Nandos', 'Fast Food', true),
  ('Nandos Lemon and Herb Baste', 'Nandos Lemon and Herb Baste', '1 serving', 28, 10, 0, 1, 2.5, 0, 170, 'Nandos', 'Fast Food', true),
  ('Nandos Mango and Lime Baste', 'Nandos Mango and Lime Baste', '1 serving', 28, 30, 0, 1, 2.5, 0, 290, 'Nandos', 'Fast Food', true),
  ('Nandos Medium Baste', 'Nandos Medium Baste', '1 serving', 28, 25, 0, 2.5, 3, 0, 210, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Q Baste', 'Nandos PERi Q Baste', '1 serving', 28, 40, 0, 4.5, 0, 0, 150, 'Nandos', 'Fast Food', true);

-- ADD-ONS
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Avocado (Half)', 'Nandos Avocado (Separuh)', '1/2 avocado', 90, 140, 2, 13, 8, 7, 5, 'Nandos', 'Fast Food', true),
  ('Nandos Boneless Chicken Breast (Plainish)', 'Nandos Dada Ayam Tanpa Tulang', '1 piece', 128, 220, 40.5, 9, 0, 0, 730, 'Nandos', 'Fast Food', true),
  ('Nandos Cheddar Cheese', 'Nandos Keju Cheddar', '1 slice', 14, 60, 4, 4.5, 0, 0, 95, 'Nandos', 'Fast Food', true),
  ('Nandos Chicken Thigh (Plainish)', 'Nandos Paha Ayam', '1 piece', 64, 140, 18, 9, 0, 0, 370, 'Nandos', 'Fast Food', true),
  ('Nandos Chicken Thigh Skewer (Plainish)', 'Nandos Cucuk Paha Ayam', '1 skewer', 128, 200, 24, 13, 0, 0, 490, 'Nandos', 'Fast Food', true),
  ('Nandos Chilli Jam', 'Nandos Jem Cili', '1 serving', 28, 40, 0, 0, 10, 0, 50, 'Nandos', 'Fast Food', true),
  ('Nandos Feta Cheese', 'Nandos Keju Feta', '1 serving', 20, 50, 3, 4.5, 0, 0, 180, 'Nandos', 'Fast Food', true),
  ('Nandos Grilled Halloumi Cheese', 'Nandos Keju Halloumi Panggang', '1 serving', 62, 230, 12, 19, 0, 0, 600, 'Nandos', 'Fast Food', true),
  ('Nandos Grilled Pineapple (1 slice)', 'Nandos Nanas Panggang', '1 slice', 57, 30, 0, 0, 8, 1, 0, 'Nandos', 'Fast Food', true),
  ('Nandos Hummus Scoop', 'Nandos Hummus', '1 scoop', 28, 80, 2, 0.5, 5, 2, 120, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Honey', 'Nandos PERi Madu', '1 serving', 50, 120, 0, 0, 30, 0, 310, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Pita Croutons', 'Nandos Kruton Pita PERi', '1 serving', 20, 90, 1, 0, 21, 0, 290, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Ranch', 'Nandos PERi Ranch', '1 serving', 28, 60, 0, 6, 0, 0, 370, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Drizzle', 'Nandos Titisan PERi-PERi', '1 serving', 28, 140, 0, 15, 2, 0, 470, 'Nandos', 'Fast Food', true),
  ('Nandos PERinaise', 'Nandos PERinaise', '1 serving', 28, 90, 0, 8, 3, 0, 320, 'Nandos', 'Fast Food', true),
  ('Nandos Pickled Cauliflower', 'Nandos Bunga Kubis Jeruk', '1 serving', 50, 20, 0, 0, 3, 1, 170, 'Nandos', 'Fast Food', true),
  ('Nandos Pickled Red Onions', 'Nandos Bawang Merah Jeruk', '1 serving', 10, 0, 0, 0, 0, 0, 35, 'Nandos', 'Fast Food', true),
  ('Nandos Pulled Chicken', 'Nandos Ayam Carik', '1 serving', 113, 270, 34, 13, 0, 0, 90, 'Nandos', 'Fast Food', true),
  ('Nandos Roasted Red Pepper', 'Nandos Lada Merah Panggang', '1 serving', 35, 10, 0, 0, 2, 0, 120, 'Nandos', 'Fast Food', true),
  ('Nandos Sliced Tomatoes', 'Nandos Tomato Hirisan', '1 serving', 60, 20, 0, 0, 4, 0, 210, 'Nandos', 'Fast Food', true),
  ('Nandos Superseed Crunch', 'Nandos Superseed Crunch', '1 serving', 20, 100, 4, 8, 5, 5, 190, 'Nandos', 'Fast Food', true),
  ('Nandos Tomato Cucumber Onion Salad', 'Nandos Salad Tomato Timun Bawang', '1 serving', 55, 10, 0, 0, 2, 0, 50, 'Nandos', 'Fast Food', true),
  ('Nandos Veggie Burger Patty (Plainish)', 'Nandos Patty Burger Sayur', '1 patty', 142, 210, 7, 8, 28, 7, 420, 'Nandos', 'Fast Food', true);

-- BEVERAGES (NON-ALCOHOLIC)
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Blood Orange Mango Lemonade (16oz)', 'Nandos Lemonade Oren Darah Mangga (16oz)', '1 cup (16oz)', 454, 230, 0, 0, 57, 0, 2, 'Nandos', 'Drinks', true),
  ('Nandos Blood Orange Mango Lemonade (32oz)', 'Nandos Lemonade Oren Darah Mangga (32oz)', '1 cup (32oz)', 719, 450, 0, 0, 114, 0, 1, 'Nandos', 'Drinks', true),
  ('Nandos Blood Orange Mango Lemonade (Gallon)', 'Nandos Lemonade Oren Darah Mangga (Gallon)', '1 gallon', 3785, 2750, 4, 0, 796, 0, 5, 'Nandos', 'Drinks', true),
  ('Nandos Lavender Lemonade (16oz)', 'Nandos Lemonade Lavender (16oz)', '1 cup (16oz)', 454, 80, 0, 0, 18, 0, 20, 'Nandos', 'Drinks', true),
  ('Nandos Lavender Lemonade (32oz)', 'Nandos Lemonade Lavender (32oz)', '1 cup (32oz)', 908, 150, 0, 0, 36, 0, 45, 'Nandos', 'Drinks', true),
  ('Nandos La Colombe Oatmilk Latte (Can)', 'Nandos Latte Susu Oat', '1 can', 266, 120, 4, 4, 22, 3, 100, 'Nandos', 'Drinks', true),
  ('Nandos Pineapple Lemonade (16oz)', 'Nandos Lemonade Nanas (16oz)', '1 cup (16oz)', 454, 210, 0, 0, 53, 0, 2, 'Nandos', 'Drinks', true),
  ('Nandos Pineapple Lemonade (32oz)', 'Nandos Lemonade Nanas (32oz)', '1 cup (32oz)', 908, 430, 0, 0, 107, 0, 6, 'Nandos', 'Drinks', true),
  ('Nandos Pineapple Lemonade (Gallon)', 'Nandos Lemonade Nanas (Gallon)', '1 gallon', 3785, 2840, 0, 0, 837, 0, 1, 'Nandos', 'Drinks', true),
  ('Nandos Rubro Peach Iced Tea (8oz)', 'Nandos Teh Ais Pic (8oz)', '1 cup (8oz)', 227, 190, 0, 0, 48, 0, 30, 'Nandos', 'Drinks', true),
  ('Nandos Rubro Peach Iced Tea (1L)', 'Nandos Teh Ais Pic (1L)', '1 liter', 1000, 680, 0, 0, 187, 0, 135, 'Nandos', 'Drinks', true),
  ('Nandos Strawberry Lemonade (8oz)', 'Nandos Lemonade Strawberi (8oz)', '1 cup (8oz)', 227, 210, 0, 0, 54, 0, 15, 'Nandos', 'Drinks', true),
  ('Nandos Strawberry Lemonade (1L)', 'Nandos Lemonade Strawberi (1L)', '1 liter', 1000, 410, 0, 0, 107, 0, 25, 'Nandos', 'Drinks', true),
  ('Nandos Topo Chico', 'Nandos Topo Chico', '1 bottle', 340, 0, 0, 0, 0, 0, 5, 'Nandos', 'Drinks', true),
  ('Nandos Watermelon Mint Lemonade (16oz)', 'Nandos Lemonade Tembikai Pudina (16oz)', '1 cup (16oz)', 454, 270, 0, 0, 66, 0, 20, 'Nandos', 'Drinks', true),
  ('Nandos Watermelon Mint Lemonade (32oz)', 'Nandos Lemonade Tembikai Pudina (32oz)', '1 cup (32oz)', 908, 530, 0, 0, 132, 0, 40, 'Nandos', 'Drinks', true);

-- SNACKS & SHAREABLES
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Garlic Sticks', 'Nandos Garlic Sticks', '1 serving', 198, 740, 13, 47, 70, 2, 1100, 'Nandos', 'Fast Food', true),
  ('Nandos Halloumi Sticks & Chilli Jam', 'Nandos Halloumi Sticks & Jem Cili', '1 serving', 220, 640, 30, 51, 21, 0, 1750, 'Nandos', 'Fast Food', true),
  ('Nandos Hummus with Pita', 'Nandos Hummus dengan Pita', '1 serving', 360, 1080, 32, 58, 106, 25, 1920, 'Nandos', 'Fast Food', true),
  ('Nandos Hummus with Pita and Veggies', 'Nandos Hummus dengan Pita dan Sayur', '1 serving', 609, 1210, 32, 27, 127, 19, 2090, 'Nandos', 'Fast Food', true),
  ('Nandos Hummus with Veggies', 'Nandos Hummus dengan Sayur', '1 serving', 451, 770, 16, 19, 49, 13, 1250, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Wings (6) with PERi Ranch', 'Nandos Kepak PERi-PERi (6)', '6 wings', 229, 750, 56, 55, 10, 0, 2250, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Mixed Olives', 'Nandos Zaitun Campur Pedas', '1 serving', 170, 220, 0, 20, 7, 5, 2050, 'Nandos', 'Fast Food', true);

-- CHICKEN MAIN DISHES
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Half Chicken', 'Nandos Setengah Ayam', '1/2 chicken', 418, 760, 88, 69, 9, 0, 1830, 'Nandos', 'Fast Food', true),
  ('Nandos Half Chicken and Chips', 'Nandos Setengah Ayam dengan Kentang', '1/2 chicken + chips', 367, 790, 63, 88, 16, 4, 970, 'Nandos', 'Fast Food', true),
  ('Nandos Quarter Chicken Breast', 'Nandos Suku Dada Ayam', '1/4 chicken breast', 293, 290, 44, 23, 16, 0, 1960, 'Nandos', 'Fast Food', true),
  ('Nandos Quarter Chicken Leg', 'Nandos Suku Paha Ayam', '1/4 chicken leg', 160, 260, 25, 25, 0, 0, 570, 'Nandos', 'Fast Food', true),
  ('Nandos Quarter Chicken Leg (2 pieces)', 'Nandos Paha Ayam (2 keping)', '2 legs', 235, 520, 50, 50, 0, 3, 420, 'Nandos', 'Fast Food', true),
  ('Nandos Boneless Chicken Thighs (2)', 'Nandos Paha Ayam Tanpa Tulang (2)', '2 thighs', 128, 390, 44, 130, 0, 0, 1480, 'Nandos', 'Fast Food', true),
  ('Nandos Boneless Chicken Thighs (3)', 'Nandos Paha Ayam Tanpa Tulang (3)', '3 thighs', 191, 420, 39, 70, 0, 0, 1800, 'Nandos', 'Fast Food', true),
  ('Nandos Chicken Livers', 'Nandos Hati Ayam', '1 serving', 340, 450, 28, 240, 7, 1, 2760, 'Nandos', 'Fast Food', true),
  ('Nandos Chicken Thigh Skewers (2)', 'Nandos Cucuk Paha Ayam (2)', '2 skewers', 255, 400, 47, 220, 0, 0, 2320, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Wings (12) with PERi Ranch', 'Nandos Kepak PERi-PERi (12)', '12 wings', 415, 1390, 80, 910, 15, 0, 4230, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Wings (24) with PERi Ranch', 'Nandos Kepak PERi-PERi (24)', '24 wings', 1168, 2840, 160, 1860, 29, 6, 8420, 'Nandos', 'Fast Food', true),
  ('Nandos Peri Q Chips Plate (Thigh)', 'Nandos Peri Q Kentang (Paha)', '1 plate', 415, 780, 36, 360, 68, 6, 1640, 'Nandos', 'Fast Food', true),
  ('Nandos Peri Q Chips Plate (Breast)', 'Nandos Peri Q Kentang (Dada)', '1 plate', 457, 810, 50, 342, 68, 3, 1800, 'Nandos', 'Fast Food', true),
  ('Nandos Peri Q Mac Plate (Thigh)', 'Nandos Peri Q Mac (Paha)', '1 plate', 387, 840, 42, 468, 53, 3, 1570, 'Nandos', 'Fast Food', true),
  ('Nandos Peri Q Mac Plate (Breast)', 'Nandos Peri Q Mac (Dada)', '1 plate', 429, 880, 55, 468, 54, 3, 1730, 'Nandos', 'Fast Food', true);

-- BOWLS & SALADS
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Spicy Chicken Caesar (Breast)', 'Nandos Caesar Pedas (Dada)', '1 bowl', 364, 840, 68, 93, 34, 3, 800, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Caesar (Thighs)', 'Nandos Caesar Pedas (Paha)', '1 bowl', 486, 760, 72, 67, 0, 3, 420, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Caesar (Halloumi)', 'Nandos Caesar Pedas (Halloumi)', '1 bowl', 503, 840, 42, 60, 0, 3, 550, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Caesar (Pulled Chicken)', 'Nandos Caesar Pedas (Ayam Carik)', '1 bowl', 344, 720, 67, 43, 0, 5, 730, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Kale Caesar (Breast)', 'Nandos Caesar Kale Pedas (Dada)', '1 bowl', 447, 820, 50, 63, 16, 5, 2170, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Kale Caesar (Thighs)', 'Nandos Caesar Kale Pedas (Paha)', '1 bowl', 272, 550, 48, 41, 0, 3, 1480, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Kale Caesar (Halloumi)', 'Nandos Caesar Kale Pedas (Halloumi)', '1 bowl', 428, 290, 28, 29, 17, 3, 2760, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Kale Caesar (Pulled Chicken)', 'Nandos Caesar Kale Pedas (Ayam Carik)', '1 bowl', 160, 540, 46, 31, 11, 5, 2320, 'Nandos', 'Fast Food', true),
  ('Nandos Braai BBQ Bowl', 'Nandos Mangkuk Braai BBQ', '1 bowl', 118, 1090, 47, 61, 119, 10, 2250, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Q Bowl (Breast)', 'Nandos Mangkuk PERi Q (Dada)', '1 bowl', 754, 1090, 48, 37, 98, 9, 2050, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Q Bowl (Halloumi)', 'Nandos Mangkuk PERi Q (Halloumi)', '1 bowl', 669, 920, 46, 30, 98, 9, 2300, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Q Bowl (Pulled Chicken)', 'Nandos Mangkuk PERi Q (Ayam Carik)', '1 bowl', 590, 800, 11, 19, 98, 9, 2000, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Q Bowl (Thigh)', 'Nandos Mangkuk PERi Q (Paha)', '1 bowl', 641, 550, 48, 32, 97, 9, 1230, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Ranch Crunch Salad (Breast)', 'Nandos Salad PERi Ranch Crunch (Dada)', '1 bowl', 669, 820, 46, 31, 22, 5, 1320, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Ranch Crunch Salad (Thighs)', 'Nandos Salad PERi Ranch Crunch (Paha)', '1 bowl', 536, 790, 45, 42, 22, 5, 1960, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Ranch Crunch Salad (Pulled Chicken)', 'Nandos Salad PERi Ranch Crunch (Ayam Carik)', '1 bowl', 621, 610, 11, 65, 21, 5, 2030, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Ranch Crunch Salad (Halloumi)', 'Nandos Salad PERi Ranch Crunch (Halloumi)', '1 bowl', 464, 870, 57, 43, 21, 5, 2520, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Bowl (Breast)', 'Nandos Mangkuk Ayam PERi-PERi (Dada)', '1 bowl', 427, 600, 38, 32, 95, 8, 1650, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Bowl (Thighs)', 'Nandos Mangkuk Ayam PERi-PERi (Paha)', '1 bowl', 627, 570, 21, 47, 95, 8, 2230, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Bowl (Pulled Chicken)', 'Nandos Mangkuk Ayam PERi-PERi (Ayam Carik)', '1 bowl', 655, 870, 45, 28, 70, 7, 2040, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Bowl (Halloumi)', 'Nandos Mangkuk Ayam PERi-PERi (Halloumi)', '1 bowl', 489, 1000, 50, 32, 71, 7, 2610, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Rainbow Bowl (Breast)', 'Nandos Mangkuk Rainbow PERi-PERi (Dada)', '1 bowl', 438, 760, 45, 51, 79, 12, 2300, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Rainbow Bowl (Thighs)', 'Nandos Mangkuk Rainbow PERi-PERi (Paha)', '1 bowl', 649, 690, 23, 68, 80, 12, 2560, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Rainbow Bowl (Pulled Chicken)', 'Nandos Mangkuk Rainbow PERi-PERi (Ayam Carik)', '1 bowl', 679, 1040, 51, 54, 79, 12, 1930, 'Nandos', 'Fast Food', true),
  ('Nandos PERi-PERi Chicken Rainbow Bowl (Halloumi)', 'Nandos Mangkuk Rainbow PERi-PERi (Halloumi)', '1 bowl', 622, 920, 35, 47, 79, 12, 1890, 'Nandos', 'Fast Food', true);

-- HANDHELDS (SANDWICHES & WRAPS)
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Spicy Chicken Caesar Wrap', 'Nandos Wrap Caesar Pedas', '1 wrap', 335, 900, 44, 51, 58, 2, 800, 'Nandos', 'Fast Food', true),
  ('Nandos Spicy Chicken Kale Caesar Wrap', 'Nandos Wrap Caesar Kale Pedas', '1 wrap', 372, 580, 32, 41, 58, 8, 1560, 'Nandos', 'Fast Food', true),
  ('Nandos Chicken Breast Sandwich (Plainish)', 'Nandos Sandwic Dada Ayam', '1 sandwich', 278, 970, 62, 44, 72, 8, 1530, 'Nandos', 'Fast Food', true),
  ('Nandos Chicken Burger (Plainish)', 'Nandos Burger Ayam', '1 burger', 496, 830, 42, 34, 95, 3, 1730, 'Nandos', 'Fast Food', true),
  ('Nandos Nandocas Choice (Plainish)', 'Nandos Pilihan Nandocas', '1 sandwich', 500, 900, 58, 17, 79, 4, 1350, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Q Sandwich', 'Nandos Sandwic PERi Q', '1 sandwich', 358, 410, 16, 26, 49, 8, 450, 'Nandos', 'Fast Food', true),
  ('Nandos Sweet & Spicy Chicken Wrap (Thighs)', 'Nandos Wrap Ayam Manis Pedas', '1 wrap', 335, 900, 31, 60, 89, 11, 1270, 'Nandos', 'Fast Food', true),
  ('Nandos Sweet Potato & Halloumi Wrap', 'Nandos Wrap Keledek & Halloumi', '1 wrap', 326, 1090, 28, 43, 58, 6, 1210, 'Nandos', 'Fast Food', true),
  ('Nandos Sweet Potato & Halloumi Sandwich', 'Nandos Sandwic Keledek & Halloumi', '1 sandwich', 343, 850, 28, 29, 43, 2, 800, 'Nandos', 'Fast Food', true),
  ('Nandos Thigh and Mighty Sandwich (Plainish)', 'Nandos Sandwic Paha Mighty', '1 sandwich', 388, 780, 42, 15, 71, 8, 1380, 'Nandos', 'Fast Food', true),
  ('Nandos Veggie Burger (Plainish)', 'Nandos Burger Sayur', '1 burger', 349, 600, 14, 16, 37, 2, 1210, 'Nandos', 'Fast Food', true);

-- NANDINOS (KIDS MEALS - ENTREES)
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Kids Chicken Breast Sandwich (Plainish)', 'Nandos Sandwic Dada Ayam (Kanak-kanak)', '1 sandwich', 118, 530, 32, 23, 49, 2, 1200, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Drumstick and Thigh (Plainish)', 'Nandos Paha Ayam (Kanak-kanak)', '1 serving', 92, 260, 27, 16, 0, 0, 135, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Grilled Cheese', 'Nandos Keju Panggang (Kanak-kanak)', '1 serving', 128, 310, 11, 17, 29, 0, 50, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Grilled Chicken Breast Strips (Plainish)', 'Nandos Hirisan Dada Ayam (Kanak-kanak)', '1 serving', 184, 220, 43, 7, 8, 2, 280, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Mac & Cheese', 'Nandos Mac & Keju (Kanak-kanak)', '1 serving', 99, 390, 15, 12, 37, 2, 630, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Wings (3)', 'Nandos Kepak (3) (Kanak-kanak)', '3 wings', 213, 240, 26, 11, 0, 0, 340, 'Nandos', 'Fast Food', true);

-- NANDINOS SIDES
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Kids Apple Slices', 'Nandos Hirisan Epal (Kanak-kanak)', '1 serving', 113, 120, 0, 0, 28, 2, 50, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Coleslaw', 'Nandos Coleslaw (Kanak-kanak)', '1 serving', 83, 130, 1, 10, 0, 0, 650, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Corn (Half Cob)', 'Nandos Jagung Setengah (Kanak-kanak)', '1/2 cob', 50, 190, 4, 12, 16, 3, 0, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Garlic Bread', 'Nandos Garlic Bread (Kanak-kanak)', '1 serving', 99, 190, 3, 11, 17, 0, 290, 'Nandos', 'Fast Food', true),
  ('Nandos Kids PERi Chips', 'Nandos PERi Kentang (Kanak-kanak)', '1 serving', 85, 130, 1, 6, 21, 2, 8, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Portuguese Rice', 'Nandos Nasi Portugal (Kanak-kanak)', '1 serving', 156, 45, 1, 0, 8, 0, 16, 'Nandos', 'Fast Food', true),
  ('Nandos Kids Raw Veggies', 'Nandos Sayur Mentah (Kanak-kanak)', '1 serving', 113, 190, 3, 15, 17, 2, 21, 'Nandos', 'Fast Food', true);

-- SIDES (REGULAR, LARGE, X-LARGE)
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Roasted Brussels Sprouts (Regular)', 'Nandos Kobis Brussels Panggang (Biasa)', '1 regular', 198, 135, 4, 7, 19, 6, 870, 'Nandos', 'Fast Food', true),
  ('Nandos Roasted Brussels Sprouts (Large)', 'Nandos Kobis Brussels Panggang (Besar)', '1 large', 397, 270, 7, 13, 38, 11, 1730, 'Nandos', 'Fast Food', true),
  ('Nandos Roasted Brussels Sprouts (X-Large)', 'Nandos Kobis Brussels Panggang (X-Besar)', '1 x-large', 794, 530, 13, 25, 77, 22, 3460, 'Nandos', 'Fast Food', true),
  ('Nandos Crispy Brussels Sprouts (Regular)', 'Nandos Kobis Brussels Rangup (Biasa)', '1 regular', 208, 420, 7, 29, 38, 6, 1090, 'Nandos', 'Fast Food', true),
  ('Nandos Crispy Brussels Sprouts (Large)', 'Nandos Kobis Brussels Rangup (Besar)', '1 large', 445, 840, 13, 59, 77, 13, 2580, 'Nandos', 'Fast Food', true),
  ('Nandos Crispy Brussels Sprouts (X-Large)', 'Nandos Kobis Brussels Rangup (X-Besar)', '1 x-large', 892, 1490, 25, 105, 135, 26, 5450, 'Nandos', 'Fast Food', true),
  ('Nandos Coleslaw (Regular)', 'Nandos Coleslaw (Biasa)', '1 regular', 170, 290, 2, 23, 19, 2, 200, 'Nandos', 'Fast Food', true),
  ('Nandos Coleslaw (Large)', 'Nandos Coleslaw (Besar)', '1 large', 340, 640, 5, 52, 41, 4, 400, 'Nandos', 'Fast Food', true),
  ('Nandos Coleslaw (X-Large)', 'Nandos Coleslaw (X-Besar)', '1 x-large', 680, 1280, 11, 105, 82, 8, 810, 'Nandos', 'Fast Food', true),
  ('Nandos Corn on the Cob (1 cob)', 'Nandos Jagung (1 tongkol)', '1 cob', 158, 180, 4, 10, 23, 4, 50, 'Nandos', 'Fast Food', true),
  ('Nandos Corn on the Cob (1 cob, No Butter)', 'Nandos Jagung (1 tongkol, Tanpa Mentega)', '1 cob', 150, 360, 8, 19, 46, 8, 0, 'Nandos', 'Fast Food', true),
  ('Nandos Garlic Bread (Regular)', 'Nandos Garlic Bread (Biasa)', '1 regular', 99, 710, 14, 38, 85, 7, 990, 'Nandos', 'Fast Food', true),
  ('Nandos Garlic Bread (Large)', 'Nandos Garlic Bread (Besar)', '1 large', 198, 150, 4, 8, 17, 0, 1980, 'Nandos', 'Fast Food', true),
  ('Nandos Garlic Bread (X-Large)', 'Nandos Garlic Bread (X-Besar)', '1 x-large', 397, 60, 2, 2.5, 8, 0, 3960, 'Nandos', 'Fast Food', true),
  ('Nandos Golden Cauliflower (Regular)', 'Nandos Bunga Kubis Keemasan (Biasa)', '1 regular', 213, 261, 7, 21, 19, 6, 750, 'Nandos', 'Fast Food', true),
  ('Nandos Golden Cauliflower (Large)', 'Nandos Bunga Kubis Keemasan (Besar)', '1 large', 425, 531, 14, 42, 41, 12, 1490, 'Nandos', 'Fast Food', true),
  ('Nandos Golden Cauliflower (X-Large)', 'Nandos Bunga Kubis Keemasan (X-Besar)', '1 x-large', 851, 207, 6, 17, 19, 5, 2980, 'Nandos', 'Fast Food', true),
  ('Nandos Macho Peas (Regular)', 'Nandos Kacang Macho (Biasa)', '1 regular', 170, 468, 12, 34, 34, 9, 980, 'Nandos', 'Fast Food', true),
  ('Nandos Macho Peas (Large)', 'Nandos Kacang Macho (Besar)', '1 large', 340, 945, 24, 69, 67, 19, 1950, 'Nandos', 'Fast Food', true),
  ('Nandos Macho Peas (X-Large)', 'Nandos Kacang Macho (X-Besar)', '1 x-large', 680, 130, 12, 7, 15, 4, 3900, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Chips (Regular)', 'Nandos Kentang PERi (Biasa)', '1 regular', 156, 260, 4, 10, 36, 4, 350, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Chips (Large)', 'Nandos Kentang PERi (Besar)', '1 large', 312, 530, 7, 19, 73, 8, 570, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Chips (X-Large)', 'Nandos Kentang PERi (X-Besar)', '1 x-large', 624, 180, 5, 2.5, 34, 5, 1150, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Honey Sweet Potatoes (Regular)', 'Nandos Keledek PERi Madu (Biasa)', '1 regular', 255, 210, 5, 10, 36, 1, 2300, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Honey Sweet Potatoes (Large)', 'Nandos Keledek PERi Madu (Besar)', '1 large', 511, 420, 11, 19, 73, 2, 1050, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Honey Sweet Potatoes (X-Large)', 'Nandos Keledek PERi Madu (X-Besar)', '1 x-large', 1021, 850, 21, 38, 145, 4, 2100, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Mac (Regular)', 'Nandos PERi Mac (Biasa)', '1 regular', 199, 320, 13, 17, 37, 3, 4200, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Mac (Large)', 'Nandos PERi Mac (Besar)', '1 large', 397, 630, 25, 33, 73, 7, 35, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Mac (X-Large)', 'Nandos PERi Mac (X-Besar)', '1 x-large', 794, 1270, 51, 67, 147, 14, 70, 'Nandos', 'Fast Food', true),
  ('Nandos Portuguese Roll', 'Nandos Roti Portugal', '1 roll', 71, 210, 6, 1, 1, 0, 139, 'Nandos', 'Fast Food', true),
  ('Nandos Portuguese Rice (Regular)', 'Nandos Nasi Portugal (Biasa)', '1 regular', 142, 420, 7, 10, 42, 2, 21, 'Nandos', 'Fast Food', true),
  ('Nandos Portuguese Rice (Large)', 'Nandos Nasi Portugal (Besar)', '1 large', 284, 850, 14, 19, 85, 5, 42, 'Nandos', 'Fast Food', true),
  ('Nandos Portuguese Rice (X-Large)', 'Nandos Nasi Portugal (X-Besar)', '1 x-large', 567, 60, 4, 1, 11, 1, 85, 'Nandos', 'Fast Food', true),
  ('Nandos Red Skin Mashed Potatoes (Regular)', 'Nandos Kentang Lembik Kulit Merah (Biasa)', '1 regular', 184, 120, 4, 2.5, 22, 2, 11, 'Nandos', 'Fast Food', true),
  ('Nandos Red Skin Mashed Potatoes (Large)', 'Nandos Kentang Lembik Kulit Merah (Besar)', '1 large', 369, 240, 8, 5, 45, 5, 22, 'Nandos', 'Fast Food', true),
  ('Nandos Red Skin Mashed Potatoes (X-Large)', 'Nandos Kentang Lembik Kulit Merah (X-Besar)', '1 x-large', 738, 190, 5, 8, 34, 4, 45, 'Nandos', 'Fast Food', true);

-- CONDIMENTS & SAUCES
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Balsamic Vinaigrette', 'Nandos Vinaigrette Balsamik', '1 serving', 71, 150, 0, 11, 17, 0, 105, 'Nandos', 'Fast Food', true),
  ('Nandos Balsamic Vinegar', 'Nandos Cuka Balsamik', '1 serving', 28, 40, 0, 0, 9, 0, 500, 'Nandos', 'Fast Food', true),
  ('Nandos Caesar Dressing', 'Nandos Sos Caesar', '1 serving', 28, 250, 3, 23, 9, 0, 170, 'Nandos', 'Fast Food', true),
  ('Nandos Extra Hot Sauce', 'Nandos Sos Extra Pedas', '1 serving', 28, 25, 0, 0, 5, 0, 5, 'Nandos', 'Fast Food', true),
  ('Nandos Garlic Sauce', 'Nandos Sos Bawang Putih', '1 serving', 28, 170, 0, 19, 0, 0, 260, 'Nandos', 'Fast Food', true),
  ('Nandos Hot Sauce', 'Nandos Sos Pedas', '1 serving', 28, 20, 0, 1, 5, 0, 730, 'Nandos', 'Fast Food', true),
  ('Nandos Ketchup', 'Nandos Sos Tomato', '1 serving', 28, 15, 0, 1, 1, 0, 630, 'Nandos', 'Fast Food', true),
  ('Nandos Lemon & Herb Sauce', 'Nandos Sos Lemon & Herba', '1 serving', 28, 15, 0, 1, 1, 0, 710, 'Nandos', 'Fast Food', true),
  ('Nandos Medium Sauce', 'Nandos Sos Sederhana', '1 serving', 28, 30, 0, 0, 8, 0, 260, 'Nandos', 'Fast Food', true),
  ('Nandos Olive Oil', 'Nandos Minyak Zaitun', '1 serving', 28, 35, 0, 3, 2, 0, 320, 'Nandos', 'Fast Food', true),
  ('Nandos PERi Tamer', 'Nandos PERi Tamer', '1 serving', 28, 15, 0, 1, 1, 0, 640, 'Nandos', 'Fast Food', true),
  ('Nandos Wild Herb Sauce', 'Nandos Sos Herba Liar', '1 serving', 28, 60, 0, 5, 6, 0, 730, 'Nandos', 'Fast Food', true),
  ('Nandos XXX Hot Sauce', 'Nandos Sos XXX Pedas', '1 serving', 28, 45, 0, 0.5, 9, 0, 840, 'Nandos', 'Fast Food', true);

-- DESSERTS
INSERT INTO malaysian_foods (name_en, name_bm, serving_description, serving_grams, calories_kcal, protein_g, total_fat_g, carbs_g, fiber_g, sodium_mg, source, category, verified)
VALUES
  ('Nandos Carrot Cake', 'Nandos Kek Lobak Merah', '1 slice', 241, 620, 9, 62, 49, 2, 760, 'Nandos', 'Fast Food', true),
  ('Nandos Barely Baked Brownie', 'Nandos Brownie Separuh Bakar', '1 piece', 50, 900, 3, 8, 3, 3, 1300, 'Nandos', 'Fast Food', true),
  ('Nandos Naughty Natas', 'Nandos Naughty Natas', '1 piece', 176, 80, 9, 43, 5, 0, 370, 'Nandos', 'Fast Food', true),
  ('Nandos Raspberry White Chocolate Cheesecake', 'Nandos Cheesecake Raspberry Coklat Putih', '1 slice', 227, 520, 3, 26, 33, 0, 740, 'Nandos', 'Fast Food', true);

