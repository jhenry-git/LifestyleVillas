# Lifestyle Villas Nanyuki - Executive Destination Rental Platform

A premium, culturally immersive destination rental platform built with Next.js 14, featuring admin-controlled pricing, WhatsApp-based bookings, and executive-level operational controls.

## 🌟 Features

### Public Website
- **Cinematic Homepage** - Stunning hero section with Mount Kenya imagery
- **Featured Villas** - Curated villa showcase with admin-selected properties
- **Villas Listing** - Filterable grid with capacity and price filters
- **Individual Villa Pages** - Complete details with image gallery, amenities, and booking terminal
- **Booking Terminal** - Interactive date selection with automatic price calculation
- **WhatsApp Integration** - Direct booking via WhatsApp with pre-filled messages
- **Google Reviews** - Verified review showcase for trust building
- **Destination Content** - SEO-optimized pages about Nanyuki and Mount Kenya

### Admin Panel (Coming Next)
- Villa Management (CRUD operations)
- Pricing Governance (admin-only price control)
- Offers & Promotions Engine
- Booking Requests Dashboard
- Content Management System
- Reviews Management

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for database)

### Installation

1. **Clone the repository** (if not already in the folder):
```bash
cd /Users/lifestylevillas/Mains/LifestyleVillas/lifestyle-villas
```

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env.local` file in the root directory with the following variables:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
WHATSAPP_PHONE_NUMBER=254XXXXXXXXX
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_google_maps_api_key_here
```

4. **Set up Supabase database**:
- Go to your Supabase project
- Navigate to the SQL Editor
- Run the `supabase-schema.sql` file to create all tables and RLS policies

5. **Run the development server**:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.

## 📁 Project Structure

```
lifestyle-villas/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout with Header/Footer
│   ├── page.tsx                 # Homepage
│   ├── villas/                  # Villas section
│   │   ├── page.tsx            # Villas listing
│   │   └── [slug]/page.tsx     # Individual villa page
│   └── globals.css              # Global styles & design system
├── components/                   # Reusable components
│   ├── Header.tsx               # Navigation header
│   ├── Footer.tsx               # Site footer
│   ├── booking/                 # Booking-related components
│   │   └── BookingTerminal.tsx  # Main booking interface
│   └── ui/                      # UI components
│       └── Button.tsx           # Reusable button component
├── lib/                         # Utilities and configuration
│   └── supabase/
│       └── client.ts            # Supabase client setup
├── public/                      # Static assets
│   └── images/                  # Image assets
├── supabase-schema.sql          # Database schema
└── ENV_SETUP.md                 # Environment setup guide
```

## 🎨 Design System

The platform uses a premium **Safari Earth Tone** palette:

- **Safari Sand**: `#8B7355` - Warm, grounding
- **Safari Olive**: `#556B2F` - Natural, calming
- **Safari Stone**: `#A0826D` - Earthy, refined
- **Safari Earth**: `#D2B48C` - Light, welcoming
- **Safari Night**: `#2C2416` - Deep, sophisticated

**Typography**:
- Headings: Playfair Display (serif)
- Body: Inter (sans-serif)

## 🔐 Database Schema

The platform uses the following core tables:
- `villas` - Core villa inventory with admin-controlled pricing
- `offers` - Promotional offers and discounts
- `villa_offers` - Junction table for villa-offer relationships
- `booking_requests` - Guest booking intent tracking
- `reviews` - Synced Google Maps reviews
- `site_content` - CMS for homepage and destination content

See `supabase-schema.sql` for the complete schema.

## 📱 WhatsApp Integration

The booking terminal generates pre-filled WhatsApp messages containing:
- Villa details (house number, name)
- Check-in and check-out dates
- Number of guests
- Number of nights
- Total calculated price
- Applied offers (if any)
- Unique booking reference ID

Example message:
```
Hi! I'd like to book Villa 01 at Lifestyle Villas Nanyuki.

📅 Check-in: 15 January, 2025
📅 Check-out: 18 January, 2025
🏠 Guests: 4
🌙 Nights: 3
💰 Total: KES 45,000

Booking Reference: LV-20250115-X7Y9

Looking forward to hearing from you!
```

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS (inline configuration)
- **Animations**: Framer Motion
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Date Picker**: react-datepicker
- **State Management**: React hooks + Zustand
- **Deployment**: Vercel (recommended)

## ✅ Next Steps

### Immediate (Phase 1 Completion)
1. Add actual villa images to replace placeholders
2. Connect to Supabase database
3. Build admin panel for villa management
4. Implement offers engine
5. Set up WhatsApp business number

### Growth (Phase 2)
6. Create destination content pages (About Nanyuki, Mount Kenya, Experiences)
7. Integrate Google Maps reviews API
8. Add SEO structured data
9. Implement site search functionality

### Intelligence (Phase 3)
10. Build analytics dashboard
11. Add availability calendar
12. Implement advanced admin insights

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect Vercel to your repository
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Build for production
npm run build

# Test production build locally
npm start
```

## 📖 Documentation

- [Implementation Plan](/.gemini/antigravity/brain/.../implementation_plan.md)
- [Task Checklist](/.gemini/antigravity/brain/.../task.md)
- [Environment Setup](ENV_SETUP.md)
- [Database Schema](supabase-schema.sql)

## 🤝 Support

For issues or questions, contact the development team or open an issue in the repository.

## 📄 License

Proprietary - Lifestyle Villas Nanyuki

---

**Built with ❤️ for Lifestyle Villas Nanyuki**
