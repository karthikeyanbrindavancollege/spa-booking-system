-- Create manual verification table for admin review
CREATE TABLE IF NOT EXISTS manual_verifications (
  id SERIAL PRIMARY KEY,
  phone VARCHAR(20) NOT NULL,
  code VARCHAR(10) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  verified_at TIMESTAMP WITH TIME ZONE,
  verified_by VARCHAR(255),
  notes TEXT
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_manual_verifications_phone ON manual_verifications(phone);
CREATE INDEX IF NOT EXISTS idx_manual_verifications_status ON manual_verifications(status);

-- Add RLS (Row Level Security) policies
ALTER TABLE manual_verifications ENABLE ROW LEVEL SECURITY;

-- Policy for service role (API access)
CREATE POLICY "Service role can manage manual verifications" ON manual_verifications
  FOR ALL USING (auth.role() = 'service_role');

-- Policy for authenticated users to view their own requests
CREATE POLICY "Users can view their own verification requests" ON manual_verifications
  FOR SELECT USING (true);