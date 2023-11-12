import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import { createAccessToken, createRefreshToken, makePasswordHash, verifiedRefreshToken } from '../../auth/utils'
import AuthController from '../../controllers/AuthController'
import TokenController from '../../controllers/TokenController'
import ApiResponse from '../../core/ApiResponse'
import asyncHandler from '../../helpers/asyncHandler'
import validator, { ValidationSource } from '../../helpers/validator'
import {
  createSchema,
  loginSchema,
  refreshTokenSchema,
  resetPasswordSchema,
  resetPasswordSendMailSchema,
  verifiedEmailSchema
} from './schema'
import { sendMailEmailVerification, sendMailForgotPassword } from '../../helpers/emailHandler'
import mongoose from 'mongoose'
import { nodeMailer } from '../../config/variables.config'
import jwt from 'jsonwebtoken'
import _ from 'lodash'

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
    const user = await AuthController.createUser(req.body)
    await sendMailEmailVerification({
      useName: user.firstName,
      receivingEmail: user.email,
      accountId: user._id
    })

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

authRoute.get(
  '/verifiedEmail',
  validator(verifiedEmailSchema, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { email, id } = req.query
    const decoded = jwt.verify(id as string, nodeMailer.emailVerifiedSecretKey)

    //@ts-ignore
    const user = await AuthController.findUserWithId(decoded.accountId as unknown as mongoose.Schema.Types.ObjectId)
    if (!user || user.email !== email) {
      return response.badRequest('Could not be verified')
    }

    user.verified = true
    user.save()

    return response.success({
      user: _.pick(user, [
        '_id',
        'firstName',
        'lastName',
        'imgUrl',
        'email',
        'verified',
        'role',
        'isCustomAccount',
        'address',
        'zipCode',
        'bio',
        'socialLinks'
      ])
    })
  })
)

authRoute.get(
  '/send-reset-password-mail',
  validator(resetPasswordSendMailSchema, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { email } = req.query

    //@ts-ignore
    const user = await AuthController.findUserWithEmail(email as string)
    if (!user?.email) return response.badRequest('User not found')

    await sendMailForgotPassword({ receivingEmail: user.email })
    return response.success('Ok')
  })
)

authRoute.put(
  '/reset-password',
  validator(resetPasswordSchema, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { email, password, id } = req.body

    const decoded = jwt.verify(id, nodeMailer.resetPasswordSecretKey) as { email: string }
    if (!decoded?.email) return response.badRequest('User not found')

    const user = await AuthController.findUserWithEmail(decoded.email as string)
    if (!user?.email || user?.email !== email) return response.badRequest('User not found')

    const newPassword = await makePasswordHash(password)
    //@ts-ignore
    await AuthController.findUserWithIdAndUpdate(user._id, { password: newPassword })
    return response.success('Successfully updated your Password')
  })
)

export default authRoute
