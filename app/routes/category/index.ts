import asyncHandler from 'express-async-handler'
import { NextFunction, Request, Response, Router } from 'express'
import CategoryController from '../../controllers/CategoryController'
import ApiResponse from '../../core/ApiResponse'

const categoryRouter = Router()

categoryRouter.get(
  '/get',
  asyncHandler(async (_req: Request, res: Response, _next: NextFunction) => {
    const categories = await CategoryController.get()
    new ApiResponse(res).success(categories)
  })
)

categoryRouter.post(
  '/create',
  asyncHandler(async (req: Request, res: Response, _next: NextFunction) => {
    const newCategory = await CategoryController.create(req.body)
    new ApiResponse(res).success(newCategory)
  })
)

export default categoryRouter
