'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { LocationData } from '@/lib/types'
import { useToast } from './ui/Toast'

// Bangalore city boundaries (approximate)
const BANGALORE_BOUNDS = {
  north: 13.1986,
  south: 12.7343,
  east: 77.8006,
  west: 77.3910
}

// Extended boundaries for surrounding areas (roughly 50km radius)
const EXTENDED_BOUNDS = {
  north: 13.4500,
  south: 12.4500,
  east: 78.1000,
  west: 77.1000
}

// Function to check if coordinates are within service area
const isWithinServiceArea = (lat: number, lng: number): boolean => {
  return lat >= EXTENDED_BOUNDS.south && 
         lat <= EXTENDED_BOUNDS.north && 
         lng >= EXTENDED_BOUNDS.west && 
         lng <= EXTENDED_BOUNDS.east
}

// Dynamically import map component to avoid SSR issues
const MapComponent = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
      <div className="text-gray-500">Loading map...</div>
    </div>
  ),
})

interface LocationPickerProps {
  onLocationSelect: (location: LocationData | null) => void
}

export function LocationPicker({ onLocationSelect }: LocationPickerProps) {
  const [address, setAddress] = useState('')
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [mapKey, setMapKey] = useState(0)
  const { addToast } = useToast()

  const handleAddressSearch = async () => {
    if (!address.trim()) return

    setIsSearching(true)
    try {
      // Prioritize Bangalore results by adding it to the search query
      const searchQuery = address.includes('Bangalore') || address.includes('Bengaluru') 
        ? address 
        : `${address}, Bangalore, Karnataka, India`
      
      // Use Nominatim (OpenStreetMap) geocoding service (free alternative to Google)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=5&countrycodes=in`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        // Find the first result within service area
        let validResult = null
        for (const result of data) {
          const lat = parseFloat(result.lat)
          const lng = parseFloat(result.lon)
          
          if (isWithinServiceArea(lat, lng)) {
            validResult = result
            break
          }
        }

        if (validResult) {
          const lat = parseFloat(validResult.lat)
          const lng = parseFloat(validResult.lon)
          
          setCoordinates({ lat, lng })
          setAddress(validResult.display_name)
          
          onLocationSelect({
            address: validResult.display_name,
            latitude: lat,
            longitude: lng,
          })
        } else {
          addToast('Sorry, we only provide services in Bangalore and surrounding areas. Please select a location within our service area.', 'warning')
        }
      } else {
        addToast('Address not found. Please try a different search within Bangalore area.', 'warning')
      }
    } catch (error) {
      console.error('Geocoding error:', error)
      addToast('Failed to search address. Please try again.', 'error')
    } finally {
      setIsSearching(false)
    }
  }

  const handleMapClick = async (lat: number, lng: number) => {
    // Check if the clicked location is within service area
    if (!isWithinServiceArea(lat, lng)) {
      addToast('Sorry, we only provide services in Bangalore and surrounding areas. Please select a location within our service area.', 'warning')
      return
    }

    setCoordinates({ lat, lng })
    
    try {
      // Reverse geocoding to get address from coordinates
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      )
      const data = await response.json()
      
      if (data && data.display_name) {
        setAddress(data.display_name)
        onLocationSelect({
          address: data.display_name,
          latitude: lat,
          longitude: lng,
        })
      }
    } catch (error) {
      console.error('Reverse geocoding error:', error)
      // Still set coordinates even if reverse geocoding fails
      onLocationSelect({
        address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        latitude: lat,
        longitude: lng,
      })
    }
  }

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      addToast('Geolocation is not supported by this browser.', 'error')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        
        // Check if current location is within service area
        if (!isWithinServiceArea(lat, lng)) {
          addToast('Your current location is outside our service area. We only provide services in Bangalore and surrounding areas.', 'warning')
          return
        }
        
        handleMapClick(lat, lng)
      },
      (error) => {
        console.error('Geolocation error:', error)
        addToast('Unable to get your location. Please search for your address instead.', 'warning')
      }
    )
  }

  const clearLocation = () => {
    setAddress('')
    setCoordinates(null)
    setMapKey(prev => prev + 1) // Force map re-render
    onLocationSelect(null)
  }

  return (
    <div className="space-y-4">
      {/* Service Area Info */}
      <div className="text-xs text-gray-500 bg-blue-50 p-2 rounded-lg border border-blue-200">
        <div className="flex items-center space-x-1">
          <span>ℹ️</span>
          <span className="font-medium">Service Area:</span>
        </div>
        <div className="mt-1">We provide services in Bangalore and surrounding areas only.</div>
      </div>

      {/* Address Search */}
      <div className="flex space-x-2">
        <input
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address in Bangalore..."
          className="flex-1 input-field text-sm"
          onKeyPress={(e) => e.key === 'Enter' && handleAddressSearch()}
        />
        <button
          type="button"
          onClick={handleAddressSearch}
          disabled={isSearching || !address.trim()}
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 text-sm"
        >
          {isSearching ? '...' : 'Search'}
        </button>
      </div>

      {/* Quick Actions */}
      <div className="flex space-x-2">
        <button
          type="button"
          onClick={getCurrentLocation}
          className="flex-1 text-sm py-2 px-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          📍 Use Current Location
        </button>
        {coordinates && (
          <button
            type="button"
            onClick={clearLocation}
            className="text-sm py-2 px-3 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
          >
            Clear
          </button>
        )}
      </div>

      {/* Popular Areas */}
      <div className="space-y-2">
        <div className="text-sm font-medium text-gray-700">Popular Areas:</div>
        <div className="flex flex-wrap gap-2">
          {[
            'Koramangala, Bangalore',
            'Indiranagar, Bangalore', 
            'Whitefield, Bangalore',
            'Electronic City, Bangalore',
            'HSR Layout, Bangalore',
            'Jayanagar, Bangalore'
          ].map((area) => (
            <button
              key={area}
              type="button"
              onClick={() => {
                setAddress(area)
                // Trigger search after setting address
                setTimeout(() => {
                  const searchQuery = area
                  setIsSearching(true)
                  fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=in`)
                    .then(response => response.json())
                    .then(data => {
                      if (data && data.length > 0) {
                        const result = data[0]
                        const lat = parseFloat(result.lat)
                        const lng = parseFloat(result.lon)
                        
                        setCoordinates({ lat, lng })
                        setAddress(result.display_name)
                        
                        onLocationSelect({
                          address: result.display_name,
                          latitude: lat,
                          longitude: lng,
                        })
                      }
                    })
                    .catch(error => console.error('Quick search error:', error))
                    .finally(() => setIsSearching(false))
                }, 100)
              }}
              className="text-xs px-3 py-1 bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors"
            >
              {area.split(',')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <MapComponent
          key={`map-${mapKey}`}
          coordinates={coordinates}
          onMapClick={handleMapClick}
        />
      </div>

      {/* Selected Location Info */}
      {coordinates && (
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
          <div className="font-medium">Selected Location:</div>
          <div className="mt-1">{address}</div>
          <div className="text-xs text-gray-500 mt-1">
            {coordinates.lat.toFixed(6)}, {coordinates.lng.toFixed(6)}
          </div>
        </div>
      )}
    </div>
  )
}