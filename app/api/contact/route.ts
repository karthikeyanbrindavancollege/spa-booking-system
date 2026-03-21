import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send email notification to admin
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
    
    await resend.emails.send({
      from: 'Contact Form <noreply@yourdomain.com>',
      to: [adminEmail],
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #555;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> <a href="tel:${phone}">${phone}</a> (Verified)</p>
            ${email ? `<p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>` : ''}
          </div>
          
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h3 style="margin-top: 0; color: #555;">Message</h3>
            <p style="line-height: 1.6;">${message}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background: #e8f4fd; border-radius: 8px;">
            <p style="margin: 0; color: #0066cc;">
              <strong>Quick Actions:</strong>
              <a href="tel:${phone}" style="margin-left: 10px; color: #0066cc;">Call ${phone}</a>
              ${email ? ` | <a href="mailto:${email}" style="color: #0066cc;">Email ${email}</a>` : ''}
            </p>
          </div>
        </div>
      `,
    })

    // If email is provided, send confirmation to customer
    if (email) {
      await resend.emails.send({
        from: 'Serenity free Spa <noreply@yourdomain.com>',
        to: [email],
        subject: 'Thank you for contacting us!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank you for reaching out!</h2>
            
            <p>Hi ${name},</p>
            
            <p>We've received your message and will get back to you soon. Here's what you sent:</p>
            
            <div style="background: #f9f9f9; padding: 15px; border-left: 4px solid #0066cc; margin: 20px 0;">
              <p style="margin: 0; font-style: italic;">"${message}"</p>
            </div>
            
            <p>You can also reach us directly by phone or email.</p>
            
            <p>Best regards,<br>Serenity free Spa & Wellness Team</p>
          </div>
        `,
      })
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