// app/api/(private)/auth/logout/route.ts
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'
import { NextResponse } from 'next/server'

const ACCESS_SECRET = new TextEncoder().encode(process.env.ACCESS_SECRET!) // ✅ use access secret

export async function POST() {
  const cookieStore = await cookies() // no need for await
  const token = cookieStore.get('inparking_token')?.value

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized: No token found' }, { status: 401 })
  }

  try {
    await jwtVerify(token, ACCESS_SECRET)

    // Clear token cookie
    cookieStore.set('inparking_token', '', { path: '/', maxAge: 0 })

    return NextResponse.json({ message: 'Logged out successfully' })
  } catch (err) {
    return NextResponse.json({ message: 'Unauthorized: Invalid token' }, { status: 401 })
  }
}
