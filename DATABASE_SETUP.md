# Supabase Database Setup - Quick Start

## ✅ Environment Variables Configured

Your `.env.local` now has the correct Supabase credentials:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_KEY`

## 📝 Next Step: Create Database Tables

1. **Open Supabase Dashboard**
   - Go to: https://wwiknqflvlipeqilinwi.supabase.co
   - Navigate to **SQL Editor** (left sidebar)

2. **Run the Schema**
   - Click "**New Query**"
   - Copy the entire contents of `supabase-schema.sql`
   - Paste into the SQL Editor
   - Click "**Run**" (or press Cmd/Ctrl + Enter)

3. **Verify Setup**
   After running the SQL, you should see:
   - ✅ 3 tables created: `villas`, `bookings`, `admin_users`
   - ✅ 3 sample villas inserted
   - ✅ 1 admin user created
   - ✅ Indexes and triggers created

## 🎯 What the Schema Creates

### Tables:
- **villas**: Stores all villa information (name, price, amenities, images, etc.)
- **bookings**: Manages all reservations and inquiries
- **admin_users**: Stores admin login credentials

### Sample Data:
- 🏠 Villa 01 - Safari Vista (3 bed, Published, Featured)
- 🏠 Villa 02 - Mount Kenya View (4 bed, Published)
- 🏠 Villa 03 - Equator Retreat (5 bed, Draft)

### Admin User:
- Email: `admin@lifestylevillas.co.ke`
- Password: `admin123`

## 🧪 Test the Connection

After running the SQL, test the admin panel:

1. Go to http://localhost:3000/admin/login
2. Login with the credentials above
3. Navigate to "Villas" - you should see the 3 sample villas!

## 🔒 Optional: Enable Row Level Security

For production security, run this in SQL Editor:

```sql
-- Enable RLS
ALTER TABLE villas ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published villas
CREATE POLICY "Public villas viewable" ON villas
  FOR SELECT USING (status = 'published');

-- Allow authenticated access for admin operations
CREATE POLICY "Admins full access villas" ON villas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins full access bookings" ON bookings
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Admins full access users" ON admin_users
  FOR ALL USING (auth.role() = 'service_role');
```

## 📦 Storage Setup (For Images)

To enable image uploads:

1. In Supabase Dashboard, go to **Storage**
2. Click "**Create bucket**"
3. Name: `villa-images`
4. Public bucket: **Yes** ✅
5. Click "Create bucket"

6. Add this policy for public access:
   - Go to bucket policies
   - Add policy: **Allow public access to files**

Your admin panel will now be able to upload villa images to Supabase Storage!

## 🚀 You're Ready!

Once the SQL runs successfully, your admin panel is fully functional with:
- ✅ Real database connection
- ✅ Villa CRUD operations  
- ✅ Sample data to test with
- ✅ Ready for image uploads (after storage setup)

Visit http://localhost:3000/admin to start managing your villas!
