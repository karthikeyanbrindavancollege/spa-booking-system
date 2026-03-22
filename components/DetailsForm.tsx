'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { LocationPicker } from './LocationPicker'
import { formatDisplayDate, formatTime } from '@/lib/utils'
import { BookingFormData, LocationData } from '@/lib/types'
import { useToast } from './ui/Toast'

const bookingSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  mobile: z.string().min(10, 'Mobile number must be at least 10 digits').regex(/^\d+$/, 'Mobile number must contain only digits'),
  notes: z.string().optional(),
}).refine((data) => true, {
  message: 'Location is required',
  path: ['location']
})

interface DetailsFormProps {
  selectedSlot: { date: string; time: string }
  onSubmit: (data: BookingFormData, bookingId: string) => void
  onBack: () => void
  isEditMode?: boolean
  existingBookingId?: string | null
  initialData?: BookingFormData | null
}

export function DetailsForm({ 
  selectedSlot, 
  onSubmit, 
  onBack, 
  isEditMode = false,
  existingBookingId = null,
  initialData = null
}: DetailsFormProps) {
  const [location, setLocation] = useState<LocationData | null>(
    initialData ? {
      address: initialData.address || '',
      latitude: initialData.latitude || 0,
      longitude: initialData.longitude || 0
    } : null
  )
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [isMobileVerified, setIsMobileVerified] = useState(false)
  const [showVerification, setShowVerification] = useState(false)
  const [isAutoDetecting, setIsAutoDetecting] = useState(false)
  const [supportsWebOTP, setSupportsWebOTP] = useState(false)
  const [locationError, setLocationError] = useState<string>('')
  const [clientPhoto, setClientPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [photoError, setPhotoError] = useState<string>('')
  const { addToast } = useToast()

  // Check if browser supports Web OTP API
  useEffect(() => {
    // Temporarily disabled
    // if ('OTPCredential' in window) {
    //   setSupportsWebOTP(true)
    // }
  }, [])

  /* COMMENTED OUT - Auto-detection temporarily disabled
  // Auto-detect SMS codes using Web OTP API
  const startAutoDetection = async () => {
    if (!supportsWebOTP) return

    setIsAutoDetecting(true)
    try {
      // Create abort controller for timeout
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 60000) // 1 minute timeout
      
      // Use any type to bypass TypeScript limitations for Web OTP API
      const credentials = navigator.credentials as any
      const otp = await credentials.get({
        otp: { transport: ['sms'] },
        signal: controller.signal
      })
      
      clearTimeout(timeoutId)
      
      if (otp && otp.code) {
        setVerificationCode(otp.code)
        addToast('SMS code auto-detected!', 'success')
        // Auto-verify the code
        await verifyCodeWithValue(otp.code)
      }
    } catch (error) {
      console.log('Auto-detection failed or cancelled:', error)
    } finally {
      setIsAutoDetecting(false)
    }
  }

  // Verify code with a specific value (for auto-detection)
  const verifyCodeWithValue = async (codeValue: string) => {
    const mobile = getValues('mobile')
    
    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: mobile, action: 'verify', code: codeValue }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsMobileVerified(true)
        setShowVerification(false)
        addToast('Mobile number verified successfully!', 'success')
      } else {
        addToast(data.error || 'Invalid verification code. Please try again.', 'error')
      }
    } catch (error) {
      addToast('Verification failed. Please try again.', 'error')
    }
  }
  */

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      name: initialData?.name || '',
      email: '', // Email is always required for new bookings
      mobile: initialData?.contact || '',
      notes: initialData?.notes || '',
    }
  })

  const sendVerificationCode = async () => {
    const mobile = getValues('mobile')
    if (!mobile || mobile.length < 10) {
      addToast('Please enter a valid mobile number first', 'error')
      return
    }

    // Temporarily disable verification - auto-approve mobile numbers
    setIsMobileVerified(true)
    addToast('Mobile number accepted (verification temporarily disabled)', 'success')
    
    /* COMMENTED OUT - Mobile verification temporarily disabled
    setIsVerifying(true)
    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: mobile, action: 'send', method: 'smart' }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setShowVerification(true)
        addToast(`Verification initiated for ${mobile}`, 'success')
        
        // Show the verification code if provided
        if (data.displayCode) {
          addToast(`Your verification code: ${data.displayCode}`, 'info')
        }
        
        // Show method-specific instructions
        if (data.method === 'smart') {
          addToast('Smart verification: Code is based on your phone number pattern', 'info')
        }

        // Start auto-detection if supported
        if (supportsWebOTP) {
          addToast('Auto-detection enabled - SMS codes will be detected automatically', 'info')
          startAutoDetection()
        }
      } else {
        const errorData = await response.json()
        addToast(errorData.error || 'Failed to send verification code', 'error')
        throw new Error(errorData.error || 'Failed to send verification code')
      }
    } catch (error) {
      addToast('Failed to send verification code. Please try again.', 'error')
    } finally {
      setIsVerifying(false)
    }
    */
  }

  const verifyCode = async () => {
    const mobile = getValues('mobile')
    
    try {
      const response = await fetch('/api/verify-phone', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phone: mobile, action: 'verify', code: verificationCode }),
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsMobileVerified(true)
        setShowVerification(false)
        addToast('Mobile number verified successfully!', 'success')
      } else {
        addToast(data.error || 'Invalid verification code. Please try again.', 'error')
      }
    } catch (error) {
      addToast('Verification failed. Please try again.', 'error')
    }
  }

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setPhotoError('Please select a valid image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError('Image size must be less than 5MB')
      return
    }

    setPhotoError('')
    setClientPhoto(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const removePhoto = () => {
    setClientPhoto(null)
    setPhotoPreview('')
    setPhotoError('')
  }

  const onFormSubmit = async (data: z.infer<typeof bookingSchema>) => {
    if (!isMobileVerified) {
      addToast('Please verify your mobile number first', 'error')
      return
    }

    if (!location || !location.address) {
      setLocationError('Please select your location')
      addToast('Location is required to proceed', 'error')
      return
    }

    if (!clientPhoto) {
      setPhotoError('Please upload your photo for verification')
      addToast('Client photo is required for booking', 'error')
      return
    }

    setLocationError('')
    setPhotoError('')
    setIsSubmitting(true)

    try {
      const bookingData: BookingFormData = {
        name: data.name,
        contact: data.mobile,
        notes: data.notes,
        address: location?.address,
        latitude: location?.latitude,
        longitude: location?.longitude,
      }

      if (isEditMode && existingBookingId) {
        // Update existing booking
        const response = await fetch(`/api/bookings/${existingBookingId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...bookingData,
            email: data.email
          }),
        })

        const result = await response.json()

        if (response.ok) {
          addToast('Booking updated successfully!', 'success')
          onSubmit(bookingData, existingBookingId)
        } else {
          addToast(result.error || 'Failed to update booking', 'error')
        }
      } else {
        // Create new booking with photo upload
        const formData = new FormData()
        formData.append('name', data.name)
        formData.append('email', data.email)
        formData.append('contact', data.mobile)
        formData.append('date', selectedSlot.date)
        formData.append('time', selectedSlot.time)
        formData.append('notes', data.notes || '')
        formData.append('address', location.address)
        formData.append('latitude', location.latitude.toString())
        formData.append('longitude', location.longitude.toString())
        formData.append('clientPhoto', clientPhoto)

        const response = await fetch('/api/bookings', {
          method: 'POST',
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          onSubmit(bookingData, result.id)
        } else {
          addToast(result.error || 'Failed to create booking', 'error')
        }
      }
    } catch (error) {
      console.error('Error with booking:', error)
      addToast('Failed to process booking. Please try again.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {isEditMode ? 'Edit Your Details' : 'Enter Your Details'}
        </h1>
        <p className="text-gray-600">
          {isEditMode 
            ? 'Update your information for this appointment' 
            : 'We\'ll need some information to confirm your appointment'
          }
        </p>
      </div>

      {/* Selected Time Summary */}
      <div className="card bg-primary-50 border-primary-200">
        <div className="flex items-center space-x-3">
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
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
        {/* Name */}
        <div className="card">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Full Name *
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className="input-field"
            placeholder="Enter your full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="card">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            Email Address *
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className="input-field"
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            We'll send booking confirmations and updates to this email
          </p>
        </div>

        {/* Mobile Number - Verification Temporarily Disabled */}
        <div className="card">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-2">
            Mobile Number *
          </label>
          {/* Simple input without verification button */}
          <input
            {...register('mobile')}
            type="tel"
            id="mobile"
            className="input-field"
            placeholder="Enter your mobile number"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-600">{errors.mobile.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            We'll use this to send booking confirmations and updates
          </p>
          
          {/* COMMENTED OUT - Verification button temporarily disabled
          <div className="flex gap-2">
            <input
              {...register('mobile')}
              type="tel"
              id="mobile"
              className="flex-1 input-field"
              placeholder="Enter your mobile number"
              disabled={isMobileVerified}
            />
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={isVerifying || isMobileVerified}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium transition-colors"
            >
              {isMobileVerified ? '✓ Verified' : isVerifying ? 'Sending...' : 'Verify'}
            </button>
          </div>
          */}
        </div>

        {/* Verification Code Input - TEMPORARILY DISABLED */}
        {/* 
        {showVerification && (
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="verification" className="block text-sm font-medium text-gray-700">
                Enter Verification Code
              </label>
              {isAutoDetecting && (
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded flex items-center gap-1">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Auto-detecting...
                </span>
              )}
              {supportsWebOTP && !isAutoDetecting && (
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                  📱 Auto-detect enabled
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                id="verification"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                className="flex-1 input-field"
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
              <button
                type="button"
                onClick={verifyCode}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm font-medium transition-colors"
              >
                Verify
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-600">
              {supportsWebOTP 
                ? '📱 SMS codes will be auto-detected on supported browsers. You can also enter manually.'
                : 'Check your SMS for the verification code. It may take a few moments to arrive.'
              }
            </p>
          </div>
        )}
        */}

        {/* Notes */}
        <div className="card">
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-2">
            Additional Notes (Optional)
          </label>
          <textarea
            {...register('notes')}
            id="notes"
            rows={3}
            className="input-field resize-none"
            placeholder="Any special requests or information..."
          />
        </div>

        {/* Client Photo */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Your Photo *
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            Please upload a clear photo of yourself for verification purposes
          </p>
          
          {!photoPreview ? (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="photo-upload"
              />
              <label htmlFor="photo-upload" className="cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span className="text-sm text-gray-600">Click to upload photo</span>
                  <span className="text-xs text-gray-500">PNG, JPG up to 5MB</span>
                </div>
              </label>
            </div>
          ) : (
            <div className="relative">
              <img
                src={photoPreview}
                alt="Client photo preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
              />
              <button
                type="button"
                onClick={removePhoto}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-sm text-green-800">Photo uploaded successfully</span>
                </div>
              </div>
            </div>
          )}
          
          {photoError && (
            <p className="mt-2 text-sm text-red-600">{photoError}</p>
          )}
        </div>

        {/* Location */}
        <div className="card">
          <h3 className="text-sm font-medium text-gray-700 mb-2">
            Your Location *
          </h3>
          <p className="text-xs text-gray-500 mb-4">
            We provide mobile spa services in Bangalore and surrounding areas only
          </p>
          <LocationPicker 
            onLocationSelect={(loc) => {
              setLocation(loc)
              setLocationError('')
            }} 
          />
          {locationError && (
            <p className="mt-2 text-sm text-red-600">{locationError}</p>
          )}
          {location && location.address && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-start space-x-2">
                <svg className="w-4 h-4 text-green-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-green-800">Location Selected</p>
                  <p className="text-xs text-green-700">{location.address}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 btn-secondary"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isMobileVerified || !location?.address || !clientPhoto}
            className="flex-1 btn-primary"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="spinner" />
                <span>{isEditMode ? 'Updating...' : 'Booking...'}</span>
              </div>
            ) : (
              isEditMode ? 'Update Booking' : 'Confirm Booking'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}