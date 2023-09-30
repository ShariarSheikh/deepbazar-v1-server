/* eslint-disable @typescript-eslint/ban-ts-comment */
import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import AuthController from '../../controllers/AuthController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { paramId, loginSchema, updateSchema, updatePasswordSchema } from './schema'
import { createSchema } from './schema'
import asyncHandler from '../../helpers/asyncHandler'
import authenticate from '../../auth/authenticate'
import { createAccessToken, createRefreshToken, makePasswordHash } from '../../auth/utils'
import TokenController from '../../controllers/TokenController'
import ProductController from '../../controllers/ProductController'
import { Role } from '../../models/Auth.Model'

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

    const accessToken = createAccessToken({ _id: user._id, role: user.role })
    const refreshToken = createRefreshToken({ _id: user._id, role: user.role })

    await TokenController.deleteByUserId(user?._id)
    await TokenController.create(refreshToken, user?._id)

    return response.success({
      user: _.pick(user, [
        '_id',
        'firstName',
        'lastName',
        'imgUrl',
        'email',
        'role',
        'isCustomAccount',
        'address',
        'zipCode',
        'bio',
        'socialLinks'
      ]),
      accessToken,
      refreshToken
    })
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

//--------------------------
authRoute.use(authenticate)
//--------------------------

authRoute.delete(
  '/delete/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.user?._id)
    if (!user?.email) return response.badRequest('User not found')

    await AuthController.deleteUser(user._id)
    await TokenController.deleteByUserId(user._id)

    for (const userRole in user.role) {
      if (userRole === Role.SELLER) ProductController.deleteAllProductByUserId(user._id)
    }

    return response.success('Successfully deleted your account')
  })
)

authRoute.patch(
  '/update/:id',
  validator(paramId, ValidationSource.PARAM),
  validator(updateSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.user?._id)
    if (!user?.email) return response.badRequest('User not found')

    await AuthController.findUserWithIdAndUpdate(user._id, req.body)

    return response.success('Successfully updated your profile')
  })
)

authRoute.patch(
  '/update-password/:id',
  validator(paramId, ValidationSource.PARAM),
  validator(updatePasswordSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.user?._id)
    if (!user?.email) return response.badRequest('User not found')

    const match = await bcrypt.compare(req.body.oldPassword, user.password)
    if (!match) return response.badRequest('Your old password is wrong')

    const newPassword = await makePasswordHash(req.body.newPassword)

    //@ts-ignore
    await AuthController.findUserWithIdAndUpdate(user._id, { password: newPassword })

    return response.success('Successfully updated your profile')
  })
)

export default authRoute
