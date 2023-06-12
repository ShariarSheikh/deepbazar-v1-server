import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const listRoutes = Router()

listRoutes.get('/list', ControllerProduct.list)

export default listRoutes
