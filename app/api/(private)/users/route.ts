// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import '@/models/Image'
import jwt from 'jsonwebtoken'

export async function GET(req: NextRequest) {
  // Get token from the Authorization header
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)

    // Establish database connection
    await dbConnect()

    // Parse query parameters
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || ''
    const page = parseInt(searchParams.get('page') || '1', 10)
    const limit = parseInt(searchParams.get('limit') || '10', 10)
    const skip = (page - 1) * limit

    // Create search query if 'q' is provided
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
      // Fetch users from the database
      const [users, totalCount] = await Promise.all([
        User.find(searchQuery)
          .populate('profilePicture')
          .sort({ _id: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        User.countDocuments(searchQuery),
      ])

      // Format users with profile picture URL
      const formatted = users.map(user => ({
        ...user,
        profilePictureUrl: user.profilePicture?.imageUrl || '/assets/policeman.png',
      }))

      // Return response with users and total count
      return NextResponse.json({ users: formatted, totalCount })

    } catch (err) {
      console.error('Database Error:', err)
      return NextResponse.json({ error: 'Server Error' }, { status: 500 })
    }

  } catch (err) {
    console.error('Token Verification Error:', err)
    return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
  }
}
