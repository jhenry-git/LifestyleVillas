'use client'

import { motion } from 'framer-motion'
import { MapPin, Sun, Cloud, Wind, CheckCircle } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import { nanyukiInfo } from '@/lib/data'

const LUXURY_EASE = [0.23, 1, 0.32, 1]

export default function NanyukiPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-safari-earth">
                <div className="absolute inset-0 bg-neutral-900/30" />
                <div className="relative z-10 container-premium text-center">
                    <SectionHeader
                        title="The Jewel of Laikipia"
                        eyebrow="Destination"
                        description="Discover Nanyuki, a cosmopolitan hub where the northern frontier begins."
                        light={true}
                    />
                </div>
            </section>

            {/* Info Grid */}
            <section className="py-24">
                <div className="container-premium">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: LUXURY_EASE }}
                            viewport={{ once: true }}
                        >
                            <h2 className="font-serif text-4xl font-bold text-safari-night mb-6">{nanyukiInfo.location.title}</h2>
                            <p className="text-lg text-neutral-600 leading-relaxed mb-6">
                                {nanyukiInfo.location.description}
                            </p>
                            <div className="flex items-center text-safari-olive font-medium">
                                <MapPin className="w-5 h-5 mr-3" />
                                <span>0° 01' North, 37° 04' East</span>
                            </div>
                        </motion.div>
                        <div className="h-96 bg-neutral-200 rounded-2xl relative overflow-hidden shadow-2xl">
                            {/* Map or Landscape Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-serif">
                                Scenic Landscape Image
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-24">
                        <div className="h-96 bg-neutral-200 rounded-2xl relative overflow-hidden shadow-2xl order-2 lg:order-1">
                            {/* Climate Placeholder */}
                            <div className="absolute inset-0 flex items-center justify-center text-neutral-400 font-serif">
                                Mount Kenya Image
                            </div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: LUXURY_EASE }}
                            viewport={{ once: true }}
                            className="order-1 lg:order-2"
                        >
                            <h2 className="font-serif text-4xl font-bold text-safari-night mb-6">{nanyukiInfo.climate.title}</h2>
                            <p className="text-lg text-neutral-600 leading-relaxed mb-8">
                                {nanyukiInfo.climate.description}
                            </p>

                            <div className="grid grid-cols-2 gap-6">
                                <div className="bg-neutral-50 p-4 rounded-xl text-center">
                                    <Sun className="w-8 h-8 text-safari-sand mx-auto mb-2" />
                                    <span className="block font-bold text-safari-night">24°C</span>
                                    <span className="text-xs text-neutral-500 uppercase">Avg Day</span>
                                </div>
                                <div className="bg-neutral-50 p-4 rounded-xl text-center">
                                    <Wind className="w-8 h-8 text-safari-olive mx-auto mb-2" />
                                    <span className="block font-bold text-safari-night">10°C</span>
                                    <span className="text-xs text-neutral-500 uppercase">Avg Night</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Highlights */}
                    <div className="bg-safari-night text-white rounded-3xl p-12 md:p-20 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-safari-olive/20 blur-3xl rounded-full" />
                        <div className="relative z-10">
                            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-10 text-center">Point of Interest</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                                {nanyukiInfo.highlights.map((item, i) => (
                                    <div key={i} className="flex items-start bg-white/5 p-6 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <CheckCircle className="w-6 h-6 text-safari-olive mr-4 flex-shrink-0" />
                                        <span className="text-neutral-200">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
