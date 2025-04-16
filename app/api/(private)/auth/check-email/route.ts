import dbConnect from '@/lib/dbConnect' // your DB connection logic
import User from '@/models/User'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

export async function GET(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
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
  } catch (err) {
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }
}
