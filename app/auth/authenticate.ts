import ApiResponse from '../core/ApiResponse'
import { NextFunction, Request, Response, Router } from 'express'
import { verifiedAccessToken } from './utils'
import AuthController from '../controllers/AuthController'
import asyncHandler from '../helpers/asyncHandler'
import validator, { ValidationSource } from '../helpers/validator'
import schema from './schema'

const authenticate = Router()

authenticate.use(
  validator(schema.auth, ValidationSource.HEADER),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)
    const accessTokenHeader = req.headers['authorization']

    const token = accessTokenHeader?.split(' ')[1]
    if (token == null) return response.forbidden('Invalid Token')

    const decoded = verifiedAccessToken(token)
    //@ts-ignore
    if (!decoded?._id) response.forbidden('Invalid Token')

    //@ts-ignore
    const user = await AuthController.findUserWithId(decoded?._id)
    if (!user?.email) return response.forbidden('Invalid Token')

    //@ts-ignore
    req.user = user
    return next()
  })
)

export default authenticate
