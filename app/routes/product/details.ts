import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const detailsRoutes = Router()

detailsRoutes.get('/details', ControllerProduct.list)

export default detailsRoutes
