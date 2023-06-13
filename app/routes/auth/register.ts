/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import _ from 'lodash'
import AuthController from '../../controllers/AuthController'
import ApiResponse from '../../core/ApiResponse'

const registerRoute = express.Router()

registerRoute.post(
  '/register',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const { name, email, password, profileImageUrl } = req.body
    const response = new ApiResponse(res)

    const user = await AuthController.findUserWithEmail(email)
    if (user?.email) return response.badRequest('User already registered')

    const passwordHash = await bcrypt.hash(password, 10)
    const cratedUser = await AuthController.createUser({ name, email, password: passwordHash, profileImageUrl })

    return response.success({ user: _.pick(cratedUser, ['_id', 'name', 'email', 'profileImageUrl']) })
  })
)

export default registerRoute
