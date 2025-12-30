export interface Villa {
    id: string
    name: string
    slug: string
    description: string | null
    long_description: string | null
    bedrooms: number
    bathrooms: number
    max_guests: number
    price_per_night: number
    amenities: string[]
    highlights: string[]
    images: string[]
    featured_image: string | null
    location: string
    minimum_stay: number
    status: 'draft' | 'published' | 'archived'
    featured: boolean
    created_at: string
    updated_at: string
}

export interface CreateVillaInput {
    name: string
    slug: string
    description?: string
    long_description?: string
    bedrooms: number
    bathrooms: number
    max_guests: number
    price_per_night: number
    amenities?: string[]
    highlights?: string[]
    images?: string[]
    featured_image?: string
    location?: string
    minimum_stay?: number
    status?: 'draft' | 'published' | 'archived'
    featured?: boolean
}

export interface UpdateVillaInput extends Partial<CreateVillaInput> {
    id: string
}

export interface Booking {
    id: string
    villa_id: string
    guest_name: string
    guest_email: string
    guest_phone: string | null
    check_in: string
    check_out: string
    number_of_guests: number
    number_of_nights: number
    base_price: number
    total_price: number
    payment_status: 'pending' | 'partial' | 'paid'
    paid_amount: number
    status: 'inquiry' | 'pending' | 'confirmed' | 'completed' | 'cancelled'
    special_requests: string | null
    internal_notes: string | null
    source: 'website' | 'whatsapp' | 'email' | 'phone' | 'manual'
    created_at: string
    updated_at: string
}
