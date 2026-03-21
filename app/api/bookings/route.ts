import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { sendBookingEmails } from '@/lib/email'

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type')
    let bookingData: any = {}

    if (contentType?.includes('multipart/form-data')) {
      // Handle FormData (with file upload)
      const formData = await request.formData()
      
      bookingData = {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        contact: formData.get('contact') as string,
        date: formData.get('date') as string,
        time: formData.get('time') as string,
        notes: formData.get('notes') as string || '',
        address: formData.get('address') as string,
        latitude: parseFloat(formData.get('latitude') as string),
        longitude: parseFloat(formData.get('longitude') as string),
      }

      // Handle photo upload
      const photoFile = formData.get('clientPhoto') as File
      if (photoFile && photoFile.size > 0) {
        try {
          // Upload photo to Supabase Storage
          const fileExt = photoFile.name.split('.').pop()
          const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
          const filePath = `client-photos/${fileName}`

          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('bookings')
            .upload(filePath, photoFile, {
              contentType: photoFile.type,
              upsert: false
            })

          if (uploadError) {
            console.error('Photo upload error:', uploadError)
            return NextResponse.json({ error: 'Failed to upload photo' }, { status: 500 })
          }

          // Get public URL
          const { data: { publicUrl } } = supabase.storage
            .from('bookings')
            .getPublicUrl(filePath)

          bookingData.client_photo_url = publicUrl
        } catch (photoError) {
          console.error('Photo processing error:', photoError)
          return NextResponse.json({ error: 'Failed to process photo' }, { status: 500 })
        }
      }
    } else {
      // Handle JSON (backward compatibility)
      const body = await request.json()
      bookingData = body
    }

    const { name, email, contact, date, time, notes, address, latitude, longitude, client_photo_url } = bookingData

    // Validate required fields
    if (!name || !contact || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    if (!email) {
      return NextResponse.json({ error: 'Email address is required' }, { status: 400 })
    }

    // Check if slot is still available
    const { data: existingBooking } = await supabase
      .from('bookings')
      .select('id')
      .eq('date', date)
      .eq('time', time)
      .eq('status', 'confirmed')
      .single()

    if (existingBooking) {
      return NextResponse.json({ error: 'Time slot is no longer available' }, { status: 409 })
    }

    // Create booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert({
        name,
        email,
        contact,
        date,
        time,
        notes,
        address,
        latitude,
        longitude,
        client_photo_url,
        status: 'confirmed'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating booking:', error)
      return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
    }

    // Send confirmation emails
    try {
      const emailResults = await sendBookingEmails({
        booking,
        customerEmail: email
      })
      
      // Log email results but don't fail the booking if emails fail
      if (emailResults.errors.length > 0) {
        console.warn('Some emails failed to send:', emailResults.errors)
      }
      
      console.log('Email sending completed:', {
        customerEmailSent: !!emailResults.customerEmail,
        adminEmailSent: !!emailResults.adminEmail,
        errors: emailResults.errors
      })
    } catch (emailError) {
      console.error('Error sending emails:', emailError)
      // Don't fail the booking if email fails
    }

    return NextResponse.json({ 
      id: booking.id,
      message: 'Booking created successfully' 
    })
  } catch (error) {
    console.error('Booking API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true })

    if (error) {
      console.error('Error fetching bookings:', error)
      return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
    }

    return NextResponse.json({ bookings })
  } catch (error) {
    console.error('Bookings API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}