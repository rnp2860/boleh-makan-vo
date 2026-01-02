-- Add streak tracking columns to user_profiles table
-- 🔥 Daily Logging Streak System

-- Add columns if they don't exist
ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS current_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS longest_streak INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS last_log_date DATE,
ADD COLUMN IF NOT EXISTS streak_updated_at TIMESTAMP WITH TIME ZONE;

-- Create index for efficient streak lookups
CREATE INDEX IF NOT EXISTS idx_user_profiles_streak ON user_profiles(current_streak DESC);
CREATE INDEX IF NOT EXISTS idx_user_profiles_longest_streak ON user_profiles(longest_streak DESC);

-- Comments for documentation
COMMENT ON COLUMN user_profiles.current_streak IS 'Current consecutive days of logging meals';
COMMENT ON COLUMN user_profiles.longest_streak IS 'Personal best streak (highest consecutive days)';
COMMENT ON COLUMN user_profiles.last_log_date IS 'Date of the last meal log (for streak calculation)';
COMMENT ON COLUMN user_profiles.streak_updated_at IS 'Timestamp of when the streak was last updated';

-- Example queries for leaderboards and metrics:

-- Top streaks (leaderboard)
-- SELECT id, current_streak, longest_streak 
-- FROM user_profiles 
-- WHERE current_streak > 0 
-- ORDER BY current_streak DESC 
-- LIMIT 10;

-- Users who might be about to lose their streak (last logged yesterday)
-- SELECT id, current_streak, last_log_date
-- FROM user_profiles
-- WHERE last_log_date = CURRENT_DATE - INTERVAL '1 day'
-- AND current_streak > 3;

-- Streak distribution (for analytics)
-- SELECT 
--   CASE 
--     WHEN current_streak = 0 THEN '0 (No streak)'
--     WHEN current_streak BETWEEN 1 AND 6 THEN '1-6 days'
--     WHEN current_streak BETWEEN 7 AND 13 THEN '1-2 weeks'
--     WHEN current_streak BETWEEN 14 AND 29 THEN '2-4 weeks'
--     WHEN current_streak >= 30 THEN '30+ days'
--   END as streak_range,
--   COUNT(*) as user_count
-- FROM user_profiles
-- GROUP BY streak_range
-- ORDER BY user_count DESC;

