import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import Image from '@/models/Image'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import Zone from '@/models/Zone'
import Route from '@/models/Route'
import Slot from '@/models/Slot'
import Allotment from '@/models/Allotment'
import Log from '@/models/Log'
import fs from 'fs'
import path from 'path'
import { logAction } from '@/lib/logger'
import { EActionType, EModelType, EUserRole } from '@/types'
import bcrypt from 'bcryptjs'
import { deleteImage, uploadAndResizeImage } from '@/lib/imageUploder'
import { getCreatedAtId } from '@/lib/formatDate'
import { omitFields } from '@/lib/helpers'


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
            const zone = await Zone.findById(id)
            .populate('createdBy')
            .populate('updatedBy')
            .lean()
      
          if (!zone) {
            return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
          }
      
          const images = await Image.find({
            modelType: EModelType.ZONE,
            modelId: new Types.ObjectId(id),
          }).lean()
      
          const formattedZone = {
            ...zone,
            images, // all zone-related images
          }

            return NextResponse.json(formattedZone)
          } catch (err) {
            console.error('Error fetching zone detail:', err)
            return NextResponse.json({ error: 'Server error' }, { status: 500 })
          }
        } catch (err) {
          return NextResponse.json({ error: 'Invalid token' }, { status: 403 })
        }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    jwt.verify(token, process.env.ACCESS_SECRET!)
    const zoneId = id
    const zone = await Zone.findById(zoneId)
    if (!zone) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
    }
    
    const formData = await req.formData()

    const updates: any = {
      name: formData.get('name'),
      address: formData.get('address'),
      latitude: formData.get('latitude') || '',
      longitude: formData.get('longitude') || '',
      contactName: formData.get('contactName') || '',
      contactNo: formData.get('contactNo') || '',
      isActive: formData.get('isActive') === 'true',
    }

    const deletedImageIds = JSON.parse(formData.get('deletedImageIds') as string || '[]')

    // Delete selected images and their files
    for (const imgId of deletedImageIds) {
      await deleteImage(imgId)
    }


    let updatedImages: any[] = []

    for (let i = 0; ; i++) {
      const file = formData.get(`images[${i}]`) as File | null
      const title = formData.get(`images[${i}].title`) as string
      const description = formData.get(`images[${i}].description`) as string
      const existingImageId = formData.get(`images[${i}].id`) as string | null

      // Stop if there's no file and no existing image at this index
      if (!file && !existingImageId) break

      // If existing image is being updated (metadata and/or file)
      if (existingImageId) {
        const existingImage = await Image.findById(existingImageId)
        if (!existingImage) continue

        // If file is present => replace image file
        if (file && file.size > 0 && file.type.startsWith('image/')) {
          await deleteImage(existingImage._id) // delete old file
          const { imageDoc } = await uploadAndResizeImage({
            file,
            modelFolder: 'zones',
            modelType: EModelType.ZONE,
            modelId: zone._id,
            imageTitle: title || '',
            imageDetail: description || '',
          })
          updatedImages.push(imageDoc._id)
        } else {
          existingImage.imageTitle = title || ''
          existingImage.imageDetail = description || ''
          await existingImage.save()
          updatedImages.push(existingImage._id)
        }
      }

      // If new image (no ID), upload
      if (!existingImageId && file && file.size > 0 && file.type.startsWith('image/')) {
        const { imageDoc } = await uploadAndResizeImage({
          file,
          modelFolder: 'zones',
          modelType: EModelType.ZONE,
          modelId: zone._id,
          imageTitle: title || '',
          imageDetail: description || '',
        })
        updatedImages.push(imageDoc._id)
      }
    }

    updates.images = updatedImages

    const updatedZone = await Zone.findByIdAndUpdate(zoneId, updates, { new: true, strict: false }).populate('images')

    await logAction({
      detail: `Zone updated: ${updatedZone.name}`,
      actionType: EActionType.UPDATE,
      collectionName: 'Zone',
      objectId: zoneId,
      changes: JSON.stringify({ before: zone.toObject(), after: updatedZone.toObject() }),
    })

    return NextResponse.json({ zone: updatedZone })
  } catch (err) {
    console.error('Update error:', err)
    const status = err instanceof Error && err.name === 'JsonWebTokenError' ? 403 : 500
    return NextResponse.json({ error: 'Invalid or expired token' }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const zoneId = id
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.ACCESS_SECRET!)
    await dbConnect()

    const zone = await Zone.findById(zoneId)
    if (!zone) {
      return NextResponse.json({ error: 'Zone not found' }, { status: 404 })
    }


    // Check for references in other collections
    const referenced = await Promise.any([
      Route.exists({ $or: [{ zoneId: zoneId }] }),
      Slot.exists({ $or: [{ zoneId: zoneId }] }),
      Allotment.exists({ $or: [{ zoneId: zoneId }] }),
    ])

    if (referenced) {
      zone.isActive = false
      await zone.save()

      const afterZone = await Zone.findById(zoneId)
      // Log inactivation
      await logAction({
        detail: `Zone inactivated: ${zone.name}`,
        changes: JSON.stringify({ before:omitFields(zone.toObject?.() || zone, ['createdAtId','__v']), after: omitFields(afterZone.toObject?.() || afterZone, ['createdAtId','__v']) }),
        actionType: EActionType.UPDATE,
        collectionName: 'Zone',
        objectId: zone._id.toString(),
      })
      return NextResponse.json({ status: 'inactive' })
    } else {
      // Delete profile picture from database and file system
      const existingImages = await Image.find({
        modelType: EModelType.ZONE,
        modelId: new Types.ObjectId(id),
      }).lean()
      if (existingImages.length > 0) {
        for (const image of existingImages) {
          await deleteImage(image._id as string)
        }
      }
      await Zone.findByIdAndDelete(zoneId)
      await logAction({
        detail: `Zone deleted: ${zone.name}`,
        changes: JSON.stringify({ before: omitFields(zone.toObject?.() || zone, ['createdAtId','__v']) }),
        actionType: EActionType.DELETE,
        collectionName: 'Zone',
        objectId: zone._id.toString(),
      })
      return NextResponse.json({ status: 'deleted' })
    }

  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
