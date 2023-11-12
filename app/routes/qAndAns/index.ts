import { paramObjId } from './../profile/schema'
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../../helpers/asyncHandler'
import ApiResponse from '../../core/ApiResponse'
import validator, { ValidationSource } from '../../helpers/validator'
import { qAndAnsCreateSchema, qAndAnsUpdateSchema } from './schema' // Define qAndAnsCreateSchema
import authenticate from '../../auth/authenticate'
import { IAuth } from '../../models/Auth.Model'
import QAndAnsController from '../../controllers/QAndAnsController' // Import your QAndAns controller
import { Schema } from 'mongoose'
import ProductController from '../../controllers/ProductController'

const formatReturnListData = (userQAndAns: any[]) => {
  return userQAndAns.map((qA) => {
    return {
      _id: qA._id,
      question: {
        _id: qA.user._id,
        by: `${qA.user.firstName} ${qA.user.lastName}`,
        question: qA.question
      },
      answer: qA.answer,
      product: {
        _id: qA.product._id,
        title: qA.product.title,
        //@ts-ignore
        imgUrl: qA.product.images.filter((defaultImg) => defaultImg.isDefault)[0].cardImg
      }
    }
  })
}

const qAndAnsRoute = Router()

qAndAnsRoute.get(
  '/list-by-productId/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    const qAndAnsList = await QAndAnsController.allQAndAnsByProductId(req.params.id as unknown as Schema.Types.ObjectId)
    const formattedData = formatReturnListData(qAndAnsList)
    response.success({ totals: qAndAnsList.length, data: formattedData })
  })
)

//---------------------------------------------
qAndAnsRoute.use(authenticate)
//---------------------------------------------

qAndAnsRoute.post(
  '/create',
  validator(qAndAnsCreateSchema, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = req.user as IAuth

    // Check if the user has already created a QAndAns for this product
    const isAlreadyQAndAns = await QAndAnsController.findQAndAnsByUserAndProductId(req.body.productId, user._id)
    if (isAlreadyQAndAns?._id) return response.badRequest('You already created a question for this product')

    const qAndAnsData = {
      user: user._id,
      product: req.body.productId,
      question: req.body.question,
      answer: {
        by: '',
        ans: '',
        createdAt: '',
        updatedAt: ''
      }
    }

    //@ts-ignore
    const qAndAns = await QAndAnsController.create(qAndAnsData)
    if (!qAndAns._id) return response.badRequest("QAndAns couldn't be created")

    // UPDATE PRODUCT FOR ADDING A NEW ANS
    const updateProduct = await ProductController.detailsByProductId(qAndAns.product)
    if (updateProduct?._id) {
      updateProduct.totalQuestion = updateProduct.totalQuestion + 1
      updateProduct.save()
    }

    return response.success(qAndAns)
  })
)

qAndAnsRoute.put(
  '/addAns/:id',
  validator(qAndAnsUpdateSchema, ValidationSource.BODY),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)

    //@ts-ignore
    const user = req.user as IAuth

    if (user.role.includes('SELLER')) return response.badRequest('User not allowed to create answer')

    // Check if the user has already created a QAndAns for this product
    const isAlreadyQAndAns = await QAndAnsController.findQAndAnsByUserAndProductId(req.body.productId, user._id)
    if (!isAlreadyQAndAns?._id) return response.badRequest('Question not found')

    isAlreadyQAndAns.answer.by = user._id
    isAlreadyQAndAns.answer.ans = req.body.answer
    isAlreadyQAndAns.answer.createdAt = new Date()
    isAlreadyQAndAns.answer.updatedAt = new Date()
    isAlreadyQAndAns.save()

    return response.success(isAlreadyQAndAns)
  })
)

qAndAnsRoute.get(
  '/get-user-all-qAndAns',
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)
    //@ts-ignore
    const user = req.user as IAuth
    const userQAndAns = await QAndAnsController.getUserAllQAndAns(user._id as unknown as Schema.Types.ObjectId)
    const formattedData = formatReturnListData(userQAndAns)

    response.success({ totals: userQAndAns.length, data: formattedData })
  })
)

qAndAnsRoute.delete(
  '/delete/:id',
  validator(paramObjId, ValidationSource.PARAM),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)
    const qAndAnsId = req.params.id as unknown as Schema.Types.ObjectId

    const qAndAns = await QAndAnsController.findQAndAnsById(qAndAnsId)
    if (!qAndAns?._id) return response.notFound('QAndAns not found')
    const deletedQAndAns = await QAndAnsController.deleteQAndAns(qAndAns?._id)
    if (!deletedQAndAns?._id) return response.badRequest("QAndAns couldn't be deleted")

    // UPDATE PRODUCT FOR ADDING A NEW ANS
    const updateProduct = await ProductController.detailsByProductId(deletedQAndAns.product)
    if (updateProduct?._id) {
      updateProduct.totalQuestion = updateProduct.totalQuestion - 1
      updateProduct.save()
    }

    return response.success(deletedQAndAns)
  })
)

export default qAndAnsRoute
