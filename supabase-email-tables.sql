-- Create email_notifications table to store all email notifications
CREATE TABLE IF NOT EXISTS email_notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type VARCHAR(50) NOT NULL, -- 'customer_confirmation', 'admin_notification', 'customer_update'
  recipient_email VARCHAR(255) NOT NULL,
  recipient_name VARCHAR(255),
  subject TEXT NOT NULL,
  content TEXT NOT NULL,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'failed'
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  sent_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Create booking_confirmations table for easy viewing of confirmations
CREATE TABLE IF NOT EXISTS booking_confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
  customer_name VARCHAR(255) NOT NULL,
  customer_contact VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  notes TEXT,
  address TEXT,
  confirmed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_email_notifications_booking_id ON email_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_email_notifications_type ON email_notifications(type);
CREATE INDEX IF NOT EXISTS idx_email_notifications_status ON email_notifications(status);
CREATE INDEX IF NOT EXISTS idx_booking_confirmations_booking_id ON booking_confirmations(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_confirmations_date ON booking_confirmations(appointment_date);

-- Enable Row Level Security
ALTER TABLE email_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_confirmations ENABLE ROW LEVEL SECURITY;

-- Create policies for email_notifications
CREATE POLICY "Enable read access for service role" ON email_notifications
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert access for service role" ON email_notifications
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role" ON email_notifications
  FOR UPDATE USING (auth.role() = 'service_role');

-- Create policies for booking_confirmations
CREATE POLICY "Enable read access for service role" ON booking_confirmations
  FOR SELECT USING (auth.role() = 'service_role');

CREATE POLICY "Enable insert access for service role" ON booking_confirmations
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Enable update access for service role" ON booking_confirmations
  FOR UPDATE USING (auth.role() = 'service_role');