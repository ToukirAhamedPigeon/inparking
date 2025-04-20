import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import jwt from 'jsonwebtoken'
import Slot from '@/models/Slot'

export async function GET(req:NextRequest) {
    const authHeader = req.headers.get('authorization')
    const token = authHeader?.split(' ')[1]

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
        try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET!)
          await dbConnect()
            try {
                const { searchParams } = new URL(req.url);
                const q = searchParams.get("q") || "";
                const limit = parseInt(searchParams.get("limit") || "50");
                const otherFilters: Record<string, any> = {};
                searchParams.forEach((value, key) => {
                  if (!["q", "limit"].includes(key) && value !== "") {
                    otherFilters[key] = value;
                  }
                });
                // Build filter from dynamic search params
                const filter = {
                    $and: [
                      {
                        $or: [
                          { slotNumber: { $regex: q, $options: "i" } },
                          { 'zoneId.name': { $regex: q, $options: "i" } },
                        ],
                      },
                      ...Object.entries(otherFilters).map(([key, value]) => ({
                        [key]: value,
                      })),
                    ],
                  };
              
                const slots = await Slot.find(filter)
                  .limit(limit)
                  .populate('zoneId')
                  .select("_id slotNumber zoneId")
                  .sort({ slotNumber: 1 });
            
              return NextResponse.json(slots);
            } catch (err) {
              console.error('Error fetching slot detail:', err)
              return NextResponse.json({ error: 'Server error' }, { status: 500 })
            }
          } catch (err) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
          }
  }