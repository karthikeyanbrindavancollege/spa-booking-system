import Image from 'next/image'
import Link from 'next/link'
import ContactButton from '@/components/ContactButton'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* Left Side - Image */}
        <div className="lg:w-1/2 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-transparent z-10"></div>
          <Image
            src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=800&fit=crop&crop=center"
            alt="Relaxing spa environment"
            fill
            className="object-cover"
            priority
          />
          
          {/* Floating Elements */}
          <div className="absolute top-8 right-8 w-16 h-16 bg-primary-100 rounded-full opacity-60 z-20"></div>
          <div className="absolute bottom-20 left-12 w-8 h-8 bg-primary-200 rounded-full opacity-80 z-20"></div>
          <div className="absolute top-1/3 left-8 w-12 h-12 bg-primary-50 rounded-full opacity-70 z-20"></div>
        </div>

        {/* Right Side - Content */}
        <div className="lg:w-1/2 flex items-center justify-center p-8 lg:p-16 relative lg:bg-white min-h-screen lg:min-h-0">
          {/* Mobile Background - Same as left side but with overlay */}
          <div className="lg:hidden absolute inset-0 z-0 min-h-screen">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-600/30 to-white/90 z-10 min-h-full"></div>
            <Image
              src="https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&h=800&fit=crop&crop=center"
              alt="Relaxing spa environment"
              fill
              className="object-cover min-h-screen"
            />
            {/* Mobile Floating Elements */}
            <div className="absolute top-8 right-8 w-12 h-12 bg-primary-100 rounded-full opacity-40 z-20"></div>
            <div className="absolute bottom-20 left-8 w-6 h-6 bg-primary-200 rounded-full opacity-60 z-20"></div>
            <div className="absolute top-1/4 left-6 w-8 h-8 bg-primary-50 rounded-full opacity-50 z-20"></div>
          </div>

          <div className="max-w-md w-full relative z-30">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Book Your free
                <br />
                <span className="text-primary-600">Appointment</span>
              </h1>
              <p className="text-gray-600 lg:text-gray-600 text-lg leading-relaxed">
                Schedule a consultation with ease. Choose your preferred time, 
                share your details, and confirm your booking in minutes.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link 
                href="/book"
                className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl text-center"
              >
                Book Now
              </Link>
              <ContactButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}