import { NextRequest, NextResponse } from 'next/server'
import { sendBookingEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const { customerEmail, adminEmail } = await request.json()

    // Create a test booking object
    const testBooking = {
      id: 'test-booking-' + Date.now(),
      name: 'John Doe',
      contact: customerEmail || 'test@example.com',
      date: '2026-03-25',
      time: '14:00',
      notes: 'This is a test booking to verify email functionality.',
      address: 'Test Address, Test City, Test State 12345'
    }

    // Send test emails
    const emailResults = await sendBookingEmails({
      booking: testBooking,
      customerEmail: customerEmail || 'test@example.com'
    })

    return NextResponse.json({
      success: true,
      message: 'Test emails sent',
      results: {
        customerEmailSent: !!emailResults.customerEmail,
        adminEmailSent: !!emailResults.adminEmail,
        errors: emailResults.errors,
        customerEmailId: emailResults.customerEmail?.id,
        adminEmailId: emailResults.adminEmail?.id
      }
    })
  } catch (error) {
    console.error('Test email error:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to send test emails'
    }, { status: 500 })
  }
}