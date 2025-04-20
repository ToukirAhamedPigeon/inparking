import { NextRequest, NextResponse } from 'next/server'
import Allotment from '@/models/Allotment'
import { omitFields } from '@/lib/helpers';
import Route from '@/models/Route';
import Zone from '@/models/Zone';
import { Types } from 'mongoose';
import { EModelType, IAllotment, IRoute } from '@/types';
import Image from '@/models/Image';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateTimeFormatId = searchParams.get('dateTimeFormatId')
    if (!dateTimeFormatId) {
      return NextResponse.json({ success: false, message: 'dateTimeFormatId is required' }, { status: 400 })
    }
    const query = { dateTimeFormatId: parseInt(dateTimeFormatId) }
    const allotment = await Allotment.findOne(query)
    .populate('zoneId')
    .populate('slotId')
    .lean() as (IAllotment & { zoneId: any }) | null
    if (!allotment) {   
      return NextResponse.json({ success: false, message: 'Allotment not found' }, { status: 404 })
    }
    const zoneId = (allotment.zoneId as any)?._id ?? allotment.zoneId
    if (!zoneId) throw new Error('zoneId not found on allotment')
      const routes = await Route.find({ toZoneId: zoneId.toString() }).lean()
    const routeIds = routes.map((route) => route._id)
    const routeImages = await Image.find({
      modelType: EModelType.ROUTE,
      modelId: { $in: routeIds },
    }).lean()
    console.log('routeImages',routeImages)
    const formattedAllotment = omitFields(allotment, ['_id', 'createdAt', 'updatedAt'])

      return NextResponse.json({ success: true, allotment: formattedAllotment, routes, routeImages })
  } catch (error) {
    console.error('Error in checkAllotmentOverlap API:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}