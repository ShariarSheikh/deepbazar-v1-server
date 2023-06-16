import { Router } from 'express'
import ControllerProduct from '../../controllers/ProductController'

//----------------------------------

//----------------------------------
const updateRoutes = Router()

updateRoutes.put('/update', ControllerProduct.list)

export default updateRoutes
