import { Schema, Types, model, models } from 'mongoose'
import { IUser, EUserRole } from '../types'

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  decryptedPassword: { type: String, required: true },
  role: { type: String, enum: EUserRole, default: EUserRole.USER },
  profilePicture: { type: Types.ObjectId, ref: 'Image', required: false },
  isActive: { type: Boolean, default: true },
}, { timestamps: true })

const User = models.User || model('User', userSchema)
export default User
