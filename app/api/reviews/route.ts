import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const cookieStore = cookies()
        const supabase = createClient(cookieStore)

        // Fetch metadata
        const { data: metaData, error: metaError } = await supabase
            .from('google_reviews_meta')
            .select('*')
            .eq('place_id', 'ChIJ6SeH2hEdKBgRfE-OEHIf4ZA')
            .single()

        if (metaError && metaError.code !== 'PGRST116') { // Ignore 'PGRST116' (No rows found)
            console.error('Error fetching meta:', metaError)
        }

        // Fetch reviews, ordered by most recent
        const { data: reviewsData, error: reviewsError } = await supabase
            .from('google_reviews')
            .select('*')
            .order('time', { ascending: false })

        if (reviewsError) {
            console.error('Error fetching reviews:', reviewsError)
            return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 })
        }

        return NextResponse.json({
            meta: {
                placeName: metaData?.place_name || 'Lifestyle Villas Nanyuki',
                overallRating: metaData?.overall_rating || null,
                totalReviews: metaData?.total_reviews || 0,
                lastFetched: metaData?.last_fetched_at || null,
            },
            reviews: reviewsData || [],
        })
    } catch (e) {
        console.error('Reviews fetch error:', e)
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
}
