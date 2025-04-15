import dbConnect from '@/lib/dbConnect' // your DB connection logic
import User from '@/models/User'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  try {
    await dbConnect()

    const existingUser = await User.findOne({ email })
    return NextResponse.json({ exists: !!existingUser })
  } catch (error) {
    console.error('Email check error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
