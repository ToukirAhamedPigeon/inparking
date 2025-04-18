import { Schema, model, models, Types } from 'mongoose'
import { IImage, EModelType } from '../types'

const imageSchema = new Schema<IImage>(
  {
    imageUrl: { type: String, required: true },
    imageTitle: { type: String },
    imageDetail: { type: String },
    modelType: { type: String, enum: EModelType, required: true },
    modelId: { type: Schema.Types.ObjectId, required: true },
    createdBy: { type: Types.ObjectId, ref: 'User', required: true },
    createdAtId: { type: Number },
  },
  { timestamps: { createdAt: true, updatedAt: false }, strict: false } // Only createdAt is tracked
)

const Image = models.Image || model<IImage>('Image', imageSchema)
export default Image
