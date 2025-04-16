import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Image from '@/models/Image'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    const authHeader = request.headers.get('authorization')
    const token = authHeader?.split(' ')[1]
  
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
        const id = (await params).id
        await dbConnect()

        if (!Types.ObjectId.isValid(id)) {
          return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
        }

        try {
            const user = await User.findById(id).populate('profilePicture').lean()

            if (!user) {
              return NextResponse.json({ error: 'User not found' }, { status: 404 })
            }

            const formattedUser = {
              ...user,
              profilePictureUrl: Array.isArray(user) ? user[0]?.profilePicture?.imageUrl || '/assets/policeman.png' : user.profilePicture?.imageUrl || '/assets/policeman.png',
            }

            return NextResponse.json(formattedUser)
          } catch (err) {
            console.error('Error fetching user detail:', err)
            return NextResponse.json({ error: 'Server error' }, { status: 500 })
          }
        } catch (err) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
        }
}
