import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import Slot from '@/models/Slot'

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
            const slot = await Slot.findById(id).populate('zoneId').lean();
        
            if (!slot) {
              return NextResponse.json({ error: 'Slot not found' }, { status: 404 })
            }
        
              return NextResponse.json(slot)
            } catch (err) {
              console.error('Error fetching slot detail:', err)
              return NextResponse.json({ error: 'Server error' }, { status: 500 })
            }
          } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
          }
  }