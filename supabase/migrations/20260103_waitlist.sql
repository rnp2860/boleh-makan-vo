-- 🇲🇾 Boleh Makan Waitlist Schema
-- For collecting pre-launch signups

-- Waitlist signups table
CREATE TABLE IF NOT EXISTS waitlist (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  
  -- Health conditions interested in
  conditions TEXT[] DEFAULT '{}', -- ['diabetes', 'hypertension', 'cholesterol', 'ckd']
  
  -- Source tracking
  source TEXT DEFAULT 'landing_page', -- 'landing_page', 'ramadan_campaign', 'referral'
  referral_code TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Ramadan interest
  interested_in_ramadan BOOLEAN DEFAULT false,
  
  -- Status
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'invited', 'converted', 'unsubscribed')),
  invited_at TIMESTAMPTZ,
  
  -- Metadata
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_status ON waitlist(status);
CREATE INDEX IF NOT EXISTS idx_waitlist_created ON waitlist(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_waitlist_source ON waitlist(source);
CREATE INDEX IF NOT EXISTS idx_waitlist_ramadan ON waitlist(interested_in_ramadan) WHERE interested_in_ramadan = true;

-- RLS Policies
ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

-- Only service role can read/write (admin only)
CREATE POLICY "Service role full access to waitlist" ON waitlist
  FOR ALL USING (auth.role() = 'service_role');

-- Allow anonymous inserts (for public signups)
CREATE POLICY "Allow anonymous waitlist signups" ON waitlist
  FOR INSERT WITH CHECK (true);

