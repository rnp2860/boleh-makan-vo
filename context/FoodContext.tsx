// src/context/FoodContext.tsx
'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// 1. INIT SUPABASE
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 2. TYPES
type Meal = {
  id: string;
  name: string; 
  image?: string; 
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  sodium: number;
  sugar: number;
  timestamp: Date; 
  
  // New Columns
  analysis_data?: any; 
  actionable_advice?: string[]; // Added this to type
  components?: string[];
  
  // Calculated flags (Client-side logic)
  isHighSodium: boolean;
  isHighSugar: boolean;
};

type UserProfile = {
  name: string;
  healthConditions: string[];
  goal: string;
  details: {
    age: number;
    height: number;
    weight: number;
    gender: 'male' | 'female';
    activity: 'sedentary' | 'light' | 'moderate' | 'active';
  },
  manualOverride: number | null; 
};

type FoodContextType = {
  meals: Meal[];
  addMeal: (scanResult: any, imageSrc?: string) => Promise<void>; 
  deleteMeal: (id: string) => Promise<void>; 
  stats: { calories: number; protein: number; sodium: number; sugar: number };
  userProfile: UserProfile | null;
  toggleCondition: (condition: string) => void;
  setGoal: (goal: string) => void;
  updateDetails: (details: Partial<UserProfile['details']>) => void;
  setManualOverride: (val: number | null) => void;
  setUserName: (name: string) => void;
  dailyBudget: number;
  getWeeklyStats: () => { day: string; calories: number; budget: number; protein: number; carbs: number; fat: number }[];
  streak: number;
  isLoaded: boolean;
};

const FoodContext = createContext<FoodContextType | undefined>(undefined);

