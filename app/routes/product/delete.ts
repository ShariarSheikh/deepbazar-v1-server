import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const deleteRoutes = Router()

deleteRoutes.get('/delete', ControllerProduct.list)

export default deleteRoutes
