// app/api/zones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Slot from '@/models/Slot'
import Image from '@/models/Image'
import jwt from 'jsonwebtoken'
import { EModelType, IImage, ISlot, SlotWithImages } from '@/types'

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
            { slotNumber: { $regex: q, $options: 'i' } },
            { slotDetail: { $regex: q, $options: 'i' } },
            { qrString: { $regex: q, $options: 'i' } },
            { createdBy: { $regex: q, $options: 'i' } },
            { updatedBy: { $regex: q, $options: 'i' } },
          ],
        }
      : {}

      const [slots, totalCount] = await Promise.all([
        Slot.find(searchQuery)
          .populate('createdBy')
          .populate('updatedBy')
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean<ISlot[]>()
          .then(async (slotList) => {
            const slotIds = slotList.map((slot) => slot._id.toString());
      
            const images = await Image.find({
              modelType: EModelType.SLOT,
              modelId: { $in: slotIds },
            }).lean<IImage[]>();
      
            const imageMap = new Map<string, IImage[]>();
            for (const image of images) {
              const key = image.modelId.toString();
              if (!imageMap.has(key)) {
                imageMap.set(key, []);
              }
              imageMap.get(key)!.push(image);
            }
      
            const slotsWithImages: SlotWithImages[] = slotList.map((slot) => ({
              ...slot,
              images: imageMap.get(slot._id.toString()) || [],
            }));
      
            return slotsWithImages;
          }),
      
        Slot.countDocuments(searchQuery),
      ]);

    const formatted = slots.map(slot => ({
      ...slot,
      images: slot.images.map(image => ({
        ...image,
        imageUrl: image.imageUrl.replace('public/', ''),
      })),
    }))
    return NextResponse.json({ slots: formatted, totalCount })

  } catch (err) {
    console.error('Auth or DB error:', err)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 403 })
  }
}
