'use client'

import { useEffect, useRef, useState } from 'react'
import { Booking } from '@/lib/types'
import { formatDisplayDate, formatTime } from '@/lib/utils'

interface BookingMapProps {
  bookings: Booking[]
  height?: number
}

export function BookingMap({ bookings, height = 400 }: BookingMapProps) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isClient, setIsClient] = useState(false)
  const [L, setL] = useState<any>(null)

  useEffect(() => {
    setIsClient(true)
    
    // Dynamically import Leaflet only on client side
    const loadLeaflet = async () => {
      try {
        const leaflet = await import('leaflet')
        
        // Fix for default markers in Leaflet
        delete (leaflet.default.Icon.Default.prototype as any)._getIconUrl
        leaflet.default.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })
        
        setL(leaflet.default)
      } catch (error) {
        console.error('Failed to load Leaflet:', error)
      }
    }
    
    loadLeaflet()
  }, [])

  useEffect(() => {
    if (!containerRef.current || !L || !isClient || bookings.length === 0) return

    // Initialize map
    const map = L.map(containerRef.current).setView([40.7128, -74.0060], 10)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map)

    // Add markers for each booking
    const markers: any[] = []
    bookings.forEach((booking) => {
      if (booking.latitude && booking.longitude) {
        const marker = L.marker([booking.latitude, booking.longitude]).addTo(map)
        
        // Create popup content
        const popupContent = `
          <div class="p-2">
            <div class="font-semibold">${booking.name}</div>
            <div class="text-sm text-gray-600">
              ${formatDisplayDate(booking.date)} at ${formatTime(booking.time)}
            </div>
            <div class="text-sm text-gray-600">${booking.contact}</div>
            ${booking.notes ? `<div class="text-sm text-gray-600 mt-1">Notes: ${booking.notes}</div>` : ''}
            ${booking.address ? `<div class="text-xs text-gray-500 mt-1">${booking.address}</div>` : ''}
          </div>
        `
        
        marker.bindPopup(popupContent)
        markers.push(marker)
      }
    })

    // Fit map to show all markers
    if (markers.length > 0) {
      const group = new L.FeatureGroup(markers)
      map.fitBounds(group.getBounds().pad(0.1))
    }

    mapRef.current = map

    return () => {
      if (map) {
        map.remove()
      }
    }
  }, [bookings, L, isClient])

  if (!isClient) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

  if (bookings.length === 0) {
    return (
      <div 
        className="bg-gray-100 rounded-lg flex items-center justify-center"
        style={{ height: `${height}px` }}
      >
        <div className="text-gray-500">No locations to display</div>
      </div>
    )
  }

  return (
    <div 
      ref={containerRef} 
      className="w-full rounded-lg"
      style={{ height: `${height}px` }}
    />
  )
}