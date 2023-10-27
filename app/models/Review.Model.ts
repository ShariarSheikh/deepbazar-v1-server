import { Document, Schema, model } from 'mongoose'

export enum RatingLevelEnum {
  Required = 'Rating is Required *',
  VeryPoor = 'Very Poor',
  Poor = 'Poor',
  Neutral = 'Neutral',
  Good = 'Good',
  Excellent = 'Excellent'
}

export interface IReview extends Document {
  user: {
    imgUrl: string
    _id: string
    name: string
  }
  productId: Schema.Types.ObjectId
  star: number
  ratingLevel: RatingLevelEnum
  message: string
  createdAt: Date
  updatedAt: Date
}

const reviewSchema = new Schema(
  {
    user: {
      imgUrl: { type: String, default: '' },
      _id: { type: Schema.Types.ObjectId, required: true },
      name: { type: String, required: true }
    },
    productId: { type: Schema.Types.ObjectId, required: true },
    star: { type: Number, required: true },
    ratingLevel: { type: String, enum: Object.values(RatingLevelEnum), required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
)

const ReviewModel = model<IReview>('Reviews', reviewSchema)
export default ReviewModel
