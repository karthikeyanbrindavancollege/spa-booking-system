'use client'

import { useState } from 'react'
import { useToast } from '@/components/ui/Toast'

export default function TestEmailPage() {
  const [isLoading, setIsLoading] = useState(false)
  const { addToast } = useToast()

  const testEmails = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerEmail: 'customer@example.com', // Change this to your email for testing
          adminEmail: 'admin@example.com' // Change this to your admin email
        })
      })

      const result = await response.json()
      
      if (response.ok) {
        addToast('Test emails sent successfully!', 'success')
        console.log('Email results:', result)
      } else {
        addToast(result.error || 'Failed to send test emails', 'error')
      }
    } catch (error) {
      console.error('Error testing emails:', error)
      addToast('Failed to send test emails', 'error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Email Testing</h1>
          
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Before Testing:</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Set up your Resend API key in .env.local</li>
                <li>• Update FROM_EMAIL with your verified domain</li>
                <li>• Update ADMIN_EMAIL with your email address</li>
                <li>• Change customer email in the code to your email</li>
              </ul>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-900 mb-2">What This Tests:</h3>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Customer confirmation email template</li>
                <li>• Admin notification email template</li>
                <li>• Email delivery functionality</li>
              </ul>
            </div>

            <button
              onClick={testEmails}
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  <span>Sending Test Emails...</span>
                </div>
              ) : (
                'Send Test Emails'
              )}
            </button>

            <div className="text-xs text-gray-500 text-center">
              Check your email inbox and spam folder after clicking the button
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}