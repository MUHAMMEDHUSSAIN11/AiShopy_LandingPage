import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    // Multi-tenant: merchant logos and product images can live on arbitrary
    // hosts (Supabase buckets, CDNs, etc.), so allow any https image source.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

export default nextConfig
