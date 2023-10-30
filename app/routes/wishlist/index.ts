import { paramId } from './../profile/schema'
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import authenticate from '../../auth/authenticate'
import checkRole from '../../helpers/checkRole'
import { IAuth, Role } from '../../models/Auth.Model'
import authorization from '../../auth/authorization'
import { Schema } from 'mongoose'
import WishlistController from '../../controllers/WishlistController'
import { IWishlist } from '../../models/Wishlist.model'

const wishlistRoute = Router()

wishlistRoute.get(
  '/list-by-productId/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const wishlist = await WishlistController.allWishlistByProductId(req.params.id as unknown as Schema.Types.ObjectId)
    response.success({ totals: wishlist.length })
  })
)

//---------------------------------------------
wishlistRoute.use(authenticate, checkRole(Role.USER), authorization)
//---------------------------------------------

wishlistRoute.post(
  '/create/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const product = await ProductController.detailsByProductId(req.params.id as unknown as Schema.Types.ObjectId)
    if (!product?._id) return response.badRequest('Product not found with this id')

    //@ts-expect-error
    const user = req.user as IAuth

    const addedToWishlist = await WishlistController.findWishlistByUserAndProductId(product._id, user._id)
    if (addedToWishlist?._id) return response.badRequest('Wishlist already created')

    const wishlistData = {
      user: user._id,
      product: product._id,
      title: product.title,
      imgUrl: product.images.filter((imgData) => imgData.isDefault)[0].cardImg,
      price: product.price,
      discountPrice: product.discountPrice,
      discountPercent: product.discountPercent
    }

    const wishlist = await WishlistController.create(wishlistData as IWishlist)
    if (!wishlist._id) return response.badRequest("Wishlist couldn't be created")

    return response.success(wishlist)
  })
)

wishlistRoute.delete(
  '/delete/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const productId = req.params.id as unknown as Schema.Types.ObjectId
    const product = await ProductController.detailsByProductId(productId)
    if (!product?._id) return response.badRequest('Product not found with this id')

    //@ts-expect-error
    const user = req.user as IAuth

    const isAddedToWishlist = await WishlistController.findWishlistByUserAndProductId(product._id, user._id)
    if (!isAddedToWishlist?._id) return response.badRequest('Wishlist not added')

    const deletedWishlist = await WishlistController.delete(isAddedToWishlist._id)
    return response.success(deletedWishlist)
  })
)

wishlistRoute.get(
  '/check-wishlist-added-or-not/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const userId = user._id

    const productId = req.params.id as unknown as Schema.Types.ObjectId
    const wishlist = await WishlistController.findWishlistByUserAndProductId(productId, userId)
    if (!wishlist?._id) return response.badRequest('Wishlist not added')
    return response.success('Wishlist added')
  })
)

wishlistRoute.get(
  '/get-user-all-wishlist',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const wishlist = await WishlistController.getUserAllWishlist(user._id as unknown as Schema.Types.ObjectId)
    response.success({ totals: wishlist.length, wishlist })
  })
)
export default wishlistRoute
