-- Add email and client photo fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_photo_url TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);

-- Update existing records to have empty email if null (optional)
-- UPDATE bookings SET email = '' WHERE email IS NULL;