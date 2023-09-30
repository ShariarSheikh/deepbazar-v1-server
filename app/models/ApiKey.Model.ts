import { serverAccessApiKey } from '../config/variables.config'
import { Document, Schema, model } from 'mongoose'

export interface IApiKey extends Document {
  key: string
  createdAt: Date
  updatedAt: Date
}

const ApiKeySchema = new Schema<IApiKey>(
  {
    key: { type: String, required: true, default: serverAccessApiKey }
  },
  {
    timestamps: true
  }
)

const ApiKeyModel = model<IApiKey>('ApiKey', ApiKeySchema)
export default ApiKeyModel
