import { Router } from 'express'
import loginRoute from './auth/login'
import detailsRoute from './product/details'
import listRoute from './product/list'
import searchRoute from './product/search'
import registerRoute from './auth/register'
import categoryRouter from './category'
import createRoutes from './product/create'
import deleteRoutes from './product/delete'
import updateRoute from './product/update'

//-------------------------------------------

//-------------------------------------------
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

// Auth
router.use('/api/auth', registerRoute)
router.use('/api/auth', loginRoute)

// Product
router.use('/api/product', createRoutes)
router.use('/api/product', deleteRoutes)
router.use('/api/product', detailsRoute)
router.use('/api/product', listRoute)
router.use('/api/product', updateRoute)
router.use('/api/product', searchRoute)

//CATEGORY
router.use('/api/category', categoryRouter)

export default router
