'use client'

import { useState, useEffect } from 'react'
import { format, addDays, startOfWeek } from 'date-fns'
import { generateTimeSlots, formatDisplayDate } from '@/lib/utils'
import { Availability } from '@/lib/types'
import { useToast } from '../ui/Toast'
import { useConfirm } from '../ui/ConfirmDialog'

export function AvailabilityManager() {
  const [availability, setAvailability] = useState<Availability[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<string>('')
  const [timeSlots, setTimeSlots] = useState<string[]>(generateTimeSlots())
  const { addToast } = useToast()
  const { confirm } = useConfirm()

  useEffect(() => {
    fetchAvailability()
  }, [])

  const fetchAvailability = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/availability', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAvailability(data.availability || [])
      }
    } catch (error) {
      console.error('Error fetching availability:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateAvailability = async (date: string, slots: string[], isBlocked: boolean) => {
    try {
      const response = await fetch('/api/admin/availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('admin_token')}`
        },
        body: JSON.stringify({
          date,
          time_slots: slots,
          is_blocked: isBlocked
        })
      })

      if (response.ok) {
        fetchAvailability()
        addToast('Availability updated successfully', 'success')
      } else {
        addToast('Failed to update availability', 'error')
      }
    } catch (error) {
      console.error('Error updating availability:', error)
      addToast('Failed to update availability', 'error')
    }
  }

  const toggleDateBlock = async (date: string) => {
    const existing = availability.find(a => a.date === date)
    const isCurrentlyBlocked = existing?.is_blocked || false
    
    await updateAvailability(
      date, 
      existing?.time_slots || generateTimeSlots(), 
      !isCurrentlyBlocked
    )
  }

  const updateTimeSlots = async (date: string, slots: string[]) => {
    const existing = availability.find(a => a.date === date)
    await updateAvailability(date, slots, existing?.is_blocked || false)
  }

  // Generate next 14 days for management
  const managementDates = Array.from({ length: 14 }, (_, i) => {
    const date = addDays(new Date(), i)
    return format(date, 'yyyy-MM-dd')
  })

  const getAvailabilityForDate = (date: string) => {
    return availability.find(a => a.date === date)
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <h2 className="text-xl font-semibold mb-6">Manage Availability</h2>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="spinner" />
          </div>
        ) : (
          <div className="space-y-4">
            {managementDates.map((date) => {
              const dateAvailability = getAvailabilityForDate(date)
              const isBlocked = dateAvailability?.is_blocked || false
              const availableSlots = dateAvailability?.time_slots || generateTimeSlots()

              return (
                <div key={date} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="font-medium">{formatDisplayDate(date)}</div>
                      <div className="text-sm text-gray-600">
                        {availableSlots.length} slots available
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <label className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={isBlocked}
                          onChange={() => toggleDateBlock(date)}
                          className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                        />
                        <span className="text-sm text-gray-700">Block entire day</span>
                      </label>
                    </div>
                  </div>

                  {!isBlocked && (
                    <div>
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Available Time Slots:
                      </div>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {generateTimeSlots().map((slot) => {
                          const isSelected = availableSlots.includes(slot)
                          return (
                            <button
                              key={slot}
                              onClick={() => {
                                const newSlots = isSelected
                                  ? availableSlots.filter(s => s !== slot)
                                  : [...availableSlots, slot].sort()
                                updateTimeSlots(date, newSlots)
                              }}
                              className={`text-xs py-2 px-3 rounded border transition-colors ${
                                isSelected
                                  ? 'border-primary-500 bg-primary-50 text-primary-700'
                                  : 'border-gray-200 hover:border-gray-300 text-gray-600'
                              }`}
                            >
                              {slot}
                            </button>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {isBlocked && (
                    <div className="text-center py-4 text-red-600 bg-red-50 rounded">
                      This day is blocked - no appointments available
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Bulk Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold mb-4">Bulk Actions</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={async () => {
              const confirmed = await confirm('Set default hours (9 AM - 5 PM) for all upcoming days?')
              if (confirmed) {
                managementDates.forEach(date => {
                  updateAvailability(date, generateTimeSlots(), false)
                })
              }
            }}
            className="btn-secondary"
          >
            Set Default Hours for All Days
          </button>
          
          <button
            onClick={async () => {
              const confirmed = await confirm('Block all weekends for the next 2 weeks?')
              if (confirmed) {
                managementDates.forEach(date => {
                  const dayOfWeek = new Date(date).getDay()
                  if (dayOfWeek === 0 || dayOfWeek === 6) { // Sunday or Saturday
                    updateAvailability(date, [], true)
                  }
                })
              }
            }}
            className="btn-secondary"
          >
            Block All Weekends
          </button>
        </div>
      </div>
    </div>
  )
}