# Supabase Email Setup Guide

## Overview
The email system now uses Supabase Edge Functions instead of Resend, keeping everything within your Supabase ecosystem.

## Setup Steps

### 1. Install Supabase CLI
```bash
npm install -g supabase
```

### 2. Login to Supabase
```bash
supabase login
```

### 3. Create Edge Function
In your project root, run:
```bash
supabase functions new send-email
```

### 4. Update the Edge Function
Replace the content of `supabase/functions/send-email/index.ts` with:

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req) => {
  const { to, subject, html } = await req.json()

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Serenity Spa <noreply@yourdomain.com>',
        to,
        subject,
        html,
      }),
    })

    const data = await res.json()

    return new Response(
      JSON.stringify(data),
      { 
        headers: { "Content-Type": "application/json" },
        status: res.status 
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { "Content-Type": "application/json" },
        status: 500 
      },
    )
  }
})
```

### 5. Set Environment Variables
In your Supabase dashboard:
1. Go to **Settings > Edge Functions**
2. Add these environment variables:
   - `RESEND_API_KEY`: Your Resend API key
   - `FROM_EMAIL`: Your sender email (e.g., noreply@yourdomain.com)

### 6. Deploy the Function
```bash
supabase functions deploy send-email
```

### 7. Update Your .env.local
Remove these (no longer needed):
```env
# Remove these lines:
# RESEND_API_KEY=your_resend_api_key
# FROM_EMAIL=noreply@yourdomain.com
```

Keep only:
```env
ADMIN_EMAIL=your_admin_email@domain.com
```

## Alternative: Pure Supabase Email (No Resend)

If you want to avoid Resend entirely, you can use other email services in the Edge Function:

### Option 1: SendGrid
```typescript
const SENDGRID_API_KEY = Deno.env.get('SENDGRID_API_KEY')

const res = await fetch('https://api.sendgrid.com/v3/mail/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
  },
  body: JSON.stringify({
    personalizations: [{ to: [{ email: to[0] }] }],
    from: { email: 'noreply@yourdomain.com', name: 'Serenity Spa' },
    subject,
    content: [{ type: 'text/html', value: html }],
  }),
})
```

### Option 2: Mailgun
```typescript
const MAILGUN_API_KEY = Deno.env.get('MAILGUN_API_KEY')
const MAILGUN_DOMAIN = Deno.env.get('MAILGUN_DOMAIN')

const formData = new FormData()
formData.append('from', 'Serenity Spa <noreply@yourdomain.com>')
formData.append('to', to[0])
formData.append('subject', subject)
formData.append('html', html)

const res = await fetch(`https://api.mailgun.net/v3/${MAILGUN_DOMAIN}/messages`, {
  method: 'POST',
  headers: {
    'Authorization': `Basic ${btoa(`api:${MAILGUN_API_KEY}`)}`,
  },
  body: formData,
})
```

## Benefits of Supabase Edge Functions:
- **Unified Platform**: Everything in Supabase
- **Serverless**: No server management needed
- **Scalable**: Automatically scales with usage
- **Secure**: Environment variables managed by Supabase
- **Cost Effective**: Pay per execution
- **Easy Deployment**: Simple CLI deployment

## Current Environment Variables Needed:
```env
# Supabase (already configured)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Admin email (for notifications)
ADMIN_EMAIL=your_admin_email@domain.com
```

## Testing
1. Deploy the Edge Function
2. Make a test booking
3. Check that emails are sent to both customer and admin
4. Monitor function logs in Supabase dashboard

The system will automatically use Supabase Edge Functions for all email sending, keeping your entire stack unified under Supabase!