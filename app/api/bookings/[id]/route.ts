import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBookingUpdateEmails } from '@/lib/email'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const { name, contact, notes, address, latitude, longitude } = body
    const bookingId = params.id

    // Validate required fields
    if (!name || !contact) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Update booking (only allow updating contact details, not date/time)
    const { data: booking, error } = await supabase
      .from('bookings')
      .update({
        name,
        contact,
        notes,
        address,
        latitude,
        longitude,
      })
      .eq('id', bookingId)
      .eq('status', 'confirmed') // Only allow updating confirmed bookings
      .select()
      .single()

    if (error) {
      console.error('Error updating booking:', error)
      return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found or cannot be updated' }, { status: 404 })
    }

    // Send update notification email
    try {
      const emailResults = await sendBookingUpdateEmails({
        booking,
        customerEmail: booking.contact.includes('@') ? booking.contact : null
      })
      
      if (emailResults.errors.length > 0) {
        console.warn('Update email failed to send:', emailResults.errors)
      }
    } catch (emailError) {
      console.error('Error sending update email:', emailError)
      // Don't fail the update if email fails
    }

    return NextResponse.json({ 
      id: booking.id,
      message: 'Booking updated successfully' 
    })
  } catch (error) {
    console.error('Booking update API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const bookingId = params.id

    const { data: booking, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', bookingId)
      .single()

    if (error) {
      console.error('Error fetching booking:', error)
      return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
    }

    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ booking })
  } catch (error) {
    console.error('Booking fetch API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}