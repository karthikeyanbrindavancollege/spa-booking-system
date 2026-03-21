-- Add email and client photo URL columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_photo_url TEXT;

-- Create storage bucket for booking photos if it doesn't exist
-- Run this in Supabase SQL Editor:
-- INSERT INTO storage.buckets (id, name, public) 
-- VALUES ('bookings', 'bookings', true)
-- ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the bookings bucket
-- CREATE POLICY "Allow public uploads" ON storage.objects 
-- FOR INSERT WITH CHECK (bucket_id = 'bookings');

-- CREATE POLICY "Allow public access" ON storage.objects 
-- FOR SELECT USING (bucket_id = 'bookings');