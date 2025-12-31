-- Migration: Create user_weekly_goals table
-- Purpose: Store weekly nutrition goals for the goal-setting feature

-- Create the user_weekly_goals table
CREATE TABLE IF NOT EXISTS user_weekly_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  goal_description TEXT NOT NULL,
  metric_target JSONB DEFAULT '{}',
  status TEXT DEFAULT 'active',
  
  -- Add constraint for valid status values
  CONSTRAINT valid_goal_status CHECK (status IN ('active', 'achieved', 'failed'))
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_weekly_goals_user_id ON user_weekly_goals(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_status ON user_weekly_goals(status);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_dates ON user_weekly_goals(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_weekly_goals_user_active ON user_weekly_goals(user_id, status) WHERE status = 'active';

-- Add comments for documentation
COMMENT ON TABLE user_weekly_goals IS 'Stores weekly nutrition goals set by users';
COMMENT ON COLUMN user_weekly_goals.goal_description IS 'Human-readable goal description, e.g., Limit Nasi Lemak to once this week';
COMMENT ON COLUMN user_weekly_goals.metric_target IS 'JSON object with metric targets, e.g., {"max_sodium": 2000, "min_protein": 80, "max_sugar": 25}';
COMMENT ON COLUMN user_weekly_goals.status IS 'Goal status: active (in progress), achieved (completed successfully), failed (not met)';

-- Example metric_target values:
-- { "max_sodium": 2000 }           -- Daily sodium limit in mg
-- { "min_protein": 80 }            -- Daily protein minimum in g
-- { "max_sugar": 25 }              -- Daily sugar limit in g
-- { "max_calories": 2000 }         -- Daily calorie limit
-- { "max_nasi_lemak": 2 }          -- Max times per week for specific food
-- { "min_meals_logged": 21 }       -- Minimum meals to log in the week

