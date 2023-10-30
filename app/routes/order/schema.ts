import Joi from 'joi'

const OrderItemSchema = Joi.object({
  title: Joi.string().required(),
  imgUrl: Joi.string().required(),
  price: Joi.number().required(),
  discountPrice: Joi.number().required(),
  discountPercent: Joi.number().required(),
  productId: Joi.string().required(),
  cartQuantity: Joi.number().required()
})

export const OrderCrateSchema = Joi.object({
  orderId: Joi.string().required(),
  totalAmount: Joi.number().required(),
  subtotalAmount: Joi.number().required(),
  shippingFee: Joi.number().required(),
  items: Joi.array().items(OrderItemSchema).required()
})
