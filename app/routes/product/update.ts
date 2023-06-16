/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'

//----------------------------------

//----------------------------------
const updateRoute = Router()

updateRoute.patch(
  '/update/:id',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const productData = req.body
    const productId = req.params.id

    const product = await ProductController.details(productId)
    if (!product?._id) return response.badRequest('Product not exits with this id')

    const updatedProduct = await ProductController.update({ id: productId, product: productData })
    return response.success({ updatedProduct }, 'Product has been updated')
  })
)

export default updateRoute
