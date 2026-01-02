-- ==========================================
-- Storage Policies for 'villas' bucket
-- Run this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the bucket (idempotent-ish, usually done via UI, but trying insert just in case)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('villas', 'villas', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on objects (usually enabled by default)
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policy: Allow Public Read Access
-- This allows anyone to view the images
DROP POLICY IF EXISTS "Public Read Access" ON storage.objects;
CREATE POLICY "Public Read Access"
  ON storage.objects FOR SELECT
  USING ( bucket_id = 'villas' );

-- 4. Policy: Allow Authenticated Uploads
-- This allows logged-in admins to upload images
DROP POLICY IF EXISTS "Authenticated Upload" ON storage.objects;
CREATE POLICY "Authenticated Upload"
  ON storage.objects FOR INSERT
  WITH CHECK ( bucket_id = 'villas' AND auth.role() = 'authenticated' );

-- 5. Policy: Allow Authenticated Updates/Deletes
DROP POLICY IF EXISTS "Authenticated Update" ON storage.objects;
CREATE POLICY "Authenticated Update"
  ON storage.objects FOR UPDATE
  USING ( bucket_id = 'villas' AND auth.role() = 'authenticated' );

DROP POLICY IF EXISTS "Authenticated Delete" ON storage.objects;
CREATE POLICY "Authenticated Delete"
  ON storage.objects FOR DELETE
  USING ( bucket_id = 'villas' AND auth.role() = 'authenticated' );
