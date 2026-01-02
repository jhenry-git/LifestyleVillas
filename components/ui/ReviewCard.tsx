'use client'

import { motion } from 'framer-motion'
import { Star } from 'lucide-react'

interface ReviewCardProps {
    review: {
        name: string
        rating: number
        text: string
    }
    index?: number
}

import { LUXURY_EASE } from '@/lib/constants'

export default function ReviewCard({ review, index = 0 }: ReviewCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: index * 0.1, ease: LUXURY_EASE }}
            viewport={{ once: true }}
            className="bg-white p-8 rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-neutral-100"
        >
            <div className="flex items-center mb-6">
                <div className="flex text-safari-sand gap-0.5">
                    {[...Array(5)].map((_, i) => (
                        <Star
                            key={i}
                            className={`w-4 h-4 ${i < review.rating ? 'fill-safari-sand text-safari-sand' : 'text-neutral-200'}`}
                        />
                    ))}
                </div>
                <span className="ml-3 text-[10px] uppercase tracking-wider text-neutral-400 font-medium border-l border-neutral-200 pl-3">
                    Verified Guest
                </span>
            </div>
            <p className="text-neutral-600 mb-6 italic leading-loose font-serif text-lg">
                "{review.text}"
            </p>
            <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-safari-olive/10 flex items-center justify-center text-safari-olive font-serif font-bold text-sm mr-3">
                    {review.name.charAt(0)}
                </div>
                <p className="text-safari-night font-medium text-sm tracking-wide">{review.name}</p>
            </div>
        </motion.div>
    )
}
