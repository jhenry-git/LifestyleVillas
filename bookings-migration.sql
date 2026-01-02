-- Migration script to update existing bookings table to match admin interface
-- This adds missing columns and updates the structure

-- Add booking_reference column if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='bookings' AND column_name='booking_reference') THEN
        ALTER TABLE bookings ADD COLUMN booking_reference TEXT UNIQUE;
        
        -- Generate references for existing bookings
        UPDATE bookings SET booking_reference = 'BK-' || UPPER(SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 8))
        WHERE booking_reference IS NULL;
        
        -- Make it NOT NULL after populating
        ALTER TABLE bookings ALTER COLUMN booking_reference SET NOT NULL;
    END IF;
END $$;

-- Rename number_of_guests to guests for consistency
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='bookings' AND column_name='number_of_guests') THEN
        ALTER TABLE bookings RENAME COLUMN number_of_guests TO guests;
    END IF;
END $$;

-- Rename number_of_nights to nights for consistency
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns 
               WHERE table_name='bookings' AND column_name='number_of_nights') THEN
        -- Drop the generated column first
        ALTER TABLE bookings DROP COLUMN number_of_nights;
        -- Add as regular integer column
        ALTER TABLE bookings ADD COLUMN nights INTEGER;
        -- Calculate nights for existing records
        UPDATE bookings SET nights = (check_out - check_in);
        -- Make it NOT NULL
        ALTER TABLE bookings ALTER COLUMN nights SET NOT NULL;
    END IF;
END $$;

-- Update status values if needed (inquiry -> pending)
UPDATE bookings SET status = 'pending' WHERE status = 'inquiry';

-- Update status constraint to match new values
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check 
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed'));

-- Create indexes if they don't exist
CREATE INDEX IF NOT EXISTS idx_bookings_villa_id ON bookings(villa_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_check_in ON bookings(check_in);
CREATE INDEX IF NOT EXISTS idx_bookings_reference ON bookings(booking_reference);

-- Ensure updated_at trigger exists
CREATE OR REPLACE FUNCTION update_bookings_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS bookings_updated_at ON bookings;
CREATE TRIGGER bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_bookings_updated_at();

-- Enable RLS if not already enabled
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies to ensure they're correct
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON bookings;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON bookings;
DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON bookings;

CREATE POLICY "Enable read access for all users" ON bookings
    FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON bookings
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update for authenticated users only" ON bookings
    FOR UPDATE USING (true);

CREATE POLICY "Enable delete for authenticated users only" ON bookings
    FOR DELETE USING (true);

-- Verification query
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'bookings'
ORDER BY ordinal_position;
