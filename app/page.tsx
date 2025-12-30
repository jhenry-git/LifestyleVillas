'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Mountain, Compass, Sparkles } from 'lucide-react'
import Button from '@/components/ui/Button'
import { villas, reviews } from '@/lib/data'
import VillaCard from '@/components/ui/VillaCard'
import ReviewCard from '@/components/ui/ReviewCard'
import SectionHeader from '@/components/ui/SectionHeader'

const LUXURY_EASE = [0.23, 1, 0.32, 1]

export default function HomePage() {
  return (
    <div className="bg-background overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative h-[100dvh] min-h-[700px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-safari-night z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-safari-night/30 via-transparent to-background z-10" />
          <div className="absolute inset-0 bg-[url('/hero-placeholder.jpg')] bg-cover bg-center opacity-70" />
        </div>

        {/* Hero Content */}
        <div className="relative z-20 container-premium text-center text-white py-20 mt-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: LUXURY_EASE }}
          >
            <span className="inline-block text-[11px] md:text-xs font-sans font-semibold uppercase tracking-[0.5em] text-safari-sand/90 mb-8">
              Welcome to Nanyuki
            </span>
            <h1
              className="font-serif font-bold mb-10 leading-[1.05] tracking-tight text-balance"
              style={{ fontSize: 'clamp(2.5rem, 7vw, 5.5rem)' }}
            >
              Wild Luxury at<br />
              Mount Kenya's Feet
            </h1>
            <p className="text-lg md:text-2xl mb-14 text-neutral-200/90 max-w-2xl mx-auto leading-relaxed font-light">
              A sanctuary where contemporary refinement meets the raw beauty of the African wild.
            </p>
            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
              <Button href="/villas" variant="primary" size="lg" className="min-w-[200px]">
                Explore Villas
              </Button>
              <Link
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'}`}
                target="_blank"
                className="group flex items-center text-white/90 text-sm font-medium tracking-wide hover:text-safari-sand transition-colors"
              >
                <span className="border-b border-white/30 pb-0.5 group-hover:border-safari-sand transition-colors">
                  Book via WhatsApp
                </span>
                <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 group-hover:translate-x-1" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20 hidden md:block"
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <div className="w-[1px] h-20 bg-gradient-to-b from-transparent via-white/40 to-transparent" />
        </motion.div>
      </section>

      {/* Why Nanyuki Section */}
      <section className="py-32 md:py-40 bg-neutral-50 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neutral-200 to-transparent" />
        <div className="container-premium">
          <SectionHeader
            title="Why Nanyuki?"
            eyebrow="The Experience"
            description="Nestled at the foothills of Mount Kenya, Nanyuki offers a unique blend of natural beauty, wildlife conservation, and authentic Kenyan culture."
            className="mb-20"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { title: 'Mount Kenya', desc: 'Waking up to majestic sunrises over Africa\'s second-highest peak.', Icon: Mountain },
              { title: 'Wildlife', desc: 'Minutes from Ol Pejeta and world-class conservancies.', Icon: Compass },
              { title: 'Refinement', desc: 'Curated interiors honoring local culture and modern comfort.', Icon: Sparkles },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: i * 0.12, ease: LUXURY_EASE }}
                viewport={{ once: true, margin: "-100px" }}
                className="text-center p-10 bg-white border border-neutral-100 rounded-2xl hover:border-safari-olive/30 transition-colors duration-500 shadow-luxe"
              >
                <div className="w-14 h-14 mx-auto bg-safari-olive/10 rounded-full flex items-center justify-center mb-8">
                  <item.Icon className="w-6 h-6 text-safari-olive" strokeWidth={1.2} />
                </div>
                <h3 className="font-serif text-xl font-bold mb-4 text-safari-night">{item.title}</h3>
                <p className="text-neutral-500 leading-relaxed font-light">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Villas Section */}
      <section className="py-32 md:py-40 bg-background">
        <div className="container-premium">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20">
            <SectionHeader
              title="Featured Residences"
              eyebrow="Curated Collection"
              description="Handpicked accommodations designed for the discerning traveler."
              centered={false}
              className="max-w-2xl mb-10 md:mb-0"
            />
            <Link href="/villas" className="group flex items-center text-safari-olive font-medium hover:text-safari-night transition-colors mb-2">
              View All Collection
              <ArrowRight className="w-4 h-4 ml-2 transition-transform duration-500 group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {villas.slice(0, 3).map((villa, index) => (
              <VillaCard key={villa.id} villa={villa} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-32 md:py-40 bg-safari-night relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 bg-[url('/pattern-noise.png')]" />
        <div className="container-premium relative z-10">
          <SectionHeader
            title="Guest Stories"
            eyebrow="Testimonials"
            description="Hear from those who have experienced the magic of Lifestyle Villas."
            light={true}
            className="mb-20"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {reviews.slice(0, 3).map((review, index) => (
              <ReviewCard key={index} review={review} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-32 md:py-40 bg-safari-olive text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-safari-olive to-[#3d5020]" />
        <div className="container-premium text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: LUXURY_EASE }}
            viewport={{ once: true }}
          >
            <h2
              className="font-serif font-bold mb-10 tracking-tight"
              style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
            >
              Your Safari Awaits
            </h2>
            <p className="text-xl md:text-2xl mb-14 text-white/85 max-w-2xl mx-auto font-light leading-relaxed">
              Book your private villa and immerse yourself in the unparalleled beauty of Nanyuki.
            </p>
            <Button
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254XXXXXXXXX'}`}
              variant="primary"
              size="lg"
              className="bg-white text-safari-night hover:bg-safari-sand hover:text-white border-0 min-w-[220px]"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
