'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink, ChevronLeft, ChevronRight } from 'lucide-react'
import SectionHeader from '@/components/ui/SectionHeader'
import ReviewCard from '@/components/ui/ReviewCard'
import GoogleReviewCard from '@/components/reviews/GoogleReviewCard'
import AggregateRating from '@/components/reviews/AggregateRating'
import Button from '@/components/ui/Button'
import { reviews as fallbackReviews } from '@/lib/data'

interface GoogleReview {
    id: string
    review_id: string
    author_name: string
    author_photo_url?: string
    rating: number
    text?: string
    relative_time_description?: string
    time: number
}

interface ReviewsMeta {
    placeName: string
    overallRating: number | null
    totalReviews: number
    lastFetched: string | null
}

const GOOGLE_MAPS_REVIEW_URL = 'https://www.google.com/travel/hotels/entity/ChoI_J65hKHux_CQARoNL2cvMTFtdGpzdnh3ORAB?q=lifestyle%20villas&g2lb=4965990%2C72317059%2C72414906%2C72471280%2C72485658%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73101823%2C73104949%2C73107089%2C73125226%2C73169520%2C73192290%2C73198316%2C73219140&hl=en-KE&gl=ke&cs=1&ssta=1&ts=CAEaSQorEicyJTB4MTgyODFkMTFkYTg3MjdlOToweDkwZTExZjcyMTA4ZTRmN2MaABIaEhQKBwjqDxABGAQSBwjqDxABGAUYATICEAAqCQoFOgNLRVMaAA&qs=CAE4AkIJCXxPjhByH-GQQgkJfE-OEHIf4ZA&ictx=111&ved=0CAAQ5JsGahcKEwjQqu6nn-aRAxUAAAAAHQAAAAAQBA&utm_campaign=sharing&utm_medium=link&utm_source=htls'

const LUXURY_EASE = [0.23, 1, 0.32, 1] as const

export default function ReviewsPage() {
    const [googleReviews, setGoogleReviews] = useState<GoogleReview[]>([])
    const [meta, setMeta] = useState<ReviewsMeta | null>(null)
    const [loading, setLoading] = useState(true)
    const [carouselIndex, setCarouselIndex] = useState(0)

    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch('/api/reviews')
                if (response.ok) {
                    const data = await response.json()
                    setGoogleReviews(data.reviews || [])
                    setMeta(data.meta || null)
                }
            } catch (error) {
                console.error('Failed to fetch reviews:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchReviews()
    }, [])

    const hasGoogleReviews = googleReviews.length > 0

    // Carousel navigation
    const nextSlide = () => {
        setCarouselIndex((prev) =>
            prev >= googleReviews.length - 1 ? 0 : prev + 1
        )
    }

    const prevSlide = () => {
        setCarouselIndex((prev) =>
            prev <= 0 ? googleReviews.length - 1 : prev - 1
        )
    }

    return (
        <div className="bg-background min-h-screen">
            {/* Hero */}
            <section className="py-24 bg-neutral-50">
                <div className="container-premium text-center">
                    <SectionHeader
                        title="Guest Stories"
                        eyebrow="Reviews"
                        description="Don't just take our word for it. Read what our guests have to say about their stay at Lifestyle Villas."
                        className="mb-12"
                    />

                    {/* Aggregate Rating */}
                    {meta && meta.overallRating && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, ease: LUXURY_EASE }}
                            className="mb-16"
                        >
                            <AggregateRating
                                rating={meta.overallRating}
                                totalReviews={meta.totalReviews}
                                placeName={meta.placeName}
                            />
                        </motion.div>
                    )}
                </div>
            </section>

            {/* Google Reviews Section */}
            {hasGoogleReviews && (
                <section className="py-20 bg-white">
                    <div className="container-premium">
                        <div className="flex items-center justify-between mb-10">
                            <h2 className="font-serif text-2xl font-bold text-safari-night">
                                Verified Google Reviews
                            </h2>
                            <a
                                href={GOOGLE_MAPS_REVIEW_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-sm text-safari-olive hover:text-safari-night transition-colors"
                            >
                                View all on Google
                                <ExternalLink className="w-4 h-4 ml-1" strokeWidth={1.5} />
                            </a>
                        </div>

                        {/* Desktop Grid */}
                        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {googleReviews.map((review, index) => (
                                <GoogleReviewCard
                                    key={review.id}
                                    review={review}
                                    index={index}
                                />
                            ))}
                        </div>

                        {/* Mobile Carousel */}
                        <div className="md:hidden relative">
                            <div className="overflow-hidden">
                                <motion.div
                                    initial={false}
                                    animate={{ x: `-${carouselIndex * 100}%` }}
                                    transition={{ duration: 0.5, ease: LUXURY_EASE }}
                                    className="flex"
                                >
                                    {googleReviews.map((review, index) => (
                                        <div
                                            key={review.id}
                                            className="w-full flex-shrink-0 px-2"
                                        >
                                            <GoogleReviewCard
                                                review={review}
                                                index={index}
                                            />
                                        </div>
                                    ))}
                                </motion.div>
                            </div>

                            {/* Carousel Controls */}
                            {googleReviews.length > 1 && (
                                <div className="flex items-center justify-center gap-4 mt-6">
                                    <button
                                        onClick={prevSlide}
                                        className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                                        aria-label="Previous review"
                                    >
                                        <ChevronLeft className="w-5 h-5 text-safari-night" strokeWidth={1.5} />
                                    </button>
                                    <div className="flex gap-2">
                                        {googleReviews.map((_, idx) => (
                                            <button
                                                key={idx}
                                                onClick={() => setCarouselIndex(idx)}
                                                className={`w-2 h-2 rounded-full transition-colors ${idx === carouselIndex
                                                        ? 'bg-safari-olive'
                                                        : 'bg-neutral-300'
                                                    }`}
                                                aria-label={`Go to review ${idx + 1}`}
                                            />
                                        ))}
                                    </div>
                                    <button
                                        onClick={nextSlide}
                                        className="p-2 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
                                        aria-label="Next review"
                                    >
                                        <ChevronRight className="w-5 h-5 text-safari-night" strokeWidth={1.5} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Fallback / Additional Reviews */}
            <section className="py-20 bg-neutral-50">
                <div className="container-premium">
                    <h2 className="font-serif text-2xl font-bold text-safari-night mb-10 text-center">
                        {hasGoogleReviews ? 'More Guest Experiences' : 'What Our Guests Say'}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {fallbackReviews.map((review, index) => (
                            <ReviewCard key={index} review={review} index={index} />
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-safari-night text-white">
                <div className="container-premium text-center">
                    <h2 className="font-serif text-3xl font-bold mb-6">
                        Have You Stayed With Us?
                    </h2>
                    <p className="text-neutral-300 mb-10 max-w-xl mx-auto">
                        We'd love to hear about your experience. Your feedback helps us maintain our high standards of service and helps future guests make their decision.
                    </p>
                    <Button
                        href={GOOGLE_MAPS_REVIEW_URL}
                        variant="outline"
                        className="!border-white !text-white hover:!bg-white hover:!text-safari-night"
                    >
                        <ExternalLink className="w-4 h-4 mr-2" strokeWidth={1.5} />
                        Write a Review on Google
                    </Button>
                </div>
            </section>
        </div>
    )
}
