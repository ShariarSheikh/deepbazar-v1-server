import { Document, Schema, model } from 'mongoose'

// Define role constants
export const Role = {
  USER: 'USER',
  SELLER: 'SELLER'
} as const

export type RoleType = (typeof Role)[keyof typeof Role]

export interface IAuth extends Document {
  firstName: string
  lastName: string
  email: string
  password: string
  imgUrl?: string
  role: RoleType[]
  isCustomAccount: boolean
  address?: string
  zipCode?: number
  bio?: string
  socialLinks: {
    facebook?: string
    instagram?: string
    linkedin?: string
    twitter?: string
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
    role: { type: [String], enum: Object.values(Role), required: true },
    isCustomAccount: { type: Boolean, required: true },
    address: { type: String },
    zipCode: { type: Number },
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
