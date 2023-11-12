import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { categoryQuerySchema, productCreateSchema, productUpdateSchema } from './schema'
import { paramObjId } from '../../routes/profile/schema'
import authenticate from '../../auth/authenticate'
import checkRole from '../../helpers/checkRole'
import { Role } from '../../models/Auth.Model'
import authorization from '../../auth/authorization'
import upload from '../../middleware/multer'
import AuthController from '../../controllers/AuthController'
import { deleteImgFromCloudinary, uploadProductImages } from '../../helpers/cloudinaryUtils'
import updateProfileImageHandler from '../../helpers/updateProductImageHandler'
import CategoryController from '../../controllers/CategoryController'
import ReviewController from '../../controllers/ReviewController'
import { ProductListApiQueryFilter, formatPrice } from './utils'
import QAndAnsController from '../../controllers/QAndAnsController'

const productRoute = Router()

productRoute.get(
  '/list',
  validator(categoryQuerySchema, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const queries = ProductListApiQueryFilter(req.query)
    const { products, productsLength } = await ProductController.listWithQuery(queries)

    const productsData = products.map((product) => ({
      _id: product._id,
      title: product.title,
      imgUrl: product.images[0].cardImg,
      price: product.price,
      discountPrice: product.discountPrice,
      discountPercent: product.discountPercent,
      offerText: product.offerText,
      ratings: product.ratings,
      inStock: product.inStock,
      category: product.category
    }))

    response.success({ exitsLength: productsLength, totals: productsData.length, products: productsData })
  })
)

productRoute.get(
  '/get-sponsor-item',
  validator(categoryQuerySchema, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const item = await ProductController.getSponsorItem()
    const sponsorItem = {
      _id: item[0]._id,
      title: item[0].title,
      imgUrl: item[0].images[0].displayImg,
      price: item[0].price,
      discountPrice: item[0].discountPrice,
      discountPercent: item[0].discountPercent,
      offerText: item[0].offerText,
      ratings: item[0].ratings,
      inStock: item[0].inStock,
      category: item[0].category
    }

    response.success(sponsorItem)
  })
)

productRoute.get(
  '/get-details-by-id/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)
    response.success(product)
  })
)

//---------------------------------------------
productRoute.use(authenticate, checkRole(Role.SELLER), authorization)
//---------------------------------------------

productRoute.get(
  '/seller-product/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)
    if (!product?._id) return response.badRequest('Product not found')

    return response.success(product)
  })
)

productRoute.get(
  '/seller-all-product/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const query = {
      sellerId: req.params.id,
      limit: 10
    }
    //@ts-ignore
    const products = await ProductController.listBySellerId(query)

    const filteredProducts = products.map((product) => {
      return {
        _id: product._id,
        createdAt: product.createdAt,
        title: product.title,
        price: product.price,
        status: product.status,
        imgUrl: product.images.find((img) => img.isDefault === true)?.smallImg
      }
    })

    return response.success(filteredProducts)
  })
)

productRoute.post(
  '/create',
  upload.array('images'),
  validator(productCreateSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = await AuthController.findUserWithId(req.user?._id)
    if (!user?.email) return response.badRequest('User not found')
    if (!req?.files?.length) return response.badRequest('Please upload product image')

    //@ts-ignore
    const images = await uploadProductImages({ files: req.files })
    if (!images?.length) return response.badRequest('Image upload filed')

    req.body.images = images

    req.body.price = formatPrice(req.body.price)
    req.body.discountPrice = formatPrice(req.body.discountPrice)
    req.body.discountPercent = formatPrice(req.body.discountPercent)

    const createdProduct = await ProductController.create(req.body)
    if (!createdProduct._id) return response.badRequest("Product couldn't be created")

    const productCategory = await CategoryController.getByCategoryName(createdProduct.category)
    if (!productCategory?._id) return response.badRequest('Product Category not found')

    productCategory.totalItems++
    productCategory.save()

    return response.success(createdProduct)
  })
)

productRoute.put(
  '/update/:id',
  upload.array('images'),
  validator(paramObjId, ValidationSource.PARAM),
  validator(productUpdateSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)
    if (!product?._id) return response.badRequest('Product not found')
    if (!req.body.imagesLinks?.length && !req.files?.length) return response.badRequest('Please upload image')

    const images = await updateProfileImageHandler({
      //@ts-expect-error
      files: req.files,
      imgInDb: product.images,
      imgInRequest: req.body.imagesLinks
    })

    delete req.body.imagesLinks
    req.body.images = images

    req.body.price = formatPrice(req.body.price)
    req.body.discountPrice = formatPrice(req.body.discountPrice)
    req.body.discountPercent = formatPrice(req.body.discountPercent)

    const updatedProduct = await ProductController.update({ id: product._id, product: req.body })
    return response.success(updatedProduct)
  })
)

productRoute.delete(
  '/delete/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)
    if (!product?._id) return response.badRequest('Product not found')

    const deletedProduct = await ProductController.delete(req.params.id)

    // DELETE
    if (!deletedProduct?._id) return response.badRequest("Product couldn't be deleted")

    deletedProduct?.images.map((imageData) => {
      deleteImgFromCloudinary(imageData.publicId)
    })

    // UPDATE CATEGORY
    const productCategory = await CategoryController.getByCategoryName(deletedProduct.category)
    if (!productCategory?._id) return response.badRequest('Product Category not found')

    productCategory.totalItems--
    productCategory.save()

    // DELETE ALL REVIEWS EXITS ON THIS PRODUCTS
    await ReviewController.deleteAllReviewsByProductId(deletedProduct._id)

    // DELETE FROM QUESTION & ANSWER
    await QAndAnsController.deleteAllQAndAnsByProductId(deletedProduct._id)
    //code

    // DELETE FROM WISHLIST
    //code
    return response.success(deletedProduct)
  })
)

export default productRoute
