import mongoose, { Schema, model, models } from 'mongoose'
import { UserType } from '@/types'

const userSchema = new Schema<UserType>({
  name: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  profilePicture: String,
  decryptedPassword: String,
}, { timestamps: true })

const User = models.User || model('User', userSchema)
export default User
