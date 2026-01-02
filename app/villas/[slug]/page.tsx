import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import BookingTerminal from '@/components/booking/BookingTerminal'

// This would normally come from Supabase based on the slug
const getVillaBySlug = (slug: string) => {
    const villas = {
        'villa-01-safari-vista': {
            id: '1',
            houseNumber: 'Villa 01',
            name: 'Safari Vista',
            slug: 'villa-01-safari-vista',
            description: 'Immerse yourself in luxury at Safari Vista, a stunning 3-bedroom villa offering panoramic views of Mount Kenya. This spacious retreat combines modern elegance with natural beauty, featuring floor-to-ceiling windows, a fully equipped gourmet kitchen, and expansive outdoor living spaces perfect for watching the African sunset.',
            basePrice: 15000,
            capacity: 6,
            bedrooms: 3,
            bathrooms: 2,
            amenities: [
                'High-Speed WiFi',
                'Fully Equipped Kitchen',
                'Panoramic Mountain Views',
                'Private Garden',
                'Secure Parking',
                'Living Room with Fireplace',
                'Dining Area for 8',
                'Outdoor Seating',
                'BBQ Grill'
            ],
            houseRules: [
                'Check-in: 2:00 PM',
                'Check-out: 11:00 AM',
                'No smoking inside the villa',
                'No parties or events',
                'Pets allowed with prior approval',
                'Respect the quiet hours (10 PM - 7 AM)'
            ],
            featured: true,
            appliedOffer: {
                name: 'Featured Villa',
                discountType: 'percentage' as const,
                discountValue: 0
            }
        }
    }

    return villas[slug as keyof typeof villas] || null
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const villa = getVillaBySlug(slug)

    if (!villa) {
        return {
            title: 'Villa Not Found | Lifestyle Villas Nanyuki'
        }
    }

    return {
        title: `${villa.name} - ${villa.houseNumber} | Lifestyle Villas Nanyuki`,
        description: villa.description,
        openGraph: {
            title: `${villa.name} | Lifestyle Villas Nanyuki`,
            description: villa.description,
            images: ['/images/villas/villa-01.jpg'], // Would use actual villa images
        }
    }
}

