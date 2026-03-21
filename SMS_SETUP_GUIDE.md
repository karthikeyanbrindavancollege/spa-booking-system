# SMS Verification Setup Guide - Supabase Auth

## Current Status
- **Development Mode**: Shows verification codes in alerts/toasts for testing
- **Production Mode**: Uses Supabase Auth for real SMS verification

## To Enable Live SMS Verification with Supabase:

### 1. Supabase Phone Auth Setup
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to **Authentication > Settings**
3. Enable **Phone Auth** in the Auth settings
4. Configure your SMS provider (Supabase supports multiple providers)

### 2. Configure SMS Provider in Supabase
Supabase supports these SMS providers:
- **Twilio** (Recommended)
- **MessageBird**
- **Textlocal**
- **Vonage**

#### For Twilio (Most Popular):
1. Get Twilio credentials (Account SID, Auth Token, Phone Number)
2. In Supabase Dashboard → Auth → Settings → SMS
3. Select "Twilio" as provider
4. Enter your Twilio credentials

### 3. Environment Variables
Your `.env.local` should already have:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Test the Setup
1. Restart your development server
2. Try phone verification with a real number
3. You should receive actual SMS via Supabase

## Advantages of Supabase Auth:
- **No Additional Packages**: Uses existing Supabase setup
- **Built-in Rate Limiting**: Prevents SMS spam automatically
- **Multiple Providers**: Switch SMS providers easily
- **Cost Effective**: Competitive SMS pricing
- **Secure**: Built-in security features
- **Easy Setup**: No code changes needed, just configuration

## Cost Information (via Supabase + Twilio):
- **SMS Cost**: Same as direct Twilio (~$0.0075 per SMS)
- **Supabase**: Free tier includes phone auth
- **Setup**: Much easier than direct Twilio integration

## Current Behavior:
- **With Supabase SMS Configured**: Sends real SMS, no demo codes
- **Without SMS Configuration**: Falls back to demo codes for testing
- **Automatic Fallback**: Graceful degradation if SMS fails

## Security Features:
- **Rate Limiting**: Built-in protection against spam
- **Phone Validation**: Automatic phone number format validation
- **Session Management**: Secure verification session handling
- **Expiration**: 10-minute code expiration for security

## Alternative: Email Verification
If you prefer email verification instead of SMS:
1. Use Supabase email auth instead
2. Send verification codes via email
3. More cost-effective than SMS
4. Higher delivery rates

The system automatically detects Supabase configuration and uses real SMS when available, falling back to demo mode for development.