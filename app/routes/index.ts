import { Router } from 'express'
import categoryRouter from './category'
import authRoute from './auth'
import apiKey from '../auth/apiKey'
import productRoute from './product'

const router = Router()

router.get('/api/health', (_req, res) => {
  res.status(200).json({
    Author: {
      name: 'Shariar Sheikh',
      Headline: 'Software Engineer',
      picture: 'https://www.linkedin.com/in/sheikhshariar/'
    }
  })
})

//-------------------------------------------
router.use(apiKey)
//-------------------------------------------

// Auth
router.use('/api/auth', authRoute)

//CATEGORY
router.use('/api/category', categoryRouter)

//PRODUCT
router.use('/api/product', productRoute)

export default router
