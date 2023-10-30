import { Router, Request, Response, NextFunction } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import OrderController from '../../controllers/OrderController'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { paramId } from './../profile/schema'
import { Schema } from 'mongoose'
import authenticate from '../../auth/authenticate'
import checkRole from '../../helpers/checkRole'
import { Role } from '../../models/Auth.Model'
import authorization from '../../auth/authorization'
import { OrderCrateSchema } from './schema'
import { OrderStatus } from '../../models/Order.model'

const orderRoute = Router()

//---------------------------------------------
orderRoute.use(authenticate, checkRole(Role.USER), authorization)
//---------------------------------------------

orderRoute.post(
  '/create',
  validator(OrderCrateSchema, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-expect-error
    const user = req.user as IAuth

    const orderData = {
      ...req.body,
      user: user._id,
      status: OrderStatus.Pending,
      imgUrl: req.body.items[0].imgUrl
    }

    const createdOrder = await OrderController.create(orderData)
    response.success(createdOrder)
  })
)

orderRoute.delete(
  '/delete/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const orderId = req.params.id as unknown as Schema.Types.ObjectId

    const deletedOrder = await OrderController.delete(orderId)
    response.success(deletedOrder)
  })
)

// Get an order by ID
orderRoute.get(
  '/get/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const orderId = req.params.id as unknown as Schema.Types.ObjectId

    const order = await OrderController.findOrderById(orderId)
    if (!order?._id) return response.notFound('Order not found')

    return response.success(order)
  })
)

// Get all orders by user ID
orderRoute.get(
  '/get-all-order-user/:id',
  validator(paramId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const userId = req.params.id as unknown as Schema.Types.ObjectId

    const orders = await OrderController.getAllByUserId(userId)
    response.success(orders)
  })
)

export default orderRoute
