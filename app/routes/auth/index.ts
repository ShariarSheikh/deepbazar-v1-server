import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import { createAccessToken, createRefreshToken, makePasswordHash, verifiedRefreshToken } from '../../auth/utils'
import AuthController from '../../controllers/AuthController'
import TokenController from '../../controllers/TokenController'
import ApiResponse from '../../core/ApiResponse'
import asyncHandler from '../../helpers/asyncHandler'
import validator from '../../helpers/validator'
import { createSchema, loginSchema, refreshTokenSchema } from './schema'

const authRoute = express.Router()

authRoute.post(
  '/login',
  validator(loginSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { email, password } = req.body

    const user = await AuthController.findUserWithEmail(email)
    if (!user?.email) return response.badRequest('User not registered')

    const match = await bcrypt.compare(password, user.password)
    if (!match) return response.badRequest('Authentication failure')

    const accessToken = createAccessToken({ _id: user._id, role: user.role, email: user.email })
    const refreshToken = createRefreshToken({ _id: user._id, role: user.role })

    await TokenController.deleteByUserId(user?._id)
    await TokenController.create(refreshToken, user?._id)

    return response.success({ accessToken, refreshToken })
  })
)

authRoute.post(
  '/register',
  validator(createSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    const isUser = await AuthController.findUserWithEmail(req.body.email)
    if (isUser?.email) return response.badRequest('User already registered')

    req.body.password = await makePasswordHash(req.body.password)
    await AuthController.createUser(req.body)

    return response.success()
  })
)

authRoute.post(
  '/refresh-token',
  validator(refreshTokenSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    const decoded = verifiedRefreshToken(req.body.refreshToken)
    //@ts-ignore
    if (!decoded?._id) return response.unauthorized('Refresh Token invalid')

    //@ts-ignore
    const user = await AuthController.findUserWithId(decoded?._id)
    if (!user?.email) return response.unauthorized()

    const accessToken = createAccessToken({ _id: user._id, role: user.role, email: user.email })

    return response.success({ accessToken }, 'Your new access token created')
  })
)

export default authRoute
