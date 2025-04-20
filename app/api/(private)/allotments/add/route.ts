import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { EActionType} from '@/types'
import { logAction } from '@/lib/logger'
import jwt from 'jsonwebtoken'
import { getCreatedAtId } from '@/lib/formatDate'
import { omitFields } from '@/lib/helpers'
import Allotment from '@/models/Allotment'
import { getAuthUserIdFromCookie } from '@/lib/getAuthUser'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
        try { 
          await dbConnect()
          const authUserId = await getAuthUserIdFromCookie()
      
          const formData = await req.formData()
          const guestName = formData.get('guestName') as string
          const guestContactNo = formData.get('guestContactNo') as string
          const guestDetail = formData.get('guestDetail') as string
          const driverName = formData.get('driverName') as string
          const driverContactNo = formData.get('driverContactNo') as string
          const isOwnerDriver = formData.get('isOwnerDriver') === 'true'
          const allotmentFrom = formData.get('allotmentFrom') as string
          const allotmentFromNum = getCreatedAtId(new Date(allotmentFrom)) as number
          const allotmentTo = formData.get('allotmentTo') as string
          const allotmentToNum = getCreatedAtId(new Date(allotmentTo)) as number
          const slotId = formData.get('slotId') as string
          const zoneId = formData.get('zoneId') as string
          const qrString = slotId+zoneId+allotmentFrom+allotmentTo
          const dateTimeFormatId = getCreatedAtId(new Date(formData.get('dateTimeFormatId') as string)) as number
          const createdBy = authUserId
          const updatedBy = authUserId

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
            allotmentFromNum,
            allotmentFrom,
            allotmentToNum,
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
          console.error('Add Allotment Error:', error)
          return NextResponse.json({ success: false, message: 'Add Allotment failed' }, { status: 500 })
        }
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
    }
}
