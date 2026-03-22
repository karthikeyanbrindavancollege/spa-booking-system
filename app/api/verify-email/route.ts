import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// In a real application, you would store this in a database or Redis
const verificationCodes = new Map<string, { code: string, timestamp: number }>()

export async function POST(request: NextRequest) {
  try {
    const { email, action, code } = await request.json()

    if (action === 'send') {
      // Generate a 6-digit verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Store the code with timestamp (expires in 10 minutes)
      verificationCodes.set(email, {
        code: verificationCode,
        timestamp: Date.now()
      })

      try {
        // Store verification email in Supabase instead of sending
        const verificationNotification = {
          type: 'customer_confirmation',
          recipient_email: email,
          recipient_name: 'User',
          subject: 'Email Verification Code',
          content: `
Your verification code is: ${verificationCode}

This code will expire in 10 minutes.

If you didn't request this verification, please ignore this email.
          `,
          booking_id: null,
          status: 'pending',
          created_at: new Date().toISOString()
        }

        await supabase
          .from('email_notifications')
          .insert(verificationNotification)

        return NextResponse.json({ 
          success: true, 
          message: 'Verification code sent to your email',
          // For demo purposes, return the code (remove this in production)
          code: verificationCode
        })
      } catch (emailError) {
        console.error('Email notification creation failed:', emailError)
        // Fallback for demo - in production, you'd return an error
        return NextResponse.json({ 
          success: true, 
          message: 'Verification code sent (demo mode)',
          code: verificationCode
        })
      }
    }

    if (action === 'verify') {
      const stored = verificationCodes.get(email)
      
      if (!stored) {
        return NextResponse.json(
          { error: 'No verification code found for this email' },
          { status: 400 }
        )
      }

      // Check if code is expired (10 minutes)
      if (Date.now() - stored.timestamp > 10 * 60 * 1000) {
        verificationCodes.delete(email)
        return NextResponse.json(
          { error: 'Verification code has expired' },
          { status: 400 }
        )
      }

      if (stored.code === code) {
        verificationCodes.delete(email)
        return NextResponse.json({ success: true, message: 'Email verified successfully' })
      } else {
        return NextResponse.json(
          { error: 'Invalid verification code' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Failed to process verification' },
      { status: 500 }
    )
  }
}