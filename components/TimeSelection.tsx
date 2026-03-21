'use client'

import { useState, useEffect } from 'react'
import { format, addDays, isWeekend } from 'date-fns'
import { formatDisplayDate, formatTime } from '@/lib/utils'
import { TimeSlot } from '@/lib/types'

interface TimeSelectionProps {
  onTimeSelected: (date: string, time: string) => void
}

export function TimeSelection({ onTimeSelected }: TimeSelectionProps) {
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(false)
  const [availableDates, setAvailableDates] = useState<string[]>([])

  // Generate available dates (next 30 days, excluding weekends)
  useEffect(() => {
    console.log('Generating dates...') // Debug log
    const dates: string[] = []
    const today = new Date()
    
    for (let i = 0; i < 30; i++) {
      const date = addDays(today, i)
      if (!isWeekend(date)) {
        dates.push(format(date, 'yyyy-MM-dd'))
      }
    }
    
    console.log('Generated dates:', dates) // Debug log
    setAvailableDates(dates)
    if (dates.length > 0) {
      setSelectedDate(dates[0])
    }
  }, [])

  // Fetch available time slots for selected date
  useEffect(() => {
    if (!selectedDate) return

    const fetchTimeSlots = async () => {
      setLoading(true)
      try {
        const response = await fetch(`/api/availability?date=${selectedDate}`)
        const data = await response.json()
        
        if (response.ok) {
          setAvailableSlots(data.timeSlots || [])
        } else {
          console.error('Failed to fetch time slots:', data.error)
          setAvailableSlots([])
        }
      } catch (error) {
        console.error('Error fetching time slots:', error)
        setAvailableSlots([])
      } finally {
        setLoading(false)
      }
    }

    fetchTimeSlots()
  }, [selectedDate])

  const handleTimeSelect = (time: string) => {
    onTimeSelected(selectedDate, time)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Select Date & Time
        </h1>
        <p className="text-gray-600">
          Choose your preferred appointment slot
        </p>
      </div>

      {/* Date Selection */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Select Date
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {availableDates.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <p>Loading dates...</p>
            </div>
          ) : (
            availableDates.slice(0, 7).map((date) => (
              <button
                key={date}
                onClick={() => setSelectedDate(date)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 ${
                  selectedDate === date
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="font-medium">
                  {formatDisplayDate(date)}
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Available Times
          </h2>
          
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="spinner" />
            </div>
          ) : availableSlots.length > 0 ? (
            <div className="grid grid-cols-2 gap-3">
              {availableSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => handleTimeSelect(slot.time)}
                  disabled={!slot.available}
                  className={`p-3 rounded-lg border font-medium transition-all duration-200 ${
                    slot.available
                      ? 'border-gray-200 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-700'
                      : 'border-gray-100 bg-gray-50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {formatTime(slot.time)}
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No available slots for this date</p>
              <p className="text-sm mt-1">Please select another date</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}