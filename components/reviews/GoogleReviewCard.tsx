'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Star } from 'lucide-react'
import Image from 'next/image'

interface GoogleReviewCardProps {
    review: {
        id: string
        author_name: string
        author_photo_url?: string
        rating: number
        text?: string
        relative_time_description?: string
    }
    index?: number
}

import { LUXURY_EASE } from '@/lib/constants'

export default function GoogleReviewCard({ review, index = 0 }: GoogleReviewCardProps) {
    const [isExpanded, setIsExpanded] = useState(false)
    const text = review.text || ''
    const shouldTruncate = text.length > 250

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: LUXURY_EASE }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl p-6 md:p-8 shadow-luxe border border-neutral-100 h-full flex flex-col"
        >
            {/* Author Header */}
            <div className="flex items-center gap-4 mb-4">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-neutral-100 flex-shrink-0">
                    {review.author_photo_url ? (
                        <Image
                            src={review.author_photo_url}
                            alt={review.author_name}
                            fill
                            className="object-cover"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-safari-olive/10 text-safari-olive font-semibold text-lg">
                            {review.author_name.charAt(0).toUpperCase()}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-safari-night truncate">
                        {review.author_name}
                    </h4>
                    {review.relative_time_description && (
                        <p className="text-xs text-neutral-400">
                            {review.relative_time_description}
                        </p>
                    )}
                </div>
            </div>

            {/* Star Rating */}
            <div className="flex gap-0.5 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-neutral-200'
                            }`}
                        strokeWidth={1.5}
                    />
                ))}
            </div>

            {/* Review Text */}
            <div className="flex-1">
                {text && (
                    <>
                        <p className="text-neutral-600 leading-relaxed text-sm">
                            {shouldTruncate && !isExpanded
                                ? `${text.substring(0, 250)}...`
                                : text}
                        </p>
                        {shouldTruncate && (
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="text-safari-olive text-sm font-medium mt-2 hover:underline"
                            >
                                {isExpanded ? 'Show less' : 'Read more'}
                            </button>
                        )}
                    </>
                )}
            </div>

            {/* Google Attribution */}
            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-neutral-100">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-[10px] text-neutral-400">Posted on Google</span>
            </div>
        </motion.div>
    )
}
