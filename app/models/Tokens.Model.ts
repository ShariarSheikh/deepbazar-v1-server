import mongoose, { Document, Schema, model } from 'mongoose'

export interface IToken extends Document {
  token: string
  userId: mongoose.Schema.Types.ObjectId
  expires: {
    type: Date
    default: Date
    expires: number
  }
}

const tokenSchema = new Schema<IToken>({
  token: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  expires: {
    type: Date,
    default: Date.now,
    expires: 30 * 86400 // 30 days
  }
})

const TokenModel = model<IToken>('Tokens', tokenSchema)
export default TokenModel
