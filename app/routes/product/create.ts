/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Request, Response, Router } from 'express'
import asyncHandler from 'express-async-handler'
import ProductController from '../../controllers/ProductController'
import ApiResponse from '../../core/ApiResponse'
import validator from '../../helpers/validator'
import { productCreateSchema } from './schema'

//----------------------------------

//----------------------------------
const createRoutes = Router()

createRoutes.post(
  '/create',
  validator(productCreateSchema),
  //@ts-expect-error
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const response = new ApiResponse(res)

    const createProject = await ProductController.create(req.body)
    response.success({ project: createProject })
  })
)

export default createRoutes
