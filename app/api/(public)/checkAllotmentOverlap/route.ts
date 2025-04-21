import { NextRequest, NextResponse } from 'next/server'
import Allotment from '@/models/Allotment'
import dbConnect from '@/lib/dbConnect'
import Route from '@/models/Route';
import Zone from '@/models/Zone';
import Slot from '@/models/Slot';
import { startOfDay } from 'date-fns'
import { endOfDay } from 'date-fns'


export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const normalized_from = startOfDay(new Date(body.allotment_from))
    const normalized_to = endOfDay(new Date(body.allotment_to))
    const {
      slotId,
      exceptField = '_id', exceptValue,
    } = body
    await dbConnect()
    const query: any = { slotId,
        $or: [
        {
          allotmentFrom: { $lte: normalized_to },
          allotmentTo: { $gte: normalized_from },
        },
      ], }
      if (exceptField && exceptValue) {
        query[exceptField] = { $ne: exceptValue }
      }
      const conflict = await Allotment.findOne(query)
      return NextResponse.json({ success: true, overlap: !!conflict })
  } catch (error) {
    console.error('Error in checkAllotmentOverlap API:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}