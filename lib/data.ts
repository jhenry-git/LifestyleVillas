export const reviews = [
    {
        name: 'Sarah K.',
        rating: 5,
        text: 'Absolutely stunning location with breathtaking views of Mount Kenya. The villas are beautifully maintained, spacious, and the hospitality is exceptional. We loved the private pool!',
        date: 'October 2024',
        location: 'United Kingdom'
    },
    {
        name: 'James M.',
        rating: 5,
        text: 'The perfect getaway spot! Clean, luxurious, and the proximity to Ol Pejeta made our wildlife safari unforgettable. The chef service was a highlight – delicious local cuisine.',
        date: 'September 2024',
        location: 'Kenya'
    },
    {
        name: 'Emma L.',
        rating: 4,
        text: 'Lovely villa with all the amenities we needed. Great for families. The garden viewing deck is perfect for breakfast. Only wish we could have stayed longer!',
        date: 'August 2024',
        location: 'Germany'
    },
    {
        name: 'Michael R.',
        rating: 5,
        text: 'Incredible value for money. The security is top-notch, and the staff went above and beyond to organize our transport to Mount Kenya National Park. Highly recommended.',
        date: 'November 2024',
        location: 'USA'
    },
    {
        name: 'Chiara B.',
        rating: 5,
        text: 'A hidden gem in Nanyuki. The modern architecture fits perfectly with the wild surroundings. Waking up to the mountain view was magical.',
        date: 'July 2024',
        location: 'Italy'
    },
    {
        name: 'David W.',
        rating: 5,
        text: 'We hosted a small family reunion here and it was flawless. The BBQ area and large living spaces were perfect for entertaining. Will definitely be back.',
        date: 'December 2024',
        location: 'Kenya'
    }
]

export const villas = [
    {
        id: '1',
        houseNumber: 'Villa 01',
        name: 'Safari Vista',
        slug: 'villa-01-safari-vista',
        description: 'A luxurious 3-bedroom villa with panoramic views of Mount Kenya',
        basePrice: 15000,
        capacity: 6,
        capacityLabel: '6 guests',
        bedrooms: 3,
        bathrooms: 2,
        amenities: ['WiFi', 'Kitchen', 'Mountain View', 'Garden', 'Parking', 'Smart TV'],
        featured: true,
        offers: [{ tag: 'Featured' }],
        details: {
            description: 'Immerse yourself in luxury at Safari Vista, a stunning 3-bedroom villa offering panoramic views of Mount Kenya. This spacious retreat combines modern elegance with natural beauty, featuring floor-to-ceiling windows, a fully equipped gourmet kitchen, and expansive outdoor living spaces perfect for watching the African sunset.',
            houseRules: [
                'Check-in: 2:00 PM',
                'Check-out: 11:00 AM',
                'No smoking inside the villa',
                'No parties or events',
                'Pets allowed with prior approval',
                'Respect the quiet hours (10 PM - 7 AM)'
            ],
            fullAmenities: [
                'High-Speed WiFi (20Mbps)',
                'Fully Equipped Kitchen',
                'Panoramic Mount Kenya Views',
                'Private Landscaped Garden',
                'Secure Parking for 2 Cars',
                'Living Room with Fireplace',
                'Dining Area for 8',
                'Outdoor Terraced Seating',
                'BBQ Grill Station',
                'Daily Housekeeping',
                'Smart TV with Netflix'
            ],
            appliedOffer: {
                name: 'Featured Villa',
                discountType: 'percentage',
                discountValue: 0
            }
        }
    },
    {
        id: '2',
        houseNumber: 'Villa 02',
        name: 'Nanyuki Retreat',
        slug: 'villa-02-nanyuki-retreat',
        description: 'Serene 2-bedroom villa perfect for couples and small families',
        basePrice: 12000,
        capacity: 4,
        capacityLabel: '4 guests',
        bedrooms: 2,
        bathrooms: 2,
        amenities: ['WiFi', 'Kitchen', 'Garden', 'Parking', 'Veranda'],
        featured: true,
        offers: [{ tag: 'Stay 3 Pay 2' }],
        details: {
            description: 'A serene escape perfect for smaller groups or couples. Nanyuki Retreat offers an intimate setting with all the modern comforts you need. The private veranda is the perfect spot for your morning coffee while listening to the birds.',
            houseRules: [
                'Check-in: 2:00 PM',
                'Check-out: 11:00 AM',
                'No smoking inside',
                'No parties'
            ],
            fullAmenities: [
                'WiFi',
                'Modern Kitchenette',
                'Private Veranda',
                'Garden Access',
                'Secure Parking',
                'En-suite Bathrooms',
                'Hot Water Showers'
            ],
            appliedOffer: {
                name: 'Stay 3 Pay 2',
                discountType: 'nights_based',
                discountValue: 33
            }
        }
    },
    {
        id: '3',
        houseNumber: 'Villa 03',
        name: 'Mount Kenya Lodge',
        slug: 'villa-03-mount-kenya-lodge',
        description: 'Spacious 4-bedroom villa ideal for group getaways',
        basePrice: 20000,
        capacity: 8,
        capacityLabel: '8 guests',
        bedrooms: 4,
        bathrooms: 3,
        amenities: ['WiFi', 'Kitchen', 'Fireplace', 'BBQ Area', 'Mountain View', 'Parking'],
        featured: false,
        offers: [],
        details: {
            description: 'The ultimate group getaway destination. Mount Kenya Lodge features spacious living areas, multiple en-suite bedrooms, and a large garden, making this the perfect choice for family gatherings or groups of friends exploring Laikipia.',
            houseRules: [
                'Check-in: 2:00 PM',
                'Check-out: 11:00 AM',
                'No smoking inside',
                'No noise after 10 PM'
            ],
            fullAmenities: [
                'High-Speed WiFi',
                'Full Kitchen with Island',
                'Stone Fireplace',
                'Large BBQ Area',
                'Direct Mountain Views',
                'Ample Parking',
                'Laundry Facilities',
                '24hr Security'
            ],
            appliedOffer: null
        }
    },
]

