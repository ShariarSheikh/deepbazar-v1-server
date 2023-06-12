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
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImageUrl: { type: String, required: true }
  },
  {
    timestamps: true
  }
)

const AuthModel = model<IAuth>('Auth', AuthSchema)
export default AuthModel
