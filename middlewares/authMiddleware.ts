import { jwtVerify } from 'jose'
import { NextRequest, NextResponse } from 'next/server'
import { EUserRole } from '@/types'

const JWT_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET!) // Use ACCESS_SECRET here

export async function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('inparking_access_token')?.value
  const pathname = request.nextUrl.pathname

  const isAuthPage = pathname.startsWith('/signin')
  const isAdminPage = pathname.startsWith('/admin')

  if (token) {
    try {
      const { payload } = await jwtVerify(token, JWT_SECRET)

      // Role check for admin pages
      const allowedRoles: EUserRole[] = [EUserRole.ADMIN, EUserRole.DEVELOPER]
      if (isAdminPage && !allowedRoles.includes(payload.role as EUserRole)) {
        return NextResponse.redirect(new URL('/unauthorized', request.url))
      }

      // Prevent logged-in users from visiting sign-in
      if (isAuthPage) {
        return NextResponse.redirect(new URL('/admin/dashboard', request.url))
      }

    } catch (err) {
      console.error('JWT verification error:', err)
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  return NextResponse.next()
}
