import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const updateRoutes = Router()

updateRoutes.put('/update', ControllerProduct.list)

export default updateRoutes
