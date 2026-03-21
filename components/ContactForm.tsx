'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const contactSchema = z.object({
  email: z.string().email('Please enter a valid email address').optional().or(z.literal('')),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').regex(/^\d+$/, 'Phone number must contain only digits'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
  name: z.string().min(2, 'Name must be at least 2 characters long')
})

type ContactFormData = z.infer<typeof contactSchema>

interface ContactFormProps {
  onClose?: () => void
}

export default function ContactForm({ onClose }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isPhoneVerified, setIsPhoneVerified] = useState(false)
  const [sentCode, setSentCode] = useState('')
  const [showVerification, setShowVerification] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    reset
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema)
  })

  const sendVerificationCode = async () => {
    const phone = getValues('phone')
    if (!phone || phone.length < 10) {
      alert('Please enter a valid phone number first')
      return
    }

    setIsVerifying(true)
    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, action: 'send' }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setSentCode(data.code) // For demo - remove in production
        setShowVerification(true)
        if (data.code) {
          alert(`Verification code sent to ${phone}. Development Code: ${data.code}`)
          console.log(`📱 Verification code for ${phone}: ${data.code}`)
        } else {
          alert(`Verification code sent to ${phone}`)
        }
      } else {
        throw new Error(data.error || 'Failed to send verification code')
      }
    } catch (error) {
      alert('Failed to send verification code. Please try again.')
    } finally {
      setIsVerifying(false)
    }
  }

  const verifyCode = async () => {
    const phone = getValues('phone')
    
    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone, action: 'verify', code: verificationCode }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsPhoneVerified(true)
        setShowVerification(false)
        alert('Phone number verified successfully!')
      } else {
        alert(data.error || 'Invalid verification code. Please try again.')
      }
    } catch (error) {
      alert('Verification failed. Please try again.')
    }
  }

  const onSubmit = async (data: ContactFormData) => {
    if (!isPhoneVerified) {
      alert('Please verify your phone number first')
      return
    }

    setIsSubmitting(true)
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        alert('Message sent successfully! We will contact you soon.')
        reset()
        setIsPhoneVerified(false)
        setShowVerification(false)
        onClose?.()
      } else {
        throw new Error('Failed to send message')
      }
    } catch (error) {
      alert('Failed to send message. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Contact Us</h2>
        {onClose && (
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ×
          </button>
        )}
      </div>



      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your full name"
          />
          {errors.name && (
            <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email (Optional)
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="your.email@example.com"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number *
          </label>
          <div className="flex gap-2">
            <input
              {...register('phone')}
              type="tel"
              id="phone"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your phone number"
              disabled={isPhoneVerified}
            />
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={isVerifying || isPhoneVerified}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm"
            >
              {isPhoneVerified ? '✓ Verified' : isVerifying ? 'Sending...' : 'Verify'}
            </button>
          </div>
          {errors.phone && (
            <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>

        {showVerification && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>
              {process.env.NODE_ENV === 'development' && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                  DEV MODE
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <button
                type="button"
                onClick={verifyCode}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm"
              >
                Verify
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-600">
              {process.env.NODE_ENV === 'development' 
                ? 'In development mode, check the alert or browser console for the verification code'
                : 'Check your SMS for the verification code'
              }
            </p>
          </div>
        )}

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message *
          </label>
          <textarea
            {...register('message')}
            id="message"
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Tell us how we can help you..."
          />
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !isPhoneVerified}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}