import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateTimeSlots } from '@/lib/utils'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json({ error: 'Date parameter is required' }, { status: 400 })
    }

    // Get availability for the date
    const { data: availability, error: availabilityError } = await supabase
      .from('availability')
      .select('*')
      .eq('date', date)
      .single()

    if (availabilityError && availabilityError.code !== 'PGRST116') {
      console.error('Error fetching availability:', availabilityError)
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
    }

    // If no availability record exists, create default one
    let timeSlots = generateTimeSlots()
    if (!availability) {
      const { error: insertError } = await supabase
        .from('availability')
        .insert({
          date,
          time_slots: timeSlots,
          is_blocked: false
        })

      if (insertError) {
        console.error('Error creating availability:', insertError)
        return NextResponse.json({ error: 'Failed to create availability' }, { status: 500 })
      }
    } else {
      timeSlots = availability.time_slots
      
      // If date is blocked, return no slots
      if (availability.is_blocked) {
        return NextResponse.json({ timeSlots: [] })
      }
    }

    // Get existing bookings for the date
    const { data: bookings, error: bookingsError } = await supabase
      .from('bookings')
      .select('time')
      .eq('date', date)
      .eq('status', 'confirmed')

    if (bookingsError) {
      console.error('Error fetching bookings:', bookingsError)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    // Mark booked slots as unavailable
    const bookedTimes = bookings.map(booking => booking.time)
    const availableTimeSlots = timeSlots.map(time => ({
      time,
      available: !bookedTimes.includes(time)
    }))

    return NextResponse.json({ timeSlots: availableTimeSlots })
  } catch (error) {
    console.error('Availability API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}