// src/utils/foodSearch.ts
import { MALAYSIAN_FOOD_ANCHORS, FoodAnchor } from '../data/malaysian_food_anchors';

/**
 * The "Anchor Search" Algorithm.
 * It takes a messy user string (e.g., "mamak fried noodles")
 * and tries to find a verified match in our "Truth File".
 */
export function findFoodAnchor(query: string): FoodAnchor | null {
  // 1. Clean the input (lowercase, trim spaces)
  const cleanQuery = query.toLowerCase().trim();

  // 2. Exact Match Check (Best Case)
  const exactMatch = MALAYSIAN_FOOD_ANCHORS.find(food => 
    food.name.toLowerCase() === cleanQuery || 
    food.keywords.includes(cleanQuery)
  );
  if (exactMatch) return exactMatch;

  // 3. Fuzzy Match Check (Good Case)
  // If the query is "penang laksa", it should match "Laksa Penang (Asam)"
  const fuzzyMatch = MALAYSIAN_FOOD_ANCHORS.find(food => {
    // Check if any keyword is INSIDE the query string
    // e.g., query "eating nasi lemak" contains keyword "nasi lemak"
    return food.keywords.some(keyword => cleanQuery.includes(keyword));
  });

  if (fuzzyMatch) return fuzzyMatch;

  // 4. No Match Found -> We will let AI estimate it later
  return null;
}