/* eslint-disable @typescript-eslint/ban-ts-comment */
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'

//----------------------------------

//----------------------------------
const searchRoute = Router()

searchRoute.post(
  '/search',
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)
    const { query } = req.body

    const searchedResult = await ProductController.search(query)
    return response.success({ searchedResult }, 'Search Result')
  })
)

export default searchRoute
