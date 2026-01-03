-- 🇲🇾 Improved Malaysian Food Search - Better Fuzzy Matching
-- Migration: Enhanced search function for compound dishes and partial matching

-- Drop old function
DROP FUNCTION IF EXISTS search_malaysian_foods(TEXT, INTEGER);

-- Enhanced search function with better fuzzy matching
CREATE OR REPLACE FUNCTION search_malaysian_foods(search_term TEXT, limit_count INTEGER DEFAULT 20)
RETURNS SETOF malaysian_foods AS $$
DECLARE
  search_lower TEXT := LOWER(TRIM(search_term));
  search_words TEXT[];
BEGIN
  -- Split search term into words for flexible matching
  search_words := regexp_split_to_array(search_lower, '\s+');
  
  RETURN QUERY
  SELECT *
  FROM malaysian_foods
  WHERE 
    -- Priority 1: Exact match (highest priority)
    LOWER(name_en) = search_lower
    OR LOWER(name_bm) = search_lower
    OR search_lower = ANY(SELECT LOWER(unnest(aliases)))
    
    -- Priority 2: Starts with search term
    OR LOWER(name_en) LIKE search_lower || '%'
    OR LOWER(name_bm) LIKE search_lower || '%'
    
    -- Priority 3: Contains all search words (any order) - KEY IMPROVEMENT
    OR (
      search_words <@ regexp_split_to_array(LOWER(name_en), '\s+')
      OR search_words <@ regexp_split_to_array(LOWER(name_bm), '\s+')
      OR (
        SELECT COUNT(*) = array_length(search_words, 1)
        FROM unnest(search_words) word
        WHERE LOWER(name_en) LIKE '%' || word || '%'
      )
      OR (
        SELECT COUNT(*) = array_length(search_words, 1)
        FROM unnest(search_words) word
        WHERE LOWER(name_bm) LIKE '%' || word || '%'
      )
    )
    
    -- Priority 4: Contains search term
    OR LOWER(name_en) LIKE '%' || search_lower || '%'
    OR LOWER(name_bm) LIKE '%' || search_lower || '%'
    
    -- Priority 5: Alias partial match
    OR EXISTS (
      SELECT 1 FROM unnest(aliases) alias
      WHERE LOWER(alias) LIKE '%' || search_lower || '%'
    )
    
    -- Priority 6: Any individual word matches
    OR EXISTS (
      SELECT 1 FROM unnest(search_words) word
      WHERE LOWER(name_en) LIKE '%' || word || '%'
         OR LOWER(name_bm) LIKE '%' || word || '%'
    )
    
    -- Priority 7: Full-text search (fallback)
    OR to_tsvector('english', name_en) @@ plainto_tsquery('english', search_term)
    OR to_tsvector('simple', name_bm) @@ plainto_tsquery('simple', search_term)
  
  ORDER BY 
    -- Ranking logic (lower = higher priority)
    CASE 
      -- Exact matches (highest)
      WHEN LOWER(name_en) = search_lower OR LOWER(name_bm) = search_lower THEN 1
      WHEN search_lower = ANY(SELECT LOWER(unnest(aliases))) THEN 2
      
      -- Starts with (very high)
      WHEN LOWER(name_en) LIKE search_lower || '%' OR LOWER(name_bm) LIKE search_lower || '%' THEN 3
      
      -- All words present (compound dish matching)
      WHEN (
        SELECT COUNT(*) = array_length(search_words, 1)
        FROM unnest(search_words) word
        WHERE LOWER(name_en) LIKE '%' || word || '%' OR LOWER(name_bm) LIKE '%' || word || '%'
      ) THEN 4
      
      -- Contains search term
      WHEN LOWER(name_en) LIKE '%' || search_lower || '%' OR LOWER(name_bm) LIKE '%' || search_lower || '%' THEN 5
      
      -- Alias match
      WHEN EXISTS (
        SELECT 1 FROM unnest(aliases) alias
        WHERE LOWER(alias) LIKE '%' || search_lower || '%'
      ) THEN 6
      
      -- Individual word matches
      ELSE 7
    END,
    -- Secondary sort: popularity
    popularity_score DESC,
    -- Tertiary sort: name
    name_en ASC
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Add index for better performance on lowercase searches
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_name_en_lower ON malaysian_foods(LOWER(name_en));
CREATE INDEX IF NOT EXISTS idx_malaysian_foods_name_bm_lower ON malaysian_foods(LOWER(name_bm));

-- Create function to calculate word match score (helper for client-side ranking)
CREATE OR REPLACE FUNCTION food_search_score(
  food_name_en TEXT,
  food_name_bm TEXT,
  food_aliases TEXT[],
  search_query TEXT
) RETURNS INTEGER AS $$
DECLARE
  score INTEGER := 0;
  query_lower TEXT := LOWER(TRIM(search_query));
  search_words TEXT[];
  word TEXT;
  matching_words INTEGER := 0;
BEGIN
  search_words := regexp_split_to_array(query_lower, '\s+');
  
  -- Exact match (highest score)
  IF LOWER(food_name_en) = query_lower OR LOWER(food_name_bm) = query_lower THEN
    RETURN 1000;
  END IF;
  
  -- Starts with query
  IF LOWER(food_name_en) LIKE query_lower || '%' OR LOWER(food_name_bm) LIKE query_lower || '%' THEN
    score := score + 500;
  END IF;
  
  -- All words present (compound matching)
  FOREACH word IN ARRAY search_words LOOP
    IF LOWER(food_name_en) LIKE '%' || word || '%' OR LOWER(food_name_bm) LIKE '%' || word || '%' THEN
      matching_words := matching_words + 1;
    END IF;
  END LOOP;
  
  IF matching_words = array_length(search_words, 1) THEN
    score := score + 300;
  END IF;
  
  -- Individual word matches
  score := score + (matching_words * 50);
  
  -- Alias match
  IF EXISTS (
    SELECT 1 FROM unnest(food_aliases) alias
    WHERE LOWER(alias) = query_lower OR LOWER(alias) LIKE '%' || query_lower || '%'
  ) THEN
    score := score + 200;
  END IF;
  
  RETURN score;
END;
$$ LANGUAGE plpgsql IMMUTABLE;

COMMENT ON FUNCTION search_malaysian_foods IS 'Enhanced search with fuzzy matching for compound dishes, partial words, and flexible word order';
COMMENT ON FUNCTION food_search_score IS 'Helper function to calculate relevance score for search results';

