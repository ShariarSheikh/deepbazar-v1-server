/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import AuthController from '../../controllers/AuthController'
import ApiResponse from '../../core/ApiResponse'
import validator from '../../helpers/validator'
import { registerSchema } from './schema'
import asyncHandler from 'helpers/asyncHandler'

const registerRoute = express.Router()

registerRoute.post(
  '/register',
  validator(registerSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    const user = await AuthController.findUserWithEmail(req.body.email)
    if (user?.email) return response.badRequest('User already registered')

    const passwordHash = await bcrypt.hash(req.body.password, 10)
    req.body.password = passwordHash
    const cratedUser = await AuthController.createUser(req.body)

    return response.success({
      user: _.pick(cratedUser, [
        '_id',
        'firstName',
        'lastName',
        'imgUrl',
        'email',
        'userType',
        'isCustomAccount',
        'address',
        'zipCode',
        'bio',
        'socialLinks'
      ])
    })
  })
)

export default registerRoute
