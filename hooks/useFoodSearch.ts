// 🇲🇾 Malaysian Food Search Hook

import { useState, useEffect, useCallback, useRef } from 'react';
import { MalaysianFood, FoodCategory } from '@/lib/malaysian-foods/types';

interface UseFoodSearchOptions {
  debounceMs?: number;
  minQueryLength?: number;
  limit?: number;
  category?: FoodCategory;
  tag?: string;
}

interface UseFoodSearchResult {
  query: string;
  setQuery: (query: string) => void;
  results: MalaysianFood[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => Promise<void>;
  clearResults: () => void;
}

const RECENT_FOODS_KEY = 'boleh_makan_recent_foods';
const MAX_RECENT_FOODS = 10;

export function useFoodSearch(options: UseFoodSearchOptions = {}): UseFoodSearchResult {
  const {
    debounceMs = 300,
    minQueryLength = 2,
    limit = 20,
    category,
    tag,
  } = options;
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<MalaysianFood[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  
  const search = useCallback(async (searchQuery: string) => {
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    if (searchQuery.length < minQueryLength) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    try {
      const params = new URLSearchParams({
        q: searchQuery,
        limit: String(limit),
      });
      
      if (category) params.set('category', category);
      if (tag) params.set('tag', tag);
      
      const response = await fetch(`/api/foods/search?${params}`, {
        signal: controller.signal,
      });
      
      if (!response.ok) {
        throw new Error('Search failed');
      }
      
      const data = await response.json();
      setResults(data.foods || []);
      
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return; // Ignore aborted requests
      }
      console.error('Food search error:', err);
      setError('Gagal mencari makanan. Sila cuba lagi.');
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [minQueryLength, limit, category, tag]);
  
  // Debounced search on query change
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    if (query.length >= minQueryLength) {
      debounceRef.current = setTimeout(() => {
        search(query);
      }, debounceMs);
    } else {
      setResults([]);
    }
    
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, search, debounceMs, minQueryLength]);
  
  const clearResults = useCallback(() => {
    setQuery('');
    setResults([]);
    setError(null);
  }, []);
  
  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
    search,
    clearResults,
  };
}

// Hook to get popular foods
export function usePopularFoods(limit: number = 10, condition?: string) {
  const [foods, setFoods] = useState<MalaysianFood[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const params = new URLSearchParams({ limit: String(limit) });
        if (condition) params.set('condition', condition);
        
        const response = await fetch(`/api/foods/popular?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to get popular foods');
        }
        
        const data = await response.json();
        setFoods(data.foods || []);
        
      } catch (err) {
        console.error('Get popular foods error:', err);
        setError('Gagal memuatkan makanan popular');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPopular();
  }, [limit, condition]);
  
  return { foods, isLoading, error };
}

// Hook to get food categories
export function useFoodCategories() {
  const [categories, setCategories] = useState<Array<{
    id: FoodCategory;
    labelEn: string;
    labelBm: string;
    icon: string;
    count: number;
  }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/foods/categories');
        
        if (!response.ok) {
          throw new Error('Failed to get categories');
        }
        
        const data = await response.json();
        setCategories(data.categories || []);
        
      } catch (err) {
        console.error('Get categories error:', err);
        setError('Gagal memuatkan kategori');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return { categories, isLoading, error };
}

// ============================================
// RECENT FOODS HELPERS
// ============================================

export function getRecentFoods(): MalaysianFood[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(RECENT_FOODS_KEY);
    if (!stored) return [];
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function addRecentFood(food: MalaysianFood): void {
  if (typeof window === 'undefined') return;
  
  try {
    const recent = getRecentFoods();
    
    // Remove if already exists
    const filtered = recent.filter(f => f.id !== food.id);
    
    // Add to front
    const updated = [food, ...filtered].slice(0, MAX_RECENT_FOODS);
    
    localStorage.setItem(RECENT_FOODS_KEY, JSON.stringify(updated));
  } catch {
    // Ignore storage errors
  }
}

export function clearRecentFoods(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(RECENT_FOODS_KEY);
}

