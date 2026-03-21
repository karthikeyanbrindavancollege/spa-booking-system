import { createClient } from '@supabase/supabase-js'
import { formatDisplayDate, formatTime } from './utils'

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface BookingEmailData {
  booking: {
    id: string
    name: string
    contact: string
    date: string
    time: string
    notes?: string
    address?: string
  }
  customerEmail?: string | null
}

// Store email notifications in Supabase database instead of sending emails
export async function sendBookingEmails({ booking, customerEmail }: BookingEmailData) {
  const results = {
    customerEmail: null as any,
    adminEmail: null as any,
    errors: [] as string[]
  }

  try {
    // Create customer notification record
    if (customerEmail) {
      const customerNotification = {
        type: 'customer_confirmation',
        recipient_email: customerEmail,
        recipient_name: booking.name,
        subject: `Appointment Confirmed - ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}`,
        content: generateCustomerNotificationContent(booking),
        booking_id: booking.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { data: customerResult, error: customerError } = await supabase
        .from('email_notifications')
        .insert(customerNotification)
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer notification:', customerError)
        results.errors.push('Failed to create customer notification')
      } else {
        console.log('Customer notification created:', customerResult)
        results.customerEmail = customerResult
      }
    }

    // Create admin notification record
    const adminEmail = process.env.ADMIN_EMAIL
    if (adminEmail) {
      const adminNotification = {
        type: 'admin_notification',
        recipient_email: adminEmail,
        recipient_name: 'Admin',
        subject: `🗓️ New Booking: ${booking.name} - ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}`,
        content: generateAdminNotificationContent(booking),
        booking_id: booking.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { data: adminResult, error: adminError } = await supabase
        .from('email_notifications')
        .insert(adminNotification)
        .select()
        .single()

      if (adminError) {
        console.error('Error creating admin notification:', adminError)
        results.errors.push('Failed to create admin notification')
      } else {
        console.log('Admin notification created:', adminResult)
        results.adminEmail = adminResult
      }
    } else {
      results.errors.push('Admin email not configured')
    }

    // Also create a simple booking confirmation record for easy viewing
    await supabase
      .from('booking_confirmations')
      .insert({
        booking_id: booking.id,
        customer_name: booking.name,
        customer_contact: booking.contact,
        customer_email: customerEmail,
        appointment_date: booking.date,
        appointment_time: booking.time,
        notes: booking.notes,
        address: booking.address,
        confirmed_at: new Date().toISOString()
      })

  } catch (error) {
    console.error('Error in sendBookingEmails:', error)
    results.errors.push('Failed to process notifications')
  }

  return results
}

export async function sendBookingUpdateEmails({ booking, customerEmail }: BookingEmailData) {
  const results = {
    customerEmail: null as any,
    errors: [] as string[]
  }

  try {
    if (customerEmail) {
      const updateNotification = {
        type: 'customer_update',
        recipient_email: customerEmail,
        recipient_name: booking.name,
        subject: `Appointment Updated - ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}`,
        content: generateCustomerUpdateContent(booking),
        booking_id: booking.id,
        status: 'pending',
        created_at: new Date().toISOString()
      }

      const { data: customerResult, error: customerError } = await supabase
        .from('email_notifications')
        .insert(updateNotification)
        .select()
        .single()

      if (customerError) {
        console.error('Error creating customer update notification:', customerError)
        results.errors.push('Failed to create customer update notification')
      } else {
        console.log('Customer update notification created:', customerResult)
        results.customerEmail = customerResult
      }
    }
  } catch (error) {
    console.error('Error in sendBookingUpdateEmails:', error)
    results.errors.push('Failed to process update notifications')
  }

  return results
}

// Generate notification content
function generateCustomerNotificationContent(booking: BookingEmailData['booking']) {
  return `
    Hi ${booking.name},

    Your appointment has been successfully scheduled! Here are the details:

    📅 Date & Time: ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}
    👤 Name: ${booking.name}
    ${booking.notes ? `📝 Notes: ${booking.notes}` : ''}
    ${booking.address ? `📍 Location: ${booking.address}` : ''}
    🆔 Booking ID: ${booking.id}

    What's Next?
    • Please be available 5 minutes before your appointment time
    • We'll contact you if any changes are needed
    • If you need to reschedule, please contact us as soon as possible

    Thank you for choosing Serenity Spa!
  `
}

function generateAdminNotificationContent(booking: BookingEmailData['booking']) {
  return `
    New appointment booking received:

    📅 Date & Time: ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}
    👤 Customer: ${booking.name}
    📞 Contact: ${booking.contact}
    ${booking.notes ? `📝 Notes: ${booking.notes}` : ''}
    ${booking.address ? `📍 Location: ${booking.address}` : ''}
    🆔 Booking ID: ${booking.id}

    Quick Actions:
    • Contact the customer: ${booking.contact}
    • Prepare for mobile service
    • View booking details in admin dashboard
  `
}

function generateCustomerUpdateContent(booking: BookingEmailData['booking']) {
  return `
    Hi ${booking.name},

    Your appointment has been updated! Here are the new details:

    📅 Date & Time: ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}
    👤 Name: ${booking.name}
    ${booking.notes ? `📝 Notes: ${booking.notes}` : ''}
    ${booking.address ? `📍 Location: ${booking.address}` : ''}
    🆔 Booking ID: ${booking.id}

    Thank you for choosing Serenity Spa!
  `
}

// Keep the old function for backward compatibility
export async function sendBookingConfirmation(data: BookingEmailData) {
  return sendBookingEmails(data)
}