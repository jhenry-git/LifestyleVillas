'use client'

import { motion } from 'framer-motion'
import SectionHeader from '@/components/ui/SectionHeader'
import { aboutContent } from '@/lib/data'
import { Shield, Heart, Star } from 'lucide-react'
import { LUXURY_EASE } from '@/lib/constants'

const icons = {
    Privacy: Shield,
    Authenticity: Heart,
    Excellence: Star
}

export default function AboutPage() {
    return (
        <div className="bg-background min-h-screen">
            {/* Hero */}
            <section className="relative py-32 bg-safari-olive/5">
                <div className="container-premium text-center">
                    <SectionHeader
                        title="Refined Luxury in the Wild"
                        eyebrow="Our Story"
                        description=""
                        className="mb-0"
                    />
                </div>
            </section>

            <section className="py-24">
                <div className="container-premium">
                    {/* Mission */}
                    <div className="max-w-4xl mx-auto text-center mb-24">
                        <p className="font-serif text-2xl md:text-4xl leading-relaxed text-safari-night">
                            &quot;{aboutContent.mission}&quot;
                        </p>
                    </div>

                    {/* The Narrative */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
                        <div className="relative">
                            <div className="aspect-[4/5] bg-neutral-200 rounded-lg overflow-hidden relative z-10">
                                {/* Concept Image */}
                                <div className="absolute inset-0 bg-neutral-300 flex items-center justify-center text-neutral-500">
                                    Founder / Team Image
                                </div>
                            </div>
                            <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-safari-olive rounded-lg z-0" />
                        </div>
                        <div>
                            <h2 className="font-serif text-3xl font-bold mb-6 text-safari-night">Why We Started</h2>
                            <p className="text-neutral-600 leading-loose text-lg mb-6">
                                {aboutContent.story}
                            </p>
                            <p className="text-neutral-600 leading-loose text-lg">
                                Whether you&apos;re seeking a quiet writer&apos;s retreat, a base for your mountaineering adventure, or a luxurious family holiday, Lifestyle Villas is designed to be your pr[...]
                            </p>
                        </div>
                    </div>

                    {/* Values */}
                    <div>
                        <SectionHeader title="Our Core Values" eyebrow="Philosophy" className="mb-16" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {aboutContent.values.map((value, index) => {
                                const Icon = icons[value.title as keyof typeof icons] || Star
                                return (
                                    <motion.div
                                        key={index}
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.8, delay: index * 0.1, ease: LUXURY_EASE }}
                                        viewport={{ once: true }}
                                        className="text-center p-8 bg-white border border-neutral-100 rounded-xl hover:shadow-lg transition-all duration-300"
                                    >
                                        <div className="w-16 h-16 mx-auto bg-safari-olive/10 rounded-full flex items-center justify-center text-safari-olive mb-6">
                                            <Icon className="w-8 h-8" strokeWidth={1.5} />
                                        </div>
                                        <h3 className="font-serif text-xl font-bold mb-4 text-safari-night">{value.title}</h3>
                                        <p className="text-neutral-600 leading-relaxed">
                                            {value.description}
                                        </p>
                                    </motion.div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
