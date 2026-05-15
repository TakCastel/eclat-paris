import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
    // En dev, on désactive l'optimisation pour éviter le proxy par image
    unoptimized: process.env.NODE_ENV === 'development',
  },
}

export default nextConfig
