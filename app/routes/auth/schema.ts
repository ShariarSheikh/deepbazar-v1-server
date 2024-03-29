import Joi from 'joi'
import { Role } from '../../models/Auth.Model'
import { Types } from 'mongoose'

export const JoiObjectId = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!Types.ObjectId.isValid(value)) return helpers.error('any.invalid')
    return value
  }, 'Object Id Validation')

export const JoiAuthBearer = () =>
  Joi.string().custom((value: string, helpers) => {
    if (!value.startsWith('Bearer ')) return helpers.error('any.invalid')
    if (!value.split(' ')[1]) return helpers.error('any.invalid')
    return value
  }, 'Authorization Header Validation')

export const imgFile = Joi.object({
  mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/gif').required(),

  // Limit the file size to a reasonable value (e.g., 5MB)
  size: Joi.number()
    .max(5 * 1024 * 1024)
    .required()
}).optional()

export const createSchema = Joi.object({
  firstName: Joi.string().required().min(3).max(50),
  lastName: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required().max(200),
  password: Joi.string().required().min(6).max(100),
  imgUrl: Joi.string().optional().uri().allow(''),
  role: Joi.string()
    .valid(...Object.values(Role))
    .required()
    .messages({
      'any.required': 'Please select user role',
      'any.only': 'Account role must be one of [User, Seller]'
    }),
  isCustomAccount: Joi.boolean().required().messages({
    'any.required': 'Create your account by form or any provider'
  }),
  address: Joi.string().allow(''),
  zipCode: Joi.number().allow(),
  bio: Joi.string().allow(''),
  socialLinks: Joi.object({
    facebook: Joi.string().uri().allow(''),
    instagram: Joi.string().uri().allow(''),
    linkedin: Joi.string().uri().allow(''),
    twitter: Joi.string().uri().allow('')
  })
})

export const loginSchema = Joi.object({
  email: Joi.string().email().required().max(200),
  password: Joi.string().required().min(6).max(100)
})

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})

export const verifiedEmailSchema = Joi.object({
  id: Joi.string(),
  email: Joi.string().email()
})

export const resetPasswordSendMailSchema = Joi.object({
  email: Joi.string().email()
})

export const resetPasswordSchema = Joi.object({
  id: Joi.string(),
  email: Joi.string().email(),
  password: Joi.string().required().min(6).max(100)
})
