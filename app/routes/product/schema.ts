import Joi from 'joi'

export const productCreateSchema = Joi.object({
  product_id: Joi.string().required(),
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
  images: Joi.array().items(Joi.string().uri()).default([]),
  categories: Joi.array().items(Joi.string()).default([]),
  inventory: Joi.object({
    stock: Joi.number().required(),
    availability: Joi.boolean().required()
  }).required(),
  attributes: Joi.object({
    color: Joi.string().required(),
    size: Joi.string().required()
  }).required(),
  reviews: Joi.object({
    average_rating: Joi.number().required(),
    total_reviews: Joi.number().required()
  }).required(),
  related_products: Joi.array().items(
    Joi.object({
      product_id: Joi.string().required(),
      title: Joi.string().required(),
      price: Joi.number().required(),
      image: Joi.string().uri().required()
    })
  ),
  product_url: Joi.string().uri().required()
})
