/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wwiknqflvlipeqilinwi.supabase.co',
      },
    ],
  },
};

export default nextConfig;
