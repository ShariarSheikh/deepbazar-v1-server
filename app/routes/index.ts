import { Router } from 'express'
import loginRoute from './auth/login'
import registerRoute from './auth/register'
import createRoutes from './product/create'
import deleteRoutes from './product/delete'
import detailsRoute from './product/details'
import listRoute from './product/list'
import searchRoute from './product/search'
import updateRoute from './product/update'

//-------------------------------------------

//-------------------------------------------
const router = Router()

router.get('/api', (_req, res) => {
  res.status(200).json({ Name: 'Shariar Sheikh' })
})

// Auth
const AUTH_ROOT_PATH = '/api/auth'
router.use(AUTH_ROOT_PATH, registerRoute)
router.use(AUTH_ROOT_PATH, loginRoute)

// Product
const PRODUCTS_ROOT_PATH = '/api/product'
router.use(PRODUCTS_ROOT_PATH, createRoutes)
router.use(PRODUCTS_ROOT_PATH, deleteRoutes)
router.use(PRODUCTS_ROOT_PATH, detailsRoute)
router.use(PRODUCTS_ROOT_PATH, listRoute)
router.use(PRODUCTS_ROOT_PATH, updateRoute)
router.use(PRODUCTS_ROOT_PATH, searchRoute)

// Profile
// const PROFILE_ROOT_PATH = '/api/profile'
// router.use(PROFILE_ROOT_PATH, profileRoutes.getProfileRoutes)
// router.use(PROFILE_ROOT_PATH, profileRoutes.updateRoutes)

export default router
