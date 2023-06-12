import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const deleteRoutes = Router()

deleteRoutes.get('/delete', ControllerProduct.list)

export default deleteRoutes
