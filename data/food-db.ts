// src/data/food-db.ts

export interface FoodItem {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingSize: string;
}

export const MALAYSIAN_FOOD_DB: Record<string, FoodItem> = {
  // ==========================================
  // 🇲🇾 MALAYSIAN CLASSICS (RICE & NOODLES)
  // ==========================================
  "nasi lemak": { name: "Nasi Lemak (Biasa)", calories: 389, protein: 13, carbs: 45, fat: 18, servingSize: "1 plate" },
  "nasi lemak ayam goreng": { name: "Nasi Lemak Ayam Goreng", calories: 740, protein: 35, carbs: 48, fat: 45, servingSize: "1 plate + fried chicken" },
  "nasi lemak sambal sotong": { name: "Nasi Lemak Sambal Sotong", calories: 550, protein: 28, carbs: 55, fat: 25, servingSize: "1 plate + squid" },
  "nasi lemak rendang": { name: "Nasi Lemak Rendang Daging", calories: 680, protein: 32, carbs: 48, fat: 38, servingSize: "1 plate + beef" },
  
  "nasi goreng kampung": { name: "Nasi Goreng Kampung", calories: 640, protein: 25, carbs: 80, fat: 24, servingSize: "1 plate" },
  "nasi goreng cina": { name: "Nasi Goreng Cina", calories: 580, protein: 18, carbs: 75, fat: 22, servingSize: "1 plate" },
  "nasi goreng usa": { name: "Nasi Goreng USA", calories: 750, protein: 30, carbs: 85, fat: 32, servingSize: "1 plate (with beef & egg)" },
  "nasi goreng pattaya": { name: "Nasi Goreng Pattaya", calories: 690, protein: 26, carbs: 70, fat: 34, servingSize: "1 plate (egg wrapped)" },

  "nasi ayam": { name: "Nasi Ayam (Roasted/Steamed)", calories: 620, protein: 30, carbs: 75, fat: 23, servingSize: "1 plate" },
  "nasi ayam penyet": { name: "Nasi Ayam Penyet", calories: 780, protein: 35, carbs: 65, fat: 42, servingSize: "1 set (fried chicken + sambal)" },
  
  "nasi kerabu": { name: "Nasi Kerabu (Complete)", calories: 520, protein: 25, carbs: 70, fat: 15, servingSize: "1 plate (with fish & veg)" },
  "nasi dagang": { name: "Nasi Dagang", calories: 710, protein: 28, carbs: 85, fat: 28, servingSize: "1 plate (with fish curry)" },
  "nasi kandar": { name: "Nasi Kandar (Basic)", calories: 820, protein: 40, carbs: 90, fat: 35, servingSize: "1 plate (flooded curry)" },
  "nasi tomato": { name: "Nasi Tomato + Ayam Masak Merah", calories: 650, protein: 28, carbs: 75, fat: 26, servingSize: "1 set" },

  "laksa penang": { name: "Assam Laksa (Penang)", calories: 430, protein: 18, carbs: 65, fat: 10, servingSize: "1 bowl" },
  "laksa sarawak": { name: "Sarawak Laksa", calories: 600, protein: 25, carbs: 50, fat: 32, servingSize: "1 bowl (with coconut milk)" },
  "laksa johor": { name: "Laksa Johor", calories: 550, protein: 22, carbs: 55, fat: 26, servingSize: "1 bowl (spaghetti based)" },
  "curry mee": { name: "Curry Mee / Laksa Curry", calories: 520, protein: 20, carbs: 55, fat: 26, servingSize: "1 bowl" },
  
  "mee goreng": { name: "Mee Goreng Mamak", calories: 660, protein: 22, carbs: 85, fat: 28, servingSize: "1 plate" },
  "kuey teow goreng": { name: "Char Kuey Teow", calories: 744, protein: 23, carbs: 76, fat: 38, servingSize: "1 plate" },
  "bihun goreng": { name: "Bihun Goreng", calories: 510, protein: 15, carbs: 70, fat: 18, servingSize: "1 plate" },
  "wantan mee": { name: "Wan Tan Mee (Dry)", calories: 590, protein: 22, carbs: 75, fat: 22, servingSize: "1 plate" },
  "hokkien mee": { name: "Hokkien Mee (KL Style)", calories: 680, protein: 24, carbs: 80, fat: 29, servingSize: "1 plate (dark sauce)" },

  // ==========================================
  // 🇮🇳 MAMAK & INDIAN
  // ==========================================
  "roti canai": { name: "Roti Canai (Biasa)", calories: 301, protein: 7, carbs: 46, fat: 10, servingSize: "1 piece" },
  "roti canai telur": { name: "Roti Canai Telur", calories: 414, protein: 16, carbs: 48, fat: 18, servingSize: "1 piece" },
  "roti tisu": { name: "Roti Tisu", calories: 350, protein: 5, carbs: 60, fat: 10, servingSize: "1 cone" },
  "tosai": { name: "Tosai (Plain)", calories: 180, protein: 4, carbs: 35, fat: 2, servingSize: "1 piece" },
  "capati": { name: "Capati", calories: 150, protein: 5, carbs: 25, fat: 3, servingSize: "1 piece" },
  "naan": { name: "Naan (Plain)", calories: 260, protein: 9, carbs: 45, fat: 5, servingSize: "1 piece" },
  "cheese naan": { name: "Cheese Naan", calories: 380, protein: 14, carbs: 45, fat: 16, servingSize: "1 piece" },
  "tandoori chicken": { name: "Tandoori Chicken", calories: 280, protein: 35, carbs: 5, fat: 12, servingSize: "1 piece (quarter)" },
  "banana leaf rice": { name: "Banana Leaf Rice (Vegetarian)", calories: 650, protein: 15, carbs: 100, fat: 20, servingSize: "1 set" },
  "pasembur": { name: "Pasembur / Rojak Mamak", calories: 750, protein: 20, carbs: 90, fat: 35, servingSize: "1 plate (fried items)" },

  // ==========================================
  // 🇹🇭 THAI (Common in Malaysia)
  // ==========================================
  "tom yam": { name: "Tom Yam Soup (Chicken/Seafood)", calories: 250, protein: 25, carbs: 10, fat: 12, servingSize: "1 bowl (no rice)" },
  "tom yam noodle": { name: "Tom Yam Noodle", calories: 550, protein: 25, carbs: 70, fat: 18, servingSize: "1 bowl" },
  "pad thai": { name: "Pad Thai", calories: 700, protein: 25, carbs: 85, fat: 30, servingSize: "1 plate" },
  "som tam": { name: "Som Tam (Papaya Salad)", calories: 180, protein: 5, carbs: 20, fat: 2, servingSize: "1 serving" },
  "green curry": { name: "Thai Green Curry (Chicken)", calories: 450, protein: 25, carbs: 15, fat: 32, servingSize: "1 bowl" },
  "basil chicken": { name: "Pad Kra Pao (Basil Chicken)", calories: 420, protein: 30, carbs: 10, fat: 28, servingSize: "1 serving (meat only)" },

  // ==========================================
  // 🇮🇩 INDONESIAN (Common in Malaysia)
  // ==========================================
  "bakso": { name: "Bakso (Beef Ball Soup)", calories: 450, protein: 25, carbs: 45, fat: 18, servingSize: "1 bowl" },
  "soto ayam": { name: "Soto Ayam", calories: 350, protein: 20, carbs: 30, fat: 15, servingSize: "1 bowl" },
  "gado gado": { name: "Gado-Gado", calories: 380, protein: 15, carbs: 35, fat: 20, servingSize: "1 plate (peanut sauce)" },
  "satay": { name: "Satay (Chicken/Beef)", calories: 35, protein: 4, carbs: 1, fat: 2, servingSize: "1 stick" },
  "rendang": { name: "Beef Rendang", calories: 250, protein: 22, carbs: 5, fat: 16, servingSize: "1 serving (meat only)" },

  // ==========================================
  // 🇻🇳 VIETNAMESE & WESTERN
  // ==========================================
  "pho": { name: "Vietnamese Pho (Beef)", calories: 450, protein: 25, carbs: 60, fat: 10, servingSize: "1 bowl" },
  "banh mi": { name: "Banh Mi (Chicken/Pork)", calories: 480, protein: 22, carbs: 65, fat: 16, servingSize: "1 sandwich" },
  "summer roll": { name: "Vietnamese Spring Roll (Fresh)", calories: 120, protein: 6, carbs: 20, fat: 2, servingSize: "2 rolls" },
  
  "burger": { name: "Burger (Ramly/Basic)", calories: 550, protein: 25, carbs: 45, fat: 30, servingSize: "1 burger" },
  "spaghetti bolognese": { name: "Spaghetti Bolognese", calories: 480, protein: 20, carbs: 65, fat: 15, servingSize: "1 plate" },
  "spaghetti carbonara": { name: "Spaghetti Carbonara", calories: 750, protein: 25, carbs: 60, fat: 45, servingSize: "1 plate (cream based)" },
  "fish and chips": { name: "Fish and Chips", calories: 850, protein: 35, carbs: 70, fat: 45, servingSize: "1 set" },
  "grilled chicken": { name: "Grilled Chicken Chop", calories: 520, protein: 45, carbs: 10, fat: 32, servingSize: "1 piece + salad" },

  // ==========================================
  // 🧁 KUIH-MUIH & DESSERTS
  // ==========================================
  "karipap": { name: "Karipap (Curry Puff)", calories: 130, protein: 3, carbs: 15, fat: 7, servingSize: "1 piece" },
  "kuih seri muka": { name: "Kuih Seri Muka", calories: 180, protein: 3, carbs: 30, fat: 5, servingSize: "1 piece" },
  "onde onde": { name: "Onde-Onde", calories: 60, protein: 0, carbs: 12, fat: 1, servingSize: "1 piece" },
  "pisang goreng": { name: "Pisang Goreng", calories: 120, protein: 1, carbs: 25, fat: 5, servingSize: "1 piece" },
  "cendol": { name: "Cendol", calories: 350, protein: 3, carbs: 55, fat: 12, servingSize: "1 bowl" },
  "ais kacang": { name: "ABC (Ais Kacang)", calories: 400, protein: 5, carbs: 75, fat: 8, servingSize: "1 bowl" },

  // ==========================================
  // 🥤 DRINKS (Common)
  // ==========================================
  "teh tarik": { name: "Teh Tarik", calories: 180, protein: 4, carbs: 28, fat: 6, servingSize: "1 cup" },
  "teh o ais": { name: "Teh O Ais", calories: 140, protein: 0, carbs: 35, fat: 0, servingSize: "1 glass" },
  "kopi": { name: "Kopi (with condensed milk)", calories: 160, protein: 3, carbs: 28, fat: 5, servingSize: "1 cup" },
  "kopi o": { name: "Kopi O (Sweetened)", calories: 60, protein: 1, carbs: 15, fat: 0, servingSize: "1 cup" },
  "milo ais": { name: "Milo Ais", calories: 220, protein: 6, carbs: 35, fat: 6, servingSize: "1 glass" },
  "sirap bandung": { name: "Sirap Bandung", calories: 250, protein: 4, carbs: 45, fat: 6, servingSize: "1 glass" },
};