export default async function VillaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const villa = getVillaBySlug(slug)

    if (!villa) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h1 className="font-serif text-4xl font-bold mb-4 text-safari-night">Villa Not Found</h1>
                    <p className="text-neutral-600 mb-8">Sorry, we couldn&apos;t find the villa you&apos;re looking for.</p>
                    <Link href="/villas" className="text-safari-olive hover:text-safari-sand font-medium">
                        ← Back to all villas
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-background">
            {/* Breadcrumb */}
            <div className="bg-neutral-50 py-4 border-b border-neutral-200">
                <div className="container-premium">
                    <div className="flex items-center space-x-2 text-sm text-neutral-600">
                        <Link href="/" className="hover:text-safari-olive">Home</Link>
                        <span>/</span>
                        <Link href="/villas" className="hover:text-safari-olive">Villas</Link>
                        <span>/</span>
                        <span className="text-safari-night font-medium">{villa.name}</span>
                    </div>
                </div>
            </div>

            {/* Villa Header */}
            <section className="py-8">
                <div className="container-premium">
                    <div className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <h1 className="font-serif text-4xl md:text-5xl font-bold text-safari-night">
                                {villa.name}
                            </h1>
                            {villa.appliedOffer && villa.appliedOffer.name !== 'Featured Villa' && (
                                <div className="bg-safari-olive text-white px-4 py-2 rounded-full text-sm font-medium">
                                    {villa.appliedOffer.name}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center space-x-4 text-neutral-600">
                            <span className="font-medium">{villa.houseNumber}</span>
                            <span>•</span>
                            <span>{villa.bedrooms} bedrooms</span>
                            <span>•</span>
                            <span>{villa.bathrooms} bathrooms</span>
                            <span>•</span>
                            <span>Sleeps {villa.capacity}</span>
                        </div>
                    </div>

                    {/* Image Gallery */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
                        {/* Main Image */}
                        <div className="md:row-span-2 relative h-96 md:h-full bg-gradient-to-br from-neutral-300 to-neutral-200 rounded-2xl overflow-hidden">
                            <div className="absolute inset-0 flex items-center justify-center">
                                <span className="text-white text-lg font-medium">Main Villa Image</span>
                            </div>
                        </div>
                        {/* Secondary Images */}
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative h-48 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded-xl overflow-hidden">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-white text-sm">Image {i + 1}</span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Main Content */}
                        <div className="lg:col-span-2 space-y-12">
                            {/* Description */}
                            <div>
                                <h2 className="font-serif text-3xl font-bold mb-4 text-safari-night">
                                    About This Villa
                                </h2>
                                <p className="text-lg text-neutral-700 leading-relaxed">
                                    {villa.description}
                                </p>
                            </div>

                            {/* Amenities */}
                            <div>
                                <h2 className="font-serif text-3xl font-bold mb-6 text-safari-night">
                                    Amenities
                                </h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {villa.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center space-x-3">
                                            <svg className="w-5 h-5 text-safari-olive" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            <span className="text-neutral-700">{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* House Rules */}
                            <div>
                                <h2 className="font-serif text-3xl font-bold mb-6 text-safari-night">
                                    House Rules
                                </h2>
                                <div className="space-y-3">
                                    {villa.houseRules.map((rule, index) => (
                                        <div key={index} className="flex items-start space-x-3">
                                            <svg className="w-5 h-5 text-safari-olive mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            <span className="text-neutral-700">{rule}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <h2 className="font-serif text-3xl font-bold mb-6 text-safari-night">
                                    Location
                                </h2>
                                <p className="text-neutral-700 mb-4">
                                    Located in the heart of Nanyuki, at the foothills of Mount Kenya. Our villas offer easy access to:
                                </p>
                                <ul className="space-y-2 text-neutral-700">
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-safari-olive rounded-full mr-3"></span>
                                        Ol Pejeta Conservancy - 20 minutes
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-safari-olive rounded-full mr-3"></span>
                                        Mount Kenya National Park - 30 minutes
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-safari-olive rounded-full mr-3"></span>
                                        Nanyuki Town Center - 10 minutes
                                    </li>
                                    <li className="flex items-center">
                                        <span className="w-2 h-2 bg-safari-olive rounded-full mr-3"></span>
                                        Nanyuki Airstrip - 15 minutes
                                    </li>
                                </ul>
                            </div>

                            {/* Reviews */}
                            <div>
                                <h2 className="font-serif text-3xl font-bold mb-6 text-safari-night">
                                    Guest Reviews
                                </h2>
                                <div className="space-y-6">
                                    {[
                                        { name: 'Sarah K.', rating: 5, text: 'Absolutely stunning location with breathtaking views. The villa exceeded all our expectations!' },
                                        { name: 'David M.', rating: 5, text: 'Perfect for our family vacation. Clean, spacious, and beautifully maintained.' }
                                    ].map((review, index) => (
                                        <div key={index} className="bg-neutral-50 p-6 rounded-xl">
                                            <div className="flex items-center mb-3">
                                                <div className="flex text-yellow-400 mr-2">
                                                    {[...Array(review.rating)].map((_, i) => (
                                                        <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                    ))}
                                                </div>
                                                <span className="text-xs text-safari-olive font-medium">Verified Google Review</span>
                                            </div>
                                            <p className="text-neutral-700 italic mb-2">&quot;{review.text}&quot;</p>
                                            <p className="text-safari-night font-semibold text-sm">— {review.name}</p>
                                        </div>
                                    ))}
                                </div>
                                <Link
                                    href="/reviews"
                                    className="inline-flex items-center text-safari-olive hover:text-safari-sand font-medium mt-4"
                                >
                                    View all reviews
                                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Booking Terminal (Sidebar) */}
                        <div className="lg:col-span-1">
                            <BookingTerminal
                                villaId={villa.id}
                                villaName={villa.name}
                                houseNumber={villa.houseNumber}
                                basePrice={villa.basePrice}
                                capacity={villa.capacity}
                                appliedOffer={villa.appliedOffer.name !== 'Featured Villa' ? villa.appliedOffer : undefined}
                            />
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}
