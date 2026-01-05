// 🔍 Smart Search API Route
// Provides intelligent food search with semantic filtering

import { NextRequest, NextResponse } from 'next/server';
import { searchFoods, SmartSearchOptions } from '@/lib/malaysian-foods';

export const dynamic = 'force-dynamic';

/**
 * GET /api/foods/smart-search
 * 
 * Query Parameters:
 * - q: Search query (required)
 * - limit: Max results (default: 20, max: 50)
 * - lowGI: Filter for low GI foods (true/false)
 * - diabeticSafe: Filter for diabetic-safe foods (true/false)
 * - hypertensionSafe: Filter for hypertension-safe foods (true/false)
 * - cholesterolSafe: Filter for cholesterol-safe foods (true/false)
 * - ckdSafe: Filter for CKD-safe foods (true/false)
 * - maxCalories: Maximum calories per serving (number)
 * - maxCarbs: Maximum carbs per serving (number)
 * - maxSodium: Maximum sodium per serving (number)
 * - category: Food category filter (string)
 * - tags: Comma-separated tags (string)
 * 
 * Examples:
 * - /api/foods/smart-search?q=nasi
 * - /api/foods/smart-search?q=low%20gi%20nasi
 * - /api/foods/smart-search?q=kuih&diabeticSafe=true&maxCalories=200
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get query parameter
    const query = searchParams.get('q')?.trim() || '';
    
    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter "q" is required' },
        { status: 400 }
      );
    }
    
    // Build search options
    const options: SmartSearchOptions = {
      query,
      limit: Math.min(
        parseInt(searchParams.get('limit') || '20'),
        50
      ),
    };
    
    // Parse boolean filters
    const lowGI = searchParams.get('lowGI');
    if (lowGI === 'true') options.lowGIOnly = true;
    
    const diabeticSafe = searchParams.get('diabeticSafe');
    if (diabeticSafe === 'true') options.diabeticSafe = true;
    
    const hypertensionSafe = searchParams.get('hypertensionSafe');
    if (hypertensionSafe === 'true') options.hypertensionSafe = true;
    
    const cholesterolSafe = searchParams.get('cholesterolSafe');
    if (cholesterolSafe === 'true') options.cholesterolSafe = true;
    
    const ckdSafe = searchParams.get('ckdSafe');
    if (ckdSafe === 'true') options.ckdSafe = true;
    
    // Parse numeric constraints
    const maxCalories = searchParams.get('maxCalories');
    if (maxCalories) {
      const parsed = parseInt(maxCalories);
      if (!isNaN(parsed) && parsed > 0) {
        options.maxCalories = parsed;
      }
    }
    
    const maxCarbs = searchParams.get('maxCarbs');
    if (maxCarbs) {
      const parsed = parseInt(maxCarbs);
      if (!isNaN(parsed) && parsed > 0) {
        options.maxCarbs = parsed;
      }
    }
    
    const maxSodium = searchParams.get('maxSodium');
    if (maxSodium) {
      const parsed = parseInt(maxSodium);
      if (!isNaN(parsed) && parsed > 0) {
        options.maxSodium = parsed;
      }
    }
    
    // Parse category filter
    const category = searchParams.get('category');
    if (category) {
      options.category = category;
    }
    
    // Parse tags filter
    const tags = searchParams.get('tags');
    if (tags) {
      options.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
    }
    
    // Log request for monitoring
    console.log('[Smart Search API] Request:', {
      query: options.query,
      filters: {
        lowGI: options.lowGIOnly,
        diabeticSafe: options.diabeticSafe,
        hypertensionSafe: options.hypertensionSafe,
        cholesterolSafe: options.cholesterolSafe,
        ckdSafe: options.ckdSafe,
      },
      constraints: {
        maxCalories: options.maxCalories,
        maxCarbs: options.maxCarbs,
        maxSodium: options.maxSodium,
      },
      category: options.category,
      tags: options.tags,
    });
    
    // Perform search
    const result = await searchFoods(options);
    
    // Log response for monitoring
    console.log('[Smart Search API] Response:', {
      resultsCount: result.results.length,
      totalCount: result.totalCount,
      appliedFilters: result.appliedFilters,
      searchTime: `${result.searchTime}ms`,
    });
    
    // Return results
    return NextResponse.json({
      success: true,
      data: {
        results: result.results,
        totalCount: result.totalCount,
        appliedFilters: result.appliedFilters,
        searchTime: result.searchTime,
      },
    });
    
  } catch (error) {
    console.error('[Smart Search API] Error:', error);
    
    // Return error response
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search foods',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

