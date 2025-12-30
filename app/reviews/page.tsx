'use client'

import { motion } from 'framer-motion'
import ReviewCard from '@/components/ui/ReviewCard'
import SectionHeader from '@/components/ui/SectionHeader'
import { reviews } from '@/lib/data'
import Button from '@/components/ui/Button'

export default function ReviewsPage() {
    return (
        <div className="bg-background min-h-screen">
            <section className="py-24 bg-neutral-50">
                <div className="container-premium text-center">
                    <SectionHeader
                        title="Guest Stories"
                        eyebrow="Reviews"
                        description="Don't just take our word for it. Read what our guests have to say about their stay at Lifestyle Villas."
                        className="mb-16"
                    />

                    <div className="masonry-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {reviews.map((review, index) => (
                            <ReviewCard key={index} review={review} index={index} />
                        ))}
                    </div>

                    <div className="mt-20 bg-safari-night text-white rounded-3xl p-12 relative overflow-hidden max-w-4xl mx-auto">
                        <div className="relative z-10">
                            <h2 className="font-serif text-3xl font-bold mb-6">Have you stayed with us?</h2>
                            <p className="text-neutral-300 mb-8 max-w-xl mx-auto">
                                We'd love to hear about your experience. Your feedback helps us maintain our high standards of service.
                            </p>
                            <Button
                                href="https://www.google.com/travel/hotels/entity/ChoI_J65hKHux_CQARoNL2cvMTFtdGpzdnh3ORAB?q=lifestyle%20villas&g2lb=4965990%2C72317059%2C72414906%2C72471280%2C72485658%2C72560029%2C72573224%2C72647020%2C72686036%2C72803964%2C72882230%2C72958624%2C73059275%2C73064764%2C73101823%2C73104949%2C73107089%2C73125226%2C73169520%2C73192290%2C73198316%2C73219140&hl=en-KE&gl=ke&cs=1&ssta=1&ts=CAEaSQorEicyJTB4MTgyODFkMTFkYTg3MjdlOToweDkwZTExZjcyMTA4ZTRmN2MaABIaEhQKBwjqDxABGAQSBwjqDxABGAUYATICEAAqCQoFOgNLRVMaAA&qs=CAE4AkIJCXxPjhByH-GQQgkJfE-OEHIf4ZA&ictx=111&ved=0CAAQ5JsGahcKEwjQqu6nn-aRAxUAAAAAHQAAAAAQBA&utm_campaign=sharing&utm_medium=link&utm_source=htls"
                                variant="outline"
                                className="!border-white !text-white hover:!bg-white hover:!text-safari-night"
                            >
                                Write a Review
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
