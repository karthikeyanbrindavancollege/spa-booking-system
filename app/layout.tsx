import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ToastProvider } from '@/components/ui/Toast'
import { ConfirmDialogProvider } from '@/components/ui/ConfirmDialog'
import Header from '@/components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Serenity free Spa & Wellness - Book Your Free Appointment',
  description: 'Premium spa services for women. Book facial treatments, body wellness, and beauty services online with instant confirmation.',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ToastProvider>
          <ConfirmDialogProvider>
            <Header />
            <main className="min-h-screen">
              {children}
            </main>
          </ConfirmDialogProvider>
        </ToastProvider>
      </body>
    </html>
  )
}