export const FoodProvider = ({ children }: { children: React.ReactNode }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Default Profile (Kept in LocalStorage for now)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: '',
    healthConditions: [],
    goal: 'maintain',
    details: { age: 0, height: 0, weight: 0, gender: 'male', activity: 'sedentary' },
    manualOverride: null 
  });

  // 🆔 Get or create unique user ID for multi-user support
  const getUserId = () => {
    if (typeof window === 'undefined') return null;
    let userId = localStorage.getItem('boleh_makan_user_id');
    if (!userId) {
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(7)}`;
      localStorage.setItem('boleh_makan_user_id', userId);
    }
    return userId;
  };

  // 🔄 FETCH DATA FROM SUPABASE ON MOUNT
  useEffect(() => {
    const loadData = async () => {
      // 1. Load Profile from LocalStorage (Settings)
      const savedProfile = localStorage.getItem('vitality_profile');
      if (savedProfile) {
        setUserProfile(JSON.parse(savedProfile));
      }

      // 🆔 Get current user's ID
      const userId = getUserId();

      // 2. Load Meals from Supabase (Data) - Try filtered by user_id first
      let data, error;
      
      if (userId) {
        // Try fetching with user_id filter for multi-user support
        const result = await supabase
          .from('food_logs')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
        
        // If user_id column doesn't exist, fetch all (single-user fallback)
        if (result.error && result.error.message?.includes('user_id')) {
          console.warn('user_id column not found. Using single-user mode. To enable multi-user, run: ALTER TABLE food_logs ADD COLUMN user_id TEXT;');
          const fallbackResult = await supabase
            .from('food_logs')
            .select('*')
            .order('created_at', { ascending: false });
          data = fallbackResult.data;
          error = fallbackResult.error;
        } else {
          data = result.data;
          error = result.error;
        }
      } else {
        // No user_id, fetch all
        const result = await supabase
          .from('food_logs')
          .select('*')
          .order('created_at', { ascending: false });
        data = result.data;
        error = result.error;
      }

      if (error) {
        console.error('Error fetching meals:', error);
      } else if (data) {
        // Map Database Columns -> App Meal Type
        const parsedMeals: Meal[] = data.map((row: any) => ({
          id: row.id,
          // 👇 UPDATED: Checks meal_name first (your DB column), then food_name (legacy)
          name: row.meal_name || row.food_name || 'Unknown Meal',
          image: row.image_url,
          calories: row.calories || 0,
          protein: row.protein || 0,
          carbs: row.carbs || 0,
          fat: row.fat || 0,
          sodium: row.sodium || 0,
          sugar: row.sugar || 0,
          timestamp: new Date(row.created_at),
          analysis_data: row.analysis_data, // Dr. Reza Text
          actionable_advice: row.actionable_advice, // Quick Tips
          components: row.components,       // Tags
          
          isHighSodium: (row.sodium || 0) > 800,
          isHighSugar: (row.sugar || 0) > 20,
        }));
        setMeals(parsedMeals);
      }
      
      setIsLoaded(true);
    };

    loadData();
  }, []);

  // 💾 SAVE PROFILE ON CHANGE (Local Only)
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('vitality_profile', JSON.stringify(userProfile));
    }
  }, [userProfile, isLoaded]);


  // 🚀 ADD MEAL (Uploads to Supabase)
  const addMeal = async (scanResult: any, imageSrc?: string) => {
    try {
      let publicImageUrl = null;

      // 1. Upload Image (If exists)
      if (imageSrc && imageSrc.startsWith('data:')) {
        const fileName = `meal_${Date.now()}.jpg`;
        // Convert Base64 to Blob
        const res = await fetch(imageSrc);
        const blob = await res.blob();

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meal_images')
          .upload(fileName, blob);

        if (uploadError) {
          console.error('Upload error:', uploadError);
        } else if (uploadData) {
          // Get Public URL
          const { data: urlData } = supabase.storage
            .from('meal_images')
            .getPublicUrl(uploadData.path);
          publicImageUrl = urlData.publicUrl;
        }
      }

      // 2. Prepare Data
      const macros = scanResult.data.macros;
      const componentList = [
        ...(scanResult.data.components || []).map((c: any) => c.name),
        ...(scanResult.data.customItems || []).map((c: any) => c.name)
      ];
      const finalComponents = scanResult.components || componentList;

      // 3. Insert into Database - WITH USER_ID (fallback without if column doesn't exist)
      const mealData: any = {
        meal_name: scanResult.data.food_name,
        calories: macros.calories,
        protein: macros.protein_g,
        carbs: macros.carbs_g,
        fat: macros.fat_g,
        sodium: macros.sodium_mg || 0,
        sugar: macros.sugar_g || 0,
        image_url: publicImageUrl, 
        analysis_data: scanResult.data.analysis_content,
        actionable_advice: scanResult.data.actionable_advice,
        components: finalComponents
      };

      // Try with user_id first for multi-user support
      const userId = getUserId();
      if (userId) {
        mealData.user_id = userId;
      }

      let { data, error } = await supabase
        .from('food_logs')
        .insert([mealData])
        .select()
        .single();

      // If user_id column doesn't exist, retry without it
      if (error && error.message?.includes('user_id')) {
        console.warn('user_id column not found in database. Saving without user_id. Run SQL: ALTER TABLE food_logs ADD COLUMN user_id TEXT;');
        delete mealData.user_id;
        const retryResult = await supabase
          .from('food_logs')
          .insert([mealData])
          .select()
          .single();
        data = retryResult.data;
        error = retryResult.error;
      }

      if (error) {
        console.error("Supabase insert error:", error);
        throw new Error(`Database error: ${error.message || error.code || 'Unknown error'}`);
      }

      // 4. Update UI Optimistically (or using returned data)
      if (data) {
        const newMeal: Meal = {
          id: data.id,
          name: data.meal_name || data.food_name, // Handle return name
          image: data.image_url,
          calories: data.calories,
          protein: data.protein,
          carbs: data.carbs,
          fat: data.fat,
          sodium: data.sodium,
          sugar: data.sugar,
          timestamp: new Date(data.created_at),
          analysis_data: data.analysis_data,
          actionable_advice: data.actionable_advice,
          components: data.components,
          isHighSodium: (data.sodium || 0) > 800,
          isHighSugar: (data.sugar || 0) > 20,
        };
        setMeals((prev) => [newMeal, ...prev]);
        console.log('✅ Meal saved successfully:', newMeal.name);
      }

    } catch (err: any) {
      console.error("Failed to save meal:", err);
      // Show more detailed error message
      const errorMsg = err?.message || 'Unknown error';
      alert(`Failed to save meal: ${errorMsg}`);
    }
  };

  // 🗑️ DELETE MEAL
  const deleteMeal = async (id: string) => {
    // 1. Delete from DB
    const { error } = await supabase
      .from('food_logs')
      .delete()
      .eq('id', id);

    if (error) {
      console.error("Delete failed:", error);
      alert("Could not delete meal.");
      return;
    }

    // 2. Update UI
    setMeals((prev) => prev.filter(meal => meal.id !== id));
  };

  // ... (Keep existing Profile helpers logic identical) ...
  const toggleCondition = (condition: string) => {
    setUserProfile(prev => {
      const exists = prev.healthConditions.includes(condition);
      return { ...prev, healthConditions: exists ? prev.healthConditions.filter(c => c !== condition) : [...prev.healthConditions, condition] };
    });
  };
  const setGoal = (goal: string) => setUserProfile(prev => ({ ...prev, goal }));
  const updateDetails = (details: Partial<UserProfile['details']>) => setUserProfile(prev => ({ ...prev, details: { ...prev.details, ...details } }));
  const setManualOverride = (val: number | null) => setUserProfile(prev => ({ ...prev, manualOverride: val }));
  const setUserName = (name: string) => setUserProfile(prev => ({ ...prev, name }));

  // CALCULATE BUDGET
  const calculateBudget = () => {
    if (userProfile.manualOverride && userProfile.manualOverride > 0) return userProfile.manualOverride;
    const { age, height, weight, gender, activity } = userProfile.details;
    if (!weight) return 2000;

    let bmr = (10 * weight) + (6.25 * height) - (5 * age);
    bmr += (gender === 'male' ? 5 : -161);
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725 };
    const tdee = bmr * multipliers[activity];

    if (userProfile.goal === 'lose_weight') return Math.round(tdee - 500);
    if (userProfile.goal === 'build_muscle') return Math.round(tdee + 300);
    return Math.round(tdee);
  };

  const dailyBudget = calculateBudget();

  // 📊 GET TODAY'S STATS
  const stats = meals.filter(m => {
    const today = new Date();
    return m.timestamp.getDate() === today.getDate() && 
           m.timestamp.getMonth() === today.getMonth() &&
           m.timestamp.getFullYear() === today.getFullYear();
  }).reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    sodium: acc.sodium + meal.sodium,
    sugar: acc.sugar + meal.sugar,
  }), { calories: 0, protein: 0, sodium: 0, sugar: 0 });

  // 📈 WEEKLY CHART DATA
  const getWeeklyStats = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      
      const dayMeals = meals.filter(m => 
        m.timestamp.getDate() === d.getDate() && 
        m.timestamp.getMonth() === d.getMonth()
      );
      
      const totalCal = dayMeals.reduce((sum, m) => sum + m.calories, 0);
      const totalProtein = dayMeals.reduce((sum, m) => sum + (m.protein || 0), 0);
      const totalCarbs = dayMeals.reduce((sum, m) => sum + (m.carbs || 0), 0);
      const totalFat = dayMeals.reduce((sum, m) => sum + (m.fat || 0), 0);
      
      days.push({
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        calories: totalCal,
        budget: dailyBudget,
        protein: totalProtein,
        carbs: totalCarbs,
        fat: totalFat
      });
    }
    return days;
  };

  // 🔥 STREAK CALCULATION
  const calculateStreak = () => {
    const today = new Date().toDateString();
    const hasLoggedToday = meals.some(m => m.timestamp.toDateString() === today);
    return hasLoggedToday ? 1 : 0; 
  };

  return (
    <FoodContext.Provider value={{ 
      meals, addMeal, deleteMeal, stats, userProfile, 
      toggleCondition, setGoal, updateDetails, setManualOverride, setUserName, 
      dailyBudget, getWeeklyStats, streak: calculateStreak(), isLoaded 
    }}>
      {children}
    </FoodContext.Provider>
  );
};

export const useFood = () => {
  const context = useContext(FoodContext);
  if (!context) throw new Error('useFood must be used within a FoodProvider');
  return context;
};