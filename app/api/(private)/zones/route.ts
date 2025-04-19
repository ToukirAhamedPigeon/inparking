// app/api/zones/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Zone from '@/models/Zone'
import Image from '@/models/Image'
import jwt from 'jsonwebtoken'
import { EModelType, IImage, IZone, ZoneWithImages } from '@/types'

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
            { name: { $regex: q, $options: 'i' } },
            { address: { $regex: q, $options: 'i' } },
            { contactName: { $regex: q, $options: 'i' } },
            { contactNo: { $regex: q, $options: 'i' } },
            { latitude: { $regex: q, $options: 'i' } },
            { longitude: { $regex: q, $options: 'i' } },
            { 'createdBy.name': { $regex: q, $options: 'i' } },
            { 'updatedBy.name': { $regex: q, $options: 'i' } },
          ],
        }
      : {}

      const [zones, totalCount] = await Promise.all([
        Zone.find(searchQuery)
          .populate('createdBy')
          .populate('updatedBy')
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean<IZone[]>()
          .then(async (zoneList) => {
            const zoneIds = zoneList.map((zone) => zone._id.toString());
      
            const images = await Image.find({
              modelType: EModelType.ZONE,
              modelId: { $in: zoneIds },
            }).lean<IImage[]>();
      
            const imageMap = new Map<string, IImage[]>();
            for (const image of images) {
              const key = image.modelId.toString();
              if (!imageMap.has(key)) {
                imageMap.set(key, []);
              }
              imageMap.get(key)!.push(image);
            }
      
            const zonesWithImages: ZoneWithImages[] = zoneList.map((zone) => ({
              ...zone,
              images: imageMap.get(zone._id.toString()) || [],
            }));
      
            return zonesWithImages;
          }),
      
        Zone.countDocuments(searchQuery),
      ]);

    const formatted = zones.map(zone => ({
      ...zone,
      images: zone.images.map(image => ({
        ...image,
        imageUrl: image.imageUrl.replace('public/', ''),
      })),
    }))
    return NextResponse.json({ zones: formatted, totalCount })

  } catch (err) {
    console.error('Auth or DB error:', err)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 403 })
  }
}
