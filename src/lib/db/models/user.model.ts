import { Schema, Document, model, models } from 'mongoose'

export interface IUser extends Document {
  name?: string
  email: string
  emailVerified: boolean
  password?: string
  role: 'user' | 'admin'
  image: string
  visitCount: number
  isActive: boolean
  verificationCode: string
  verificationCodeExpires: Date | null
  createdAt: Date
  updatedAt: Date
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String },
    email: { type: String, required: true, unique: true },
    emailVerified: { type: Boolean, default: false },
    password: { type: String },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    image: { type: String, default: '/face/default.jpg' },
    visitCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    verificationCode: { type: String, default: '' },
    verificationCodeExpires: { type: Date, default: null },
  },
  {
    timestamps: true,
  }
)

const User = models.User || model<IUser>('User', UserSchema)

export default User
