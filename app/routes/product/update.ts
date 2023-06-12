import { Router } from 'express'
import ControllerProduct from '../../controllers/product.controller'

//----------------------------------

//----------------------------------
const updateRoutes = Router()

updateRoutes.get('/update', ControllerProduct.list)

export default updateRoutes
