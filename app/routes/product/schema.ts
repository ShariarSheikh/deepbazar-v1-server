import Joi from 'joi'
import { ProductSectionName, ProductSectionNameType, ProductStatus } from '../../models/Product.Model'

export const productCreateSchema = Joi.object({
  title: Joi.string().required().min(5).max(400),
  productCode: Joi.string().required().min(5),
  category: Joi.array().items(Joi.string()).min(1).required(),
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
  title: Joi.string().min(5).max(400),
  productCode: Joi.string().min(5),
  status: Joi.string()
    .valid(...Object.values(ProductStatus))
    .allow(''),
  category: Joi.array().items(Joi.string()),
  productSectionName: Joi.string()
    .valid(...Object.values(ProductSectionName))
    .allow(''),
  sellerId: Joi.string(),
  ratings: Joi.object({
    star: Joi.number(),
    totalReviews: Joi.number()
  }),
  totalAnswers: Joi.number(),
  totalWishlist: Joi.number(),
  price: Joi.number().min(1),
  discountPrice: Joi.number(),
  discountPercent: Joi.number().min(1).max(99).allow(0),
  offerText: Joi.string().allow(''),
  inStock: Joi.boolean(),
  images: Joi.array().items(
    Joi.object({
      mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),

      // Limit the file size to a reasonable value (e.g., 5MB)
      size: Joi.number()
        .max(5 * 1024 * 1024)
        .required()
    }).required()
  ),
  description: Joi.string().min(10).allow(''),
  specification: Joi.string().allow(''),
  tags: Joi.array().items(Joi.string()).min(1)
})

//------------------------------------------- api query

interface ProductFilterByType {
  MostPopular: string
  Regular: string
}

export interface CategoryQuery {
  category: string
  pageLength: number
  limit: number
  startPrice: number
  endPrice: number
  filterBy: ProductFilterByType
  productSectionName: ProductSectionNameType
}

export const ProductFilterBy = {
  MostPopular: 'MostPopular',
  Regular: 'Regular'
} as const

export const categoryQuerySchema = Joi.object({
  category: Joi.string().min(3).max(50).allow(''),
  pageLength: Joi.number().allow(0),
  limit: Joi.number().allow(0),
  startPrice: Joi.number().allow(0),
  endPrice: Joi.number().allow(0),
  filterBy: Joi.string()
    .valid(...Object.values(ProductFilterBy))
    .allow(''),
  productSectionName: Joi.string()
    .valid(...Object.values(ProductSectionName))
    .allow('')
})
