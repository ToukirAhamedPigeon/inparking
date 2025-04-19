import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Slot from '@/models/Slot'
import Image from '@/models/Image'
import { uploadAndResizeImage } from '@/lib/imageUploder'
import { EActionType, EModelType } from '@/types'
import { logAction } from '@/lib/logger'
import jwt from 'jsonwebtoken'
import { getAuthUserIdFromCookie } from '@/lib/getAuthUser'

export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
    const authUserId = await getAuthUserIdFromCookie()

    await dbConnect()

    const formData = await req.formData()

    const slotNumber = formData.get('slotNumber') as string
    const slotDetail = formData.get('slotDetail') as string
    const zoneId = formData.get('zoneId') as string
    const qrString = (formData.get('zoneId') as string) + '-' + (formData.get('slotNumber') as string)
    const isActive = formData.get('isActive') === 'true'
    const createdBy = authUserId
    const updatedBy = authUserId

    const newSlot = await Slot.create({
      slotNumber, 
      slotDetail,
      isActive,
      zoneId,
      qrString,
      createdBy,
      updatedBy,
    })

    const imageDocs = []

    // Process zone images
    for (const [key, value] of formData.entries()) {
      if (key.startsWith('images[') && !key.includes('.')) {
        const index = key.match(/\d+/)?.[0] ?? ''
        const file = value as File

        if (file && file.size > 0 && file.type.startsWith('image/')) {
          const imageTitle = formData.get(`images[${index}].title`) as string || ''
          const imageDetail = formData.get(`images[${index}].description`) as string || ''

          const { imageDoc }: { imageDoc: typeof Image.prototype } = await uploadAndResizeImage({
            file,
            modelFolder: 'slots',
            modelType: EModelType.SLOT,
            modelId: newSlot._id,
            imageTitle,
            imageDetail,
          })
          imageDocs.push(imageDoc)
        }
      }
    }

    // Log zone creation
    await logAction({
      detail: `Slot created: ${newSlot.slotNumber}`,
      changes: JSON.stringify({
        after: {
          ...newSlot.toObject(),
          images: imageDocs.map((img) => ({
            _id: img._id,
            title: img.title,
            description: img.description,
            url: img.url,
          })),
        }
      }),
      actionType: EActionType.CREATE,
      collectionName: 'Slot',
      objectId: newSlot._id.toString(),
    })

    return NextResponse.json({ success: true, slot: newSlot, images: imageDocs }, { status: 201 })

  } catch (error: any) {
    console.error('[SLOT_ADD_ERROR]', error)
    return NextResponse.json({ success: false, message: 'Failed to create slot', error: error.message }, { status: 500 })
  }
}
