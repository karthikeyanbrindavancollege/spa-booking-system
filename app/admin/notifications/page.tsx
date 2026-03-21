'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface EmailNotification {
  id: string
  type: string
  recipient_email: string
  recipient_name: string
  subject: string
  content: string
  booking_id: string
  status: string
  created_at: string
}

interface BookingConfirmation {
  id: string
  booking_id: string
  customer_name: string
  customer_contact: string
  customer_email: string
  appointment_date: string
  appointment_time: string
  notes: string
  address: string
  confirmed_at: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<EmailNotification[]>([])
  const [confirmations, setConfirmations] = useState<BookingConfirmation[]>([])
  const [activeTab, setActiveTab] = useState<'notifications' | 'confirmations'>('confirmations')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setLoading(true)
    
    // Fetch email notifications
    const { data: notificationsData } = await supabase
      .from('email_notifications')
      .select('*')
      .order('created_at', { ascending: false })

    // Fetch booking confirmations
    const { data: confirmationsData } = await supabase
      .from('booking_confirmations')
      .select('*')
      .order('confirmed_at', { ascending: false })

    setNotifications(notificationsData || [])
    setConfirmations(confirmationsData || [])
    setLoading(false)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'customer_confirmation': return 'bg-green-100 text-green-800'
      case 'admin_notification': return 'bg-blue-100 text-blue-800'
      case 'customer_update': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading notifications...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Email Notifications & Confirmations</h1>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('confirmations')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'confirmations'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Booking Confirmations ({confirmations.length})
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Email Notifications ({notifications.length})
              </button>
            </nav>
          </div>
        </div>

        {/* Booking Confirmations Tab */}
        {activeTab === 'confirmations' && (
          <div className="space-y-4">
            {confirmations.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No booking confirmations yet.</p>
              </div>
            ) : (
              confirmations.map((confirmation) => (
                <div key={confirmation.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {confirmation.customer_name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        📞 {confirmation.customer_contact}
                        {confirmation.customer_email && (
                          <span className="ml-4">📧 {confirmation.customer_email}</span>
                        )}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(confirmation.confirmed_at)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700">📅 Appointment</p>
                      <p className="text-sm text-gray-900">
                        {confirmation.appointment_date} at {confirmation.appointment_time}
                      </p>
                    </div>
                    
                    {confirmation.address && (
                      <div>
                        <p className="text-sm font-medium text-gray-700">📍 Location</p>
                        <p className="text-sm text-gray-900">{confirmation.address}</p>
                      </div>
                    )}
                  </div>
                  
                  {confirmation.notes && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-700">📝 Notes</p>
                      <p className="text-sm text-gray-900">{confirmation.notes}</p>
                    </div>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500">
                    Booking ID: {confirmation.booking_id}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Email Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="space-y-4">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">No email notifications yet.</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div key={notification.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(notification.type)}`}>
                          {notification.type.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-600">
                          to {notification.recipient_name} ({notification.recipient_email})
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        {notification.subject}
                      </h3>
                    </div>
                    <span className="text-xs text-gray-500">
                      {formatDate(notification.created_at)}
                    </span>
                  </div>
                  
                  <div className="bg-gray-50 rounded p-4">
                    <pre className="text-sm text-gray-700 whitespace-pre-wrap font-sans">
                      {notification.content}
                    </pre>
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
                    <span>Booking ID: {notification.booking_id}</span>
                    <span className={`px-2 py-1 rounded ${
                      notification.status === 'sent' ? 'bg-green-100 text-green-800' :
                      notification.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {notification.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Refresh Button */}
        <div className="mt-8 text-center">
          <button
            onClick={fetchData}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Refresh Data
          </button>
        </div>
      </div>
    </div>
  )
}