// app/api/auth/refresh/route.ts
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { signAccessToken, verifyRefreshToken } from '@/lib/jwt'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function POST() {
  const cookieStore = await cookies()
  const refreshToken = cookieStore.get('refresh_token')?.value

  if (!refreshToken) {
    return NextResponse.json({ message: 'No refresh token' }, { status: 401 })
  }

  try {
    const decoded: any = verifyRefreshToken(refreshToken)

    await dbConnect()
    const user = await User.findById(decoded.id)

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }

    const newAccessToken = signAccessToken({
      id: user._id,
      role: user.role,
      email: user.email,
    })

    const res = NextResponse.json({ token: newAccessToken }, { status: 200 })

    // Set new access token cookie
    res.cookies.set('inparking_token', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 15, // 15 minutes
    })

    return res
  } catch (err) {
    console.error('Refresh error:', err)
    return NextResponse.json({ message: 'Invalid refresh token' }, { status: 403 })
  }
}
