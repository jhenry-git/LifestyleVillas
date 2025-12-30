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
  manifest: '/favicon/manifest.json',
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon-96x96.png', sizes: '96x96', type: 'image/png' },
    ],
    shortcut: '/favicon/favicon.ico',
    apple: [
      { url: '/favicon/apple-icon-57x57.png', sizes: '57x57' },
      { url: '/favicon/apple-icon-60x60.png', sizes: '60x60' },
      { url: '/favicon/apple-icon-72x72.png', sizes: '72x72' },
      { url: '/favicon/apple-icon-76x76.png', sizes: '76x76' },
      { url: '/favicon/apple-icon-114x114.png', sizes: '114x114' },
      { url: '/favicon/apple-icon-120x120.png', sizes: '120x120' },
      { url: '/favicon/apple-icon-144x144.png', sizes: '144x144' },
      { url: '/favicon/apple-icon-152x152.png', sizes: '152x152' },
      { url: '/favicon/apple-icon-180x180.png', sizes: '180x180' },
    ],
    other: [
      { rel: 'mask-icon', url: '/favicon/apple-icon.png' },
    ],
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Lifestyle Villas',
  },
  openGraph: {
    title: 'Lifestyle Villas Nanyuki | Premium Destination Villas',
    description: 'A refined villa experience at the foothills of Mount Kenya',
    type: 'website',
    locale: 'en_KE',
    siteName: 'Lifestyle Villas Nanyuki',
  },
  other: {
    'msapplication-TileColor': '#556B2F',
    'msapplication-TileImage': '/favicon/ms-icon-144x144.png',
    'msapplication-config': '/favicon/browserconfig.xml',
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
