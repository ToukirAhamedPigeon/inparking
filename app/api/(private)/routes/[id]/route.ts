import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import Image from '@/models/Image'
import { Types } from 'mongoose'
import jwt from 'jsonwebtoken'
import Zone from '@/models/Zone'
import Route from '@/models/Route'
import Slot from '@/models/Slot'
import Allotment from '@/models/Allotment'
import { logAction } from '@/lib/logger'
import { EActionType, EModelType } from '@/types'
import { deleteImage, uploadAndResizeImage } from '@/lib/imageUploder'
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
            const route = await Route.findById(id)
            .populate('createdBy')
            .populate('updatedBy')
            .populate('toZoneId')
            .lean()
      
          if (!route) {
            return NextResponse.json({ error: 'Route not found' }, { status: 404 })
          }
      
          const images = await Image.find({
            modelType: EModelType.ROUTE,
            modelId: new Types.ObjectId(id),
          }).lean()
      
          const formattedRoute = {
            ...route,
            images, // all route-related images
          }

            return NextResponse.json(formattedRoute)
          } catch (err) {
            console.error('Error fetching route detail:', err)
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
    const routeId = id
    const route = await Route.findById(routeId)
    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }
    
    const formData = await req.formData()

    const updates: any = {
      fromAddress: formData.get('fromAddress'),
      toAddress: formData.get('toAddress'),
      toZoneId: formData.get('toZoneId'),
      description: formData.get('description'),
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
            modelFolder: 'routes',
            modelType: EModelType.ROUTE,
            modelId: route._id,
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
          modelFolder: 'routes',
          modelType: EModelType.ROUTE,
          modelId: route._id,
          imageTitle: title || '',
          imageDetail: description || '',
        })
        updatedImages.push(imageDoc._id)
      }
    }

    updates.images = updatedImages

    const updatedRoute = await Route.findByIdAndUpdate(routeId, updates, { new: true, strict: false }).populate('images')

    await logAction({
      detail: `Route updated: ${updatedRoute.name}`,
      actionType: EActionType.UPDATE,
      collectionName: 'Route',
      objectId: routeId,
      changes: JSON.stringify({ before: route.toObject(), after: updatedRoute.toObject() }),
    })

    return NextResponse.json({ route: updatedRoute })
  } catch (err) {
    console.error('Update error:', err)
    const status = err instanceof Error && err.name === 'JsonWebTokenError' ? 403 : 500
    return NextResponse.json({ error: 'Invalid or expired token' }, { status })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const routeId = id
  const authHeader = req.headers.get('authorization')
  const token = authHeader?.split(' ')[1]

  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    jwt.verify(token, process.env.ACCESS_SECRET!)
    await dbConnect()

    const route = await Route.findById(routeId)
    if (!route) {
      return NextResponse.json({ error: 'Route not found' }, { status: 404 })
    }


    // Check for references in other collections

      // Delete profile picture from database and file system
      const existingImages = await Image.find({
        modelType: EModelType.ROUTE,
        modelId: new Types.ObjectId(id),
      }).lean()
      if (existingImages.length > 0) {
        for (const image of existingImages) {
          await deleteImage(image._id as string)
        }
      }
      await Route.findByIdAndDelete(routeId)
      await logAction({
        detail: `Route deleted: ${route.name}`,
        changes: JSON.stringify({ before: omitFields(route.toObject?.() || route, ['createdAtId','__v']) }),
        actionType: EActionType.DELETE,
        collectionName: 'Route',
        objectId: route._id.toString(),
      })
      return NextResponse.json({ status: 'deleted' })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Server Error' }, { status: 500 })
  }
}
