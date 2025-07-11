import { Schema, Document, models, model } from 'mongoose'

export interface IReview extends Document {
  postId: string
  userId: string
  content: string
  rating: number
  isDeleted: boolean
  parentId?: string
  createdAt: Date
  updatedAt: Date
}

const ReviewSchema = new Schema<IReview>(
  {
    postId: { type: String, required: true, index: true },
    userId: { type: String, required: true, index: true },
    content: { type: String, required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    isDeleted: { type: Boolean, default: false },
    parentId: { type: String, default: null },
  },
  { timestamps: true }
)

export default models.Review || model<IReview>('Review', ReviewSchema)
