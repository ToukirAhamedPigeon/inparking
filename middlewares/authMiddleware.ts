// middlewares/authMiddleware.ts
import { NextRequest, NextResponse } from 'next/server'

export function authMiddleware(request: NextRequest) {
  const token = request.cookies.get('inparking_token')?.value

  const isAuthPage = request.nextUrl.pathname.startsWith('/signin')
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin')

  if (isAdminPage && !token) {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}
