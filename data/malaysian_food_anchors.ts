// src/data/malaysian_food_anchors.ts

export type SourceType = 'MyFCD' | 'SG_HPB' | 'Research_2022' | 'Manual_Audit' | 'Brand_Official';
export type FoodCategory = 'main' | 'drink' | 'dessert' | 'addon';

export interface FoodAnchor {
  id: string;
  name: string;
  keywords: string[];
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sodium_mg: number; 
  fiber_g: number;
  sugar_g?: number;
  source: SourceType;
  serving_size: string;
  category: FoodCategory;
  risk_flags?: ('high_sodium' | 'high_sugar' | 'high_fat')[];
}

export const MALAYSIAN_FOOD_ANCHORS: FoodAnchor[] = [
  // ==============================================================================
  // 1. MAMAK & HAWKER DRINKS
  // ==============================================================================
  { id: 'drink_teh_tarik', name: 'Teh Tarik', keywords: ['teh tarik', 'milk tea'], calories: 140, protein_g: 3, carbs_g: 26, fat_g: 4, sodium_mg: 50, fiber_g: 0, sugar_g: 26, source: 'MyFCD', serving_size: '1 glass', category: 'drink', risk_flags: ['high_sugar'] },
  { id: 'drink_teh_o', name: 'Teh O', keywords: ['black tea'], calories: 60, protein_g: 0, carbs_g: 15, fat_g: 0, sodium_mg: 10, fiber_g: 0, sugar_g: 15, source: 'MyFCD', serving_size: '1 glass', category: 'drink', risk_flags: ['high_sugar'] },
  { id: 'drink_teh_c', name: 'Teh C', keywords: ['evaporated milk tea'], calories: 130, protein_g: 3, carbs_g: 24, fat_g: 3, sodium_mg: 45, fiber_g: 0, sugar_g: 24, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_milo_ais', name: 'Milo Ais', keywords: ['milo', 'iced milo'], calories: 180, protein_g: 4, carbs_g: 30, fat_g: 5, sodium_mg: 45, fiber_g: 0, sugar_g: 25, source: 'MyFCD', serving_size: '1 glass', category: 'drink', risk_flags: ['high_sugar'] },
  { id: 'drink_milo_tabur', name: 'Milo Tabur', keywords: ['milo dinosaur'], calories: 250, protein_g: 5, carbs_g: 45, fat_g: 6, sodium_mg: 60, fiber_g: 0, sugar_g: 35, source: 'Manual_Audit', serving_size: '1 glass', category: 'drink', risk_flags: ['high_sugar'] },
  { id: 'drink_horlicks', name: 'Horlicks', keywords: ['hot horlicks'], calories: 145, protein_g: 3, carbs_g: 26, fat_g: 3, sodium_mg: 85, fiber_g: 0, sugar_g: 20, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_nescafe', name: 'Nescafe', keywords: ['instant coffee'], calories: 110, protein_g: 2, carbs_g: 20, fat_g: 3, sodium_mg: 38, fiber_g: 0, sugar_g: 18, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_kopi', name: 'Kopi', keywords: ['local coffee'], calories: 135, protein_g: 2, carbs_g: 24, fat_g: 4, sodium_mg: 40, fiber_g: 0, sugar_g: 22, source: 'MyFCD', serving_size: '1 cup', category: 'drink' },
  { id: 'drink_kopi_o', name: 'Kopi O', keywords: ['black coffee'], calories: 60, protein_g: 0, carbs_g: 15, fat_g: 0, sodium_mg: 10, fiber_g: 0, sugar_g: 15, source: 'MyFCD', serving_size: '1 cup', category: 'drink' },
  { id: 'drink_sirap', name: 'Sirap Ais', keywords: ['rose syrup'], calories: 120, protein_g: 0, carbs_g: 30, fat_g: 0, sodium_mg: 10, fiber_g: 0, sugar_g: 30, source: 'MyFCD', serving_size: '1 glass', category: 'drink', risk_flags: ['high_sugar'] },
  { id: 'drink_sirap_bandung', name: 'Sirap Bandung', keywords: ['bandung', 'rose milk'], calories: 180, protein_g: 3, carbs_g: 28, fat_g: 6, sodium_mg: 60, fiber_g: 0, sugar_g: 28, source: 'MyFCD', serving_size: '1 glass', category: 'drink', risk_flags: ['high_sugar'] },
  { id: 'drink_limau_ais', name: 'Limau Ais', keywords: ['lime juice'], calories: 90, protein_g: 0, carbs_g: 22, fat_g: 0, sodium_mg: 15, fiber_g: 0, sugar_g: 22, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_barley', name: 'Barley Ais', keywords: ['barley'], calories: 90, protein_g: 1, carbs_g: 22, fat_g: 0, sodium_mg: 10, fiber_g: 1, sugar_g: 15, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_fresh_orange', name: 'Fresh Orange', keywords: ['orange juice'], calories: 110, protein_g: 1, carbs_g: 26, fat_g: 0, sodium_mg: 5, fiber_g: 1, sugar_g: 20, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_apple_juice', name: 'Apple Juice', keywords: ['apple juice'], calories: 110, protein_g: 0, carbs_g: 28, fat_g: 0, sodium_mg: 5, fiber_g: 0.5, sugar_g: 24, source: 'MyFCD', serving_size: '1 glass', category: 'drink' },
  { id: 'drink_coconut_shake', name: 'Coconut Shake', keywords: ['klebang shake'], calories: 380, protein_g: 4, carbs_g: 55, fat_g: 14, sodium_mg: 120, fiber_g: 1, sugar_g: 45, source: 'Manual_Audit', serving_size: '1 cup', category: 'drink', risk_flags: ['high_sugar', 'high_fat'] },
  { id: 'drink_tealive_brown_sugar', name: 'Tealive Brown Sugar', keywords: ['boba', 'pearl milk tea'], calories: 350, protein_g: 5, carbs_g: 60, fat_g: 8, sodium_mg: 100, fiber_g: 0, sugar_g: 50, source: 'Brand_Official', serving_size: '1 cup', category: 'drink', risk_flags: ['high_sugar'] },

  // ==============================================================================
  // 2. MAIN DISHES (Rice, Noodles, Breads)
  // ==============================================================================
  { id: 'main_nasi_lemak', name: 'Nasi Lemak (Biasa)', keywords: ['nasi lemak', 'coconut rice'], calories: 644, protein_g: 13, carbs_g: 85, fat_g: 22, sodium_mg: 750, fiber_g: 2, source: 'MyFCD', serving_size: '1 plate', category: 'main', risk_flags: ['high_fat'] },
  { id: 'main_nasi_lemak_ayam', name: 'Nasi Lemak Ayam', keywords: ['nasi lemak chicken'], calories: 890, protein_g: 35, carbs_g: 92, fat_g: 38, sodium_mg: 1050, fiber_g: 3, source: 'MyFCD', serving_size: '1 plate', category: 'main', risk_flags: ['high_fat'] },
  { id: 'main_roti_canai', name: 'Roti Canai (Plain)', keywords: ['roti canai', 'prata'], calories: 301, protein_g: 7, carbs_g: 46, fat_g: 10, sodium_mg: 359, fiber_g: 2, source: 'SG_HPB', serving_size: '1 pc', category: 'main' },
  { id: 'main_roti_telur', name: 'Roti Telur', keywords: ['egg prata'], calories: 414, protein_g: 14, carbs_g: 49, fat_g: 17, sodium_mg: 560, fiber_g: 2, source: 'SG_HPB', serving_size: '1 pc', category: 'main' },
  { id: 'main_capati', name: 'Capati', keywords: ['chapati'], calories: 166, protein_g: 6, carbs_g: 32, fat_g: 1, sodium_mg: 162, fiber_g: 4, source: 'MyFCD', serving_size: '1 pc', category: 'main' },
  { id: 'main_thosai', name: 'Thosai (Plain)', keywords: ['dosa'], calories: 125, protein_g: 4, carbs_g: 24, fat_g: 2, sodium_mg: 280, fiber_g: 2, source: 'SG_HPB', serving_size: '1 pc', category: 'main' },
  { id: 'main_naan_plain', name: 'Naan (Plain)', keywords: ['naan'], calories: 280, protein_g: 7, carbs_g: 48, fat_g: 6, sodium_mg: 420, fiber_g: 2, source: 'MyFCD', serving_size: '1 pc', category: 'main' },
  { id: 'main_naan_cheese', name: 'Naan Cheese', keywords: ['cheese naan'], calories: 380, protein_g: 12, carbs_g: 54, fat_g: 14, sodium_mg: 580, fiber_g: 2, source: 'MyFCD', serving_size: '1 pc', category: 'main' },
  { id: 'main_tandoori_chicken', name: 'Tandoori Chicken', keywords: ['tandoori'], calories: 260, protein_g: 30, carbs_g: 5, fat_g: 12, sodium_mg: 480, fiber_g: 1, source: 'MyFCD', serving_size: '1 pc', category: 'main' },
  { id: 'main_char_kway_teow', name: 'Char Kway Teow', keywords: ['ckt', 'fried kway teow'], calories: 744, protein_g: 23, carbs_g: 76, fat_g: 38, sodium_mg: 1459, fiber_g: 3, source: 'SG_HPB', serving_size: '1 plate', category: 'main', risk_flags: ['high_fat', 'high_sodium'] },
  { id: 'main_mee_goreng', name: 'Mee Goreng Mamak', keywords: ['fried noodles'], calories: 660, protein_g: 23, carbs_g: 82, fat_g: 26, sodium_mg: 2185, fiber_g: 4, source: 'Research_2022', serving_size: '1 plate', category: 'main', risk_flags: ['high_sodium'] },
  { id: 'main_laksa_penang', name: 'Laksa Penang', keywords: ['asam laksa'], calories: 436, protein_g: 20, carbs_g: 65, fat_g: 10, sodium_mg: 1800, fiber_g: 4, source: 'MyFCD', serving_size: '1 bowl', category: 'main', risk_flags: ['high_sodium'] },
  { id: 'main_curry_laksa', name: 'Curry Laksa', keywords: ['curry mee', 'lemak'], calories: 556, protein_g: 22, carbs_g: 50, fat_g: 31, sodium_mg: 1600, fiber_g: 2, source: 'MyFCD', serving_size: '1 bowl', category: 'main', risk_flags: ['high_fat', 'high_sodium'] },
  { id: 'main_chicken_rice', name: 'Chicken Rice (Roasted)', keywords: ['nasi ayam'], calories: 607, protein_g: 25, carbs_g: 80, fat_g: 23, sodium_mg: 1100, fiber_g: 1, source: 'SG_HPB', serving_size: '1 plate', category: 'main' },
  { id: 'main_nasi_kandar', name: 'Nasi Kandar (Banjir)', keywords: ['nasi ganja'], calories: 850, protein_g: 35, carbs_g: 90, fat_g: 40, sodium_mg: 1400, fiber_g: 4, source: 'Manual_Audit', serving_size: '1 plate', category: 'main', risk_flags: ['high_fat'] },
  { id: 'main_nasi_goreng_kampung', name: 'Nasi Goreng Kampung', keywords: ['fried rice'], calories: 680, protein_g: 18, carbs_g: 92, fat_g: 24, sodium_mg: 1180, fiber_g: 3, source: 'MyFCD', serving_size: '1 plate', category: 'main' },
  { id: 'main_nasi_kerabu', name: 'Nasi Kerabu', keywords: ['blue rice'], calories: 520, protein_g: 16, carbs_g: 82, fat_g: 14, sodium_mg: 850, fiber_g: 6, source: 'MyFCD', serving_size: '1 plate', category: 'main' },
  
  // ==============================================================================
  // 3. FAST FOOD
  // ==============================================================================
  { id: 'ff_mcd_ayam_goreng', name: 'Ayam Goreng McD (Spicy)', keywords: ['mcd chicken'], calories: 260, protein_g: 16, carbs_g: 16, fat_g: 15, sodium_mg: 511, fiber_g: 1, source: 'Brand_Official', serving_size: '1 pc', category: 'main', risk_flags: ['high_fat'] },
  { id: 'ff_mcd_big_mac', name: 'Big Mac', keywords: ['burger'], calories: 491, protein_g: 26, carbs_g: 45, fat_g: 23, sodium_mg: 1062, fiber_g: 3, source: 'Brand_Official', serving_size: '1 burger', category: 'main' },
  { id: 'ff_kfc_chicken', name: 'KFC Chicken', keywords: ['fried chicken'], calories: 238, protein_g: 22, carbs_g: 8, fat_g: 14, sodium_mg: 800, fiber_g: 0, source: 'Brand_Official', serving_size: '1 pc', category: 'main' },
  { id: 'ff_kfc_cheezy_wedges', name: 'Cheezy Wedges', keywords: ['potato wedges'], calories: 290, protein_g: 3, carbs_g: 25, fat_g: 19, sodium_mg: 700, fiber_g: 2, source: 'Manual_Audit', serving_size: '1 serving', category: 'addon', risk_flags: ['high_fat'] },

  // ==============================================================================
  // 4. ADD-ONS (Lauk & Sides)
  // ==============================================================================
  { id: 'addon_telur_mata', name: 'Telur Mata', keywords: ['fried egg'], calories: 70, protein_g: 6, carbs_g: 0, fat_g: 5, sodium_mg: 50, fiber_g: 0, source: 'MyFCD', serving_size: '1 pc', category: 'addon' },
  { id: 'addon_telur_rebus', name: 'Telur Rebus', keywords: ['boiled egg'], calories: 60, protein_g: 6, carbs_g: 0, fat_g: 4, sodium_mg: 60, fiber_g: 0, source: 'MyFCD', serving_size: '1 pc', category: 'addon' },
  { id: 'addon_telur_masin', name: 'Telur Masin', keywords: ['salted egg'], calories: 85, protein_g: 6, carbs_g: 1, fat_g: 6, sodium_mg: 400, fiber_g: 0, source: 'MyFCD', serving_size: '1/2 pc', category: 'addon', risk_flags: ['high_sodium'] },
  { id: 'addon_sambal', name: 'Sambal (Spoon)', keywords: ['sambal', 'chili'], calories: 60, protein_g: 1, carbs_g: 5, fat_g: 4, sodium_mg: 150, fiber_g: 1, source: 'Manual_Audit', serving_size: '1 tbsp', category: 'addon', risk_flags: ['high_sodium'] },
  { id: 'addon_nasi_putih', name: 'Nasi Putih (Half)', keywords: ['rice'], calories: 100, protein_g: 2, carbs_g: 22, fat_g: 0, sodium_mg: 0, fiber_g: 0.5, source: 'MyFCD', serving_size: '1/2 cup', category: 'addon' },
  { id: 'addon_begedil', name: 'Begedil', keywords: ['potato patty'], calories: 110, protein_g: 2, carbs_g: 15, fat_g: 5, sodium_mg: 150, fiber_g: 1, source: 'MyFCD', serving_size: '1 pc', category: 'addon' },
  { id: 'addon_cheese', name: 'Cheese Slice', keywords: ['cheese'], calories: 60, protein_g: 4, carbs_g: 1, fat_g: 5, sodium_mg: 200, fiber_g: 0, source: 'Brand_Official', serving_size: '1 slice', category: 'addon' },
  { id: 'addon_papadom', name: 'Papadom (3pcs)', keywords: ['crackers'], calories: 45, protein_g: 1, carbs_g: 6, fat_g: 2, sodium_mg: 80, fiber_g: 0.5, source: 'Manual_Audit', serving_size: '3 pcs', category: 'addon' },

  // ==============================================================================
  // 5. DESSERTS (Kuih & Sweet)
  // ==============================================================================
  { id: 'dessert_karipap', name: 'Karipap', keywords: ['curry puff'], calories: 128, protein_g: 3, carbs_g: 12, fat_g: 8, sodium_mg: 150, fiber_g: 0.5, source: 'MyFCD', serving_size: '1 pc', category: 'dessert' },
  { id: 'dessert_pisang_goreng', name: 'Pisang Goreng', keywords: ['banana fritter'], calories: 130, protein_g: 1, carbs_g: 20, fat_g: 6, sodium_mg: 20, fiber_g: 1, source: 'MyFCD', serving_size: '1 pc', category: 'dessert' },
  { id: 'dessert_onde_onde', name: 'Onde-Onde', keywords: ['buah melaka'], calories: 50, protein_g: 0.5, carbs_g: 10, fat_g: 0.5, sodium_mg: 5, fiber_g: 0.5, source: 'MyFCD', serving_size: '1 pc', category: 'dessert' },
  { id: 'dessert_cendol', name: 'Cendol', keywords: ['shaved ice'], calories: 350, protein_g: 4, carbs_g: 50, fat_g: 15, sodium_mg: 50, fiber_g: 2, sugar_g: 40, source: 'Manual_Audit', serving_size: '1 bowl', category: 'dessert', risk_flags: ['high_sugar'] },
  { id: 'dessert_abc', name: 'ABC (Ais Kacang)', keywords: ['mixed ice'], calories: 380, protein_g: 5, carbs_g: 65, fat_g: 10, sodium_mg: 60, fiber_g: 3, sugar_g: 50, source: 'MyFCD', serving_size: '1 bowl', category: 'dessert', risk_flags: ['high_sugar'] },
  { id: 'dessert_kek_batik', name: 'Kek Batik', keywords: ['batik cake'], calories: 180, protein_g: 2, carbs_g: 25, fat_g: 9, sodium_mg: 50, fiber_g: 1, sugar_g: 15, source: 'Manual_Audit', serving_size: '1 slice', category: 'dessert' },
  { id: 'dessert_potong', name: 'Aiskrim Potong', keywords: ['ice cream'], calories: 110, protein_g: 2, carbs_g: 18, fat_g: 4, sodium_mg: 30, fiber_g: 0, sugar_g: 15, source: 'Brand_Official', serving_size: '1 stick', category: 'dessert' }
];

export const searchFoodDB = (query: string, category?: FoodCategory) => {
  const lowerQ = query.toLowerCase();
  return MALAYSIAN_FOOD_ANCHORS.filter(item => {
    const matchesCategory = category ? item.category === category : true;
    const matchesQuery = item.name.toLowerCase().includes(lowerQ) || item.keywords.some(k => k.includes(lowerQ));
    return matchesCategory && matchesQuery;
  });
};