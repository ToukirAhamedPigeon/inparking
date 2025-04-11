// next.config.ts
import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  // Your existing Next.js config
  reactStrictMode: true,
  swcMinify: true,
}

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    fallbacks: {
      document: '/_offline', // Fallback page when offline
      // image: '/static/images/fallback.png', // Optional image fallback
      // font: '/static/fonts/fallback.woff2', // Optional font fallback
    },
    // For custom service worker (optional):
    // sw: 'sw.js',
    // runtimeCaching: require('next-pwa/cache')
  }
})