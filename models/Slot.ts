import { Schema, model, models, Types } from 'mongoose'
import { ISlot } from '../types'

const slotSchema = new Schema<ISlot>(
  {
    zoneId: { type: Types.ObjectId, ref: 'Zone', required: true },
    slotNumber: { type: String, required: true },
    slotDetail: { type: String },
    images: [{ type: Types.ObjectId, ref: 'Image' }],
    qrString: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
    createdAtId: { type: Number },
  },
  { timestamps: true, strict: false }
)

const Slot = models.Slot || model<ISlot>('Slot', slotSchema)
export default Slot
