import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const secret = process.env.ACCESS_SECRET!

export function middleware(request: NextRequest) {
  const token = request.headers.get('authorization')?.replace('Bearer ', '')

  if (!token) {
    return NextResponse.json({ message: 'Missing token' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, secret)
    request.headers.set('user', JSON.stringify(decoded))
    return NextResponse.next()
  } catch (err) {
    return NextResponse.json({ message: 'Invalid or expired token' }, { status: 403 })
  }
}

export const config = {
  matcher: ['/api/(private)/(.*)'],
}
