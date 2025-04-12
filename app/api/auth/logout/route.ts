// /app/api/auth/logout/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST() {
  const cookieStore = await cookies()
  cookieStore.set('inparking_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  })

  return NextResponse.json({ message: 'Logged out' })
}
