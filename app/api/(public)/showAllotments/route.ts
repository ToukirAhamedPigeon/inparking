import { NextRequest, NextResponse } from 'next/server'
import Allotment from '@/models/Allotment'
import { omitFields } from '@/lib/helpers';


export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const dateTimeFormatId = searchParams.get('dateTimeFormatId')
    if (!dateTimeFormatId) {
      return NextResponse.json({ success: false, message: 'dateTimeFormatId is required' }, { status: 400 })
    }
    const query = { dateTimeFormatId: parseInt(dateTimeFormatId) }
    const allotment = await Allotment.findOne(query).populate('slotId').populate('zoneId').lean()
    if (!allotment) {   
      return NextResponse.json({ success: false, message: 'Allotment not found' }, { status: 404 })
    }
      const formattedAllotment = omitFields(allotment, ['_id', 'createdAt', 'updatedAt'])
      console.log(formattedAllotment)
      return NextResponse.json({ success: true, allotment: formattedAllotment })
  } catch (error) {
    console.error('Error in checkAllotmentOverlap API:', error)
    return NextResponse.json(
      { message: 'Server error' },
      { status: 500 }
    )
  }
}