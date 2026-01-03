import { BUSINESS_INFO, SITE_CONFIG } from './constants'

// Schema.org JSON-LD generators for SEO

export function generateOrganizationSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: BUSINESS_INFO.name,
        legalName: BUSINESS_INFO.legalName,
        url: SITE_CONFIG.url,
        logo: `${SITE_CONFIG.url}/logo.png`,
        description: SITE_CONFIG.description,
        email: BUSINESS_INFO.email,
        telephone: BUSINESS_INFO.phone,
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS_INFO.address.streetAddress,
            addressLocality: BUSINESS_INFO.address.addressLocality,
            addressRegion: BUSINESS_INFO.address.addressRegion,
            postalCode: BUSINESS_INFO.address.postalCode,
            addressCountry: BUSINESS_INFO.address.addressCountry,
        },
        sameAs: [
            BUSINESS_INFO.socialMedia.facebook,
            BUSINESS_INFO.socialMedia.instagram,
        ],
    }
}

export function generateLocalBusinessSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'LodgingBusiness',
        '@id': `${SITE_CONFIG.url}/#lodging`,
        name: BUSINESS_INFO.name,
        description: SITE_CONFIG.description,
        url: SITE_CONFIG.url,
        telephone: BUSINESS_INFO.phone,
        email: BUSINESS_INFO.email,
        priceRange: BUSINESS_INFO.priceRange,
        address: {
            '@type': 'PostalAddress',
            streetAddress: BUSINESS_INFO.address.streetAddress,
            addressLocality: BUSINESS_INFO.address.addressLocality,
            addressRegion: BUSINESS_INFO.address.addressRegion,
            postalCode: BUSINESS_INFO.address.postalCode,
            addressCountry: BUSINESS_INFO.address.addressCountry,
        },
        geo: {
            '@type': 'GeoCoordinates',
            latitude: BUSINESS_INFO.geo.latitude,
            longitude: BUSINESS_INFO.geo.longitude,
        },
        openingHoursSpecification: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
                'Monday',
                'Tuesday',
                'Wednesday',
                'Thursday',
                'Friday',
                'Saturday',
                'Sunday',
            ],
            opens: '00:00',
            closes: '23:59',
        },
        sameAs: [
            BUSINESS_INFO.socialMedia.facebook,
            BUSINESS_INFO.socialMedia.instagram,
        ],
    }
}

interface VillaSchema {
    id: string
    name: string
    slug: string
    description: string
    price: number
    capacity: number
    bedrooms?: number
    bathrooms?: number
    image?: string
    rating?: number
    reviewCount?: number
}

export function generateProductSchema(villa: VillaSchema) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: villa.name,
        description: villa.description,
        url: `${SITE_CONFIG.url}/villas/${villa.slug}`,
        offers: {
            '@type': 'Offer',
            price: villa.price,
            priceCurrency: 'KES',
            availability: 'https://schema.org/InStock',
            url: `${SITE_CONFIG.url}/villas/${villa.slug}`,
            priceValidUntil: new Date(
                new Date().setFullYear(new Date().getFullYear() + 1)
            )
                .toISOString()
                .split('T')[0],
        },
        brand: {
            '@type': 'Brand',
            name: BUSINESS_INFO.name,
        },
    }

    if (villa.image) {
        schema.image = villa.image.startsWith('http')
            ? villa.image
            : `${SITE_CONFIG.url}${villa.image}`
    }

    // Add aggregate rating if available
    if (villa.rating && villa.reviewCount) {
        schema.aggregateRating = {
            '@type': 'AggregateRating',
            ratingValue: villa.rating,
            reviewCount: villa.reviewCount,
            bestRating: 5,
            worstRating: 1,
        }
    }

    // Add additional properties
    if (villa.bedrooms || villa.bathrooms || villa.capacity) {
        schema.additionalProperty = []

        if (villa.bedrooms) {
            schema.additionalProperty.push({
                '@type': 'PropertyValue',
                name: 'Bedrooms',
                value: villa.bedrooms,
            })
        }

        if (villa.bathrooms) {
            schema.additionalProperty.push({
                '@type': 'PropertyValue',
                name: 'Bathrooms',
                value: villa.bathrooms,
            })
        }

        if (villa.capacity) {
            schema.additionalProperty.push({
                '@type': 'PropertyValue',
                name: 'Maximum Occupancy',
                value: villa.capacity,
            })
        }
    }

    return schema
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${SITE_CONFIG.url}${item.url}`,
        })),
    }
}

interface ExperienceSchema {
    name: string
    description: string
    image?: string
    category: string
}

export function generateTouristAttractionSchema(experience: ExperienceSchema) {
    const schema: any = {
        '@context': 'https://schema.org',
        '@type': 'TouristAttraction',
        name: experience.name,
        description: experience.description,
        touristType: experience.category,
    }

    if (experience.image) {
        schema.image = experience.image.startsWith('http')
            ? experience.image
            : `${SITE_CONFIG.url}${experience.image}`
    }

    return schema
}

export function generateItemListSchema(
    items: { name: string; url: string; image?: string }[],
    listName: string
) {
    return {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: listName,
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            item: {
                '@type': 'Thing',
                name: item.name,
                url: `${SITE_CONFIG.url}${item.url}`,
                image: item.image,
            },
        })),
    }
}

export function generatePlaceSchema() {
    return {
        '@context': 'https://schema.org',
        '@type': 'Place',
        name: 'Nanyuki, Kenya',
        description:
            'A cosmopolitan hub at the foothills of Mount Kenya, gateway to the northern frontier of Kenya.',
        geo: {
            '@type': 'GeoCoordinates',
            latitude: BUSINESS_INFO.geo.latitude,
            longitude: BUSINESS_INFO.geo.longitude,
        },
        address: {
            '@type': 'PostalAddress',
            addressLocality: 'Nanyuki',
            addressRegion: 'Laikipia County',
            addressCountry: 'Kenya',
        },
    }
}
