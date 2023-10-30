import bcrypt from 'bcrypt'
import express, { NextFunction, Request, Response } from 'express'
import _ from 'lodash'
import authenticate from '../../auth/authenticate'
import { makePasswordHash } from '../../auth/utils'
import AuthController from '../../controllers/AuthController'
import ProductController from '../../controllers/ProductController'
import TokenController from '../../controllers/TokenController'
import ApiResponse from '../../core/ApiResponse'
import asyncHandler from '../../helpers/asyncHandler'
import validator, { ValidationSource } from '../../helpers/validator'
import { Role } from '../../models/Auth.Model'
import { paramId, updatePasswordSchema, updateSchema } from './schema'
import upload from '../../middleware/multer'
import { deleteImgFromCloudinary, uploadProfileImg } from '../../helpers/cloudinaryUtils'
import ReviewController from '../../controllers/ReviewController'
import WishlistController from '../../controllers/WishlistController'

const profileRoute = express.Router()

profileRoute.get(
  '/get-product-seller/:id',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.params.id)
    if (!user?.email) return response.badRequest('User not found')

    return response.success({
      user: _.pick(user, ['_id', 'firstName', 'lastName', 'imgUrl', 'email', 'address', 'socialLinks'])
    })
  })
)

//--------------------------
profileRoute.use(authenticate)
//--------------------------

profileRoute.delete(
  '/delete/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.params.id)
    if (!user?.email) return response.badRequest('User not found')

    if (user.imgUrl && user.imgPublicId) await deleteImgFromCloudinary(user.imgPublicId)

    await AuthController.deleteUser(user._id)
    await TokenController.deleteByUserId(user._id)

    for (const userRole in user.role) {
      if (userRole === Role.SELLER) await ProductController.deleteAllProductByUserId(user._id)
      else {
        await ReviewController.deleteAllReviewsByUserId(user._id)
        await WishlistController.deleteAllWishlistByUserId(user._id)
      }
    }

    return response.success('Successfully deleted your account')
  })
)

profileRoute.put(
  '/update/:id',
  validator(paramId, ValidationSource.PARAM),
  validator(updateSchema),
  upload.single('imgUrl'),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.params.id)
    if (!user?.email) return response.badRequest('User not found')

    if (req.file?.fieldname) {
      const imgData = await uploadProfileImg({ file: req.file })

      req.body.imgUrl = imgData.imgUrl
      req.body.imgPublicId = imgData.publicId

      //IF USER ALREADY HAVE PROFILE IMG URL THEN DELETE OLD ONE
      if (user.imgUrl && user.imgPublicId) await deleteImgFromCloudinary(user.imgPublicId)
    }

    const updatedUser = await AuthController.findUserWithIdAndUpdate(user._id, req.body)

    return response.success({
      user: _.pick(updatedUser, [
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

profileRoute.put(
  '/update-password/:id',
  validator(paramId, ValidationSource.PARAM),
  validator(updatePasswordSchema),
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.params.id)
    if (!user?.email) return response.badRequest('User not found')

    const match = await bcrypt.compare(req.body.oldPassword, user.password)
    if (!match) return response.badRequest('Your old password is wrong')

    const newPassword = await makePasswordHash(req.body.newPassword)

    //@ts-ignore
    await AuthController.findUserWithIdAndUpdate(user._id, { password: newPassword })
    return response.success('Successfully updated your profile')
  })
)

profileRoute.get(
  '/get',
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

export default profileRoute
