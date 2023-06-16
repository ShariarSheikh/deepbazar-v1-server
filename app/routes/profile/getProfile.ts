import { Router } from 'express'
import ControllerProduct from '../../controllers/ProductController'

//----------------------------------

//----------------------------------
const getProfileRoutes = Router()

getProfileRoutes.get('/profile', ControllerProduct.list)

export default getProfileRoutes
