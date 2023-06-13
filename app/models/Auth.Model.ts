import { Document, Schema, model } from 'mongoose'

export interface IAuth extends Document {
  name: string
  email: string
  password: string
  profileImageUrl: string
  createdAt: Date
  updatedAt: Date
}

const AuthSchema = new Schema<IAuth>(
  {
    name: { type: String },
    email: { type: String, unique: true },
    password: { type: String },
    profileImageUrl: { type: String }
  },
  {
    timestamps: true
  }
)

const AuthModel = model<IAuth>('Auth', AuthSchema)
export default AuthModel
