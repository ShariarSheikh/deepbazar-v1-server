/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'

//----------------------------------

//----------------------------------
const listRoute = Router()

listRoute.get(
  '/list',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    const products = await ProductController.list()
    return response.success({ total: products?.length ?? 0, products })
  })
)

export default listRoute
