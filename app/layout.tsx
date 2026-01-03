import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import MobileBookingBar from '@/components/booking/MobileBookingBar'
import StructuredData from '@/components/seo/StructuredData'
import { generateOrganizationSchema, generateLocalBusinessSchema } from '@/lib/seo/schema'

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
})

const playfair = Playfair_Display({
  variable: '--font-serif',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lifestyle-villas.com'),
  title: {
    template: '%s | Lifestyle Villas Nanyuki',
    default: 'Lifestyle Villas Nanyuki | Luxury Villas at Mount Kenya',
  },
  description: 'Experience luxury at the foothills of Mount Kenya. Premium villas in Nanyuki offering refined accommodation for your Kenya safari adventure. Book your perfect getaway today.',
  keywords: [
    'nanyuki villas',
    'mount kenya accommodation',
    'laikipia villas',
    'kenya vacation rentals',
    'luxury villas nanyuki',
    'lifestyle villas nanyuki',
    'nanyuki lodging',
    'mount kenya villas',
    'nanyuki safari accommodation',
    'kenya luxury villas',
  ],
  authors: [{ name: 'Lifestyle Villas Nanyuki' }],
  creator: 'Lifestyle Villas Nanyuki',
  publisher: 'Lifestyle Villas Nanyuki',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
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
    type: 'website',
    locale: 'en_KE',
    url: 'https://lifestyle-villas.com',
    siteName: 'Lifestyle Villas Nanyuki',
    title: 'Lifestyle Villas Nanyuki | Luxury Villas at Mount Kenya',
    description: 'Experience luxury at the foothills of Mount Kenya. Premium villas in Nanyuki for your Kenya safari adventure.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lifestyle Villas Nanyuki - Luxury Accommodation',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lifestyle Villas Nanyuki | Luxury Villas at Mount Kenya',
    description: 'Experience luxury at the foothills of Mount Kenya. Premium villas in Nanyuki for your Kenya safari adventure.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  other: {
    'msapplication-TileColor': '#556B2F',
    'msapplication-TileImage': '/favicon/ms-icon-144x144.png',
    'msapplication-config': '/favicon/browserconfig.xml',
    // Geo-targeting for Kenya
    'geo.region': 'KE',
    'geo.placename': 'Nanyuki',
    'geo.position': '-0.0167;37.0667',
    'ICBM': '-0.0167, 37.0667',
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
        <StructuredData
          data={[
            generateOrganizationSchema(),
            generateLocalBusinessSchema()
          ]}
        />
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

