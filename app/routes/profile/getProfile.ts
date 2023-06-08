import { Router } from 'express'
import ControllerProduct from '../../controllers/controller.product'

//----------------------------------

//----------------------------------
const getProfileRoutes = Router()

getProfileRoutes.get('/profile', ControllerProduct.list)

export default getProfileRoutes
