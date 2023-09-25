import { Router } from 'express'
import loginRoute from './auth/login'
import detailsRoute from './product/details'
import listRoute from './product/list'
import searchRoute from './product/search'

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
const AUTH_ROOT_PATH = '/api/auth'
// router.use(AUTH_ROOT_PATH, registerRoute)
router.use(AUTH_ROOT_PATH, loginRoute)

// Product
const PRODUCTS_ROOT_PATH = '/api/product'
// router.use(PRODUCTS_ROOT_PATH, createRoutes)
// router.use(PRODUCTS_ROOT_PATH, deleteRoutes)
router.use(PRODUCTS_ROOT_PATH, detailsRoute)
router.use(PRODUCTS_ROOT_PATH, listRoute)
// router.use(PRODUCTS_ROOT_PATH, updateRoute)
router.use(PRODUCTS_ROOT_PATH, searchRoute)

export default router
