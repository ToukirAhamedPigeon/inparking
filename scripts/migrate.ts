import mongoose from 'mongoose'
import path from 'path'
import dotenv from 'dotenv'

import User from '../models/User'
import Zone from '../models/Zone'
import Slot from '../models/Slot'
import Allotment from '../models/Allotment'
import Log from '../models/Log'
import Image from '../models/Image'
import Route from '../models/Route'

import { hashPassword } from '../lib/hash'
import { IUser, EUserRole, EModelType } from '../types'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function migrate() {
  try {
    const MONGO_URI = process.env.MONGODB_URI

    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env')
    }

    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Step 1: Create admin user without profile picture
    const existingAdmin: IUser | null = await User.findOne({ email: 'admin@inparking.com' })
    if (existingAdmin) {
      console.log('⚠️ Admin already exists. Skipping creation.')
    } else {
      const password = 'admin123'
      const hashedPassword = await hashPassword(password)

      // Create admin user without profile picture
      const adminUser = await User.create({
        name: 'Super Admin',
        email: 'admin@inparking.com',
        password: hashedPassword,
        decryptedPassword: password,
        role: EUserRole.ADMIN,
        isActive: true,
        createdAtId: getCreatedAtId(new Date())
      })

      console.log('✅ Admin user created successfully')

      // Step 2: Create default image for the user profile picture
      const defaultImagePath = '/uploads/images/users/policeman.png'
      const existingImage = await Image.findOne({ imageUrl: defaultImagePath })
      function getCreatedAtId(createdAt: Date): number {
        const pad = (n: number) => String(n).padStart(2, '0')
    
        const createdAtId = 
          createdAt.getFullYear().toString() +
          pad(createdAt.getMonth() + 1) +
          pad(createdAt.getDate()) +
          pad(createdAt.getHours()) +
          pad(createdAt.getMinutes()) +
          pad(createdAt.getSeconds())
        return parseInt(createdAtId)
      }
      let imageObjectId: mongoose.Types.ObjectId | null = null
      if (!existingImage) {
        const image = await Image.create({
          imageUrl: defaultImagePath,
          modelType: EModelType.User,  // For user profile picture
          modelId: adminUser._id, // Assign the created admin user objectId
          createdBy: adminUser._id,  // Optional - can be set to null if no admin created at this point
          createdAt: new Date(),
          createdAtId: getCreatedAtId(new Date())
        })
        imageObjectId = image._id
        console.log('✅ Default profile image created')
      } else {
        imageObjectId = existingImage._id
        console.log('⚠️ Default profile image already exists')
      }

      // Step 3: Update admin user with profile picture
      await User.findByIdAndUpdate(adminUser._id, { profilePicture: imageObjectId })
      console.log('✅ Admin user profile picture updated')
    }

    // Step 4: Initialize empty collections (without validation errors)
    const collections = [
      { name: 'Zone', model: Zone, defaultData: { name: 'Default Zone', createdBy: null, updatedBy: null } },
      { name: 'Slot', model: Slot, defaultData: { createdBy: null, updatedBy: null } },
      { name: 'Allotment', model: Allotment, defaultData: { createdBy: null, updatedBy: null } },
      { name: 'Log', model: Log, defaultData: { createdBy: null, updatedBy: null } },
      { name: 'Image', model: Image, defaultData: { createdBy: null, updatedBy: null } },
      { name: 'Route', model: Route, defaultData: { createdBy: null, updatedBy: null } }
    ]

    for (const { name, model, defaultData } of collections) {
      const exists = await model.exists({})
      if (!exists) {
        await model.create(defaultData)  // Create a document with default values to initialize the collection
        console.log(`✅ Initialized empty collection: ${name}`)
      } else {
        console.log(`⚠️ Collection ${name} already has documents`)
      }
    }

    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

migrate()
