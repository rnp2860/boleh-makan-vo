-- 🇲🇾 Malaysian Food Database - Helper Functions

-- Function to increment food popularity when logged
CREATE OR REPLACE FUNCTION increment_food_popularity(food_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE malaysian_foods
  SET popularity_score = COALESCE(popularity_score, 0) + 1,
      updated_at = NOW()
  WHERE id = food_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

