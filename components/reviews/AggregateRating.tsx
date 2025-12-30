'use client'

import { Star } from 'lucide-react'

interface AggregateRatingProps {
    rating: number | null
    totalReviews: number
    placeName?: string
}

export default function AggregateRating({ rating, totalReviews, placeName }: AggregateRatingProps) {
    if (!rating) return null

    return (
        <div className="flex flex-col items-center justify-center py-10 px-8 bg-white rounded-2xl shadow-luxe border border-neutral-100 max-w-md mx-auto">
            {/* Google Branding */}
            <div className="flex items-center gap-2 mb-4">
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                <span className="text-sm font-medium text-neutral-500">Reviews</span>
            </div>

            {/* Rating Display */}
            <div className="flex items-center gap-3 mb-3">
                <span className="text-5xl font-bold text-safari-night">{rating.toFixed(1)}</span>
                <div className="flex flex-col">
                    <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                                key={star}
                                className={`w-5 h-5 ${star <= Math.round(rating)
                                        ? 'text-yellow-400 fill-yellow-400'
                                        : 'text-neutral-200'
                                    }`}
                                strokeWidth={1.5}
                            />
                        ))}
                    </div>
                    <span className="text-sm text-neutral-500 mt-1">
                        {totalReviews} reviews
                    </span>
                </div>
            </div>

            {/* Place Name */}
            {placeName && (
                <p className="text-xs text-neutral-400 text-center mt-2">
                    {placeName}
                </p>
            )}
        </div>
    )
}
