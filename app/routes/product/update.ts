import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const updateRoutes = Router()

updateRoutes.get('/update', ControllerProduct.list)

export default updateRoutes
