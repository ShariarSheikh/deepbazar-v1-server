/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { ProductFilterBy, categoryQuerySchema, productCreateSchema, productUpdateSchema } from './schema'
import { paramId } from '../../routes/auth/schema'
// import authenticate from '../../auth/authenticate'
// import checkRole from '../../helpers/checkRole'
// import { Role } from '../../models/Auth.Model'
// import authorization from '../../auth/authorization'

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

// productRoute.use(authenticate, checkRole(Role.SELLER), authorization)

productRoute.post(
  '/create',
  validator(productCreateSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)
    const createdProduct = await ProductController.create(req.body)

    response.success(createdProduct)
  })
)

productRoute.patch(
  '/update/:id',
  validator(paramId, ValidationSource.PARAM),
  validator(productUpdateSchema),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    const product = await ProductController.detailsByProductId(req.params.id)

    if (!product?._id) return response.badRequest('Product not found')

    const updatedProduct = await ProductController.update({ id: product._id, product: req.body })

    return response.success(updatedProduct)
  })
)

export default productRoute
