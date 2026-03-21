'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

interface MapComponentProps {
  coordinates: { lat: number; lng: number } | null
  onMapClick: (lat: number, lng: number) => void
}

export default function MapComponent({ coordinates, onMapClick }: MapComponentProps) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Clear any existing map instance
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!containerRef.current) return

      try {
        // Initialize map centered on Bangalore
        const map = L.map(containerRef.current, {
          center: [12.9716, 77.5946],
          zoom: 11,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          boxZoom: true,
          keyboard: true,
          dragging: true,
          touchZoom: true
        })

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 19
        }).addTo(map)

        // Handle map clicks
        map.on('click', (e) => {
          const { lat, lng } = e.latlng
          onMapClick(lat, lng)
        })

        mapRef.current = map

        // Force map to invalidate size after initialization
        setTimeout(() => {
          if (map) {
            map.invalidateSize()
          }
        }, 100)
      } catch (error) {
        console.error('Map initialization error:', error)
      }
    }, 100)

    return () => {
      clearTimeout(timer)
      if (mapRef.current) {
        try {
          mapRef.current.remove()
        } catch (error) {
          console.error('Map cleanup error:', error)
        }
        mapRef.current = null
      }
    }
  }, [onMapClick])

  useEffect(() => {
    if (!mapRef.current) return

    try {
      if (coordinates) {
        // Remove existing marker
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current)
          markerRef.current = null
        }

        // Add new marker
        const marker = L.marker([coordinates.lat, coordinates.lng]).addTo(mapRef.current)
        markerRef.current = marker

        // Center map on coordinates
        mapRef.current.setView([coordinates.lat, coordinates.lng], 15)
      } else {
        // Remove marker if no coordinates
        if (markerRef.current) {
          mapRef.current.removeLayer(markerRef.current)
          markerRef.current = null
        }
      }
    } catch (error) {
      console.error('Map marker error:', error)
    }
  }, [coordinates])

  return (
    <div 
      ref={containerRef} 
      className="h-64 w-full rounded-lg bg-gray-100"
      style={{ 
        minHeight: '256px',
        position: 'relative',
        zIndex: 0
      }}
    />
  )
}