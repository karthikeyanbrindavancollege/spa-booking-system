import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return false
  }

  const token = authHeader.substring(7)
  const { data: session } = await supabaseAdmin
    .from('admin_sessions')
    .select('*')
    .eq('session_token', token)
    .gt('expires_at', new Date().toISOString())
    .single()

  return !!session
}

export async function GET(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: availability, error } = await supabaseAdmin
      .from('availability')
      .select('*')
      .order('date', { ascending: true })

    if (error) {
      console.error('Error fetching availability:', error)
      return NextResponse.json({ error: 'Failed to fetch availability' }, { status: 500 })
    }

    return NextResponse.json({ availability })
  } catch (error) {
    console.error('Availability API error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!(await verifyAdmin(request))) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { date, time_slots, is_blocked } = await request.json()

    if (!date) {
      return NextResponse.json({ error: 'Date is required' }, { status: 400 })
    }

    // Upsert availability
    const { error } = await supabaseAdmin
      .from('availability')
      .upsert({
        date,
        time_slots: time_slots || [],
        is_blocked: is_blocked || false
      }, {
        onConflict: 'date'
      })

    if (error) {
      console.error('Error updating availability:', error)
      return NextResponse.json({ error: 'Failed to update availability' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Availability updated successfully' })
  } catch (error) {
    console.error('Availability update error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}