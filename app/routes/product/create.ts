import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const createRoutes = Router()

createRoutes.get('/create', ControllerProduct.list)

export default createRoutes
