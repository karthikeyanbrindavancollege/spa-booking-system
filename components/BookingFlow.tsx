'use client'

import { useState } from 'react'
import { TimeSelection } from './TimeSelection'
import { DetailsForm } from './DetailsForm'
import { BookingConfirmation } from './BookingConfirmation'
import { GenderVerification } from './GenderVerification'
import { AgeSelection } from './AgeSelection'
import { WellnessQuestions } from './WellnessQuestions'
import { BookingFormData } from '@/lib/types'

export type BookingStep = 'gender' | 'age' | 'questions' | 'time' | 'details' | 'confirmation'

interface SelectedSlot {
  date: string
  time: string
}

export function BookingFlow() {
  const [currentStep, setCurrentStep] = useState<BookingStep>('gender')
  const [selectedSlot, setSelectedSlot] = useState<SelectedSlot | null>(null)
  const [formData, setFormData] = useState<BookingFormData | null>(null)
  const [bookingId, setBookingId] = useState<string | null>(null)
  const [isEditMode, setIsEditMode] = useState(false)
  const [ageRange, setAgeRange] = useState<string>('')
  const [wellnessAnswers, setWellnessAnswers] = useState<Record<string, string>>({})

  const handleGenderVerified = () => {
    setCurrentStep('age')
  }

  const handleAgeSelected = (age: string) => {
    setAgeRange(age)
    setCurrentStep('questions')
  }

  const handleQuestionsCompleted = (answers: Record<string, string>) => {
    setWellnessAnswers(answers)
    setCurrentStep('time')
  }

  const handleBackToQuestions = () => {
    setCurrentStep('questions')
  }

  const handleTimeSelected = (date: string, time: string) => {
    setSelectedSlot({ date, time })
    setCurrentStep('details')
    setIsEditMode(false) // Reset edit mode when selecting new time
  }

  const handleDetailsSubmitted = (data: BookingFormData, id: string) => {
    setFormData(data)
    setBookingId(id)
    setCurrentStep('confirmation')
    setIsEditMode(false)
  }

  const handleBackToTime = () => {
    setCurrentStep('time')
    setSelectedSlot(null)
    setIsEditMode(false)
  }

  const handleBackToDetails = () => {
    setCurrentStep('details')
    setIsEditMode(true) // Set edit mode when going back from confirmation
  }

  const getStepNumber = () => {
    switch (currentStep) {
      case 'gender': return 1
      case 'age': return 2
      case 'questions': return 3
      case 'time': return 4
      case 'details': return 5
      case 'confirmation': return 6
      default: return 1
    }
  }

  const getStepLabel = () => {
    switch (currentStep) {
      case 'gender': return 'Verification'
      case 'age': return 'Age Selection'
      case 'questions': return 'Personalization'
      case 'time': return 'Select Time'
      case 'details': return 'Enter Details'
      case 'confirmation': return 'Confirmation'
      default: return 'Verification'
    }
  }

  const getProgressWidth = () => {
    switch (currentStep) {
      case 'gender': return '16%'
      case 'age': return '33%'
      case 'questions': return '50%'
      case 'time': return '66%'
      case 'details': return '83%'
      case 'confirmation': return '100%'
      default: return '16%'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar - Only show after gender verification */}
      {currentStep !== 'gender' && (
        <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
          <div className="container mx-auto px-4 py-4 max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">
                Step {getStepNumber() - 1} of 5
              </span>
              <span className="text-sm text-gray-500">
                {getStepLabel()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                style={{ width: getProgressWidth() }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Step Content */}
      <div className="container mx-auto px-4 py-6 max-w-md">
        {currentStep === 'gender' && (
          <GenderVerification onVerified={handleGenderVerified} />
        )}

        {currentStep === 'age' && (
          <AgeSelection onAgeSelected={handleAgeSelected} />
        )}

        {currentStep === 'questions' && (
          <WellnessQuestions 
            ageRange={ageRange}
            onCompleted={handleQuestionsCompleted}
            onBack={() => setCurrentStep('age')}
          />
        )}
        
        {currentStep === 'time' && (
          <TimeSelection onTimeSelected={handleTimeSelected} />
        )}
        
        {currentStep === 'details' && selectedSlot && (
          <DetailsForm
            selectedSlot={selectedSlot}
            onSubmit={handleDetailsSubmitted}
            onBack={handleBackToTime}
            isEditMode={isEditMode}
            existingBookingId={bookingId}
            initialData={formData}
          />
        )}
        
        {currentStep === 'confirmation' && selectedSlot && formData && bookingId && (
          <BookingConfirmation
            selectedSlot={selectedSlot}
            formData={formData}
            bookingId={bookingId}
            onBack={handleBackToDetails}
          />
        )}
      </div>
    </div>
  )
}