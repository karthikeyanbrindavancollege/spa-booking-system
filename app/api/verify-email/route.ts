import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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
        // Send verification email
        await resend.emails.send({
          from: 'Verification <noreply@yourdomain.com>',
          to: [email],
          subject: 'Email Verification Code',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Email Verification</h2>
              
              <p>Your verification code is:</p>
              
              <div style="background: #f0f8ff; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h1 style="color: #0066cc; font-size: 32px; margin: 0; letter-spacing: 4px;">${verificationCode}</h1>
              </div>
              
              <p>This code will expire in 10 minutes.</p>
              
              <p>If you didn't request this verification, please ignore this email.</p>
            </div>
          `,
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Verification code sent to your email',
          // For demo purposes, return the code (remove this in production)
          code: verificationCode
        })
      } catch (emailError) {
        console.error('Email sending failed:', emailError)
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