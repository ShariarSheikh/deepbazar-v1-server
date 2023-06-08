import { Router } from 'express'
import authRouters from './auth'
import cartRoutes from './cart'
import productRoutes from './product'
import profileRoutes from './profile'

//-------------------------------------------

//-------------------------------------------
const router = Router()

router.get('/', (req, res) => {
  res.status(200).json({ Name: 'Nahid Sheikh' })
})

// Auth
const AUTH_ROOT_PATH = '/auth'
router.use(AUTH_ROOT_PATH, authRouters.registerRouters)
router.use(AUTH_ROOT_PATH, authRouters.loginRouters)
router.use(AUTH_ROOT_PATH, authRouters.logoutRouters)
router.use(AUTH_ROOT_PATH, authRouters.tokenRouters)

// Product
const PRODUCTS_ROOT_PATH = '/products'
router.use(PRODUCTS_ROOT_PATH, productRoutes.createRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.updateRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.deleteRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.detailsRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.listRoutes)
router.use(PRODUCTS_ROOT_PATH, productRoutes.searchRoutes)

// Cart
const CART_ROOT_PATH = '/cart'
router.use(CART_ROOT_PATH, cartRoutes.addToCartRouter)
router.use(CART_ROOT_PATH, cartRoutes.removeFromCartRouter)

// Profile
const PROFILE_ROOT_PATH = '/cart'
router.use(PROFILE_ROOT_PATH, profileRoutes.getProfileRoutes)
router.use(PROFILE_ROOT_PATH, profileRoutes.updateRoutes)

export default router
