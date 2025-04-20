// app/api/users/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import jwt from 'jsonwebtoken'
import Allotment from '@/models/Allotment'
import '@/models/Slot'
import '@/models/Zone'
import { IAllotment } from '@/types'
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
            { guestName: { $regex: q, $options: 'i' } },
            { guestContactNo: { $regex: q, $options: 'i' } },
            { driverName: { $regex: q, $options: 'i' } },
            { driverContactNo: { $regex: q, $options: 'i' } },
            { qrString : { $regex: q, $options: 'i' } }, 
            { allotmentFrom: { $regex: q, $options: 'i' } },
            { allotmentTo: { $regex: q, $options: 'i' } }, 
            { 'createdBy.name': { $regex: q, $options: 'i' } },
            { 'updatedBy.name': { $regex: q, $options: 'i' } },
            { 'slotId.slotNumber': { $regex: q, $options: 'i' } },
            { 'zoneId.name': { $regex: q, $options: 'i' } },
          ],
        }
      : {}

    const [allotments, totalCount] = await Promise.all([
      Allotment.find(searchQuery)
          .populate('zoneId')
          .populate('slotId')
          .populate('createdBy')
          .populate('updatedBy')
          .sort({ [sortBy]: sortOrder })  // 👈 dynamic sorting
        .skip(skip)
        .limit(limit)
        .lean<IAllotment[]>(),
      Allotment.countDocuments(searchQuery),
    ])

    const formatted = allotments.map(allotment => ({
      ...allotment,
    }))
    return NextResponse.json({ allotments: formatted, totalCount })

  } catch (err) { 
    console.error('Auth or DB error:', err)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 403 })
  }
}
