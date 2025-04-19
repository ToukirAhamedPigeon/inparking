// app/api/routes/route.ts
import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Route from '@/models/Route'
import Image from '@/models/Image'
import jwt from 'jsonwebtoken'
import { EModelType, IImage, IRoute, RouteWithImages } from '@/types'

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
            { fromAddress: { $regex: q, $options: 'i' } },
            { toAddress: { $regex: q, $options: 'i' } },
            { description: { $regex: q, $options: 'i' } },
            { 'createdBy.name': { $regex: q, $options: 'i' } },
            { 'updatedBy.name': { $regex: q, $options: 'i' } },
            { 'toZoneId.name': { $regex: q, $options: 'i' } },
            { 'toZoneId.address': { $regex: q, $options: 'i' } },
          ],
        }
      : {}

      const [routes, totalCount] = await Promise.all([
        Route.find(searchQuery)
          .populate('createdBy')
          .populate('updatedBy')
          .populate('toZoneId')
          .sort({ [sortBy]: sortOrder })
          .skip(skip)
          .limit(limit)
          .lean<IRoute[]>()
          .then(async (routeList) => {
            const routeIds = routeList.map((route) => route._id.toString());
      
            const images = await Image.find({
              modelType: EModelType.ROUTE,
              modelId: { $in: routeIds },
            }).lean<IImage[]>();
      
            const imageMap = new Map<string, IImage[]>();
            for (const image of images) {
              const key = image.modelId.toString();
              if (!imageMap.has(key)) {
                imageMap.set(key, []);
              }
              imageMap.get(key)!.push(image);
            }
      
            const routesWithImages: RouteWithImages[] = routeList.map((route) => ({
              ...route,
              images: imageMap.get(route._id.toString()) || [],
            }));
      
            return routesWithImages;
          }),
      
        Route.countDocuments(searchQuery),
      ]);

    const formatted = routes.map(route => ({
      ...route,
      images: route.images.map(image => ({
        ...image,
        imageUrl: image.imageUrl.replace('public/', ''),
      })),
    }))
    return NextResponse.json({ routes: formatted, totalCount })

  } catch (err) {
    console.error('Auth or DB error:', err)
    return NextResponse.json({ error: 'Invalid token or server error' }, { status: 403 })
  }
}
