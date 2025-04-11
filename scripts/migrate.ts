import mongoose from 'mongoose'
import User from '../models/User'
import { hashPassword } from '../lib/hash'
import dotenv from 'dotenv'
import path from 'path'
import { UserType } from '@/types'

dotenv.config({ path: path.resolve(__dirname, '../.env.local') })

async function migrate() {
  try {
    const MONGO_URI = process.env.MONGODB_URI

    if (!MONGO_URI) {
      throw new Error('MONGO_URI is not defined in .env')
    }

    await mongoose.connect(MONGO_URI)
    console.log('✅ Connected to MongoDB')

    const existingAdmin: UserType | null = await User.findOne({ email: 'admin@inparking.com' })
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
        role: 'admin',
      })

      console.log('✅ Admin user created successfully')
    }

    await mongoose.disconnect()
    console.log('🔌 Disconnected from MongoDB')
  } catch (err) {
    console.error('❌ Migration failed:', err)
    process.exit(1)
  }
}

migrate()
