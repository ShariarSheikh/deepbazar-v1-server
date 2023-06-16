/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'

//----------------------------------

//----------------------------------
const detailsRoute = Router()

detailsRoute.get(
  '/details/:id',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { id } = req.params

    const product = await ProductController.details(id)
    if (!product?._id) return response.badRequest('Product not exits with this id')

    return response.success({ product })
  })
)

export default detailsRoute
