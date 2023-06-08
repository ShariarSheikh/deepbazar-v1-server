import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const detailsRoutes = Router()

detailsRoutes.get('/details', ControllerProduct.list)

export default detailsRoutes
