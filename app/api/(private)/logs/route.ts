// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Log from '@/models/Log'
import User from '@/models/User'
import Image from '@/models/Image'
import Zone from '@/models/Zone'
import Route from '@/models/Route'
import Slot from '@/models/Slot'
import Allotment from '@/models/Allotment'
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

    const modelMap: Record<string, any> = {
        users: User,
        images: Image,
        zones: Zone,
        routes: Route,
        slots: Slot,
        allotments: Allotment,
        // add more collections here
      }

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
            { detail: { $regex: q, $options: 'i' } },
            { actionType: { $regex: q, $options: 'i' } },
            { collectionName: { $regex: q, $options: 'i' } },
            { objectId: { $regex: q, $options: 'i' } },
            { 'createdBy.name': { $regex: q, $options: 'i' } },
          ],
        }
      : {}

    const [logs, totalCount] = await Promise.all([
      Log.find(searchQuery)
        .sort({ [sortBy]: sortOrder }) 
        .skip(skip)
        .limit(limit)
        .populate('createdBy', 'name')
        .lean(),
      Log.countDocuments(searchQuery),
    ])

    return NextResponse.json({ logs, totalCount })

  } catch (err) {
    console.error('Auth or DB error:', err)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 403 })
  }
}
