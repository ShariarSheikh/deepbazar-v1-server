import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import authenticate from '../../auth/authenticate'
import { createAccessToken, createRefreshToken, makePasswordHash, verifiedRefreshToken } from '../../auth/utils'
import AuthController from '../../controllers/AuthController'
import ProductController from '../../controllers/ProductController'
import TokenController from '../../controllers/TokenController'
import ApiResponse from '../../core/ApiResponse'
import asyncHandler from '../../helpers/asyncHandler'
import validator, { ValidationSource } from '../../helpers/validator'
import { Role } from '../../models/Auth.Model'
import { createSchema, loginSchema, paramId, refreshTokenSchema, updatePasswordSchema, updateSchema } from './schema'

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

authRoute.get(
  '/profile',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.user?._id)
    if (!user?.email) return response.badRequest('User not found')

    await AuthController.findUserWithIdAndUpdate(user._id, req.body)

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
      ])
    })
  })
)

export default authRoute
