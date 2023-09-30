/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../helpers/asyncHandler'
import ApiResponse from '../core/ApiResponse'
import AuthController from '../controllers/AuthController'
import { checkIsAuthorization } from './utils'

const authorization = Router()

authorization.use(
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    if (!req.user | !req.user.role | !req.accessibleRoles) return response.unauthorized()

    //@ts-expect-error
    const user = await AuthController.findUserWithId(req.user._id)
    if (!user?._id) return response.unauthorized()

    //@ts-expect-error
    const isAuthorized = await checkIsAuthorization({ requiredRoles: req.accessibleRoles, userRoles: user.role })
    if (!isAuthorized) return response.unauthorized('Permission Denied')

    return next()
  })
)

export default authorization
