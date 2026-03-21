# Personal Appointment Booking System

A complete, production-ready web application for personal appointment booking with location tracking. Built with Next.js, Supabase, and modern web technologies.

## 🚀 Features

### Customer Features
- **Simple 3-step booking flow**: Select time → Enter details → Confirm
- **Mobile-first responsive design**
- **Location tracking with interactive maps** (using free OpenStreetMap)
- **Real-time availability checking**
- **Email confirmations**
- **No login required**

### Admin Features
- **Secure admin dashboard**
- **View all bookings with location mapping**
- **Manage availability and time slots**
- **Block specific dates or times**
- **Cancel bookings**
- **Bulk availability management**

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes, Supabase (PostgreSQL)
- **Maps**: Leaflet + OpenStreetMap (free alternative to Google Maps)
- **Email**: Resend + React Email
- **Validation**: Zod + React Hook Form
- **Styling**: Tailwind CSS with custom components

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account (for emails)

### 1. Clone and Install
```bash
git clone <repository-url>
cd appointment-booking-system
npm install
```

### 2. Environment Setup
Copy `.env.local.example` to `.env.local` and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@yourdomain.com

# Admin
ADMIN_EMAIL=admin@yourdomain.com
ADMIN_PASSWORD=your_secure_password

# App Config
NEXT_PUBLIC_APP_URL=http://localhost:3000
BUSINESS_NAME="Your Business Name"
BUSINESS_DESCRIPTION="Professional services with personalized attention"
```

### 3. Database Setup

1. Create a new Supabase project
2. Run the SQL commands from `lib/database.sql` in your Supabase SQL editor
3. This will create the required tables and initial availability data

### 4. Email Setup (Optional)

1. Sign up for [Resend](https://resend.com)
2. Get your API key and add it to `.env.local`
3. Verify your sending domain in Resend dashboard

### 5. Run the Application

```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Usage

### For Customers
1. Visit the homepage
2. Click "Book Appointment Now"
3. Select available date and time
4. Enter your details and location (optional)
5. Confirm booking and receive email confirmation

### For Admins
1. Visit `/admin`
2. Login with your admin credentials
3. View and manage bookings
4. Set availability and block dates
5. View customer locations on map

## 🔧 Configuration

### Default Time Slots
Edit `lib/utils.ts` → `generateTimeSlots()` to change default business hours.

### Styling
- Customize colors in `tailwind.config.js`
- Modify component styles in `app/globals.css`
- Update business info in environment variables

### Email Templates
Customize email templates in `emails/BookingConfirmation.tsx`

## 🚀 Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📱 Mobile Optimization

The application is built mobile-first with:
- Touch-friendly interface
- Large buttons and inputs
- Responsive design
- Fast loading times
- Offline-capable maps

## 🔒 Security Features

- Admin authentication with session management
- Input validation and sanitization
- SQL injection protection via Supabase
- Rate limiting ready (add middleware as needed)
- Secure environment variable handling

## 🧪 Testing

```bash
# Run linting
npm run lint

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Database Schema

### Bookings Table
- `id`: UUID primary key
- `name`: Customer name
- `contact`: Email or phone
- `date`: Appointment date
- `time`: Appointment time
- `notes`: Optional notes
- `address`: Customer address
- `latitude/longitude`: Location coordinates
- `status`: confirmed/cancelled
- `created_at`: Timestamp

### Availability Table
- `id`: UUID primary key
- `date`: Available date
- `time_slots`: JSON array of available times
- `is_blocked`: Boolean for blocked dates
- `created_at`: Timestamp

### Admin Sessions Table
- `id`: UUID primary key
- `session_token`: Authentication token
- `expires_at`: Token expiration
- `created_at`: Timestamp

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For issues and questions:
1. Check the GitHub issues
2. Review the documentation
3. Contact the maintainers

## 🔄 Roadmap

- [ ] SMS notifications
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Recurring appointments
- [ ] Payment integration
- [ ] Customer portal for managing bookings
- [ ] Automated reminders
- [ ] Waitlist functionality
- [ ] Multi-location support