import { Router } from 'express'
import loginRoute from './auth/login'
import registerRoute from './auth/register'
import productRoutes from './product'
import profileRoutes from './profile'

//-------------------------------------------

//-------------------------------------------
const router = Router()

router.get('/api', (req, res) => {
  res.status(200).json({ Name: 'Nahid Sheikh' })
})

// Auth
const AUTH_ROOT_PATH = '/api/auth'
router.use(AUTH_ROOT_PATH, registerRoute)
router.use(AUTH_ROOT_PATH, loginRoute)

// Product
const PRODUCTS_ROOT_PATH = '/api/products'
router.use(PRODUCTS_ROOT_PATH, productRoutes.createRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.updateRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.deleteRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.detailsRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.listRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.searchRoutes)

// Profile
const PROFILE_ROOT_PATH = '/api/profile'
router.use(PROFILE_ROOT_PATH, profileRoutes.getProfileRoutes)
router.use(PROFILE_ROOT_PATH, profileRoutes.updateRoutes)

export default router
