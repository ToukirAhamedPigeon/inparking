import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Image from '@/models/Image'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import Zone from '@/models/Zone'

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
            const zone = await Zone.findById(id).lean();
        
            if (!zone) {
              return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
            }
        
              return NextResponse.json(zone)
            } catch (err) {
              console.error('Error fetching zone detail:', err)
              return NextResponse.json({ error: 'Server error' }, { status: 500 })
            }
          } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
          }
  }