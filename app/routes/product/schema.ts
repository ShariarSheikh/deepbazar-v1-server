import Joi from 'joi'
import { ProductSectionName, ProductStatus } from '../../models/Product.Model'

export const productCreateSchema = Joi.object({
  title: Joi.string().required().min(5).max(90),
  category: Joi.string().required(),
  productSectionName: Joi.string()
    .valid(...Object.values(ProductSectionName))
    .required(),
  sellerId: Joi.string().required(),
  price: Joi.number().required().min(1),
  discountPrice: Joi.number().allow(0),
  discountPercent: Joi.number().min(1).max(99).allow(0),
  offerText: Joi.string().allow(''),
  inStock: Joi.boolean().required(),
  images: Joi.array().items(
    Joi.object({
      path: Joi.string().required(),
      preview: Joi.string().required()
    })
  ),
  description: Joi.string().required().min(10),
  specification: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()).required().min(1)
})

export const productUpdateSchema = Joi.object({
  title: Joi.string().min(5).max(90),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .allow(''),
  category: Joi.string(),
  productSectionName: Joi.string()
    .valid(...Object.values(ProductSectionName))
    .allow(''),
  sellerId: Joi.string(),
  price: Joi.number().min(1),
  discountPrice: Joi.number(),
  discountPercent: Joi.number().min(1).max(99).allow(0),
  offerText: Joi.string().allow(''),
  inStock: Joi.boolean(),

  //image files or image link, one of them should be exits condition
  images: Joi.array().items(
    Joi.object({
      path: Joi.string().required(),
      preview: Joi.string().required()
    })
  ),
  imagesLinks: Joi.array().items(
    Joi.object({
      isDefault: Joi.boolean(),
      publicId: Joi.string(),
      defaultImg: Joi.string().uri(),
      cardImg: Joi.string().uri(),
      displayImg: Joi.string().uri(),
      commentImg: Joi.string().uri(),
      smallImg: Joi.string().uri(),
      _id: Joi.string()
    }).optional()
  ),
  description: Joi.string().min(10).allow(''),
  specification: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()).min(1)
})

export const categoryQuerySchema = Joi.object({
  category: Joi.string().min(3).max(50).allow(''),
  pageLength: Joi.number().allow(0),
  limit: Joi.number().allow(0),
  discountPercentUpTo: Joi.number().allow(0),
  startPrice: Joi.string().allow(''),
  endPrice: Joi.string().allow(''),
  productSectionName: Joi.string()
    .valid(...Object.values(ProductSectionName))
    .allow('')
})
