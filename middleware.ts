// middleware.ts
import { authMiddleware } from './middlewares/authMiddleware'
import { NextRequest } from 'next/server'
export function middleware(request: NextRequest) {
  return authMiddleware(request)
}

// You can customize the matcher to limit where middleware runs
export const config = {
  matcher: [
    '/admin/:path*',
    '/signin'
  ],
}
