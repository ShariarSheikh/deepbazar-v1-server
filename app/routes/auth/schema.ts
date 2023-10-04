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

export const paramId = Joi.object({
  id: JoiObjectId().required()
})

export const updateSchema = Joi.object({
  firstName: Joi.string().min(3).max(50),
  lastName: Joi.string().min(3).max(50),
  email: Joi.string().email().max(200),
  imgUrl: Joi.string().optional().uri().allow(''),
  role: Joi.string()
    .valid(...Object.values(Role))
    .messages({
      'any.required': 'Please select user role',
      'any.only': 'Account role must be one of [User, Seller]'
    }),
  isCustomAccount: Joi.boolean().messages({
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

export const updatePasswordSchema = Joi.object({
  oldPassword: Joi.string().min(6).max(100),
  newPassword: Joi.string().min(6).max(100)
})

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required()
})
