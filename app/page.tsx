import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'
import HomeClient from '@/components/home/HomeClient'

async function getFeaturedVillas() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Fetch featured villas, up to 3
  const { data: villas } = await supabase
    .from('villas')
    .select('*')
    .eq('status', 'published')
    .eq('featured', true)
    .limit(3)
    .order('created_at', { ascending: false })

  // If no featured, just get latest 3
  if (!villas || villas.length === 0) {
    const { data: fallbackVillas } = await supabase
      .from('villas')
      .select('*')
      .eq('status', 'published')
      .limit(3)
      .order('created_at', { ascending: false })

    if (!fallbackVillas) return []
    return mapVillas(fallbackVillas)
  }

  return mapVillas(villas)
}

function mapVillas(villas: any[]) {
  return villas.map(villa => ({
    id: villa.id,
    houseNumber: villa.name,
    name: villa.name,
    slug: villa.slug,
    description: villa.description || '',
    basePrice: villa.price_per_night,
    capacity: villa.max_guests,
    amenities: (villa.amenities as string[]) || [],
    featured: villa.featured || false,
    offers: [],
    image: villa.featured_image || (villa.images && villa.images[0]) || null
  }))
}

export default async function HomePage() {
  const villas = await getFeaturedVillas()
  return <HomeClient villas={villas} />
}
