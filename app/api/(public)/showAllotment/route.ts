import { NextRequest, NextResponse } from 'next/server'
import Allotment from '@/models/Allotment'
import { omitFields } from '@/lib/helpers';
import Route from '@/models/Route';
import '@/models/Zone';
import '@/models/Slot';
import { Types } from 'mongoose';
import { EModelType, IAllotment, IRoute, ISlot, IZone } from '@/types';
import Image from '@/models/Image';
import dbConnect from '@/lib/dbConnect';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateTimeFormatId = searchParams.get('dateTimeFormatId')
    if (!dateTimeFormatId) {
      return NextResponse.json({ success: false, message: 'dateTimeFormatId is required' }, { status: 400 })
    }
    await dbConnect()
    const query = { dateTimeFormatId: parseInt(dateTimeFormatId) }
    const allotment = await Allotment.findOne(query)
    .populate('zoneId')
    .populate('slotId')
    .lean() as (IAllotment & { zoneId: IZone, slotId: ISlot }) | null
    if (!allotment) {   
      return NextResponse.json({ success: false, message: 'Invalid QR Code. Please scan again.' }, { status: 404 })
    }
    // Compare today's date with allotmentTo
    const now = new Date()
    const expiry = new Date(allotment.allotmentTo)

    if (now > expiry) {
      return NextResponse.json({ success: false, message: 'QR Code has expired' }, { status: 410 }) // 410 Gone
    }
    const zoneId = (allotment.zoneId as any)?._id ?? allotment.zoneId
    if (!zoneId) throw new Error('zoneId not found on allotment')
    const routes = await Route.find({ toZoneId: zoneId.toString() }).lean()
    const routeIds = routes.map((route) => route._id)
    const routeImages = await Image.find({
      modelType: EModelType.ROUTE,
      modelId: { $in: routeIds },
    }).lean()
    const zoneImages = await Image.find({
      modelType: EModelType.ZONE,
      modelId: zoneId,
    }).lean()
    const slotImages = await Image.find({
      modelType: EModelType.SLOT,
      modelId: allotment.slotId,
    }).lean()
    // console.log('routeImages',routeImages)
    const formattedAllotment = omitFields(allotment, ['_id', 'createdAt', 'updatedAt'])

      return NextResponse.json({ success: true, allotment: formattedAllotment, routes, routeImages, zoneImages, slotImages })
  } catch (error) {
    console.error('Error in checkAllotmentOverlap API:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}