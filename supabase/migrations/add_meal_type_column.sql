-- Migration: Add meal_type column to food_logs table
-- Purpose: Support categorizing meals for the Nutrition Report feature
-- Valid values: 'Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'

-- Add the meal_type column with default value 'Other'
ALTER TABLE food_logs 
ADD COLUMN IF NOT EXISTS meal_type TEXT DEFAULT 'Other';

-- Add a check constraint to ensure only valid values
ALTER TABLE food_logs 
ADD CONSTRAINT valid_meal_type 
CHECK (meal_type IN ('Breakfast', 'Lunch', 'Dinner', 'Snack', 'Other'));

-- Create an index for faster queries by meal_type
CREATE INDEX IF NOT EXISTS idx_food_logs_meal_type ON food_logs(meal_type);

-- Create a composite index for user reports (user_id + created_at + meal_type)
CREATE INDEX IF NOT EXISTS idx_food_logs_user_reports ON food_logs(user_id, created_at, meal_type);

-- Comment for documentation
COMMENT ON COLUMN food_logs.meal_type IS 'Type of meal: Breakfast, Lunch, Dinner, Snack, or Other';

