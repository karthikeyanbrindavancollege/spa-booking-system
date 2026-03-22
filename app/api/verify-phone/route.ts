import { NextRequest, NextResponse } from 'next/server'

// In-memory storage for verification sessions
const verificationSessions = new Map<string, { 
  timestamp: number, 
  verified: boolean,
  code: string
}>()

export const dynamic = 'force-dynamic'

// Free SMS service using Fast2SMS (India)
async function sendSMSViaFast2SMS(phone: string, message: string) {
  const apiKey = process.env.FAST2SMS_API_KEY
  
  if (!apiKey) {
    throw new Error('Fast2SMS API key not configured')
  }

  const response = await fetch('https://www.fast2sms.com/dev/bulkV2', {
    method: 'POST',
    headers: {
      'authorization': apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      route: 'v3',
      sender_id: 'TXTIND',
      message: message,
      language: 'english',
      flash: 0,
      numbers: phone.replace('+91', '').replace('+', '')
    })
  })

  const data = await response.json()
  
  if (!response.ok || !data.return) {
    throw new Error(data.message || 'Failed to send SMS')
  }
  
  return data
}

// Alternative: TextBelt (International, 1 free SMS per day per number)
async function sendSMSViaTextBelt(phone: string, message: string) {
  const response = await fetch('https://textbelt.com/text', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      phone: phone,
      message: message,
      key: 'textbelt' // Free tier key
    })
  })

  const data = await response.json()
  
  if (!data.success) {
    throw new Error(data.error || 'Failed to send SMS')
  }
  
  return data
}

export async function POST(request: NextRequest) {
  try {
    const { phone, action, code } = await request.json()

    if (action === 'send') {
      // Generate verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()
      const message = `Your Serenity Spa verification code is: ${verificationCode}. Valid for 10 minutes.`
      
      // Format phone number
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
      
      try {
        // Try Fast2SMS first (for Indian numbers)
        if (formattedPhone.startsWith('+91')) {
          await sendSMSViaFast2SMS(formattedPhone, message)
        } else {
          // Use TextBelt for international numbers
          await sendSMSViaTextBelt(formattedPhone, message)
        }

        // Store verification session
        verificationSessions.set(formattedPhone, {
          timestamp: Date.now(),
          verified: false,
          code: verificationCode
        })

        return NextResponse.json({ 
          success: true, 
          message: 'Verification code sent via SMS'
        })
        
      } catch (smsError: any) {
        console.error('SMS sending error:', smsError)
        
        // Fallback: Store code for manual verification (development/testing)
        verificationSessions.set(formattedPhone, {
          timestamp: Date.now(),
          verified: false,
          code: verificationCode
        })
        
        return NextResponse.json({
          success: true,
          message: 'SMS service temporarily unavailable. For testing, use code: ' + verificationCode,
          testCode: verificationCode // Only for testing
        })
      }
    }

    if (action === 'verify') {
      const formattedPhone = phone.startsWith('+') ? phone : `+91${phone}`
      const session = verificationSessions.get(formattedPhone)
      
      if (!session) {
        return NextResponse.json(
          { error: 'No verification session found. Please request a new code.' },
          { status: 400 }
        )
      }

      // Check if session is expired (10 minutes)
      if (Date.now() - session.timestamp > 10 * 60 * 1000) {
        verificationSessions.delete(formattedPhone)
        return NextResponse.json(
          { error: 'Verification code has expired. Please request a new one.' },
          { status: 400 }
        )
      }

      // Verify code
      if (session.code === code) {
        verificationSessions.set(formattedPhone, { ...session, verified: true })
        return NextResponse.json({ 
          success: true, 
          message: 'Phone verified successfully' 
        })
      } else {
        return NextResponse.json(
          { error: 'Invalid verification code. Please try again.' },
          { status: 400 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Phone verification error:', error)
    return NextResponse.json(
      { error: 'Failed to process verification request' },
      { status: 500 }
    )
  }
}