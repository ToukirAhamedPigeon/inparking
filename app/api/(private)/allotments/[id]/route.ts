import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import Allotment from '@/models/Allotment'
import { logAction } from '@/lib/logger'
import { EActionType } from '@/types'
import { omitFields } from '@/lib/helpers'
import { getAuthUserIdFromCookie } from '@/lib/getAuthUser'
import { getCreatedAtId } from '@/lib/formatDate'

export async function GET(req:NextRequest, { params }: {params: Promise<{ id: string }>}) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]
  
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
        await dbConnect()

          if (!Types.ObjectId.isValid(id)) {
          return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 })
        }

        try {
            const allotment = await Allotment.findById(id).populate('slotId').populate('zoneId').populate('createdBy').populate('updatedBy').lean()

            if (!allotment) {
              return NextResponse.json({ error: 'Allotment not found' }, { status: 404 })
            }

            const formattedAllotment = {
              ...allotment,
            }
            return NextResponse.json(formattedAllotment)
          } catch (err) {
            console.error('Error fetching allotment detail:', err)
            return NextResponse.json({ error: 'Server error' }, { status: 500 })
          }
        } catch (err) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
        }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    jwt.verify(token, process.env.ACCESS_SECRET!)
    const allotmentId = id
    const formData = await req.formData()
    await dbConnect()
    const authUserId = await getAuthUserIdFromCookie()

    const allotment = await Allotment.findById(allotmentId)
    const updates: any = {
      guestName: formData.get('guestName'),
      guestContactNo: formData.get('guestContactNo'),
      guestDetail: formData.get('guestDetail'),
      driverName: formData.get('driverName'),
      driverContactNo: formData.get('driverContactNo'),
      isOwnerDriver: formData.get('isOwnerDriver'),
      allotmentFrom: formData.get('allotmentFrom'),
      allotmentFromNum: getCreatedAtId(new Date(formData.get('allotmentFrom') as string)),
      allotmentTo: formData.get('allotmentTo'),
      allotmentToNum: getCreatedAtId(new Date(formData.get('allotmentTo') as string)),
      updatedBy: authUserId,
    }

    if (!allotment) return NextResponse.json({ error: 'Allotment not found' }, { status: 404 })

    const updatedAllotment = await Allotment.findByIdAndUpdate(allotmentId, updates, { new: true, strict: false })
    await logAction({
      detail: `Allotment updated: ${updatedAllotment.guestName}`,
      changes: JSON.stringify({ before: omitFields(allotment.toObject?.() || allotment, ['createdAtId','__v']), after: omitFields(updatedAllotment.toObject?.() || updatedAllotment, ['createdAtId','__v']) }),
      actionType: EActionType.UPDATE,
      collectionName: 'Allotment',
      objectId: allotmentId,
    })

    return NextResponse.json({ allotment: updatedAllotment })
  } catch (err) {
    console.error('Update error:', err)
    const status = err instanceof Error && err.name === 'JsonWebTokenError' ? 403 : 500
    return NextResponse.json({ error: 'Invalid or expired token' }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allotmentId = id
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.ACCESS_SECRET!)
    await dbConnect()

    const allotment = await Allotment.findById(allotmentId)
    if (!allotment) {
      return NextResponse.json({ error: 'Allotment not found' }, { status: 404 })
    }

    // Check for references in other collections
      await Allotment.findByIdAndDelete(allotmentId)
      await logAction({
        detail: `Allotment deleted: ${allotment.guestName}`,
        changes: JSON.stringify({ before: omitFields(allotment.toObject?.() || allotment, ['createdAtId','__v']) }),
        actionType: EActionType.DELETE,
        collectionName: 'Allotment',
        objectId: allotmentId,
      })
      return NextResponse.json({ status: 'deleted' })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
