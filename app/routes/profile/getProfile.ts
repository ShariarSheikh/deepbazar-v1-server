import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const getProfileRoutes = Router()

getProfileRoutes.get('/profile', ControllerProduct.list)

export default getProfileRoutes
