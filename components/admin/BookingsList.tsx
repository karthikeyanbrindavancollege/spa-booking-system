'use client'

import { useState } from 'react'
import { formatDisplayDate, formatTime } from '@/lib/utils'
import { Booking } from '@/lib/types'
import { BookingMap } from './BookingMap'
import { useToast } from '../ui/Toast'
import { useConfirm } from '../ui/ConfirmDialog'

interface BookingsListProps {
  bookings: Booking[]
  onBookingUpdate: () => void
  loading: boolean
}

export function BookingsList({ bookings, onBookingUpdate, loading }: BookingsListProps) {
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null)
  const [showMap, setShowMap] = useState(false)
  const { addToast } = useToast()
  const { confirm } = useConfirm()

  const handleCancelBooking = async (bookingId: string) => {
    const confirmed = await confirm('Are you sure you want to cancel this booking?')
    if (!confirmed) {
      return
    }

    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      })

      if (response.ok) {
        onBookingUpdate()
        addToast('Booking cancelled successfully', 'success')
      } else {
        addToast('Failed to cancel booking', 'error')
      }
    } catch (error) {
      console.error('Error cancelling booking:', error)
      addToast('Failed to cancel booking', 'error')
    }
  }

  const bookingsWithLocation = bookings.filter(b => b.latitude && b.longitude)

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
        <div className="card">
          <div className="text-xl md:text-2xl font-bold text-primary-600">{bookings.length}</div>
          <div className="text-xs md:text-sm text-gray-600">Total Bookings</div>
        </div>
        <div className="card">
          <div className="text-xl md:text-2xl font-bold text-green-600">
            {bookings.filter(b => b.status === 'confirmed').length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">Confirmed</div>
        </div>
        <div className="card">
          <div className="text-xl md:text-2xl font-bold text-orange-600">
            {bookingsWithLocation.length}
          </div>
          <div className="text-xs md:text-sm text-gray-600">With Location</div>
        </div>
      </div>

      {/* Map Toggle */}
      {bookingsWithLocation.length > 0 && (
        <div className="flex justify-center md:justify-end">
          <button
            onClick={() => setShowMap(!showMap)}
            className="btn-secondary text-sm px-4 py-2"
          >
            {showMap ? 'Hide Map' : 'Show Map'}
          </button>
        </div>
      )}

      {/* Map */}
      {showMap && bookingsWithLocation.length > 0 && (
        <div className="card">
          <h3 className="text-base md:text-lg font-semibold mb-4">Booking Locations</h3>
          <BookingMap bookings={bookingsWithLocation} />
        </div>
      )}

      {/* Bookings List */}
      <div className="card">
        <div className="flex items-center justify-between mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-semibold">All Bookings</h2>
          <button
            onClick={onBookingUpdate}
            className="text-sm text-primary-600 hover:text-primary-700 px-2 py-1 rounded hover:bg-primary-50"
          >
            Refresh
          </button>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center py-8 md:py-12 text-gray-500">
            <svg className="w-8 h-8 md:w-12 md:h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 4v10m6-10v10m-6-4h6" />
            </svg>
            <p className="text-sm md:text-base">No bookings yet</p>
          </div>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {bookings.map((booking) => (
              <div
                key={booking.id}
                className={`border rounded-lg p-3 md:p-4 transition-all ${
                  booking.status === 'cancelled' 
                    ? 'border-red-200 bg-red-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="space-y-3">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="font-semibold text-gray-900 text-sm md:text-base truncate">
                          {booking.name}
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          booking.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {booking.status}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Details */}
                  <div className="space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-xs md:text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <span>📅</span>
                        <span className="font-medium">{formatDisplayDate(booking.date)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>🕐</span>
                        <span>{formatTime(booking.time)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span>📞</span>
                        <span>{booking.contact}</span>
                      </div>
                    </div>
                    
                    {/* Email */}
                    {booking.email && (
                      <div className="flex items-center space-x-1 text-xs md:text-sm text-gray-600">
                        <span>📧</span>
                        <span className="break-all">{booking.email}</span>
                      </div>
                    )}
                    
                    {/* Client Photo */}
                    {booking.client_photo_url && (
                      <div className="flex items-start space-x-2">
                        <span className="text-xs md:text-sm text-gray-600 flex-shrink-0 mt-1">📷 Photo:</span>
                        <div className="flex-1">
                          <img
                            src={booking.client_photo_url}
                            alt={`${booking.name}'s photo`}
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => window.open(booking.client_photo_url, '_blank')}
                          />
                          <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                        </div>
                      </div>
                    )}
                    
                    {booking.notes && (
                      <div className="text-xs md:text-sm text-gray-600">
                        <span className="font-medium">Notes:</span> {booking.notes}
                      </div>
                    )}
                    
                    {booking.address && (
                      <div className="flex items-start space-x-1 text-xs md:text-sm text-gray-600">
                        <span className="flex-shrink-0">📍</span>
                        <span className="flex-1 break-words">{booking.address}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-100">
                    {booking.latitude && booking.longitude && (
                      <button
                        onClick={() => setSelectedBooking(booking)}
                        className="text-xs px-3 py-1.5 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                      >
                        View Location
                      </button>
                    )}
                    
                    {booking.status === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking.id)}
                        className="text-xs px-3 py-1.5 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Location Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base md:text-lg font-semibold">Booking Location</h3>
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="text-gray-400 hover:text-gray-600 p-1"
                >
                  ✕
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="font-medium text-sm md:text-base">{selectedBooking.name}</div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {formatDisplayDate(selectedBooking.date)} at {formatTime(selectedBooking.time)}
                  </div>
                  {selectedBooking.email && (
                    <div className="text-xs md:text-sm text-gray-600 mt-1">
                      📧 {selectedBooking.email}
                    </div>
                  )}
                  <div className="text-xs md:text-sm text-gray-600 mt-1">
                    📞 {selectedBooking.contact}
                  </div>
                </div>
                
                {/* Client Photo in Modal */}
                {selectedBooking.client_photo_url && (
                  <div>
                    <div className="text-xs md:text-sm font-medium text-gray-700 mb-2">Client Photo:</div>
                    <img
                      src={selectedBooking.client_photo_url}
                      alt={`${selectedBooking.name}'s photo`}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg border border-gray-200 cursor-pointer hover:opacity-80 transition-opacity"
                      onClick={() => window.open(selectedBooking.client_photo_url, '_blank')}
                    />
                    <p className="text-xs text-gray-500 mt-1">Click to view full size</p>
                  </div>
                )}
                
                {selectedBooking.address && (
                  <div>
                    <div className="text-xs md:text-sm font-medium text-gray-700">Address:</div>
                    <div className="text-xs md:text-sm text-gray-600 break-words">{selectedBooking.address}</div>
                  </div>
                )}
                
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <BookingMap bookings={[selectedBooking]} height={250} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}