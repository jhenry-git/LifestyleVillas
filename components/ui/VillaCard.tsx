'use client'

import { motion } from 'framer-motion'
import { Users } from 'lucide-react'
import Link from 'next/link'
import Button from '@/components/ui/Button'

interface VillaCardProps {
    villa: {
        id: string
        houseNumber: string
        name: string
        slug: string
        description: string
        basePrice: number
        capacity: number
        capacityLabel?: string
        amenities: string[]
        offers: { tag: string }[]
        featured: boolean
    }
    index?: number
}

const LUXURY_EASE = [0.23, 1, 0.32, 1]

export default function VillaCard({ villa, index = 0 }: VillaCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: index * 0.12, ease: LUXURY_EASE }}
            viewport={{ once: true, margin: "-100px" }}
            className="group bg-white rounded-2xl overflow-hidden shadow-luxe transition-all duration-500 will-change-transform hover:shadow-xl"
        >
            {/* Villa Image Container - Slow Zoom Effect */}
            <div className="relative h-80 bg-neutral-200 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-safari-night/50 via-transparent to-transparent z-10" />

                {/* Placeholder Image - Apply Slow Zoom */}
                <div className="absolute inset-0 bg-neutral-300 w-full h-full transform scale-100 group-hover:scale-105 transition-transform duration-[1200ms] ease-out" />

                {/* Offer Tags */}
                {villa.offers && villa.offers.length > 0 && (
                    <div className="absolute top-5 right-5 z-20 flex flex-col gap-2">
                        {villa.offers.map((offer, i) => (
                            <div key={i} className="bg-white/95 backdrop-blur-sm text-safari-olive px-4 py-1.5 rounded-full text-[10px] font-semibold tracking-widest uppercase shadow-sm">
                                {offer.tag}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Villa Info */}
            <div className="p-8 lg:p-10">
                <div className="flex justify-between items-start mb-5">
                    <div>
                        <p className="text-[10px] font-sans font-semibold uppercase tracking-[0.3em] text-safari-olive mb-2">
                            {villa.houseNumber}
                        </p>
                        <h3 className="font-serif text-2xl font-bold text-safari-night group-hover:text-safari-olive transition-colors duration-500">
                            {villa.name}
                        </h3>
                    </div>
                </div>

                <p className="text-neutral-500 mb-8 leading-relaxed font-light line-clamp-2">
                    {villa.description}
                </p>

                <div className="flex items-center justify-between pt-6 border-t border-neutral-100">
                    <div className="flex items-center text-sm text-neutral-400">
                        <Users className="w-5 h-5 mr-2" strokeWidth={1.2} />
                        <span className="font-light">Sleeps {villa.capacity}</span>
                    </div>
                    <div className="text-right">
                        <span className="block text-xl font-bold text-safari-night tracking-tight">
                            KES {villa.basePrice.toLocaleString()}
                        </span>
                        <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-medium">per night</span>
                    </div>
                </div>

                <div className="mt-8">
                    <Button href={`/villas/${villa.slug}`} variant="outline" className="w-full !border-neutral-200 hover:!border-safari-olive hover:!bg-safari-olive hover:!text-white transition-all duration-500">
                        View Details
                    </Button>
                </div>
            </div>
        </motion.div>
    )
}
