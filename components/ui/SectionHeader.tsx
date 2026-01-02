'use client'

import { motion } from 'framer-motion'

interface SectionHeaderProps {
    title: string
    eyebrow?: string
    description?: string
    centered?: boolean
    className?: string
    light?: boolean
}

import { LUXURY_EASE } from '@/lib/constants'

export default function SectionHeader({
    title,
    eyebrow,
    description,
    centered = true,
    className = '',
    light = false
}: SectionHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: LUXURY_EASE }}
            viewport={{ once: true, margin: "-100px" }}
            className={`max-w-3xl ${centered ? 'mx-auto text-center' : ''} ${className}`}
        >
            {eyebrow && (
                <span className={`block text-[11px] font-sans font-semibold uppercase tracking-[0.4em] mb-5 
                    ${light ? 'text-safari-sand/80' : 'text-safari-olive'}`}
                >
                    {eyebrow}
                </span>
            )}
            {/* Fluid Typography with clamp() */}
            <h2
                className={`font-serif font-bold mb-6 leading-[1.1]
                    ${light ? 'text-white' : 'text-safari-night'}`}
                style={{
                    fontSize: 'clamp(2rem, 5vw, 3.5rem)'
                }}
            >
                {title}
            </h2>
            {description && (
                <p className={`text-lg md:text-xl leading-relaxed font-light text-balance
                    ${light ? 'text-neutral-200/90' : 'text-neutral-500'}`}
                >
                    {description}
                </p>
            )}
        </motion.div>
    )
}
