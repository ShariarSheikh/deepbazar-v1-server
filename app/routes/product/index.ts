import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { ProductFilterBy, categoryQuerySchema, productCreateSchema, productUpdateSchema } from './schema'
import { paramId } from '../../routes/profile/schema'
import authenticate from '../../auth/authenticate'
import checkRole from '../../helpers/checkRole'
import { Role } from '../../models/Auth.Model'
import authorization from '../../auth/authorization'
import upload from '../../middleware/multer'
import AuthController from '../../controllers/AuthController'
import { deleteImgFromCloudinary, uploadProductImages } from '../../helpers/cloudinaryUtils'

const productRoute = Router()

productRoute.get(
  '/list',
  validator(categoryQuerySchema, ValidationSource.QUERY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const { category, pageLength, limit, startPrice, endPrice, filterBy, productSectionName } = req.query

    //@ts-ignore
    const query = {
      pageLength: 1,
      limit: 10,
      price: { $gte: 1, $lte: 1000000000 }
    }

    //@ts-ignore
    if (category) query.category = category
    if (pageLength) query.pageLength = Number(pageLength)
    if (limit) query.limit = Number(limit)
    //@ts-ignore // if filterBy have MostPopular value then query data which have greater than 2 star rate
    if (filterBy && filterBy === ProductFilterBy.MostPopular) query['ratings.star'] = { $gte: 2 }
    if (startPrice) query.price.$gte = Number(startPrice)
    if (endPrice) query.price.$lte = Number(endPrice)
    //@ts-ignore
    if (productSectionName) query.productSectionName = productSectionName

    const products = await ProductController.listWithQuery(query)

    response.success({ query, totals: products.length, page: query.pageLength, products })
  })
)

//---------------------------------------------
productRoute.use(authenticate, checkRole(Role.SELLER), authorization)
//---------------------------------------------

productRoute.get(
  '/seller-product/:id',
  validator(paramId, ValidationSource.PARAM),
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
  validator(paramId, ValidationSource.PARAM),
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

    const createdProduct = await ProductController.create(req.body)
    return response.success(createdProduct)
  })
)

productRoute.put(
  '/update/:id',
  upload.array('images'),
  validator(paramId, ValidationSource.PARAM),
  validator(productUpdateSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)
    if (!product?._id) return response.badRequest('Product not found')

    if (!req.body.images?.length && !req.files?.length) return response.badRequest('Please upload image')

    if (req.files?.length) {
      //@ts-ignore
      const images = await uploadProductImages({ files: req.files })
      if (!images?.length) return response.badRequest('Image upload filed')

      req.body.images = images
    }
    // if files exits that mean old image links have to delete and new files image have to upload
    else {
      product?.images.map((imageData) => {
        deleteImgFromCloudinary(imageData.publicId)
      })
    }

    const updatedProduct = await ProductController.update({ id: product._id, product: req.body })
    return response.success(updatedProduct)
  })
)

productRoute.delete(
  '/delete/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)
    if (!product?._id) return response.badRequest('Product not found')

    const updatedProduct = await ProductController.delete(req.params.id)

    updatedProduct?.images.map((imageData) => {
      deleteImgFromCloudinary(imageData.publicId)
    })

    // after delete this product then delete the reviews and ans of this product below->

    return response.success(updatedProduct)
  })
)

export default productRoute
