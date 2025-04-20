import { Schema, model, models, Types } from 'mongoose'
import { IAllotment } from '../types'

const allotmentSchema = new Schema<IAllotment>(
  {
    slotId: { type: Types.ObjectId, ref: 'Slot', required: true },
    zoneId: { type: Types.ObjectId, ref: 'Zone', required: true },
    guestName: { type: String },
    guestContactNo: { type: String },
    guestDetail: { type: String },
    driverName: { type: String },
    driverContactNo: { type: String },
    isOwnerDriver: { type: Boolean, required: true },
    allotmentFrom: { type: Date, required: true },
    allotmentFromNum: { type: Number, required: true },
    allotmentTo: { type: Date, required: true },
    allotmentToNum: { type: Number, required: true },
    qrString: { type: String, required: true, unique: true },
    dateTimeFormatId: { type: Number },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    updatedBy: { type: Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true, strict: false }
)

const Allotment = models.Allotment || model<IAllotment>('Allotment', allotmentSchema)
export default Allotment
