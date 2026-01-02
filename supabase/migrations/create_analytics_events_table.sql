-- Create analytics_events table for tracking user behavior
-- This supports privacy-respecting event tracking for metrics

CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT,
  event_name TEXT NOT NULL,
  event_properties JSONB DEFAULT '{}',
  page_path TEXT,
  session_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for querying by user_id
CREATE INDEX IF NOT EXISTS idx_analytics_user_id ON analytics_events(user_id);

-- Index for querying by event_name (for counting specific events)
CREATE INDEX IF NOT EXISTS idx_analytics_event_name ON analytics_events(event_name);

-- Index for time-based queries (daily/weekly/monthly reports)
CREATE INDEX IF NOT EXISTS idx_analytics_created_at ON analytics_events(created_at);

-- Composite index for user + event queries
CREATE INDEX IF NOT EXISTS idx_analytics_user_event ON analytics_events(user_id, event_name);

-- Composite index for time-based event queries
CREATE INDEX IF NOT EXISTS idx_analytics_event_time ON analytics_events(event_name, created_at);

-- Comments for documentation
COMMENT ON TABLE analytics_events IS 'Privacy-respecting event tracking for user behavior metrics';
COMMENT ON COLUMN analytics_events.user_id IS 'User identifier (from localStorage, not auth)';
COMMENT ON COLUMN analytics_events.event_name IS 'Type of event (page_view, meal_logged, etc.)';
COMMENT ON COLUMN analytics_events.event_properties IS 'Additional event data as JSON (no sensitive health info)';
COMMENT ON COLUMN analytics_events.page_path IS 'URL path where event occurred';
COMMENT ON COLUMN analytics_events.session_id IS 'Browser session identifier';

-- Example queries for analytics:

-- Daily Active Users (DAU)
-- SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE created_at >= CURRENT_DATE;

-- Weekly Active Users (WAU)
-- SELECT COUNT(DISTINCT user_id) FROM analytics_events WHERE created_at >= CURRENT_DATE - INTERVAL '7 days';

-- Event counts by type
-- SELECT event_name, COUNT(*) FROM analytics_events GROUP BY event_name ORDER BY count DESC;

-- Onboarding completion rate
-- SELECT 
--   (SELECT COUNT(*) FROM analytics_events WHERE event_name = 'onboarding_completed') * 100.0 / 
--   NULLIF((SELECT COUNT(*) FROM analytics_events WHERE event_name = 'onboarding_started'), 0) 
--   AS completion_rate;

-- Meals logged per user (engagement)
-- SELECT user_id, COUNT(*) as meals_logged 
-- FROM analytics_events 
-- WHERE event_name = 'meal_logged' 
-- GROUP BY user_id 
-- ORDER BY meals_logged DESC;

