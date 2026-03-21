'use client'

import { useState } from 'react'

interface AgeSelectionProps {
  onAgeSelected: (ageRange: string) => void
}

export function AgeSelection({ onAgeSelected }: AgeSelectionProps) {
  const [selectedAge, setSelectedAge] = useState<string>('')

  const ageRanges = [
    { value: '18-25', label: '18-25 years', emoji: '🌸', description: 'Young & Radiant' },
    { value: '26-35', label: '26-35 years', emoji: '💫', description: 'Prime & Confident' },
    { value: '36-45', label: '36-45 years', emoji: '✨', description: 'Elegant & Sophisticated' },
    { value: '46-55', label: '46-55 years', emoji: '🌺', description: 'Graceful & Wise' },
    { value: '56+', label: '56+ years', emoji: '👑', description: 'Timeless & Beautiful' }
  ]

  const handleSubmit = () => {
    if (selectedAge) {
      onAgeSelected(selectedAge)
    } else {
      alert('Please select your age range to continue')
    }
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      </div>
      
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Tell Us About You
        </h2>
        <p className="text-gray-600 mb-6">
          Help us personalize your spa experience by selecting your age range. 
          We'll tailor our recommendations just for you!
        </p>
      </div>

      <div className="space-y-4">
        <div className="text-left">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your age range *
          </label>
          <div className="space-y-3">
            {ageRanges.map((range) => (
              <label 
                key={range.value}
                className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-pink-50 hover:border-pink-300 transition-all duration-200"
              >
                <input
                  type="radio"
                  name="age"
                  value={range.value}
                  checked={selectedAge === range.value}
                  onChange={(e) => setSelectedAge(e.target.value)}
                  className="mr-4 text-pink-600 focus:ring-pink-500"
                />
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">{range.emoji}</span>
                    <div>
                      <span className="font-medium text-gray-900">{range.label}</span>
                      <p className="text-sm text-gray-500">{range.description}</p>
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!selectedAge}
          className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>

      <div className="bg-pink-50 p-4 rounded-lg">
        <p className="text-sm text-pink-800">
          <strong>Why do we ask?</strong> Different life stages have unique wellness needs. 
          We customize our treatments and recommendations to help you look and feel your absolute best!
        </p>
      </div>
    </div>
  )
}