// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import '@/models/Image'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') === 'desc' ? -1 : 1

    const searchQuery = q
      ? {
          $or: [
            { name: { $regex: q, $options: 'i' } },
            { email: { $regex: q, $options: 'i' } },
            { decryptedPassword: { $regex: q, $options: 'i' } },
          ],
        }
      : {}

    const [users, totalCount] = await Promise.all([
      User.find(searchQuery)
        .populate('profilePicture')
        .sort({ [sortBy]: sortOrder })  // 👈 dynamic sorting
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(searchQuery),
    ])

    const formatted = users.map(user => ({
      ...user,
      profilePictureUrl: user.profilePicture?.imageUrl || '/assets/policeman.png',
    }))
    return NextResponse.json({ users: formatted, totalCount })

  } catch (err) {
    console.error('Auth or DB error:', err)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 403 })
  }
}
