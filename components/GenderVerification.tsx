'use client'

import { useState } from 'react'

interface GenderVerificationProps {
  onVerified: () => void
}

export function GenderVerification({ onVerified }: GenderVerificationProps) {
  const [selectedGender, setSelectedGender] = useState<string>('')
  const [showError, setShowError] = useState(false)

  const handleSubmit = () => {
    if (selectedGender === 'female') {
      onVerified()
    } else if (selectedGender === 'male') {
      setShowError(true)
    } else {
      alert('Please select your gender to continue')
    }
  }

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender)
    setShowError(false)
  }

  if (showError) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Women-Only Services
          </h2>
          <p className="text-gray-600 mb-4">
            We apologize, but Serenity free Spa exclusively provides services for women only. 
            Our treatments and facilities are designed specifically for female clients.
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Thank you for your understanding.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => window.location.href = '/'}
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Return to Homepage
          </button>
          <button
            onClick={() => {
              setSelectedGender('')
              setShowError(false)
            }}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to Serenity free Spa
        </h2>
        <p className="text-gray-600 mb-6">
          Our premium spa services are exclusively designed for women. 
          Please confirm your gender to continue with booking.
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Please select your gender *
          </label>
          <div className="space-y-3">
            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={selectedGender === 'female'}
                onChange={(e) => handleGenderChange(e.target.value)}
                className="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">♀️</span>
                <span className="font-medium text-gray-900">Female</span>
              </div>
            </label>
            
            <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={selectedGender === 'male'}
                onChange={(e) => handleGenderChange(e.target.value)}
                className="mr-3 text-primary-600 focus:ring-primary-500"
              />
              <div className="flex items-center">
                <span className="text-2xl mr-3">♂️</span>
                <span className="font-medium text-gray-900">Male</span>
              </div>
            </label>
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedGender}
          className="w-full bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue Booking
        </button>
      </div>

      <div className="bg-blue-50 p-4 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Why women-only?</strong> We provide a comfortable, private environment 
          where women can fully relax and enjoy personalized spa treatments designed 
          specifically for female wellness needs.
        </p>
      </div>
    </div>
  )
}