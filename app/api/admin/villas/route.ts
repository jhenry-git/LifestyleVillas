import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// GET /api/admin/villas - List all villas
export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const status = searchParams.get('status')
        const search = searchParams.get('search')

        let query = supabase
            .from('villas')
            .select('*')
            .order('created_at', { ascending: false })

        // Filter by status if provided
        if (status && status !== 'all') {
            query = query.eq('status', status)
        }

        // Search by name if provided
        if (search) {
            query = query.ilike('name', `%${search}%`)
        }

        const { data, error } = await query

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to fetch villas', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ villas: data || [] })
    } catch (error) {
        console.error('Error fetching villas:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// POST /api/admin/villas - Create a new villa
export async function POST(request: NextRequest) {
    try {
        const body = await request.json()

        // Validate required fields
        const requiredFields = ['name', 'slug', 'bedrooms', 'bathrooms', 'max_guests', 'price_per_night']
        for (const field of requiredFields) {
            if (!body[field]) {
                return NextResponse.json(
                    { error: `Missing required field: ${field}` },
                    { status: 400 }
                )
            }
        }

        //  Insert the villa
        const { data, error } = await supabase
            .from('villas')
            .insert([{
                name: body.name,
                slug: body.slug,
                description: body.description || null,
                long_description: body.long_description || null,
                bedrooms: body.bedrooms,
                bathrooms: body.bathrooms,
                max_guests: body.max_guests,
                price_per_night: body.price_per_night,
                amenities: body.amenities || [],
                highlights: body.highlights || [],
                images: body.images || [],
                featured_image: body.featured_image || null,
                location: body.location || 'Nanyuki, Kenya',
                minimum_stay: body.minimum_stay || 1,
                status: body.status || 'draft',
                featured: body.featured || false,
            }])
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to create villa', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ villa: data }, { status: 201 })
    } catch (error) {
        console.error('Error creating villa:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
