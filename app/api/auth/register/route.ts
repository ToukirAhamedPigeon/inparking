import { NextResponse } from 'next/server'
import dbConnect from '@/lib/dbConnect'
import User from '@/models/User'
import { EActionType, EModelType, EUserRole } from '@/types'
import { logAction } from '@/lib/logger'
import { uploadAndResizeImage } from '@/lib/imageUploder'
import bcrypt from 'bcryptjs'
import { getAuthUserIdFromCookie } from '@/lib/getAuthUser'


export async function POST(req: Request) {
  try {
    await dbConnect()

    const formData = await req.formData()
    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const role = formData.get('role') as EUserRole || EUserRole.USER
    const file = formData.get('profilePicture') as File

    // Check email duplication
    const emailExists = await User.findOne({ email })
    if (emailExists) {
      return NextResponse.json({ success: false, message: 'Email already exists' }, { status: 400 })
    }

    // Encrypt password
    const hashedPassword = await bcrypt.hash(password, 10)
    const authUserId = await getAuthUserIdFromCookie()


    // Upload image
    

    // Save user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      decryptedPassword: password,
      role,
      createdBy: authUserId,
    })

    const { imageDoc }: { imageDoc: typeof Image.prototype } = await uploadAndResizeImage({
        file,
        modelFolder: 'users',
        modelType: EModelType.User,
        modelId: newUser._id,
      })

    // Update user with profile picture
    newUser.profilePicture = imageDoc._id
    await newUser.save()

    // Log action
    await logAction({
      detail: `User created: ${newUser.name}`,
      changes: JSON.stringify({ after: newUser }),
      actionType: EActionType.CREATE,
      collectionName: 'User',
      objectId: newUser._id.toString()
    })

    return NextResponse.json({ success: true, user: newUser }, { status: 201 })
  } catch (error) {
    console.error('Register Error:', error)
    return NextResponse.json({ success: false, message: 'Registration failed' }, { status: 500 })
  }
}
