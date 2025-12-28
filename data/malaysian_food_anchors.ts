// src/data/malaysian_food_anchors.ts

export type SourceType = 'MyFCD' | 'SG_HPB' | 'Research_2022' | 'Manual_Audit' | 'Brand_Official';

export interface FoodAnchor {
  id: string;
  name: string;
  keywords: string[];
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  sodium_mg: number; // Critical for Renal
  fiber_g: number;
  source: SourceType;
  serving_size: string;
  risk_flags?: ('high_sodium' | 'high_sugar' | 'high_fat')[];
}

export const MALAYSIAN_FOOD_ANCHORS: FoodAnchor[] = [
  // ==============================================================================
  // 1. MAMAK & HAWKER DRINKS (The Sugar Trap)
  // ==============================================================================
  {
    id: 'drink_teh_tarik',
    name: 'Teh Tarik',
    keywords: ['teh tarik', 'milk tea', 'pulled tea'],
    calories: 83,
    protein_g: 2,
    carbs_g: 16, // Mostly sugar
    fat_g: 1.5,
    sodium_mg: 25,
    fiber_g: 0,
    source: 'MyFCD',
    serving_size: '1 glass (standard)',
    risk_flags: ['high_sugar']
  },
  {
    id: 'drink_milo_ais',
    name: 'Milo Ais',
    keywords: ['milo ais', 'iced milo', 'milo ice'],
    calories: 125,
    protein_g: 3,
    carbs_g: 22,
    fat_g: 3,
    sodium_mg: 45,
    fiber_g: 0,
    source: 'MyFCD',
    serving_size: '1 glass',
    risk_flags: ['high_sugar']
  },
  {
    id: 'drink_tealive_brown_sugar',
    name: 'Tealive Brown Sugar Milk Tea',
    keywords: ['tealive', 'brown sugar milk tea', 'boba tea'],
    calories: 350,
    protein_g: 5,
    carbs_g: 60, // ⚠️ Massive Sugar Spike
    fat_g: 8,
    sodium_mg: 100, // Est
    fiber_g: 0,
    source: 'Brand_Official', //
    serving_size: '1 cup (Regular)',
    risk_flags: ['high_sugar']
  },
   {
    id: 'drink_coconut_shake',
    name: 'Coconut Shake (with Ice Cream)',
    keywords: ['coconut shake', 'klebang shake'],
    calories: 380, // High due to sugar syrup + ice cream
    protein_g: 4,
    carbs_g: 55,
    fat_g: 14,
    sodium_mg: 120,
    fiber_g: 1,
    source: 'Manual_Audit',
    serving_size: '1 cup',
    risk_flags: ['high_sugar', 'high_fat']
  },

  // ==============================================================================
  // 2. BREAKFAST (Roti & Rice)
  // ==============================================================================
  {
    id: 'roti_canai_plain',
    name: 'Roti Canai (Plain)',
    keywords: ['roti canai', 'roti prata'],
    calories: 301, // Per piece
    protein_g: 7,
    carbs_g: 46,
    fat_g: 10,
    sodium_mg: 359,
    fiber_g: 2,
    source: 'SG_HPB',
    serving_size: '1 piece',
    risk_flags: ['high_fat']
  },
  {
    id: 'roti_telur',
    name: 'Roti Telur',
    keywords: ['roti telur', 'egg prata'],
    calories: 414,
    protein_g: 14,
    carbs_g: 49,
    fat_g: 17,
    sodium_mg: 560,
    fiber_g: 2,
    source: 'SG_HPB',
    serving_size: '1 piece',
    risk_flags: ['high_fat']
  },
  {
    id: 'capati',
    name: 'Capati',
    keywords: ['capati', 'chapati'],
    calories: 166, // Much healthier option
    protein_g: 6,
    carbs_g: 32,
    fat_g: 1,
    sodium_mg: 162,
    fiber_g: 4, // Good fiber
    source: 'MyFCD',
    serving_size: '1 piece'
  },
  {
    id: 'nasi_lemak_biasa',
    name: 'Nasi Lemak (Biasa)',
    keywords: ['nasi lemak biasa', 'nasi lemak egg anchovies'],
    calories: 644,
    protein_g: 13,
    carbs_g: 85,
    fat_g: 22,
    sodium_mg: 750, // Varies by sambal
    fiber_g: 2,
    source: 'MyFCD', //
    serving_size: '1 plate (rice + sambal + egg + ikan bilis)',
    risk_flags: ['high_fat']
  },

  // ==============================================================================
  // 3. NOODLES (The Sodium Danger Zone)
  // ==============================================================================
  {
    id: 'mee_goreng_mamak',
    name: 'Mee Goreng Mamak',
    keywords: ['mee goreng', 'fried noodles mamak'],
    calories: 660,
    protein_g: 23,
    carbs_g: 82,
    fat_g: 26,
    sodium_mg: 2185, // ⚠️ DANGER ZONE
    fiber_g: 4,
    source: 'Research_2022',
    serving_size: '1 plate',
    risk_flags: ['high_sodium', 'high_fat']
  },
  {
    id: 'char_kway_teow',
    name: 'Char Kway Teow',
    keywords: ['char kway teow', 'ckt'],
    calories: 744,
    protein_g: 23,
    carbs_g: 76,
    fat_g: 38,
    sodium_mg: 1459, //
    fiber_g: 3,
    source: 'SG_HPB',
    serving_size: '1 plate',
    risk_flags: ['high_fat', 'high_sodium']
  },
  {
    id: 'laksa_penang',
    name: 'Laksa Penang (Asam)',
    keywords: ['asam laksa', 'penang laksa'],
    calories: 436,
    protein_g: 20,
    carbs_g: 65,
    fat_g: 10, // Lower fat than curry laksa
    sodium_mg: 1800, // Very high sodium from broth
    fiber_g: 4,
    source: 'MyFCD',
    serving_size: '1 bowl',
    risk_flags: ['high_sodium']
  },
  {
    id: 'curry_laksa',
    name: 'Curry Laksa (Nyonya/Lemak)',
    keywords: ['curry laksa', 'curry mee', 'laksa lemak'],
    calories: 556, // Higher due to santan (coconut milk)
    protein_g: 22,
    carbs_g: 50,
    fat_g: 31, // High fat
    sodium_mg: 1600,
    fiber_g: 2,
    source: 'MyFCD',
    serving_size: '1 bowl',
    risk_flags: ['high_fat', 'high_sodium']
  },

  // ==============================================================================
  // 4. FAST FOOD (The "Known" Evils)
  // ==============================================================================
  // --- McDonald's Malaysia ---
  {
    id: 'ff_mcd_ayam_goreng_spicy',
    name: 'Ayam Goreng McD (Spicy)',
    keywords: ['ayam goreng mcd', 'spicy chicken mcd'],
    calories: 260, // Per piece
    protein_g: 16.2,
    carbs_g: 15.8,
    fat_g: 14.7,
    sodium_mg: 511, // Converted from 1.3g salt
    fiber_g: 1,
    source: 'Brand_Official',
    serving_size: '1 piece',
    risk_flags: ['high_fat']
  },
  {
    id: 'ff_mcd_big_mac',
    name: 'Big Mac',
    keywords: ['big mac', 'mcdonalds burger'],
    calories: 491,
    protein_g: 26,
    carbs_g: 45,
    fat_g: 23.4,
    sodium_mg: 1062, // Converted from 2.7g salt
    fiber_g: 3,
    source: 'Brand_Official',
    serving_size: '1 burger',
    risk_flags: ['high_sodium']
  },
  // --- KFC Malaysia ---
  {
    id: 'ff_kfc_original',
    name: 'KFC Original Recipe Chicken',
    keywords: ['kfc chicken', 'kfc original'],
    calories: 238, // Avg for breast/thigh
    protein_g: 22,
    carbs_g: 8,
    fat_g: 14,
    sodium_mg: 800, //
    fiber_g: 0,
    source: 'Brand_Official',
    serving_size: '1 piece'
  },
  {
    id: 'ff_kfc_cheezy_wedges',
    name: 'KFC Cheezy Wedges',
    keywords: ['cheezy wedges', 'potato wedges'],
    calories: 290,
    protein_g: 3,
    carbs_g: 25,
    fat_g: 19, // Cheese sauce adds fat
    sodium_mg: 700,
    fiber_g: 2,
    source: 'Manual_Audit',
    serving_size: '1 serving (Regular)',
    risk_flags: ['high_fat', 'high_sodium']
  },

  // ==============================================================================
  // 5. RICE DISHES & LUNCH
  // ==============================================================================
  {
    id: 'chicken_rice_roasted',
    name: 'Chicken Rice (Roasted)',
    keywords: ['chicken rice', 'roasted chicken rice'],
    calories: 607,
    protein_g: 25,
    carbs_g: 80,
    fat_g: 23,
    sodium_mg: 1100, // Soup + sauce
    fiber_g: 1,
    source: 'SG_HPB',
    serving_size: '1 plate',
    risk_flags: ['high_sodium']
  },
  {
    id: 'nasi_kerabu',
    name: 'Nasi Kerabu (Complete)',
    keywords: ['nasi kerabu'],
    calories: 360, // Surprisingly low if minimal sauce
    protein_g: 18,
    carbs_g: 55,
    fat_g: 8,
    sodium_mg: 900, // Budu sauce is salty
    fiber_g: 6, // High fiber from ulam (herbs)
    source: 'MyFCD',
    serving_size: '1 plate',
    risk_flags: ['high_sodium']
  },
  {
    id: 'nasi_kandar_basic',
    name: 'Nasi Kandar (Fried Chicken + Veg + Flood Gravy)',
    keywords: ['nasi kandar', 'nasi ganja'],
    calories: 850, // "Banjir" adds significant calories
    protein_g: 35,
    carbs_g: 90,
    fat_g: 40,
    sodium_mg: 1400,
    fiber_g: 4,
    source: 'Manual_Audit',
    serving_size: '1 plate',
    risk_flags: ['high_fat', 'high_sodium']
  },

  // ==============================================================================
  // 6. KUIH & SNACKS (The Hidden Calories)
  // ==============================================================================
  {
    id: 'kuih_curry_puff',
    name: 'Curry Puff (Karipap)',
    keywords: ['curry puff', 'karipap'],
    calories: 128, //
    protein_g: 3,
    carbs_g: 12,
    fat_g: 8,
    sodium_mg: 150,
    fiber_g: 0.5,
    source: 'MyFCD',
    serving_size: '1 piece'
  },
  {
    id: 'kuih_pisang_goreng',
    name: 'Pisang Goreng',
    keywords: ['pisang goreng', 'banana fritter'],
    calories: 129, //
    protein_g: 1,
    carbs_g: 20,
    fat_g: 6,
    sodium_mg: 20,
    fiber_g: 1,
    source: 'MyFCD',
    serving_size: '1 piece'
  },
  {
    id: 'kuih_ondeh_ondeh',
    name: 'Ondeh-Ondeh',
    keywords: ['ondeh ondeh', 'klepon'],
    calories: 50, // Per ball
    protein_g: 0.5,
    carbs_g: 10,
    fat_g: 0.5,
    sodium_mg: 5,
    fiber_g: 0.5,
    source: 'MyFCD',
    serving_size: '1 piece'
  }
];