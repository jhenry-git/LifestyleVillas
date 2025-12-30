import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const GOOGLE_PLACE_ID = 'ChIJ6SeH2hEdKBgRfE-OEHIf4ZA'
const GOOGLE_PLACES_API_URL = 'https://maps.googleapis.com/maps/api/place/details/json'

// Create a Supabase client with service role for database writes
function getSupabaseAdmin() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
        throw new Error('Missing Supabase environment variables')
    }

    return createClient(supabaseUrl, supabaseServiceKey)
}

export async function POST(request: Request) {
    try {
        // Verify sync secret for security (optional but recommended)
        const authHeader = request.headers.get('authorization')
        const syncSecret = process.env.REVIEWS_SYNC_SECRET

        if (syncSecret && authHeader !== `Bearer ${syncSecret}`) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const apiKey = process.env.GOOGLE_PLACES_API_KEY

        if (!apiKey) {
            return NextResponse.json(
                { error: 'Google Places API key not configured' },
                { status: 500 }
            )
        }

        // Fetch from Google Places API
        const url = `${GOOGLE_PLACES_API_URL}?place_id=${GOOGLE_PLACE_ID}&fields=name,rating,user_ratings_total,reviews&key=${apiKey}`

        const response = await fetch(url)
        const data = await response.json()

        if (data.status !== 'OK') {
            console.error('Google Places API error:', data)
            return NextResponse.json(
                { error: 'Failed to fetch from Google Places API', details: data.status },
                { status: 500 }
            )
        }

        const { result } = data
        const supabase = getSupabaseAdmin()

        // Upsert aggregate meta data
        const { error: metaError } = await supabase
            .from('google_reviews_meta')
            .upsert({
                place_id: GOOGLE_PLACE_ID,
                place_name: result.name,
                overall_rating: result.rating,
                total_reviews: result.user_ratings_total,
                last_fetched_at: new Date().toISOString()
            }, {
                onConflict: 'place_id'
            })

        if (metaError) {
            console.error('Error upserting meta:', metaError)
        }

        // Upsert individual reviews
        const reviews = result.reviews || []
        let upsertedCount = 0

        for (const review of reviews) {
            // Create a unique review ID from author + time
            const reviewId = `${review.author_url?.split('/').pop() || review.author_name}_${review.time}`

            const { error: reviewError } = await supabase
                .from('google_reviews')
                .upsert({
                    review_id: reviewId,
                    author_name: review.author_name,
                    author_photo_url: review.profile_photo_url,
                    rating: review.rating,
                    text: review.text,
                    relative_time_description: review.relative_time_description,
                    time: review.time,
                    language: review.language || 'en'
                }, {
                    onConflict: 'review_id'
                })

            if (reviewError) {
                console.error('Error upserting review:', reviewError)
            } else {
                upsertedCount++
            }
        }

        return NextResponse.json({
            success: true,
            message: `Synced ${upsertedCount} reviews`,
            meta: {
                name: result.name,
                rating: result.rating,
                totalReviews: result.user_ratings_total
            }
        })

    } catch (error) {
        console.error('Sync error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// GET endpoint to check sync status
export async function GET() {
    try {
        const supabase = getSupabaseAdmin()

        const { data: meta } = await supabase
            .from('google_reviews_meta')
            .select('*')
            .eq('place_id', GOOGLE_PLACE_ID)
            .single()

        const { count } = await supabase
            .from('google_reviews')
            .select('*', { count: 'exact', head: true })

        return NextResponse.json({
            lastSync: meta?.last_fetched_at || null,
            overallRating: meta?.overall_rating || null,
            totalReviews: meta?.total_reviews || null,
            cachedReviewCount: count || 0
        })
    } catch (error) {
        console.error('Status check error:', error)
        return NextResponse.json(
            { error: 'Failed to check sync status' },
            { status: 500 }
        )
    }
}
