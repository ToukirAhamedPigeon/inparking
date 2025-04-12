import { Schema, model, models, Types } from 'mongoose'
import { IZone } from '../types'

const zoneSchema = new Schema<IZone>(
  {
    name: { type: String, required: true },
    address: { type: String },
    latitude: { type: String },
    longitude: { type: String },
    routes: [{ type: Types.ObjectId, ref: 'Route' }],
    images: [{ type: Types.ObjectId, ref: 'Image' }],
    slots: [{ type: Types.ObjectId, ref: 'Slot' }],
    contactName: { type: String },
    contactNo: { type: String },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const Zone = models.Zone || model<IZone>('Zone', zoneSchema)
export default Zone
