'use client'

import { motion } from 'framer-motion'
import { MapPin, Clock, ArrowRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import Button from '@/components/ui/Button'
import { experiences } from '@/lib/data'

const LUXURY_EASE = [0.23, 1, 0.32, 1]

export default function ExperiencesPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden bg-safari-night">
                <div className="absolute inset-0 bg-[url('/images/experiences-hero.jpg')] bg-cover bg-center opacity-40" />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />

                <div className="relative z-10 container-premium text-center">
                    <SectionHeader
                        title="Curated Adventures"
                        eyebrow="Experiences"
                        description="From thrilling wildlife encounters to serene nature walks, discover the magic of Laikipia."
                        light={true}
                    />
                </div>
            </section>

            {/* Experiences Grid */}
            <section className="py-24">
                <div className="container-premium">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        {experiences.map((exp, index) => (
                            <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: index * 0.1, ease: LUXURY_EASE }}
                                viewport={{ once: true }}
                                className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-neutral-100"
                            >
                                {/* Image Placeholder */}
                                <div className="h-64 bg-neutral-200 relative overflow-hidden">
                                    {/* This would be next/image in production */}
                                    <div className="absolute inset-0 bg-safari-olive/10 group-hover:bg-transparent transition-colors duration-500" />
                                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-safari-olive">
                                        {exp.category}
                                    </div>
                                </div>

                                <div className="p-8">
                                    <h3 className="font-serif text-2xl font-bold text-safari-night mb-3 group-hover:text-safari-olive transition-colors">
                                        {exp.title}
                                    </h3>
                                    <p className="text-neutral-600 mb-6 leading-relaxed">
                                        {exp.description}
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-neutral-500 border-t border-neutral-100 pt-6">
                                        <div className="flex items-center">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {exp.duration}
                                        </div>
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            {exp.distance}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    <div className="mt-20 text-center">
                        <p className="text-lg text-neutral-600 mb-6">Want to book these experiences?</p>
                        <Button
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'}?text=${encodeURIComponent('Hi! I would like to enquire about booking an experience.')}`}
                            variant="primary"
                        >
                            Enquire via WhatsApp
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    )
}
