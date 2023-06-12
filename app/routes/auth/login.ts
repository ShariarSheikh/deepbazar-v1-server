import express from 'express'
import asyncHandler from 'express-async-handler'

const loginRoute = express.Router()

loginRoute.post(
  '/login',
  asyncHandler((req, res, next) => {
    res.status(200).json('hello')
  })
)

export default loginRoute
