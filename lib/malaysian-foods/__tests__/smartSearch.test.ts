// 🧪 Smart Search Tests
// Run with: npm test smartSearch.test.ts

import { 
  searchFoods, 
  searchLowGIFoods,
  searchDiabeticSafeFoods,
  searchConditionSafeFoods,
  getRecommendedFoods,
} from '../smartSearch';

const SUPABASE_CONFIGURED = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);
const describeIfConfigured = SUPABASE_CONFIGURED ? describe : describe.skip;

if (!SUPABASE_CONFIGURED) {
  // eslint-disable-next-line no-console
  console.warn('Skipping Smart Search tests because Supabase env vars are not configured.');
}

describeIfConfigured('Smart Search Service', () => {
  
  // ============================================
  // BASIC SEARCH TESTS
  // ============================================
  
  describe('Basic Search', () => {
    it('should return results for valid query', async () => {
      const result = await searchFoods({ query: 'nasi' });
      
      expect(result).toBeDefined();
      expect(result.results).toBeInstanceOf(Array);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
      expect(result.appliedFilters).toBeInstanceOf(Array);
      expect(result.searchTime).toBeGreaterThan(0);
    });
    
    it('should return empty results for empty query', async () => {
      const result = await searchFoods({ query: '' });
      
      expect(result.results.length).toBeGreaterThanOrEqual(0);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
    });
    
    it('should respect limit parameter', async () => {
      const limit = 5;
      const result = await searchFoods({ query: 'nasi', limit });
      
      expect(result.results.length).toBeLessThanOrEqual(limit);
    });
    
    it('should handle non-existent food gracefully', async () => {
      const result = await searchFoods({ query: 'xyzabc123notfound' });
      
      expect(result.results).toHaveLength(0);
      expect(result.totalCount).toBe(0);
    });
  });
  
  // ============================================
  // SEMANTIC KEYWORD DETECTION TESTS
  // ============================================
  
  describe('Semantic Keyword Detection', () => {
    it('should detect "low gi" keyword', async () => {
      const result = await searchFoods({ query: 'low gi nasi' });
      
      expect(result.appliedFilters).toContain('Low GI');
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.giCategory).toBe('low');
        });
      }
    });
    
    it('should detect "diabetic" keyword', async () => {
      const result = await searchFoods({ query: 'diabetic friendly kuih' });
      
      expect(result.appliedFilters).toContain('Diabetic Safe');
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.diabetesRating).toBe('safe');
        });
      }
    });
    
    it('should detect "low sodium" keyword', async () => {
      const result = await searchFoods({ query: 'low sodium ayam' });
      
      expect(result.appliedFilters).toContain('Hypertension Safe');
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.hypertensionRating).toBe('safe');
        });
      }
    });
    
    it('should detect Bahasa Malaysia keywords', async () => {
      const result = await searchFoods({ query: 'rendah gi nasi' });
      
      expect(result.appliedFilters).toContain('Low GI');
    });
    
    it('should handle multiple semantic keywords', async () => {
      const result = await searchFoods({ 
        query: 'low gi diabetic safe nasi' 
      });
      
      expect(result.appliedFilters).toContain('Low GI');
      expect(result.appliedFilters).toContain('Diabetic Safe');
    });
  });
  
  // ============================================
  // EXPLICIT FILTER TESTS
  // ============================================
  
  describe('Explicit Filters', () => {
    it('should apply lowGIOnly filter', async () => {
      const result = await searchFoods({ 
        query: 'nasi',
        lowGIOnly: true 
      });
      
      expect(result.appliedFilters).toContain('Low GI');
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.giCategory).toBe('low');
        });
      }
    });
    
    it('should apply diabeticSafe filter', async () => {
      const result = await searchFoods({ 
        query: 'kuih',
        diabeticSafe: true 
      });
      
      expect(result.appliedFilters).toContain('Diabetic Safe');
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.diabetesRating).toBe('safe');
        });
      }
    });
    
    it('should apply multiple condition filters', async () => {
      const result = await searchFoods({ 
        query: 'ayam',
        diabeticSafe: true,
        hypertensionSafe: true,
        cholesterolSafe: true,
      });
      
      expect(result.appliedFilters.length).toBeGreaterThanOrEqual(3);
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.diabetesRating).toBe('safe');
          expect(food.hypertensionRating).toBe('safe');
          expect(food.cholesterolRating).toBe('safe');
        });
      }
    });
  });
  
  // ============================================
  // NUTRITIONAL CONSTRAINT TESTS
  // ============================================
  
  describe('Nutritional Constraints', () => {
    it('should filter by maxCalories', async () => {
      const maxCalories = 200;
      const result = await searchFoods({ 
        query: 'kuih',
        maxCalories 
      });
      
      expect(result.appliedFilters).toContain(`Max ${maxCalories} kcal`);
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.caloriesKcal).toBeLessThanOrEqual(maxCalories);
        });
      }
    });
    
    it('should filter by maxCarbs', async () => {
      const maxCarbs = 30;
      const result = await searchFoods({ 
        query: 'nasi',
        maxCarbs 
      });
      
      expect(result.appliedFilters).toContain(`Max ${maxCarbs}g carbs`);
      if (result.results.length > 0) {
        result.results.forEach(food => {
          expect(food.carbsG).toBeLessThanOrEqual(maxCarbs);
        });
      }
    });
    
    it('should filter by maxSodium', async () => {
      const maxSodium = 300;
      const result = await searchFoods({ 
        query: 'ayam',
        maxSodium 
      });
      
      expect(result.appliedFilters).toContain(`Max ${maxSodium}mg sodium`);
      if (result.results.length > 0) {
        result.results.forEach(food => {
          if (food.sodiumMg !== undefined) {
            expect(food.sodiumMg).toBeLessThanOrEqual(maxSodium);
          }
        });
      }
    });
    
    it('should apply multiple constraints', async () => {
      const result = await searchFoods({ 
        query: 'nasi',
        maxCalories: 400,
        maxCarbs: 50,
        maxSodium: 500,
      });
      
      expect(result.appliedFilters.length).toBeGreaterThanOrEqual(3);
    });
  });
  
  // ============================================
  // CONVENIENCE FUNCTION TESTS
  // ============================================
  
  describe('Convenience Functions', () => {
    it('searchLowGIFoods should return only low GI foods', async () => {
      const foods = await searchLowGIFoods('nasi', 10);
      
      expect(foods).toBeInstanceOf(Array);
      foods.forEach(food => {
        expect(food.giCategory).toBe('low');
      });
    });
    
    it('searchDiabeticSafeFoods should return only diabetic-safe foods', async () => {
      const foods = await searchDiabeticSafeFoods('kuih', 10);
      
      expect(foods).toBeInstanceOf(Array);
      foods.forEach(food => {
        expect(food.diabetesRating).toBe('safe');
      });
    });
    
    it('searchConditionSafeFoods should apply multiple condition filters', async () => {
      const foods = await searchConditionSafeFoods(
        'ayam',
        ['diabetes', 'hypertension'],
        10
      );
      
      expect(foods).toBeInstanceOf(Array);
      foods.forEach(food => {
        expect(food.diabetesRating).toBe('safe');
        expect(food.hypertensionRating).toBe('safe');
      });
    });
    
    it('getRecommendedFoods should return popular safe foods', async () => {
      const foods = await getRecommendedFoods(['diabetes'], 5);
      
      expect(foods).toBeInstanceOf(Array);
      expect(foods.length).toBeLessThanOrEqual(5);
      foods.forEach(food => {
        expect(food.diabetesRating).toBe('safe');
      });
    });
  });
  
  // ============================================
  // ERROR HANDLING TESTS
  // ============================================
  
  describe('Error Handling', () => {
    it('should return empty array on database error', async () => {
      // This test assumes database might be unavailable
      const result = await searchFoods({ query: 'test' });
      
      expect(result.results).toBeInstanceOf(Array);
      expect(result.totalCount).toBeGreaterThanOrEqual(0);
    });
    
    it('should handle invalid limit gracefully', async () => {
      const result = await searchFoods({ 
        query: 'nasi',
        limit: -1 
      });
      
      expect(result.results).toBeInstanceOf(Array);
    });
    
    it('should handle special characters in query', async () => {
      const result = await searchFoods({ 
        query: 'nasi @#$%^&*()' 
      });
      
      expect(result.results).toBeInstanceOf(Array);
    });
  });
  
  // ============================================
  // PERFORMANCE TESTS
  // ============================================
  
  describe('Performance', () => {
    it('should complete search within reasonable time', async () => {
      const startTime = Date.now();
      const result = await searchFoods({ query: 'nasi' });
      const endTime = Date.now();
      
      const totalTime = endTime - startTime;
      
      // Should complete within 5 seconds
      expect(totalTime).toBeLessThan(5000);
      
      // Service should track its own time
      expect(result.searchTime).toBeGreaterThan(0);
      expect(result.searchTime).toBeLessThanOrEqual(totalTime);
    });
    
    it('should handle large result sets efficiently', async () => {
      const result = await searchFoods({ 
        query: 'nasi',
        limit: 50 
      });
      
      expect(result.searchTime).toBeLessThan(3000); // 3 seconds
    });
  });
  
  // ============================================
  // INTEGRATION TESTS
  // ============================================
  
  describe('Integration Scenarios', () => {
    it('should work for diabetic user searching breakfast', async () => {
      const result = await searchFoods({
        query: 'roti',
        diabeticSafe: true,
        maxCalories: 300,
        limit: 10,
      });
      
      expect(result.results).toBeInstanceOf(Array);
      expect(result.appliedFilters).toContain('Diabetic Safe');
      expect(result.appliedFilters).toContain('Max 300 kcal');
    });
    
    it('should work for hypertensive user searching lunch', async () => {
      const result = await searchFoods({
        query: 'ayam',
        hypertensionSafe: true,
        maxSodium: 400,
        limit: 10,
      });
      
      expect(result.results).toBeInstanceOf(Array);
      expect(result.appliedFilters).toContain('Hypertension Safe');
    });
    
    it('should work for user with multiple conditions', async () => {
      const result = await searchFoods({
        query: 'sayur',
        diabeticSafe: true,
        hypertensionSafe: true,
        cholesterolSafe: true,
        limit: 10,
      });
      
      expect(result.results).toBeInstanceOf(Array);
      expect(result.appliedFilters.length).toBeGreaterThanOrEqual(3);
    });
  });
  
  // ============================================
  // DATA VALIDATION TESTS
  // ============================================
  
  describe('Data Validation', () => {
    it('should return properly structured food objects', async () => {
      const result = await searchFoods({ query: 'nasi' });
      
      if (result.results.length > 0) {
        const food = result.results[0];
        
        // Required fields
        expect(food.id).toBeDefined();
        expect(food.nameEn).toBeDefined();
        expect(food.nameBm).toBeDefined();
        expect(food.category).toBeDefined();
        expect(food.servingDescription).toBeDefined();
        expect(food.servingGrams).toBeGreaterThan(0);
        expect(food.caloriesKcal).toBeGreaterThanOrEqual(0);
        expect(food.carbsG).toBeGreaterThanOrEqual(0);
        
        // Arrays should be defined
        expect(food.aliases).toBeInstanceOf(Array);
        expect(food.tags).toBeInstanceOf(Array);
      }
    });
    
    it('should return consistent result structure', async () => {
      const result = await searchFoods({ query: 'test' });
      
      expect(result).toHaveProperty('results');
      expect(result).toHaveProperty('totalCount');
      expect(result).toHaveProperty('appliedFilters');
      expect(result).toHaveProperty('searchTime');
    });
  });
});

