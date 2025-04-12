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
import { IUser, EUserRole } from '@/types'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function migrate() {
  try {
    const MONGO_URI = process.env.MONGODB_URI

    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env')
    }

    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    // Create admin user
    const existingAdmin: IUser | null = await User.findOne({ email: 'admin@inparking.com' })
    if (existingAdmin) {
      console.log('⚠️ Admin already exists. Skipping creation.')
    } else {
      const password = 'admin123'
      const hashedPassword = await hashPassword(password)

      await User.create({
        name: 'Super Admin',
        email: 'admin@inparking.com',
        password: hashedPassword,
        decryptedPassword: password,
        profilePicture: '/assets/policeman.png',
        role: EUserRole.ADMIN,
        isActive: true
      })

      console.log('✅ Admin user created successfully')
    }

    // Initialize empty documents to trigger collection creation
    const collections = [
      { name: 'Zone', model: Zone },
      { name: 'Slot', model: Slot },
      { name: 'Allotment', model: Allotment },
      { name: 'Log', model: Log },
      { name: 'Image', model: Image },
      { name: 'Route', model: Route }
    ]

    for (const { name, model } of collections) {
      const exists = await model.exists({})
      if (!exists) {
        await model.create({})
        await model.deleteMany({})
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
