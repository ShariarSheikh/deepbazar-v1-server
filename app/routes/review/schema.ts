import Joi from 'joi'
import { RatingLevelEnum } from '../../models/Review.Model'

export const reviewCreateSchema = Joi.object({
  productId: Joi.string().required(),
  star: Joi.number().min(1).max(5).required(),
  ratingLevel: Joi.string()
    .valid(...Object.values(RatingLevelEnum))
    .required(),
  message: Joi.string().required()
})
