import { Document, Schema, model } from 'mongoose'

export interface IAnswer {
  by?: Schema.Types.ObjectId
  ans?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IQAndAns extends Document {
  user: Schema.Types.ObjectId
  product: Schema.Types.ObjectId
  question: string
  answer: IAnswer
}

const qAndAnsSchema = new Schema<IQAndAns>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'Auth', required: true },
    product: { type: Schema.Types.ObjectId, ref: 'Products', required: true },
    question: { type: String, required: true },
    answer: {
      by: { type: String, required: false, default: '' },
      ans: { type: String, required: false, default: '' },
      createdAt: { type: Date, required: false, default: '' },
      updatedAt: { type: Date, required: false, default: '' }
    }
  },
  { timestamps: true }
)

const QAndAnsModel = model<IQAndAns>('QAndAns', qAndAnsSchema)
export default QAndAnsModel
