import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
