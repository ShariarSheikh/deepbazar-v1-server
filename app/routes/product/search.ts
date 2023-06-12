import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const searchRoutes = Router()

searchRoutes.get('/search', ControllerProduct.list)

export default searchRoutes
