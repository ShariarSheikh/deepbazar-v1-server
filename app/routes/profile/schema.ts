import Joi from 'joi'
import { JoiObjectId, imgFile } from '../../routes/auth/schema'
import { Role } from '../../models/Auth.Model'

export const paramObjId = Joi.object({
  id: JoiObjectId().required()
})

export const paramId = Joi.object({
  id: Joi.string().required()
})

export const updateSchema = Joi.object({
  firstName: Joi.string().min(3).max(50),
  lastName: Joi.string().min(3).max(50),
  email: Joi.string().email().max(200),
  imgUrl: imgFile,
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
