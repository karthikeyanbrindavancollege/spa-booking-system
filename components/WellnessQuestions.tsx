'use client'

import { useState } from 'react'

interface WellnessQuestionsProps {
  ageRange: string
  onCompleted: (answers: Record<string, string>) => void
  onBack: () => void
}

export function WellnessQuestions({ ageRange, onCompleted, onBack }: WellnessQuestionsProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  const getQuestionsForAge = (age: string) => {
    const baseQuestions = [
      {
        id: 'skinConcern',
        question: 'What\'s your primary skin concern?',
        options: [
          { value: 'hydration', label: 'Hydration & Moisture', emoji: '💧' },
          { value: 'antiaging', label: 'Anti-aging & Firmness', emoji: '✨' },
          { value: 'acne', label: 'Acne & Blemishes', emoji: '🌿' },
          { value: 'sensitivity', label: 'Sensitivity & Redness', emoji: '🌸' },
          { value: 'brightening', label: 'Brightening & Glow', emoji: '☀️' }
        ]
      },
      {
        id: 'stressLevel',
        question: 'How would you describe your current stress level?',
        options: [
          { value: 'low', label: 'Zen & Relaxed', emoji: '🧘‍♀️' },
          { value: 'moderate', label: 'Manageable but Present', emoji: '😌' },
          { value: 'high', label: 'Overwhelmed & Tense', emoji: '😰' },
          { value: 'extreme', label: 'Desperately Need Relief', emoji: '🆘' }
        ]
      }
    ]

    // Age-specific questions
    if (age === '18-25') {
      return [
        ...baseQuestions,
        {
          id: 'lifestyle',
          question: 'What best describes your lifestyle right now?',
          options: [
            { value: 'student', label: 'Student Life - Study & Social', emoji: '📚' },
            { value: 'career', label: 'Career Building - Ambitious', emoji: '💼' },
            { value: 'active', label: 'Active & Adventurous', emoji: '🏃‍♀️' },
            { value: 'creative', label: 'Creative & Expressive', emoji: '🎨' }
          ]
        },
        {
          id: 'selfCare',
          question: 'How do you like to treat yourself?',
          options: [
            { value: 'trendy', label: 'Latest Trends & Instagram-worthy', emoji: '📸' },
            { value: 'natural', label: 'Natural & Organic Treatments', emoji: '🌱' },
            { value: 'fun', label: 'Fun & Colorful Experiences', emoji: '🎉' },
            { value: 'classic', label: 'Classic & Timeless Treatments', emoji: '💎' }
          ]
        }
      ]
    } else if (age === '26-35') {
      return [
        ...baseQuestions,
        {
          id: 'priorities',
          question: 'What\'s your main focus right now?',
          options: [
            { value: 'career', label: 'Career Growth & Success', emoji: '🚀' },
            { value: 'relationship', label: 'Love & Relationships', emoji: '💕' },
            { value: 'health', label: 'Health & Wellness', emoji: '💪' },
            { value: 'balance', label: 'Work-Life Balance', emoji: '⚖️' }
          ]
        },
        {
          id: 'confidence',
          question: 'What makes you feel most confident?',
          options: [
            { value: 'glowing', label: 'Radiant, Glowing Skin', emoji: '✨' },
            { value: 'relaxed', label: 'Feeling Completely Relaxed', emoji: '😌' },
            { value: 'pampered', label: 'Being Thoroughly Pampered', emoji: '👸' },
            { value: 'energized', label: 'Feeling Refreshed & Energized', emoji: '⚡' }
          ]
        }
      ]
    } else if (age === '36-45') {
      return [
        ...baseQuestions,
        {
          id: 'lifeStage',
          question: 'What describes your current life phase?',
          options: [
            { value: 'family', label: 'Family & Motherhood Focus', emoji: '👨‍👩‍👧‍👦' },
            { value: 'career', label: 'Peak Career & Leadership', emoji: '👩‍💼' },
            { value: 'personal', label: 'Personal Growth & Discovery', emoji: '🌟' },
            { value: 'health', label: 'Health & Wellness Priority', emoji: '🧘‍♀️' }
          ]
        },
        {
          id: 'meTime',
          question: 'When do you get your "me time"?',
          options: [
            { value: 'rare', label: 'Rarely - This is a Special Treat', emoji: '🎁' },
            { value: 'monthly', label: 'Monthly Self-Care Ritual', emoji: '📅' },
            { value: 'weekly', label: 'Weekly Wellness Routine', emoji: '🗓️' },
            { value: 'daily', label: 'Daily Mindful Moments', emoji: '☀️' }
          ]
        }
      ]
    } else if (age === '46-55') {
      return [
        ...baseQuestions,
        {
          id: 'wisdom',
          question: 'What wisdom guides your self-care?',
          options: [
            { value: 'quality', label: 'Quality Over Quantity', emoji: '💎' },
            { value: 'natural', label: 'Natural & Holistic Approach', emoji: '🌿' },
            { value: 'experience', label: 'Rich, Luxurious Experiences', emoji: '🏆' },
            { value: 'results', label: 'Proven, Effective Results', emoji: '✅' }
          ]
        },
        {
          id: 'goals',
          question: 'What\'s your wellness goal?',
          options: [
            { value: 'graceful', label: 'Age Gracefully & Confidently', emoji: '👑' },
            { value: 'vitality', label: 'Maintain Youthful Vitality', emoji: '🌺' },
            { value: 'peace', label: 'Find Inner Peace & Balance', emoji: '🕊️' },
            { value: 'radiance', label: 'Enhance Natural Radiance', emoji: '✨' }
          ]
        }
      ]
    } else { // 56+
      return [
        ...baseQuestions,
        {
          id: 'celebration',
          question: 'How do you celebrate your beautiful journey?',
          options: [
            { value: 'luxury', label: 'Luxurious, Indulgent Treatments', emoji: '👸' },
            { value: 'gentle', label: 'Gentle, Nurturing Care', emoji: '🤗' },
            { value: 'wisdom', label: 'Honoring My Wisdom & Experience', emoji: '🦋' },
            { value: 'timeless', label: 'Timeless Beauty & Elegance', emoji: '💫' }
          ]
        },
        {
          id: 'legacy',
          question: 'What makes you feel most beautiful?',
          options: [
            { value: 'confidence', label: 'My Confidence & Self-Assurance', emoji: '💪' },
            { value: 'grace', label: 'My Grace & Poise', emoji: '🦢' },
            { value: 'joy', label: 'My Joy & Positive Energy', emoji: '😊' },
            { value: 'authenticity', label: 'My Authentic Self', emoji: '🌟' }
          ]
        }
      ]
    }
  }

  const questions = getQuestionsForAge(ageRange)

  const handleAnswer = (value: string) => {
    const newAnswers = { ...answers, [questions[currentQuestion].id]: value }
    setAnswers(newAnswers)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      onCompleted(newAnswers)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    } else {
      onBack()
    }
  }

  const currentQ = questions[currentQuestion]

  return (
    <div className="space-y-6">
      {/* Progress */}
      <div className="text-center">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            Question {currentQuestion + 1} of {questions.length}
          </span>
          <span className="text-sm text-gray-500">Personalizing Your Experience</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-pink-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="text-center space-y-6">
        <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">💖</span>
        </div>
        
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            {currentQ.question}
          </h2>
          <p className="text-gray-600 text-sm">
            Choose the option that resonates most with you
          </p>
        </div>

        <div className="space-y-3">
          {currentQ.options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleAnswer(option.value)}
              className="w-full flex items-center p-4 border border-gray-300 rounded-lg hover:bg-pink-50 hover:border-pink-300 transition-all duration-200 text-left"
            >
              <span className="text-2xl mr-4">{option.emoji}</span>
              <span className="font-medium text-gray-900">{option.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleBack}
          className="text-gray-600 hover:text-gray-800 font-medium py-2 transition-colors"
        >
          ← Back
        </button>
      </div>
    </div>
  )
}