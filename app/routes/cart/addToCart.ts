import { Router } from 'express'

const addToCartRouter = Router()

addToCartRouter.post('/create', (req, res) => {
  res.status(200).json({ hello: 'Hello' })
})

export default addToCartRouter
