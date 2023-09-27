import Joi from 'joi'
import { UserType } from '../../models/Auth.Model'

export const registerSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required(),
  imgUrl: Joi.string(),
  userType: Joi.string()
    .valid(...Object.values(UserType))
    .required(),
  isCustomAccount: Joi.boolean().required(),
  address: Joi.string(),
  zipCode: Joi.string(),
  bio: Joi.string(),
  socialLinks: Joi.object({
    facebook: Joi.string(),
    instagram: Joi.string(),
    linkedin: Joi.string(),
    twitter: Joi.string()
  })
})
