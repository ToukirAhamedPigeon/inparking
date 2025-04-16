// app/api/users/route.ts
import { NextRequest } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'

export async function GET(req: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''
  const page = parseInt(searchParams.get('page') || '1', 10)
  const limit = parseInt(searchParams.get('limit') || '10', 10)
  const skip = (page - 1) * limit

  const searchQuery = q
    ? {
        $or: [
          { name: { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
          { decryptedPassword: { $regex: q, $options: 'i' } },
        ],
      }
    : {}

  try {
    const [users, totalCount] = await Promise.all([
      User.find(searchQuery)
        .populate('profilePicture')
        .sort({ _id: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments(searchQuery),
    ])

    const formatted = users.map(user => ({
      ...user,
      profilePictureUrl: user.profilePicture?.imageUrl || '/assets/policeman.png',
    }))

    return Response.json({ users: formatted, totalCount })
  } catch (err) {
    console.error(err)
    return Response.json({ error: 'Server Error' }, { status: 500 })
  }
}
