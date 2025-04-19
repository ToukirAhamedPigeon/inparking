import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Image from '@/models/Image'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import Zone from '@/models/Zone'
import Route from '@/models/Route'
import Slot from '@/models/Slot'
import Allotment from '@/models/Allotment'
import Log from '@/models/Log'
import fs from 'fs'
import path from 'path'
import { logAction } from '@/lib/logger'
import { EActionType, EModelType, EUserRole } from '@/types'
import bcrypt from 'bcryptjs'
import { deleteImage, uploadAndResizeImage } from '@/lib/imageUploder'
import { getCreatedAtId } from '@/lib/formatDate'
import { omitFields } from '@/lib/helpers'


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
            const allotment = await Allotment.findById(id).lean()

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

    const isImageDeleted = formData.get('isImageDeleted') === 'true'
    const file = formData.get('profilePicture') as File | null
    const password = formData.get('password') as string
    const hashedPassword = await bcrypt.hash(password, 10)


    await dbConnect()

    const allotment = await Allotment.findById(allotmentId)

    const updates: any = {
      guestName: formData.get('guestName'),
      guestContactNo: formData.get('guestContactNo'),
      guestDetail: formData.get('guestDetail'),
      driverName: formData.get('driverName'),
      driverContactNo: formData.get('driverContactNo'),
      isOwnerDriver: formData.get('isOwnerDriver'),
      allotmentFrom: formData.get('allotmentFrom'),
      allotmentTo: formData.get('allotmentTo'),
      qrString: formData.get('qrString'),
      dateTimeFormatId: formData.get('dateTimeFormatId'),
      createdAtId: getCreatedAtId(allotment.createdAt),
      isActive: formData.get('isActive') === 'true'
      
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
