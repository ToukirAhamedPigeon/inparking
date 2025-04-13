import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    // For images in your `public` folder
    // (No configuration needed if they're in public/)
    
    // For external domains (including localhost)
    domains: ['localhost'],
    
    // Alternative: More granular control with remotePatterns
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/uploads/**',
      },
    ],
    
    // Optional: Disable optimization in development
    unoptimized: process.env.NODE_ENV === 'development',
  },

}

export default nextConfig