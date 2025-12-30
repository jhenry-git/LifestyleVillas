import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBookingBar from '@/components/booking/MobileBookingBar'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Lifestyle Villas Nanyuki',
    default: 'Lifestyle Villas Nanyuki | Premium Destination Villas at Mount Kenya',
  },
  description: 'A refined villa experience at the foothills of Mount Kenya. Discover Nanyuki\'s finest destination villas where culture, nature, and refinement meet.',
  keywords: ['Nanyuki villas', 'Mount Kenya accommodation', 'Laikipia villas', 'Kenya vacation rentals', 'luxury villas Nanyuki'],
  openGraph: {
    title: 'Lifestyle Villas Nanyuki | Premium Destination Villas',
    description: 'A refined villa experience at the foothills of Mount Kenya',
    type: 'website',
    locale: 'en_KE',
    siteName: 'Lifestyle Villas Nanyuki',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${inter.variable} ${playfair.variable} antialiased min-h-screen flex flex-col bg-neutral-50 selection:bg-safari-olive selection:text-white`}
      >
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <MobileBookingBar />
      </body>
    </html>
  )
}
