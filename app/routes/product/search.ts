import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const searchRoutes = Router()

searchRoutes.get('/search', ControllerProduct.list)

export default searchRoutes
