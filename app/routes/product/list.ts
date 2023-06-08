import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const listRoutes = Router()

listRoutes.get('/list', ControllerProduct.list)

export default listRoutes
