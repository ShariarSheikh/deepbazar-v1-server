import Joi from 'joi'

export const qAndAnsCreateSchema = Joi.object({
  productId: Joi.string().required(),
  question: Joi.string().required()
})

export const qAndAnsUpdateSchema = Joi.object({
  productId: Joi.string().required(),
  answer: Joi.string().required()
})
