import { Document, Schema, model } from 'mongoose'

type UserType = 'user' | 'seller'
export const UserType = {
  USER: 'user',
  ADMIN: 'seller'
}

export interface IAuth extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  imgUrl: string
  userType: UserType
  isCustomAccount: boolean
  address: string
  zipCode: string
  bio: string
  socialLinks: {
    facebook: string
    instagram: string
    linkedin: string
    twitter: string
  }
  createdAt: Date
  updatedAt: Date
}

const AuthSchema = new Schema<IAuth>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    imgUrl: { type: String },
    userType: { type: String, enum: Object.values(UserType), required: true },
    isCustomAccount: { type: Boolean, required: true },
    address: { type: String },
    zipCode: { type: String },
    bio: { type: String },
    socialLinks: {
      facebook: { type: String },
      instagram: { type: String },
      linkedin: { type: String },
      twitter: { type: String }
    }
  },
  {
    timestamps: true
  }
)

const AuthModel = model<IAuth>('Auth', AuthSchema)
export default AuthModel
