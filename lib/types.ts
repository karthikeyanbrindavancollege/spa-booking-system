export interface Booking {
  id: string
  name: string
  email?: string
  contact: string
  date: string
  time: string
  notes?: string
  address?: string
  latitude?: number
  longitude?: number
  client_photo_url?: string
  status: 'confirmed' | 'cancelled'
  created_at: string
}

export interface Availability {
  id: string
  date: string
  time_slots: string[]
  is_blocked: boolean
  created_at: string
}

export interface TimeSlot {
  time: string
  available: boolean
}

export interface BookingFormData {
  name: string
  contact: string
  email?: string
  notes?: string
  address?: string
  latitude?: number
  longitude?: number
}

export interface LocationData {
  address: string
  latitude: number
  longitude: number
}