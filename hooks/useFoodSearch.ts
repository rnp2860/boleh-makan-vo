'use client';

// 🇲🇾 Malaysian Food Search Hook

import { useState, useEffect, useCallback, useRef } from 'react';
import type { FoodSearchResult } from '@/types/food';

interface UseFoodSearchResult {
  results: FoodSearchResult[];
  isLoading: boolean;
  error: string | null;
  search: (query: string) => void;
  clearResults: () => void;
  recentSearches: FoodSearchResult[];
}

const RECENT_SEARCHES_KEY = 'boleh_makan_recent_foods';
const RECENT_SEARCHES_LIMIT = 5;

export function useFoodSearch(): UseFoodSearchResult {
  const [results, setResults] = useState<FoodSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSearches, setRecentSearches] = useState<FoodSearchResult[]>([]);
  
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);
  const abortController = useRef<AbortController | null>(null);
  
  // Load recent searches from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      }
    } catch (err) {
      console.error('Failed to load recent searches:', err);
    }
  }, []);
  
  const saveToRecentSearches = useCallback((food: FoodSearchResult) => {
    setRecentSearches(prev => {
      // Remove if already exists
      const filtered = prev.filter(f => f.id !== food.id);
      // Add to front
      const updated = [food, ...filtered].slice(0, RECENT_SEARCHES_LIMIT);
      
      // Save to localStorage
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to save recent searches:', err);
      }
      
      return updated;
    });
  }, []);
  
  const search = useCallback((query: string) => {
    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    
    // Cancel previous request
    if (abortController.current) {
      abortController.current.abort();
    }
    
    // Clear results if query is too short
    if (!query || query.trim().length < 2) {
      setResults([]);
      setError(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Debounce the search
    debounceTimer.current = setTimeout(async () => {
      try {
        abortController.current = new AbortController();
        
        const params = new URLSearchParams({
          q: query.trim(),
          limit: '20',
        });
        
        const response = await fetch(`/api/foods/search?${params}`, {
          signal: abortController.current.signal,
        });
        
        if (!response.ok) {
          throw new Error('Search failed');
        }
        
        const data = await response.json();
        setResults(data.results || []);
        
      } catch (err: any) {
        if (err.name === 'AbortError') {
          // Request was cancelled, ignore
          return;
        }
        console.error('Search error:', err);
        setError('Gagal mencari makanan / Failed to search foods');
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);
  
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
    setIsLoading(false);
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
      if (abortController.current) {
        abortController.current.abort();
      }
    };
  }, []);
  
  return {
    results,
    isLoading,
    error,
    search,
    clearResults,
    recentSearches,
  };
}

// Hook for fetching individual food details
export function useFoodDetail(foodId: string | null) {
  const [food, setFood] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!foodId) {
      setFood(null);
      return;
    }
    
    const fetchFood = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/foods/${foodId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch food details');
        }
        
        const data = await response.json();
        setFood(data);
        
        // Increment popularity
        fetch(`/api/foods/${foodId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'increment_popularity' }),
        }).catch(err => console.error('Failed to increment popularity:', err));
        
      } catch (err) {
        console.error('Food detail error:', err);
        setError('Gagal memuatkan maklumat / Failed to load details');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchFood();
  }, [foodId]);
  
  return { food, isLoading, error };
}
