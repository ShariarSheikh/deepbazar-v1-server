import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const createRoutes = Router()

createRoutes.get('/create', ControllerProduct.list)

export default createRoutes
