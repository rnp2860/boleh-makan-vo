// data/food-db.ts

export interface FoodItem {
    name: string;
    calories: number; // kcal
    protein: number;  // g
    carbs: number;    // g
    fat: number;      // g
    servingSize: string;
  }
  
  // Data referenced from:
  // 1. MyNutriDiari (Ministry of Health Malaysia)
  // 2. Malaysian Food Composition Database (MyFCD)
  // 3. Singapore HPB (for shared hawker foods)
  
  export const MALAYSIAN_FOOD_DB: Record<string, FoodItem> = {
    // ==========================================
    // 1. RICE DISHES (NASI)
    // ==========================================
    "nasi lemak": {
      name: "Nasi Lemak (Biasa)",
      calories: 389,
      protein: 13, carbs: 56, fat: 12,
      servingSize: "1 plate (rice, sambal, egg, cucumber, anchovies)"
    },
    "nasi lemak ayam": {
      name: "Nasi Lemak + Ayam Goreng",
      calories: 650,
      protein: 35, carbs: 60, fat: 32,
      servingSize: "1 plate standard"
    },
    "nasi ayam": {
      name: "Nasi Ayam (Roasted)",
      calories: 600,
      protein: 30, carbs: 85, fat: 20,
      servingSize: "1 plate"
    },
    "nasi goreng kampung": {
      name: "Nasi Goreng Kampung",
      calories: 640,
      protein: 22, carbs: 75, fat: 25,
      servingSize: "1 plate"
    },
    "nasi goreng pattaya": {
      name: "Nasi Goreng Pattaya",
      calories: 780, // Heavy on oil & egg wrap
      protein: 28, carbs: 80, fat: 38,
      servingSize: "1 plate"
    },
    "nasi kandar": {
      name: "Nasi Kandar (Standard)",
      calories: 750, // Rice + 1 Curry Chicken + Veg + Mixed Gravy (Banjir)
      protein: 35, carbs: 80, fat: 35,
      servingSize: "1 plate"
    },
    "nasi kerabu": {
      name: "Nasi Kerabu (Complete)",
      calories: 510, // With fried fish & crackers
      protein: 25, carbs: 70, fat: 15,
      servingSize: "1 plate"
    },
    "nasi dagang": {
      name: "Nasi Dagang",
      calories: 550, // Glutinous rice + fish curry
      protein: 20, carbs: 75, fat: 20,
      servingSize: "1 plate"
    },
    "nasi briyani": {
      name: "Nasi Briyani (Chicken)",
      calories: 877, // Rich in ghee
      protein: 35, carbs: 90, fat: 40,
      servingSize: "1 plate"
    },
    "nasi campur": {
      name: "Nasi Campur (Economy Rice)",
      calories: 620, // 1 rice + 1 meat + 2 veg
      protein: 25, carbs: 70, fat: 25,
      servingSize: "1 plate"
    },
    "claypot chicken rice": {
      name: "Claypot Chicken Rice",
      calories: 896,
      protein: 35, carbs: 110, fat: 30,
      servingSize: "1 bowl"
    },
  
    // ==========================================
    // 2. NOODLES (MEE)
    // ==========================================
    "mee goreng mamak": {
      name: "Mee Goreng Mamak",
      calories: 660,
      protein: 20, carbs: 80, fat: 28,
      servingSize: "1 plate"
    },
    "char kuey teow": {
      name: "Char Kuey Teow",
      calories: 744,
      protein: 23, carbs: 76, fat: 38,
      servingSize: "1 plate"
    },
    "laksa penang": {
      name: "Asam Laksa (Penang)",
      calories: 432,
      protein: 20, carbs: 60, fat: 12,
      servingSize: "1 bowl"
    },
    "curry mee": {
      name: "Curry Mee (Santan)",
      calories: 550,
      protein: 18, carbs: 55, fat: 28,
      servingSize: "1 bowl"
    },
    "wantan mee": {
      name: "Wantan Mee (Dry)",
      calories: 411,
      protein: 18, carbs: 65, fat: 12,
      servingSize: "1 plate"
    },
    "hokkien mee": {
      name: "Hokkien Mee (KL Style)",
      calories: 600, // Thick dark soy sauce + lard
      protein: 20, carbs: 70, fat: 28,
      servingSize: "1 plate"
    },
    "pan mee soup": {
      name: "Pan Mee (Soup)",
      calories: 475,
      protein: 18, carbs: 60, fat: 18,
      servingSize: "1 bowl"
    },
    "bihun goreng": {
      name: "Bihun Goreng (Plain)",
      calories: 510,
      protein: 10, carbs: 70, fat: 20,
      servingSize: "1 plate"
    },
    "laksa sarawak": {
      name: "Sarawak Laksa",
      calories: 550,
      protein: 22, carbs: 50, fat: 28,
      servingSize: "1 bowl"
    },
    "mee rebus": {
      name: "Mee Rebus",
      calories: 556,
      protein: 15, carbs: 85, fat: 18,
      servingSize: "1 plate"
    },
  
    // ==========================================
    // 3. BREAD & BREAKFAST (ROTI)
    // ==========================================
    "roti canai": {
      name: "Roti Canai (Plain)",
      calories: 301,
      protein: 7, carbs: 46, fat: 10,
      servingSize: "1 piece (no curry)"
    },
    "roti telur": {
      name: "Roti Telur",
      calories: 356,
      protein: 12, carbs: 48, fat: 14,
      servingSize: "1 piece"
    },
    "tosai": {
      name: "Tosai (Plain)",
      calories: 196,
      protein: 4, carbs: 35, fat: 4,
      servingSize: "1 piece"
    },
    "capati": {
      name: "Capati",
      calories: 166,
      protein: 5, carbs: 30, fat: 3,
      servingSize: "1 piece"
    },
    "half boiled egg": {
      name: "Half Boiled Eggs (2)",
      calories: 140,
      protein: 12, carbs: 1, fat: 10,
      servingSize: "2 eggs"
    },
    "kaya toast": {
      name: "Roti Bakar Kaya Butter",
      calories: 250,
      protein: 5, carbs: 40, fat: 10,
      servingSize: "2 slices"
    },
    "murtabak": {
      name: "Murtabak (Mutton/Chicken)",
      calories: 722, // Very high
      protein: 35, carbs: 85, fat: 38,
      servingSize: "1 piece"
    },
  
    // ==========================================
    // 4. MEAT & SIDES (LAUK)
    // ==========================================
    "satay ayam": {
      name: "Satay Ayam",
      calories: 36, // Per stick
      protein: 4, carbs: 1, fat: 2,
      servingSize: "1 stick"
    },
    "satay daging": {
      name: "Satay Daging",
      calories: 45, // Per stick
      protein: 5, carbs: 1, fat: 3,
      servingSize: "1 stick"
    },
    "kuah kacang": {
      name: "Kuah Kacang (Peanut Sauce)",
      calories: 150,
      protein: 4, carbs: 12, fat: 10,
      servingSize: "1 small bowl"
    },
    "ayam goreng": {
      name: "Ayam Goreng (Fried Chicken)",
      calories: 290,
      protein: 20, carbs: 10, fat: 20,
      servingSize: "1 piece (drumstick)"
    },
    "telur mata": {
      name: "Telur Mata (Fried Egg)",
      calories: 128, // Fried in oil
      protein: 6, carbs: 1, fat: 11,
      servingSize: "1 egg"
    },
    "sambal sotong": {
      name: "Sambal Sotong",
      calories: 194,
      protein: 18, carbs: 15, fat: 8,
      servingSize: "1 small scoop"
    },
    "beef rendang": {
      name: "Beef Rendang",
      calories: 228,
      protein: 20, carbs: 5, fat: 15,
      servingSize: "2 pieces"
    },
  
    // ==========================================
    // 5. KUIH & SNACKS (MINUM PETANG)
    // ==========================================
    "karipap": {
      name: "Karipap (Curry Puff)",
      calories: 130,
      protein: 2, carbs: 15, fat: 7,
      servingSize: "1 piece"
    },
    "pisang goreng": {
      name: "Pisang Goreng",
      calories: 120,
      protein: 1, carbs: 20, fat: 5,
      servingSize: "1 piece"
    },
    "keropok lekor": {
      name: "Keropok Lekor (Fried)",
      calories: 55, // per small piece
      protein: 3, carbs: 8, fat: 2,
      servingSize: "1 piece"
    },
    "onde onde": {
      name: "Onde-Onde",
      calories: 50,
      protein: 0, carbs: 10, fat: 1,
      servingSize: "1 piece"
    },
    "kuih lapis": {
      name: "Kuih Lapis",
      calories: 132,
      protein: 2, carbs: 28, fat: 1,
      servingSize: "1 piece"
    },
    "kuih talam": {
      name: "Kuih Talam",
      calories: 150,
      protein: 3, carbs: 25, fat: 4,
      servingSize: "1 piece"
    },
    "popiah": {
      name: "Popiah (Fried)",
      calories: 188,
      protein: 5, carbs: 20, fat: 10,
      servingSize: "1 piece"
    },
    "apam balik": {
      name: "Apam Balik (Thick)",
      calories: 282,
      protein: 6, carbs: 45, fat: 10,
      servingSize: "1 piece"
    },
  
    // ==========================================
    // 6. DRINKS (AIR)
    // ==========================================
    "teh tarik": {
      name: "Teh Tarik",
      calories: 140, // Standard sweet
      protein: 3, carbs: 25, fat: 4,
      servingSize: "1 cup"
    },
    "teh o ais": {
      name: "Teh O Ais",
      calories: 80, // Sugar only
      protein: 0, carbs: 20, fat: 0,
      servingSize: "1 glass"
    },
    "kopi o": {
      name: "Kopi O (Sweetened)",
      calories: 65,
      protein: 1, carbs: 15, fat: 0,
      servingSize: "1 cup"
    },
    "milo ais": {
      name: "Milo Ais",
      calories: 170, // Milo powder + condensed milk
      protein: 4, carbs: 30, fat: 5,
      servingSize: "1 glass"
    },
    "sirap bandung": {
      name: "Sirap Bandung",
      calories: 150,
      protein: 2, carbs: 28, fat: 4,
      servingSize: "1 glass"
    },
    "kelapa muda": {
      name: "Air Kelapa (Fresh)",
      calories: 45,
      protein: 0, carbs: 10, fat: 0,
      servingSize: "1 glass"
    },
  
    // ==========================================
    // 7. FESTIVE (RAYA/CNY)
    // ==========================================
    "lemang": {
      name: "Lemang",
      calories: 100, // Per slice
      protein: 2, carbs: 15, fat: 4,
      servingSize: "1 slice"
    },
    "ketupat": {
      name: "Ketupat Nasi",
      calories: 80,
      protein: 2, carbs: 18, fat: 0,
      servingSize: "1 piece (small)"
    },
    "rendang daging": {
      name: "Rendang Daging",
      calories: 130, // Per small scoop
      protein: 15, carbs: 5, fat: 8,
      servingSize: "1 scoop (50g)"
    },
    "kuih tart": {
      name: "Pineapple Tart",
      calories: 50,
      protein: 0, carbs: 8, fat: 2,
      servingSize: "1 piece"
    },
    "bak kwa": {
      name: "Bak Kwa (Dried Meat)",
      calories: 180, // High sugar/fat
      protein: 10, carbs: 15, fat: 8,
      servingSize: "1 slice"
    },
    "yee sang": {
      name: "Yee Sang",
      calories: 350, // Including plum sauce & oil
      protein: 5, carbs: 50, fat: 15,
      servingSize: "1 small portion"
    },
    "mooncake": {
      name: "Mooncake (Lotus)",
      calories: 790, // Whole cake
      protein: 10, carbs: 120, fat: 35,
      servingSize: "1 whole cake"
    },
  
    // ==========================================
    // 8. FRUITS (BUAH)
    // ==========================================
    "durian": {
      name: "Durian",
      calories: 147, // Per ulas (seed)
      protein: 2, carbs: 27, fat: 5,
      servingSize: "1 seed"
    },
    "rambutan": {
      name: "Rambutan",
      calories: 7,
      protein: 0, carbs: 2, fat: 0,
      servingSize: "1 fruit"
    },
    "manggis": {
      name: "Manggis (Mangosteen)",
      calories: 73, // Per 100g
      protein: 1, carbs: 18, fat: 0,
      servingSize: "1 serving (100g)"
    },
    "cempedak goreng": {
      name: "Cempedak Goreng",
      calories: 120, // Fried batter adds cals
      protein: 2, carbs: 20, fat: 5,
      servingSize: "1 piece"
    }
  };