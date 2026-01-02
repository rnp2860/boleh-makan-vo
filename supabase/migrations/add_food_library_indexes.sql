-- Add indexes to food_library table for efficient fuzzy search
-- These indexes significantly improve search performance

-- Enable trigram extension for fuzzy search (if not enabled)
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create GIN index for trigram-based fuzzy search on name
-- This enables efficient ILIKE searches with wildcards
CREATE INDEX IF NOT EXISTS idx_food_library_name_trgm ON food_library USING gin(name gin_trgm_ops);

-- Create index on lowercase name for case-insensitive exact matches
CREATE INDEX IF NOT EXISTS idx_food_library_name_lower ON food_library(lower(name));

-- Create index on category for filtering
CREATE INDEX IF NOT EXISTS idx_food_library_category ON food_library(category);

-- Create index on tags for filtering
CREATE INDEX IF NOT EXISTS idx_food_library_tags ON food_library(tags);

-- Create index on source for analytics
CREATE INDEX IF NOT EXISTS idx_food_library_source ON food_library(source);

-- Composite index for common query patterns
CREATE INDEX IF NOT EXISTS idx_food_library_name_category ON food_library(lower(name), category);

-- Comments for documentation
COMMENT ON INDEX idx_food_library_name_trgm IS 'Trigram index for fuzzy text search on food names';
COMMENT ON INDEX idx_food_library_name_lower IS 'Case-insensitive exact match index';
COMMENT ON INDEX idx_food_library_category IS 'Filter by food category';
COMMENT ON INDEX idx_food_library_tags IS 'Filter by tags (cuisine type, dietary info)';

-- Example queries that benefit from these indexes:

-- Exact match (uses idx_food_library_name_lower)
-- SELECT * FROM food_library WHERE lower(name) = lower('Nasi Lemak');

-- Fuzzy match (uses idx_food_library_name_trgm)
-- SELECT * FROM food_library WHERE name ILIKE '%nasi%' ORDER BY similarity(name, 'Nasi Lemak') DESC LIMIT 10;

-- Category filter (uses idx_food_library_category)
-- SELECT * FROM food_library WHERE category = 'Malay' LIMIT 50;

-- Combined search (uses idx_food_library_name_category)
-- SELECT * FROM food_library WHERE lower(name) LIKE '%chicken%' AND category = 'Chinese';

-- Similarity search with pg_trgm (requires extension)
-- SELECT name, similarity(name, 'Char Kuey Teow') as sim 
-- FROM food_library 
-- WHERE name % 'Char Kuey Teow' 
-- ORDER BY sim DESC 
-- LIMIT 5;

