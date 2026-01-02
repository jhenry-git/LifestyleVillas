import { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import { Users, Wifi, Bed, MapPin, MessageCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import VillaFilters from './VillaFilters'

export const metadata: Metadata = {
    title: 'Our Villas | Lifestyle Villas Nanyuki',
    description: 'Explore our collection of premium villas in Nanyuki. Each villa offers stunning views of Mount Kenya and world-class amenities.',
}

// --- Data Fetching Logic ---
async function getVillas(searchParams: { [key: string]: string | string[] | undefined }) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Basic query
    let query = supabase
        .from('villas')
        .select('*')
        .eq('status', 'published')
        .order('featured', { ascending: false }) // Featured first
        .order('created_at', { ascending: false })

    // Apply Filters (Server Side for SEO & Performance)
    const capacity = Number(searchParams?.capacity)
    if (capacity) {
        query = query.gte('max_guests', capacity)
    }

    const { data: villas } = await query

    if (!villas) return []

    // Helper to extract image safely
    const getImage = (v: any) => {
        if (v.featured_image) return v.featured_image;
        if (Array.isArray(v.images) && v.images.length > 0) {
            return typeof v.images[0] === 'string'
                ? v.images[0]
                : (v.images as any)[0]?.images?.[0];
        }
        return '/placeholder-villa.jpg'; // Fallback image
    }

    // Map and second-pass filter for Price (since range filtering is complex in basic Select)
    let mappedVillas = villas.map(villa => ({
        id: villa.id,
        name: villa.name,
        slug: villa.slug,
        description: villa.description || '',
        basePrice: villa.price_per_night,
        capacity: villa.max_guests,
        amenities: (villa.amenities as string[]) || [],
        featured: villa.featured || false,
        location: 'Nanyuki',
        offers: villa.price_per_night < 15000 ? [{ tag: 'Best Value' }] : [],
        image: getImage(villa)
    }));

    // Filter by Price Logic
    const priceFilter = searchParams?.price;
    if (priceFilter === 'low') mappedVillas = mappedVillas.filter(v => v.basePrice < 15000);
    if (priceFilter === 'mid') mappedVillas = mappedVillas.filter(v => v.basePrice >= 15000 && v.basePrice <= 20000);
    if (priceFilter === 'high') mappedVillas = mappedVillas.filter(v => v.basePrice > 20000);

    return mappedVillas;
}

// --- Main Component ---
export default async function VillasPage({
    searchParams
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const villas = await getVillas(searchParams)

    return (
        <main className="bg-neutral-50 min-h-screen">

            {/* Header: Immersive & Clean */}
            <section className="relative bg-safari-night text-white py-24 overflow-hidden">
                {/* Abstract Background pattern */}
                <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-5" />
                <div className="container-premium relative z-10 text-center">
                    <span className="inline-block py-1 px-3 rounded-full bg-white/10 border border-white/20 text-xs font-medium tracking-wider mb-4">
                        PREMIUM COLLECTION
                    </span>
                    <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                        Find Your Sanctuary
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-300 max-w-2xl mx-auto font-light leading-relaxed">
                        Retreat to the foothills of Mount Kenya. Thoughtfully designed villas
                        blending modern elegance with the wild beauty of Nanyuki.
                    </p>
                </div>
            </section>

            {/* Sticky Filters */}
            <VillaFilters totalCount={villas.length} />

            {/* Grid Section */}
            <section className="py-12 md:py-20 px-4 md:px-0">
                <div className="container-premium">

                    {villas.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-2xl font-serif text-neutral-400">No villas found matching your criteria.</h3>
                            <Link href="/villas" className="text-safari-olive hover:underline mt-4 block">Clear all filters</Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                            {villas.map((villa) => (
                                <Link
                                    href={`/villas/${villa.slug}`}
                                    key={villa.id}
                                    className="group block bg-white rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                                >
                                    {/* Image Container */}
                                    <div className="relative aspect-[4/3] overflow-hidden bg-neutral-200">
                                        <Image
                                            src={villa.image}
                                            alt={villa.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        />

                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                                        {/* Status Tags */}
                                        <div className="absolute top-4 left-4 flex gap-2">
                                            {villa.featured && (
                                                <span className="bg-white/90 backdrop-blur text-safari-night text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                                    Featured
                                                </span>
                                            )}
                                        </div>

                                        {/* Price Overlay */}
                                        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur px-4 py-2 rounded-lg shadow-lg">
                                            <span className="block text-xs text-neutral-500 font-medium uppercase">From</span>
                                            <div className="flex items-baseline gap-1">
                                                <span className="text-safari-night font-bold text-lg">
                                                    KES {villa.basePrice.toLocaleString()}
                                                </span>
                                                <span className="text-xs text-neutral-500">/night</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="flex items-center text-safari-olive text-xs font-medium mb-2">
                                                <MapPin className="w-3 h-3 mr-1" />
                                                {villa.location}
                                            </div>
                                            {/* Capacity Badge */}
                                            <div className="flex items-center gap-1 text-xs font-medium text-neutral-600 bg-neutral-100 px-2 py-1 rounded-md">
                                                <Users className="w-3 h-3" />
                                                <span>Up to {villa.capacity}</span>
                                            </div>
                                        </div>

                                        <h3 className="font-serif text-2xl font-bold text-safari-night mb-2 group-hover:text-safari-olive transition-colors">
                                            {villa.name}
                                        </h3>

                                        <p className="text-neutral-500 text-sm line-clamp-2 mb-6 leading-relaxed">
                                            {villa.description}
                                        </p>

                                        {/* Amenities Icons (Visual instead of text) */}
                                        <div className="flex items-center gap-4 pt-4 border-t border-neutral-100">
                                            <div className="flex gap-3 text-neutral-400">
                                                {/* Logic to show icons based on amenities array */}
                                                {villa.amenities.some((a: string) => a.toLowerCase().includes('wifi')) && <Wifi className="w-4 h-4" />}
                                                {villa.amenities.some((a: string) => a.toLowerCase().includes('pool')) && <div className="text-xs bg-blue-50 text-blue-600 px-1 rounded">Pool</div>}
                                                <div className="flex items-center gap-1">
                                                    <Bed className="w-4 h-4" />
                                                    <span className="text-xs">{Math.ceil(villa.capacity / 2)} Bd</span>
                                                </div>
                                            </div>

                                            <div className="ml-auto text-sm font-medium text-safari-olive flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity group-hover:translate-x-0 -translate-x-2 duration-300">
                                                View Villa →
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Enhanced CTA */}
            <section className="py-24 bg-white border-t border-neutral-200">
                <div className="container-premium max-w-4xl mx-auto text-center">
                    <h2 className="font-serif text-4xl md:text-5xl font-bold mb-6 text-safari-night">
                        Concierge Service
                    </h2>
                    <p className="text-lg text-neutral-600 mb-10 leading-relaxed">
                        Unsure which villa suits your group? Our dedicated team is available to
                        help curate your perfect Nanyuki experience, from booking to checkout.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Button
                            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '254718490351'}?text=${encodeURIComponent('Hi! I need help choosing a villa for my stay in Nanyuki.')}`}
                            variant="primary"
                            size="lg"
                            className="shadow-xl shadow-safari-olive/20 hover:shadow-2xl hover:shadow-safari-olive/30"
                        >
                            <MessageCircle className="w-5 h-5 mr-2" />
                            Chat on WhatsApp
                        </Button>
                        <Button
                            href="/contact"
                            variant="outline"
                            size="lg"
                        >
                            Contact Support
                        </Button>
                    </div>
                </div>
            </section>
        </main>
    )
}
