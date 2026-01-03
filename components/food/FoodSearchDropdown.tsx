// components/food/FoodSearchDropdown.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';

interface FoodResult {
  id: string;
  name_en: string;
  name_bm?: string;
  category: string;
  serving_description: string;
  calories: number;
  calories_kcal?: number;
  carbs: number;
  carbs_g?: number;
  protein: number;
  protein_g?: number;
  diabetes_rating?: string;
  hypertension_rating?: string;
  cholesterol_rating?: string;
  ckd_rating?: string;
}

interface FoodSearchDropdownProps {
  onSelect: (food: FoodResult) => void;
  placeholder?: string;
}

const CATEGORY_ICONS: Record<string, string> = {
  'rice_dishes': '🍚',
  'rice': '🍚',
  'noodles': '🍜',
  'noodle': '🍜',
  'breads': '🍞',
  'bread': '🍞',
  'protein': '🍗',
  'meat': '🍗',
  'drinks': '🥤',
  'drink': '🥤',
  'beverage': '🥤',
  'kuih': '🧁',
  'desserts': '🍨',
  'dessert': '🍨',
  'fruits': '🍌',
  'fruit': '🍌',
  'vegetables': '🥬',
  'vegetable': '🥬',
  'fast_food': '🍔',
  'seafood': '🦐',
  'soup': '🍲',
  'default': '🍽️',
};

export function FoodSearchDropdown({ onSelect, placeholder = "Cari makanan... (cth: nasi lemak, ckt)" }: FoodSearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<FoodResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search-food?q=${encodeURIComponent(query)}&limit=8`);
        if (response.ok) {
          const data = await response.json();
          setResults(Array.isArray(data) ? data : []);
          setIsOpen(data.length > 0 || query.length > 0);
          setSelectedIndex(-1);
        }
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsLoading(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          handleSelect(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        inputRef.current?.blur();
        break;
    }
  };

  const handleSelect = (food: FoodResult) => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
    onSelect(food);
  };

  const getCategoryIcon = (category: string) => {
    return CATEGORY_ICONS[category?.toLowerCase()] || CATEGORY_ICONS['default'];
  };

  const getRatingDot = (rating?: string) => {
    switch (rating?.toLowerCase()) {
      case 'safe':
      case 'good':
        return 'bg-green-500';
      case 'caution':
      case 'moderate':
        return 'bg-yellow-500';
      case 'limit':
      case 'poor':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query && setIsOpen(true)}
          placeholder={placeholder}
          className="w-full pl-12 pr-12 py-4 text-base border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent bg-white"
          autoComplete="off"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-teal-500 animate-spin" />
        )}
        {query && !isLoading && (
          <button
            onClick={() => { setQuery(''); setResults([]); setIsOpen(false); }}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
          >
            <X className="w-4 h-4 text-gray-400" />
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl max-h-80 overflow-y-auto"
        >
          {results.length > 0 ? (
            results.map((food, index) => (
              <button
                key={food.id}
                onClick={() => handleSelect(food)}
                className={`w-full px-4 py-3 flex items-center gap-3 transition-colors ${
                  index === selectedIndex ? 'bg-teal-50' : 'hover:bg-gray-50'
                } ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                {/* Category Icon */}
                <span className="text-2xl flex-shrink-0">{getCategoryIcon(food.category)}</span>
                
                {/* Food Info */}
                <div className="flex-1 text-left min-w-0">
                  <p className="font-medium text-gray-900 truncate">{food.name_en}</p>
                  {food.name_bm && food.name_bm !== food.name_en && (
                    <p className="text-sm text-gray-500 truncate">{food.name_bm}</p>
                  )}
                  <p className="text-xs text-gray-400">
                    {food.serving_description} • {food.calories || food.calories_kcal} kcal • {food.carbs || food.carbs_g}g carbs
                  </p>
                </div>
                
                {/* Condition Rating Dots */}
                {(food.diabetes_rating || food.hypertension_rating || food.cholesterol_rating || food.ckd_rating) && (
                  <div className="flex gap-1 flex-shrink-0" title="Health ratings">
                    <span className={`w-2 h-2 rounded-full ${getRatingDot(food.diabetes_rating)}`} />
                    <span className={`w-2 h-2 rounded-full ${getRatingDot(food.hypertension_rating)}`} />
                    <span className={`w-2 h-2 rounded-full ${getRatingDot(food.cholesterol_rating)}`} />
                    <span className={`w-2 h-2 rounded-full ${getRatingDot(food.ckd_rating)}`} />
                  </div>
                )}
              </button>
            ))
          ) : query && !isLoading ? (
            <div className="px-4 py-6 text-center">
              <p className="text-gray-500">Tiada hasil untuk "{query}"</p>
              <p className="text-sm text-gray-400 mt-1">Cuba ejaan lain atau nama dalam Bahasa Malaysia</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

export default FoodSearchDropdown;

