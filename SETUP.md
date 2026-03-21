# Quick Setup Guide

## 1. Install Dependencies
```bash
npm install
```

## 2. Setup Supabase

### Create Project
1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Wait for setup to complete

### Setup Database
1. Go to SQL Editor in Supabase dashboard
2. Copy and paste the contents of `lib/database.sql`
3. Run the query to create tables and initial data

### Get API Keys
1. Go to Settings → API
2. Copy `Project URL` and `anon public` key
3. Copy `service_role` key (keep this secret!)

## 3. Setup Email (Optional)

### Resend Setup
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain or use their test domain
3. Get API key from dashboard

## 4. Environment Variables

Create `.env.local` file:
```env
# Supabase (required)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Email (optional)
RESEND_API_KEY=re_your_api_key
FROM_EMAIL=noreply@yourdomain.com

# Admin (required)
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_secure_password

# App Config (optional)
NEXT_PUBLIC_APP_URL=http://localhost:3000
BUSINESS_NAME="Your Business Name"
BUSINESS_DESCRIPTION="Your business description"
```

## 5. Run Application
```bash
npm run dev
```

Visit `http://localhost:3000`

## 6. Test the System

### Test Booking Flow
1. Go to homepage
2. Click "Book Appointment Now"
3. Select a date and time
4. Fill in details
5. Confirm booking

### Test Admin Panel
1. Go to `/admin`
2. Login with your admin credentials
3. View bookings
4. Manage availability

## 7. Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect to Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production
Make sure to update:
- `NEXT_PUBLIC_APP_URL` to your domain
- `FROM_EMAIL` to your verified domain
- Use strong `ADMIN_PASSWORD`

## Troubleshooting

### Common Issues

**Database connection fails:**
- Check Supabase URL and keys
- Ensure database tables are created

**Email not sending:**
- Verify Resend API key
- Check domain verification
- Look at server logs

**Admin login fails:**
- Check ADMIN_EMAIL and ADMIN_PASSWORD in .env.local
- Clear browser cache/localStorage

**Map not loading:**
- Check browser console for errors
- Ensure internet connection (uses OpenStreetMap)

### Getting Help
1. Check browser console for errors
2. Check server logs in terminal
3. Verify all environment variables are set
4. Test database connection in Supabase dashboard

## Production Checklist

- [ ] Strong admin password
- [ ] Verified email domain
- [ ] SSL certificate (automatic with Vercel)
- [ ] Environment variables set
- [ ] Database backups enabled
- [ ] Error monitoring setup
- [ ] Analytics setup (optional)

## Next Steps

After setup:
1. Customize business information
2. Update time slots and availability
3. Test booking flow thoroughly
4. Set up monitoring and backups
5. Add custom domain
6. Configure email templates