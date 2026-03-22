'use client'

import { useState, useEffect } from 'react'
import { AdminLogin } from './AdminLogin'
import { BookingsList } from './BookingsList'
import { AvailabilityManager } from './AvailabilityManager'
import { Booking } from '@/lib/types'

type AdminView = 'bookings' | 'availability'

export function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentView, setCurrentView] = useState<AdminView>('bookings')
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already authenticated
    const token = localStorage.getItem('admin_token')
    if (token) {
      verifyToken(token)
    }
  }, [])

  const verifyToken = async (token: string) => {
    try {
      const response = await fetch('/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        setIsAuthenticated(true)
        fetchBookings()
      } else {
        localStorage.removeItem('admin_token')
      }
    } catch (error) {
      console.error('Token verification failed:', error)
      localStorage.removeItem('admin_token')
    }
  }

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/bookings')
      const data = await response.json()
      
      if (response.ok) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogin = (token: string) => {
    localStorage.setItem('admin_token', token)
    setIsAuthenticated(true)
    fetchBookings()
  }

  const handleLogout = () => {
    localStorage.removeItem('admin_token')
    setIsAuthenticated(false)
    setBookings([])
  }

  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <button
              onClick={handleLogout}
              className="text-sm text-gray-600 hover:text-gray-900 px-3 py-1 rounded-md hover:bg-gray-100"
            >
              Logout
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-4 md:space-x-6 mt-4 overflow-x-auto">
            <button
              onClick={() => setCurrentView('bookings')}
              className={`pb-2 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${
                currentView === 'bookings'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Bookings ({bookings.length})
            </button>
            <button
              onClick={() => setCurrentView('availability')}
              className={`pb-2 border-b-2 transition-colors whitespace-nowrap text-sm md:text-base ${
                currentView === 'availability'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Availability
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-4 md:py-6">
        {currentView === 'bookings' && (
          <BookingsList 
            bookings={bookings} 
            onBookingUpdate={fetchBookings}
            loading={loading}
          />
        )}
        
        {currentView === 'availability' && (
          <AvailabilityManager />
        )}
      </div>
    </div>
  )
}