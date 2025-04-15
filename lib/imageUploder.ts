import fs from 'fs'
import path from 'path'
import dbConnect from '@/lib/dbConnect' 
import sharp from 'sharp'
import { v4 as uuidv4 } from 'uuid'
import Image from '@/models/Image'
import { EModelType } from '@/types'
import { Types } from 'mongoose'
import { getAuthUserIdFromCookie } from '@/lib/getAuthUser'


const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp', 'image/svg+xml']

interface UploadParams {
    file: File
    modelFolder: string
    modelType: string
    modelId: Types.ObjectId
    width?: number
    isResize?: boolean
  }

export async function uploadAndResizeImage({ file, modelFolder, modelType, modelId, width, isResize }: UploadParams): Promise<{
  fileName: string;
  imageUrl: string;
  imageDoc: typeof Image.prototype;
}> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid image type')
  }

  const ext = path.extname((file as File).name || 'image.jpg')
  const fileName = `${uuidv4()}${ext}`
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'images', modelFolder)

  // Ensure folder exists
  fs.mkdirSync(uploadDir, { recursive: true })

  const buffer = Buffer.from(await file.arrayBuffer())

  const outputPath = path.join(uploadDir, fileName)

  if (isResize) {
    await sharp(buffer)
      .resize({ width })
      .toFile(outputPath)
  } else {
    await sharp(buffer).toFile(outputPath)
  }
  await dbConnect()

  const imageUrl = `/uploads/images/${modelFolder}/${fileName}`
  const authUserId = await getAuthUserIdFromCookie()

   const imageDoc: typeof Image.prototype = await Image.create({
      imageUrl,
      imageTitle: fileName,
      modelType: EModelType.User,
      modelId: modelId,
      createdBy: authUserId,
    })

  return { imageDoc, imageUrl, fileName }

}
