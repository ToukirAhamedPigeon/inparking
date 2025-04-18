import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Log from '@/models/Log'
import User from '@/models/User'
import Image from '@/models/Image'
import Zone from '@/models/Zone'
import Route from '@/models/Route'
import Slot from '@/models/Slot'
import Allotment from '@/models/Allotment'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const authHeader = request.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
    const id = (await params).id
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

    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid log ID' }, { status: 400 })
    }

    const rawLog = await Log.findById(id)
      .populate('createdBy', 'name')
      .lean()

    if (!rawLog) {
      return NextResponse.json({ error: 'Log not found' }, { status: 404 })
    }

    const log = rawLog as unknown as {
      _id: string
      message: string
      collection?: string
      objectId?: string
      createdBy?: { name: string }
      [key: string]: any
    }

    // Try to resolve the related object’s name
    let relatedObjectName = 'N/A'
    if (
      log.collection &&
      log.objectId &&
      Types.ObjectId.isValid(log.objectId)
    ) {
      const model = modelMap[log.collection]
      if (model) {
        const relatedDoc = await model.findById(log.objectId).lean()
        if (relatedDoc) {
          relatedObjectName =
            relatedDoc.name ||
            relatedDoc.title ||
            relatedDoc.code ||
            String(relatedDoc._id)
        }
      }
    }

    const formattedLog = {
      ...log,
      createdByName: log.createdBy?.name || 'N/A',
      relatedObjectName,
    }

    return NextResponse.json(formattedLog)
  } catch (err) {
    console.error('Error fetching log detail:', err)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
