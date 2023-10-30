import Joi from 'joi'

export const shippingAddressCreateSchema = Joi.object({
  firstName: Joi.string().required().trim(),
  lastName: Joi.string().required().trim(),
  email: Joi.string().email().required().trim(),
  phone: Joi.string().required().trim(),
  division: Joi.string().required().trim(),
  district: Joi.string().required().trim(),
  thana: Joi.string().required().trim(),
  address: Joi.string().required().trim()
})
