import { Metadata } from 'next'
import Link from 'next/link'
import Button from '@/components/ui/Button'

export const metadata: Metadata = {
    title: 'Our Villas | Lifestyle Villas Nanyuki',
    description: 'Explore our collection of premium villas in Nanyuki. Each villa offers stunning views of Mount Kenya and world-class amenities.',
}

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

async function getVillas() {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data: villas } = await supabase
        .from('villas')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

    if (!villas) return []

    return villas.map(villa => ({
        id: villa.id,
        houseNumber: villa.name, // Using name as house number for now
        name: villa.name,
        slug: villa.slug,
        description: villa.description || '',
        basePrice: villa.price_per_night,
        capacity: villa.max_guests,
        amenities: (villa.amenities as string[]) || [], // Type assertion for JSONB
        featured: villa.featured || false,
        offers: [] as { tag: string }[], // No offers table yet
        image: villa.featured_image || (villa.images && villa.images[0]) || null
    }))
}

export default async function VillasPage() {
    const villas = await getVillas()
    return (
        <div className="bg-background">
            {/* Header */}
            <section className="bg-safari-night text-white py-20">
                <div className="container-premium text-center">
                    <h1 className="font-serif text-5xl md:text-6xl font-bold mb-6">
                        Our Villas
                    </h1>
                    <p className="text-xl text-neutral-200 max-w-3xl mx-auto">
                        Discover your perfect retreat at the foothills of Mount Kenya.
                        Each villa is thoughtfully designed to provide comfort, elegance, and unforgettable views.
                    </p>
                </div>
            </section>

            {/* Filters Section */}
            <section className="bg-neutral-50 py-8 border-b border-neutral-200 sticky top-20 z-30">
                <div className="container-premium">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-4 flex-wrap">
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mr-2">Capacity:</label>
                                <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive">
                                    <option value="">All</option>
                                    <option value="2">2+ guests</option>
                                    <option value="4">4+ guests</option>
                                    <option value="6">6+ guests</option>
                                    <option value="8">8+ guests</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-neutral-700 mr-2">Price:</label>
                                <select className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-safari-olive">
                                    <option value="">All</option>
                                    <option value="10000-15000">KES 10k - 15k</option>
                                    <option value="15000-20000">KES 15k - 20k</option>
                                    <option value="20000+">KES 20k+</option>
                                </select>
                            </div>
                        </div>
                        <div className="text-sm text-neutral-600">
                            {villas.length} villas available
                        </div>
                    </div>
                </div>
            </section>

            {/* Villas Grid */}
            <section className="py-16">
                <div className="container-premium">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {villas.map((villa) => (
                            <div
                                key={villa.id}
                                className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 border border-neutral-200"
                            >
                                {/* Villa Image */}
                                <div className="relative h-64 bg-gradient-to-br from-neutral-300 to-neutral-200 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-t from-safari-night/50 to-transparent" />

                                    {/* Offer Tags */}
                                    <div className="absolute top-4 right-4 space-y-2">
                                        {villa.offers.map((offer, index) => (
                                            <div
                                                key={index}
                                                className="bg-safari-olive text-white px-3 py-1.5 rounded-full text-sm font-medium shadow-lg"
                                            >
                                                {offer.tag}
                                            </div>
                                        ))}
                                    </div>

                                    {/* House Number Overlay */}
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="text-sm font-medium opacity-80">{villa.houseNumber}</div>
                                        <div className="font-serif text-2xl font-bold">{villa.name}</div>
                                    </div>
                                </div>

                                {/* Villa Info */}
                                <div className="p-6">
                                    <p className="text-neutral-600 mb-4 line-clamp-2">
                                        {villa.description}
                                    </p>

                                    {/* Amenities */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {villa.amenities.slice(0, 3).map((amenity, index) => (
                                            <span
                                                key={index}
                                                className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded"
                                            >
                                                {amenity}
                                            </span>
                                        ))}
                                        {villa.amenities.length > 3 && (
                                            <span className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded">
                                                +{villa.amenities.length - 3} more
                                            </span>
                                        )}
                                    </div>

                                    {/* Capacity & Price */}
                                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-neutral-200">
                                        <div className="flex items-center text-sm text-neutral-600">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                            </svg>
                                            Sleeps {villa.capacity}
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-xl text-safari-night">
                                                KES {villa.basePrice.toLocaleString()}
                                            </div>
                                            <div className="text-sm text-neutral-500">per night</div>
                                        </div>
                                    </div>

                                    {/* View Details Button */}
                                    <Link href={`/villas/${villa.slug}`} className="block">
                                        <Button variant="primary" size="md" className="w-full">
                                            View Details
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-neutral-50">
                <div className="container-premium text-center">
                    <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4 text-safari-night">
                        Can&apos;t decide? Let us help!
                    </h2>
                    <p className="text-lg text-neutral-600 mb-8 max-w-2xl mx-auto">
                        Our team can recommend the perfect villa based on your group size, preferences, and travel dates.
                    </p>
                    <Button
                        href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'}?text=${encodeURIComponent('Hi! I need help choosing a villa for my stay in Nanyuki.')}`}
                        variant="primary"
                        size="lg"
                    >
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                        </svg>
                        Chat with Us
                    </Button>
                </div>
            </section>
        </div>
    )
}