export const experiences = [
    {
        id: 'ol-pejeta',
        title: 'Ol Pejeta Conservancy',
        category: 'Wildlife',
        description: 'Home to the last two northern white rhinos and a sanctuary for rescued chimpanzees. Enjoy game drives just 30 minutes from your villa.',
        image: '/images/experiences/ol-pejeta.jpg',
        duration: 'Half Day / Full Day',
        distance: '25 km away'
    },
    {
        id: 'mount-kenya-hike',
        title: 'Mount Kenya Hikes',
        category: 'Adventure',
        description: 'Embark on a guided day hike to the Old Moses Camp or a multi-day trek to Point Lenana. Experience breathtaking afro-alpine flora.',
        image: '/images/experiences/mt-kenya.jpg',
        duration: 'Various',
        distance: '40 km to Sirimon Gate'
    },
    {
        id: 'ngare-ndare',
        title: 'Ngare Ndare Forest',
        category: 'Nature',
        description: 'Walk among the treetops on a 40ft high canopy walkway and swim in sparkling glacial blue pools and waterfalls.',
        image: '/images/experiences/ngare-ndare.jpg',
        duration: 'Full Day',
        distance: '45 km away'
    },
    {
        id: 'scenic-flight',
        title: 'Helicopter Scenic Flights',
        category: 'Luxury',
        description: 'Witness the snow-capped peaks of Mount Kenya and the vast Laikipia plateau from the sky. The ultimate luxury safari experience.',
        image: '/images/experiences/helicopter.jpg',
        duration: '1-2 Hours',
        distance: 'Depart from Nanyuki Airstrip'
    }
]

export const nanyukiInfo = {
    climate: {
        title: 'The Perfect Climate',
        description: 'Situated on the Equator but at high altitude (1,947m), Nanyuki enjoys warm sunny days and cool, crisp nights year-round. It is malaria-free and perfect for outdoor activities.'
    },
    location: {
        title: 'Gateway to the North',
        description: 'Nanyuki is the cosmopolitan hub of Laikipia, serving as the gateway to the northern frontier. It sits between the slopes of Mount Kenya and the Aberdare Ranges.'
    },
    highlights: [
        'Equator Marker - Stand in both hemispheres at once.',
        'Cedar Mall - Modern shopping and dining conveniences.',
        'Nanyuki Civil Airfield - Easy access via daily flights from Nairobi.',
        'Laikipia Plateau - High density of wildlife outside national parks.'
    ]
}

export const aboutContent = {
    mission: 'To provide a refined, private sanctuary that bridges the gap between luxury hotel amenities and the comfort of a home, set against the backdrop of Kenya’s most iconic mountain.',
    story: 'Founded by a team passionate about Laikipia’s wild beauty, Lifestyle Villas was born from a desire to create spaces where families and friends can reconnect with nature without compromising on modern luxury. We believe in "Wild Refinement" – offering world-class comfort in a rugged, beautiful setting.',
    values: [
        {
            title: 'Privacy',
            description: 'Your own private space to unwind, away from the crowds of large lodges.'
        },
        {
            title: 'Authenticity',
            description: 'Design and hospitality that honors the local culture and environment.'
        },
        {
            title: 'Excellence',
            description: 'Meticulous attention to detail in cleanliness, unparalleled service, and guest comfort.'
        }
    ]
}
