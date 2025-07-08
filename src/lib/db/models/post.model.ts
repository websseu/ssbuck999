import { Schema, Document, models, model, Types } from 'mongoose'

export interface IPost extends Document {
  title: string
  slug: string
  category?: string
  description?: string
  isPublished: boolean
  storeId?: string
  numViews: number
  numLikes: number
  comments?: Types.ObjectId[]
  likes: Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new Schema<IPost>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    category: { type: String, trim: true },
    description: { type: String, trim: true, default: '' },
    isPublished: { type: Boolean, default: false },
    storeId: { type: String, trim: true },
    numViews: { type: Number, default: 0 },
    numLikes: { type: Number, default: 0 },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User', default: [] }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment', default: [] }],
  },
  { timestamps: true }
)

// 검색을 위한 인덱스
PostSchema.index({ title: 'text', description: 'text', contents: 'text' })
PostSchema.index({ location: 1 })
PostSchema.index({ category: 1 })
PostSchema.index({ isPublished: 1 })

const Post = models.Post || model<IPost>('Post', PostSchema)

export default Post
