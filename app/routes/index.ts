import { Router } from 'express'
import categoryRouter from './category'
import authRoute from './auth'
import apiKey from '../auth/apiKey'
import productRoute from './product'
import profileRoute from './profile'
import reviewRoute from './review'
import wishlistRoute from './wishlist'
import shippingAddressRoute from './shippingAddress'
import orderRoute from './order'

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

// Auth
router.use('/api/profile', profileRoute)

//CATEGORY
router.use('/api/category', categoryRouter)

//PRODUCT
router.use('/api/product', productRoute)

//REVIEW
router.use('/api/review', reviewRoute)

//WISHLIST
router.use('/api/wishlist', wishlistRoute)

//WISHLIST
router.use('/api/shippingAddress', shippingAddressRoute)

//WISHLIST
router.use('/api/order', orderRoute)

export default router
