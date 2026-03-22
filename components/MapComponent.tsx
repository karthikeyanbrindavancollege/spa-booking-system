'use client'

import { useEffect, useRef, useState } from 'react'

interface MapComponentProps {
  coordinates: { lat: number; lng: number } | null
  onMapClick: (lat: number, lng: number) => void
}

export default function MapComponent({ coordinates, onMapClick }: MapComponentProps) {
  const mapRef = useRef<any>(null)
  const markerRef = useRef<any>(null)
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
    if (!containerRef.current || !L || !isClient) return

    // Clear any existing map instance
    if (mapRef.current) {
      mapRef.current.remove()
      mapRef.current = null
    }

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      if (!containerRef.current || !L) return

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
        map.on('click', (e: any) => {
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
  }, [onMapClick, L, isClient])

  useEffect(() => {
    if (!mapRef.current || !L) return

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
  }, [coordinates, L])

  if (!isClient) {
    return (
      <div className="h-64 w-full rounded-lg bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    )
  }

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