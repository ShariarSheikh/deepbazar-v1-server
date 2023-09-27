import bcrypt from 'bcrypt'
/* eslint-disable @typescript-eslint/ban-ts-comment */
import express, { NextFunction, Request, Response } from 'express'
import asyncHandler from 'express-async-handler'
import _ from 'lodash'
import AuthController from '../../controllers/AuthController'
import ApiResponse from '../../core/ApiResponse'
import createToken from '../../helpers/createToken'

const loginRoute = express.Router()

loginRoute.post(
  '/login',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { email, password } = req.body

    const user = await AuthController.findUserWithEmail(email)
    if (!user?.email) return response.badRequest('User not registered')
    if (!user?.password) return response.badRequest('Credential not set')

    const match = await bcrypt.compare(password, user.password)
    if (!match) return response.badRequest('Authentication failure')

    const accessToken = createToken({ userName: user.firstName, email: user.email })
    const userInfo = _.pick(user, [
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

    return response.success({ user: userInfo, accessToken })
  })
)

export default loginRoute
