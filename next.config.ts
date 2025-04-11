// next.config.ts
import type { NextConfig } from 'next'
import withPWA from 'next-pwa'

const nextConfig: NextConfig = {
  reactStrictMode: true, // Keep this at the root level, not inside pwa config
  // Other Next.js config options...
}

export default withPWA({
  ...nextConfig,
  pwa: {
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    fallbacks: {
      document: '/_offline',
    },
    // Remove any unexpected properties from here
    // Keep only valid next-pwa options:
    // https://github.com/shadowwalker/next-pwa#available-options
  }
})