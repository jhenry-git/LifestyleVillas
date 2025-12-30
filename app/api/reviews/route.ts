import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GOOGLE_PLACE_ID = 'ChIJ6SeH2hEdKBgRfE-OEHIf4ZA'

// Create a read-only Supabase client
function getSupabase() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createClient(supabaseUrl, supabaseAnonKey)
}

export async function GET() {
    try {
        const supabase = getSupabase()

        // Fetch aggregate meta
        const { data: meta, error: metaError } = await supabase
            .from('google_reviews_meta')
            .select('*')
            .eq('place_id', GOOGLE_PLACE_ID)
            .single()

        if (metaError && metaError.code !== 'PGRST116') {
            console.error('Error fetching meta:', metaError)
        }

        // Fetch all cached reviews, ordered by time descending
        const { data: reviews, error: reviewsError } = await supabase
            .from('google_reviews')
            .select('*')
            .order('time', { ascending: false })

        if (reviewsError) {
            console.error('Error fetching reviews:', reviewsError)
            return NextResponse.json(
                { error: 'Failed to fetch reviews' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            meta: {
                placeName: meta?.place_name || 'Lifestyle Villas Nanyuki',
                overallRating: meta?.overall_rating || null,
                totalReviews: meta?.total_reviews || 0,
                lastFetched: meta?.last_fetched_at || null
            },
            reviews: reviews || []
        })

    } catch (error) {
        console.error('Reviews fetch error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
