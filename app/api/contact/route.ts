import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, message } = await request.json()

    // Validate required fields
    if (!name || !phone || !message) {
      return NextResponse.json(
        { error: 'Name, phone, and message are required' },
        { status: 400 }
      )
    }

    // Store contact form submission in Supabase as email notification
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    
    const adminNotification = {
      type: 'admin_notification',
      recipient_email: adminEmail,
      recipient_name: 'Admin',
      subject: `New Contact Form Submission from ${name}`,
      content: `
New contact form submission received:

👤 Name: ${name}
📞 Phone: ${phone} (Verified)
${email ? `📧 Email: ${email}` : ''}

📝 Message:
${message}

Quick Actions:
• Call: ${phone}
${email ? `• Email: ${email}` : ''}
      `,
      booking_id: null,
      status: 'pending',
      created_at: new Date().toISOString()
    }

    const { error: adminError } = await supabase
      .from('email_notifications')
      .insert(adminNotification)

    if (adminError) {
      console.error('Error creating admin notification:', adminError)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    // If email is provided, send confirmation to customer
    if (email) {
      const customerNotification = {
        type: 'customer_confirmation',
        recipient_email: email,
        recipient_name: name,
        subject: 'Thank you for contacting us!',
        content: `
Hi ${name},

We've received your message and will get back to you soon. Here's what you sent:

"${message}"

You can also reach us directly by phone.

Best regards,
Serenity Spa & Wellness Team
        `,
        booking_id: null,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      await supabase
        .from('email_notifications')
        .insert(customerNotification)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}