'use client'

import Link from 'next/link'
import { formatDisplayDate, formatTime } from '@/lib/utils'
import { BookingFormData } from '@/lib/types'

interface BookingConfirmationProps {
  selectedSlot: { date: string; time: string }
  formData: BookingFormData
  bookingId: string
  onBack: () => void
}

export function BookingConfirmation({ 
  selectedSlot, 
  formData, 
  bookingId,
  onBack 
}: BookingConfirmationProps) {
  return (
    <div className="space-y-6">
      {/* Success Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Booking Confirmed!
        </h1>
        <p className="text-gray-600">
          Your appointment has been successfully scheduled
        </p>
      </div>

      {/* Booking Details */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Appointment Details
        </h2>
        
        <div className="space-y-4">
          {/* Date & Time */}
          <div className="flex items-center space-x-3 p-3 bg-primary-50 rounded-lg">
            <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <div className="font-semibold text-primary-900">
                {formatDisplayDate(selectedSlot.date)}
              </div>
              <div className="text-primary-700">
                {formatTime(selectedSlot.time)}
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="space-y-3">
            <div className="flex justify-between items-start">
              <span className="text-gray-600 flex-shrink-0">Name:</span>
              <span className="font-medium text-right">{formData.name}</span>
            </div>
            {formData.email && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span className="text-gray-600 flex-shrink-0">Email:</span>
                <span className="font-medium break-all text-right">{formData.email}</span>
              </div>
            )}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
              <span className="text-gray-600 flex-shrink-0">Contact:</span>
              <span className="font-medium break-all text-right">{formData.contact}</span>
            </div>
            {formData.notes && (
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                <span className="text-gray-600 flex-shrink-0">Notes:</span>
                <span className="font-medium break-words text-right">{formData.notes}</span>
              </div>
            )}
          </div>

          {/* Location */}
          {formData.address && (
            <div className="border-t pt-3">
              <div className="flex items-start space-x-3">
                <div className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0">
                  <svg fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-600">Location:</div>
                  <div className="text-sm font-medium break-words">{formData.address}</div>
                </div>
              </div>
            </div>
          )}

          {/* Booking ID */}
          <div className="border-t pt-3">
            <div className="text-xs text-gray-500">
              Booking ID: <span className="font-mono">{bookingId}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Next Steps */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-3">What's Next?</h3>
        <div className="space-y-2 text-sm text-blue-800">
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            <span>Confirmation email sent to your email address</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            <span>We'll contact you if any changes are needed</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
            <span>Please be available at your location during the appointment time</span>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link 
          href="/"
          className="block w-full btn-primary text-center"
        >
          Back to Home
        </Link>
        
        <div className="flex space-x-3">
          {/* <button
            onClick={onBack}
            className="flex-1 btn-secondary text-sm"
          >
            Edit Details
          </button> */}
          <Link 
            href="/book"
            className="flex-1 btn-secondary text-center text-sm"
          >
            Book Another
          </Link>
        </div>
      </div>

      {/* Contact Info */}
      <div className="text-center text-sm text-gray-500">
        <p>Need to make changes?</p>
        {/* <p className="mt-1">
          <a href="mailto:contact@example.com" className="text-primary-600 hover:underline">
            Contact us directly
          </a>
        </p> */}
      </div>
    </div>
  )
}