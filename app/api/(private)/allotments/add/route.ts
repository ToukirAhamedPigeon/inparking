import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { EActionType, EModelType, EUserRole } from '@/types'
import { logAction } from '@/lib/logger'
import { uploadAndResizeImage } from '@/lib/imageUploder'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getCreatedAtId } from '@/lib/formatDate'
import { omitFields } from '@/lib/helpers'
import Allotment from '@/models/Allotment'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
        try { 
          await dbConnect()
      
          const formData = await req.formData()
          const guestName = formData.get('guestName') as string
          const guestContactNo = formData.get('guestContactNo') as string
          const guestDetail = formData.get('guestDetail') as string
          const driverName = formData.get('driverName') as string
          const driverContactNo = formData.get('driverContactNo') as string
          const isOwnerDriver = formData.get('isOwnerDriver') === 'true'
          const allotmentFrom = formData.get('allotmentFrom') as string
          const allotmentTo = formData.get('allotmentTo') as string
          const qrString = formData.get('qrString') as string
          const dateTimeFormatId = formData.get('dateTimeFormatId') as string
          const slotId = formData.get('slotId') as string
          const zoneId = formData.get('zoneId') as string
          const createdBy = formData.get('createdBy') as string
          const updatedBy = formData.get('updatedBy') as string

          // Check email duplication
          const allotmentExists = await Allotment.findOne({ qrString })
          if (allotmentExists) {
            return NextResponse.json({ success: false, message: 'Allotment already exists' }, { status: 400 })
          }
      
          // Encrypt password
          const allotment = await Allotment.create({
            guestName,
            guestContactNo,
            guestDetail,
            driverName,
            driverContactNo,
            isOwnerDriver,
            allotmentFrom,
            allotmentTo,
            qrString,
            dateTimeFormatId,
            slotId,
            zoneId,
            createdBy,
            updatedBy,
          })
          await Allotment.findByIdAndUpdate(allotment._id, { dateTimeFormatId: getCreatedAtId(allotment.createdAt) }, { new: true, strict: false })
          // Log action
          await logAction({
            detail: `Allotment created: ${allotment.guestName}`,
            changes: JSON.stringify({ after: omitFields(allotment.toObject?.() || allotment, ['createdAtId','__v']) }),
            actionType: EActionType.CREATE,
            collectionName: 'Allotment',
            objectId: allotment._id.toString()
          })
      
          return NextResponse.json({ success: true, allotment }, { status: 201 })
        } catch (error) {
          console.error('Register Error:', error)
          return NextResponse.json({ success: false, message: 'Registration failed' }, { status: 500 })
        }
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }
}
