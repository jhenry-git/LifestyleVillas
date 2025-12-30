# Supabase Setup Guide

## Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Enter project details:
   - **Name**: lifestyle-villas-nanyuki
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to Kenya (eu-central-1 or ap-south-1)
5. Wait for project to be created

## Get API Keys

1. In Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL**: `https://your-project.supabase.co`
   - **anon/public key**: `eyJ...` (starts with eyJ)
   - **service_role key**: `eyJ...` (keep this SECRET)

3. Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...your-anon-key...
SUPABASE_SERVICE_KEY=eyJ...your-service-key...
```

## Create Database Schema

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New Query"
3. Paste the following SQL and run it:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create villas table
CREATE TABLE villas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  bedrooms INT NOT NULL,
  bathrooms INT NOT NULL,
  max_guests INT NOT NULL,
  price_per_night DECIMAL(10,2) NOT NULL,
  amenities JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  images JSONB DEFAULT '[]'::jsonb,
  featured_image VARCHAR(500),
  location VARCHAR(255) DEFAULT 'Nanyuki, Kenya',
  minimum_stay INT DEFAULT 1,
  status VARCHAR(50) DEFAULT 'draft',
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  villa_id UUID REFERENCES villas(id) ON DELETE CASCADE,
  guest_name VARCHAR(255) NOT NULL,
  guest_email VARCHAR(255) NOT NULL,
  guest_phone VARCHAR(50),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  number_of_guests INT NOT NULL,
  number_of_nights INT GENERATED ALWAYS AS (check_out - check_in) STORED,
  base_price DECIMAL(10,2) NOT NULL,
  total_price DECIMAL(10,2) NOT NULL,
  payment_status VARCHAR(50) DEFAULT 'pending',
  paid_amount DECIMAL(10,2) DEFAULT 0,
  status VARCHAR(50) DEFAULT 'inquiry',
  special_requests TEXT,
  internal_notes TEXT,
  source VARCHAR(50) DEFAULT 'website',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create admin_users table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'editor',
  active BOOLEAN DEFAULT true,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_villas_slug ON villas(slug);
CREATE INDEX idx_villas_status ON villas(status);
CREATE INDEX idx_villas_featured ON villas(featured);
CREATE INDEX idx_bookings_villa_id ON bookings(villa_id);
CREATE INDEX idx_bookings_check_in ON bookings(check_in);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_admin_users_email ON admin_users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_villas_updated_at BEFORE UPDATE ON villas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@lifestylevillas.co.ke',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWUI88K3PSi',
  'Admin User',
  'admin'
);

-- Insert sample villas
INSERT INTO villas (name, slug, description, long_description, bedrooms, bathrooms, max_guests, price_per_night, amenities, highlights, status, featured) VALUES
('Villa 01 - Safari Vista', 'villa-01-safari-vista', 
 'Luxurious 3-bedroom villa with stunning views of Mount Kenya',
 'Experience the epitome of luxury at Villa 01, nestled at the foothills of Mount Kenya. This spacious 3-bedroom villa combines modern comfort with authentic African charm, offering breathtaking panoramic views of Africa''s second-highest peak.',
 3, 2, 6, 15000,
 '["WiFi", "Full Kitchen", "Swimming Pool", "Garden", "Mountain View", "BBQ Area", "Fire Pit", "Parking"]'::jsonb,
 '["Panoramic Mount Kenya Views", "Private Pool", "Spacious Garden", "Modern Kitchen"]'::jsonb,
 'published', true),

('Villa 02 - Mount Kenya View', 'villa-02-mount-kenya-view',
 'Spacious 4-bedroom retreat perfect for families',
 'Villa 02 offers the perfect blend of space and serenity. With four beautifully appointed bedrooms, this villa is ideal for larger families or groups seeking a memorable Kenyan getaway.',
 4, 3, 8, 180 00,
 '["WiFi", "Full Kitchen", "Swimming Pool", "Garden", "Mountain View", "BBQ Area", "Game Room", "Parking", "Air Conditioning"]'::jsonb,
 '["Large Family Villa", "Private Pool", "Game Room", "Outdoor Dining"]'::jsonb,
 'published', false),

('Villa 03 - Equator Retreat', 'villa-03-equator-retreat',
 'Premium 5-bedroom estate with resort-style amenities',
 'Our crown jewel, Villa 03, delivers an unparalleled luxury experience. This expansive 5-bedroom estate features resort-style amenities, making it perfect for special celebrations or executive retreats.',
 5, 4, 10, 21000,
 '["WiFi", "Full Kitchen", "Swimming Pool", "Garden", "Mountain View", "BBQ Area", "Fire Pit", "Parking", "Air Conditioning", "Home Theater", "Spa Bath"]'::jsonb,
 '["Premium Estate", "Resort Amenities", "Home Theater", "Spa Facilities"]'::jsonb,
 'draft', false);
```

## Enable Row Level Security (RLS)

For security, enable RLS on tables:

```sql
-- Enable RLS
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to published villas
CREATE POLICY "Public villas are viewable by everyone" ON villas
  FOR SELECT USING (status = 'published');

-- Create policies for authenticated admin access
CREATE POLICY "Admins can view all villas" ON villas
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can view all bookings" ON bookings
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Admins can view all admin_users" ON admin_users
  FOR ALL USING (auth.role() = 'authenticated');
```

## Verify Setup

Run this query to verify data:

```sql
SELECT * FROM villas;
SELECT * FROM admin_users;
```

You should see 3 villas and 1 admin user.

## Next Steps

1. Update `.env.local` with your Supabase credentials
2. Restart the dev server: `npm run dev`
3. Test database connection in admin panel
