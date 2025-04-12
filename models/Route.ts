import { Schema, model, models, Types } from 'mongoose'
import { IRoute } from '../types'

const routeSchema = new Schema<IRoute>(
  {
    fromAddress: { type: String },
    toAddress: { type: String },
    toZoneId: { type: Types.ObjectId, ref: 'Zone', required: true },
    description: { type: String },
    images: [{ type: Types.ObjectId, ref: 'Image' }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

const Route = models.Route || model<IRoute>('Route', routeSchema)
export default Route
