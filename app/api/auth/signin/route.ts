import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

import User from '@/models/User'
import dbConnect from '@/lib/dbConnect'
import { comparePassword } from '@/lib/hash'
import { signInSchema } from '@/lib/validations'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'
const COOKIE_NAME = 'inparking_token'

export async function POST(req: Request) {
  try {
    await dbConnect()

    const body = await req.json()
    const parsed = signInSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ message: 'Invalid input', errors: parsed.error.format() }, { status: 400 })
    }

    const { email, password } = parsed.data
    const user = await User.findOne({ email })

    if (!user || !user.isActive) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    const passwordMatch = await comparePassword(password, user.password)

    if (!passwordMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 401 })
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    // Save to cookies
    const cookieStore = await cookies()
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60, // 7 days
    })

    return NextResponse.json({
      message: 'Signed in successfully',
      user: { id: user._id, name: user.name, role: user.role }
    })

  } catch (error) {
    console.error(error)
    return NextResponse.json({ message: 'Something went wrong' }, { status: 500 })
  }
}
