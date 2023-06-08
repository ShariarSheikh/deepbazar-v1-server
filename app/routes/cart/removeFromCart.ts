import { Router } from 'express'

const removeFromCartRouter = Router()

removeFromCartRouter.delete('/delete', (req, res) => {
  res.status(200).json({ hello: 'Hello' })
})

export default removeFromCartRouter
