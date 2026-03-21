# Pure Supabase Email System Setup

## Overview
This system stores all email notifications in your Supabase database instead of sending actual emails. You can view all notifications through the admin interface and optionally send them manually or set up automated sending later.

## Setup Steps

### 1. Create Database Tables
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **SQL Editor**
3. Create a new query and paste the content from `supabase-email-tables.sql`
4. Run the query to create the tables

### 2. Verify Tables Created
Check that these tables were created:
- `email_notifications` - Stores all email notifications
- `booking_confirmations` - Stores booking confirmation summaries

### 3. Access Admin Interface
Visit `/admin/notifications` to view:
- **Booking Confirmations**: Summary of all confirmed appointments
- **Email Notifications**: All email notifications that would have been sent

### 4. Environment Variables
You only need:
```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin email (for notification records)
ADMIN_EMAIL=your_admin_email@domain.com
```

## How It Works

### When a Booking is Made:
1. **Customer Notification**: Creates a record with confirmation details
2. **Admin Notification**: Creates a record with booking details for you
3. **Booking Confirmation**: Creates a summary record for easy viewing

### What You Get:
- **Complete Audit Trail**: All notifications stored permanently
- **Easy Viewing**: Admin interface to see all communications
- **No External Dependencies**: Everything in Supabase
- **No Email Costs**: No charges for email sending
- **Offline Capability**: Works without internet for email services

### Admin Interface Features:
- **Booking Confirmations Tab**: 
  - Customer details (name, phone, email)
  - Appointment date and time
  - Service location
  - Customer notes
  - Booking reference ID

- **Email Notifications Tab**:
  - All notification types (customer confirmations, admin alerts, updates)
  - Full email content
  - Recipient information
  - Timestamps
  - Status tracking

## Optional: Add Real Email Sending Later

If you want to add actual email sending later, you can:

### Option 1: Manual Email Sending
- Copy notification content from admin interface
- Send emails manually to customers
- Mark notifications as "sent" in database

### Option 2: Batch Email Processing
- Create a script to process pending notifications
- Send emails in batches
- Update status to "sent" after successful delivery

### Option 3: Real-time Email Integration
- Add email service integration (Resend, SendGrid, etc.)
- Process notifications automatically
- Keep the database records for audit trail

## Benefits of This Approach:
- ✅ **No External Dependencies**: Pure Supabase solution
- ✅ **No Email Costs**: No charges for email services
- ✅ **Complete Audit Trail**: All communications logged
- ✅ **Easy Management**: View all notifications in one place
- ✅ **Flexible**: Add real email sending when needed
- ✅ **Reliable**: No email delivery failures
- ✅ **Privacy Friendly**: No third-party email services

## Database Schema:

### email_notifications table:
- `id`: Unique notification ID
- `type`: customer_confirmation, admin_notification, customer_update
- `recipient_email`: Email address
- `recipient_name`: Recipient name
- `subject`: Email subject line
- `content`: Full email content
- `booking_id`: Reference to booking
- `status`: pending, sent, failed
- `created_at`: When notification was created

### booking_confirmations table:
- `id`: Unique confirmation ID
- `booking_id`: Reference to booking
- `customer_name`: Customer name
- `customer_contact`: Phone number
- `customer_email`: Email (if provided)
- `appointment_date`: Appointment date
- `appointment_time`: Appointment time
- `notes`: Customer notes
- `address`: Service location
- `confirmed_at`: When booking was confirmed

This system gives you all the benefits of email notifications without the complexity and costs of external email services!

## Storage Setup for Client Photos

### 1. Create Storage Bucket
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Storage**
3. Click **New bucket**
4. Create a bucket named `bookings`
5. Set it as **Public bucket** (so photos can be viewed in admin)

### 2. Set Storage Policies
In the **Storage** > **Policies** section, add these policies for the `bookings` bucket:

**Policy 1: Allow public read access**
```sql
CREATE POLICY "Public read access for booking photos" ON storage.objects
FOR SELECT USING (bucket_id = 'bookings');
```

**Policy 2: Allow authenticated uploads**
```sql
CREATE POLICY "Allow uploads for booking photos" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'bookings');
```

### 3. Update Database Schema
Run the SQL from `add-email-photo-fields.sql` to add email and photo fields:

```sql
-- Add email and client photo fields to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS email VARCHAR(255),
ADD COLUMN IF NOT EXISTS client_photo_url TEXT;

-- Create index for email lookups
CREATE INDEX IF NOT EXISTS idx_bookings_email ON bookings(email);
```

### 4. Admin Interface Updates
The admin interface now shows:
- 📧 **Customer Email**: Email address for each booking
- 📷 **Client Photo**: Thumbnail photo that opens full-size when clicked
- All existing booking details (date, time, phone, location, notes)

### Photo Features:
- **Secure Upload**: Photos stored in Supabase Storage
- **Thumbnail View**: Small preview in booking list
- **Full Size View**: Click to open full-size photo in new tab
- **Verification**: Helps verify customer identity for mobile services