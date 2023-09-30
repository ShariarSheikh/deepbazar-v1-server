/* eslint-disable @typescript-eslint/ban-ts-comment */
import ApiResponse from '../core/ApiResponse'
import { NextFunction, Request, Response, Router } from 'express'
import { verifiedRefreshToken } from './utils'
import AuthController from '../controllers/AuthController'
import asyncHandler from '../helpers/asyncHandler'
import TokenController from '../controllers/TokenController'
import validator, { ValidationSource } from '../helpers/validator'
import schema from './schema'

const authenticate = Router()

authenticate.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)
    const accessTokenHeader = req.headers['authorization']

    const token = accessTokenHeader?.split(' ')[1]
    if (token == null) return response.unauthorized()

    const decoded = verifiedRefreshToken(token)
    const isExitsToken = await TokenController.findByToken(token)
    if (isExitsToken == null) response.unauthorized()

    //@ts-ignore
    const user = await AuthController.findUserWithId(decoded?._id)
    if (!user?.email) return response.unauthorized()

    //@ts-ignore
    req.user = user
    return next()
  })
)

export default authenticate
