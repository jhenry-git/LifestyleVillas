-- Test Supabase connection and create schema

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Check if villas table exists
SELECT COUNT(*) FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name = 'villas';

-- If the above returns 0, run the following to create tables:

-- Create villas table
CREATE TABLE IF NOT EXISTS villas (
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
CREATE TABLE IF NOT EXISTS bookings (
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
CREATE TABLE IF NOT EXISTS admin_users (
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_villas_slug ON villas(slug);
CREATE INDEX IF NOT EXISTS idx_villas_status ON villas(status);
CREATE INDEX IF NOT EXISTS idx_villas_featured ON villas(featured);
CREATE INDEX IF NOT EXISTS idx_bookings_villa_id ON bookings(villa_id);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_admin_users_email ON admin_users(email);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
DROP TRIGGER IF EXISTS update_villas_updated_at ON villas;
CREATE TRIGGER update_villas_updated_at BEFORE UPDATE ON villas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON admin_users;
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert admin user (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role)
VALUES (
  'admin@lifestylevillas.co.ke',
  '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyWUI88K3PSi',
  'Admin User',
  'admin'
)
ON CONFLICT (email) DO NOTHING;

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
 4, 3, 8, 18000,
 '["WiFi", "Full Kitchen", "Swimming Pool", "Garden", "Mountain View", "BBQ Area", "Game Room", "Parking", "Air Conditioning"]'::jsonb,
 '["Large Family Villa", "Private Pool", "Game Room", "Outdoor Dining"]'::jsonb,
 'published', false),

('Villa 03 - Equator Retreat', 'villa-03-equator-retreat',
 'Premium 5-bedroom estate with resort-style amenities',
 'Our crown jewel, Villa 03, delivers an unparalleled luxury experience. This expansive 5-bedroom estate features resort-style amenities, making it perfect for special celebrations or executive retreats.',
 5, 4, 10, 21000,
 '["WiFi", "Full Kitchen", "Swimming Pool", "Garden", "Mountain View", "BBQ Area", "Fire Pit", "Parking", "Air Conditioning", "Home Theater", "Spa Bath"]'::jsonb,
 '["Premium Estate", "Resort Amenities", "Home Theater", "Spa Facilities"]'::jsonb,
 'draft', false)
ON CONFLICT (slug) DO NOTHING;

-- Verify data
SELECT COUNT(*) as villa_count FROM villas;
SELECT COUNT(*) as admin_count FROM admin_users;
