// SEO Constants for Lifestyle Villas Nanyuki

export const SITE_CONFIG = {
    name: 'Lifestyle Villas Nanyuki',
    shortName: 'Lifestyle Villas',
    description: 'Premium luxury villas at the foothills of Mount Kenya in Nanyuki. Experience refined accommodation for your Kenya safari adventure.',
    url: 'https://lifestyle-villas.com',
    locale: 'en_KE',
    type: 'website',
} as const

export const BUSINESS_INFO = {
    name: 'Lifestyle Villas Nanyuki',
    legalName: 'Lifestyle Villas Limited',
    email: 'info@lifestyle-villas.com',
    phone: '+254718490351',
    whatsapp: '254718490351',
    address: {
        streetAddress: 'Nanyuki',
        addressLocality: 'Nanyuki',
        addressRegion: 'Laikipia County',
        postalCode: '10400',
        addressCountry: 'KE',
    },
    geo: {
        latitude: -0.0167,
        longitude: 37.0667,
    },
    socialMedia: {
        facebook: 'https://www.facebook.com/share/1AKhBKKEu6/?mibextid=wwXIfr',
        instagram: 'https://www.instagram.com/lifestyle_villas_nanyuki?igsh=MXNkb2Nia2ZsbHNpdQ==',
    },
    priceRange: 'KES 12,000 - 20,000',
} as const

export const PRIMARY_KEYWORDS = {
    homepage: [
        'luxury villas nanyuki',
        'lifestyle villas nanyuki',
        'mount kenya accommodation',
        'nanyuki vacation rentals',
        'luxury villa rentals foothills mount kenya',
    ],
    villas: [
        'villas in nanyuki',
        'nanyuki vacation rentals',
        'holiday homes nanyuki',
        'nanyuki airbnb alternative',
        'private villas nanyuki kenya',
        'family villas near mount kenya',
    ],
    experiences: [
        'things to do in nanyuki',
        'nanyuki activities',
        'adventures near nanyuki',
        'nanyuki safari',
        'mount kenya hikes',
        'what to do in nanyuki kenya',
        'nanyuki wildlife experiences',
    ],
    destinations: [
        'visit nanyuki',
        'nanyuki kenya',
        'nanyuki travel guide',
        'nanyuki tourism',
        'nanyuki destination',
        'nanyuki equator',
        'why visit nanyuki kenya',
    ],
} as const

export const NEARBY_ATTRACTIONS = [
    {
        name: 'Ol Pejeta Conservancy',
        distance: '25 km',
        type: 'Wildlife Conservancy',
    },
    {
        name: 'Mount Kenya National Park',
        distance: '40 km',
        type: 'National Park',
    },
    {
        name: 'Ngare Ndare Forest',
        distance: '45 km',
        type: 'Indigenous Forest',
    },
    {
        name: 'Nanyuki Town Center',
        distance: '5 km',
        type: 'Town',
    },
    {
        name: 'Equator Marker',
        distance: '3 km',
        type: 'Tourist Attraction',
    },
] as const

export const DEFAULT_OG_IMAGE = '/og-image.jpg'
export const TWITTER_HANDLE = '@LifestyleVillasKE'
