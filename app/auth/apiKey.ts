/* eslint-disable @typescript-eslint/ban-ts-comment */
import ApiResponse from '../core/ApiResponse'
import { NextFunction, Request, Response, Router } from 'express'
import asyncHandler from '../helpers/asyncHandler'
import validator, { ValidationSource } from '../helpers/validator'
import schema from './schema'
import ApiKeyController from '../controllers/ApiKeyController'
import { serverAccessApiKey } from '../config/variables.config'

const apiKey = Router()

apiKey.use(
  validator(schema.apiKey, ValidationSource.HEADER),
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const response = new ApiResponse(res)
    const apiKeyHeader = req.headers['x-api-key']

    // if not exits token then create one
    const isExits = await ApiKeyController.find()
    if (isExits.length === 0) await ApiKeyController.create(serverAccessApiKey)

    //@ts-ignore
    const apiKey = await ApiKeyController.findByKey(apiKeyHeader)

    if (!apiKey?.key) return response.unauthorized('Please provide a valid api key')
    if (apiKeyHeader !== apiKey?.key) return response.unauthorized('Please provide a valid api key')

    return next()
  })
)

export default apiKey
