import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { reviewCreateSchema } from './schema'
import { paramId } from '../../routes/profile/schema'
import authenticate from '../../auth/authenticate'
import checkRole from '../../helpers/checkRole'
import { IAuth, Role } from '../../models/Auth.Model'
import authorization from '../../auth/authorization'
import ReviewController from '../../controllers/ReviewController'
import { Schema } from 'mongoose'
import { IReview } from '../../models/Review.Model'

const reviewRoute = Router()

reviewRoute.get(
  '/list-by-productId/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const reviews = await ReviewController.allReviewByProductId(req.params.id as unknown as Schema.Types.ObjectId)
    response.success({ totals: reviews.length, reviews })
  })
)

//---------------------------------------------
reviewRoute.use(authenticate, checkRole(Role.USER), authorization)
//---------------------------------------------

reviewRoute.post(
  '/create',
  validator(reviewCreateSchema, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const product = await ProductController.detailsByProductId(req.body.productId)
    if (!product?._id) return response.badRequest('Product not found with this id')

    //@ts-expect-error
    const user = req.user as IAuth

    const isAlreadyReview = await ReviewController.findReviewByUserAndProductId(product._id, user._id)
    if (isAlreadyReview !== null) return response.badRequest('You already review this product')

    const reviewData = {
      user: user._id,
      productId: product._id,
      star: req.body.star,
      ratingLevel: req.body.ratingLevel,
      message: req.body.message
    }

    const review = await ReviewController.create(reviewData as IReview)
    if (!review._id) return response.badRequest("Review couldn't be created")

    const totalReviews = product.ratings.totalReviews + 1
    const averageStar = (product.ratings.star * product.ratings.totalReviews + review.star) / totalReviews

    product.ratings.star = averageStar
    product.ratings.totalReviews = totalReviews
    product.save()
    return response.success(review)
  })
)

reviewRoute.get(
  '/get-user-all-reviews',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const reviews = await ReviewController.getUserAllReviews(user._id as unknown as Schema.Types.ObjectId)
    response.success({ totals: reviews.length, reviews })
  })
)

export default reviewRoute
