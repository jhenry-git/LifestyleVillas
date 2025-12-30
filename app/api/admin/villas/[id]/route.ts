import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase/client'

// GET /api/admin/villas/[id] - Get a single villa
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { data, error } = await supabase
            .from('villas')
            .select('*')
            .eq('id', params.id)
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Villa not found', details: error.message },
                { status: 404 }
            )
        }

        return NextResponse.json({ villa: data })
    } catch (error) {
        console.error('Error fetching villa:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// PUT /api/admin/villas/[id] - Update a villa
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const body = await request.json()

        const { data, error } = await supabase
            .from('villas')
            .update({
                ...(body.name && { name: body.name }),
                ...(body.slug && { slug: body.slug }),
                ...(body.description !== undefined && { description: body.description }),
                ...(body.long_description !== undefined && { long_description: body.long_description }),
                ...(body.bedrooms && { bedrooms: body.bedrooms }),
                ...(body.bathrooms && { bathrooms: body.bathrooms }),
                ...(body.max_guests && { max_guests: body.max_guests }),
                ...(body.price_per_night && { price_per_night: body.price_per_night }),
                ...(body.amenities && { amenities: body.amenities }),
                ...(body.highlights && { highlights: body.highlights }),
                ...(body.images && { images: body.images }),
                ...(body.featured_image !== undefined && { featured_image: body.featured_image }),
                ...(body.location && { location: body.location }),
                ...(body.minimum_stay && { minimum_stay: body.minimum_stay }),
                ...(body.status && { status: body.status }),
                ...(body.featured !== undefined && { featured: body.featured }),
            })
            .eq('id', params.id)
            .select()
            .single()

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to update villa', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ villa: data })
    } catch (error) {
        console.error('Error updating villa:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

// DELETE /api/admin/villas/[id] - Delete a villa
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { error } = await supabase
            .from('villas')
            .delete()
            .eq('id', params.id)

        if (error) {
            console.error('Supabase error:', error)
            return NextResponse.json(
                { error: 'Failed to delete villa', details: error.message },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting villa:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
