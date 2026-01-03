'use client';

// 🇲🇾 Search Suggestions Component
// Shows helpful suggestions based on partial input or no results

import React from 'react';
import { Lightbulb } from 'lucide-react';

interface SearchSuggestionsProps {
  query: string;
  onSuggestionClick: (suggestion: string) => void;
  className?: string;
}

// Popular foods by category for quick suggestions
const SUGGESTIONS: Record<string, string[]> = {
  'nasi': ['nasi lemak', 'nasi goreng', 'nasi ayam', 'nasi campur', 'nasi briyani', 'nasi kandar'],
  'mee': ['mee goreng', 'mee rebus', 'mee kari', 'maggi goreng', 'wantan mee', 'mee hailam'],
  'roti': ['roti canai', 'roti telur', 'roti planta', 'roti john', 'roti tissue'],
  'teh': ['teh tarik', 'teh o', 'teh ais', 'teh halia', 'teh o ais limau'],
  'kopi': ['kopi o', 'kopi tarik', 'kopi ais', 'white coffee', 'kopi susu'],
  'ayam': ['ayam goreng', 'nasi ayam', 'sup ayam', 'rendang ayam', 'ayam masak merah'],
  'ikan': ['ikan bakar', 'ikan goreng', 'ikan kari', 'ikan masak asam pedas'],
  'goreng': ['mee goreng', 'nasi goreng', 'ayam goreng', 'pisang goreng', 'maggi goreng'],
  'laksa': ['laksa johor', 'laksa penang', 'curry laksa', 'asam laksa'],
  'rendang': ['rendang ayam', 'rendang daging', 'nasi lemak rendang'],
  'satay': ['satay ayam', 'satay daging', 'satay kambing'],
  'kuih': ['kuih lapis', 'kuih talam', 'onde-onde', 'kuih seri muka'],
  'cendol': ['cendol', 'ais cendol'],
  'char': ['char kuey teow', 'char siew'],
  'soup': ['bak kut teh', 'sup tulang', 'sup ayam'],
  'bak': ['bak kut teh'],
};

// Popular searches (shown when no query)
const POPULAR_SEARCHES = [
  'nasi lemak',
  'roti canai',
  'mee goreng',
  'teh tarik',
  'nasi goreng',
  'ayam goreng',
  'laksa',
  'char kuey teow',
];

// Common misspellings to correct variations
const COMMON_CORRECTIONS: Record<string, string> = {
  'chanai': 'canai',
  'chennai': 'canai',
  'tarek': 'tarik',
  'nasik': 'nasi',
  'maggie': 'maggi',
  'wan tan': 'wantan',
  'yong tau fu': 'yong tau foo',
  'char siu': 'char siew',
  'bah kut teh': 'bak kut teh',
  'chendol': 'cendol',
  'ondeh': 'onde',
  'biryani': 'briyani',
  'prata': 'roti canai',
};

export function SearchSuggestions({ 
  query, 
  onSuggestionClick,
  className = '',
}: SearchSuggestionsProps) {
  const queryLower = query.toLowerCase().trim();
  
  // Get suggestions based on query
  const getSuggestions = (): string[] => {
    if (!queryLower) {
      // No query - show popular searches
      return POPULAR_SEARCHES;
    }
    
    // Find matching suggestion groups
    const matchingSuggestions: string[] = [];
    
    // Check if query matches any category
    for (const [key, suggestions] of Object.entries(SUGGESTIONS)) {
      if (key.startsWith(queryLower) || queryLower.startsWith(key)) {
        matchingSuggestions.push(...suggestions);
      }
    }
    
    // If we found suggestions, return them
    if (matchingSuggestions.length > 0) {
      return Array.from(new Set(matchingSuggestions)).slice(0, 6);
    }
    
    // Otherwise, show popular searches
    return POPULAR_SEARCHES.slice(0, 6);
  };
  
  // Check if there's a "did you mean" suggestion
  const getDidYouMean = (): string | null => {
    if (!queryLower || queryLower.length < 3) return null;
    
    // Check for exact matches in corrections
    if (COMMON_CORRECTIONS[queryLower]) {
      return COMMON_CORRECTIONS[queryLower];
    }
    
    // Check if query contains any correctable words
    for (const [wrong, correct] of Object.entries(COMMON_CORRECTIONS)) {
      if (queryLower.includes(wrong)) {
        return queryLower.replace(wrong, correct);
      }
    }
    
    return null;
  };
  
  const suggestions = getSuggestions();
  const didYouMean = getDidYouMean();
  
  // Don't show anything if no suggestions
  if (suggestions.length === 0 && !didYouMean) {
    return null;
  }
  
  return (
    <div className={`p-3 border-t border-slate-200 bg-slate-50 ${className}`}>
      {/* Did You Mean */}
      {didYouMean && queryLower !== didYouMean && (
        <div className="mb-3 px-1">
          <p className="text-sm text-slate-600 mb-1">
            Adakah anda maksudkan / Did you mean:
          </p>
          <button
            onClick={() => onSuggestionClick(didYouMean)}
            className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline"
          >
            {didYouMean}
          </button>
        </div>
      )}
      
      {/* Suggestions */}
      <div className="flex items-center gap-2 mb-2 px-1">
        <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
        <p className="text-xs font-medium text-slate-500 uppercase">
          {queryLower ? 'Cuba cari / Try searching:' : 'Popular / Popular:'}
        </p>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1.5 text-sm bg-white hover:bg-emerald-50 text-slate-700 
                     hover:text-emerald-700 border border-slate-200 hover:border-emerald-300
                     rounded-full transition-colors duration-150"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export default SearchSuggestions;

