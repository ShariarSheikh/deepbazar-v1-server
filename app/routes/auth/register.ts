/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import AuthController from '../../controllers/AuthController'
import ApiResponse from '../../core/ApiResponse'

const registerRoute = express.Router()

registerRoute.post(
  '/register',
  //@ts-expect-error
  asyncHandler(async (res: Response, req: Request, next: NextFunction) => {
    const response = new ApiResponse(res)

    const { name, email, password, profileImageUrl } = req.body

    const user = await AuthController.findUserWithEmail(email)
    if (user?.email) return response.badRequest('User already registered')

    const passwordHash = await bcrypt.hash(password, 10)

    const createdUser = await AuthController.createUser({ name, email, password: passwordHash, profileImageUrl })
    console.log(createdUser)
  })
)

export default registerRoute
